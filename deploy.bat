@echo off
REM Mission Control - Quick Deploy Script

echo ========================================
echo   Mission Control - Vercel Deploy
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Installing Vercel CLI...
npm install -g vercel

echo.
echo Step 2: Login to Vercel...
echo Please follow the login link in your browser
vercel login

echo.
echo Step 3: Deploy to Vercel...
vercel --prod

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo To update later, just run: vercel --prod

pause
