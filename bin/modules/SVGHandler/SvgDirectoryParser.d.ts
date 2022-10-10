interface Svg {
    key: string;
    content: string;
}
declare class SvgDirectoryParser {
    private svgDir;
    /**
     * Manage and Parse SVG file path in `absolute` fashion.
     * This Parser look svg files as below fashion:
     * `
     *  <@svgDir>/static
     *  <@svgDir>/animated
     * `
     * @param svgDir is relative/absolute path, Where `SVG` files are stored.
     */
    semiAnimated: boolean;
    constructor(svgDir: string);
    private readData;
    /**
     * Return absolute paths array of SVG files data located inside '@svgDir/static'
     */
    getStatic(): Svg[];
    /**
     * Return absolute paths array of SVG files data located inside '@svgDir/animated'
     */
    getAnimated(): Svg[];
}
export { SvgDirectoryParser };
