import fs from "fs";
import path from "path";

import { PNG } from "pngjs";
import Pixelmatch from "pixelmatch";
import puppeteer, { Browser, CDPSession, ElementHandle, Page } from "puppeteer";

const matchImages = (img1: Buffer, img2: Buffer): number => {
  const { data: img1Data, width, height } = PNG.sync.read(img1);
  const { data: imgNData } = PNG.sync.read(img2);

  return Pixelmatch(img1Data, imgNData, null, width, height, {
    threshold: 0.1,
  });
};

const frameNumber = (index: number, padding: number) => {
  let result = "" + index;
  while (result.length < padding) {
    result = "0" + result;
  }
  return result;
};

class PngRenderer {
  private _page: Page | null;
  private _svg: ElementHandle<Element> | null;
  private _client: CDPSession | null;

  /**
   * Generate Png files from svg code.
   * @param bitmapsDir `absolute` or `relative` path, Where `.png` files will store.
   */
  constructor(private bitmapsDir: string) {
    this.bitmapsDir = path.resolve(bitmapsDir);
    this.createDir(this.bitmapsDir);
    this._page = null;
    this._svg = null;
    this._client = null;
  }

  /**
   * Create directory if it doesn't exists.
   * @param dirPath directory `absolute` path.
   */
  private createDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Prepare headless browser.
   */
  public async getBrowser(): Promise<Browser> {
    return puppeteer.launch({
      ignoreDefaultArgs: ["--no-sandbox"],
      headless: "new",
    });
  }

  private async _pauseAnimation() {
    await this._client?.send("Animation.setPlaybackRate", {
      playbackRate: 0,
    });
  }

  private async _resumeAnimation() {
    await this._client?.send("Animation.setPlaybackRate", {
      playbackRate: 0.1,
    });
  }

  private async setSVGCode(content: string) {
    this._pauseAnimation();

    await this._page?.setContent(content, {
      timeout: 0,
      waitUntil: "networkidle0",
    });

    const svg = await this._page?.$("svg");

    if (!svg) {
      throw new Error("Unable to set SVG Code in template");
    } else {
      this._svg = svg;
    }
  }

  private async _screenshot(): Promise<Buffer> {
    const buffer = await this._svg?.screenshot({
      encoding: "binary",
      omitBackground: true,
    });

    if (!buffer || typeof buffer == "string") {
      throw new Error("Unable to procced SVG element to Buffer");
    }
    return buffer;
  }

  private async _save(fp: string, buf: Buffer) {
    const out_path = path.resolve(this.bitmapsDir, fp);
    fs.writeFileSync(out_path, buf);
  }

  private async _seekFrame(): Promise<Buffer> {
    await this._resumeAnimation();
    const buf = await this._screenshot();
    await this._pauseAnimation();
    return buf;
  }

  public async generateStatic(browser: Browser, code: string, fname: string) {
    this._page = await browser.newPage();
    await this.setSVGCode(code);

    const out = path.resolve(this.bitmapsDir, `${fname}.png`);

    await this._svg?.screenshot({ omitBackground: true, path: out });
    await this._page.close();
  }

  public async generateAnimated(
    browser: Browser,
    content: string,
    key: string
  ) {
    this._page = await browser.newPage();
    this._client = await this._page.target().createCDPSession();
    await this.setSVGCode(content);

    let i = 1;
    let breakLoop = false;
    let prevBuf: Buffer | null = null;

    // Rendering frames till `imgN` matched to `imgN-1` (When Animation is done)
    while (!breakLoop) {
      const buf = await this._seekFrame();

      const number = frameNumber(i, 4);
      const fp = `${key}-${number}.png`;
      await this._save(fp, buf);

      if (i > 1 && prevBuf) {
        const diff = matchImages(prevBuf, buf);
        if (diff <= 0) {
          breakLoop = !breakLoop;
        }
      }
      prevBuf = buf;
      ++i;
    }
    await this._page.close();
  }
}

export { PngRenderer };
