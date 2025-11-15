#!/bin/bash

echo "Starting worker..."
queuectl worker:start --count 1 &
WORKER_PID=$!

sleep 2

echo "Enqueue success job..."
queuectl enqueue echo "Hello Queue"

echo "Enqueue failing job..."
queuectl enqueue "exit 1"

echo "Waiting for retries..."
sleep 12

echo "Checking DLQ..."
queuectl dlq:list

kill $WORKER_PID
echo "Worker stopped."
