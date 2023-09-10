# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [unreleased]

## [v1.0.0] - 10 September 2023

### Breaking Changes

- This module is now an `ESM` module and is compiled to `ES2015`.

### Deprecations

- The `-n, --themeName` option is deprecated. Please use `-o, --out <path>` to specify the output path.

### What's New?

- Configuration-based rendering is now supported:

  ```bash
  $ npx cbmp render.json
  ```

- The `-fps, --fps` option has been added to lower or increase the frame capture rate in animated .svg files.
- The `--debug` option has been added for running Puppeteer in debug mode.
- Informative logs and colorful loading have been added while rendering SVG files.

### Changed

- The project's codebase has been rearranged to follow the `ESM` syntax.
- The `glob` library is now used to retrieve `.svg` files inside the `-d, --dir` directory.

## [v1.0.0.alpha.1] - 10 September 2023

### What's New?

- Early Development Public release 🎊

[unreleased]: https://github.com/ful1e5/Bibata_Cursor/compare/v1.0.0...main
[v1.0.0]: https://github.com/ful1e5/Bibata_Cursor/compare/v1.0.0...v1.0.0.alpha.1
[v1.0.0.alpha.1]: https://github.com/ful1e5/cbmp/tree/v1.0.0.alpha.1