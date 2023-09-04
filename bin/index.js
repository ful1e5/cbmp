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
const modules_1 = require("./modules");
const buildBitmaps = (args) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Generating bitmaps for", args.themeName);
    const svg = new modules_1.SVGHandler.SvgDirectoryParser(args.dir);
    const bitmapsDir = path_1.default.resolve(args.out, args.themeName);
    const png = new modules_1.PngRenderer(bitmapsDir);
    const browser = yield png.getBrowser();
    for (let { key, content } of svg.getStatic()) {
        console.log(" ==> Saving", key, "...");
        content = modules_1.SVGHandler.colorSvg(content, args.colors);
        yield png.generateStatic(browser, content, key);
    }
    for (let { key, content } of svg.getAnimated()) {
        console.log(" ==> Saving", key, "...");
        content = modules_1.SVGHandler.colorSvg(content, args.colors);
        yield png.generateAnimated(browser, content, key);
    }
    yield browser.close();
});
exports.buildBitmaps = buildBitmaps;
