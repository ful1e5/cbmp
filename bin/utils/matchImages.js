"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchImages = void 0;
var pixelmatch_1 = __importDefault(require("pixelmatch"));
var pngjs_1 = require("pngjs");
var matchImages = function (img1, img2) {
    var _a = pngjs_1.PNG.sync.read(img1), img1Data = _a.data, width = _a.width, height = _a.height;
    var imgNData = pngjs_1.PNG.sync.read(img2).data;
    return (0, pixelmatch_1.default)(img1Data, imgNData, null, width, height, {
        threshold: 0.1,
    });
};
exports.matchImages = matchImages;
