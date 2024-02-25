# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [unreleased]

## [v1.1.0] - 25 February 2024

### Breaking Changes

-   The default render engine is now [resvg-js](https://github.com/yisibl/resvg-js).
    To use Puppeteer, either assign the `--puppeteer` option in the command line or set `"use": "puppeteer"` in the JSON config.

    **Example in CLI Argument:**

    ```bash
    npx cbmp -d svg -o out --puppeteer
    ```

    **In config files:**

    ```json
    {
        "use": "puppeteer",
        "Sample 1": {
            "dir": "svg",
            "out": "out/sample1"
        },

        "Sample 2": {
            "dir": "svg",
            "out": "out/sample2",
            "fps": 10
        }
    }
    ```

### What's New?

-   perf: SVG rendering is now faster with [resvg-js](https://github.com/yisibl/resvg-js) (Related to https://github.com/ful1e5/Bibata_Cursor/issues/159)

## [v1.0.0] - 11 September 2023

### :warning: Breaking Changes

-   This module is now an `ESM` module and is compiled to `ES2015`.

### Deprecations

-   The `-n, --themeName` option is deprecated. Please use `-o, --out <path>` to specify the output path.

### What's New?

-   Configuration-based rendering is now supported:

    ```bash
    $ npx cbmp render.json
    ```

-   The `-fps, --fps` option has been added to lower or increase the frame capture rate in animated .svg files.
-   The `--debug` option has been added for running Puppeteer in debug mode.
-   Informative logs and colorful loading have been added while rendering SVG files.

### Changes

-   The project's codebase has been rearranged to follow the `ESM` syntax.
-   The `glob` library is now used to retrieve `.svg` files inside the `-d, --dir` directory.

## [v1.0.0.alpha.1] - 10 September 2023

### What's New?

-   Early Development Public release 🎊

[unreleased]: https://github.com/ful1e5/cbmp/compare/v1.1.0...main
[v1.1.0]: https://github.com/ful1e5/cbmp/compare/v1.1.0...v1.0.0
[v1.0.0]: https://github.com/ful1e5/cbmp/compare/v1.0.0...v1.0.0.alpha.1
[v1.0.0.alpha.1]: https://github.com/ful1e5/cbmp/tree/v1.0.0.alpha.1
