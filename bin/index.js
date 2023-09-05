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
exports.buildBitmaps = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const modules_1 = require("./modules");
const glob_1 = require("glob");
const getSVGs = (dir) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield (0, glob_1.glob)(path_1.default.resolve(dir) + "/**/*.svg");
    const svgs = [];
    files.forEach((fp) => {
        svgs.push({
            name: path_1.default.basename(fp, ".svg"),
            code: fs_1.default.readFileSync(fp, "utf-8"),
        });
    });
    return svgs;
});
const makeDir = (dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
};
const buildBitmaps = (args) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Generating bitmaps for", args.themeName);
    const svgs = yield getSVGs(args.dir);
    const outDir = path_1.default.resolve(args.out, args.themeName);
    makeDir(outDir);
    const png = new modules_1.PngRenderer();
    const browser = yield png.getBrowser();
    for (let { name, code } of svgs) {
        console.log(" ==> Saving", name, "...");
        code = modules_1.SVGHandler.colorSvg(code, args.colors);
        const frames = yield png.render(browser, code);
        if (frames.length == 1) {
            fs_1.default.writeFileSync(path_1.default.resolve(outDir, `${name}.png`), frames[0]);
        }
        else {
            frames.forEach((buf, i) => {
                const index = String(i + 1).padStart(String(frames.length).length, "0");
                const out_path = path_1.default.resolve(outDir, `${name}-${index}.png`);
                fs_1.default.writeFileSync(out_path, buf);
            });
        }
    }
    yield browser.close();
});
exports.buildBitmaps = buildBitmaps;
