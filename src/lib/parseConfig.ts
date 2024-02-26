import fs from "fs";
import path from "path";
import { Color } from "./colorSvg.js";

export type Config = {
  use?: "puppeteer" | "default";
  colors?: Color[];
  dir: string;
  fps?: number;
  out: string;
};

export type Configs = {
  [key: string]: Config;
};

export const parseConfig = (p: string): Configs => {
  const file = path.resolve(p);
  const configs = JSON.parse(
    fs.readFileSync(file, { encoding: "utf-8", flag: "r" }),
  );

  return configs;
};
