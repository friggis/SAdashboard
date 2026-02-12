# Agent Integration Guide

This document explains how to integrate your research agents with the Vercel Dashboard.

## Overview

Agents can report their status, progress, insights, and earnings to the dashboard via HTTP API calls to `/api/dashboard`. The dashboard automatically polls for updates every 5 seconds.

## API Endpoint

**URL:** `/api/dashboard` (your deployed Vercel URL)

**Method:** POST

**Content-Type:** application/json

## Request Payload

```json
{
  "agentId": "amazon-fba",
  "status": "running",
  "currentTask": {
    "id": "task_12345",
    "title": "Research profitable products",
    "description": "Analyze trending categories",
    "status": "in_progress",
    "progress": 45
  },
  "newInsight": {
    "type": "finding",
    "content": "Found 3 product opportunities with >30% margins",
    "confidence": 85,
    "relatedTaskId": "task_12345"
  },
  "metrics": {
    "cpu": 12.5,
    "memory": 156,
    "uptime": 3600,
    "tasksCompleted": 5,
    "tasksFailed": 0
  },
  "message": "Progress update: 45% complete"
}
```

### Fields

- `agentId` (required): The ID of the agent. Must match one from:
  - `amazon-fba`
  - `tennis-betting`
  - `challenge-agents`
  - `coordinator`

- `status` (optional): Agent status. One of: `idle`, `running`, `completed`, `error`, `paused`

- `currentTask` (optional): Current task object:
  - `id`: Unique task ID
  - `title`: Task title
  - `description`: Brief description
  - `status`: `pending`, `in_progress`, `completed`, `failed`
  - `progress`: 0-100 percentage
  - `startTime`: ISO date string (when task started)
  - `endTime`: ISO date string (when task ended)

- `newInsight` (optional): New insight discovered:
  - `type`: `finding`, `opportunity`, `risk`, `recommendation`
  - `content`: Text description of the insight
  - `confidence`: 0-100 confidence score
  - `relatedTaskId`: Optional task ID that led to this insight

- `metrics` (optional): Performance metrics:
  - `cpu`: CPU usage percentage
  - `memory`: Memory usage in MB
  - `uptime`: Uptime in seconds
  - `tasksCompleted`: Total tasks completed since start
  - `tasksFailed`: Total tasks failed

- `message` (optional): A message to add to the activity log

## Recording Income

To record earnings towards the £5000/month goal, POST to `/api/income`:

```json
{
  "agentId": "amazon-fba",
  "amount": 125.50,
  "breakdownKey": "amazon_fba"
}
```

- `agentId`: Which agent earned the money
- `amount`: Amount in GBP
- `breakdownKey` (optional): Breakdown category - one of:
  - `amazon_fba`
  - `tennis_betting`
  - `challenge_agents`
  - `other`

## Example Code

### Python
```python
import requests
import json

DASHBOARD_URL = "https://your-dashboard.vercel.app/api/dashboard"

def update_agent_status(agent_id, status, current_task=None, insight=None):
    payload = {
        "agentId": agent_id,
        "status": status,
    }

    if current_task:
        payload["currentTask"] = current_task

    if insight:
        payload["newInsight"] = insight

    response = requests.post(DASHBOARD_URL, json=payload)
    return response.json()

# Example usage
update_agent_status(
    agent_id="amazon-fba",
    status="running",
    current_task={
        "id": "task_001",
        "title": "Research profitable products",
        "description": "Analyze trending categories",
        "status": "in_progress",
        "progress": 65
    }
)
```

### Node.js
```javascript
const axios = require('axios');

const DASHBOARD_URL = 'https://your-dashboard.vercel.app/api/dashboard';

async function updateAgent(agentId, data) {
  const payload = {
    agentId,
    ...data
  };

  const response = await axios.post(DASHBOARD_URL, payload);
  return response.data;
}

// Example usage
updateAgent('tennis-betting', {
  status: 'running',
  currentTask: {
    id: 'task_123',
    title: 'Analyze upcoming matches',
    status: 'in_progress',
    progress: 30
  },
  message: 'Started analyzing today matches'
});
```

### Bash/Curl
```bash
curl -X POST https://your-dashboard.vercel.app/api/dashboard \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "challenge-agents",
    "status": "completed",
    "currentTask": {
      "id": "task_456",
      "title": "Find arbitrage opportunities",
      "status": "completed",
      "progress": 100
    },
    "newInsight": {
      "type": "opportunity",
      "content": "Found 2.3% arbitrage across exchanges",
      "confidence": 96
    },
    "message": "Task completed successfully"
  }'
```

## Testing

### Using the Simulate Endpoint

The dashboard includes a simulation endpoint for testing:

```bash
curl -X POST https://your-dashboard.vercel.app/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "amazon-fba",
    "action": "start_task"
  }'
```

Available actions:
- `start_task`: Starts a random task for the agent
- `complete_task`: Completes current task, adds insight and optional income
- `add_insight`: Adds a new insight without changing task
- `error`: Sets agent status to error

### Running Demo Locally

1. Start the development server: `npm run dev`
2. In another terminal, run: `node demo-simulate.mjs`
3. Open `http://localhost:3000` to see the dashboard update

The demo will simulate activity across all agents, generating insights and income.

## Dashboard Features

1. **Real-time Status**: Colors indicate agent state (green=running, blue=completed, red=error)
2. **Progress Tracking**: Visual progress bars for current tasks
3. **Performance Metrics**: CPU, memory, uptime, tasks completed
4. **Income Goal**: £5000/month progress with breakdown by agent
5. **Activity Feed**: Chronological log of all agent activities
6. **Insights**: Latest discoveries organized by agent
7. **Auto-refresh**: Dashboard polls every 5 seconds

## Deploy to Production

1. Push to GitHub
2. Import project in Vercel
3. Add Vercel KV (Key-Value store) in project settings
4. Deploy
5. Share the deployed URL with your agents

## Notes

- The dashboard uses Vercel KV for persistence
- Data is locked during updates to prevent conflicts
- Dashboard auto-refreshes every 5 seconds
- Activity logs store last 100 entries
- Insights store last 20 per agent