import fs from "fs";
import path from "path";

import ora from "ora";
import { glob } from "glob";

import { colorSvg, Colors, PngRenderer } from "./helpers/index.js";

interface BuildBitmapsArgs {
  dir: string;
  out: string;
  themeName: string;
  colors: Colors;
}

interface Svg {
  name: string;
  code: string;
}

const getSVGs = async (dir: string): Promise<Svg[]> => {
  const files = await glob(dir + "/**/*.svg");

  const svgs: Svg[] = [];
  files.forEach((fp) => {
    svgs.push({
      name: path.basename(fp, ".svg"),
      code: fs.readFileSync(fp, "utf-8"),
    });
  });

  return svgs;
};

const renderPngs = async (args: BuildBitmapsArgs) => {
  const spinner = ora("Retrieving .svg files").start();
  spinner.spinner = "dots10";
  const svgs = await getSVGs(args.dir);

  if (!fs.existsSync(args.out)) {
    fs.mkdirSync(args.out, { recursive: true });
    spinner.info("Output Directory: Created");
  }

  const png = new PngRenderer();

  spinner.text = "Loading Puppeteer Client";
  const browser = await png.getBrowser();

  spinner.info("Puppeteer Client: Running");
  for (let { name, code } of svgs) {
    const subSpinner = spinner.render();
    subSpinner.spinner = "bouncingBar";
    subSpinner.start("Loading SVG Code");

    const fmt = (s: string) => {
      return `${name}: ${s}`;
    };

    code = colorSvg(code, args.colors);
    const gen = png.render(browser, code);

    subSpinner.text = fmt("Extracting PNG Frames");
    const frames: Buffer[] = [];
    let index = 0;
    while (true) {
      const frame = await gen.next();
      if (frame.done) {
        break;
      }

      frames.push(frame.value);
      subSpinner.text = fmt(`Frame[${index}] Captured!`);

      index++;
    }

    if (frames.length == 1) {
      fs.writeFileSync(path.resolve(args.out, `${name}.png`), frames[0]);
      subSpinner.succeed(`${name}.png`);
    } else {
      const len = frames.length;
      frames.forEach((data, i) => {
        const index = String(i + 1).padStart(String(len).length, "0");
        const file = path.resolve(args.out, `${name}-${index}.png`);

        subSpinner.text = `Saving [${index}/${len}]`;
        fs.writeFileSync(file, data);
      });
      subSpinner.succeed(`${name}-[1...${len}].png`);
    }
  }

  await browser.close();
  spinner.info("Puppeteer Client: Closed");
  spinner.succeed("");
};

export { BuildBitmapsArgs, renderPngs };
