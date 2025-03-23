@echo off
echo =========================================
echo     Firestore Database Viewer
echo =========================================
echo.
echo This script will start the Firebase emulators and open browser windows
echo to view both your local and cloud Firestore databases.
echo.

cd /d "%~dp0"
cd ..

:: Kill any processes using Firebase emulator ports
powershell -ExecutionPolicy Bypass -Command "$ports = @(8080, 9000, 5000, 9199, 4000, 4400, 9150, 4500); foreach ($port in $ports) { try { $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue; foreach ($conn in $connections) { $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue; if ($process) { Write-Host \"Killing process $($process.Name) (PID: $($process.Id)) using port $port\"; Stop-Process -Id $process.Id -Force } } } catch { Write-Host \"No process using port $port\" } }"

:: Start Firebase emulators in the background
echo Starting Firebase emulators (Firestore)...
start cmd /c "firebase emulators:start --only firestore"

:: Wait for emulators to start
echo Waiting for emulators to start...
timeout /t 10 /nobreak > nul

:: Open local Firestore emulator in browser
echo Opening local Firestore emulator UI...
start "" "http://localhost:4000/firestore"

:: Open cloud Firestore in browser with the correct URL
echo Opening cloud Firestore in browser...
start "" "https://console.firebase.google.com/project/fitness-workout-app-1418c/firestore/databases/-default-/data"

echo.
echo =========================================
echo Local Firestore UI:  http://localhost:4000/firestore
echo Cloud Firestore UI:  https://console.firebase.google.com/project/fitness-workout-app-1418c/firestore/databases/-default-/data
echo =========================================
echo.
echo Press any key to stop the emulators and close this window...
pause > nul

:: Kill emulators when the user presses a key
powershell -ExecutionPolicy Bypass -Command "Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*firebase*' } | ForEach-Object { Stop-Process -Id $_.Id -Force }"
echo Emulators stopped. 