/**
 * Dashboard Client for Node.js
 *
 * Simple client for reporting agent status to the Vercel dashboard.
 *
 * ```javascript
 * const { DashboardClient } = require('./dashboard-client');
 *
 * const client = new DashboardClient('https://your-app.vercel.app');
 *
 * // Start a task
 * await client.startTask('amazon-fba', 'task_001', 'Research products');
 *
 * // Update progress
 * await client.updateProgress('amazon-fba', 'task_001', 75);
 *
 * // Complete with income
 * await client.completeTask('amazon-fba', 'task_001', 150.00);
 * ```
 */

const axios = require('axios');

class DashboardClient {
  constructor(dashboardUrl) {
    this.baseUrl = dashboardUrl.replace(/\/$/, '');
    this.endpoint = `${this.baseUrl}/api/dashboard`;
    this.incomeEndpoint = `${this.baseUrl}/api/income`;
  }

  async update(agentId, data = {}) {
    try {
      const payload = { agentId, ...data };
      const response = await axios.post(this.endpoint, payload, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Dashboard update failed:', error.message);
      throw error;
    }
  }

  async updateStatus(agentId, status, message = null) {
    return this.update(agentId, { status, message });
  }

  async startTask(agentId, taskId, title, description = '') {
    const now = new Date().toISOString();
    return this.update(agentId, {
      status: 'running',
      currentTask: {
        id: taskId,
        title,
        description,
        status: 'in_progress',
        progress: 0,
        startTime: now
      },
      message: `Started: ${title}`
    });
  }

  async updateProgress(agentId, taskId, progress, message = null) {
    return this.update(agentId, {
      currentTask: { id: taskId, progress },
      message: message || `Progress: ${progress}%`
    });
  }

  async completeTask(agentId, taskId, income = null, insight = null) {
    const data = {
      currentTask: {
        id: taskId,
        status: 'completed',
        progress: 100,
        endTime: new Date().toISOString()
      }
    };

    if (insight) {
      data.newInsight = insight;
    }

    const result = await this.update(agentId, data);

    if (income) {
      await this.reportIncome(agentId, income);
    }

    return result;
  }

  async addInsight(agentId, type, content, confidence = 80, relatedTaskId = null) {
    return this.update(agentId, {
      newInsight: {
        type,
        content,
        confidence,
        relatedTaskId
      }
    });
  }

  async reportError(agentId, errorMessage) {
    return this.update(agentId, {
      status: 'error',
      message: `Error: ${errorMessage}`
    });
  }

  async reportIncome(agentId, amount, breakdownKey = null) {
    try {
      const payload = { agentId, amount };
      if (breakdownKey) {
        payload.breakdownKey = breakdownKey;
      }
      const response = await axios.post(this.incomeEndpoint, payload, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Income report failed:', error.message);
      throw error;
    }
  }

  async updateMetrics(agentId, metrics) {
    return this.update(agentId, { metrics });
  }
}

module.exports = { DashboardClient };