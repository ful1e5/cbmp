type Color = {
    match: string;
    replace: string;
};
/**
 * Customize colors of svg code.
 * @param {string} code SVG code.
 * @param {Color} colors Customize colors.
 * @returns {string} SVG code with colors.
 */
declare const colorSvg: (code: string, colors: Color[]) => string;
export { Color, colorSvg };
