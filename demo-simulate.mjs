// Demo script to simulate agent activity
// Run this to see the dashboard update in real-time

import { KVClient } from './lib/kv-client';

const agents = ['amazon-fba', 'tennis-betting', 'challenge-agents', 'coordinator'];

const insights = [
  { type: 'finding', content: 'Found new opportunity in growing market segment', confidence: 85 },
  { type: 'opportunity', content: 'Potential 25% ROI identified for next quarter', confidence: 92 },
  { type: 'risk', content: 'Market volatility detected - adjust strategy accordingly', confidence: 78 },
  { type: 'recommendation', content: 'Increase allocation to high-performing agent by 20%', confidence: 88 },
];

const simulateAgentActivity = async () => {
  console.log('Simulating agent activity...\n');

  for (const agentId of agents) {
    // Start task
    console.log(`[${new Date().toLocaleTimeString()}] Starting task for ${agentId}`);
    await simulateStartTask(agentId);

    // Wait random time (1-3 seconds)
    await sleep(1000 + Math.random() * 2000);

    // Complete task with random income (except coordinator)
    const income = agentId === 'coordinator' ? undefined : Math.random() * 500 + 50;
    console.log(`[${new Date().toLocaleTimeString()}] Completing task for ${agentId}${income ? ` (+£${income.toFixed(2)})` : ''}`);
    await simulateCompleteTask(agentId, income);

    // Sometimes add additional insight
    if (Math.random() > 0.7) {
      const randomInsight = insights[Math.floor(Math.random() * insights.length)];
      console.log(`[${new Date().toLocaleTimeString()}] Adding insight to ${agentId}: ${randomInsight.content}`);
      await KVClient.updateAgent({
        agentId,
        newInsight: {
          ...randomInsight,
        },
      });
    }

    // Wait between agents
    await sleep(2000);
  }

  console.log('\nSimulation cycle complete!\n');
};

async function simulateStartTask(agentId: string) {
  const tasks = {
    'amazon-fba': [
      { title: 'Research profitable product niches', description: 'Analyze trending categories' },
      { title: 'Analyze competitor products', description: 'Examine top products' },
      { title: 'Calculate profit margins', description: 'Factor costs and fees' },
    ],
    'tennis-betting': [
      { title: 'Analyze upcoming matches', description: 'Evaluate player form' },
      { title: 'Calculate betting odds', description: 'Compare odds with probabilities' },
      { title: 'Identify value bets', description: 'Find high-value opportunities' },
    ],
    'challenge-agents': [
      { title: 'Scan for arbitrage opportunities', description: 'Check price differences' },
      { title: 'Execute challenge tasks', description: 'Complete platform challenges' },
      { title: 'Calculate risk-reward ratios', description: 'Evaluate returns vs risks' },
    ],
    'coordinator': [
      { title: 'Review agent performance', description: 'Analyze success rates' },
      { title: 'Optimize resource allocation', description: 'Assign tasks based on performance' },
      { title: 'Generate daily reports', description: 'Summarize activities' },
    ],
  };

  const agentTasks = tasks[agentId as keyof typeof tasks] || [{ title: 'Process data', description: 'General task' }];
  const randomTask = agentTasks[Math.floor(Math.random() * agentTasks.length)];

  await KVClient.updateAgent({
    agentId,
    status: 'running',
    currentTask: {
      id: `task_${Date.now()}`,
      title: randomTask.title,
      description: randomTask.description,
      status: 'in_progress',
      progress: 0,
      startTime: new Date(),
    },
    message: `Started: ${randomTask.title}`,
  });
}

async function simulateCompleteTask(agentId: string, income?: number) {
  const update = {
    agentId,
    currentTask: {
      id: `task_${Date.now()}`,
      status: 'completed',
      progress: 100,
      endTime: new Date(),
    },
  };

  // Add random insight
  const insightTypes = [
    { type: 'finding', content: 'New profitable opportunity discovered', confidence: 85 },
    { type: 'opportunity', content: 'Market conditions optimal for execution', confidence: 92 },
    { type: 'recommendation', content: 'Strategy adjustment recommended', confidence: 78 },
  ];
  const randomInsight = insightTypes[Math.floor(Math.random() * insightTypes.length)];
  update.newInsight = randomInsight;

  // Increment tasks completed
  update.metrics = { tasksCompleted: 1 };

  // Update income
  if (income) {
    await KVClient.updateIncome(agentId, income, agentId === 'challenge-agents' ? 'challenge_agents' : undefined);
  }

  await KVClient.updateAgent(update);
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run simulation continuously
const runContinuous = async () => {
  while (true) {
    await simulateAgentActivity();
    await sleep(5000); // Wait 5 seconds between cycles
  }
};

// Run single cycle
simulateAgentActivity().then(() => {
  console.log('Ready for next simulation cycle. Run again manually or use runContinuous() for automated.');
}).catch(console.error);

export { runContinuous };