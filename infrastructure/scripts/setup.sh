#!/bin/bash

# Web3 Migration Tool - Setup Script

set -e

echo "🚀 Setting up Web3 Migration Tool..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup frontend
echo "📦 Setting up frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
cp .env.example .env 2>/dev/null || true
cd ..

# Setup backend
echo "📦 Setting up backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cp .env.example .env 2>/dev/null || true
mkdir -p uploads
cd ..

# Setup Docker environment
echo "🐳 Setting up Docker environment..."
cd infrastructure/docker
if [ ! -f ".env" ]; then
    cat > .env << EOF
JWT_SECRET=$(openssl rand -base64 32)
IPFS_HOST=ipfs.infura.io
IPFS_PORT=5001
IPFS_PROTOCOL=https
IPFS_PROJECT_ID=your-infura-project-id
IPFS_PROJECT_SECRET=your-infura-project-secret
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ZONE_ID=your-zone-id
BASE_DOMAIN=web3host.xyz
EOF
fi
cd ../..

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env files in frontend/ and backend/ directories"
echo "2. Update infrastructure/docker/.env with your API credentials"
echo "3. Run 'npm run dev' in frontend/ and backend/ directories for development"
echo "4. Or run 'docker-compose up' in infrastructure/docker/ for production"
echo ""
echo "📚 Check SETUP.md for detailed instructions"
