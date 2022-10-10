"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorSvg = void 0;
/**
 * Default Key Colors for generating colored svg.
 * base="#00FF00" (Green)
 * outline="#0000FF" (Blue)
 * watch.background="#FF0000" (Red)
 * */
var defaultKeyColors = {
    base: "#00FF00",
    outline: "#0000FF",
    watch: {
        background: "#FF0000",
    },
};
/**
 * Customize colors of svg code.
 * @param {string} content SVG code.
 * @param {Colors} colors Customize colors.
 * @param {Colors} [keys] Colors Key, That was written SVG code.
 * @returns {string} SVG code with colors.
 */
var colorSvg = function (content, colors, keys) {
    var _a;
    if (keys === void 0) { keys = defaultKeyColors; }
    content = content
        .replace(new RegExp(keys.base, "ig"), colors.base)
        .replace(new RegExp(keys.outline, "ig"), colors.outline);
    try {
        // === trying to replace `watch` color ===
        if (!((_a = colors.watch) === null || _a === void 0 ? void 0 : _a.background)) {
            throw new Error("");
        }
        var b = colors.watch.background;
        content = content.replace(new RegExp(keys.watch.background, "ig"), b); // Watch Background
    }
    catch (error) {
        // === on error => replace `watch` color as `base` ===
        content = content.replace(new RegExp(keys.watch.background, "ig"), colors.base);
    }
    return content;
};
exports.colorSvg = colorSvg;
