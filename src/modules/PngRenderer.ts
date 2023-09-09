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
  private _pageSession: CDPSession | null;
  private _element: ElementHandle<Element> | null;

  /**
   * Generate Png files from svg code.
   * @param bitmapsDir `absolute` or `relative` path, Where `.png` files will store.
   */
  constructor() {
    this._page = null;
    this._element = null;
    this._pageSession = null;
  }

  /**
   * Prepare headless browser.
   */
  public async getBrowser(
    headless: "new" | boolean | undefined = "new",
  ): Promise<Browser> {
    return puppeteer.launch({
      ignoreDefaultArgs: ["--no-sandbox"],
      headless: headless,
    });
  }

  private async _pauseAnimation() {
    await this._pageSession?.send("Animation.setPlaybackRate", {
      playbackRate: 0,
    });
  }

  private async _resumeAnimation() {
    await this._pageSession?.send("Animation.setPlaybackRate", {
      playbackRate: 0.1,
    });
  }

  private async setHTMLCode(content: string) {
    this._pauseAnimation();

    await this._page?.setContent(content, {
      timeout: 0,
      waitUntil: "networkidle0",
    });

    const svg = await this._page?.$("svg");

    if (!svg) {
      throw new Error("Unable to set SVG Code in template");
    } else {
      this._element = svg;
    }
  }

  private async _screenshot(): Promise<Buffer> {
    const buffer = await this._element?.screenshot({
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

  public async *render(browser: Browser, htmlCode: string) {
    this._page = await browser.newPage();
    this._pageSession = await this._page.target().createCDPSession();
    await this.setHTMLCode(htmlCode);

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
