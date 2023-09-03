/**
 * Hex Colors in string Format.
 *
 * `Example: `"#FFFFFF"
 */
type HexColor = string;
/**
 * @Colors expect `base`, `outline` & `watch-background` colors in **HexColor** Format.
 * @default background is `base` color.
 */
type Colors = {
    base: HexColor;
    outline: HexColor;
    watch?: {
        background: HexColor;
    };
};
/**
 * Customize colors of svg code.
 * @param {string} content SVG code.
 * @param {Colors} colors Customize colors.
 * @param {Colors} [keys] Colors Key, That was written SVG code.
 * @returns {string} SVG code with colors.
 */
declare const colorSvg: (content: string, colors: Colors, keys?: Colors) => string;
export { Colors, colorSvg };
