"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchImages = void 0;
const pixelmatch_1 = __importDefault(require("pixelmatch"));
const pngjs_1 = require("pngjs");
const matchImages = (img1, img2) => {
    const { data: img1Data, width, height } = pngjs_1.PNG.sync.read(img1);
    const { data: imgNData } = pngjs_1.PNG.sync.read(img2);
    return (0, pixelmatch_1.default)(img1Data, imgNData, null, width, height, {
        threshold: 0.1,
    });
};
exports.matchImages = matchImages;
