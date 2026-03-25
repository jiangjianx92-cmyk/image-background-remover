# 🪄 Image Background Remover

A serverless image background removal tool powered by **Cloudflare Workers** and **Remove.bg API**.

## Features

- 🚀 Fast serverless processing
- 💾 No storage required - images processed in memory
- 🎨 Beautiful before/after comparison
- ⬇️ One-click download
- 📱 Works on all devices

## Setup

### 1. Get Remove.bg API Key

1. Go to [remove.bg/api](https://www.remove.bg/api)
2. Sign up / Log in
3. Copy your API key

### 2. Configure API Key

**Option A: Environment variable (recommended for production)**
```bash
wrangler secret put REMOVE_BG_API_KEY
# Enter your API key when prompted
```

**Option B: Edit wrangler.toml (for testing only)**
```toml
[vars]
REMOVE_BG_API_KEY = "your-api-key-here"
```

### 3. Install & Run

```bash
npm install
npm run dev
```

### 4. Deploy

```bash
npm run deploy
```

## Usage

1. Open the website
2. Drag & drop an image (or click to browse)
3. Click "Remove Background"
4. Download the result

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS + Tailwind CDN
- **Backend**: Cloudflare Workers
- **API**: Remove.bg

## Cost

- **Cloudflare Workers**: Free tier (100,000 requests/day)
- **Remove.bg**: Free tier (50 images/month), then $0.009/image

## License

MIT
