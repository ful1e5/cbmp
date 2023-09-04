import { Browser } from "puppeteer";
declare class PngRenderer {
    private bitmapsDir;
    private _page;
    private _svg;
    private _client;
    /**
     * Generate Png files from svg code.
     * @param bitmapsDir `absolute` or `relative` path, Where `.png` files will store.
     */
    constructor(bitmapsDir: string);
    /**
     * Create directory if it doesn't exists.
     * @param dirPath directory `absolute` path.
     */
    private createDir;
    /**
     * Prepare headless browser.
     */
    getBrowser(): Promise<Browser>;
    private _pauseAnimation;
    private _resumeAnimation;
    private setSVGCode;
    private _screenshot;
    private _save;
    private _seekFrame;
    generateStatic(browser: Browser, code: string, fname: string): Promise<void>;
    generateAnimated(browser: Browser, content: string, key: string): Promise<void>;
}
export { PngRenderer };
