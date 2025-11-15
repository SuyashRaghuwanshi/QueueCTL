const execCmd = require("../utils/exec.util");
const jobs = require("../jobs/job.service");
const log = require("../utils/logger");

const WORKER_ID = process.pid;

async function start() {
  log.info(`Worker ${WORKER_ID} started.`);

  let running = true;

  process.on("SIGINT", () => {
    log.warn(`Worker ${WORKER_ID} shutting down...`);
    running = false;
  });

  while (running) {
    const job = jobs.fetchNext();

    if (!job) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    log.jobStart(job.id, job.command);

    try {
      const out = await execCmd(job.command);
      log.info(out);

      jobs.complete(job.id);
      log.jobComplete(job.id);

    } catch (error) {
      const result = jobs.fail(job, error);
      if (result === "dead") log.jobDLQ(job.id);
      else log.jobRetry(job.id, Math.pow(2, job.attempts + 1));
    }
  }
}

module.exports = { start };

if (require.main === module) start();
