'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked';

interface Task {
  id: string;
  title: string;
  owner: 'jimmy' | 'you';
  status: TaskStatus;
  note?: string;
}

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Deep-review existing bowling KDP plan and remove weak/risky tactics',
    owner: 'jimmy',
    status: 'done',
    note: 'Completed: trimmed risky review tactics + channel overload',
  },
  {
    id: 't2',
    title: 'Prepare Stage 1 metadata pack (titles/subtitles/keywords/categories)',
    owner: 'jimmy',
    status: 'in_progress',
  },
  {
    id: 't3',
    title: 'Prepare Stage 1 conversion copy pack (description A/B + cross-sell copy)',
    owner: 'jimmy',
    status: 'in_progress',
  },
  {
    id: 't4',
    title: 'Approve/reject Stage 1 pack (A/B options)',
    owner: 'you',
    status: 'todo',
    note: 'Your only step: Yes / No / Rethink',
  },
  {
    id: 't5',
    title: 'Apply approved KDP listing edits in account',
    owner: 'you',
    status: 'todo',
    note: 'Estimated 10-15 minutes',
  },
  {
    id: 't6',
    title: 'Stage 2 Amazon Ads test build (single-channel, tight kill-rules)',
    owner: 'jimmy',
    status: 'todo',
  },
];

const statusPill: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800',
  blocked: 'bg-red-100 text-red-800',
};

export default function KdpProjectPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('dashboard-dark-mode');
      if (savedTheme === '1') setDarkMode(true);

      const savedTasks = localStorage.getItem('kdp-operator-tasks-v1');
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) setTasks(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('dashboard-dark-mode', darkMode ? '1' : '0');
      localStorage.setItem('kdp-operator-tasks-v1', JSON.stringify(tasks));
    } catch {}
  }, [darkMode, tasks]);

  const progress = useMemo(() => {
    const done = tasks.filter((t) => t.status === 'done').length;
    return tasks.length ? (done / tasks.length) * 100 : 0;
  }, [tasks]);

  const nextDecision = useMemo(
    () => tasks.find((t) => t.owner === 'you' && t.status !== 'done'),
    [tasks]
  );

  const setTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  return (
    <div className={`min-h-screen bg-gray-100 p-6 ${darkMode ? 'dashboard-dark' : ''}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">KDP Growth Project</h1>
              <p className="text-gray-600 mt-1">
                Low-input operator mode: I do the heavy lifting, you approve yes/no.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Last update: {new Date().toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDarkMode((v) => !v)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 font-medium"
              >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
              <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                ← Dashboard
              </Link>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>{progress.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Execution Board</h2>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-medium text-gray-900">{task.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Owner: {task.owner === 'jimmy' ? 'Jimmy' : 'You'}
                      </div>
                      {task.note && <div className="text-xs text-gray-600 mt-1">{task.note}</div>}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusPill[task.status]}`}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button onClick={() => setTaskStatus(task.id, 'todo')} className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">To Do</button>
                    <button onClick={() => setTaskStatus(task.id, 'in_progress')} className="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200">In Progress</button>
                    <button onClick={() => setTaskStatus(task.id, 'done')} className="text-xs px-2 py-1 rounded bg-green-100 hover:bg-green-200">Done</button>
                    <button onClick={() => setTaskStatus(task.id, 'blocked')} className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200">Blocked</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Next Decision</h3>
              {nextDecision ? (
                <>
                  <p className="text-sm text-gray-800">{nextDecision.title}</p>
                  <p className="text-xs text-gray-500 mt-2">Reply with: <b>YES</b> / <b>NO</b> / <b>RETHINK</b></p>
                </>
              ) : (
                <p className="text-sm text-green-700 font-medium">No pending decisions 🎉</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Strategy Guardrails</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                <li>Single-channel paid test first (Amazon Ads)</li>
                <li>No risky review manipulation tactics</li>
                <li>Scale only if metrics pass kill-rules</li>
                <li>You only approve milestones, not micro-steps</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
