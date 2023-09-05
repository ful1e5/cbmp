/// <reference types="node" />
import { Browser } from "puppeteer";
declare class PngRenderer {
    private _page;
    private _svg;
    private _client;
    /**
     * Generate Png files from svg code.
     * @param bitmapsDir `absolute` or `relative` path, Where `.png` files will store.
     */
    constructor();
    /**
     * Prepare headless browser.
     */
    getBrowser(): Promise<Browser>;
    private _pauseAnimation;
    private _resumeAnimation;
    private setSVGCode;
    private _screenshot;
    private _renderFrame;
    render(browser: Browser, content: string): AsyncGenerator<Buffer, void, unknown>;
}
export { PngRenderer };
