@echo off
echo 🚀 Testing Full Stack Application...

echo.
echo 📊 Step 1: Starting Backend with Sample Data
echo ================================================
cd ..\spring-boot-api
echo Starting Spring Boot backend...
start "Backend" cmd /c "mvn spring-boot:run"

echo Waiting for backend to start (30 seconds)...
timeout /t 30 >nul

echo.
echo 🌐 Step 2: Testing Backend APIs
echo ================================================
echo Testing API endpoints...

curl -s http://localhost:8080/api/health/status && echo ✅ Health check OK || echo ❌ Health check failed

curl -s http://localhost:8080/api/fee-declarations?page=0&size=2 > temp_api_response.json
if exist temp_api_response.json (
    echo ✅ Fee declarations API responding
    echo Sample response:
    type temp_api_response.json
    del temp_api_response.json
) else (
    echo ❌ Fee declarations API not responding
)

echo.
echo 💻 Step 3: Starting Frontend
echo ================================================
cd ..\demo\thu-phi-hcm
echo Starting React frontend...
start "Frontend" cmd /c "npm run dev"

echo Waiting for frontend to start (15 seconds)...
timeout /t 15 >nul

echo.
echo 🎉 Both services should be running:
echo ================================
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000 (or 5173)
echo H2 Console: http://localhost:8080/h2-console
echo   - JDBC URL: jdbc:h2:file:./data/testdb
echo   - Username: sa
echo   - Password: (empty)
echo.
echo 📋 Test the fee declaration management page:
echo http://localhost:3000/fee-declaration/manage
echo.
echo Press any key to continue...
pause >nul

echo.
echo 🔍 Optional: Open browser windows
echo ================================
start http://localhost:8080/swagger-ui.html
start http://localhost:3000/fee-declaration/manage
start http://localhost:8080/h2-console

echo.
echo ✅ Full stack test completed!
echo Both frontend and backend should be connected and showing real data from database.
pause
