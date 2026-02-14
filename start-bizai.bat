@echo off
echo Starting BizAI Application...
echo.

echo Starting Backend Server...
cd backend
start "BizAI Backend" cmd /k "npm run dev"
cd ..

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Development Server...
cd frontend
start "BizAI Frontend" cmd /k "npm run dev"
cd ..

echo.
echo BizAI is starting up!
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul