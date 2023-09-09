#!/usr/bin/env node

import { LIB_VERSION } from "./version.js";

import path from "path";

import { Command } from "commander";
import chalk from "chalk";

import * as renderer from "./lib//render.js";
import { Color } from "./lib/colorSvg.js";
import { parseConfig } from "./lib/parseConfig.js";
import { warnings, flushWarnings } from "./lib/deprecations.js";

interface ProgramOptions {
  dir: string;
  out: string;
  themeName: string; // Deprecated
  baseColor: string;
  outlineColor: string;
  watchBackgroundColor?: string;
  fps?: number;
  debug?: boolean;
}

const cliApp = async () => {
  const program = new Command();
  let configPath: string | null = null;

  program
    .name("cbmp")
    .version(LIB_VERSION)
    .description("CLI for converting cursor svg files to png.")
    .usage("[Args] [Options] ...")

    .argument("[path]", "Path to JSON configiruation file.")
    .action((path: string) => {
      configPath = path;
    })

    .option(
      "-d, --dir <path>",
      "Specify the directory to search for SVG files.",
    )
    .option(
      "-o, --out <path>",
      "Specify the directory where rasterized PNG files will be saved.",
      "./bitmaps",
    )

    .option(
      "-n, --themeName <string>",
      `Specify the name of sub-directory inside output directory. ${chalk.yellow(
        "(Deprecated: Use the '-o' option to specify the full output path instead.)",
      )}`,
    )

    .option(
      "-bc, --baseColor [string]",
      "Specifies the CSS color for inner part of cursor. (optional)",
    )
    .option(
      "-oc, --outlineColor [string]",
      "Specifies the CSS color for cursor's ouline. (optional)",
    )
    .option(
      "-wc, --watchBackgroundColor [string]",
      "Specifies the CSS color for animation background. (optional)",
    )
    .option(
      "-fps, --fps [number|float]",
      "Specifies the FPS for rendering animated SVGs. (default: 1)",
    )
    .option(
      "--debug",
      "Run Puppeteer in non-headless mode and print additional debugging logs.",
    );

  if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(1);
  }

  program.parse(process.argv);
  const options: ProgramOptions = program.opts();

  // ----------------------  Config Based Rendering
  if (configPath) {
    const configs = parseConfig(configPath);

    for await (const [key, config] of Object.entries(configs)) {
      console.log(`${chalk.blueBright.bold("[+]")} Parsing ${key} Config...`);
      await renderer.renderPngs(config.dir, config.out, {
        colors: config.colors,
        fps: options.fps || config.fps,
        debug: options.debug,
      });
      console.log(
        `${chalk.blueBright.bold(
          "[+]",
        )} Parsing ${key} Config ... ${chalk.green("DONE")}\n`,
      );
    }
  } else {
    // ----------------------  Option Based Rendering
    // Deprecated Options
    if (options.themeName) {
      warnings.push(
        `The option '-n, --themeName <string>' is deprecated. Please use '-o, --out <path>' to specify the output path.`,
      );
    }
    flushWarnings();

    // Rendering Process
    const out = path.resolve(options.out, options.themeName || "");
    const dir = path.resolve(options.dir);
    const colors: Color[] = [
      { match: "#00FF00", replace: options.baseColor },
      { match: "#0000FF", replace: options.outlineColor },
      {
        match: "#FF0000",
        replace: options.watchBackgroundColor ?? options.baseColor,
      },
    ];

    renderer.renderPngs(dir, out, {
      colors,
      fps: options.fps,
      debug: options.debug,
    });
  }
};

cliApp();
