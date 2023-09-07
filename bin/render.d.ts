import { Colors } from "./helpers/index.js";
interface BuildBitmapsArgs {
    dir: string;
    out: string;
    themeName: string;
    colors: Colors;
}
declare const renderPngs: (args: BuildBitmapsArgs) => Promise<void>;
export { BuildBitmapsArgs, renderPngs };
