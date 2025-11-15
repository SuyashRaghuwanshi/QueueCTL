const chalk = require("chalk");

function ts() {
  return chalk.gray(new Date().toISOString().replace("T", " ").split(".")[0]);
}

module.exports = {
  info: (msg) => console.log(ts(), chalk.blue("ℹ"), msg),
  success: (msg) => console.log(ts(), chalk.green("✔"), msg),
  warn: (msg) => console.log(ts(), chalk.yellow("⚠"), msg),
  error: (msg) => console.log(ts(), chalk.red("✖"), msg),

  jobStart: (id, cmd) =>
    console.log(ts(), chalk.cyan("🚀 Running"), chalk.magenta(id), chalk.yellow(cmd)),

  jobComplete: (id) =>
    console.log(ts(), chalk.green("🏁 Completed"), chalk.magenta(id)),

  jobFail: (id, err) =>
    console.log(ts(), chalk.red("💥 Failed"), chalk.magenta(id), chalk.red(err)),

  jobRetry: (id, delay) =>
    console.log(ts(), chalk.yellow("🔁 Retry"), chalk.magenta(id), `in ${delay}s`),

  jobDLQ: (id) =>
    console.log(ts(), chalk.red("☠ DLQ"), chalk.magenta(id)),
};
