# Mission Control

Raymond's Personal Dashboard - Track tasks, memories, and activities.

## 🚀 Quick Start (Local)

```bash
cd mission-control
npm install
npm run dev
```

Open http://localhost:3000

## 🌐 Vercel Deployment

### Option 1: Vercel CLI (Recommended)
```bash
npm i -g vercel
vercel login
cd mission-control
vercel
```

### Option 2: Vercel Dashboard
1. Go to https://vercel.com
2. Import this project from GitHub
3. Deploy

### Environment Variables
No special env vars required for basic deployment.

## 📁 Data Storage

- **Local Development**: Data saves to `../workspace/data/*.json`
- **Production**: For persistent data, consider:
  - Convex (recommended for real-time sync)
  - Vercel KV (Redis)
  - Vercel Postgres

## 🛠️ Convex Setup (Optional - for real-time sync)

```bash
npx convex dev
# Login with your account
# Follow prompts to configure
```

## Features

- [x] Task Board (Kanban)
- [x] Calendar View
- [x] Memory Library
- [x] Activity Feed
- [x] Global Search
- [x] Dark/Light Mode
- [x] Local Data Persistence
- [ ] Real-time Sync (Convex)

---

Built with Next.js 14 + Tailwind CSS + shadcn/ui
