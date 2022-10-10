"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.frameNumber = void 0;
var frameNumber = function (index, padding) {
    var result = "" + index;
    while (result.length < padding) {
        result = "0" + result;
    }
    return result;
};
exports.frameNumber = frameNumber;
