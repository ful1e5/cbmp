import fs from "fs";
import path from "path";
export const parseConfig = (p) => {
    const file = path.resolve(p);
    const configs = JSON.parse(fs.readFileSync(file, { encoding: "utf-8", flag: "r" }));
    const use = configs["use"];
    delete configs["use"];
    if (use.lowerCase() === "puppeteer") {
        return { configs, use: "puppeteer" };
    }
    else {
        return { configs, use: "default" };
    }
};
