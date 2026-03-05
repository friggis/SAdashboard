import Link from 'next/link';

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agents</h1>
        <p className="text-gray-600 mb-4">See the full system summary on the dashboard and reports pages.</p>
        <div className="flex gap-3">
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Back Home</Link>
          <Link href="/reports" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Open Reports</Link>
        </div>
      </div>
    </main>
  );
}
