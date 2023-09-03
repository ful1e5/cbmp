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
exports.BitmapsGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const frameNumber_1 = require("../utils/frameNumber");
const matchImages_1 = require("../utils/matchImages");
const toHTML_1 = require("../utils/toHTML");
class BitmapsGenerator {
    /**
     * Generate Png files from svg code.
     * @param bitmapsDir `absolute` or `relative` path, Where `.png` files will store.
     */
    constructor(bitmapsDir) {
        this.bitmapsDir = bitmapsDir;
        this.bitmapsDir = path_1.default.resolve(bitmapsDir);
        this.createDir(this.bitmapsDir);
    }
    /**
     * Create directory if it doesn't exists.
     * @param dirPath directory `absolute` path.
     */
    createDir(dirPath) {
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
    }
    /**
     * Prepare headless browser.
     */
    getBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            return puppeteer_1.default.launch({
                ignoreDefaultArgs: ["--no-sandbox"],
                headless: "new",
            });
        });
    }
    getSvgElement(page, content) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!content) {
                throw new Error(`${content} File Read error`);
            }
            const html = (0, toHTML_1.toHTML)(content);
            yield page.setContent(html, { timeout: 0 });
            const svg = yield page.$("#container svg");
            if (!svg) {
                throw new Error("svg element not found!");
            }
            return svg;
        });
    }
    generateStatic(browser, content, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield browser.newPage();
            const svg = yield this.getSvgElement(page, content);
            const out = path_1.default.resolve(this.bitmapsDir, `${key}.png`);
            yield svg.screenshot({ omitBackground: true, path: out });
            yield page.close();
        });
    }
    screenshot(element) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield element.screenshot({
                encoding: "binary",
                omitBackground: true,
            });
            if (!buffer) {
                throw new Error("SVG element screenshot not working");
            }
            return buffer;
        });
    }
    stopAnimation(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield page.target().createCDPSession();
            yield client.send("Animation.setPlaybackRate", {
                playbackRate: 0,
            });
        });
    }
    resumeAnimation(page, playbackRate) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield page.target().createCDPSession();
            yield client.send("Animation.setPlaybackRate", {
                playbackRate,
            });
        });
    }
    saveFrameImage(key, frame) {
        return __awaiter(this, void 0, void 0, function* () {
            const out_path = path_1.default.resolve(this.bitmapsDir, key);
            fs_1.default.writeFileSync(out_path, frame);
        });
    }
    generateAnimated(browser, content, key, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const opt = Object.assign({
                playbackRate: 0.3,
                diff: 0,
                frameLimit: 300,
                framePadding: 4,
            }, options);
            const page = yield browser.newPage();
            const svg = yield this.getSvgElement(page, content);
            yield this.stopAnimation(page);
            let index = 1;
            let breakRendering = false;
            let prevImg;
            // Rendering frames till `imgN` matched to `imgN-1` (When Animation is done)
            while (!breakRendering) {
                if (index > opt.frameLimit) {
                    throw new Error("Reached the frame limit.");
                }
                yield this.resumeAnimation(page, opt.playbackRate);
                const img = yield this.screenshot(svg);
                yield this.stopAnimation(page);
                if (index > 1) {
                    // @ts-ignore
                    const diff = (0, matchImages_1.matchImages)(prevImg, img);
                    if (diff <= opt.diff) {
                        breakRendering = !breakRendering;
                    }
                }
                const number = (0, frameNumber_1.frameNumber)(index, opt.framePadding);
                const frame = `${key}-${number}.png`;
                this.saveFrameImage(frame, img);
                prevImg = img;
                ++index;
            }
            yield page.close();
        });
    }
}
exports.BitmapsGenerator = BitmapsGenerator;
