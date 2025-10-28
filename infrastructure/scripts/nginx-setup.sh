#!/bin/bash

# Nginx Setup Script for Web3 Migration Tool
# This script helps test Nginx configuration locally

echo "🔧 Nginx Configuration Helper"
echo "================================"
echo ""

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "❌ Nginx is not installed"
    echo ""
    echo "To install Nginx:"
    echo "  macOS:   brew install nginx"
    echo "  Ubuntu:  sudo apt install nginx"
    echo "  CentOS:  sudo yum install nginx"
    exit 1
fi

echo "✅ Nginx is installed: $(nginx -v 2>&1)"
echo ""

# Check Nginx config directories
NGINX_AVAILABLE="/usr/local/etc/nginx/sites-available"
NGINX_ENABLED="/usr/local/etc/nginx/sites-enabled"

# macOS Homebrew paths
if [ -d "/opt/homebrew/etc/nginx" ]; then
    NGINX_AVAILABLE="/opt/homebrew/etc/nginx/sites-available"
    NGINX_ENABLED="/opt/homebrew/etc/nginx/sites-enabled"
fi

# Linux paths
if [ -d "/etc/nginx/sites-available" ]; then
    NGINX_AVAILABLE="/etc/nginx/sites-available"
    NGINX_ENABLED="/etc/nginx/sites-enabled"
fi

echo "📁 Nginx configuration paths:"
echo "   Available: $NGINX_AVAILABLE"
echo "   Enabled:   $NGINX_ENABLED"
echo ""

# Create directories if they don't exist (for macOS)
if [ ! -d "$NGINX_AVAILABLE" ]; then
    echo "Creating $NGINX_AVAILABLE"
    sudo mkdir -p "$NGINX_AVAILABLE"
fi

if [ ! -d "$NGINX_ENABLED" ]; then
    echo "Creating $NGINX_ENABLED"
    sudo mkdir -p "$NGINX_ENABLED"
fi

echo ""
echo "📝 Sample Nginx configuration for local testing:"
echo ""
echo "Save this to $NGINX_AVAILABLE/web3-local:"
echo ""
cat << 'EOF'
server {
    listen 8080;
    server_name localhost;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 For AWS deployment, see AWS_DEPLOYMENT.md"
echo ""
echo "💡 Local testing (without Nginx):"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend:  http://localhost:5000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
