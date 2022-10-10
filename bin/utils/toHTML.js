"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHTML = exports.template = void 0;
exports.template = "\n<!DOCTYPE html>\n<html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Render Template</title>\n    </head>\n                \n    <body>\n        <div id=\"container\">\n            <svginjection>\n        </div>\n    </body>\n</html>\n";
var toHTML = function (svgData) {
    return exports.template.replace("<svginjection>", svgData);
};
exports.toHTML = toHTML;
