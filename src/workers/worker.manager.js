const { fork } = require("child_process");
const path = require("path");

module.exports = {
  start(count) {
    const workers = [];
    const workerPath = path.join(__dirname, "worker.js");

    console.log(`🚀 Starting ${count} worker(s)...`);

    for (let i = 0; i < count; i++) {
      workers.push(fork(workerPath));
    }

    process.on("SIGINT", () => {
      console.log("🛑 Stopping workers...");
      workers.forEach((w) => w.kill("SIGINT"));
      process.exit();
    });
  }
};
