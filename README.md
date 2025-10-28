# 🚀 Web3 Migration Tool

> Deploy your frontend applications from GitHub to decentralized IPFS hosting - No crypto wallet required!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB.svg)](https://reactjs.org/)
[![IPFS](https://img.shields.io/badge/IPFS-Powered-65c2cb.svg)](https://ipfs.tech/)

**🎯 What is this?** A deployment platform that helps you migrate from Web2 hosting (AWS, DigitalOcean) to Web3 decentralized storage (IPFS). Just paste your GitHub URL, and we handle the rest!

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Setup Guide](#setup-guide)
- [How It Works](#how-it-works)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔗 **GitHub Integration** | Deploy directly from any public GitHub repository |
| 🤖 **Auto-Build** | Automatic framework detection and building (React, Vue, Angular, Next.js, Svelte) |
| 🌐 **Custom Subdomains** | Get `yoursite.yourdomain.com` subdomain automatically |
| 💰 **No Crypto Needed** | Zero crypto knowledge or wallet required |
| 🎨 **3D Dashboard** | Beautiful Three.js visualization of your deployments |
| 📦 **IPFS Storage** | Decentralized, censorship-resistant file storage |
| 🔐 **JWT Auth** | Secure authentication system |
| 📊 **Real-time Status** | Live deployment progress and health monitoring |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** - Fast development and building
- **Material-UI** - Beautiful UI components
- **Three.js** + **React Three Fiber** - 3D visualizations
- **Redux Toolkit** - State management
- **React Router** - Navigation

### Backend
- **Node.js** + **Express** - REST API
- **Supabase (PostgreSQL)** - Cloud database
- **JWT** - Authentication
- **IPFS (Infura)** - Decentralized storage
- **Nginx** - Subdomain routing (for AWS deployment)

### Infrastructure
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **PM2** - Process management
- **AWS EC2** - Production hosting

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Git
- Supabase account (free at [supabase.com](https://supabase.com))
- Infura IPFS account (free at [infura.io](https://infura.io))

### 1. Clone Repository
```bash
git clone https://github.com/MeghVyas3132/Web3-Migration-Tool.git
cd Web3-Migration-Tool
```

### 2. Setup Backend
```bash
cd backend
npm install

# Generate JWT secret
openssl rand -base64 32

# Copy to .env file
nano .env
```

**Edit `backend/.env`:**
```env
PORT=5000
NODE_ENV=development

# Supabase (Get from https://supabase.com)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# JWT Secret (paste generated secret above)
JWT_SECRET=your-generated-secret-here
JWT_EXPIRE=30d

# Infura IPFS (Get from https://infura.io)
IPFS_HOST=ipfs.infura.io
IPFS_PORT=5001
IPFS_PROTOCOL=https
IPFS_PROJECT_ID=your-project-id
IPFS_PROJECT_SECRET=your-project-secret

# IPFS Gateway
IPFS_GATEWAY=https://ipfs.io/ipfs

# Nginx (for production)
BASE_DOMAIN=localhost
NGINX_CONFIG_PATH=/etc/nginx/sites-available
NGINX_ENABLED_PATH=/etc/nginx/sites-enabled
```

### 3. Setup Database (Supabase)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Go to **Settings** → **API**
   - Copy **Project URL** and **anon public** key

2. **Run Database Schema**
   - Go to **SQL Editor** in Supabase dashboard
   - Copy contents of `backend/supabase-schema.sql`
   - Paste and click **RUN**

### 4. Setup Frontend
```bash
cd ../frontend
npm install

# No .env needed for local development!
```

### 5. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

🎉 **Open** `http://localhost:3000`

---

## 📖 Setup Guide

### Getting Supabase Credentials

1. **Sign up** at [supabase.com](https://supabase.com)
2. **Create project** → Set password → Select region
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
5. Go to **SQL Editor** → Paste `backend/supabase-schema.sql` → **RUN**

### Getting Infura IPFS Credentials

1. **Sign up** at [infura.io](https://infura.io)
2. **Create New Key** → Select **IPFS**
3. Name it (e.g., "Web3 Migration Tool")
4. Copy:
   - **PROJECT ID** → `IPFS_PROJECT_ID`
   - **PROJECT SECRET** → `IPFS_PROJECT_SECRET`

### Generate JWT Secret
```bash
openssl rand -base64 32
# Copy output to JWT_SECRET in .env
```

---

## 🔄 How It Works

### User Workflow
```
1. User pastes GitHub repo URL
2. Selects branch (main, develop, etc.)
3. Chooses subdomain name
4. Clicks "Deploy Now"
```

### Backend Process
```
GitHub URL → Clone Repo → Detect Framework (React/Vue/Angular) →
Install Dependencies (npm install) → Build Project (npm run build) →
Upload to IPFS → Get IPFS Hash (CID) → Configure Subdomain →
Save to Database → Deployment Live! ✅
```

### What We Support

#### ✅ Supported Frameworks
| Framework | Build Command | Build Output |
|-----------|---------------|--------------|
| React (CRA) | `npm run build` | `/build` |
| React (Vite) | `npm run build` | `/dist` |
| Vue.js | `npm run build` | `/dist` |
| Angular | `ng build --prod` | `/dist` |
| Next.js (Static) | `next export` | `/out` |
| Svelte | `npm run build` | `/public` |
| HTML/CSS/JS | None | Root |

#### ❌ Not Supported (Server-Side)
- PHP, Python, Ruby backends
- Next.js with SSR
- Any server that needs `npm start` in production

---

## 📡 API Documentation

### Authentication

**Register**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Login**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}

Response: { "token": "jwt_token_here", "user": {...} }
```

### Deployments

**Create Deployment**
```http
POST /api/v1/deployments
Authorization: Bearer {token}
Content-Type: application/json

{
  "githubUrl": "https://github.com/username/repo",
  "branch": "main",
  "subdomain": "my-app"
}

Response: { "id": "...", "ipfsCID": "QmXyZ...", "status": "building" }
```

**Get All Deployments**
```http
GET /api/v1/deployments
Authorization: Bearer {token}
```

**Get Single Deployment**
```http
GET /api/v1/deployments/:id
Authorization: Bearer {token}
```

**Delete Deployment**
```http
DELETE /api/v1/deployments/:id
Authorization: Bearer {token}
```

**Check Subdomain Availability**
```http
POST /api/v1/subdomains/verify
Content-Type: application/json

{
  "subdomain": "my-app"
}

Response: { "available": true }
```

---

## 🚀 Deployment to AWS

### Prerequisites
- AWS Account
- Domain name
- SSH key pair

### Step 1: Launch EC2 Instance
```bash
# Ubuntu 22.04 LTS
# t2.medium or larger
# Open ports: 22, 80, 443, 3000, 5000
```

### Step 2: Connect and Setup
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

### Step 3: Clone and Configure
```bash
git clone https://github.com/MeghVyas3132/Web3-Migration-Tool.git
cd Web3-Migration-Tool

# Backend
cd backend
npm install
nano .env  # Add production credentials

# Frontend
cd ../frontend
npm install
npm run build
```

### Step 4: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/web3-tool

# Add:
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /home/ubuntu/Web3-Migration-Tool/frontend/dist;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/web3-tool /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Setup SSL (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Step 6: Start with PM2
```bash
cd ~/Web3-Migration-Tool/backend
pm2 start src/server.js --name web3-backend
pm2 save
pm2 startup
```

### Step 7: Configure DNS
In your domain registrar (GoDaddy, Namecheap, etc.):
```
Type: A
Name: @
Value: your-ec2-ip
TTL: 300

Type: A
Name: *
Value: your-ec2-ip
TTL: 300
```

🎉 **Your app is live!** Visit `https://yourdomain.com`

---

## 🔒 Security

### Environment Variables
**NEVER commit `.env` files!** They are in `.gitignore`.

### Required Security Steps

1. **Generate Strong JWT Secret**
```bash
openssl rand -base64 32
```

2. **Protect Credentials**
   - Keep Supabase keys private
   - Keep Infura keys private
   - Use different secrets for dev/prod

3. **Update `.gitignore`**
```
.env
.env.local
.env.production
infrastructure/docker/.env
```

4. **AWS Security**
   - Use IAM roles
   - Enable CloudWatch logging
   - Set up security groups properly
   - Use AWS Secrets Manager for production

### What's Protected
- ✅ `.env` files gitignored
- ✅ No hardcoded credentials in code
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens expire after 30 days
- ✅ CORS configured properly

---

## 🐛 Troubleshooting

### Backend won't start

**Error: Cannot connect to database**
```bash
# Check Supabase credentials
cat backend/.env | grep SUPABASE

# Test connection
curl -X GET https://your-project.supabase.co/rest/v1/ \
  -H "apikey: your-anon-key"
```

**Error: Port 5000 already in use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Frontend issues

**Blank page**
- Check browser console for errors
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend/.env

**3D scene not loading**
- Three.js works with JavaScript (no TypeScript needed)
- Check browser WebGL support: visit `get.webgl.org`

### Deployment issues

**Build failed**
- Test build locally first: `npm install && npm run build`
- Check build logs in deployment details
- Ensure `package.json` has `build` script

**Clone failed**
- Repository must be public
- Check URL format: `https://github.com/user/repo`
- Try adding `.git`: `https://github.com/user/repo.git`

**IPFS upload failed**
- Check Infura credentials
- Verify project is active on Infura dashboard
- Try uploading a small file first

### Common Fixes
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear PM2 logs
pm2 flush

# Restart Nginx
sudo systemctl restart nginx

# Check logs
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

---

## 📂 Project Structure

```
Web3-Migration-Tool/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── supabase.js       # Database connection
│   │   │   └── ipfs.js           # IPFS client
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── deploymentController.js
│   │   ├── models/
│   │   │   ├── User.js           # Supabase user model
│   │   │   └── Deployment.js     # Supabase deployment model
│   │   ├── services/
│   │   │   ├── githubService.js  # GitHub integration
│   │   │   ├── ipfsService.js    # IPFS uploads
│   │   │   └── dnsService.js     # Nginx subdomain config
│   │   ├── middleware/
│   │   │   └── auth.js           # JWT verification
│   │   ├── routes/
│   │   └── server.js
│   ├── .env                       # Your credentials (gitignored)
│   ├── .env.example               # Template
│   ├── package.json
│   └── supabase-schema.sql        # Database schema
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── FileUpload.jsx    # GitHub URL input
│   │   │   ├── Scene3D.jsx       # Three.js 3D scene
│   │   │   └── DeploymentCard.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DeploymentPage.jsx
│   │   │   ├── DeploymentDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   ├── api.js            # Axios instance
│   │   │   ├── authService.js
│   │   │   └── deploymentService.js
│   │   ├── store/
│   │   │   ├── store.js          # Redux store
│   │   │   └── slices/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── infrastructure/
│   ├── docker/
│   │   ├── docker-compose.yml
│   │   └── .env.example
│   └── scripts/
│
└── README.md                      # This file!
```

---

## 🤝 Contributing

We welcome contributions!

### How to Contribute

1. **Fork the repository**
2. **Create a branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** and **commit**: `git commit -m 'Add amazing feature'`
4. **Push**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Coding Standards
- Use ESLint configuration provided
- Write clear commit messages
- Add comments for complex logic
- Test your changes locally

### Areas We Need Help
- [ ] Add support for private GitHub repositories (OAuth)
- [ ] Implement build caching for faster deployments
- [ ] Add GitLab and Bitbucket support
- [ ] Real-time build log streaming
- [ ] Support for environment variables in deployments
- [ ] Automated testing improvements

---

## 📊 System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  Express API   │────▶│   Supabase DB   │
│  (Port 3000)    │     │  (Port 5000)    │     │   (PostgreSQL)  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ├─────────────────┐
                               │                 │
                               ▼                 ▼
                    ┌─────────────────┐  ┌──────────────┐
                    │                 │  │              │
                    │  GitHub API     │  │  IPFS/Infura │
                    │  (Clone Repos)  │  │  (Storage)   │
                    │                 │  │              │
                    └─────────────────┘  └──────────────┘
```

### Deployment Flow
```
User Input (GitHub URL) → Clone Repository → Detect Framework →
Install Dependencies → Build Project → Upload to IPFS →
Generate IPFS Hash (CID) → Configure Nginx Subdomain →
Save to Supabase → Return Deployment URL
```

---

## 🎓 Learning Resources

### For React Beginners
- [React Official Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Redux Toolkit](https://redux-toolkit.js.org)

### For IPFS/Web3
- [IPFS Documentation](https://docs.ipfs.tech)
- [What is IPFS?](https://docs.ipfs.tech/concepts/what-is-ipfs/)
- [Infura IPFS](https://docs.infura.io/infura/networks/ipfs)

### For Deployment
- [Nginx Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Let's Encrypt](https://letsencrypt.org/getting-started/)

---

## 📝 License

This project is licensed under the **MIT License** - see below:

```
MIT License

Copyright (c) 2025 Megh Vyas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Author

**Megh Vyas**  
- GitHub: [@MeghVyas3132](https://github.com/MeghVyas3132)
- Project: [Web3-Migration-Tool](https://github.com/MeghVyas3132/Web3-Migration-Tool)

---

## 🙏 Acknowledgments

- **Supabase** - Amazing PostgreSQL database platform
- **Infura** - IPFS infrastructure
- **React Three Fiber** - 3D graphics in React
- **Material-UI** - Beautiful React components
- **Vite** - Lightning-fast build tool

---

## ⭐ Star History

If this project helped you, please give it a star! ⭐

---

<p align="center">
  <strong>Made with ❤️ for the decentralized web</strong>
  <br>
  <sub>Deploy to Web3 in minutes, not hours!</sub>
</p>
