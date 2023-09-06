"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPngs = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("./helpers");
const ora_1 = __importDefault(require("ora"));
const glob_1 = require("glob");
const getSVGs = (dir) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield (0, glob_1.glob)(dir + "/**/*.svg");
    const svgs = [];
    files.forEach((fp) => {
        svgs.push({
            name: path_1.default.basename(fp, ".svg"),
            code: fs_1.default.readFileSync(fp, "utf-8"),
        });
    });
    return svgs;
});
const renderPngs = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, ora_1.default)("Retrieving .svg files").start();
    spinner.spinner = "dots10";
    const svgs = yield getSVGs(args.dir);
    if (!fs_1.default.existsSync(args.out)) {
        spinner.text = "Creating output directory";
        fs_1.default.mkdirSync(args.out, { recursive: true });
    }
    spinner.text = "Creating output directory";
    const png = new helpers_1.PngRenderer();
    spinner.text = "Loading Puppeteer Client";
    const browser = yield png.getBrowser();
    spinner.succeed("Puppeteer Client: Connected.");
    for (let { name, code } of svgs) {
        const subSpinner = (0, ora_1.default)("Loading SVG Code");
        subSpinner.spinner = "bouncingBar";
        subSpinner.start();
        const setLoadingText = (s) => {
            subSpinner.text = `${name}: ${s}`;
        };
        code = (0, helpers_1.colorSvg)(code, args.colors);
        const gen = png.render(browser, code);
        setLoadingText("Extracting PNG Frames");
        const frames = [];
        let index = 0;
        while (true) {
            const frame = yield gen.next();
            if (frame.done) {
                break;
            }
            frames.push(frame.value);
            setLoadingText(`Frame[${index}] Captured!`);
            index++;
        }
        if (frames.length == 1) {
            fs_1.default.writeFileSync(path_1.default.resolve(args.out, `${name}.png`), frames[0]);
            subSpinner.succeed(`${name}.png`);
        }
        else {
            const len = frames.length;
            frames.forEach((data, i) => {
                const index = String(i + 1).padStart(String(len).length, "0");
                const file = path_1.default.resolve(args.out, `${name}-${index}.png`);
                setLoadingText(`Saving [${index}/${len}]`);
                fs_1.default.writeFileSync(file, data);
            });
            subSpinner.succeed(`${name}-[1...${len}].png`);
        }
    }
    yield browser.close();
});
exports.renderPngs = renderPngs;
