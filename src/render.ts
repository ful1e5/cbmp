import path from "path";
import fs from "fs";

import { colorSvg, Colors, PngRenderer } from "./helpers";
import ora from "ora";
import { glob } from "glob";

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
    spinner.text = "Creating output directory";
    fs.mkdirSync(args.out, { recursive: true });
  }

  spinner.text = "Creating output directory";
  const png = new PngRenderer();

  spinner.text = "Loading Puppeteer Client";
  const browser = await png.getBrowser();
  spinner.succeed("Puppeteer Client: Connected.");

  for (let { name, code } of svgs) {
    const subSpinner = ora("Loading SVG Code");
    subSpinner.spinner = "bouncingBar";
    subSpinner.start();

    const setLoadingText = (s: string) => {
      subSpinner.text = `${name}: ${s}`;
    };

    code = colorSvg(code, args.colors);
    const gen = png.render(browser, code);

    setLoadingText("Extracting PNG Frames");
    const frames: Buffer[] = [];
    let index = 0;
    while (true) {
      const frame = await gen.next();
      if (frame.done) {
        break;
      }

      frames.push(frame.value);
      setLoadingText(`Frame[${index}] Captured!`);

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

        setLoadingText(`Saving [${index}/${len}]`);
        fs.writeFileSync(file, data);
      });
      subSpinner.succeed(`${name}-[1...${len}].png`);
    }
  }

  await browser.close();
};

export { BuildBitmapsArgs, renderPngs };
