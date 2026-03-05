import Link from 'next/link';

export default function IncomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Income Tracking</h1>
        <p className="text-gray-600 mb-4">Income progress is available in the dashboard API view.</p>
        <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block">Back Home</Link>
      </div>
    </main>
  );
}
