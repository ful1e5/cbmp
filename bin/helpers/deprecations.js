"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flushWarnings = exports.warnings = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.warnings = [];
const flushWarnings = () => {
    console.warn("\n" + chalk_1.default.bgYellow.bold(" WARNINGS "));
    exports.warnings.forEach((line, index) => {
        console.warn(chalk_1.default.yellow(`    [${++index}] ${line}`));
    });
    console.log();
};
exports.flushWarnings = flushWarnings;
