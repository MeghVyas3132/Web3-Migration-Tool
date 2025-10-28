#!/bin/bash

# Web3 Migration Tool - Deployment Script

set -e

echo "🚀 Deploying Web3 Migration Tool..."

# Navigate to docker directory
cd "$(dirname "$0")/../docker"

# Pull latest images
echo "📥 Pulling latest images..."
docker-compose pull

# Build images
echo "🔨 Building images..."
docker-compose build

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start services
echo "▶️  Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "🔍 Checking service status..."
docker-compose ps

echo "✅ Deployment complete!"
echo ""
echo "Services:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:5000"
echo "- MongoDB: localhost:27017"
echo ""
echo "View logs: docker-compose logs -f"
