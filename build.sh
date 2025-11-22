#!/bin/bash

# Production Build Script for PIMS Frontend

echo "🚀 Building PIMS Frontend for Production..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm run test:ci

# Check if tests passed
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Build aborted."
    exit 1
fi

# Build for production
echo "🏗️ Building for production..."
npm run build:prod

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Production build completed successfully!"
    echo "📁 Build files are in the 'build' directory"
    echo "🌐 You can preview the build by running: npm run preview"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi