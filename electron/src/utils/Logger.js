import chalk from "chalk";

class Logger {
  static info(message, context = "") {
    const prefix = context ? chalk.blue(`[${context}]`) : chalk.blue("[INFO]");
    console.log(`${prefix} ${message}`);
  }

  static success(message, context = "") {
    const prefix = context
      ? chalk.green(`[${context}]`)
      : chalk.green("[SUCCESS]");
    console.log(`${prefix} ${message}`);
  }

  static warn(message, context = "") {
    const prefix = context
      ? chalk.yellow(`[${context}]`)
      : chalk.yellow("[WARN]");
    console.log(`${prefix} ${message}`);
  }

  static error(message, context = "", details = "") {
    const prefix = context ? chalk.red(`[${context}]`) : chalk.red("[ERROR]");
    console.error(`${prefix} ${message}`);
    if (details) {
      console.error(chalk.red(`  └─ ${details}`));
    }
  }

  static debug(message, data, context = "") {
    const prefix = context ? chalk.cyan(`[${context}]`) : chalk.cyan("[DEBUG]");
    console.log(`${prefix} ${message}`);
    if (data) {
      console.log(chalk.gray(JSON.stringify(data, null, 2)));
    }
  }
}

export default Logger;
