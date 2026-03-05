import Link from 'next/link';

type NavItem = {
  title: string;
  href: string;
  icon: string;
  description: string;
};

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: '🏠', description: 'Main system dashboard' },
  { title: 'Agents', href: '/agents', icon: '🤖', description: 'Agent status and ownership' },
  { title: 'Marketing', href: '/marketing', icon: '📣', description: 'Kaizen Bowling marketing plan' },
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
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard Navigation</h1>
          <p className="text-gray-600 mt-2">Quick access to each major area.</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-blue-300 transition"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </Link>
          ))}
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agents Overview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200 text-gray-600">
                  <th className="py-2 pr-4">Agent</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Model</th>
                  <th className="py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.name} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-4 font-semibold text-gray-900">{agent.name}</td>
                    <td className="py-3 pr-4 text-gray-700">{agent.role}</td>
                    <td className="py-3 pr-4 text-gray-700">{agent.model}</td>
                    <td className="py-3 text-gray-700">{agent.description}</td>
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
