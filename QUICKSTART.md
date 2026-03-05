# Vercel Dashboard - Quick Start Guide

## Local Development (Quick Start)

1. **Install dependencies:**
   ```bash
   cd vercel-dashboard
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Test with simulated data:**
   In another terminal:
   ```bash
   node demo-simulate.mjs
   ```
   Watch the dashboard update every 5-10 seconds with simulated agent activity.

## Deploy to Production

1. **Push to GitHub** (or connect your repository to Vercel)

2. **Import in Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Framework preset: Next.js

3. **Add Vercel KV:**
   In your Vercel project dashboard:
   - Go to "Storage" tab
   - Click "Create Database"
   - Select "KV"
   - Choose a region near you
   - Copy the environment variables (they'll be auto-added)

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

5. **Get your URL:**
   - Your dashboard will be at: `https://your-project.vercel.app`

6. **Share with agents:**
   - Send them the URL
   - Provide integration instructions from `AGENT_INTEGRATION.md`

## Testing Your Deployment

After deployment, test the API:

```bash
# Get current data
curl https://your-app.vercel.app/api/dashboard

# Simulate agent activity
curl -X POST https://your-app.vercel.app/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"agentId":"amazon-fba","action":"start_task"}'

# Clear data (reset to defaults)
curl -X POST https://your-app.vercel.app/api/clear
```

## Agent Integration

Your research agents need to make POST requests to `/api/dashboard`:

```python
import requests

# Report status update
requests.post('https://your-app.vercel.app/api/dashboard', json={
    'agentId': 'amazon-fba',
    'status': 'running',
    'message': 'Starting analysis...'
})

# Report income
requests.post('https://your-app.vercel.app/api/income', json={
    'agentId': 'amazon-fba',
    'amount': 125.50
})
```

See `AGENT_INTEGRATION.md` for full documentation.

## Features

✅ **Real-time Status** - Visual indicators for agent state (running, completed, error)
✅ **Progress Tracking** - Progress bars for current tasks
✅ **Performance Metrics** - CPU, memory, uptime, task counts
✅ **Income Goal** - £5000/month tracker with breakdown by agent
✅ **Activity Feed** - Chronological log of all activities
✅ **Insights** - Latest findings with confidence scores
✅ **Auto-refresh** - Dashboard updates every 5 seconds
✅ **Persistent Storage** - Vercel KV for data persistence

## Dashboard Layout

1. **Income Goal Card** - Top: Progress toward £5000/month
2. **System Metrics** - Quick stats on all agents
3. **Agent Cards** - Grid of 4 agent status cards showing:
   - Current task and progress
   - Performance metrics (CPU, memory, uptime, tasks)
   - Assigned goals
   - Recent insights
4. **Activity Feed** - Bottom: Real-time activity log

## Troubleshooting

**Dashboard shows "No data available" locally:**
- Make sure Vercel KV is configured, or the app will auto-initialize with mock data on first read

**Deployment fails:**
- Ensure you have Vercel KV added to your project
- Check that KV environment variables are present
- Review build logs in Vercel dashboard

**Agents can't connect:**
- Check CORS headers (should be fine with same origin)
- Verify agentId values match: amazon-fba, tennis-betting, challenge-agents, coordinator
- Ensure network access (firewall, VPN, etc.)

**Real-time updates not working:**
- Dashboard polls every 5 seconds - check console for errors
- Verify API responses are valid JSON
- Check KV connection in Vercel logs

## Next Steps

- Customize agent names/descriptions in `lib/kv-client.ts` (initializeDashboard function)
- Add more agent types by extending the types in `lib/types.ts`
- Customize dashboard appearance in `app/page.tsx` and `app/globals.css`
- Add WebSocket support instead of polling (advanced)
- Set up alerts/notifications for agent failures
- Export data to CSV/reports

## Support

- Check `AGENT_INTEGRATION.md` for API details
- Review `demo-simulate.mjs` to see example usage
- See `dashboard_client.py` and `dashboard-client.js` for client libraries