'use client';

import React, { useEffect, useState, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Report {
  agentId: string;
  agentName: string;
  filename: string;
  title: string;
  path: string;
}

function ReportsContent() {
  const searchParams = useSearchParams();
  const agentFilter = searchParams.get('agent');

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [readReports, setReadReports] = useState<Set<string>>(new Set());

  // Load read status from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('read-reports');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReadReports(new Set(parsed));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Save read status when it changes
  useEffect(() => {
    if (readReports.size > 0) {
      localStorage.setItem('read-reports', JSON.stringify([...readReports]));
    }
  }, [readReports]);

  useEffect(() => {
    fetch('/api/reports')
      .then(r => r.json())
      .then(data => {
        setReports(data);
        setLoading(false);
        // Auto-select first report for filtered agent
        if (agentFilter && data.length > 0) {
          const agentReports = data.filter((r: Report) => r.agentId === agentFilter);
          if (agentReports.length > 0) {
            setSelectedReport(agentReports[0]);
            loadReportContent(agentReports[0]);
          }
        }
      })
      .catch(err => {
        setError('Failed to load reports');
        setLoading(false);
      });
  }, [agentFilter]);

  const loadReportContent = async (report: Report) => {
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
      // Mark as read
      const key = `${report.agentId}/${report.filename}`;
      setReadReports(prev => new Set(prev).add(key));
      setLoading(false);
    } catch (err) {
      setError('Failed to load report content');
      setLoading(false);
    }
  };

  const loadReport = (report: Report) => {
    loadReportContent(report);
  };

  // Group reports by agent
  const reportsByAgent = useMemo(() => {
    const groups: Record<string, { agentName: string; reports: Report[] }> = {};
    reports.forEach(r => {
      if (!groups[r.agentId]) {
        groups[r.agentId] = { agentName: r.agentName, reports: [] };
      }
      groups[r.agentId].reports.push(r);
    });
    return groups;
  }, [reports]);

  // Count unread per agent
  const unreadCountByAgent = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.entries(reportsByAgent).forEach(([agentId, { reports }]) => {
      counts[agentId] = reports.filter(r => !readReports.has(`${r.agentId}/${r.filename}`)).length;
    });
    return counts;
  }, [reportsByAgent, readReports]);

  const totalUnread = useMemo(() => {
    return reports.filter(r => !readReports.has(`${r.agentId}/${r.filename}`)).length;
  }, [reports, readReports]);

  // Filter reports if agentFilter is set
  const displayedReports = agentFilter
    ? reports.filter(r => r.agentId === agentFilter)
    : reports;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Reports</h1>
            <p className="text-gray-600">
              {agentFilter
                ? `${displayedReports.length} report(s) for ${displayedReports[0]?.agentName || 'this agent'}`
                : `All completed agent research (${reports.length} total${totalUnread > 0 ? `, ${totalUnread} new` : ''})`}
            </p>
          </div>
          <div className="flex gap-3">
            {agentFilter && (
              <Link
                href="/reports"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                ← Show All Agents
              </Link>
            )}
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {loading && <p className="text-gray-600">Loading reports...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!agentFilter ? (
          /* Grouped by agent view */
          <div className="space-y-6">
            {Object.entries(reportsByAgent).map(([agentId, { agentName, reports: agentReports }]) => (
              <div key={agentId} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4 pb-2 border-b">
                  <div>
                    <h2 className="font-bold text-xl text-gray-900">{agentName}</h2>
                    <p className="text-sm text-gray-500">
                      {agentReports.length} report{agentReports.length !== 1 ? 's' : ''}
                      {unreadCountByAgent[agentId] > 0 && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          {unreadCountByAgent[agentId]} NEW
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {unreadCountByAgent[agentId] === 0 ? '✓ All read' : `${unreadCountByAgent[agentId]} unread`}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {agentReports.map(report => {
                    const isRead = readReports.has(`${report.agentId}/${report.filename}`);
                    return (
                      <div
                        key={`${report.agentId}/${report.filename}`}
                        className={`p-4 rounded cursor-pointer border transition-colors ${
                          selectedReport?.filename === report.filename
                            ? 'border-blue-500 bg-blue-50'
                            : isRead
                            ? 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            : 'border-blue-300 bg-blue-25 hover:bg-blue-50'
                        }`}
                        onClick={() => loadReport(report)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {report.title}
                              {!isRead && (
                                <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                                  NEW
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {report.filename}
                            </div>
                          </div>
                          <span className="text-blue-600">{'>'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Filtered list view (single agent) - keep original layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-lg mb-4">
                  {displayedReports[0]?.agentName}'s Reports ({displayedReports.length})
                </h2>
                <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {displayedReports.map(report => {
                    const isRead = readReports.has(`${report.agentId}/${report.filename}`);
                    return (
                      <div
                        key={`${report.agentId}/${report.filename}`}
                        className={`p-3 rounded cursor-pointer border ${
                          selectedReport?.filename === report.filename
                            ? 'border-blue-500 bg-blue-50'
                            : isRead
                            ? 'border-gray-200 hover:bg-gray-50'
                            : 'border-blue-300 bg-blue-25'
                        }`}
                        onClick={() => loadReport(report)}
                      >
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {report.title}
                          {!isRead && (
                            <span className="px-1 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {report.filename}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

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
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100"><p className="text-xl">Loading...</p></div>}>
      <ReportsContent />
    </Suspense>
  );
}
