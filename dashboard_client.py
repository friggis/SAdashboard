#!/usr/bin/env python3
"""
Agent Integration Helper for Vercel Dashboard

This module provides a simple Python client for reporting agent status
and insights to the Vercel dashboard.
"""

import requests
import json
from typing import Optional, Dict, Any
from datetime import datetime


class VercelDashboardClient:
    def __init__(self, dashboard_url: str):
        """
        Initialize the dashboard client.

        Args:
            dashboard_url: Your Vercel dashboard URL (e.g., https://your-app.vercel.app)
        """
        self.base_url = dashboard_url.rstrip('/')
        self.endpoint = f"{self.base_url}/api/dashboard"
        self.income_endpoint = f"{self.base_url}/api/income"

    def update_status(
        self,
        agent_id: str,
        status: Optional[str] = None,
        current_task: Optional[Dict[str, Any]] = None,
        new_insight: Optional[Dict[str, Any]] = None,
        metrics: Optional[Dict[str, Any]] = None,
        message: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Update the agent's status and send updates to the dashboard.

        Args:
            agent_id: One of: 'amazon-fba', 'tennis-betting', 'challenge-agents', 'coordinator'
            status: Agent status (idle, running, completed, error, paused)
            current_task: Dictionary with task details
            new_insight: Dictionary with insight details
            metrics: Dictionary with performance metrics
            message: Optional activity log message

        Returns:
            Dashboard response
        """
        payload = {"agentId": agent_id}

        if status:
            payload["status"] = status

        if current_task:
            payload["currentTask"] = current_task

        if new_insight:
            payload["newInsight"] = new_insight

        if metrics:
            payload["metrics"] = metrics

        if message:
            payload["message"] = message

        response = requests.post(self.endpoint, json=payload, timeout=10)
        response.raise_for_status()
        return response.json()

    def report_income(
        self,
        agent_id: str,
        amount: float,
        breakdown_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Report earnings towards the income goal.

        Args:
            agent_id: The agent that earned the money
            amount: Amount in GBP
            breakdown_key: Optional breakdown category

        Returns:
            Dashboard response
        """
        payload = {
            "agentId": agent_id,
            "amount": amount
        }

        if breakdown_key:
            payload["breakdownKey"] = breakdown_key

        response = requests.post(self.income_endpoint, json=payload, timeout=10)
        response.raise_for_status()
        return response.json()

    def start_task(
        self,
        agent_id: str,
        task_id: str,
        title: str,
        description: str = ""
    ) -> Dict[str, Any]:
        """Convenience method to start a task."""
        return self.update_status(
            agent_id=agent_id,
            status="running",
            current_task={
                "id": task_id,
                "title": title,
                "description": description,
                "status": "in_progress",
                "progress": 0,
                "startTime": datetime.now().isoformat()
            },
            message=f"Started task: {title}"
        )

    def update_progress(
        self,
        agent_id: str,
        task_id: str,
        progress: int,
        message: Optional[str] = None
    ) -> Dict[str, Any]:
        """Update progress of current task."""
        return self.update_status(
            agent_id=agent_id,
            current_task={
                "id": task_id,
                "progress": progress
            },
            message=message or f"Progress: {progress}%"
        )

    def complete_task(
        self,
        agent_id: str,
        task_id: str,
        income: Optional[float] = None,
        insight: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Mark task as completed."""
        payload = {
            "agentId": agent_id,
            "currentTask": {
                "id": task_id,
                "status": "completed",
                "progress": 100,
                "endTime": datetime.now().isoformat()
            }
        }

        if income:
            self.report_income(agent_id, income)

        if insight:
            payload["newInsight"] = insight

        response = requests.post(self.endpoint, json=payload)
        response.raise_for_status()
        return response.json()

    def add_insight(
        self,
        agent_id: str,
        insight_type: str,
        content: str,
        confidence: int = 80,
        related_task_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Add a new insight."""
        return self.update_status(
            agent_id=agent_id,
            new_insight={
                "type": insight_type,
                "content": content,
                "confidence": confidence,
                "relatedTaskId": related_task_id
            }
        )

    def report_error(
        self,
        agent_id: str,
        error_message: str
    ) -> Dict[str, Any]:
        """Report an error."""
        return self.update_status(
            agent_id=agent_id,
            status="error",
            message=f"Error: {error_message}"
        )


# Example usage
if __name__ == "__main__":
    # Configure your dashboard URL
    DASHBOARD_URL = "http://localhost:3000"  # Change to your Vercel URL

    client = VercelDashboardClient(DASHBOARD_URL)

    # Simulate an Amazon FBA agent
    try:
        # Start a task
        client.start_task(
            agent_id="amazon-fba",
            task_id="task_001",
            title="Research profitable product niches",
            description="Analyze trending categories on Amazon"
        )
        print("✓ Started task")

        # Update progress
        client.update_progress(
            agent_id="amazon-fba",
            task_id="task_001",
            progress=50,
            message="Analyzed top 50 products"
        )
        print("✓ Updated progress to 50%")

        # Add insight
        client.add_insight(
            agent_id="amazon-fba",
            insight_type="finding",
            content="Found 3 product opportunities with >30% profit margins",
            confidence=85,
            related_task_id="task_001"
        )
        print("✓ Added insight")

        # Complete task with income
        client.complete_task(
            agent_id="amazon-fba",
            task_id="task_001",
            income=125.50,
            insight={
                "type": "opportunity",
                "content": "Seasonal demand increasing for outdoor furniture",
                "confidence": 92
            }
        )
        print("✓ Completed task with £125.50 income")

    except requests.exceptions.RequestException as e:
        print(f"✗ Error: {e}")