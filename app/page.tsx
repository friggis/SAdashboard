'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Agent,
  ActivityLog,
  IncomeGoal,
  DashboardData,
  AgentStatus,
  AgentInsight,
} from '@/lib/types';

// Components
const StatusBadge: React.FC<{ status: AgentStatus }> = ({ status }) => {
  const styles = {
    idle: 'bg-gray-100 text-gray-800',
    running: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    error: 'bg-red-100 text-red-800',
    paused: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

const InsightCard: React.FC<{ insight: AgentInsight }> = ({ insight }) => {
  const typeStyles = {
    finding: 'border-l-4 border-blue-500',
    opportunity: 'border-l-4 border-green-500',
    risk: 'border-l-4 border-red-500',
    recommendation: 'border-l-4 border-yellow-500',
  };

  const typeIcons = {
    finding: '🔍',
    opportunity: '💰',
    risk: '⚠️',
    recommendation: '💡',
  };

  return (
    <div className={`p-3 mb-2 bg-white rounded-lg shadow ${typeStyles[insight.type]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span>{typeIcons[insight.type]}</span>
            <span className="text-xs text-gray-500">
              {new Date(insight.timestamp).toLocaleTimeString()}
            </span>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${insight.confidence}%` }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-gray-800">{insight.content}</p>
        </div>
      </div>
    </div>
  );
};

const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => {
  const statusColors = {
    idle: 'border-gray-200',
    running: 'border-green-500',
    completed: 'border-blue-500',
    error: 'border-red-500',
    paused: 'border-yellow-500',
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`bg-white rounded-lg shadow border-2 ${statusColors[agent.status]} p-4`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">{agent.name}</h3>
          <p className="text-sm text-gray-600">{agent.description}</p>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      {agent.currentTask && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Current Task</span>
            <span className="text-xs text-gray-500">
              {agent.currentTask.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full ${getProgressColor(agent.currentTask.progress)}`}
              style={{ width: `${agent.currentTask.progress}%` }}
            ></div>
          </div>
          <p className="text-sm font-medium">{agent.currentTask.title}</p>
          {agent.currentTask.description && (
            <p className="text-xs text-gray-600 mt-1">{agent.currentTask.description}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-500">CPU Usage</div>
          <div className="text-lg font-bold text-gray-800">{agent.metrics.cpu}%</div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-500">Memory</div>
          <div className="text-lg font-bold text-gray-800">{agent.metrics.memory} MB</div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-500">Uptime</div>
          <div className="text-lg font-bold text-gray-800">
            {Math.floor(agent.metrics.uptime / 60)}m
          </div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-500">Tasks Done</div>
          <div className="text-lg font-bold text-gray-800">
            {agent.metrics.tasksCompleted}
          </div>
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="text-sm font-medium mb-2">Assigned Goals</div>
        <ul className="space-y-1">
          {agent.assignedGoals.map((goal, idx) => (
            <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
              <span className="text-blue-500">•</span>
              {goal}
            </li>
          ))}
        </ul>
      </div>

      {agent.recentInsights.length > 0 && (
        <div className="mt-4 border-t pt-3">
          <div className="text-sm font-medium mb-2">Recent Insights</div>
          <div className="max-h-48 overflow-y-auto">
            {agent.recentInsights.slice(0, 3).map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-400 text-right">
        Last update: {new Date(agent.lastUpdate).toLocaleTimeString()}
      </div>
    </div>
  );
};

const IncomeGoalCard: React.FC<{ goal: IncomeGoal }> = ({ goal }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl">Income Goal Progress</h3>
        <span className="text-2xl font-bold text-blue-600">
          £{goal.currentAmount.toFixed(2)}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress toward £{goal.targetAmount}/month</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-50 p-3 rounded">
          <div className="text-sm text-green-600">Remaining</div>
          <div className="text-xl font-bold text-green-700">
            £{remaining.toFixed(2)}
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-sm text-blue-600">Target</div>
          <div className="text-xl font-bold text-blue-700">
            £{goal.targetAmount.toFixed(2)}
          </div>
        </div>
      </div>

      {Object.keys(goal.breakdown).length > 0 && (
        <div className="border-t pt-4">
          <div className="text-sm font-medium mb-2">Breakdown by Agent</div>
          <div className="space-y-2">
            {Object.entries(goal.breakdown).map(([agent, amount]) => (
              <div key={agent} className="flex justify-between items-center">
                <span className="text-sm capitalize text-gray-600">
                  {agent.replace(/_/g, ' ')}
                </span>
                <span className="font-medium">£{(amount as number).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {goal.historical.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <div className="text-sm font-medium mb-2">Recent Trend</div>
          <div className="flex items-end gap-1 h-16">
            {goal.historical.slice(0, 7).reverse().map((entry, idx) => {
              const height = (entry.amount / goal.targetAmount) * 100;
              return (
                <div
                  key={idx}
                  className="flex-1 bg-blue-200 rounded-t"
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${new Date(entry.date).toLocaleDateString()}: £${entry.amount.toFixed(2)}`}
                ></div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ActivityFeed: React.FC<{ logs: ActivityLog[] }> = ({ logs }) => {
  const getTypeColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeBg = (type: ActivityLog['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'error':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold text-lg mb-4">Activity Feed</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`p-3 rounded-lg ${getTypeBg(log.type)} border-l-4 ${
              log.type === 'success'
                ? 'border-green-500'
                : log.type === 'warning'
                ? 'border-yellow-500'
                : log.type === 'error'
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium text-sm">{log.agentName}</span>
              <span className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-gray-800">{log.message}</p>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-gray-500 text-sm italic">No recent activity</p>
        )}
      </div>
    </div>
  );
};

const SystemMetrics: React.FC<{ metrics: any }> = ({ metrics }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h3 className="font-bold text-lg mb-4">System Overview</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-50 p-3 rounded">
        <div className="text-sm text-blue-600">Total Agents</div>
        <div className="text-2xl font-bold text-blue-700">{metrics.totalAgents}</div>
      </div>
      <div className="bg-green-50 p-3 rounded">
        <div className="text-sm text-green-600">Running Now</div>
        <div className="text-2xl font-bold text-green-700">{metrics.runningAgents}</div>
      </div>
      <div className="bg-purple-50 p-3 rounded">
        <div className="text-sm text-purple-600">Tasks Completed</div>
        <div className="text-2xl font-bold text-purple-700">{metrics.completedTasks}</div>
      </div>
      <div className="bg-red-50 p-3 rounded">
        <div className="text-sm text-red-600">Failed Tasks</div>
        <div className="text-2xl font-bold text-red-700">{metrics.failedTasks}</div>
      </div>
    </div>
    <div className="mt-4 text-xs text-gray-500 text-center">
      Last update: {new Date(metrics.lastUpdate).toLocaleString()}
    </div>
  </div>
);

// Main Dashboard Component
export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Poll for updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">No data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Research Agent Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time monitoring of all research activities and income generation
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Last updated: {new Date(data.timestamp).toLocaleString()}
          </div>
        </div>

        {/* Income Goal */}
        <div className="mb-8">
          <IncomeGoalCard goal={data.incomeGoal} />
        </div>

        {/* System Metrics */}
        <div className="mb-8">
          <SystemMetrics metrics={data.systemMetrics} />
        </div>

        {/* Agent Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agents Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mb-8">
          <ActivityFeed logs={data.activityLogs} />
        </div>
      </div>
    </div>
  );
}