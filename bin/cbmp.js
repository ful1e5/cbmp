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
import path from "path";
import { Command, Option } from "commander";
import * as renderer from "./render.js";
import { LIB_VERSION } from "./version.js";
import { warnings, flushWarnings } from "./helpers/deprecations.js";
const cliApp = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const program = new Command();
    program
        .name("cbmp")
        .version(LIB_VERSION)
        .usage("[OPTIONS] ...")
        .addOption(new Option("-d, --dir <path>", "Specifies the directory for placement of SVG files."))
        .addOption(new Option("-o, --out <path>", "Specifies the output directory. (default './bitmaps')"))
        .addOption(new Option("-n, --themeName <string>", "Specifies the name of output directory."))
        .addOption(new Option("-bc, --baseColor <hex-string>", "Specifies the Hexadecimal color for inner part of cursor."))
        .addOption(new Option("-oc, --outlineColor <hex-string>", "Specifies the Hexadecimal color for cursor's ouline."))
        .addOption(new Option("-wc, --watchBackgroundColor <hex-string>", "Specifies the Hexadecimal color for animation background."));
    if (!process.argv.slice(2).length) {
        program.outputHelp();
        process.exit(1);
    }
    program.parse(process.argv);
    // ----------------------  Parsing Options
    const options = program.opts();
    // Necessary Options
    if (!options.dir) {
        console.error("ERROR: option '-d, --dir <path>' missing");
        process.exit(1);
    }
    if (!options.out) {
        console.error("ERROR: option '-o, --out <path>' missing");
        process.exit(1);
    }
    // ----------------------  Deprecated Options
    if (options.themeName) {
        warnings.push(`The option '-n, --themeName <string>' is deprecated. Please use '-o, --out <path>' to specify the output path.`);
    }
    flushWarnings();
    // ----------------------  Start Rendering Process
    const out = path.resolve(options.out, options.themeName || "");
    const dir = path.resolve(options.dir);
    const colors = [
        { match: "#00FF00", replace: options.baseColor },
        { match: "#0000FF", replace: options.outlineColor },
        {
            match: "#FF0000",
            replace: (_a = options.watchBackgroundColor) !== null && _a !== void 0 ? _a : options.baseColor,
        },
    ];
    renderer.renderPngs(dir, out, { colors });
});
cliApp();
