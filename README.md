🚀 QueueCTL – Background Job Queue System

A production-grade CLI-based background job queue built with:

Node.js

SQLite (better-sqlite3)

Multiple Worker Processes

Retry + Exponential Backoff

Dead Letter Queue (DLQ)

CLI Interface

📦 Features

CLI tool (queuectl)

Enqueue jobs that run OS-level commands

Multiple workers in parallel

Atomic job locking (no duplicate execution)

Retry mechanism with exponential backoff

Persistent storage via SQLite

Dead Letter Queue for permanently failed jobs

Configuration via CLI (max_retries, etc.)

Graceful shutdown of workers

Colored logs + readable timestamps

🏗 Architecture Overview

See design.md for full explanation.

Producer (CLI)
      │
      ▼
 SQLite DB  ← persistent + WAL mode
      │
      ▼
 Workers → execute jobs + retry + DLQ

💻 Installation
npm install
npm link


Windows users also get:

queuectl.cmd

▶ Usage
Start Workers
queuectl worker:start --count 2

Enqueue Jobs
queuectl enqueue echo "Hello Queue"
queuectl enqueue "exit 1"
queuectl enqueue "ping 127.0.0.1 -n 5 > nul"

List Jobs
queuectl list
queuectl list --state completed
queuectl list --state dead

Configuration
queuectl config:set max_retries 5
queuectl config:get max_retries

Dead Letter Queue
queuectl dlq:list
queuectl dlq:retry <job-id>

🧪 Testing
Windows
./test.ps1

Linux / Mac
./test.sh

📘 design.md
Create this file:

design.md

# QueueCTL – System Design

## Overview
QueueCTL is a minimal background job queue system implemented using Node.js + SQLite.

### Components
- **CLI (Producer):** Enqueues jobs, manages workers, config, DLQ.
- **Database (Broker):** Stores jobs, ensures persistence, prevents duplicates via locking.
- **Workers (Consumers):** Poll for jobs, execute commands, update states.

---

## Job Lifecycle

1. `pending` → waiting to be executed
2. Worker pulls job atomically via UPDATE…RETURNING
3. `processing` → worker running job
4. Success → `completed`
5. Failure → retry or `dead`
6. Dead jobs moved to DLQ

---

## Retry & Backoff

Backoff formula:



delay = 2 ^ attempts


Example:
- 2s → 4s → 8s → 16s → DLQ

---

## Persistence

SQLite with WAL mode:
- Safe concurrency
- Crash-resilient
- Fast local file storage

---

## Concurrency

Workers claim jobs using:

```sql
UPDATE jobs
SET state='processing'
WHERE id = (
  SELECT id FROM jobs
  WHERE state='pending'
  LIMIT 1
)
RETURNING *


This ensures only one worker gets the job.

📝 Summary

QueueCTL is a fully functional, production-style background job processing system built entirely in Node.js.
It showcases strong engineering principles through:

🔧 Process Management

Efficient orchestration of isolated worker processes that execute jobs independently and support graceful shutdowns.

⚙️ Concurrency Control

Multiple workers process jobs in parallel without race conditions, ensuring safe, locked, one-at-a-time execution.

🗂 Persistent Queuing

All jobs, states, retries, errors, and configuration are stored in SQLite, providing durability across restarts.

💻 CLI Engineering

A clean and powerful command-line interface (queuectl) enables full system management — enqueueing jobs, starting workers, inspecting status, managing DLQ, and configuring settings.

🚨 Error Handling

Robust detection of failures using process exit codes, with full logging, structured error messages, and retry tracking.

🔁 Fault Tolerance

Automatic exponential-backoff retry mechanism and a Dead Letter Queue (DLQ) ensure system resilience even when tasks repeatedly fail.
