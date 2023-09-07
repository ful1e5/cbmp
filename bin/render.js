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
import ora from "ora";
import { glob } from "glob";
import { colorSvg, PngRenderer } from "./helpers/index.js";
const getSVGs = (dir) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield glob(dir + "/**/*.svg");
    const svgs = [];
    files.forEach((fp) => {
        svgs.push({
            name: path.basename(fp, ".svg"),
            code: fs.readFileSync(fp, "utf-8"),
        });
    });
    return svgs;
});
const renderPngs = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = ora("Retrieving .svg files").start();
    spinner.spinner = "dots10";
    const svgs = yield getSVGs(args.dir);
    if (!fs.existsSync(args.out)) {
        fs.mkdirSync(args.out, { recursive: true });
        spinner.info("Output Directory: Created");
    }
    const png = new PngRenderer();
    spinner.text = "Loading Puppeteer Client";
    const browser = yield png.getBrowser();
    spinner.info("Puppeteer Client: Running");
    for (let { name, code } of svgs) {
        const subSpinner = spinner.render();
        subSpinner.spinner = "bouncingBar";
        subSpinner.start("Loading SVG Code");
        const fmt = (s) => {
            return `${name}: ${s}`;
        };
        code = colorSvg(code, args.colors);
        const gen = png.render(browser, code);
        subSpinner.text = fmt("Extracting PNG Frames");
        const frames = [];
        let index = 0;
        while (true) {
            const frame = yield gen.next();
            if (frame.done) {
                break;
            }
            frames.push(frame.value);
            subSpinner.text = fmt(`Frame[${index}] Captured!`);
            index++;
        }
        if (frames.length == 1) {
            fs.writeFileSync(path.resolve(args.out, `${name}.png`), frames[0]);
            subSpinner.succeed(`${name}.png`);
        }
        else {
            const len = frames.length;
            frames.forEach((data, i) => {
                const index = String(i + 1).padStart(String(len).length, "0");
                const file = path.resolve(args.out, `${name}-${index}.png`);
                subSpinner.text = `Saving [${index}/${len}]`;
                fs.writeFileSync(file, data);
            });
            subSpinner.succeed(`${name}-[1...${len}].png`);
        }
    }
    yield browser.close();
    spinner.info("Puppeteer Client: Closed");
    spinner.succeed("");
});
export { renderPngs };
