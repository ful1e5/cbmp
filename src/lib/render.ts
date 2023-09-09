import fs from "fs";
import path from "path";

import chalk from "chalk";
import ora from "ora";
import { glob } from "glob";

import { PngRenderer } from "../modules/PngRenderer.js";
import { colorSvg, Color } from "./colorSvg.js";

interface Svg {
  basename: string;
  code: string;
}

const getSVGs = async (dir: string): Promise<Svg[]> => {
  const files = await glob(dir + "/**/*.svg");

  const svgs: Svg[] = [];
  files.forEach((fp) => {
    svgs.push({
      basename: path.basename(fp, ".svg"),
      code: fs.readFileSync(fp, "utf-8"),
    });
  });

  return svgs;
};

/**
 * Render the svg files inside {dir} and saved to {out} directory
 * @param {string} dir A path to svg files directory.
 * @param {string} out A path to where png files saved(Created If doens't exits).
 * @param {Options} options
 */
const renderPngs = async (
  dir: string,
  out: string,
  options?: { colors?: Color[]; fps?: number; debug?: boolean },
) => {
  const spinner = ora("Retrieving .svg files").start();
  spinner.spinner = "dots10";
  const svgs = await getSVGs(dir);

  spinner.info(`Output Directory: ${chalk.dim(out)}`);
  if (!fs.existsSync(out)) {
    fs.mkdirSync(out, { recursive: true });
  }
  const mode = options?.debug ? false : "new";
  spinner.info(
    `Puppeteer Running Mode: ${chalk.dim(
      mode == false ? "Debug" : "Headeless",
    )}`,
  );

  const png = new PngRenderer();
  const browser = await png.getBrowser(mode);
  spinner.info(`Puppeteer Client Status: ${chalk.green.bold("Running")}`);

  console.log(`${chalk.magentaBright.bold("::")} Collecting SVG files... `);
  for (let { basename: name, code } of svgs) {
    const subSpinner = spinner.render();
    subSpinner.indent = 2;
    subSpinner.spinner = "bouncingBar";
    const fmt = (s: string) => `${chalk.yellow(name)}: ${chalk.dim(s)}`;

    subSpinner.start(fmt("Substituting colors..."));
    if (options?.colors) {
      code = colorSvg(code, options.colors);
    }

    subSpinner.text = fmt("Extracting PNG frames...");
    const gen = png.render(browser, code, { fps: options?.fps });

    const frames: Buffer[] = [];
    let index = 0;
    while (true) {
      const frame = await gen.next();
      if (frame.done) {
        break;
      }

      frames.push(frame.value);
      subSpinner.text = fmt(`Frame[${index}] captured!`);

      index++;
    }

    const succeed = (msg: string) => {
      subSpinner.succeed(chalk.greenBright(msg));
    };

    if (frames.length == 1) {
      fs.writeFileSync(path.resolve(out, `${name}.png`), frames[0]);
      succeed(`${name}.png`);
    } else {
      const len = frames.length;
      frames.forEach((data, i) => {
        const index = String(i + 1).padStart(String(len).length, "0");
        const file = path.resolve(out, `${name}-${index}.png`);

        subSpinner.text = `Saving [${index}/${len}]`;
        fs.writeFileSync(file, data);
      });
      succeed(`${name}-[1...${len}].png`);
    }
  }

  console.log(
    `${chalk.magentaBright.bold("::")} Collecting SVG files... ${chalk.green(
      "DONE",
    )}`,
  );
  spinner.indent = 0;

  await browser.close();
  spinner.info(`Puppeteer Client Status: ${chalk.dim("Disconnected")}`);
  spinner.succeed("Job Completed");
};

export { renderPngs };
