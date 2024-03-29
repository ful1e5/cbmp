import chalk from "chalk";

export const warnings: string[] = [];

export const flushWarnings = () => {
  if (warnings.length > 0) {
    console.warn("\n" + chalk.bgYellow.bold(" WARNINGS "));
    warnings.forEach((line, index) => {
      console.warn(chalk.yellow(`    [${++index}] ${line}`));
    });
    console.log();
  }
};
