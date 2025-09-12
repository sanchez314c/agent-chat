#!/bin/bash

# Run Compiled Binary on Linux
# Launches the compiled Linux app from dist folder

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

print_info() {
    echo -e "${CYAN}[$(date +'%H:%M:%S')] ℹ${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

print_status "🚀 Launching compiled AgentCHAT (Linux)..."

# Check if we're on Linux
if [ "$(uname)" != "Linux" ]; then
    print_error "This script is designed for Linux only"
    print_status "For other platforms:"
    print_status "  macOS: Use ./run-macos.sh"
    print_status "  Windows: Use run-windows.bat"
    exit 1
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
    print_error "No dist/ directory found. Please run ./scripts/compile-build-dist.sh first."
    exit 1
fi

# Function to launch different package types
launch_appimage() {
    local appimage="$1"
    
    # Make sure it's executable
    chmod +x "$appimage"
    
    # Check if we need to extract and run
    if [ -z "$DISPLAY" ]; then
        print_error "No display detected. Cannot run GUI application."
        exit 1
    fi
    
    print_status "Launching AppImage..."
    "$appimage" &
    print_success "AppImage launched successfully!"
}

launch_unpacked() {
    local exec_path="$1"
    
    # Make sure it's executable
    chmod +x "$exec_path"
    
    print_status "Launching unpacked application..."
    "$exec_path" &
    print_success "Application launched successfully!"
}

# Look for application in order of preference
APP_FOUND=false

# 1. Try AppImage first (most portable)
for appimage in dist/*AgentCHAT*.AppImage; do
    if [ -f "$appimage" ]; then
        print_info "Found AppImage: $(basename "$appimage")"
        launch_appimage "$appimage"
        APP_FOUND=true
        break
    fi
done

# 2. Try unpacked version
if [ "$APP_FOUND" = false ] && [ -d "dist/linux-unpacked" ]; then
    # Find the main executable
    EXEC_PATH=""
    if [ -f "dist/linux-unpacked/agentchat-electron" ]; then
        EXEC_PATH="dist/linux-unpacked/agentchat-electron"
    elif [ -f "dist/linux-unpacked/AgentCHAT" ]; then
        EXEC_PATH="dist/linux-unpacked/AgentCHAT"
    else
        # Try to find any executable
        EXEC_PATH=$(find dist/linux-unpacked -type f -executable | grep -v ".so" | head -1)
    fi
    
    if [ -n "$EXEC_PATH" ] && [ -f "$EXEC_PATH" ]; then
        print_info "Found unpacked executable: $(basename "$EXEC_PATH")"
        launch_unpacked "$EXEC_PATH"
        APP_FOUND=true
    fi
fi

# 3. Check for distribution packages
if [ "$APP_FOUND" = false ]; then
    print_warning "No runnable binary found. Found these packages instead:"
    
    for deb in dist/*.deb; do
        if [ -f "$deb" ]; then
            print_info "DEB package: $(basename "$deb")"
            print_info "  Install with: sudo dpkg -i $deb"
        fi
    done
    
    for rpm in dist/*.rpm; do
        if [ -f "$rpm" ]; then
            print_info "RPM package: $(basename "$rpm")"
            print_info "  Install with: sudo rpm -i $rpm"
        fi
    done
    
    for snap in dist/*.snap; do
        if [ -f "$snap" ]; then
            print_info "Snap package: $(basename "$snap")"
            print_info "  Install with: sudo snap install --dangerous $snap"
        fi
    done
    
    echo ""
    print_status "Install one of these packages to run the application system-wide"
    exit 1
fi

if [ "$APP_FOUND" = false ]; then
    print_error "Could not find any Linux binary in dist/ directory"
    print_warning "Available files in dist/:"
    
    if [ -d "dist" ]; then
        ls -la dist/ | head -20
    fi
    
    print_status ""
    print_status "To build the app first, run:"
    print_status "  ./scripts/compile-build-dist.sh"
    
    exit 1
fi

print_status "The application is running in the background"
print_status "Check your desktop or dock to interact with it"