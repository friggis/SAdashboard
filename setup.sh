#!/bin/bash
# Setup script for the Vercel Agent Dashboard

echo "🚀 Setting up Vercel Agent Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Install with: npm i -g vercel"
else
    echo "✓ Vercel CLI found"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. For local testing:"
echo "   npm run dev"
echo "   Then open http://localhost:3000"
echo ""
echo "2. To simulate activity and see the dashboard update:"
echo "   node demo-simulate.mjs"
echo ""
echo "3. To deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "4. Integration:"
echo "   - Join your agents to the dashboard using the API"
echo "   - See AGENT_INTEGRATION.md for details"
echo "   - Use dashboard_client.py (Python) or dashboard-client.js (Node.js)"