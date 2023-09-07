import pixelMatch from "pixelmatch";
import puppeteer, { Browser, CDPSession, ElementHandle, Page } from "puppeteer";
import { PNG } from "pngjs";

const matchImages = (img1: Buffer, img2: Buffer): number => {
  const { data: img1Buf, width, height } = PNG.sync.read(img1);
  const { data: img2Buf } = PNG.sync.read(img2);

  return pixelMatch(img1Buf, img2Buf, null, width, height, {
    threshold: 0.001,
  });
};

class PngRenderer {
  private _page: Page | null;
  private _svg: ElementHandle<Element> | null;
  private _client: CDPSession | null;

  /**
   * Generate Png files from svg code.
   * @param bitmapsDir `absolute` or `relative` path, Where `.png` files will store.
   */
  constructor() {
    this._page = null;
    this._svg = null;
    this._client = null;
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

  private async _renderFrame(): Promise<Buffer> {
    await this._resumeAnimation();
    const buf = await this._screenshot();
    await this._pauseAnimation();
    return buf;
  }

  public async *render(browser: Browser, content: string) {
    this._page = await browser.newPage();
    this._client = await this._page.target().createCDPSession();
    await this.setSVGCode(content);

    let prevBuf: Buffer | null = null;

    let i = 0;

    // Rendering frames till `imgN` matched to `imgN-1` (When Animation is done)
    while (true) {
      const buf = await this._renderFrame();

      if (i >= 1 && prevBuf) {
        const diff = matchImages(prevBuf, buf);
        if (diff <= 0) {
          break;
        }
      }

      yield buf;
      prevBuf = buf;
      ++i;
    }

    await this._page.close();
  }
}

export { PngRenderer };
