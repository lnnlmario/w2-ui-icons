import chalk from "chalk";
import consola from "consola";

export function chalkInfo(msg: string) {
  return chalk.greenBright(msg);
}

export function printInfo(msg: string) {
  consola.info(chalkInfo(msg));
}
