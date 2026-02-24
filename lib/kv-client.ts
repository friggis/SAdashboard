import { Redis } from 'ioredis';
import { Agent, ActivityLog, DashboardData, AgentUpdatePayload } from './types';

const DASHBOARD_KEY = 'dashboard:data';
const LOCK_KEY = 'dashboard:lock';
const LOCK_TTL = 10; // seconds
const RUNNING_STALE_MS = 15 * 60 * 1000; // 15 minutes

// Check if we should use in-memory mock (for local development without Redis)
const USE_MOCK = !process.env.REDIS_URL;

// In-memory store for mock mode
let mockData: DashboardData | null = null;

// Initialize Redis client from environment variable (only if not in mock mode)
const redis = USE_MOCK ? null : new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

// Serialization helpers
const serialize = (value: unknown): string => JSON.stringify(value);
const deserialize = <T>(value: string): T => JSON.parse(value);

export class KVClient {
  // Default agents list (kept in sync with initializeDashboard)
  private static getDefaultAgents(): Agent[] {
    return [
      {
        id: 'dashboard-maintainer',
        name: 'Dashboard Maintainer',
        type: 'maintainer',
        status: 'idle',
        description: 'Monitors SAdashboard health and uptime, ensures continuous operation, and reports status',
        taskQueue: [],
        recentInsights: [],
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
        lastUpdate: new Date(),
        assignedGoals: ['Monitor dashboard uptime', 'Run health checks every 30 minutes', 'Report status to dashboard'],
      },
      // Legacy vertical agents removed from active dashboard list

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
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
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
      // Parallel researcher clones removed from active dashboard list

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
  }

  // Get complete dashboard data
  static async getDashboardData(): Promise<DashboardData | null> {
    try {
      // Mock mode: use in-memory data
      if (USE_MOCK) {
        if (!mockData) {
          mockData = await this.initializeDashboard();
        }
        return mockData;
      }

      // Redis mode
      const data = await redis!.get(DASHBOARD_KEY);
      if (!data) {
        return this.initializeDashboard();
      }
      const dashboard = deserialize<DashboardData>(data);

      // Merge any missing default agents (supports zero-downtime agent additions)
      const defaultAgents = this.getDefaultAgents();
      const existingIds = new Set(dashboard.agents.map(a => a.id));
      const missingAgents = defaultAgents.filter(a => !existingIds.has(a.id));
      let changed = false;

      // Prune only explicitly deprecated legacy agents (keep dynamic/new agents)
      const deprecatedIds = new Set([
        'amazon-fba',
        'tennis-betting',
        'challenge-agents',
        'income-researcher-1',
        'income-researcher-2',
        'income-researcher-3',
      ]);
      const beforeCount = dashboard.agents.length;
      dashboard.agents = dashboard.agents.filter(a => !deprecatedIds.has(a.id));
      if (dashboard.agents.length !== beforeCount) {
        changed = true;
      }

      // Backfill token usage for older stored data
      if (!dashboard.tokenUsage) {
        dashboard.tokenUsage = {
          tokenLimit: 1_000_000,
          tokenUsed: 0,
          tokenUsedPercent: 0,
          bySource: { main: 0, free: 0 },
          lastTasks: [],
        };
        changed = true;
      }
      if (!dashboard.tokenUsage.bySource) {
        dashboard.tokenUsage.bySource = {
          main: 0,
          free: Number(dashboard.tokenUsage.tokenUsed || 0),
        };
        changed = true;
      }

      // Normalize stale "running" agents to idle
      const nowMs = Date.now();
      for (const agent of dashboard.agents) {
        const lastUpdateMs = new Date(agent.lastUpdate).getTime();
        if (agent.status === 'running' && Number.isFinite(lastUpdateMs) && nowMs - lastUpdateMs > RUNNING_STALE_MS) {
          agent.status = 'idle';
          changed = true;
        }
      }

      if (missingAgents.length > 0) {
        console.log(`[KVClient] Merging ${missingAgents.length} missing agent(s) into dashboard: ${missingAgents.map(a => a.id).join(', ')}`);
        dashboard.agents.push(...missingAgents);
        changed = true;
      }

      // Keep system metrics aligned with latest agent state
      dashboard.systemMetrics.totalAgents = dashboard.agents.length;
      dashboard.systemMetrics.runningAgents = dashboard.agents.filter(a => a.status === 'running').length;
      dashboard.systemMetrics.totalInsights = dashboard.agents.reduce((sum, a) => sum + a.recentInsights.length, 0);

      if (changed) {
        dashboard.timestamp = new Date();
        await redis!.set(DASHBOARD_KEY, serialize(dashboard));
      }

      return dashboard;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return null;
    }
  }

  // Initialize dashboard with default data
  private static async initializeDashboard(): Promise<DashboardData> {
    const defaultAgents = this.getDefaultAgents();

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
      tokenUsage: {
        tokenLimit: 1_000_000,
        tokenUsed: 0,
        tokenUsedPercent: 0,
        bySource: { main: 0, free: 0 },
        lastTasks: [],
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

    if (USE_MOCK) {
      mockData = initialData;
    } else {
      await redis!.set(DASHBOARD_KEY, serialize(initialData));
    }
    return initialData;
  }

  // Update agent data (used by agents to report status)
  static async updateAgent(update: AgentUpdatePayload): Promise<DashboardData | null> {
    const currentData = await this.getDashboardData();
    if (!currentData) return null;

    let agentIndex = currentData.agents.findIndex(a => a.id === update.agentId);
    if (agentIndex === -1) {
      // Auto-register dynamic agents so external subagents can report without 500s
      const dynamicAgent: Agent = {
        id: update.agentId,
        name: update.agentId
          .split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
        type: 'other',
        status: update.status ?? 'idle',
        description: 'Dynamically registered reporting agent',
        taskQueue: [],
        recentInsights: [],
        metrics: { cpu: 0, memory: 0, uptime: 0, tasksCompleted: 0, tasksFailed: 0 },
        lastUpdate: new Date(),
        assignedGoals: [],
      };
      currentData.agents.push(dynamicAgent);
      agentIndex = currentData.agents.length - 1;
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

    // Update token usage summary
    if (!currentData.tokenUsage) {
      currentData.tokenUsage = {
        tokenLimit: 1_000_000,
        tokenUsed: 0,
        tokenUsedPercent: 0,
        bySource: { main: 0, free: 0 },
        lastTasks: [],
      };
    }
    if (!currentData.tokenUsage.bySource) {
      currentData.tokenUsage.bySource = { main: 0, free: 0 };
    }

    const source = update.tokenUsage?.source || 'main';
    const tokenDelta = Math.max(0, Number(update.tokenUsage?.usedTokensDelta || 0));
    if (tokenDelta > 0) {
      currentData.tokenUsage.tokenUsed += tokenDelta;
      currentData.tokenUsage.bySource[source] += tokenDelta;
    }

    const taskTokensUsed = Math.max(0, Number(update.tokenUsage?.taskTokensUsed || 0));
    const taskTitle = update.tokenUsage?.taskTitle || update.currentTask?.title;
    if (taskTokensUsed > 0 && taskTitle) {
      const normalizedTitle = String(taskTitle).toLowerCase();
      const isKeepalive =
        normalizedTitle.includes('keepalive') || normalizedTitle.includes('heartbeat');

      if (!isKeepalive) {
        currentData.tokenUsage.lastTasks.unshift({
          title: taskTitle,
          tokensUsed: taskTokensUsed,
          agentId: update.agentId,
          timestamp: new Date(),
          source,
        });
        currentData.tokenUsage.lastTasks = currentData.tokenUsage.lastTasks.slice(0, 5);
      }
    }

    currentData.tokenUsage.tokenUsedPercent =
      currentData.tokenUsage.tokenLimit > 0
        ? (currentData.tokenUsage.tokenUsed / currentData.tokenUsage.tokenLimit) * 100
        : 0;

    if (USE_MOCK) {
      mockData = currentData;
    } else {
      await redis!.set(DASHBOARD_KEY, serialize(currentData));
    }

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

    if (breakdownKey && currentData.incomeGoal.breakdown[breakdownKey] !== undefined) {
      (currentData.incomeGoal.breakdown[breakdownKey] as number) += amount;
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

    if (USE_MOCK) {
      mockData = currentData;
    } else {
      await redis!.set(DASHBOARD_KEY, serialize(currentData));
    }
    return currentData;
  }

  // Clear all data (for testing)
  static async clearAll(): Promise<void> {
    if (USE_MOCK) {
      mockData = null;
    } else {
      await redis!.del(DASHBOARD_KEY);
    }
    await this.initializeDashboard();
  }
}
