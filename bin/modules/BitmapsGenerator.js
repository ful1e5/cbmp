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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitmapsGenerator = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var puppeteer_1 = __importDefault(require("puppeteer"));
var frameNumber_1 = require("#root/utils/frameNumber");
var matchImages_1 = require("#root/utils/matchImages");
var toHTML_1 = require("#root/utils/toHTML");
var BitmapsGenerator = /** @class */ (function () {
    /**
     * Generate Png files from svg code.
     * @param bitmapsDir `absolute` or `relative` path, Where `.png` files will store.
     */
    function BitmapsGenerator(bitmapsDir) {
        this.bitmapsDir = bitmapsDir;
        this.bitmapsDir = path_1.default.resolve(bitmapsDir);
        this.createDir(this.bitmapsDir);
    }
    /**
     * Create directory if it doesn't exists.
     * @param dirPath directory `absolute` path.
     */
    BitmapsGenerator.prototype.createDir = function (dirPath) {
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
    };
    /**
     * Prepare headless browser.
     */
    BitmapsGenerator.prototype.getBrowser = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, puppeteer_1.default.launch({
                        ignoreDefaultArgs: ["--no-sandbox"],
                        headless: true,
                    })];
            });
        });
    };
    BitmapsGenerator.prototype.getSvgElement = function (page, content) {
        return __awaiter(this, void 0, void 0, function () {
            var html, svg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!content) {
                            throw new Error("".concat(content, " File Read error"));
                        }
                        html = (0, toHTML_1.toHTML)(content);
                        return [4 /*yield*/, page.setContent(html, { timeout: 0 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.$("#container svg")];
                    case 2:
                        svg = _a.sent();
                        if (!svg) {
                            throw new Error("svg element not found!");
                        }
                        return [2 /*return*/, svg];
                }
            });
        });
    };
    BitmapsGenerator.prototype.generateStatic = function (browser, content, key) {
        return __awaiter(this, void 0, void 0, function () {
            var page, svg, out;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.newPage()];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, this.getSvgElement(page, content)];
                    case 2:
                        svg = _a.sent();
                        out = path_1.default.resolve(this.bitmapsDir, "".concat(key, ".png"));
                        return [4 /*yield*/, svg.screenshot({ omitBackground: true, path: out })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.close()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BitmapsGenerator.prototype.screenshot = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, element.screenshot({
                            encoding: "binary",
                            omitBackground: true,
                        })];
                    case 1:
                        buffer = _a.sent();
                        if (!buffer) {
                            throw new Error("SVG element screenshot not working");
                        }
                        return [2 /*return*/, buffer];
                }
            });
        });
    };
    BitmapsGenerator.prototype.stopAnimation = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.target().createCDPSession()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, client.send("Animation.setPlaybackRate", {
                                playbackRate: 0,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BitmapsGenerator.prototype.resumeAnimation = function (page, playbackRate) {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.target().createCDPSession()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, client.send("Animation.setPlaybackRate", {
                                playbackRate: playbackRate,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BitmapsGenerator.prototype.saveFrameImage = function (key, frame) {
        return __awaiter(this, void 0, void 0, function () {
            var out_path;
            return __generator(this, function (_a) {
                out_path = path_1.default.resolve(this.bitmapsDir, key);
                fs_1.default.writeFileSync(out_path, frame);
                return [2 /*return*/];
            });
        });
    };
    BitmapsGenerator.prototype.generateAnimated = function (browser, content, key, options) {
        return __awaiter(this, void 0, void 0, function () {
            var opt, page, svg, index, breakRendering, prevImg, img, diff, number, frame;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opt = Object.assign({
                            playbackRate: 0.3,
                            diff: 0,
                            frameLimit: 300,
                            framePadding: 4,
                        }, options);
                        return [4 /*yield*/, browser.newPage()];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, this.getSvgElement(page, content)];
                    case 2:
                        svg = _a.sent();
                        return [4 /*yield*/, this.stopAnimation(page)];
                    case 3:
                        _a.sent();
                        index = 1;
                        breakRendering = false;
                        _a.label = 4;
                    case 4:
                        if (!!breakRendering) return [3 /*break*/, 8];
                        if (index > opt.frameLimit) {
                            throw new Error("Reached the frame limit.");
                        }
                        return [4 /*yield*/, this.resumeAnimation(page, opt.playbackRate)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.screenshot(svg)];
                    case 6:
                        img = _a.sent();
                        return [4 /*yield*/, this.stopAnimation(page)];
                    case 7:
                        _a.sent();
                        if (index > 1) {
                            diff = (0, matchImages_1.matchImages)(prevImg, img);
                            if (diff <= opt.diff) {
                                breakRendering = !breakRendering;
                            }
                        }
                        number = (0, frameNumber_1.frameNumber)(index, opt.framePadding);
                        frame = "".concat(key, "-").concat(number, ".png");
                        this.saveFrameImage(frame, img);
                        prevImg = img;
                        ++index;
                        return [3 /*break*/, 4];
                    case 8: return [4 /*yield*/, page.close()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return BitmapsGenerator;
}());
exports.BitmapsGenerator = BitmapsGenerator;
