#!/usr/bin/env node

import path from "path";

import { Command, Option } from "commander";
import { LIB_VERSION } from "./version";

import * as cbmp from ".";

interface ProgramOptions {
  dir: string;
  out: string;
  themeName: string;
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
        "-bc, --baseColor <hex>",
        "Specifies the Hexadecimal color for inner part of cursor."
      )
    )
    .addOption(
      new Option(
        "-oc, --outlineColor <hex>",
        "Specifies the Hexadecimal color for cursor's ouline."
      )
    )
    .addOption(
      new Option(
        "-wc, --watchBackgroundColor <hex>",
        "Specifies the Hexadecimal color for animation background."
      )
    );

  if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(1);
  }

  program.parse(process.argv);

  // Parsing Options
  const options: ProgramOptions = program.opts();

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
    console.warn(
      "WARNING: The option '-n, --themeName <string>' is deprecated. Please use '-o, --out <path>' to specify the output path."
    );
  }

  const colors = {
    base: options.baseColor,
    outline: options.outlineColor,
    watch: {
      background: options.watchBackgroundColor ?? options.baseColor,
    },
  };
  const bitmapsDir = path.resolve(options.out, options.themeName);

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
};

cliApp();
