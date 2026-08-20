<#
.SYNOPSIS
    Convenience launcher for Check-in Museum Thailand

.DESCRIPTION
    Wrapper script for common development commands.

.EXAMPLE
    .\run.ps1              # Start dev server (default)
    .\run.ps1 dev          # Start dev server
    .\run.ps1 build        # Production build
    .\run.ps1 start        # Start production server (after build)
    .\run.ps1 lint         # Run ESLint
    .\run.ps1 typecheck    # Run TypeScript check (no emit)
    .\run.ps1 install      # Install dependencies
    .\run.ps1 clean        # Remove .next/ build cache
    .\run.ps1 help         # Show help
#>

param(
    [Parameter(Position = 0)]
    [string]$Action = "dev"
)

Set-Location $PSScriptRoot

function Show-Help {
    Write-Host "Usage: .\run.ps1 <command>"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  install    Install dependencies (npm install)"
    Write-Host "  dev        Start development server (default)"
    Write-Host "  build      Production build"
    Write-Host "  start      Start production server (run 'build' first)"
    Write-Host "  lint       Run ESLint"
    Write-Host "  typecheck  Run TypeScript check (tsc --noEmit)"
    Write-Host "  clean      Remove .next/ build cache"
    Write-Host "  help       Show this help"
}

switch ($Action.ToLower()) {
    "install" {
        Write-Host "Installing dependencies..." -ForegroundColor Cyan
        npm install
    }
    "dev" {
        Write-Host "Starting development server..." -ForegroundColor Cyan
        Write-Host "    http://localhost:3000"
        npm run dev
    }
    "build" {
        Write-Host "Building for production..." -ForegroundColor Cyan
        npm run build
    }
    "start" {
        Write-Host "Starting production server..." -ForegroundColor Cyan
        npm run start
    }
    "lint" {
        Write-Host "Running ESLint..." -ForegroundColor Cyan
        npm run lint
    }
    "typecheck" {
        Write-Host "Running TypeScript check..." -ForegroundColor Cyan
        npx tsc --noEmit
    }
    "clean" {
        Write-Host "Cleaning build cache..." -ForegroundColor Cyan
        if (Test-Path .next) { Remove-Item -Recurse -Force .next }
    }
    "help" { Show-Help }
    default {
        Write-Host "Unknown command: $Action" -ForegroundColor Red
        Write-Host ""
        Show-Help
        exit 1
    }
}
