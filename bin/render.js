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
import chalk from "chalk";
import ora from "ora";
import { glob } from "glob";
import { colorSvg, PngRenderer } from "./helpers/index.js";
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
 * Render the svg files inside {dir} and saved to {out} directory
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
    spinner.info(`Puppeteer Client: ${chalk.green.bold("Running")}`);
    const png = new PngRenderer();
    const browser = yield png.getBrowser();
    console.log(`\n${chalk.magentaBright.bold("::")} Rendering SVG files... `);
    for (let { basename: name, code } of svgs) {
        const subSpinner = spinner.render();
        subSpinner.indent = 2;
        subSpinner.spinner = "bouncingBar";
        const fmt = (s) => `${chalk.yellow(name)}: ${chalk.dim(s)}`;
        subSpinner.start(fmt("Substituting colors..."));
        if (options.colors) {
            code = colorSvg(code, options.colors);
        }
        subSpinner.text = fmt("Extracting PNG frames...");
        const gen = png.render(browser, code);
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
    console.log(`${chalk.magentaBright.bold("::")} Rendering SVG files... ${chalk.green("DONE")}\n`);
    spinner.indent = 0;
    yield browser.close();
    spinner.info(`Puppeteer Client: ${chalk.bold("Disconnected")}`);
    spinner.succeed("Task Completed");
});
export { renderPngs };
