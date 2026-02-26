import Link from 'next/link';

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

function checklistBadge(status: string) {
  if (status === 'done') return '✅ Done';
  if (status === 'in-progress') return '🟡 In Progress';
  return '⬜ To Do';
}

export default function KaizenTrackingPage() {
  const testAppUrl = process.env.NEXT_PUBLIC_KAIZEN_TEST_URL || 'https://example.com/kaizen-test-app';

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kaizen App Development Tracker</h1>
              <p className="text-gray-600 mt-2">
                Dedicated planning and execution board for Kaizen product delivery.
              </p>
            </div>
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
              ← Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Plan Phases</h2>
          <div className="space-y-4">
            {phasePlan.map((phase) => (
              <div key={phase.phase} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">{phase.phase}</h3>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 space-y-1">
                  {phase.goals.map((goal) => (
                    <li key={goal}>{goal}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Checklist</h2>
            <ul className="space-y-3">
              {progressChecklist.map((entry) => (
                <li key={entry.item} className="flex items-start justify-between gap-3 border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-800">{entry.item}</span>
                  <span className="text-xs font-medium whitespace-nowrap text-gray-700">{checklistBadge(entry.status)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Decisions</h2>
            <div className="space-y-4">
              {keyDecisions.map((decision) => (
                <div key={decision.title} className="border-l-4 border-indigo-500 bg-indigo-50/40 p-3 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900">{decision.title}</h3>
                  <p className="text-sm text-gray-700 mt-1">{decision.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-2 border-dashed border-green-400">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Test Updated App</h2>
          <p className="text-sm text-gray-700 mb-3">
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
          <p className="text-xs text-gray-500 mt-2 break-all">Current URL: {testAppUrl}</p>
        </div>
      </div>
    </div>
  );
}
