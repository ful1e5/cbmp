/// <reference types="node" resolution-mode="require"/>
import { Browser } from "puppeteer";
declare class PngRenderer {
    private _page;
    private _pageSession;
    private _element;
    private _fps;
    /**
     * Generate Png files from svg code.
     * @param bitmapsDir `absolute` or `relative` path, Where `.png` files will store.
     */
    constructor();
    /**
     * Prepare headless browser.
     */
    getBrowser(headless?: "new" | boolean | undefined): Promise<Browser>;
    private _pauseAnimation;
    private _resumeAnimation;
    private setHTMLCode;
    private _screenshot;
    private _renderFrame;
    render(browser: Browser, htmlCode: string, options?: {
        fps?: number;
    }): AsyncGenerator<Buffer, void, unknown>;
}
export { PngRenderer };
