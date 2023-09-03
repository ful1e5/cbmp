"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvgDirectoryParser = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class SvgDirectoryParser {
    constructor(svgDir) {
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
            throw new Error(`SVG files not found in ${this.svgDir}`);
        }
    }
    readData(f) {
        const content = fs_1.default.readFileSync(f, "utf-8");
        const key = path_1.default.basename(f, ".svg");
        return { content, key };
    }
    /**
     * Return absolute paths array of SVG files data located inside '@svgDir/static'
     */
    getStatic() {
        const staticDir = path_1.default.resolve(this.svgDir, "static");
        if (!fs_1.default.existsSync(staticDir)) {
            console.log(`${this.svgDir} contains semi-animated .svg files`);
            this.semiAnimated = true;
            return [];
        }
        else {
            const svgs = fs_1.default
                .readdirSync(staticDir)
                .map((f) => this.readData(path_1.default.resolve(staticDir, f)));
            if (svgs.length == 0) {
                throw new Error("Static Cursors directory is empty");
            }
            return svgs;
        }
    }
    /**
     * Return absolute paths array of SVG files data located inside '@svgDir/animated'
     */
    getAnimated() {
        const animatedDir = path_1.default.resolve(this.svgDir, "animated");
        if (!fs_1.default.existsSync(animatedDir)) {
            throw new Error("Animated Cursors directory not found");
        }
        const svgs = fs_1.default
            .readdirSync(animatedDir)
            .map((f) => this.readData(path_1.default.resolve(animatedDir, f)));
        if (svgs.length == 0 && this.semiAnimated) {
            throw new Error(`Can't parse svg directory ${this.svgDir} as semi-animated theme`);
        }
        return svgs;
    }
}
exports.SvgDirectoryParser = SvgDirectoryParser;
