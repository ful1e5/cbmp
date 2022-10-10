import { Browser } from "puppeteer";
declare class BitmapsGenerator {
    private bitmapsDir;
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
    private getSvgElement;
    generateStatic(browser: Browser, content: string, key: string): Promise<void>;
    private screenshot;
    private stopAnimation;
    private resumeAnimation;
    private saveFrameImage;
    generateAnimated(browser: Browser, content: string, key: string, options?: {
        playbackRate?: number;
        diff?: number;
        frameLimit?: number;
        framePadding?: number;
    }): Promise<void>;
}
export { BitmapsGenerator };
