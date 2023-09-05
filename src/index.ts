import path from "path";
import fs from "fs";

import { SVGHandler, PngRenderer } from "./modules";
import { glob } from "glob";

interface BuildBitmapsArgs {
  dir: string;
  out: string;
  themeName: string;
  colors: SVGHandler.Colors;
}

interface Svg {
  name: string;
  code: string;
}

const getSVGs = async (dir: string): Promise<Svg[]> => {
  const files = await glob(path.resolve(dir) + "/**/*.svg");

  const svgs: Svg[] = [];
  files.forEach((fp) => {
    svgs.push({
      name: path.basename(fp, ".svg"),
      code: fs.readFileSync(fp, "utf-8"),
    });
  });

  return svgs;
};

const makeDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const buildBitmaps = async (args: BuildBitmapsArgs) => {
  console.log("Generating bitmaps for", args.themeName);

  const svgs = await getSVGs(args.dir);

  const outDir = path.resolve(args.out, args.themeName);
  makeDir(outDir);

  const png = new PngRenderer();
  const browser = await png.getBrowser();

  for (let { name, code } of svgs) {
    console.log(" ==> Saving", name, "...");
    code = SVGHandler.colorSvg(code, args.colors);
    const frames = await png.render(browser, code);

    if (frames.length == 1) {
      fs.writeFileSync(path.resolve(outDir, `${name}.png`), frames[0]);
    } else {
      frames.forEach((buf, i) => {
        const index = String(i + 1).padStart(String(frames.length).length, "0");
        const out_path = path.resolve(outDir, `${name}-${index}.png`);
        fs.writeFileSync(out_path, buf);
      });
    }
  }

  await browser.close();
};

export { BuildBitmapsArgs, buildBitmaps };
