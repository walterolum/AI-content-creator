# ContentAI - AI-Powered Social Media Content Generator

A modern SaaS platform for generating professional social media content using AI.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API
- **Payments**: Stripe
- **Hosting**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key
- Stripe account (optional)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd contentai

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Copy environment files
cp .env.example .env
cd ../frontend
cp .env.example .env
```

### Configuration

1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `backend/src/config/schema.sql`
3. Get your Supabase URL and keys
4. Get an OpenAI API key
5. Update `.env` files with your keys

### Running

```bash
# Frontend (port 5173)
cd frontend
npm run dev

# Backend (port 3001)
cd backend
npm run dev
```

## Features

- AI Content Generator (captions, hashtags, scripts)
- Content Library with search/filter
- AI Rewrite Tools (expand, shorten, translate, humanize)
- Content Calendar with scheduling
- Analytics Dashboard
- Admin Panel
- Subscription Management
- Dark/Light Mode

## Database Schema

See `backend/src/config/schema.sql` for the complete schema.

## Deployment

### Vercel (Frontend)

```bash
cd frontend
vercel
```

### Backend

Deploy to Vercel Serverless or any Node.js host.

### Environment Variables

```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_API_URL=your_api_url
```
