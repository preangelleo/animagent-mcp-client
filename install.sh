#!/bin/bash

# AnimAgent MCP Client - One-Click Installer
# This script sets up everything needed for the AnimAgent MCP Client

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print colored message
print_message() {
    echo -e "${GREEN}[AnimAgent]${NC} $1"
}

print_error() {
    echo -e "${RED}[Error]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[Warning]${NC} $1"
}

# Welcome message
echo ""
echo "🚀 AnimAgent MCP Client Installer"
echo "================================="
echo ""

# Check if Node.js is installed
print_message "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required (current: $(node -v))"
    exit 1
fi
print_message "✓ Node.js $(node -v) detected"

# Install dependencies
print_message "Installing dependencies..."
npm install --silent || {
    print_error "Failed to install dependencies"
    exit 1
}
print_message "✓ Dependencies installed"

# Check if .env exists
if [ ! -f ".env" ]; then
    print_message "Setting up environment..."
    
    # Copy .env.example to .env
    cp .env.example .env
    
    # Ask for user credentials
    echo ""
    print_warning "Please enter your AnimAgent credentials"
    print_warning "You can find these at https://app.sumatman.ai/welcome"
    echo ""
    
    read -p "Enter your User ID: " USER_ID
    read -p "Enter your Email: " USER_EMAIL
    
    # Update .env file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your_user_id_here/$USER_ID/g" .env
        sed -i '' "s/your_email@example.com/$USER_EMAIL/g" .env
    else
        # Linux
        sed -i "s/your_user_id_here/$USER_ID/g" .env
        sed -i "s/your_email@example.com/$USER_EMAIL/g" .env
    fi
    
    print_message "✓ Environment configured"
else
    print_message "✓ Using existing .env file"
fi

# Run setup
print_message "Configuring Claude Desktop..."
npm run setup || {
    print_error "Setup failed"
    exit 1
}

# Success message
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_message "🎉 Installation Complete!"
echo ""
echo "Next steps:"
echo "1. Restart Claude Desktop"
echo "2. Look for 'animagent' in the MCP servers list"
echo "3. Try: \"Create a 30-second animation about a magical forest\""
echo ""
echo "Need help? Visit: https://github.com/preangelleo/animagent-mcp-server"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"