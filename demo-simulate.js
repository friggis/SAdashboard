// Demo script to simulate agent activity (JavaScript version)
// Run this to see the dashboard update in real-time

const agents = ['amazon-fba', 'tennis-betting', 'challenge-agents', 'coordinator'];

const insights = [
  { type: 'finding', content: 'Found new opportunity in growing market segment', confidence: 85 },
  { type: 'opportunity', content: 'Potential 25% ROI identified for next quarter', confidence: 92 },
  { type: 'risk', content: 'Market volatility detected - adjust strategy accordingly', confidence: 78 },
  { type: 'recommendation', content: 'Increase allocation to high-performing agent by 20%', confidence: 88 },
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
      await updateAgentData(agentId, {
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

class KVClient {
  static #base = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';

  static async updateAgent(data) {
    try {
      const response = await fetch(`${this.#base}/api/dashboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.error('Failed to update agent:', error.message);
    }
  }
}

async function simulateStartTask(agentId) {
  const tasks = [
    'Researching high-margin FBA products',
    'Analyzing tennis match patterns',
    'Challenge deep-dive analysis',
    'Coordinating income goal tracking'
  ];
  const task = tasks[Math.floor(Math.random() * tasks.length)];
  await KVClient.updateAgent({
    agentId,
    status: 'running',
    currentTask: task,
    progress: Math.floor(Math.random() * 30),
    message: `Starting: ${task}`,
  });
}

async function simulateCompleteTask(agentId, income) {
  const data = {
    agentId,
    status: 'completed',
    progress: 100,
    message: 'Task completed successfully',
  };
  if (income !== undefined) {
    data.income = income;
  }
  await KVClient.updateAgent(data);
}

async function updateAgentData(agentId, extra) {
  await KVClient.updateAgent({
    agentId,
    ...extra
  });
}

simulateAgentActivity().then(() => {
  console.log('Restarting simulation in 10 seconds...');
  setTimeout(() => simulateAgentActivity(), 10000);
}).catch(console.error);