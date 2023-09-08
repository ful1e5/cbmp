type Colors = {
    match: string;
    replace: string;
};
/**
 * Customize colors of svg code.
 * @param {string} code SVG code.
 * @param {Colors} colors Customize colors.
 * @returns {string} SVG code with colors.
 */
declare const colorSvg: (code: string, colors: Colors[]) => string;
export { Colors, colorSvg };
