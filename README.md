# ContentAI - AI-Powered Social Media Content Generator

A modern SaaS platform for generating professional social media content using AI.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API
- **Payments**: Stripe
- **Hosting**: Vercel

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free)
- An OpenAI account (pay per use)

### 1. Clone & Install

```bash
git clone https://github.com/walterolum/AI-content-creator.git
cd AI-content-creator

# Install frontend
cd frontend
npm install

# Install backend
cd ../backend
npm install
```

### 2. Get Your API Keys

**Supabase (Database & Auth):**
1. Go to https://supabase.com → Sign up/Login
2. Create new project
3. Go to Settings → API
4. Copy: Project URL, anon key, service_role key

**OpenAI (AI):**
1. Go to https://platform.openai.com
2. Add credits ($5 minimum)
3. Go to API Keys → Create new key
4. Copy the key (starts with sk-)

### 3. Configure Environment Variables

**Frontend** - Edit `frontend/.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3001/api
```

**Backend** - Edit `backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
OPENAI_API_KEY=sk-your-openai-key
JWT_SECRET=any-random-string-here
```

### 4. Setup Database

1. Go to Supabase Dashboard → SQL Editor
2. Open `backend/src/config/schema.sql`
3. Copy entire content
4. Paste into SQL Editor → Click Run

### 5. Run Development Servers

```bash
# Terminal 1 - Backend (port 3001)
cd backend
npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend
npm run dev
```

Open http://localhost:5173

---

## Deploy to Production (Vercel)

### Step 1: Push to GitHub

```bash
git add -A
git commit -m "ready for deployment"
git push
```

### Step 2: Deploy Backend

1. Go to https://vercel.com → Login with GitHub
2. Click "Add New Project"
3. Select your repository
4. Configure:
   - Root Directory: `./backend`
   - Build Command: `npm install`
   - Output Directory: (leave empty)
5. Add Environment Variables:
   - SUPABASE_URL
   - SUPABASE_SERVICE_KEY
   - OPENAI_API_KEY
   - JWT_SECRET
   - NODE_ENV=production
6. Click Deploy
7. Copy your backend URL (e.g., https://ai-content-creator-xxx.vercel.app)

### Step 3: Deploy Frontend

1. Vercel Dashboard → Add New Project
2. Select same repository
3. Configure:
   - Root Directory: `./frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_API_URL=https://your-backend.vercel.app/api
5. Click Deploy
6. Open your live app!

### Step 4: Update Supabase for Production

1. Go to Supabase → Authentication → URL Configuration
2. Add your frontend URL:
   - Site URL: https://your-frontend.vercel.app
   - Redirect URLs: https://your-frontend.vercel.app/auth/callback

---

## Features

- AI Content Generator (12 business types, 6 platforms, 9 tones)
- Content Library with search/filter
- AI Rewrite Tools (expand, shorten, translate, humanize)
- Content Calendar with AI generation
- Analytics Dashboard
- Admin Panel with user management
- Subscription Plans (Free, Starter, Pro, Agency)
- Dark/Light Mode
- Responsive Design

---

## Project Structure

```
AI-content-creator/
├── frontend/               # React app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── lib/           # Utilities
│   └── vercel.json        # Vercel config
├── backend/                # Express API
│   └── src/
│       ├── routes/        # API routes
│       ├── services/      # AI service
│       ├── middleware/     # Auth & validation
│       └── config/        # Config & DB schema
└── README.md
```

---

## License

MIT
