"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exitWithError = void 0;
const exitWithError = (msg) => {
    console.error(msg);
    process.exit(1);
};
exports.exitWithError = exitWithError;
