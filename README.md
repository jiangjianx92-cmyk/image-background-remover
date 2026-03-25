# 🪄 Image Background Remover

A serverless image background removal tool built with **Next.js 15**, **Tailwind CSS**, and **Remove.bg API**.

## Features

- 🚀 Fast serverless processing
- 💾 No storage required - images processed in memory
- 🎨 Beautiful before/after comparison
- ⬇️ One-click download
- 📱 Works on all devices
- 🎯 TypeScript + React 19

## Setup

### 1. Get Remove.bg API Key

1. Go to [remove.bg/api](https://www.remove.bg/api)
2. Sign up / Log in
3. Copy your API key

### 2. Configure Environment

```bash
cp .env.local.example .env.local
# Edit .env.local and add your API key
```

### 3. Install & Run

```bash
npm install
npm run dev
```

### 4. Open in Browser

```
http://localhost:3000
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **API**: Remove.bg

## Cost

- **Next.js/Vercel**: Free tier (generous limits)
- **Remove.bg**: Free tier (50 images/month), then $0.009/image

## License

MIT
