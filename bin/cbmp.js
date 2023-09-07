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
import { flushWarnings, warnings } from "./helpers/deprecations.js";
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
        .addOption(new Option("-bc, --baseColor <hex>", "Specifies the Hexadecimal color for inner part of cursor."))
        .addOption(new Option("-oc, --outlineColor <hex>", "Specifies the Hexadecimal color for cursor's ouline."))
        .addOption(new Option("-wc, --watchBackgroundColor <hex>", "Specifies the Hexadecimal color for animation background."));
    if (!process.argv.slice(2).length) {
        program.outputHelp();
        process.exit(1);
    }
    program.parse(process.argv);
    // Parsing Options
    const options = program.opts();
    // Necessary Options
    if (!options.dir) {
        console.error("ERROR: option '-d, --dir <path>' missing");
        process.exit(1);
    }
    if (!options.out) {
        console.log("INFO: setting output directory to './bitmaps'");
        options.out = path.resolve("./bitmaps");
    }
    // Deprecations
    if (options.themeName) {
        warnings.push("The option '-n, --themeName <string>' is deprecated. Please use '-o, --out <path>' to specify the output path.");
    }
    else {
        options.themeName = "";
    }
    flushWarnings();
    const colors = {
        base: options.baseColor,
        outline: options.outlineColor,
        watch: {
            background: (_a = options.watchBackgroundColor) !== null && _a !== void 0 ? _a : options.baseColor,
        },
    };
    const out = path.resolve(options.out, options.themeName);
    const dir = path.resolve(options.dir);
    renderer.renderPngs({
        dir: dir,
        out: out,
        themeName: options.themeName || "",
        colors: colors,
    });
});
cliApp();
