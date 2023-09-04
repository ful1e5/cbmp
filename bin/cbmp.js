#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const cbmp = __importStar(require("."));
const cliApp = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const program = new commander_1.Command();
    program
        .name("cbmp")
        .version("1.0.0")
        .usage("[OPTIONS] ...")
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
    const options = program.opts();
    if (!options.dir) {
        console.error(" error: option '-d, --dir <path>' missing");
        process.exit(1);
    }
    if (!options.out) {
        console.log(" info: setting output directory to './bitmaps'");
        options.out = path_1.default.resolve("./bitmaps");
    }
    if (!options.themeName) {
        console.error(" error: option '-n, --themeName <string>' missing");
        process.exit(1);
    }
    const colors = {
        base: options.baseColor,
        outline: options.outlineColor,
        watch: {
            background: (_a = options.watchBackgroundColor) !== null && _a !== void 0 ? _a : options.baseColor,
        },
    };
    const bitmapsDir = path_1.default.resolve(options.out, options.themeName);
    // Logging arguments
    console.log("---");
    console.log(`SVG directory: '${options.dir}'`);
    console.log(`Output directory: '${bitmapsDir}'`);
    console.log(`Base color: ${colors.base}`);
    console.log(`Outline color: ${colors.outline}`);
    console.log(`Watch Background color: ${colors.watch.background}`);
    console.log("---\n");
    cbmp.buildBitmaps({
        dir: options.dir,
        out: options.out,
        themeName: options.themeName,
        colors: colors,
    });
});
cliApp();
