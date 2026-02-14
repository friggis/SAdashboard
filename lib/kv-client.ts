import { Redis } from 'ioredis';
import { Agent, ActivityLog, IncomeGoal, DashboardData, AgentUpdatePayload } from './types';

const DASHBOARD_KEY = 'dashboard:data';
const LOCK_KEY = 'dashboard:lock';
const LOCK_TTL = 10; // seconds

// Initialize Redis client from environment variable
const redis = new Redis(process.env.REDIS_URL!, {
  // Enable automatic disconnect on process exit
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

// Serialization helpers
const serialize = (value: unknown): string => JSON.stringify(value);
const deserialize = <T>(value: string): T => JSON.parse(value);

export class KVClient {
  // Get complete dashboard data
  static async getDashboardData(): Promise<DashboardData | null> {
    try {
      const data = await redis.get(DASHBOARD_KEY);
      if (!data) {
        return this.initializeDashboard();
      }
      return deserialize<DashboardData>(data);
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
      // Income Generation System Agents
      {
        id: 'income-researcher',
        name: 'Income Researcher',
        type: 'other',
        status: 'idle',
        description: 'Systematic research of all viable income streams for £5k/month tax-efficient target',
        taskQueue: [],
        recentInsights: [],
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
        lastUpdate: new Date(),
        assignedGoals: ['Survey all income opportunities', 'Rank by ROI and feasibility', 'Provide revenue estimates and timelines'],
      },
      {
        id: 'digital-product-strategist',
        name: 'Digital Product Strategist',
        type: 'other',
        status: 'idle',
        description: 'Deep dive into Skool + PDF farming with 90-day launch plan',
        taskQueue: [],
        recentInsights: [],
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
        lastUpdate: new Date(),
        assignedGoals: ['Design Skool monetization models', 'Create PDF lead magnet strategy', 'Build 90-day implementation timeline'],
      },
      {
        id: 'website-monetization-expert',
        name: 'Website Monetization Expert',
        type: 'other',
        status: 'idle',
        description: 'Audit & optimize existing websites for revenue growth',
        taskQueue: [],
        recentInsights: [],
        metrics: {cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0},
        lastUpdate: new Date(),
        assignedGoals: ['Analyze current site revenue', 'Identify optimization opportunities', 'Create 30-60-90 day improvement plan'],
      },
      {
        id: 'qa-reviewer',
        name: 'QA Reviewer',
        type: 'other',
        status: 'idle',
        description: 'Quality gate for all agent outputs - ensures completeness, accuracy, and actionability',
        taskQueue: [],
        recentInsights: [],
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
        lastUpdate: new Date(),
        assignedGoals: ['Review research reports for gaps', 'Validate revenue calculations', 'Ensure tax compliance', 'Send back revisions until quality standards met'],
      },
      {
        id: 'integration-compiler',
        name: 'Integration Compiler',
        type: 'other',
        status: 'idle',
        description: 'Synthesizes all agent outputs into a master income strategy',
        taskQueue: [],
        recentInsights: [],
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
        lastUpdate: new Date(),
        assignedGoals: ['Combine all research into coherent plan', 'Prioritize by ROI/time', 'Create 3/6/12 month milestones', 'Produce final Path to £5k/mo document'],
      },
      // Additional parallel researcher slots
      {
        id: 'income-researcher-1',
        name: 'Income Researcher 1',
        type: 'other',
        status: 'idle',
        description: 'Parallel income research worker',
        taskQueue: [],
        recentInsights: [],
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
        lastUpdate: new Date(),
        assignedGoals: [],
      },
      {
        id: 'income-researcher-2',
        name: 'Income Researcher 2',
        type: 'other',
        status: 'idle',
        description: 'Parallel income research worker',
        taskQueue: [],
        recentInsights: [],
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
        lastUpdate: new Date(),
        assignedGoals: [],
      },
      {
        id: 'income-researcher-3',
        name: 'Income Researcher 3',
        type: 'other',
        status: 'idle',
        description: 'Parallel income research worker',
        taskQueue: [],
        recentInsights: [],
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
        lastUpdate: new Date(),
        assignedGoals: [],
      },
      // PAID Specialist: Gemini 3 Pro for complex tasks
      {
        id: 'paided-gemini-expert',
        name: 'Gemini Expert',
        type: 'other',
        status: 'idle',
        description: 'Specialist for complex multi-step system configuration, integration, and architectural tasks using Gemini 3 Pro',
        taskQueue: [],
        recentInsights: [],
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
        lastUpdate: new Date(),
        assignedGoals: [],
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

    await redis.set(DASHBOARD_KEY, serialize(initialData));
    return initialData;
  }

  // Update agent data (used by agents to report status)
  static async updateAgent(update: AgentUpdatePayload): Promise<DashboardData | null> {
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
    currentData.systemMetrics.lastUpdate = new Date();
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

    await redis.set(DASHBOARD_KEY, serialize(currentData));

    return currentData;
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

    await redis.set(DASHBOARD_KEY, serialize(currentData));
    return currentData;
  }

  // Clear all data (for testing)
  static async clearAll(): Promise<void> {
    await redis.del(DASHBOARD_KEY);
    await this.initializeDashboard();
  }
}
