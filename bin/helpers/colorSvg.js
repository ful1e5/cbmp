/**
 * Customize colors of svg code.
 * @param {string} code SVG code.
 * @param {Colors} colors Customize colors.
 * @returns {string} SVG code with colors.
 */
const colorSvg = (code, colors) => {
    colors.forEach(({ match, replace }) => {
        code = code.replace(new RegExp(match, "ig"), replace);
    });
    return code;
};
export { colorSvg };
