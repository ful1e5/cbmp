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
exports.buildBitmaps = void 0;
var path_1 = __importDefault(require("path"));
var modules_1 = require("../modules");
var buildBitmaps = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var svg, bitmapsDir, png, browser, _i, _a, _b, key, content, _c, _d, _e, key, content;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                console.log("Generating bitmaps for", args.themeName);
                svg = new modules_1.SVGHandler.SvgDirectoryParser(args.dir);
                bitmapsDir = path_1.default.resolve(args.out, args.themeName);
                png = new modules_1.BitmapsGenerator(bitmapsDir);
                return [4 /*yield*/, png.getBrowser()];
            case 1:
                browser = _f.sent();
                _i = 0, _a = svg.getStatic();
                _f.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                _b = _a[_i], key = _b.key, content = _b.content;
                console.log(" ==> Saving", key, "...");
                content = modules_1.SVGHandler.colorSvg(content, args.colors);
                return [4 /*yield*/, png.generateStatic(browser, content, key)];
            case 3:
                _f.sent();
                _f.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                _c = 0, _d = svg.getAnimated();
                _f.label = 6;
            case 6:
                if (!(_c < _d.length)) return [3 /*break*/, 9];
                _e = _d[_c], key = _e.key, content = _e.content;
                console.log(" ==> Saving", key, "...");
                content = modules_1.SVGHandler.colorSvg(content, args.colors);
                return [4 /*yield*/, png.generateAnimated(browser, content, key)];
            case 7:
                _f.sent();
                _f.label = 8;
            case 8:
                _c++;
                return [3 /*break*/, 6];
            case 9: return [4 /*yield*/, browser.close()];
            case 10:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.buildBitmaps = buildBitmaps;
