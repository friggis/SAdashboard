import { kv } from '@vercel/kv';
import { Agent, ActivityLog, IncomeGoal, DashboardData, AgentUpdatePayload } from './types';

const DASHBOARD_KEY = 'dashboard:data';
const LOCK_KEY = 'dashboard:lock';
const LOCK_TTL = 10; // seconds

export class KVClient {
  // Get complete dashboard data
  static async getDashboardData(): Promise<DashboardData | null> {
    try {
      const data = await kv.get<DashboardData>(DASHBOARD_KEY);
      if (!data) {
        return this.initializeDashboard();
      }
      return data;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return null;
    }
  }

  // Initialize dashboard with default data
  private static async initializeDashboard(): Promise<DashboardData> {
    const defaultAgents: Agent[] = [
      {
        id: 'amazon-fba',
        name: 'Amazon FBA Research',
        type: 'amazon_fba',
        status: 'idle',
        description: 'Researches profitable Amazon FBA products and market opportunities',
        taskQueue: [],
        recentInsights: [],
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
        lastUpdate: new Date(),
        assignedGoals: ['Identify 10 profitable product niches', 'Analyze market trends'],
      },
      {
        id: 'tennis-betting',
        name: 'Tennis Betting Research',
        type: 'tennis_betting',
        status: 'idle',
        description: 'Analyzes tennis matches for betting opportunities',
        taskQueue: [],
        recentInsights: [],
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
        lastUpdate: new Date(),
        assignedGoals: ['Find value bets', 'Track player statistics'],
      },
      {
        id: 'challenge-agents',
        name: 'Challenge Agents',
        type: 'challenge',
        status: 'idle',
        description: 'Runs various challenge and arbitrage opportunities',
        taskQueue: [],
        recentInsights: [],
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
        lastUpdate: new Date(),
        assignedGoals: ['Complete weekly challenges', 'Maximize arbitrage returns'],
      },
      {
        id: 'coordinator',
        name: 'Coordinator',
        type: 'coordinator',
        status: 'idle',
        description: 'Manages and coordinates all research agents',
        taskQueue: [],
        recentInsights: [],
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
        lastUpdate: new Date(),
        assignedGoals: ['Synchronize agent activities', 'Optimize resource allocation'],
      },
    ];

    const initialData: DashboardData = {
      agents: defaultAgents,
      activityLogs: [],
      incomeGoal: {
        targetAmount: 5000,
        currentAmount: 0,
        currency: 'GBP',
        period: 'monthly',
        breakdown: {},
        historical: [],
      },
      systemMetrics: {
        totalAgents: defaultAgents.length,
        runningAgents: 0,
        completedTasks: 0,
        failedTasks: 0,
        totalInsights: 0,
        lastUpdate: new Date(),
      },
      timestamp: new Date(),
    };

    await kv.set(DASHBOARD_KEY, initialData);
    return initialData;
  }

  // Update agent data (used by agents to report status)
  static async updateAgent(update: AgentUpdatePayload): Promise<DashboardData | null> {
    const lockKey = `${LOCK_KEY}:${update.agentId}`;

    // Try to acquire lock (set if not exists with TTL)
    const acquired = await kv.set(lockKey, 'locked', { nx: true, ex: LOCK_TTL });
    if (!acquired) {
      throw new Error('Could not acquire lock for agent update');
    }

    try {
      const currentData = await this.getDashboardData();
      if (!currentData) return null;

      const agentIndex = currentData.agents.findIndex(a => a.id === update.agentId);
      if (agentIndex === -1) {
        throw new Error(`Agent ${update.agentId} not found`);
      }

      const agent = { ...currentData.agents[agentIndex] };
      let activityLog: ActivityLog | null = null;

      // Update agent fields
      if (update.status !== undefined) {
        agent.status = update.status;
      }

      if (update.currentTask) {
        if (update.currentTask.id) {
          // Update existing task or add new one
          const taskIndex = agent.taskQueue.findIndex(t => t.id === update.currentTask!.id);
          if (taskIndex >= 0) {
            agent.taskQueue[taskIndex] = { ...agent.taskQueue[taskIndex], ...update.currentTask };
          } else {
            agent.taskQueue.push(update.currentTask as Agent['taskQueue'][number]);
          }
        }
        agent.currentTask = update.currentTask as Partial<Agent['currentTask']> as Agent['currentTask'];
      }

      if (update.metrics) {
        agent.metrics = { ...agent.metrics, ...update.metrics };
      }

      if (update.newInsight) {
        const insight = {
          ...update.newInsight,
          id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        } as Agent['recentInsights'][number];
        agent.recentInsights.unshift(insight);
        if (agent.recentInsights.length > 20) {
          agent.recentInsights = agent.recentInsights.slice(0, 20);
        }
      }

      if (update.message) {
        activityLog = {
          id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          agentId: update.agentId,
          agentName: agent.name,
          type: 'info',
          message: update.message,
        };
      }

      agent.lastUpdate = new Date();

      // Update dashboard data
      currentData.agents[agentIndex] = agent;
      currentData.timestamp = new Date();
      currentData.systemMetrics.totalInsights = currentData.agents.reduce(
        (sum, a) => sum + a.recentInsights.length,
        0
      );
      currentData.systemMetrics.runningAgents = currentData.agents.filter(
        a => a.status === 'running'
      ).length;

      if (activityLog) {
        currentData.activityLogs.unshift(activityLog);
        if (currentData.activityLogs.length > 100) {
          currentData.activityLogs = currentData.activityLogs.slice(0, 100);
        }
      }

      await kv.set(DASHBOARD_KEY, currentData);

      return currentData;
    } finally {
      await kv.del(lockKey);
    }
  }

  // Update income goal (when agents complete earnings)
  static async updateIncome(
    agentId: string,
    amount: number,
    breakdownKey?: keyof DashboardData['incomeGoal']['breakdown']
  ): Promise<DashboardData | null> {
    const currentData = await this.getDashboardData();
    if (!currentData) return null;

    const prevAmount = currentData.incomeGoal.currentAmount;
    currentData.incomeGoal.currentAmount += amount;

    if (breakdownKey) {
      // Initialize the breakdown key if it doesn't exist, or add to existing amount
      const current = currentData.incomeGoal.breakdown[breakdownKey];
      currentData.incomeGoal.breakdown[breakdownKey] = (current || 0) + amount;
    }

    // Add to historical
    currentData.incomeGoal.historical.unshift({
      date: new Date(),
      amount: currentData.incomeGoal.currentAmount,
    });
    if (currentData.incomeGoal.historical.length > 30) {
      currentData.incomeGoal.historical = currentData.incomeGoal.historical.slice(0, 30);
    }

    // Log this income
    const activityLog: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      agentId,
      agentName: currentData.agents.find(a => a.id === agentId)?.name || 'Unknown',
      type: 'success',
      message: `Income updated: +£${amount} (Total: £${currentData.incomeGoal.currentAmount.toFixed(2)})`,
    };
    currentData.activityLogs.unshift(activityLog);

    await kv.set(DASHBOARD_KEY, currentData);
    return currentData;
  }

  // Clear all data (for testing)
  static async clearAll(): Promise<void> {
    await kv.del(DASHBOARD_KEY);
    await this.initializeDashboard();
  }
}