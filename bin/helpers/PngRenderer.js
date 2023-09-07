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
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
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
        this._svg = null;
        this._client = null;
    }
    /**
     * Prepare headless browser.
     */
    getBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            return puppeteer.launch({
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
    _renderFrame() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._resumeAnimation();
            const buf = yield this._screenshot();
            yield this._pauseAnimation();
            return buf;
        });
    }
    render(browser, content) {
        return __asyncGenerator(this, arguments, function* render_1() {
            this._page = yield __await(browser.newPage());
            this._client = yield __await(this._page.target().createCDPSession());
            yield __await(this.setSVGCode(content));
            let prevBuf = null;
            let i = 0;
            // Rendering frames till `imgN` matched to `imgN-1` (When Animation is done)
            while (true) {
                const buf = yield __await(this._renderFrame());
                if (i >= 1 && prevBuf) {
                    const diff = matchImages(prevBuf, buf);
                    if (diff <= 0) {
                        break;
                    }
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
