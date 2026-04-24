# GOD MODE v5 — Control Panel

Simple automation control panel connecting to n8n.

## Setup

```bash
cp .env.example .env.local
# Set your webhook URL in .env.local
```

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy

```bash
vercel deploy
```

Add environment variable in Vercel dashboard:
- Key: `NEXT_PUBLIC_N8N_WEBHOOK_URL`
- Value: `https://rinkun.app.n8n.cloud/webhook/godmode-v5`

## Webhook payload

```json
{
  "topic": "your topic",
  "test_mode": true,
  "platforms": ["youtube", "twitter"]
}
```
