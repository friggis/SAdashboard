'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type NavItem = {
  title: string;
  href: string;
  icon: string;
  description: string;
  variant?: 'default' | 'dark';
};

const navItems: NavItem[] = [
  { title: 'Agents', href: '/agents', icon: '🤖', description: 'Agent status and ownership' },
  { title: 'Marketing', href: '/marketing', icon: '📣', description: 'Kaizen Bowling marketing plan' },
  { title: 'KDP project', href: '/kdp', icon: '📦', description: 'KDP project management' },
  { title: 'NSI Bowling', href: '/kaizen', icon: '🎓', description: 'NSI bowling training resources' },
  { title: 'Recovery', href: '/recovery', icon: '🔄', description: 'System recovery and data restoration' },
  { title: 'Research Reports', href: '/reports', icon: '📄', description: 'All research outputs and reports' },
  { title: 'Income Tracking', href: '/income', icon: '💷', description: 'Income goals and progress' },
  { title: 'Settings', href: '/settings', icon: '⚙️', description: 'System preferences' },
];

const agents = [
  {
    name: 'Jimmy',
    role: 'Main Orchestrator',
    model: 'stepfun/step-3.5-flash:free',
    description: 'Coordinates tasks across specialist agents and keeps work moving.',
  },
  {
    name: 'Codex',
    role: 'Coding Project Manager',
    model: 'openai-codex/gpt-5.3-codex',
    description: 'Implements code changes, debugging, and technical execution.',
  },
  {
    name: 'Mark the Marketer',
    role: 'Marketing Specialist',
    model: 'stepfun/step-3.5-flash:free',
    description: 'Builds campaigns, positioning, and growth plans for products.',
  },
  {
    name: 'Grant',
    role: 'Research Agent',
    model: 'stepfun/step-3.5-flash:free',
    description: 'Produces deep-dive research reports and evidence-backed insights.',
  },
  {
    name: 'GLM',
    role: 'QA Verifier',
    model: 'z-ai/glm-4.5-air:free',
    description: 'Validates outputs, checks quality, and flags inconsistencies.',
  },
];

export default function HomePage() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboard-theme-dark');
    if (savedTheme === 'true') {
      setDark(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboard-theme-dark', String(dark));
  }, [dark]);

  return (
    <main className={`${dark ? 'dark bg-gray-950' : 'bg-gray-50'} min-h-screen p-6 flex flex-col items-center justify-center transition-colors`}>
      <div className="w-full max-w-6xl space-y-8 flex flex-col items-center">
        <header className="text-center w-full">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">Dashboard Navigation</h1>
            <button
              type="button"
              onClick={() => setDark((prev) => !prev)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-lg shadow-sm hover:shadow-md transition"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Quick access to each major area.</p>
        </header>

        <section className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
          {navItems.map((item) => {
            const isDark = item.variant === 'dark';

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`w-full max-w-sm justify-self-center rounded-xl border p-5 transition hover:shadow-md ${
                  isDark
                    ? 'border-gray-900 bg-gray-900 text-white hover:bg-gray-800 hover:border-gray-800'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-blue-500'
                }`}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>{item.title}</h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-200' : 'text-gray-600 dark:text-gray-300'}`}>{item.description}</p>
              </Link>
            );
          })}
        </section>

        <section className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">Agents Overview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm mx-auto">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-center">
                  <th className="py-2 px-2 md:pr-4">Agent</th>
                  <th className="py-2 px-2 md:pr-4">Role</th>
                  <th className="py-2 px-2 md:pr-4">Model</th>
                  <th className="py-2 px-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.name} className="border-b border-gray-100 dark:border-gray-800 align-top text-center">
                    <td className="py-3 px-2 md:pr-4 font-semibold text-gray-900 dark:text-gray-100">{agent.name}</td>
                    <td className="py-3 px-2 md:pr-4 text-gray-700 dark:text-gray-300">{agent.role}</td>
                    <td className="py-3 px-2 md:pr-4 text-gray-700 dark:text-gray-300">{agent.model}</td>
                    <td className="py-3 px-2 text-gray-700 dark:text-gray-300">{agent.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
