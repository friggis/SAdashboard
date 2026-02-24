'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function RecoveryPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dashboard-dark-mode');
      if (saved === '1') setDarkMode(true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('dashboard-dark-mode', darkMode ? '1' : '0');
    } catch {}
  }, [darkMode]);

  return (
    <div className={`min-h-screen bg-gray-100 p-6 ${darkMode ? 'dashboard-dark' : ''}`}>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Recovery Runbook</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(v => !v)}
              className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 font-medium"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">← Dashboard</Link>
          </div>
        </div>

        <p className="text-gray-600 mb-6">If something breaks after a change, follow this exactly.</p>

        <div className="space-y-6 text-gray-800">
          <section>
            <h2 className="text-xl font-semibold mb-2">1) Before any change (checkpoint)</h2>
            <pre className="bg-gray-100 rounded p-3 overflow-x-auto"><code>cd ~/.openclaw/workspace
./scripts/prechange-checkpoint.sh</code></pre>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2) If things break (one command rollback)</h2>
            <pre className="bg-gray-100 rounded p-3 overflow-x-auto"><code>safe-rollback</code></pre>
            <p className="text-sm text-gray-600 mt-2">If alias not installed yet, run:</p>
            <pre className="bg-gray-100 rounded p-3 overflow-x-auto"><code>cd ~/.openclaw/workspace
./scripts/install-safe-alias.sh
source ~/.bashrc</code></pre>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3) Health checks</h2>
            <pre className="bg-gray-100 rounded p-3 overflow-x-auto"><code>cd ~/openclaw
docker compose ps
ss -tlnp | grep 18789 || echo "no listener"
curl -sS https://s-adashboard.vercel.app/api/dashboard | head</code></pre>
          </section>
        </div>
      </div>
    </div>
  );
}
