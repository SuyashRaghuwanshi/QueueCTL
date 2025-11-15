🚀 QueueCTL – Background Job Queue System






A production-grade CLI-based background job queue system built using Node.js and SQLite, supporting:

Multiple worker processes

Atomic job locking (safe concurrency)

Exponential backoff retries

Dead Letter Queue (DLQ)

Persistent queue storage

Fully featured CLI tool (queuectl)

Cross-platform support (Windows + Linux/Mac)

Beautiful colored logs + human-readable timestamps

📦 Features
🔧 Core Functionality

✔ Enqueue jobs that execute OS-level commands
✔ Multiple workers run in parallel
✔ No duplicate execution (atomic SQL locking)
✔ Exponential backoff retry logic
✔ Jobs persist across restarts (SQLite)
✔ Dead Letter Queue for permanently failed jobs
✔ Configuration system (max retries, etc.)
✔ Graceful worker shutdown
✔ Clean CLI interface built with commander
✔ Colorful, readable logs and timestamps

🏗 Architecture Overview
 Producer (CLI)
       │
       ▼
 SQLite Database  ← Persistent storage (WAL mode)
       │
       ▼
 Workers → execute jobs → retry → DLQ


See design.md for the full architecture breakdown.

📂 Project Structure
queuectl/
 ├── bin/
 │   ├── queuectl.js          # CLI entrypoint
 │   └── queuectl.cmd         # Windows support
 ├── src/
 │   ├── cli/
 │   │    └── commands.js
 │   ├── config/
 │   │    └── config.service.js
 │   ├── db/
 │   │    └── database.js
 │   ├── jobs/
 │   │    ├── job.model.js
 │   │    ├── job.service.js
 │   │    └── job.types.js
 │   ├── utils/
 │   │    ├── exec.util.js
 │   │    └── logger.js
 │   └── workers/
 │        ├── worker.js
 │        └── worker.manager.js
 ├── queue.db
 ├── test.ps1                 # Windows test script
 ├── test.sh                  # Linux/Mac test script
 ├── package.json
 ├── README.md
 └── design.md

💻 Installation
1️⃣ Install dependencies
npm install

2️⃣ Link CLI tool globally
npm link


Windows will also generate:

queuectl.cmd

⚡ Quick Start
queuectl worker start --count 1
queuectl enqueue echo "Hello Queue"
queuectl enqueue "exit 1"
queuectl list

▶ Usage Guide
🎯 Start Worker Processes
queuectl worker start --count 2

📨 Enqueue Jobs
queuectl enqueue echo "Hello Queue"
queuectl enqueue "exit 1"
queuectl enqueue "ping 127.0.0.1 -n 5 > nul"   # Windows

📋 List Jobs
queuectl list
queuectl list --state pending
queuectl list --state completed
queuectl list --state dead

⚙️ Configuration
queuectl config set max_retries 5
queuectl config get max_retries

🪦 Dead Letter Queue
queuectl dlq list
queuectl dlq retry <job-id>

🧪 Testing
🪟 Windows

Before running PowerShell scripts:

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned


Run the test:

./test.ps1

🐧 Linux / Mac
chmod +x test.sh
./test.sh


Both scripts validate:

✔ Workers start
✔ Success + failing jobs enqueue
✔ Retries occur with backoff
✔ Jobs move to DLQ
✔ DLQ listing works

📘 design.md (Included)

Your repository also includes a full architectural design document, covering:

Component-level design

Job lifecycle

Retry algorithm

SQLite concurrency model

DLQ mechanism

Worker polling strategy

📝 Summary

QueueCTL is a fully functional background job queue system demonstrating real-world backend engineering concepts:

🔧 Process Management

Efficient worker orchestration with graceful shutdowns.

⚙️ Concurrency Control

Multiple workers run safely using atomic SQL locking.

🗂 Persistent Queuing

All jobs, retries, errors, and config stored reliably in SQLite.

💻 CLI Engineering

A professional CLI that manages the entire job ecosystem.

🚨 Error Handling

Exit-code based failure detection with structured logs.

🔁 Fault Tolerance

Exponential-backoff retrying and DLQ for resilient execution.

🏁 Conclusion

QueueCTL shows how to build a fault-tolerant, persistent, multi-worker background job system from scratch using Node.js.
It demonstrates strong backend fundamentals including concurrency, persistence, retries, worker management, and CLI tooling — making it a complete, production-grade engineering exercise.
