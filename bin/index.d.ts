import { SVGHandler } from "./modules";
interface BuildBitmapsArgs {
    dir: string;
    out: string;
    themeName: string;
    colors: SVGHandler.Colors;
}
declare const buildBitmaps: (args: BuildBitmapsArgs) => Promise<void>;
export { BuildBitmapsArgs, buildBitmaps };
