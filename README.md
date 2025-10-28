# 🌐 Web3 Migration Tool

<div align="center">

![Web3 Migration Tool](https://img.shields.io/badge/Web3_Deployment-Platform-blueviolet?style=flat-square&logo=ethereum)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![Node Version](https://img.shields.io/badge/Node-18+-green?style=flat-square&logo=node.js)
![React Version](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)
![IPFS](https://img.shields.io/badge/IPFS-Enabled-65c2cb?style=flat-square&logo=ipfs)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

### 🚀 Deploy Frontend Applications to Decentralized IPFS in Seconds

**Transform your Web2 deployments into Web3 infrastructure**

[**Live Demo**](#) • [**Documentation**](#) • [**Report Bug**](#) • [**Request Feature**](#)

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#-technology-stack)
- [⚡ Quick Start](#-quick-start)
- [📖 Complete Setup Guide](#-complete-setup-guide)
- [🔄 How It Works](#-how-it-works)
- [📡 API Reference](#-api-reference)
- [🚀 Production Deployment](#-production-deployment)
- [🔒 Security & Best Practices](#-security--best-practices)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Overview

**Web3 Migration Tool** is a revolutionary deployment platform that enables developers to migrate their frontend applications from centralized Web2 hosting (AWS, DigitalOcean, Vercel) to decentralized Web3 infrastructure powered by IPFS.

### What Makes It Special?

✅ **Zero Crypto Knowledge Required** - No wallet, no tokens, no blockchain interactions  
✅ **One-Click Deployment** - Paste GitHub URL → Get live link  
✅ **Framework Detection** - Auto-detects React, Vue, Angular, Next.js, etc.  
✅ **Decentralized Storage** - Content stored across IPFS network  
✅ **Custom Domains** - Deploy with your own domain names  
✅ **Real-time Monitoring** - Live build status and deployment health  

---

## ✨ Key Features

### 🔗 GitHub Integration
- Deploy any public GitHub repository
- Support for custom branches
- Automatic repository cloning
- Build configuration auto-detection

### 🤖 Framework Auto-Detection
Automatically identifies and builds:
- React (Create React App & Vite)
- Vue.js (2 & 3)
- Angular (14+)
- Next.js (Static Export)
- Svelte
- Plain HTML/CSS/JS

### 📦 IPFS/Web3 Deployment
- Decentralized file storage
- Content addressing (IPFS Hash/CID)
- Multiple gateway access points
- Permanent content hosting
- No monthly fees (pay-per-use)

### 🌐 Custom Domain Support
- Connect your own domain
- SSL/TLS certificates included
- Unlimited subdomains
- Automatic DNS configuration

### 📊 Deployment Dashboard
- Real-time deployment status
- Build logs & error tracking
- Performance metrics
- Deployment history

### 🔐 Security Features
- JWT-based authentication
- Environment variable protection
- Secure GitHub integration
- Rate limiting

---

## 🛠️ Technology Stack

### **Frontend**
```
React 18 • Vite • TypeScript
Material-UI • Redux Toolkit • Three.js • React Router
```

### **Backend**
```
Node.js 18 • Express.js • PostgreSQL (Supabase)
JWT Authentication • IPFS Integration • Docker
```

### **Infrastructure**
```
IPFS Network • Pinata • Nginx • PM2 • AWS EC2
GitHub API • Let's Encrypt
```

---

## ⚡ Quick Start

### Prerequisites

```bash
# Required
- Node.js 18 or higher
- Git
- npm or yarn package manager

# Accounts needed
- Supabase (free) - https://supabase.com
- Pinata (free) - https://pinata.cloud
```

### 5-Minute Setup

```bash
# 1. Clone the repository
git clone https://github.com/MeghVyas3132/Web3-Migration-Tool.git
cd Web3-Migration-Tool

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies  
cd ../frontend
npm install

# 4. Configure environment (see next section)
cd ../backend
cp .env.example .env
# Edit .env with your Supabase & Pinata credentials

# 5. Start both servers
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev

# 6. Open browser
# Navigate to http://localhost:3000
```

✅ **Done!** Your deployment platform is running locally.

---

## 📖 Complete Setup Guide

### Step 1: Get Supabase Credentials

1. Visit [supabase.com](https://supabase.com) → Sign up → Create project
2. Go to **Settings** → **API**
3. Copy these values:
   ```
   Project URL → SUPABASE_URL
   anon public key → SUPABASE_ANON_KEY
   ```
4. Go to **SQL Editor** → Paste entire `backend/supabase-schema.sql` → Click **RUN**

### Step 2: Get Pinata IPFS Credentials

1. Visit [pinata.cloud](https://pinata.cloud) → Sign up
2. Click profile icon → **API Keys** → **+ New Key**
3. Set permissions:
   - ✅ `pinFileToIPFS`
   - ✅ `pinJSONToIPFS`
4. Copy:
   ```
   API Key → PINATA_API_KEY
   API Secret → PINATA_API_SECRET
   ```

### Step 3: Generate JWT Secret

```bash
# Generate cryptographic secret
openssl rand -base64 32

# Output example (copy this):
# aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH9i
```

### Step 4: Configure Environment

**Backend (`backend/.env`)**:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Authentication
JWT_SECRET=your-generated-secret-here
JWT_EXPIRE=30d

# IPFS Storage
PINATA_API_KEY=your-api-key
PINATA_API_SECRET=your-api-secret

# Gateway
IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs

# Optional - Production
BASE_DOMAIN=localhost
```

**Frontend (`frontend/.env`)**:
```env
VITE_API_URL=http://localhost:5000
```

### Step 5: Start Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Watch for changes (optional)
cd backend
npm run watch
```

✅ **Access app**: Open http://localhost:3000

---

## 🔄 How It Works

### User Journey

```
┌─────────────────┐
│  Enter GitHub   │
│  Repository URL │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Select Branch  │
│  & Domain Name  │
└────────┬────────┘
         │
         ▼
    ◉ DEPLOYING
         │
         ├─▶ Clone Repository
         │
         ├─▶ Detect Framework (React/Vue/Angular)
         │
         ├─▶ Install Dependencies
         │
         ├─▶ Build Project
         │
         ├─▶ Upload to IPFS
         │
         ├─▶ Configure Domain
         │
         └─▶ Save to Database
         │
         ▼
   ✅ DEPLOYMENT COMPLETE
   
Your app is live! 🎉
```

### What Happens Behind the Scenes

| Step | What We Do | Time |
|------|-----------|------|
| **Clone** | Download your GitHub repo | 5-10s |
| **Detect** | Identify React, Vue, etc. | 1s |
| **Install** | Run `npm install` | 30-60s |
| **Build** | Compile to optimized bundle | 30-120s |
| **Upload** | Send to IPFS network | 10-30s |
| **Config** | Setup domain routing | 5s |
| **Save** | Record in database | 1s |

### Supported Frameworks

| Framework | Auto-Build | Status |
|-----------|-----------|--------|
| React (CRA) | ✅ Yes | ✅ Supported |
| React (Vite) | ✅ Yes | ✅ Supported |
| Vue.js 2 & 3 | ✅ Yes | ✅ Supported |
| Angular 14+ | ✅ Yes | ✅ Supported |
| Next.js (Static) | ✅ Yes | ✅ Supported |
| Svelte | ✅ Yes | ✅ Supported |
| Remix | ⚠️ Partial | ⚠️ Experimental |
| Astro | ⚠️ Partial | ⚠️ Experimental |

---

## 📡 API Reference

### Authentication

#### Register New User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123"
}

Response: 201 Created
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "username": "johndoe" }
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "email": "john@example.com" }
}
```

### Deployments

#### Create New Deployment
```http
POST /api/v1/deployments
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "githubUrl": "https://github.com/username/my-app",
  "branch": "main"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "dep_123...",
    "ipfsCID": "QmXyZ...",
    "framework": "react",
    "status": "active",
    "githubUrl": "...",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

#### Get All Deployments
```http
GET /api/v1/deployments
Authorization: Bearer {jwt_token}

Response: 200 OK
{
  "success": true,
  "data": [
    { "id": "...", "framework": "react", ... },
    { "id": "...", "framework": "vue", ... }
  ]
}
```

#### Get Deployment Details
```http
GET /api/v1/deployments/:id
Authorization: Bearer {jwt_token}

Response: 200 OK
{
  "success": true,
  "data": { ... deployment details ... }
}
```

#### Delete Deployment
```http
DELETE /api/v1/deployments/:id
Authorization: Bearer {jwt_token}

Response: 200 OK
{
  "success": true,
  "message": "Deployment deleted"
}
```

---

## 🚀 Production Deployment

### Deploy to AWS EC2

#### Prerequisites
- AWS Account
- EC2 instance (Ubuntu 22.04 LTS, t2.medium or larger)
- Domain name
- SSH key pair

#### Installation Steps

```bash
# 1. Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# 2. Update system
sudo apt update && sudo apt upgrade -y

# 3. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git nginx certbot python3-certbot-nginx

# 4. Install PM2 (process manager)
sudo npm install -g pm2

# 5. Clone repository
git clone https://github.com/MeghVyas3132/Web3-Migration-Tool.git
cd Web3-Migration-Tool

# 6. Setup backend
cd backend
npm install
nano .env  # Add production credentials

# 7. Setup frontend
cd ../frontend
npm install
npm run build

# 8. Start backend with PM2
cd ../backend
pm2 start src/server.js --name "web3-backend" --env production
pm2 save
pm2 startup

# 9. Configure Nginx
sudo nano /etc/nginx/sites-available/web3-tool
```

**Nginx Configuration** (`/etc/nginx/sites-available/web3-tool`):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL certificates (from Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        root /home/ubuntu/Web3-Migration-Tool/frontend/dist;
        try_files $uri /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 10. Enable Nginx site
sudo ln -s /etc/nginx/sites-available/web3-tool /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 11. Setup SSL (Let's Encrypt)
sudo certbot --nginx -d yourdomain.com

# 12. Verify everything is running
pm2 status
sudo systemctl status nginx
```

✅ **Production is live**: https://yourdomain.com

---

## 🔒 Security & Best Practices

### Environment Variable Protection
```bash
# ❌ NEVER do this
export SUPABASE_KEY=sk_live_abc123xyz

# ✅ DO this
# Add to .env file (which is in .gitignore)
SUPABASE_ANON_KEY=sk_live_abc123xyz
```

### Database Security
- ✅ Row-Level Security (RLS) enabled
- ✅ Prepared statements (prevent SQL injection)
- ✅ Password hashing with bcrypt
- ✅ JWT tokens with expiration

### API Security
- ✅ CORS properly configured
- ✅ Rate limiting on authentication
- ✅ Input validation on all endpoints
- ✅ HTTPS enforced in production

### GitHub Integration Security
- ✅ Only accesses public repositories
- ✅ No credentials stored
- ✅ Build output isolated in temp directories
- ✅ Automatic cleanup after deployment

---

## 🐛 Troubleshooting

### Backend Issues

**"Cannot connect to Supabase"**
```bash
# Check credentials
cat backend/.env | grep SUPABASE

# Test connection
curl -X GET https://your-project.supabase.co/rest/v1/ \
  -H "apikey: your-key"
```

**"Port 5000 already in use"**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### Frontend Issues

**"Blank white page"**
1. Check browser console: `F12` → Console tab
2. Verify backend is running: `http://localhost:5000`
3. Check frontend env: `cat .env`

**"API calls failing"**
1. Verify backend is running: `pm2 status`
2. Check CORS settings
3. Verify token is valid

### Deployment Issues

**"Build failed"**
```bash
# Test build locally first
npm install
npm run build

# Check package.json has build script
cat package.json | grep "build"
```

**"IPFS upload failed"**
1. Verify Pinata credentials
2. Check Pinata dashboard for rate limits
3. Try uploading smaller file

---

## 🤝 Contributing

We'd love your contributions! Here's how:

### Getting Started
1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes
4. Commit: `git commit -m 'Add my feature'`
5. Push: `git push origin feature/my-feature`
6. Open Pull Request

### Development Guidelines
- Follow existing code style
- Write clear commit messages
- Test changes locally
- Update documentation

### Areas Needing Help
- [ ] Support for private repositories
- [ ] Build caching system
- [ ] GitLab integration
- [ ] Real-time deployment logs
- [ ] Analytics dashboard
- [ ] Automated testing

---

## 📂 Project Structure

```
Web3-Migration-Tool/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── supabase.js      # Database connection
│   │   │   └── ipfs.js          # IPFS client config
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── deploymentController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Deployment.js
│   │   ├── services/
│   │   │   ├── githubService.js
│   │   │   ├── ipfsService.js
│   │   │   └── dnsService.js
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT verification
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── deployments.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── supabase-schema.sql      # Database DDL
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── App.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
└── README.md                    # This file
```

---

## 📊 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    User Interface                             │
│                   (React 18 + Vite)                           │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTP/HTTPS
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    REST API Layer                             │
│              (Express.js + Node.js)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐    │
│  │ Auth Routes  │  │ Deploy Routes│  │ Health Check   │    │
│  └──────────────┘  └──────────────┘  └────────────────┘    │
└─────┬───────────────────────┬────────────────┬───────────────┘
      │                       │                │
      ▼                       ▼                ▼
┌────────────────┐   ┌──────────────┐   ┌──────────────┐
│  Supabase      │   │ GitHub API   │   │ Pinata IPFS  │
│  PostgreSQL    │   │ (Clone/Build)│   │ (Storage)    │
└────────────────┘   └──────────────┘   └──────────────┘
```

---

## 📚 Learning Resources

### Documentation
- [React Documentation](https://react.dev)
- [IPFS Docs](https://docs.ipfs.tech/)
- [Supabase Docs](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)

### Tutorials
- [Web3 Introduction](https://ethereum.org/en/developers/docs/web2-vs-web3/)
- [IPFS Basics](https://docs.ipfs.tech/concepts/what-is-ipfs/)
- [Decentralized Web](https://decentralized-web.org/)

---

## 📄 License

MIT License © 2025 Megh Vyas

See [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Megh Vyas**
- GitHub: [@MeghVyas3132](https://github.com/MeghVyas3132)
- Twitter: [@MeghVyas](https://twitter.com/MeghVyas)

---

## 🙌 Support

If this project helped you, please:
- ⭐ **Star** the repository
- 🍴 **Fork** it to your account
- 📢 **Share** with your network
- 💬 **Contribute** improvements

---

<div align="center">

### Made with ❤️ for the Decentralized Web

Deploy to Web3 in Seconds, Not Hours

[↑ Back to Top](#-web3-migration-tool)

</div>
