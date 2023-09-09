import fs from "fs";
import path from "path";
import { Color } from "./colorSvg.js";

export type Config = {
  dir: string;
  out: string;
  colors?: Color[];
};

export type Configs = {
  [key: string]: Config;
};

export const parseConfig = (p: string): Configs => {
  const file = path.resolve(p);
  const data = JSON.parse(
    fs.readFileSync(file, { encoding: "utf-8", flag: "r" }),
  );
  return data;
};
