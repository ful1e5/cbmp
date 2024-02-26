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
export declare const parseConfig: (p: string) => Configs;
