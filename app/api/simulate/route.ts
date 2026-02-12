import { NextRequest, NextResponse } from 'next/server';
import { KVClient } from '@/lib/kv-client';

// Simulate agent updates for testing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, action } = body;

    if (!agentId) {
      return NextResponse.json(
        { error: 'agentId is required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'start_task':
        result = await simulateStartTask(agentId);
        break;
      case 'complete_task':
        result = await simulateCompleteTask(agentId, body.incomeAmount);
        break;
      case 'add_insight':
        result = await simulateAddInsight(agentId, body.insight);
        break;
      case 'error':
        result = await simulateError(agentId, body.message);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const updatedData = await KVClient.getDashboardData();

    return NextResponse.json({
      success: true,
      action,
      result,
      dashboard: updatedData,
    });
  } catch (error) {
    console.error('Error simulating agent action:', error);
    return NextResponse.json(
      { error: 'Failed to simulate action' },
      { status: 500 }
    );
  }
}

async function simulateStartTask(agentId: string) {
  const tasks = {
    'amazon-fba': [
      { title: 'Research profitable product niches', description: 'Analyze trending categories on Amazon' },
      { title: 'Analyze competitor products', description: 'Examine top 100 products in selected niche' },
      { title: 'Calculate profit margins', description: 'Factor in shipping, fees, and costs' },
      { title: 'Validate product demand', description: 'Check sales velocity and seasonality' },
    ],
    'tennis-betting': [
      { title: 'Analyze upcoming matches', description: 'Evaluate player form and head-to-head records' },
      { title: 'Calculate betting odds', description: 'Compare bookmaker odds with probability estimates' },
      { title: 'Identify value bets', description: 'Find odds that exceed calculated probability' },
      { title: 'Track live match data', description: 'Monitor in-play betting opportunities' },
    ],
    'challenge-agents': [
      { title: 'Scan for arbitrage opportunities', description: 'Check price differences across platforms' },
      { title: 'Execute challenge tasks', description: 'Complete platform-specific challenges' },
      { title: 'Calculate risk-reward ratios', description: 'Evaluate potential returns vs risks' },
      { title: 'Portfolio diversification', description: 'Allocate resources across opportunities' },
    ],
    'coordinator': [
      { title: 'Review agent performance', description: 'Analyze success rates and earnings' },
      { title: 'Optimize resource allocation', description: 'Assign tasks based on performance' },
      { title: 'Generate daily reports', description: 'Summarize activities and insights' },
      { title: 'Update strategy', description: 'Adjust based on market conditions' },
    ],
  };

  const agentTasks = tasks[agentId as keyof typeof tasks] || [
    { title: 'Process data', description: 'General task execution' },
  ];
  const randomTask = agentTasks[Math.floor(Math.random() * agentTasks.length)];

  const update = {
    agentId,
    status: 'running' as const,
    currentTask: {
      id: `task_${Date.now()}`,
      title: randomTask.title,
      description: randomTask.description,
      status: 'in_progress' as const,
      progress: 0,
      startTime: new Date(),
    },
    message: `Started task: ${randomTask.title}`,
  };

  await KVClient.updateAgent(update);
  return { task: randomTask };
}

async function simulateCompleteTask(agentId: string, incomeAmount?: number) {
  // First complete the current task
  const currentData = await KVClient.getDashboardData();
  const agent = currentData?.agents.find(a => a.id === agentId);

  let update = {
    agentId,
    currentTask: {
      id: agent?.currentTask?.id || `task_${Date.now()}`,
      status: 'completed' as const,
      progress: 100,
      endTime: new Date(),
    },
  };

  // Add random insight based on agent type
  const insights = {
    'amazon-fba': [
      { type: 'finding', content: 'Found 3 product opportunities with >30% profit margins in home & kitchen category', confidence: 85 },
      { type: 'opportunity', content: 'Seasonal demand increasing for outdoor furniture - 40% YoY growth', confidence: 92 },
      { type: 'risk', content: 'Electronics category showing increased competition - careful with pricing', confidence: 78 },
    ],
    'tennis-betting': [
      { type: 'finding', content: 'Player Stats: Top seed has 78% win rate on clay courts this season', confidence: 88 },
      { type: 'opportunity', content: 'Value bet detected: Underdog odds imply 35% win probability vs our model 45%', confidence: 91 },
      { type: 'recommendation', content: 'Consider live betting on tie-breaks - statistically favorable in 3rd sets', confidence: 75 },
    ],
    'challenge-agents': [
      { type: 'finding', content: 'Arbitrage opportunity: 2.3% guaranteed profit across three exchanges', confidence: 96 },
      { type: 'opportunity', content: 'New signup bonus available: £50 free bet after £20 stake', confidence: 100 },
      { type: 'recommendation', content: 'Diversify across 5 platforms to minimize risk of account restrictions', confidence: 82 },
    ],
    'coordinator': [
      { type: 'finding', content: 'Amazon FBA agent productivity increased 15% after schedule optimization', confidence: 89 },
      { type: 'recommendation', content: 'Allocate more resources to tennis betting during major tournaments', confidence: 85 },
      { type: 'risk', content: 'Challenge agent showing signs of burnout - reduce task load temporarily', confidence: 77 },
    ],
  };

  const agentInsights = insights[agentId as keyof typeof insights] || insights['coordinator'];
  const randomInsight = agentInsights[Math.floor(Math.random() * agentInsights.length)];

  update.newInsight = {
    ...randomInsight,
    relatedTaskId: agent?.currentTask?.id,
  };

  // Increment tasks completed metric
  update.metrics = {
    tasksCompleted: 1,
  };

  // Add income if provided
  if (incomeAmount) {
    await KVClient.updateIncome(agentId, incomeAmount, agentId === 'challenge-agents' ? 'challenge_agents' : undefined);
  }

  await KVClient.updateAgent(update);

  return {
    insight: randomInsight,
    incomeAdded: !!incomeAmount,
  };
}

async function simulateAddInsight(agentId: string, insightData?: any) {
  const update = {
    agentId,
    newInsight: insightData || {
      type: 'finding' as const,
      content: 'New discovery: Market trend shifting toward sustainable products',
      confidence: 75,
    },
  };

  await KVClient.updateAgent(update);
  return { success: true };
}

async function simulateError(agentId: string, message?: string) {
  const update = {
    agentId,
    status: 'error' as const,
    message: message || 'An error occurred during task execution',
  };

  await KVClient.updateAgent(update);
  return { success: true };
}