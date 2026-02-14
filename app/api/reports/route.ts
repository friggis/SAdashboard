import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

// Base directory for reports within the app (public/reports)
const REPORTS_BASE = join(process.cwd(), 'public', 'reports');

// Helper to recursively scan reports directory
async function listReports(dir: string, agentPrefix = ''): Promise<any[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const reports = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      const subAgent = agentPrefix ? `${agentPrefix}/${entry.name}` : entry.name;
      reports.push(...await listReports(fullPath, subAgent));
    } else if (entry.name.endsWith('.md')) {
      const agentId = agentPrefix;
      const filename = entry.name;
      const title = filename.replace(/\.md$/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const agentName = agentId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      reports.push({
        agentId,
        agentName,
        filename,
        title,
        path: fullPath,
        url: `/reports/${agentId}/${filename}`,
      });
    }
  }

  return reports.sort((a, b) => b.filename.localeCompare(a.filename));
}

// GET /api/reports - list all reports
export async function GET() {
  try {
    const reports = await listReports(REPORTS_BASE);
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error listing reports:', error);
    return NextResponse.json({ error: 'Failed to list reports' }, { status: 500 });
  }
}

// POST /api/reports - get specific report content (alternative to static fetch)
export async function POST(request: NextRequest) {
  try {
    const { agentId, filename } = await request.json();

    if (!agentId || !filename) {
      return NextResponse.json({ error: 'agentId and filename required' }, { status: 400 });
    }

    const filePath = join(REPORTS_BASE, agentId, filename);
    const content = await readFile(filePath, 'utf-8');

    return NextResponse.json({ agentId, filename, content }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error reading report:', error);
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }
}
