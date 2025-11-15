Write-Host "Starting worker..."
Start-Process powershell -ArgumentList "queuectl worker:start --count 1"

Start-Sleep -Seconds 2

Write-Host "Enqueue success job..."
queuectl enqueue 'echo "Hello Queue"'

Write-Host "Enqueue failing job..."
queuectl enqueue "exit 1"

Write-Host "Waiting for retries..."
Start-Sleep -Seconds 12

Write-Host "Checking DLQ..."
queuectl dlq:list
