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
exports.PngRenderer = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pngjs_1 = require("pngjs");
const pixelmatch_1 = __importDefault(require("pixelmatch"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const matchImages = (img1, img2) => {
    const { data: img1Data, width, height } = pngjs_1.PNG.sync.read(img1);
    const { data: imgNData } = pngjs_1.PNG.sync.read(img2);
    return (0, pixelmatch_1.default)(img1Data, imgNData, null, width, height, {
        threshold: 0.1,
    });
};
const frameNumber = (index, padding) => {
    let result = "" + index;
    while (result.length < padding) {
        result = "0" + result;
    }
    return result;
};
class PngRenderer {
    /**
     * Generate Png files from svg code.
     * @param bitmapsDir `absolute` or `relative` path, Where `.png` files will store.
     */
    constructor(bitmapsDir) {
        this.bitmapsDir = bitmapsDir;
        this.bitmapsDir = path_1.default.resolve(bitmapsDir);
        this.createDir(this.bitmapsDir);
        this._page = null;
        this._svg = null;
        this._client = null;
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
    _pauseAnimation() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this._client) === null || _a === void 0 ? void 0 : _a.send("Animation.setPlaybackRate", {
                playbackRate: 0,
            }));
        });
    }
    _resumeAnimation() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this._client) === null || _a === void 0 ? void 0 : _a.send("Animation.setPlaybackRate", {
                playbackRate: 0.1,
            }));
        });
    }
    setSVGCode(content) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this._pauseAnimation();
            yield ((_a = this._page) === null || _a === void 0 ? void 0 : _a.setContent(content, {
                timeout: 0,
                waitUntil: "networkidle0",
            }));
            const svg = yield ((_b = this._page) === null || _b === void 0 ? void 0 : _b.$("svg"));
            if (!svg) {
                throw new Error("Unable to set SVG Code in template");
            }
            else {
                this._svg = svg;
            }
        });
    }
    _screenshot() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield ((_a = this._svg) === null || _a === void 0 ? void 0 : _a.screenshot({
                encoding: "binary",
                omitBackground: true,
            }));
            if (!buffer || typeof buffer == "string") {
                throw new Error("Unable to procced SVG element to Buffer");
            }
            return buffer;
        });
    }
    _save(fp, buf) {
        return __awaiter(this, void 0, void 0, function* () {
            const out_path = path_1.default.resolve(this.bitmapsDir, fp);
            fs_1.default.writeFileSync(out_path, buf);
        });
    }
    _seekFrame() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._resumeAnimation();
            const buf = yield this._screenshot();
            yield this._pauseAnimation();
            return buf;
        });
    }
    generateStatic(browser, code, fname) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this._page = yield browser.newPage();
            yield this.setSVGCode(code);
            const out = path_1.default.resolve(this.bitmapsDir, `${fname}.png`);
            yield ((_a = this._svg) === null || _a === void 0 ? void 0 : _a.screenshot({ omitBackground: true, path: out }));
            yield this._page.close();
        });
    }
    generateAnimated(browser, content, key) {
        return __awaiter(this, void 0, void 0, function* () {
            this._page = yield browser.newPage();
            this._client = yield this._page.target().createCDPSession();
            yield this.setSVGCode(content);
            let i = 1;
            let breakLoop = false;
            let prevBuf = null;
            // Rendering frames till `imgN` matched to `imgN-1` (When Animation is done)
            while (!breakLoop) {
                const buf = yield this._seekFrame();
                const number = frameNumber(i, 4);
                const fp = `${key}-${number}.png`;
                yield this._save(fp, buf);
                if (i > 1 && prevBuf) {
                    const diff = matchImages(prevBuf, buf);
                    if (diff <= 0) {
                        breakLoop = !breakLoop;
                    }
                }
                prevBuf = buf;
                ++i;
            }
            yield this._page.close();
        });
    }
}
exports.PngRenderer = PngRenderer;
