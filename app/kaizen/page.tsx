'use client';

import Link from 'next/link';
import { useState } from 'react';

const phasePlan = [
  {
    phase: 'Phase 1 — Foundation & Scope',
    goals: [
      'Confirm MVP scope and success criteria',
      'Lock technical boundaries for offline-first behaviour',
      'Document constraints and rollout assumptions',
    ],
  },
  {
    phase: 'Phase 2 — Core Build',
    goals: [
      'Implement onboarding and core Kaizen workflows',
      'Add robust local persistence for offline mode',
      'Enforce single active device session policy',
    ],
  },
  {
    phase: 'Phase 3 — Commercial & Access',
    goals: [
      'Integrate trial period onboarding and limits',
      'Add free-tier guardrails and upsell checkpoints',
      'Define conversion metrics and instrumentation events',
    ],
  },
  {
    phase: 'Phase 4 — QA, Launch & Iteration',
    goals: [
      'Run regression and offline scenario testing',
      'Validate device session transitions and recovery',
      'Launch to controlled users and monitor adoption',
    ],
  },
];

const progressChecklist = [
  { item: 'Project goals aligned and documented', status: 'done' },
  { item: 'Offline mode architecture selected', status: 'done' },
  { item: 'Single active device enforcement design approved', status: 'in-progress' },
  { item: 'Trial/free-tier policy and limits drafted', status: 'in-progress' },
  { item: 'Test plan and release checklist prepared', status: 'todo' },
];

const keyDecisions = [
  {
    title: 'Offline Mode (Core Requirement)',
    detail:
      'Kaizen must remain usable with no network connection, syncing safely when connectivity returns.',
  },
  {
    title: 'Single Active Device',
    detail:
      'Each account should have one active authenticated device at a time to simplify sync and reduce conflict risk.',
  },
  {
    title: 'Trial + Free-Tier Model',
    detail:
      'Product access starts with a trial and continues on a constrained free tier, with clear value gates for paid conversion.',
  },
];

const mobileRoadmap = [
  {
    phase: 'Mobile Phase A — Stabilize Web Core',
    timeline: '2–4 weeks',
    items: [
      'Finish web requirements: offline sync, single-device policy, pricing gates, reliable calculations',
      'Fix lint/test baseline and lock release criteria',
      'Ensure backend + auth + entitlement checks are stable',
    ],
  },
  {
    phase: 'Mobile Phase B — Shared Logic + API Contract',
    timeline: '1–2 weeks',
    items: [
      'Move business logic into shared modules',
      'Document API contract for scores/sync/subscriptions',
      'Add sync conflict handling + telemetry events',
    ],
  },
  {
    phase: 'Mobile Phase C — Build iOS + Android Apps',
    timeline: '3–6 weeks',
    items: [
      'Implement app shell (React Native/Expo or Capacitor route)',
      'Wire offline storage + background sync on device',
      'Adapt UI/UX for touch, navigation, and mobile states',
    ],
  },
  {
    phase: 'Mobile Phase D — Payments + Store Readiness',
    timeline: '2–6 weeks',
    items: [
      'Implement Apple IAP + Google Play Billing for subscriptions',
      'Add restore purchases, entitlement sync, and support flow',
      'Prepare App Store/Play Store listing, privacy policy, and submission assets',
    ],
  },
];

function checklistBadge(status: string) {
  if (status === 'done') return '✅ Done';
  if (status === 'in-progress') return '🟡 In Progress';
  return '⬜ To Do';
}

export default function KaizenTrackingPage() {
  const [darkMode, setDarkMode] = useState(true);
  const testAppUrl = process.env.NEXT_PUBLIC_KAIZEN_TEST_URL || 'https://kaizenbowling.vercel.app';

  const pageBg = darkMode ? 'bg-slate-950' : 'bg-gray-100';
  const cardBg = darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white';
  const titleText = darkMode ? 'text-slate-100' : 'text-gray-900';
  const bodyText = darkMode ? 'text-slate-300' : 'text-gray-700';
  const mutedText = darkMode ? 'text-slate-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen p-6 ${pageBg}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className={`rounded-xl shadow p-6 ${cardBg}`}>
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div>
              <h1 className={`text-3xl font-bold ${titleText}`}>Kaizen App Development Tracker</h1>
              <p className={`mt-2 ${mutedText}`}>
                Dedicated planning and execution board for Kaizen product delivery.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDarkMode((v) => !v)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-medium"
              >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
              <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow p-6 ${cardBg}`}>
          <h2 className={`text-xl font-semibold mb-4 ${titleText}`}>Project Plan Phases</h2>
          <div className="space-y-4">
            {phasePlan.map((phase) => (
              <div key={phase.phase} className={`rounded-lg p-4 ${darkMode ? 'border border-slate-700' : 'border border-gray-200'}`}>
                <h3 className={`font-semibold ${titleText}`}>{phase.phase}</h3>
                <ul className={`list-disc pl-5 mt-2 text-sm space-y-1 ${bodyText}`}>
                  {phase.goals.map((goal) => (
                    <li key={goal}>{goal}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`rounded-xl shadow p-6 ${cardBg}`}>
            <h2 className={`text-xl font-semibold mb-4 ${titleText}`}>Progress Checklist</h2>
            <ul className="space-y-3">
              {progressChecklist.map((entry) => (
                <li
                  key={entry.item}
                  className={`flex items-start justify-between gap-3 pb-2 ${darkMode ? 'border-b border-slate-800' : 'border-b border-gray-100'}`}
                >
                  <span className={`text-sm ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{entry.item}</span>
                  <span className={`text-xs font-medium whitespace-nowrap ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {checklistBadge(entry.status)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`rounded-xl shadow p-6 ${cardBg}`}>
            <h2 className={`text-xl font-semibold mb-4 ${titleText}`}>Key Decisions</h2>
            <div className="space-y-4">
              {keyDecisions.map((decision) => (
                <div
                  key={decision.title}
                  className={`border-l-4 p-3 rounded-r-lg ${darkMode ? 'border-indigo-400 bg-indigo-950/40' : 'border-indigo-500 bg-indigo-50/40'}`}
                >
                  <h3 className={`font-semibold ${titleText}`}>{decision.title}</h3>
                  <p className={`text-sm mt-1 ${bodyText}`}>{decision.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow p-6 ${cardBg}`}>
          <h2 className={`text-xl font-semibold mb-4 ${titleText}`}>Web → iOS + Android Roadmap</h2>
          <p className={`text-sm mb-4 ${bodyText}`}>
            This is the phased plan to ship mobile apps safely after web stabilization.
          </p>
          <div className="space-y-4">
            {mobileRoadmap.map((phase) => (
              <div key={phase.phase} className={`rounded-lg p-4 ${darkMode ? 'border border-slate-700' : 'border border-gray-200'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className={`font-semibold ${titleText}`}>{phase.phase}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-700'}`}>
                    {phase.timeline}
                  </span>
                </div>
                <ul className={`list-disc pl-5 mt-2 text-sm space-y-1 ${bodyText}`}>
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl shadow p-6 border-2 border-dashed ${darkMode ? 'border-green-500 bg-slate-900' : 'border-green-400 bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-2 ${titleText}`}>Test Updated App</h2>
          <p className={`text-sm mb-3 ${bodyText}`}>
            Use this link placeholder for QA/UAT access. Configure with <code>NEXT_PUBLIC_KAIZEN_TEST_URL</code>.
          </p>
          <a
            href={testAppUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
          >
            Open Test Build ↗
          </a>
          <p className={`text-xs mt-2 break-all ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Current URL: {testAppUrl}</p>
        </div>
      </div>
    </div>
  );
}
