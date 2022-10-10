"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvgDirectoryParser = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var SvgDirectoryParser = /** @class */ (function () {
    function SvgDirectoryParser(svgDir) {
        this.svgDir = svgDir;
        /**
         * Manage and Parse SVG file path in `absolute` fashion.
         * This Parser look svg files as below fashion:
         * `
         *  <@svgDir>/static
         *  <@svgDir>/animated
         * `
         * @param svgDir is relative/absolute path, Where `SVG` files are stored.
         */
        this.semiAnimated = false;
        if (!fs_1.default.existsSync(this.svgDir)) {
            throw new Error("SVG files not found in ".concat(this.svgDir));
        }
    }
    SvgDirectoryParser.prototype.readData = function (f) {
        var content = fs_1.default.readFileSync(f, "utf-8");
        var key = path_1.default.basename(f, ".svg");
        return { content: content, key: key };
    };
    /**
     * Return absolute paths array of SVG files data located inside '@svgDir/static'
     */
    SvgDirectoryParser.prototype.getStatic = function () {
        var _this = this;
        var staticDir = path_1.default.resolve(this.svgDir, "static");
        if (!fs_1.default.existsSync(staticDir)) {
            console.log("".concat(this.svgDir, " contains semi-animated .svg files"));
            this.semiAnimated = true;
            return [];
        }
        else {
            var svgs = fs_1.default
                .readdirSync(staticDir)
                .map(function (f) { return _this.readData(path_1.default.resolve(staticDir, f)); });
            if (svgs.length == 0) {
                throw new Error("Static Cursors directory is empty");
            }
            return svgs;
        }
    };
    /**
     * Return absolute paths array of SVG files data located inside '@svgDir/animated'
     */
    SvgDirectoryParser.prototype.getAnimated = function () {
        var _this = this;
        var animatedDir = path_1.default.resolve(this.svgDir, "animated");
        if (!fs_1.default.existsSync(animatedDir)) {
            throw new Error("Animated Cursors directory not found");
        }
        var svgs = fs_1.default
            .readdirSync(animatedDir)
            .map(function (f) { return _this.readData(path_1.default.resolve(animatedDir, f)); });
        if (svgs.length == 0 && this.semiAnimated) {
            throw new Error("Can't parse svg directory ".concat(this.svgDir, " as semi-animated theme"));
        }
        return svgs;
    };
    return SvgDirectoryParser;
}());
exports.SvgDirectoryParser = SvgDirectoryParser;
