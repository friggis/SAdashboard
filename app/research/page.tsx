import React from 'react';
import { getAllResearchReports } from '@/lib/research-reports';
import Link from 'next/link';

export default function ResearchPage() {
  const reports = getAllResearchReports();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Research Reports
          </h1>
          <p className="text-gray-600">
            Comprehensive research on funding opportunities, growth strategies, and market insights for AI businesses.
          </p>
        </div>

        {/* Reports Grid */}
        <div className="space-y-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {report.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Intl.DateTimeFormat('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(new Date(report.date))}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {report.title}
                  </h2>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {report.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Author: {report.author}</span>
                    <span>•</span>
                    <span>{report.wordCount.toLocaleString()} words</span>
                    <span>•</span>
                    <span className="capitalize">{report.status}</span>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 md:ml-6">
                  <Link
                    href={`/research/${report.slug}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {reports.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Reports Available
            </h3>
            <p className="text-gray-600">
              Check back soon for new research reports.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            Need a Custom Research Report?
          </h3>
          <p className="text-blue-800 mb-4">
            Our research agent can investigate any topic related to AI business opportunities,
            funding, or market analysis. Request a custom report through your dashboard.
          </p>
          <Link
            href="/reports"
            className="inline-flex px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
