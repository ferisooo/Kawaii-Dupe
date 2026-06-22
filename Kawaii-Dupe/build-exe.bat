@echo off
setlocal enableextensions
title DupeNova - build installer
cd /d "%~dp0"

echo.
echo   ============================================
echo      DUPENOVA  -  build Windows installer
echo   ============================================
echo.

set "ELECTRON_SKIP_BINARY_DOWNLOAD="
set "ELECTRON_SKIP_BINARY="
set "npm_config_ignore_scripts="

where node >nul 2>&1
if errorlevel 1 (
  echo   [X] Node.js not found. Install it from https://nodejs.org then retry.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo   [*] Installing dependencies first...
  call npm install
  if errorlevel 1 ( echo   [X] npm install failed. & pause & exit /b 1 )
)

REM --- Build the UI so the packaged app ships the latest app.js ---
echo   [*] Building the interface...
call npm run build

REM --- electron-builder is installed on demand (not part of npm install) ---
if not exist "node_modules\.bin\electron-builder.cmd" (
  echo   [*] Installing electron-builder (one time, on demand)...
  call npm install --no-save electron-builder@24.13.3
  if errorlevel 1 ( echo   [X] Could not install electron-builder. & pause & exit /b 1 )
)

echo   [*] Packaging NSIS installer...
call node_modules\.bin\electron-builder.cmd --win nsis
if errorlevel 1 (
  echo   [X] Packaging failed. See the messages above.
  pause
  exit /b 1
)

echo.
echo   [OK] Done. Find your installer in the "dist" folder.
echo.
pause
exit /b 0
