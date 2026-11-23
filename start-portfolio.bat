@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not on PATH.
  echo Install the current LTS version from https://nodejs.org/ and reopen this window.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Repair or reinstall Node.js, then reopen this window.
  pause
  exit /b 1
)

if not exist "node_modules\.bin\next.cmd" (
  echo Installing portfolio dependencies...
  call npm ci
  if errorlevel 1 (
    echo Dependency installation failed.
    echo If npm reports EPERM or a file lock, close other portfolio terminals and Node processes,
    echo restart this launcher, and retry. Antivirus scanning can also briefly lock native files.
    pause
    exit /b 1
  )
)

if not exist "node_modules\.bin\next.cmd" (
  echo Next.js was not installed. Run npm ci in this folder and check for errors.
  pause
  exit /b 1
)

call npm run dev
pause
