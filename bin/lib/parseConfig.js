import fs from "fs";
import path from "path";
export const parseConfig = (p) => {
    const file = path.resolve(p);
    const data = JSON.parse(fs.readFileSync(file, { encoding: "utf-8", flag: "r" }));
    return data;
};
