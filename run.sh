#!/usr/bin/env bash
# run.sh — convenience launcher for Check-in Museum Thailand
# Usage:
#   ./run.sh           # start dev server (default)
#   ./run.sh dev        # start dev server
#   ./run.sh build      # production build
#   ./run.sh start      # start production server (after build)
#   ./run.sh lint       # run ESLint
#   ./run.sh typecheck   # run TypeScript check (no emit)
#   ./run.sh install     # install dependencies
#   ./run.sh clean       # remove .next/ build cache
set -euo pipefail

cd "$(dirname "$0")"

action="${1:-dev}"

usage() {
  cat <<EOF
Usage: ./run.sh <command>

Commands:
  install    Install dependencies (npm install)
  dev        Start development server (default)
  build      Production build
  start      Start production server (run 'build' first)
  lint       Run ESLint
  typecheck  Run TypeScript check (tsc --noEmit)
  clean      Remove .next/ build cache
  help       Show this help
EOF
}

case "$action" in
  install)
    echo "📦 Installing dependencies..."
    npm install
    ;;
  dev)
    echo "🚀 Starting development server..."
    echo "    http://localhost:3000"
    npm run dev
    ;;
  build)
    echo "🏗️  Building for production..."
    npm run build
    ;;
  start)
    echo "🌐 Starting production server..."
    npm run start
    ;;
  lint)
    echo "🔍 Running ESLint..."
    npm run lint
    ;;
  typecheck)
    echo "🔎 Running TypeScript check..."
    npx tsc --noEmit
    ;;
  clean)
    echo "🧹 Cleaning build cache..."
    rm -rf .next
    ;;
  help|--help|-h)
    usage
    ;;
  *)
    echo "Unknown command: $action"
    echo
    usage
    exit 1
    ;;
esac
