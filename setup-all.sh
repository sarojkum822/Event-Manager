#!/bin/bash

# Event Planner - Complete Setup Script
# This script sets up both frontend and backend

set -e

echo "🎉 Event Planner - Complete Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the project root
if [ ! -d "apps/frontend" ] || [ ! -d "apps/backend" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo "📦 Step 1: Installing Dependencies"
echo "-----------------------------------"
pnpm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo "🔧 Step 2: Setting up Backend Environment"
echo "------------------------------------------"

# Check if backend .env exists
if [ ! -f "apps/backend/.env" ]; then
    echo "Creating backend .env file..."
    cp apps/backend/.env.example apps/backend/.env
    echo -e "${YELLOW}⚠️  Please update apps/backend/.env with your credentials:${NC}"
    echo "   - MONGODB_URI (required)"
    echo "   - Firebase credentials (required)"
    echo "   - Cloudinary credentials (optional)"
    echo "   - Razorpay credentials (optional)"
    echo ""
    read -p "Press Enter after updating the .env file..."
else
    echo -e "${GREEN}✅ Backend .env file exists${NC}"
fi

echo ""
echo "🔧 Step 3: Setting up Frontend Environment"
echo "-------------------------------------------"

# Check if frontend .env.local exists
if [ ! -f "apps/frontend/.env.local" ]; then
    echo "Creating frontend .env.local file..."
    cp apps/frontend/env.example apps/frontend/.env.local
    echo -e "${YELLOW}⚠️  Please update apps/frontend/.env.local with your Firebase credentials${NC}"
    echo ""
    read -p "Press Enter after updating the .env.local file..."
else
    echo -e "${GREEN}✅ Frontend .env.local file exists${NC}"
fi

echo ""
echo "🔨 Step 4: Building Shared Package"
echo "-----------------------------------"
cd packages/shared
pnpm build
cd ../..
echo -e "${GREEN}✅ Shared package built${NC}"

echo ""
echo "🧪 Step 5: Testing Backend Connection"
echo "--------------------------------------"
echo "Starting backend server to test MongoDB connection..."

# Start backend in background
cd apps/backend
pnpm dev > /tmp/backend-test.log 2>&1 &
BACKEND_PID=$!
cd ../..

# Wait a bit for server to start
sleep 5

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    # Check the logs
    if grep -q "MongoDB connected successfully" /tmp/backend-test.log; then
        echo -e "${GREEN}✅ Backend server started successfully${NC}"
        echo -e "${GREEN}✅ MongoDB connected${NC}"
        BACKEND_OK=true
    else
        echo -e "${RED}❌ MongoDB connection failed${NC}"
        echo "Last 10 lines of backend log:"
        tail -10 /tmp/backend-test.log
        BACKEND_OK=false
    fi
    
    # Stop the test backend
    kill $BACKEND_PID 2>/dev/null || true
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    cat /tmp/backend-test.log
    BACKEND_OK=false
fi

echo ""
echo "=================================="
echo "🎯 Setup Complete!"
echo "=================================="
echo ""

if [ "$BACKEND_OK" = true ]; then
    echo -e "${GREEN}✅ Everything is configured correctly!${NC}"
    echo ""
    echo "🚀 To start the application:"
    echo ""
    echo "Option 1 - Start both (recommended):"
    echo "  pnpm dev"
    echo ""
    echo "Option 2 - Start separately:"
    echo "  Terminal 1: cd apps/backend && pnpm dev"
    echo "  Terminal 2: cd apps/frontend && pnpm dev"
    echo ""
    echo "📱 Access the application:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:5000"
    echo ""
else
    echo -e "${YELLOW}⚠️  Setup completed with warnings${NC}"
    echo ""
    echo "Please fix the MongoDB connection issue:"
    echo "1. Update MONGODB_URI in apps/backend/.env"
    echo "2. Ensure your MongoDB Atlas cluster is accessible"
    echo "3. Whitelist your IP address in MongoDB Atlas"
    echo "4. Run this script again to verify"
    echo ""
fi

echo "📚 Documentation:"
echo "  - API Docs: See artifacts/API_DOCUMENTATION.md"
echo "  - Troubleshooting: See artifacts/TROUBLESHOOTING.md"
echo ""
