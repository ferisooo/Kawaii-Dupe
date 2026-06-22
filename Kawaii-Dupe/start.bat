@echo off
setlocal enableextensions
title DupeNova
cd /d "%~dp0"

echo.
echo   ============================================
echo      DUPENOVA  -  duplicate purifier
echo   ============================================
echo.

REM --- Electron's installer is the #1 thing that breaks. Make sure the
REM     binary download is NOT skipped for this session. ---
set "ELECTRON_SKIP_BINARY_DOWNLOAD="
set "ELECTRON_SKIP_BINARY="
set "npm_config_ignore_scripts="

REM --- Need Node + npm on PATH ---
where node >nul 2>&1
if errorlevel 1 (
  echo   [X] Node.js was not found on this PC.
  echo       Install it from https://nodejs.org  ^(LTS is fine^), then run me again.
  echo.
  if not defined DUPENOVA_HIDDEN pause
  exit /b 1
)

REM --- Install dependencies if missing ---
if not exist "node_modules" (
  echo   [*] First run - installing dependencies. This can take a minute...
  call npm install
  if errorlevel 1 (
    echo   [X] npm install failed. Check your internet connection and try again.
    if not defined DUPENOVA_HIDDEN pause
    exit /b 1
  )
)

REM --- Verify the Electron binary actually landed and is usable ---
call :ensure_electron
if errorlevel 1 (
  echo   [X] Could not get Electron's binary working. See messages above.
  if not defined DUPENOVA_HIDDEN pause
  exit /b 1
)

REM --- Build the UI from app.jsx -> app.js ---
echo   [*] Building the interface...
call npm run build
if errorlevel 1 (
  echo   [!] Build step failed - launching with the pre-compiled UI instead.
)

echo.
echo   [*] Launching DupeNova...
echo.
call "node_modules\.bin\electron.cmd" .
if errorlevel 1 (
  echo.
  echo   [X] DupeNova exited with an error.
  if not defined DUPENOVA_HIDDEN pause
)
exit /b 0


REM ======================================================================
REM  try_finalize : if the electron binary exists, (re)write a CLEAN
REM  path.txt (no trailing newline) and report success.
REM ======================================================================
:try_finalize
if not exist "%~dp0node_modules\electron\dist\electron.exe" exit /b 1
powershell -NoProfile -ExecutionPolicy Bypass -Command "[IO.File]::WriteAllText('%~dp0node_modules\electron\path.txt','electron.exe')" >nul 2>&1
if exist "%~dp0node_modules\electron\path.txt" exit /b 0
REM fallback writer with no trailing CRLF
<nul set /p "=electron.exe" > "%~dp0node_modules\electron\path.txt"
exit /b 0

REM ======================================================================
REM  ensure_electron : guarantees a working electron binary + clean
REM  path.txt, trying progressively heavier fixes.
REM ======================================================================
:ensure_electron
REM 0) binary already present (normal install, or a previous run) -> clean path.txt and go
call :try_finalize && exit /b 0

echo   [!] Electron binary missing - repair 1/4: running install.js...
if exist "node_modules\electron\install.js" node "node_modules\electron\install.js"
call :try_finalize && exit /b 0

echo   [!] Repair 2/4: retrying via ELECTRON_MIRROR...
set "ELECTRON_MIRROR=https://github.com/electron/electron/releases/download/"
if exist "node_modules\electron\install.js" node "node_modules\electron\install.js"
set "ELECTRON_MIRROR="
call :try_finalize && exit /b 0

echo   [!] Repair 3/4: downloading the matching Electron zip from GitHub...
set "ELECTRON_VER="
for /f "delims=" %%v in ('node -p "require('./node_modules/electron/package.json').version" 2^>nul') do set "ELECTRON_VER=%%v"
if "%ELECTRON_VER%"=="" (
  echo       Could not read the Electron version - skipping to full reinstall.
  goto :full_reinstall
)
echo       Electron version: %ELECTRON_VER%
set "EURL=https://github.com/electron/electron/releases/download/v%ELECTRON_VER%/electron-v%ELECTRON_VER%-win32-x64.zip"
if not exist "node_modules\electron\dist" mkdir "node_modules\electron\dist"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; try { Invoke-WebRequest -Uri '%EURL%' -OutFile 'electron-dist.zip'; Expand-Archive -Path 'electron-dist.zip' -DestinationPath 'node_modules\electron\dist' -Force; Remove-Item 'electron-dist.zip' -Force; exit 0 } catch { Write-Host $_.Exception.Message; exit 1 }"
call :try_finalize && exit /b 0

:full_reinstall
echo   [!] Repair 4/4: wiping node_modules and reinstalling from scratch...
if exist "node_modules" rmdir /s /q "node_modules"
call npm install
call :try_finalize && exit /b 0
if exist "node_modules\electron\install.js" node "node_modules\electron\install.js"
call :try_finalize && exit /b 0

exit /b 1
