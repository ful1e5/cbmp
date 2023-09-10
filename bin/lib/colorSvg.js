/**
 * Customize colors of svg code.
 * @param {string} code SVG code.
 * @param {Color} colors Customize colors.
 * @returns {string} SVG code with colors.
 */
const colorSvg = (code, colors) => {
    colors.forEach(({ match, replace }) => {
        if (match && replace) {
            code = code.replace(new RegExp(match, "ig"), replace);
        }
    });
    return code;
};
export { colorSvg };
