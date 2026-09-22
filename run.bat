@echo off
title Cyber-Ops 3D CTF Platform
echo Starting Cyber-Ops 3D CTF Platform...
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
