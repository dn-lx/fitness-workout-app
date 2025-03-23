# ==============================================
# Firestore Database Viewer 
# ==============================================
# This script starts Firebase Firestore emulator and opens browser tabs
# for both local and cloud Firestore databases.

Write-Host "============================================="
Write-Host "     Firestore Database Viewer"
Write-Host "============================================="
Write-Host ""
Write-Host "This script will start the Firebase emulators and open browser windows"
Write-Host "to view both your local and cloud Firestore databases."
Write-Host ""

# Change to the project root directory
Set-Location -Path (Split-Path -Parent $PSScriptRoot)

# Kill any processes using Firebase emulator ports
$ports = @(8080, 9000, 5000, 9199, 4000, 4400, 9150, 4500)

foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        foreach ($conn in $connections) {
            $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Killing process $($process.Name) (PID: $($process.Id)) using port $port"
                Stop-Process -Id $process.Id -Force
            }
        }
    } catch {
        Write-Host "No process using port $port"
    }
}

# Start Firebase emulators in the background
Write-Host "`nStarting Firebase emulators (Firestore)..."

# Start the Firestore emulator in a new window
$emulatorProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c firebase emulators:start --only firestore" -PassThru -WindowStyle Normal

# Wait for emulators to start
Write-Host "`nWaiting for emulators to start..."
Start-Sleep -Seconds 10

# Open local Firestore emulator in browser
Write-Host "`nOpening local Firestore emulator UI..."
Start-Process "http://localhost:4000/firestore"

# Open cloud Firestore in browser with the correct URL
Write-Host "`nOpening cloud Firestore in browser..."
$cloudFirestoreUrl = "https://console.firebase.google.com/project/fitness-workout-app-1418c/firestore/databases/-default-/data"
Start-Process $cloudFirestoreUrl
Write-Host "Cloud Firestore UI: $cloudFirestoreUrl"

Write-Host "`n============================================="
Write-Host "Local Firestore UI:  http://localhost:4000/firestore" 
Write-Host "Cloud Firestore UI:  $cloudFirestoreUrl"
Write-Host "============================================="

# Wait for user input to close
Write-Host "`nPress Enter to stop the emulators and close this window..."
Read-Host

# Kill the emulator process
if ($emulatorProcess) {
    try {
        $childProcesses = Get-WmiObject Win32_Process | Where-Object { $_.ParentProcessId -eq $emulatorProcess.Id }
        foreach ($childProcess in $childProcesses) {
            Stop-Process -Id $childProcess.ProcessId -Force -ErrorAction SilentlyContinue
        }
        Stop-Process -Id $emulatorProcess.Id -Force -ErrorAction SilentlyContinue
    } catch {
        Write-Host "Could not terminate some emulator processes gracefully"
    }
}

# Make sure all node processes related to Firebase are terminated
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | 
    Where-Object { $_.CommandLine -match "firebase" } | 
    ForEach-Object { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue }
} catch {
    Write-Host "Some node processes could not be terminated"
}

Write-Host "Emulators stopped." 