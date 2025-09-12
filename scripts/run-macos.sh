#!/bin/bash

# Run Compiled Binary on macOS
# Launches the compiled macOS app from dist/release folder

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the script directory and go to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] ✔${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ✗${NC} $1"
}

print_status "🚀 Launching compiled AgentCHAT (macOS)..."

# Check if we're on macOS
if [ "$(uname)" != "Darwin" ]; then
    print_error "This script is designed for macOS only"
    print_status "For other platforms:"
    print_status "  Windows: Use run-windows.bat"
    print_status "  Linux: Use ./run-linux.sh"
    exit 1
fi

# Check for build directories
BUILD_DIR=""
if [ -d "release" ]; then
    BUILD_DIR="release"
elif [ -d "dist" ]; then
    BUILD_DIR="dist"
else
    print_error "No dist/ or release/ directory found. Please run ./scripts/compile-build-dist.sh first."
    exit 1
fi

# Detect system architecture
ARCH=$(uname -m)
APP_PATH=""

# Look for the app in various possible locations
if [ "$ARCH" = "arm64" ]; then
    print_status "Detected Apple Silicon Mac (ARM64)"
    # Check for ARM64 app first
    for dir in "$BUILD_DIR/mac-arm64" "$BUILD_DIR/*/mac-arm64" "$BUILD_DIR"; do
        if [ -d "$dir" ]; then
            APP_PATH=$(find "$dir" -name "AgentCHAT.app" -o -name "agentchat-electron.app" -type d 2>/dev/null | head -n 1)
            [ -n "$APP_PATH" ] && break
        fi
    done
fi

# If no ARM64 app or Intel Mac, look for regular Mac app
if [ -z "$APP_PATH" ]; then
    [ "$ARCH" != "arm64" ] && print_status "Detected Intel Mac (x64)"
    for dir in "$BUILD_DIR/mac" "$BUILD_DIR/*/mac" "$BUILD_DIR"; do
        if [ -d "$dir" ]; then
            APP_PATH=$(find "$dir" -name "AgentCHAT.app" -o -name "agentchat-electron.app" -type d 2>/dev/null | head -n 1)
            [ -n "$APP_PATH" ] && break
        fi
    done
fi

# Launch the app if found
if [ -n "$APP_PATH" ] && [ -d "$APP_PATH" ]; then
    print_success "Found application: $(basename "$APP_PATH")"
    print_status "Launching..."
    
    # Launch the app
    open "$APP_PATH"
    
    print_success "Application launched successfully!"
    print_status "The app is now running"
else
    print_error "Could not find .app bundle in $BUILD_DIR/ directory"
    print_warning "Available files in $BUILD_DIR/:"
    
    if [ -d "$BUILD_DIR" ]; then
        ls -la "$BUILD_DIR/" | head -20
    fi
    
    print_status ""
    print_status "To build the app first, run:"
    print_status "  ./scripts/compile-build-dist.sh"
    
    exit 1
fi