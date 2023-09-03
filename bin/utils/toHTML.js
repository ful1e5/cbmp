"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHTML = exports.template = void 0;
exports.template = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Render Template</title>
    </head>
                
    <body>
        <div id="container">
            <svginjection>
        </div>
    </body>
</html>
`;
const toHTML = (svgData) => exports.template.replace("<svginjection>", svgData);
exports.toHTML = toHTML;
