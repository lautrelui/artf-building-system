#!/bin/bash

echo "========================================="
echo "ARTF Building System - Setup Script"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✓ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

echo "✓ Dependencies installed successfully"
echo ""

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads
chmod 755 uploads
echo "✓ Uploads directory created"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and configure:"
    echo "   - Database credentials"
    echo "   - DeepSeek API key"
    echo "   - Session secret"
else
    echo "✓ .env file already exists"
fi

echo ""
echo "========================================="
echo "Setup completed successfully!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Ensure MySQL is running"
echo "3. Initialize database: mysql -u root -p < database/init.sql"
echo "4. Start the application:"
echo "   - Development: npm run dev"
echo "   - Production: npm start"
echo "   - Docker: npm run docker:up"
echo ""
echo "Application will be available at: http://localhost:3000"
echo ""
