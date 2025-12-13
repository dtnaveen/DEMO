@echo off
REM Test Execution Batch Script for VibeMatch
REM This script runs tests using cmd to avoid PowerShell execution policy issues

echo ========================================
echo VibeMatch Test Suite Execution
echo ========================================
echo.

echo Running all tests...
echo Results will be saved to test-results.txt
echo.

call npm test > test-results.txt 2>&1

echo.
echo ========================================
echo Test execution complete!
echo ========================================
echo.
echo Last 50 lines of results:
echo ----------------------------------------
powershell -Command "Get-Content test-results.txt -Tail 50"
echo.
echo Full results saved to: test-results.txt
echo.
pause

