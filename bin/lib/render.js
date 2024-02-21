var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
import path from "path";
import { Resvg } from "@resvg/resvg-js";
import chalk from "chalk";
import ora from "ora";
import { glob } from "glob";
import { PngRenderer } from "../modules/PngRenderer.js";
import { colorSvg } from "./colorSvg.js";
const getSVGs = (dir) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield glob(dir + "/**/*.svg");
    const svgs = [];
    files.forEach((fp) => {
        svgs.push({
            basename: path.basename(fp, ".svg"),
            code: fs.readFileSync(fp, "utf-8"),
        });
    });
    return svgs;
});
/**
 * Render the svg files inside {dir} and saved to {out} directory using Puppeteer.
 * @param {string} dir A path to svg files directory.
 * @param {string} out A path to where png files saved(Created If doens't exits).
 * @param {Options} options
 */
const renderPngsWithPuppeteer = (dir, out, options) => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = ora("Retrieving .svg files").start();
    spinner.spinner = "dots10";
    const svgs = yield getSVGs(dir);
    spinner.info(`Output Directory: ${chalk.dim(out)}`);
    if (!fs.existsSync(out)) {
        fs.mkdirSync(out, { recursive: true });
    }
    const mode = (options === null || options === void 0 ? void 0 : options.debug) ? false : "new";
    spinner.info(`Puppeteer Running Mode: ${chalk.dim(mode == false ? "Debug" : "Headeless")}`);
    const png = new PngRenderer();
    const browser = yield png.getBrowser(mode);
    spinner.info(`Puppeteer Client Status: ${chalk.green.bold("Running")}`);
    console.log(`${chalk.magentaBright.bold("::")} Collecting SVG files... `);
    for (let { basename: name, code } of svgs) {
        const subSpinner = spinner.render();
        subSpinner.indent = 2;
        subSpinner.spinner = "bouncingBar";
        const fmt = (s) => `${chalk.yellow(name)}: ${chalk.dim(s)}`;
        subSpinner.start(fmt("Substituting colors..."));
        if (options === null || options === void 0 ? void 0 : options.colors) {
            code = colorSvg(code, options.colors);
        }
        subSpinner.text = fmt("Extracting PNG frames...");
        const gen = png.render(browser, code, { fps: options === null || options === void 0 ? void 0 : options.fps });
        const frames = [];
        let index = 0;
        while (true) {
            const frame = yield gen.next();
            if (frame.done) {
                break;
            }
            frames.push(frame.value);
            subSpinner.text = fmt(`Frame[${index}] captured!`);
            index++;
        }
        const succeed = (msg) => {
            subSpinner.succeed(chalk.greenBright(msg));
        };
        if (frames.length == 1) {
            fs.writeFileSync(path.resolve(out, `${name}.png`), frames[0]);
            succeed(`${name}.png`);
        }
        else {
            const len = frames.length;
            frames.forEach((data, i) => {
                const index = String(i + 1).padStart(String(len).length, "0");
                const file = path.resolve(out, `${name}-${index}.png`);
                subSpinner.text = `Saving [${index}/${len}]`;
                fs.writeFileSync(file, data);
            });
            succeed(`${name}-[1...${len}].png`);
        }
    }
    console.log(`${chalk.magentaBright.bold("::")} Collecting SVG files... ${chalk.green("DONE")}`);
    spinner.indent = 0;
    yield browser.close();
    spinner.info(`Puppeteer Client Status: ${chalk.dim("Disconnected")}`);
    spinner.succeed("Job Completed");
});
/**
 * Render the svg files inside {dir} and saved to {out} directory using resvg-js Nodejs Library.
 * @param {string} dir A path to svg files directory.
 * @param {string} out A path to where png files saved(Created If doens't exits).
 * @param {Options} options
 */
const renderPngs = (dir, out, options) => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = ora("Retrieving .svg files").start();
    spinner.spinner = "dots10";
    const svgs = yield getSVGs(dir);
    spinner.info(`Output Directory: ${chalk.dim(out)}`);
    if (!fs.existsSync(out)) {
        fs.mkdirSync(out, { recursive: true });
    }
    console.log(`${chalk.magentaBright.bold("::")} Collecting SVG files... `);
    for (let { basename: name, code } of svgs) {
        const subSpinner = spinner.render();
        subSpinner.indent = 2;
        subSpinner.spinner = "bouncingBar";
        const fmt = (s) => `${chalk.yellow(name)}: ${chalk.dim(s)}`;
        subSpinner.start(fmt("Substituting colors..."));
        if (options === null || options === void 0 ? void 0 : options.colors) {
            code = colorSvg(code, options.colors);
        }
        subSpinner.text = fmt("Extracting PNG frames...");
        const resvg = new Resvg(code);
        const pngData = resvg.render();
        const pngBuffer = pngData.asPng();
        const succeed = (msg) => {
            subSpinner.succeed(chalk.greenBright(msg));
        };
        fs.writeFileSync(path.resolve(out, `${name}.png`), pngBuffer);
        succeed(`${name}.png`);
    }
    console.log(`${chalk.magentaBright.bold("::")} Collecting SVG files... ${chalk.green("DONE")}`);
    spinner.indent = 0;
    spinner.succeed("Job Completed");
});
export { renderPngs, renderPngsWithPuppeteer };
