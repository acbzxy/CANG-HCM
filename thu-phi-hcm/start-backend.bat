@echo off
echo Starting Backend Server...
echo.
echo Make sure you have Java installed and the backend JAR file is available.
echo.

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 8 or higher
    pause
    exit /b 1
)

REM Try to find and start the backend JAR
if exist "backend.jar" (
    echo Found backend.jar, starting server...
    java -jar backend.jar --server.port=8080
) else if exist "target\*.jar" (
    echo Found JAR in target directory, starting server...
    for %%f in (target\*.jar) do (
        java -jar "%%f" --server.port=8080
        goto :end
    )
) else (
    echo ERROR: No backend JAR file found
    echo Please make sure you have compiled the backend project
    echo Expected locations: backend.jar or target\*.jar
    pause
    exit /b 1
)

:end
echo.
echo Backend server should now be running on http://localhost:8080
echo Press Ctrl+C to stop the server
pause
