#!/bin/bash

echo "🔍 Checking all dependencies..."
echo ""

# Check backend
echo "📦 Backend Dependencies:"
cd backend
MISSING_BACKEND=0

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found! Run: npm install"
    MISSING_BACKEND=1
else
    # Check critical dependencies
    deps=("express" "dotenv" "@supabase/supabase-js" "bcryptjs" "jsonwebtoken" "multer" "cors" "helmet" "morgan" "axios" "winston")
    
    for dep in "${deps[@]}"; do
        if [ ! -d "node_modules/$dep" ]; then
            echo "❌ Missing: $dep"
            MISSING_BACKEND=1
        fi
    done
    
    if [ $MISSING_BACKEND -eq 0 ]; then
        echo "✅ All backend dependencies installed!"
    fi
fi

cd ..

# Check frontend
echo ""
echo "📦 Frontend Dependencies:"
cd frontend
MISSING_FRONTEND=0

if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found! Run: npm install"
    MISSING_FRONTEND=1
else
    # Check critical dependencies
    deps=("react" "react-dom" "react-router-dom" "@reduxjs/toolkit" "react-redux" "@mui/material" "three" "@react-three/fiber" "axios" "vite")
    
    for dep in "${deps[@]}"; do
        if [ ! -d "node_modules/$dep" ]; then
            echo "❌ Missing: $dep"
            MISSING_FRONTEND=1
        fi
    done
    
    if [ $MISSING_FRONTEND -eq 0 ]; then
        echo "✅ All frontend dependencies installed!"
    fi
fi

cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $MISSING_BACKEND -eq 0 ] && [ $MISSING_FRONTEND -eq 0 ]; then
    echo "🎉 All dependencies are installed!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Configure .env files (see SUPABASE_SETUP.md)"
    echo "2. Run backend: cd backend && npm run dev"
    echo "3. Run frontend: cd frontend && npm run dev"
else
    echo "⚠️  Some dependencies are missing!"
    echo ""
    if [ $MISSING_BACKEND -eq 1 ]; then
        echo "Run: cd backend && npm install"
    fi
    if [ $MISSING_FRONTEND -eq 1 ]; then
        echo "Run: cd frontend && npm install"
    fi
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
