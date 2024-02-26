#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { LIB_VERSION } from "./version.js";
import path from "path";
import { Command } from "commander";
import chalk from "chalk";
import * as renderer from "./lib//render.js";
import { parseConfig } from "./lib/parseConfig.js";
import { warnings, flushWarnings } from "./lib/deprecations.js";
const cliApp = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d, _e;
    const program = new Command();
    let configPath = null;
    program
        .name("cbmp")
        .version(LIB_VERSION)
        .description("CLI for converting cursor svg files to png.")
        .usage("[Args] [Options] ...")
        .argument("[path]", "Path to JSON configiruation file.")
        .action((path) => {
        configPath = path;
    })
        .option("-d, --dir <path>", "Specify the directory to search for SVG files.")
        .option("-o, --out <path>", "Specify the directory where rasterized PNG files will be saved.", "./bitmaps")
        .option("--puppeteer", "Use Puppeteer for rendering (requires internet) or default to '@resvg/resvg-js' for SVG rendering.")
        .option("-n, --themeName <string>", `Specify the name of sub-directory inside output directory. ${chalk.yellow("(Deprecated: Use the '-o' option to specify the full output path instead.)")}`)
        .option("-bc, --baseColor [string]", "Specifies the CSS color for inner part of cursor. (optional)")
        .option("-oc, --outlineColor [string]", "Specifies the CSS color for cursor's ouline. (optional)")
        .option("-wc, --watchBackgroundColor [string]", "Specifies the CSS color for animation background. (optional)")
        .option("-fps, --fps [number|float]", "Specifies the FPS for rendering animated SVGs. (default: 1)")
        .option("--debug", "Run Puppeteer in non-headless mode and print additional debugging logs.");
    if (!process.argv.slice(2).length) {
        program.outputHelp();
        process.exit(1);
    }
    program.parse(process.argv);
    const options = program.opts();
    // ----------------------  Config Based Rendering
    if (configPath) {
        const configs = parseConfig(configPath);
        try {
            for (var _f = true, _g = __asyncValues(Object.entries(configs)), _h; _h = yield _g.next(), _a = _h.done, !_a; _f = true) {
                _c = _h.value;
                _f = false;
                const [key, config] = _c;
                console.log(`${chalk.blueBright.bold("[+]")} Parsing ${key} Config...`);
                if (options.puppeteer || ((_d = config.use) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === "puppeteer") {
                    yield renderer.renderPngsWithPuppeteer(config.dir, config.out, {
                        colors: config.colors,
                        fps: options.fps || config.fps,
                        debug: options.debug,
                    });
                }
                else {
                    yield renderer.renderPngs(config.dir, config.out, {
                        colors: config.colors,
                    });
                }
                console.log(`${chalk.blueBright.bold("[+]")} Parsing ${key} Config ... ${chalk.green("DONE")}\n`);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_f && !_a && (_b = _g.return)) yield _b.call(_g);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    else {
        // ----------------------  Option Based Rendering
        // Deprecated Options
        if (options.themeName) {
            warnings.push(`The option '-n, --themeName <string>' is deprecated. Please use '-o, --out <path>' to specify the output path.`);
        }
        flushWarnings();
        // Rendering Process
        const out = path.resolve(options.out, options.themeName || "");
        const dir = path.resolve(options.dir);
        const colors = [
            { match: "#00FF00", replace: options.baseColor },
            { match: "#0000FF", replace: options.outlineColor },
            {
                match: "#FF0000",
                replace: (_e = options.watchBackgroundColor) !== null && _e !== void 0 ? _e : options.baseColor,
            },
        ];
        if (options.puppeteer) {
            renderer.renderPngsWithPuppeteer(dir, out, {
                colors,
                fps: options.fps,
                debug: options.debug,
            });
        }
        else {
            renderer.renderPngs(dir, out, { colors });
        }
    }
});
cliApp();
