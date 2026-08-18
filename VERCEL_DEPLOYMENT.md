# Deploying BlogFlow to Vercel

This application is fully configured for zero-configuration deployment to **Vercel** with a Vite React frontend and serverless Express API endpoints.

---

## 🚀 Quick Deployment Steps

### 1. Push to GitHub
1. Export or commit your repository to GitHub.
2. Go to your [Vercel Dashboard](https://vercel.com/new).
3. Click **"Add New..."** > **"Project"** and import your GitHub repository.

---

### 2. Configure Build & Output Settings
Vercel automatically detects Vite:
- **Framework Preset**: `Vite`
- **Build Command**: `vite build` (or `npm run build`)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

### 3. Environment Variables (Required in Vercel)
In your Vercel Project Settings > **Environment Variables**, add the following:

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | Your MongoDB Atlas connection string | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority` |
| `MONGODB_DB_NAME` | MongoDB database name | `blogflow` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_api_secret` |
| `CLOUDINARY_URL` | *(Optional alternative to the 3 keys above)* | `cloudinary://key:secret@cloud_name` |
| `GEMINI_API_KEY` | *(Optional)* Google Gemini AI key | `AIzaSy...` |

---

## 📁 How It Works on Vercel
- **Frontend**: Vite compiles React to optimized static assets in `/dist`.
- **API Serverless Function**: `/api/index.ts` handles all `/api/*` routes seamlessly via Express and MongoDB connection pooling.
- **Rewrites (`vercel.json`)**: Directs all `/api/*` traffic to the serverless function and all frontend navigation to the SPA fallback.
