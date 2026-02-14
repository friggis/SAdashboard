'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Report {
  agentId: string;
  agentName: string;
  filename: string;
  title: string;
  path: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/reports')
      .then(r => r.json())
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load reports');
        setLoading(false);
      });
  }, []);

  const loadReport = async (report: Report) => {
    setSelectedReport(report);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: report.agentId, filename: report.filename }),
      });
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setContent(data.content);
      setLoading(false);
    } catch (err) {
      setError('Failed to load report content');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Reports</h1>
            <p className="text-gray-600">All completed agent research and findings</p>
          </div>
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            ← Back to Dashboard
          </Link>
        </div>

        {loading && <p className="text-gray-600">Loading reports...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-bold text-lg mb-4">Available Reports ({reports.length})</h2>
              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                {reports.map(report => (
                  <div
                    key={`${report.agentId}/${report.filename}`}
                    className={`p-3 rounded cursor-pointer border ${
                      selectedReport?.filename === report.filename
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => loadReport(report)}
                  >
                    <div className="font-medium text-gray-900">{report.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Agent: {report.agentName}
                    </div>
                    <div className="text-xs text-gray-400">{report.filename}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-4 border-b pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Agent: {selectedReport.agentName} | File: {selectedReport.filename}
                  </p>
                </div>
                {loading ? (
                  <p className="text-gray-600">Loading content...</p>
                ) : (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded border overflow-x-auto">
                      {content}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📄</div>
                <h3 className="text-xl font-medium text-gray-700">Select a report to view</h3>
                <p className="text-gray-500 mt-2">Click on any report from the list to see its full content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
