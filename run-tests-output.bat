@echo off
REM Test Execution with Output File
REM This script runs tests and saves output to a file

echo ========================================
echo VibeMatch Test Suite Execution
echo ========================================
echo.
echo Running tests and saving output to test-results.txt...
echo.

call npm test > test-results.txt 2>&1

echo.
echo ========================================
echo Test execution complete!
echo Results saved to: test-results.txt
echo ========================================
echo.
echo Opening results file...
type test-results.txt
pause

