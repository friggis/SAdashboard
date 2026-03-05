import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

// Prefer runtime-written reports, fallback to bundled public reports for Vercel
const REPORTS_BASES = [
  join(process.cwd(), '..', 'memory', 'agents'),
  join(process.cwd(), 'public', 'reports'),
];

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
  for (const base of REPORTS_BASES) {
    try {
      const reports = await listReports(base);
      return NextResponse.json(reports);
    } catch {
      // Try next base path
    }
  }

  // Never hard-fail the UI for missing report storage
  return NextResponse.json([]);
}

// POST /api/reports - get specific report content (alternative to static fetch)
export async function POST(request: NextRequest) {
  try {
    const { agentId, filename } = await request.json();

    if (!agentId || !filename) {
      return NextResponse.json({ error: 'agentId and filename required' }, { status: 400 });
    }

    for (const base of REPORTS_BASES) {
      try {
        const filePath = join(base, agentId, filename);
        const content = await readFile(filePath, 'utf-8');

        return NextResponse.json({ agentId, filename, content }, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Content-Type': 'application/json',
          },
        });
      } catch {
        // try next base path
      }
    }

    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  } catch (error) {
    console.error('Error reading report:', error);
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }
}
