import path from "path";
import fs from "fs";

import { colorSvg, Colors, PngRenderer } from "./helpers";
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
  const svgs = await getSVGs(args.dir);

  if (!fs.existsSync(args.out)) {
    fs.mkdirSync(args.out, { recursive: true });
  }

  const png = new PngRenderer();
  const browser = await png.getBrowser();

  for (let { name, code } of svgs) {
    console.log(" ==> Saving", name, "...");
    code = colorSvg(code, args.colors);
    const frames = await png.render(browser, code);

    if (frames.length == 1) {
      fs.writeFileSync(path.resolve(args.out, `${name}.png`), frames[0]);
    } else {
      frames.forEach((data, i) => {
        const index = String(i + 1).padStart(String(frames.length).length, "0");
        const file = path.resolve(args.out, `${name}-${index}.png`);
        fs.writeFileSync(file, data);
      });
    }
  }

  await browser.close();
};

export { BuildBitmapsArgs, renderPngs };
