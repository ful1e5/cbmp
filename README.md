# cbmp

![cbmp](https://github.com/ful1e5/cbmp/assets/24286590/3d699383-9c54-41f0-8786-e2817410c068)

[![ci](https://github.com/ful1e5/cbmp/actions/workflows/ci.yml/badge.svg)](https://github.com/ful1e5/cbmp/actions/workflows/ci.yml)
[![publish](https://github.com/ful1e5/cbmp/actions/workflows/publish.yml/badge.svg)](https://github.com/ful1e5/cbmp/actions/workflows/publish.yml)

CLI for converting cursor SVG files to PNG.

This library has the capability to rasterize both static and animated SVG files, regardless of whether they use SMIL, CSS, or other types of animations supported by modern browsers. It can transform these files into PNG sequences. Additionally, it offers a CLI tool named `cbmp`, which runs [Puppeteer](https://www.npmjs.com/package/puppeteer) to load SVG files within a browser page, take screenshots using an algorithm, and save them.

<!-- If you're interested, you can learn more about "sponsor-spotlight" on
 https://dev.to/ful1e5/lets-give-recognition-to-those-supporting-our-work-on-github-sponsors-b00 -->

![shoutout-sponsors](https://sponsor-spotlight.vercel.app/sponsor?login=ful1e5)

## Install

```bash
npm install ful1e5/cbmp
```

```bash
yarn add ful1e5/cbmp
```

## Usage

```
Usage: cbmp [Args] [Options] ...

CLI for converting cursor SVG files to PNG.

Arguments:
  path                                  Path to JSON configuration file.

Options:
  -V, --version                         Output the version number.
  -d, --dir <path>                      Specify the directory to search for SVG files.
  -o, --out <path>                      Specify the directory where rasterized PNG files will be saved. (default: "./bitmaps")
  -bc, --baseColor [string]             Specifies the CSS color for the inner part of the cursor. (optional)
  -oc, --outlineColor [string]          Specifies the CSS color for the cursor's outline. (optional)
  -wc, --watchBackgroundColor [string]  Specifies the CSS color for the animation background. (optional)
  -fps, --fps [number|float]            Specifies the FPS for rendering animated SVGs. (default: 1)
  --debug                               Run Puppeteer in non-headless mode and print additional debugging logs.
  -h, --help                            Display help for the command.
```

### Getting Started

To begin, use the following command to convert convert SVG files from the `svg` directory and save the PNG files to the `out` directory:

```bash
npx cbmp -d svg -o out
```

For debugging and Inspect Puppeteer window, add the `--debug` flag:

```bash
npx cbmp -d svg -o out --debug
```

### Config files

You can simplify the process by using a JSON configuration file.

This JSON configuration file represents a series of `cbmp` command. It's structured into separate sections, each focusing on a specific conversion task.

- **Sections**: It is divided into sections, each representing a different conversion task.
- **Parameters**:
  - `"dir"`: Specifies the directory containing SVG files to convert.
  - `"out"`: Specifies the output directory for the PNG sequence.
  - `"fps"`: (Optional) Sets the frames per second (fps) for the animation.
  - `"colors"`: (Optional) Allows you to define color replacements in the SVGs.

```json
{
  "Sample Task": {             <--- Task Name
    "dir": "svg",              <--- Specify Directory containing SVG files
    "out": "out",              <--- Specify output directory
    "fps": 60,                 <--- (Optional) Adjust FPS
    "colors": [                <--- (Optional) List of Color Replacements
      { "match": "#00FF00", "replace": "#FFFFFF" },
      { "match": "#0000FF", "replace": "#000000" },
      { "match": "#FF0000", "replace": "#FFF000" }
    ]
  }
}
```

```bash
npx cbmp sample.json
```

You can also control the frames per second (fps) using the `-fps` or `--fps` options:

```bash
npx cbmp sample.json -fps 30
```

#### sample.json

```json
{
  "Sample 1": {
    "dir": "svg",
    "out": "out/sample1"
  },

  "Sample 2": {
    "dir": "svg",
    "out": "out/sample2"
    "fps": 10,
  },

  "Sample 3": {
    "dir": "svg",
    "out": "out/sample3",
    "colors": [
      { "match": "#00FF00", "replace": "#FFFFFF" },
      { "match": "#0000FF", "replace": "#000000" }
    ]
  },

  "Sample 4": {
    "dir": "svg",
    "out": "out/sample4",
    "fps": 60,
    "colors": [
      { "match": "#00FF00", "replace": "#FFFFFF" },
      { "match": "#0000FF", "replace": "#000000" },
      { "match": "#FF0000", "replace": "#FFF000" }
    ]
  }
}
```

## LICENSE

This project is released under the terms of the `MIT` license.
See [opensource.org](https://opensource.org/licenses/MIT) for more information.
