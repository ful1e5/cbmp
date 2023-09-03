"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.frameNumber = void 0;
const frameNumber = (index, padding) => {
    let result = "" + index;
    while (result.length < padding) {
        result = "0" + result;
    }
    return result;
};
exports.frameNumber = frameNumber;
