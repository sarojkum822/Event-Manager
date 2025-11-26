#!/bin/bash

# Backend Setup Script for Event Planner
# This script helps set up the backend environment

set -e

echo "🚀 Event Planner Backend Setup"
echo "================================"
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "✅ .env file found"
else
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file. Please update it with your credentials."
        echo ""
        echo "Required credentials:"
        echo "  - MongoDB Atlas URI"
        echo "  - Firebase Admin SDK credentials"
        echo "  - Razorpay API keys"
        echo "  - Cloudinary credentials"
        echo ""
        read -p "Press Enter to continue after updating .env file..."
    else
        echo "❌ .env.example not found. Please create .env manually."
        exit 1
    fi
fi

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Check pnpm
echo "Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm not found. Installing..."
    npm install -g pnpm
fi
echo "✅ pnpm version: $(pnpm -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Build shared package
echo ""
echo "🔨 Building shared package..."
cd ../../packages/shared
pnpm build
cd ../../apps/backend

# Verify environment variables
echo ""
echo "🔍 Verifying environment variables..."

source .env

MISSING_VARS=()

[ -z "$MONGODB_URI" ] && MISSING_VARS+=("MONGODB_URI")
[ -z "$FIREBASE_PROJECT_ID" ] && MISSING_VARS+=("FIREBASE_PROJECT_ID")
[ -z "$FIREBASE_PRIVATE_KEY" ] && MISSING_VARS+=("FIREBASE_PRIVATE_KEY")
[ -z "$FIREBASE_CLIENT_EMAIL" ] && MISSING_VARS+=("FIREBASE_CLIENT_EMAIL")
[ -z "$JWT_SECRET" ] && MISSING_VARS+=("JWT_SECRET")
[ -z "$CLOUDINARY_CLOUD_NAME" ] && MISSING_VARS+=("CLOUDINARY_CLOUD_NAME")
[ -z "$CLOUDINARY_API_KEY" ] && MISSING_VARS+=("CLOUDINARY_API_KEY")
[ -z "$CLOUDINARY_API_SECRET" ] && MISSING_VARS+=("CLOUDINARY_API_SECRET")

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "⚠️  Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please update your .env file with these values."
    echo "Note: Razorpay keys are optional for development."
else
    echo "✅ All required environment variables are set"
fi

# Test MongoDB connection
echo ""
echo "🔌 Testing MongoDB connection..."
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connection successful');
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    });
" || echo "⚠️  MongoDB connection test failed. Please check your MONGODB_URI."

echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Review and update .env file if needed"
echo "  2. Run 'pnpm dev' to start the development server"
echo "  3. Test API endpoints using API_TESTING.md"
echo ""
echo "Useful commands:"
echo "  pnpm dev      - Start development server"
echo "  pnpm build    - Build for production"
echo "  pnpm start    - Start production server"
echo "  pnpm seed     - Seed database with sample data"
echo ""
