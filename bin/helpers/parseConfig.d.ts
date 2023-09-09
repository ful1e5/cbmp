import { Color } from "./colorSvg.js";
export type Config = {
    dir: string;
    out: string;
    colors?: Color[];
};
export type Configs = {
    [key: string]: Config;
};
export declare const parseConfig: (p: string) => Configs;
