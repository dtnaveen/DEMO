# Test Execution Script for VibeMatch
# This script bypasses PowerShell execution policy and runs tests

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VibeMatch Test Suite Execution" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set execution policy for this process only
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

Write-Host "Execution policy set to Bypass for this session" -ForegroundColor Green
Write-Host ""

# Run tests
Write-Host "Running all tests..." -ForegroundColor Yellow
npm test

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test execution complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

