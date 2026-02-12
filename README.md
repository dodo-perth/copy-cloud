# Copy Cloud

Instant copy & paste across devices. Paste text, links, or images — get a 6-digit code and QR instantly. Enter the code on another device to receive the content.

## Features

- **Instant sharing** — Paste content, get a code + QR code in seconds
- **Smart content detection** — YouTube links embed a player, Google Maps links get an "Open in Maps" button, URLs are clickable
- **Image support** — Drop or paste images directly
- **Secure mode** — Share via QR code only (no guessable code)
- **Auto-expire** — Everything disappears after 5 minutes

## Tech Stack

- **Frontend**: Next.js (App Router), shadcn/ui, Tailwind CSS
- **Backend**: Express, SQLite (better-sqlite3)

## Getting Started

```bash
# Install all dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Run both servers
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Project Structure

```
copy-cloud.app/
├── frontend/          # Next.js + shadcn/ui
│   └── src/
│       ├── app/page.tsx              # Single-page UI
│       ├── components/
│       │   ├── content-renderer.tsx  # Smart content rendering
│       │   └── qr-dialog.tsx         # QR code dialog
│       └── lib/
│           ├── api.ts                # API client
│           └── content-detect.ts     # Content type detection
├── backend/           # Express + SQLite
│   └── src/
│       ├── index.ts                  # Server entry
│       ├── db.ts                     # SQLite setup
│       ├── routes/rooms.ts           # REST API
│       └── utils/
│           ├── cleanup.ts            # Auto-expire scheduler
│           ├── code-generator.ts     # 6-digit code generator
│           └── content-detect.ts     # Content type detection
└── package.json       # Root scripts (concurrently)
```
