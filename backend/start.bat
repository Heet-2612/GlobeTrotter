@echo off
title GlobeTrotter Backend
echo ====================================
echo   GlobeTrotter Backend Launcher
echo ====================================

:: Set Java 17
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot
set PATH=C:\tools\maven\bin;%JAVA_HOME%\bin;%PATH%

:: PostgreSQL connection
set SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/globetrotter_db
set SPRING_DATASOURCE_USERNAME=postgres
set SPRING_DATASOURCE_PASSWORD=GlobeTrotter@2026
set SPRING_DATASOURCE_DRIVER=org.postgresql.Driver

:: JPA / Flyway
set SPRING_JPA_HIBERNATE_DDL_AUTO=update
set SPRING_JPA_SHOW_SQL=false
set SPRING_FLYWAY_ENABLED=false

:: JWT
set JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
set JWT_EXPIRATION_MS=86400000

:: CORS
set CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

echo [1] Checking PostgreSQL service...
sc query postgresql-x64-18 | findstr "RUNNING" >nul
if errorlevel 1 (
    echo [!] PostgreSQL is not running. Starting it...
    net start postgresql-x64-18
) else (
    echo [OK] PostgreSQL is running.
)

echo [2] Starting GlobeTrotter Backend on port 8080...
echo.
java -jar "%~dp0target\globetrotter-backend-0.0.1-SNAPSHOT.jar"
pause
