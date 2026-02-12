# Research Agent Dashboard - Vercel App

A real-time monitoring dashboard for all research agents including Amazon FBA Research, Tennis Betting Research, Challenge Agents, and Coordinator.

## Features
- Real-time agent status (running, completed, errors)
- Progress tracking for each agent
- Current findings and insights display
- £5000/month income goal progress tracker
- Activity logs and communication feed
- Agent task assignments and outputs
- Resource usage and performance metrics
- WebSocket/polling for live updates
- Vercel KV for data persistence

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vercel KV (for storage)
- Server-Sent Events (SSE) for real-time updates

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up Vercel KV:
   - Create a Vercel project
   - Add Vercel KV in project settings
   - Environment variables will be auto-configured

3. Run locally:
```bash
npm run dev
```

4. Deploy to Vercel:
```bash
vercel --prod
```

## Project Structure
- `app/page.tsx` - Main dashboard
- `app/api/` - Serverless functions
- `components/` - React components
- `lib/types.ts` - TypeScript definitions
- `lib/kv-client.ts` - Vercel KV client
- `lib/agents.ts` - Agent data structures and helpers