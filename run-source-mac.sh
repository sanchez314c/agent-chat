#!/bin/bash
#
# AgentCHAT - macOS Source Runner
# Clean start script with port management
#

set -e

# ============================================
# PORT CONFIGURATION (Random High Ports)
# ============================================
ELECTRON_DEBUG_PORT=59847
ELECTRON_INSPECT_PORT=61293
DEV_SERVER_PORT=58743

# ============================================
# COLORS
# ============================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# ============================================
# FUNCTIONS
# ============================================

print_header() {
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║              AgentCHAT - macOS Source Runner              ║"
    echo "║           Multi-Agent AI Conversation Platform            ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

check_and_kill_port() {
    local port=$1
    local name=$2
    local pids=$(lsof -ti :$port 2>/dev/null || true)

    if [ -n "$pids" ]; then
        echo -e "${YELLOW}[CLEANUP]${NC} Killing process(es) on port $port ($name) - PIDs: $pids"
        echo "$pids" | xargs -r kill -9 2>/dev/null || true
        sleep 0.5
    fi
}

check_dependencies() {
    echo -e "${BLUE}[CHECK]${NC} Verifying dependencies..."

    if ! command -v node &> /dev/null; then
        echo -e "${RED}[ERROR]${NC} Node.js is not installed!"
        exit 1
    fi
    echo -e "${GREEN}[OK]${NC} Node.js $(node --version)"

    if ! command -v npm &> /dev/null; then
        echo -e "${RED}[ERROR]${NC} npm is not installed!"
        exit 1
    fi
    echo -e "${GREEN}[OK]${NC} npm $(npm --version)"

    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}[SETUP]${NC} Installing dependencies..."
        npm install
    fi
}

# ============================================
# MAIN EXECUTION
# ============================================

cd "$(dirname "$0")"

print_header

echo -e "${BLUE}[INFO]${NC} Working directory: $(pwd)"
echo -e "${BLUE}[INFO]${NC} Configured ports:"
echo "  - Dev Server:       $DEV_SERVER_PORT"
echo "  - Electron Debug:   $ELECTRON_DEBUG_PORT"
echo "  - Electron Inspect: $ELECTRON_INSPECT_PORT"
echo ""

# Cleanup phase
echo -e "${CYAN}━━━ CLEANUP PHASE ━━━${NC}"
check_and_kill_port $DEV_SERVER_PORT "Dev Server"
check_and_kill_port $ELECTRON_DEBUG_PORT "Electron Debug"
echo ""

# Verification phase
echo -e "${CYAN}━━━ VERIFICATION PHASE ━━━${NC}"
check_dependencies
echo ""

# Launch phase
echo -e "${CYAN}━━━ LAUNCH PHASE ━━━${NC}"
echo -e "${GREEN}[START]${NC} Launching AgentCHAT..."
echo ""

export ELECTRON_DEBUG_PORT=$ELECTRON_DEBUG_PORT
export ELECTRON_INSPECT_PORT=$ELECTRON_INSPECT_PORT
export DEV_SERVER_PORT=$DEV_SERVER_PORT

if [ "$1" = "--dev" ] || [ "$1" = "-d" ]; then
    echo -e "${BLUE}[MODE]${NC} Development mode with DevTools"
    npm run dev &
    VITE_PID=$!
    npx wait-on tcp:$DEV_SERVER_PORT -t 30000
    echo -e "${GREEN}[READY]${NC} Vite server is up! Launching Electron..."
    NODE_ENV=development npx electron . --remote-debugging-port=$ELECTRON_DEBUG_PORT --inspect=$ELECTRON_INSPECT_PORT
    kill $VITE_PID 2>/dev/null || true
else
    echo -e "${GREEN}[MODE]${NC} Standard development mode"
    npm run electron:dev
fi
