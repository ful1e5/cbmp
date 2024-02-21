import fs from "fs";
import path from "path";
import { Color } from "./colorSvg.js";

export type Config = {
  dir: string;
  out: string;
  fps?: number;
  colors?: Color[];
};

export type Configs = {
  [key: string]: Config;
};

export type ParsedConfig = {
  use: "puppeteer" | "default";
  configs: Configs;
};

export const parseConfig = (p: string): ParsedConfig => {
  const file = path.resolve(p);
  const configs = JSON.parse(
    fs.readFileSync(file, { encoding: "utf-8", flag: "r" }),
  );

  const use = configs["use"];
  delete configs["use"];

  if (use.lowerCase() === "puppeteer") {
    return { configs, use: "puppeteer" };
  } else {
    return { configs, use: "default" };
  }
};
