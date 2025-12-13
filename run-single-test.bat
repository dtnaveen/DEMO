@echo off
REM Run a single test file for debugging

if "%1"=="" (
    echo Usage: run-single-test.bat [test-file-path]
    echo Example: run-single-test.bat __tests__/pages/groups.test.js
    exit /b 1
)

echo ========================================
echo Running single test: %1
echo ========================================
echo.

node node_modules/jest/bin/jest.js %1 --maxWorkers=1 --forceExit --testTimeout=15000 --no-coverage --verbose

echo.
echo ========================================
echo Test complete!
echo ========================================
pause

