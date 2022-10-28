#!/usr/bin/env node
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
var path_1 = __importDefault(require("path"));
var commander_1 = require("commander");
var modules_1 = require("./modules");
var exitWithError_1 = require("./utils/exitWithError");
var cliApp = function () { return __awaiter(void 0, void 0, void 0, function () {
    var program, options, colors, bitmapsDir;
    var _a;
    return __generator(this, function (_b) {
        program = new commander_1.Command();
        program
            .name("cbmp")
            .version("1.0.0")
            .usage("[OPTIONS]...")
            .addOption(new commander_1.Option("-d, --dir <path>", "Specifies the directory for placement of SVG files."))
            .addOption(new commander_1.Option("-o, --out <path>", "Specifies the output directory. (default './bitmaps')"))
            .addOption(new commander_1.Option("-n, --themeName <string>", "Specifies the name of output directory."))
            .addOption(new commander_1.Option("-bc, --baseColor <hex>", "Specifies the Hexadecimal color for inner part of cursor."))
            .addOption(new commander_1.Option("-oc, --outlineColor <hex>", "Specifies the Hexadecimal color for cursor's ouline."))
            .addOption(new commander_1.Option("-wc, --watchBackgroundColor <hex>", "Specifies the Hexadecimal color for animation background."));
        if (!process.argv.slice(2).length) {
            program.outputHelp();
            process.exit(1);
        }
        // Parsing arguments
        program.parse(process.argv);
        options = program.opts();
        if (!options.dir) {
            (0, exitWithError_1.exitWithError)(" error: option '-d, --dir <path>' missing");
        }
        if (!options.out) {
            console.log(" info: setting output directory to './bitmaps'");
            options.out = path_1.default.resolve("./bitmaps");
        }
        if (!options.themeName) {
            (0, exitWithError_1.exitWithError)(" error: option '-n, --themeName <string>' missing");
        }
        if (!options.baseColor) {
            options.baseColor = "#00FF00";
        }
        if (!options.outlineColor) {
            options.baseColor = "#0000FF";
        }
        colors = {
            base: options.baseColor,
            outline: options.outlineColor,
            watch: {
                background: (_a = options.watchBackgroundColor) !== null && _a !== void 0 ? _a : options.baseColor,
            },
        };
        bitmapsDir = path_1.default.resolve(options.out, options.themeName);
        // Logging arguments
        console.log("---");
        console.log("SVG directory: '".concat(options.dir, "'"));
        console.log("Output directory: '".concat(bitmapsDir, "'"));
        console.log("Base color: '".concat(colors.base, "'"));
        console.log("Outline color: '".concat(colors.outline, "'"));
        console.log("Watch Background color: '".concat(colors.watch.background, "'"));
        console.log("---\n");
        modules_1.builder.buildBitmaps({
            dir: options.dir,
            out: options.out,
            themeName: options.themeName,
            colors: colors,
        });
        return [2 /*return*/];
    });
}); };
cliApp();
