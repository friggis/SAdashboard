// Agent types and interfaces for the research dashboard

export type AgentStatus = 'idle' | 'running' | 'completed' | 'error' | 'paused';

export interface AgentMetrics {
  cpu: number;          // CPU usage percentage
  memory: number;       // Memory usage in MB
  uptime: number;       // Uptime in seconds
  tasksCompleted: number;
  tasksFailed: number;
  lastExecutionTime?: number; // Last execution duration in ms
}

export interface AgentTask {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number; // 0-100
  startTime?: Date;
  endTime?: Date;
  result?: string;
  error?: string;
}

export interface AgentInsight {
  id: string;
  timestamp: Date;
  content: string;
  type: 'finding' | 'opportunity' | 'risk' | 'recommendation';
  confidence: number; // 0-100
  relatedTaskId?: string;
}

export interface Agent {
  id: string;
  name: string;
  type: 'amazon_fba' | 'tennis_betting' | 'challenge' | 'coordinator' | 'other';
  status: AgentStatus;
  description: string;
  currentTask?: AgentTask;
  taskQueue: AgentTask[];
  recentInsights: AgentInsight[];
  metrics: AgentMetrics;
  lastUpdate: Date;
  assignedGoals: string[];
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  agentId: string;
  agentName: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  metadata?: Record<string, any>;
}

export interface IncomeGoal {
  targetAmount: number; // £5000
  currentAmount: number;
  currency: string;
  period: 'monthly' | 'weekly' | 'daily';
  breakdown: {
    amazon_fba?: number;
    tennis_betting?: number;
    challenge_agents?: number;
    other?: number;
  };
  historical: {
    date: Date;
    amount: number;
  }[];
}

export interface DashboardData {
  agents: Agent[];
  activityLogs: ActivityLog[];
  incomeGoal: IncomeGoal;
  systemMetrics: {
    totalAgents: number;
    runningAgents: number;
    completedTasks: number;
    failedTasks: number;
    totalInsights: number;
    lastUpdate: Date;
  };
  timestamp: Date;
}

export interface AgentUpdatePayload {
  agentId: string;
  status?: AgentStatus;
  currentTask?: Partial<AgentTask>;
  newInsight?: Omit<AgentInsight, 'id' | 'timestamp'>;
  metrics?: Partial<AgentMetrics>;
  message?: string; // For activity logs
}

// Helper to create default agent
export function createDefaultAgent(
  id: string,
  name: string,
  type: Agent['type'],
  description: string
): Agent {
  return {
    id,
    name,
    type,
    status: 'idle',
    description,
    taskQueue: [],
    recentInsights: [],
    metrics: {
      cpu: 0,
      memory: 0,
      uptime: 0,
      tasksCompleted: 0,
      tasksFailed: 0,
    },
    lastUpdate: new Date(),
    assignedGoals: [],
  };
}