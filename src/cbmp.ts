#!/usr/bin/env node

import path from "path";

import { Command, Option } from "commander";

import * as renderer from "./render.js";
import { LIB_VERSION } from "./version.js";
import { warnings, flushWarnings } from "./helpers/deprecations.js";
import { Colors } from "./helpers/colorSvg.js";

interface ProgramOptions {
  dir: string;
  out: string;
  themeName: string; // Deprecated
  baseColor: string;
  outlineColor: string;
  watchBackgroundColor?: string;
}

const cliApp = async () => {
  const program = new Command();

  program
    .name("cbmp")
    .version(LIB_VERSION)
    .usage("[OPTIONS] ...")

    .addOption(
      new Option(
        "-d, --dir <path>",
        "Specifies the directory for placement of SVG files."
      )
    )
    .addOption(
      new Option(
        "-o, --out <path>",
        "Specifies the output directory. (default './bitmaps')"
      )
    )
    .addOption(
      new Option(
        "-n, --themeName <string>",
        "Specifies the name of output directory."
      )
    )

    .addOption(
      new Option(
        "-bc, --baseColor <hex-string>",
        "Specifies the Hexadecimal color for inner part of cursor."
      )
    )
    .addOption(
      new Option(
        "-oc, --outlineColor <hex-string>",
        "Specifies the Hexadecimal color for cursor's ouline."
      )
    )
    .addOption(
      new Option(
        "-wc, --watchBackgroundColor <hex-string>",
        "Specifies the Hexadecimal color for animation background."
      )
    );

  if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(1);
  }

  program.parse(process.argv);

  // ----------------------  Parsing Options
  const options: ProgramOptions = program.opts();

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
    warnings.push(
      `The option '-n, --themeName <string>' is deprecated. Please use '-o, --out <path>' to specify the output path.`
    );
  }
  flushWarnings();

  // ----------------------  Start Rendering Process
  const out = path.resolve(options.out, options.themeName || "");
  const dir = path.resolve(options.dir);
  const colors: Colors[] = [
    { match: "#00FF00", replace: options.baseColor },
    { match: "#0000FF", replace: options.outlineColor },
    {
      match: "#FF0000",
      replace: options.watchBackgroundColor ?? options.baseColor,
    },
  ];

  renderer.renderPngs(dir, out, { colors });
};

cliApp();
