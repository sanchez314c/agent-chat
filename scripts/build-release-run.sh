#!/bin/bash

# AgentCHAT Build and Run Script
# Unified script for development, building, and running the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Parse arguments
DEV_MODE=false
BUILD_ONLY=false
PLATFORM="all"
CLEAN=true
QUICK=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dev)
            DEV_MODE=true
            shift
            ;;
        --build-only)
            BUILD_ONLY=true
            shift
            ;;
        --platform)
            PLATFORM="$2"
            shift 2
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        --no-clean)
            CLEAN=false
            shift
            ;;
        --quick)
            QUICK=true
            shift
            ;;
        --help)
            echo "AgentCHAT Build and Run Script"
            echo ""
            echo "Usage: ./build-release-run.sh [options]"
            echo ""
            echo "Options:"
            echo "  --dev          Run in development mode"
            echo "  --build-only   Build without running"
            echo "  --platform     Platform to build (mac, win, linux, all)"
            echo "  --clean        Clean before building (default)"
            echo "  --no-clean     Skip cleaning"
            echo "  --quick        Quick build for current platform"
            echo "  --help         Show this help"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Development mode
if [ "$DEV_MODE" = true ]; then
    print_info "Starting development mode..."
    npm run electron:dev
    exit 0
fi

# Build mode
print_info "Starting build process..."

# Clean if requested
if [ "$CLEAN" = true ]; then
    print_info "Cleaning build artifacts..."
    rm -rf dist/ release/
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm install
fi

# Build the application
if [ "$QUICK" = true ]; then
    print_info "Quick build for current platform..."
    npm run dist:current
elif [ "$PLATFORM" != "all" ]; then
    print_info "Building for $PLATFORM..."
    case $PLATFORM in
        mac)
            npm run dist:mac
            ;;
        win)
            npm run dist:win
            ;;
        linux)
            npm run dist:linux
            ;;
        *)
            print_error "Invalid platform: $PLATFORM"
            exit 1
            ;;
    esac
else
    print_info "Building for all platforms..."
    npm run dist:all
fi

print_success "Build completed!"

# Run if not build-only
if [ "$BUILD_ONLY" = false ]; then
    print_info "Launching application..."
    # This would need to be adjusted based on the built platform
    # For now, just show the dist directory
    ls -la dist/
fi