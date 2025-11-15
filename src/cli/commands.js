const { Command } = require("commander");
const jobService = require("../jobs/job.service");
const config = require("../config/config.service");
const workerManager = require("../workers/worker.manager");
const db = require("../db/database");

const program = new Command();

program
  .name("queuectl")
  .description("Background job queue system")
  .version("1.0.0");

// ENQUEUE
program
  .command("enqueue <cmd...>")
  .description("Add a new job")
  .action((cmd) => {
    const command = cmd.join(" ");
    const job = jobService.enqueue(command);
    console.log(`✔ Job enqueued: ${job.id}`);
  });

// WORKER START
program
  .command("worker:start")
  .option("-c, --count <number>", "Workers", "1")
  .action((opts) => workerManager.start(parseInt(opts.count, 10)));

// STATUS
program
  .command("status")
  .action(() => {
    const rows = db.prepare("SELECT state, COUNT(*) as count FROM jobs GROUP BY state").all();
    console.table(rows);
  });

// LIST
program
  .command("list")
  .option("--state <state>")
  .action((opts) => {
    let q = "SELECT id, command, state, attempts, next_run_at FROM jobs";
    const args = [];

    if (opts.state) {
      q += " WHERE state = ?";
      args.push(opts.state);
    }

    console.table(db.prepare(q).all(...args));
  });

// DLQ LIST
program
  .command("dlq:list")
  .action(() => {
    const jobs = db.prepare("SELECT * FROM jobs WHERE state = 'dead'").all();
    console.table(jobs);
  });

// DLQ RETRY
program
  .command("dlq:retry <id>")
  .action((id) => {
    jobService.retryDLQ(id);
    console.log(`♻ Job ${id} moved to pending`);
  });

// CONFIG SET
program
  .command("config:set <key> <value>")
  .action((key, value) => {
    config.set(key, value);
    console.log(`✔ Config updated: ${key}=${value}`);
  });

// CONFIG GET
program
  .command("config:get <key>")
  .action((key) => {
    console.log(`${key} = ${config.get(key)}`);
  });

module.exports = program;
