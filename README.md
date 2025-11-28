# GeoCluster Connect

Intelligent group messaging platform with AI-powered location and interest-based clustering.

## Features

✅ User Authentication (Register/Login)
✅ Manual Group Creation
✅ Location-Based Auto-Clustering (DBSCAN)
✅ Interest-Based Auto-Clustering (K-Means)
✅ Real-time Chat (Socket.io)
✅ Typing Indicators
✅ User Search
✅ Profile Management
✅ Group Analytics

## Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Socket.io Client
- Axios
- React Router

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- JWT Authentication
- bcrypt

**ML Service:**
- Python + Flask
- Scikit-learn
- NumPy, Pandas

## Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- MongoDB

## Installation

### 1. Clone Repository
\`\`\`bash
git clone <your-repo-url>
cd geocluster-connect
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
\`\`\`

### 4. ML Service Setup
\`\`\`bash
cd ml-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
\`\`\`

## Environment Variables

### Backend (.env)
\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/geocluster
JWT_SECRET=your_secret_key
ML_SERVICE_URL=http://localhost:8000
\`\`\`

### Frontend (.env)
\`\`\`
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
\`\`\`

### ML Service (.env)
\`\`\`
FLASK_PORT=8000
FLASK_ENV=development
\`\`\`

## Usage

1. Register a new account
2. Set your location and interests in Profile Settings
3. Create manual groups or use auto-clustering
4. Chat in real-time with group members

## Project Structure

\`\`\`
geocluster-connect/
├── frontend/          # React application
├── backend/           # Node.js API
├── ml-service/        # Python ML service
└── README.md
\`\`\`

## License

MIT

## Contributors

[Your Name]
\`\`\`

---

## Step 86: Deployment - Backend (Railway)

**Create:** `backend/railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Deployment Steps:**

1. **Create Railway Account:** https://railway.app
2. **Create New Project** → Deploy from GitHub
3. **Add Environment Variables:**
   - MONGODB_URI (use Railway MongoDB or MongoDB Atlas)
   - JWT_SECRET
   - ML_SERVICE_URL
   - PORT=5000
   - NODE_ENV=production
4. **Deploy** - Railway auto-detects and deploys

---

## Step 87: Deployment - Frontend (Vercel)

**Create:** `frontend/vercel.json`
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Deployment Steps:**

1. **Create Vercel Account:** https://vercel.com
2. **Import Project** from GitHub
3. **Configure:**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
4. **Add Environment Variables:**
   - REACT_APP_API_URL (your Railway backend URL)
   - REACT_APP_SOCKET_URL (your Railway backend URL)
5. **Deploy**

---

## Step 88: Deployment - ML Service (Render)

**Create:** `ml-service/render.yaml`
```yaml
services:
  - type: web
    name: geocluster-ml-service
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "gunicorn app:app"
    envVars:
      - key: FLASK_PORT
        value: 8000
      - key: FLASK_ENV
        value: production
```

**Add to `ml-service/requirements.txt`:**