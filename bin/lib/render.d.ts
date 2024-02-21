import { Color } from "./colorSvg.js";
/**
 * Render the svg files inside {dir} and saved to {out} directory using Puppeteer.
 * @param {string} dir A path to svg files directory.
 * @param {string} out A path to where png files saved(Created If doens't exits).
 * @param {Options} options
 */
declare const renderPngsWithPuppeteer: (dir: string, out: string, options?: {
    colors?: Color[];
    fps?: number;
    debug?: boolean;
}) => Promise<void>;
/**
 * Render the svg files inside {dir} and saved to {out} directory using resvg-js Nodejs Library.
 * @param {string} dir A path to svg files directory.
 * @param {string} out A path to where png files saved(Created If doens't exits).
 * @param {Options} options
 */
declare const renderPngs: (dir: string, out: string, options?: {
    colors?: Color[];
}) => Promise<void>;
export { renderPngs, renderPngsWithPuppeteer };
