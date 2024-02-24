var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import pixelMatch from "pixelmatch";
import puppeteer from "puppeteer";
import { PNG } from "pngjs";
const matchImages = (img1, img2) => {
    const { data: img1Buf, width, height } = PNG.sync.read(img1);
    const { data: img2Buf } = PNG.sync.read(img2);
    return pixelMatch(img1Buf, img2Buf, null, width, height, {
        threshold: 0.001,
    });
};
class PngRenderer {
    /**
     * Generate Png files from svg code.
     * @param bitmapsDir `absolute` or `relative` path, Where `.png` files will store.
     */
    constructor() {
        this._page = null;
        this._element = null;
        this._pageSession = null;
        this._fps = 1;
    }
    /**
     * Prepare headless browser.
     */
    getBrowser(headless = "new") {
        return __awaiter(this, void 0, void 0, function* () {
            return puppeteer.launch({
                ignoreDefaultArgs: ["--no-sandbox"],
                headless: headless,
            });
        });
    }
    _pauseAnimation() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this._pageSession) === null || _a === void 0 ? void 0 : _a.send("Animation.setPlaybackRate", {
                playbackRate: 0,
            }));
        });
    }
    _resumeAnimation() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const playbackRate = 1 / this._fps;
            yield ((_a = this._pageSession) === null || _a === void 0 ? void 0 : _a.send("Animation.setPlaybackRate", {
                playbackRate,
            }));
        });
    }
    setHTMLCode(content) {
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
                this._element = svg;
            }
        });
    }
    _screenshot() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield ((_a = this._element) === null || _a === void 0 ? void 0 : _a.screenshot({
                encoding: "binary",
                omitBackground: true,
            }));
            if (!buffer || typeof buffer == "string") {
                throw new Error("Unable to procced SVG element to Buffer");
            }
            return buffer;
        });
    }
    _renderFrame() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._resumeAnimation();
            const buf = yield this._screenshot();
            yield this._pauseAnimation();
            return buf;
        });
    }
    render(browser, htmlCode, options) {
        return __asyncGenerator(this, arguments, function* render_1() {
            this._page = yield __await(browser.newPage());
            this._pageSession = yield __await(this._page.target().createCDPSession());
            this._fps = (options === null || options === void 0 ? void 0 : options.fps) || 1;
            yield __await(this.setHTMLCode(htmlCode));
            let prevBuf = null;
            let i = 0;
            let step = this._fps;
            // Rendering frames till `imgN` matched to `imgN-1` (When Animation is done)
            while (true) {
                const buf = yield __await(this._renderFrame());
                if (i >= 1 && prevBuf) {
                    const diff = matchImages(prevBuf, buf);
                    if (diff <= 0 && (i == 1 || i >= step)) {
                        break;
                    }
                }
                if (i == step) {
                    step = Number(this._fps) + Number(step);
                }
                yield yield __await(buf);
                prevBuf = buf;
                ++i;
            }
            yield __await(this._page.close());
        });
    }
}
export { PngRenderer };
