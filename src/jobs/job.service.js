const crypto = require("crypto");
const config = require("../config/config.service");
const model = require("./job.model");

module.exports = {
  enqueue(command) {
    const id = crypto.randomUUID();
    const maxRetries = parseInt(config.get("max_retries") || "3", 10);
    return model.insert(id, command, maxRetries);
  },

  fetchNext() {
    return model.claimNext();
  },

  complete(id) {
    return model.markCompleted(id);
  },

  fail(job, error) {
    const attempts = job.attempts + 1;

    if (attempts >= job.max_retries) {
      model.moveToDLQ(job.id, attempts, error);
      return "dead";
    }

    const nextRun = Math.pow(2, attempts);
    model.updateOnFailure(job.id, attempts, error, nextRun);
    return "retry";
  },

  retryDLQ(id) {
    model.reset(id);
  }
};
