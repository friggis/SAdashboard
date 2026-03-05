// Research reports data - list of available research reports
export interface ResearchReport {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  wordCount: number;
  status: 'published' | 'draft' | 'archived';
  author: string;
}

export const researchReports: ResearchReport[] = [
  {
    id: 'uk-ai-grants-2025',
    title: 'UK Government AI Grants for Small Companies: Comprehensive Research Report',
    slug: 'uk-ai-grants-2025',
    description: 'Deep research into UK government grants specifically designed to help small companies use and implement AI in their business. Covers Innovate UK grants, regional growth hubs, LEPs, and sector-specific AI funding.',
    date: '2025-03-05',
    category: 'Funding & Grants',
    tags: ['AI', 'grants', 'UK government', 'SMEs', 'funding', 'Innovate UK'],
    wordCount: 6500,
    status: 'published',
    author: 'Grant (Research Agent)'
  }
];

export function getResearchReportBySlug(slug: string): ResearchReport | undefined {
  return researchReports.find(report => report.slug === slug);
}

export function getAllResearchReports(): ResearchReport[] {
  return researchReports.filter(report => report.status === 'published').sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
