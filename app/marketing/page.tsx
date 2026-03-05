'use client';

import Link from 'next/link';
import { useState } from 'react';

const timelinePhases = [
  {
    name: 'Pre-Launch (Days -30 to 0)',
    color: 'bg-blue-500',
    items: [
      'Finalize app store assets (icons, screenshots, descriptions)',
      'Launch landing page with email capture',
      'Build hype on social media (teasers, behind-the-scenes)',
      'Onboard 5-10 beta testers from bowling alley partners',
      'Press release to bowling industry publications',
      'Setup analytics and attribution tracking',
    ],
  },
  {
    name: 'Launch Week (Days 1-7)',
    color: 'bg-green-500',
    items: [
      'Coordinate soft launch in 2-3 target markets',
      'Push notifications to beta testers for reviews',
      'Launch day social media blitz with influencers',
      'Run limited-time promotional pricing',
      'Monitor reviews and respond within 24 hours',
      'Track initial install and activation metrics',
    ],
  },
  {
    name: 'Post-Launch Growth (Days 8-90)',
    color: 'bg-purple-500',
    items: [
      'Weekly content calendar: tips, user spotlights, bowling news',
      'App Store Optimization (ASO) iteration based on keyword performance',
      'Partnerships with bowling centers for co-promotion',
      'Referral program with premium rewards',
      'Light paid social test ($20/day) to lookalike audiences',
      'Community building: Discord/forum for power users',
      'Monthly feature updates to maintain engagement',
    ],
  },
];

const channels = [
  {
    name: 'Organic Social',
    icon: '📱',
    tactics: [
      'TikTok/Reels: trick shots, alley tours, user testimonials',
      'Twitter/X: daily bowling tips, engagement threads',
      'Facebook Groups: join bowling communities (no spam)',
      'YouTube: long-form tutorials and pro interviews',
    ],
    budget: '$0',
  },
  {
    name: 'App Store Optimization',
    icon: '🔍',
    tactics: [
      'Keyword research: focus on "bowling score tracker", "league organizer"',
      'Compelling subtitle with value proposition',
      'A/B test icons and screenshots for conversion',
      'Encourage 5-star reviews with in-app prompts at right moments',
      'Localize descriptions for key markets',
    ],
    budget: '$0',
  },
  {
    name: 'Community & Partnerships',
    icon: '🤝',
    tactics: [
      'Partner with 10-20 bowling centers for QR code promotions',
      'Sponsor local league nights with app demos',
      ' Collaborate with bowling YouTubers and influencers',
      'Create ambassador program for passionate users',
    ],
    budget: '$200-500/month (sponsorships, swag)',
  },
  {
    name: 'Lightweight Paid',
    icon: '💸',
    tactics: [
      'Meta/Instagram ads: target bowlers 25-65, interests: bowling, sports leagues',
      'Google UAC: install campaigns with CPI bidding',
      'Retargeting: website visitors and abandoned installs',
      'Budget: $20-50/day scaled based on ROAS',
    ],
    budget: '$500-800/month (scalable)',
  },
];

const kpis = [
  { name: 'Installs', target: '1,000 in first 30 days', benchmark: 'Industry avg: 2-5% conversion from impressions' },
  { name: 'Activation', target: '60% complete onboarding', benchmark: 'Best-in-class: >70%' },
  { name: 'Retention', target: 'Day 7: 25%, Day 30: 12%', benchmark: 'Top 25% apps: D30 > 20%' },
  { name: 'Referrals', target: '10% of users refer at least one friend', benchmark: 'Viral coefficient > 0' },
  { name: 'LTV', target: '$15平均 lifetime value', benchmark: 'CPI recovery in < 90 days' },
];

const creativeIdeas = [
  {
    title: 'Strike Sponsorship',
    desc: 'Users can sponsor a virtual strike for a friend; app donates $1 to youth bowling charity when redeemed.',
  },
  {
    title: 'Alley Leaderboards',
    desc: 'Partner with bowling centers to display top app users on in-alley screens, driving FOMO and organic adoption.',
  },
  {
    title: 'Bowling Trivia Challenges',
    desc: 'Weekly quiz in-app with prizes; share results socially to invite friends.',
  },
  {
    title: 'Score Predictor Game',
    desc: 'Users predict their own scores; hitting goals unlocks premium features. Share predictions to social for bonus lives.',
  },
  {
    title: 'User-Generated Content Contests',
    desc: 'Best bowling alley photo or trick shot video wins free merch; content used in ads.',
  },
];

const valueProps = [
  'Automatic score tracking and stat analysis (no paper scorecards)',
  'League management: create seasons, divisions, schedule matches',
  'Social sharing: post your strikes and achievements instantly',
  'Cross-platform sync: use on phone at alley, review on desktop later',
  'Offline-first: works without connectivity, syncs when back online',
  'Free tier: basic tracking for casual bowlers; premium for leagues & organizations',
];

export default function MarketingPage() {
  const [darkMode, setDarkMode] = useState(false);

  const pageBg = darkMode ? 'bg-slate-950' : 'bg-gray-100';
  const cardBg = darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white';
  const titleText = darkMode ? 'text-slate-100' : 'text-gray-900';
  const bodyText = darkMode ? 'text-slate-300' : 'text-gray-700';
  const mutedText = darkMode ? 'text-slate-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen p-6 ${pageBg}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className={`rounded-xl shadow p-6 ${cardBg}`}>
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${titleText}`}>Marketing Plan</h1>
              <p className={`text-lg ${mutedText} mt-1`}>
                Kaizen Bowling App — Go-to-Market Strategy
              </p>
              <p className={`text-sm ${mutedText} mt-2`}>
                A comprehensive 90-day plan to acquire, activate, and retain bowling enthusiasts.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDarkMode(v => !v)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 font-medium"
              >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className={`rounded-xl shadow p-6 ${cardBg}`}>
          <h2 className={`text-xl font-semibold mb-4 ${titleText}`}>Executive Summary</h2>
          <p className={`${bodyText} mb-4`}>
            Kaizen Bowling App is a mobile-first solution for casual bowlers, league organizers, and bowling centers.
            Our go-to-market strategy focuses on <strong>organic community building</strong>, <strong>app store optimization</strong>,
            and <strong>strategic partnerships</strong> to achieve sustainable growth with a lean budget.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-blue-50'}`}>
              <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>$750/mo</div>
              <div className={`text-sm ${mutedText}`}>Average Monthly Budget</div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-green-50'}`}>
              <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>1,000+</div>
              <div className={`text-sm ${mutedText}`}>Installs in First 30 Days</div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-purple-50'}`}>
              <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>90 days</div>
              <div className={`text-sm ${mutedText}`}>From Launch to Scale</div>
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className={`rounded-xl shadow p-6 ${cardBg}`}>
          <h2 className={`text-xl font-semibold mb-4 ${titleText}`}>🎯 Target Audience</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>Casual Bowlers</h3>
              <p className={`text-sm ${bodyText}`}>Recreational players (1-2x/month) who want to track scores, set personal bests, and share achievements on social media.</p>
            </div>
            <div className={`p-4 rounded-lg border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>League Participants</h3>
              <p className={`text-sm ${bodyText}`}>League bowlers and team captains needing league management, scheduling, and statistical analysis tools.</p>
            </div>
            <div className={`p-4 rounded-lg border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>Organizations & Centers</h3>
              <p className={`text-sm ${bodyText}`}>Bowling centers and tournament organizers requiring tournament management, scoreboard integration, and bulk user management.</p>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className={`rounded-xl shadow p-6 ${cardBg}`}>
          <h2 className={`text-xl font-semibold mb-4 ${titleText}`}>💎 Value Proposition</h2>
          <p className={`${bodyText} mb-4`}>
            Kaizen Bowling App eliminates paper scorecards, manual stat calculations, and fragmented league communication.
            It is the <strong>only</strong> all-in-one platform that works offline, syncs seamlessly, and scales from casual play to professional tournaments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {valueProps.map((vp, idx) => (
              <div key={idx} className={`flex items-start gap-2 p-3 rounded ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <span className="text-lg">✓</span>
                <span className={`text-sm ${bodyText}`}>{vp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Channels */}
        <div className={`rounded-xl shadow p-6 ${cardBg}`}>
          <h2 className={`text-xl font-semibold mb-4 ${titleText}`}>📢 Marketing Channels</h2>
          <div className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.name} className={`rounded-lg p-4 ${darkMode ? 'border border-slate-700 bg-slate-800' : 'border border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{channel.icon}</span>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${titleText}`}>{channel.name}</h3>
                  </div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    Budget: {channel.budget}
                  </div>
                </div>
                <ul className={`space-y-1 pl-9 ${bodyText} text-sm`}>
                  {channel.tactics.map((tactic, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{tactic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Creative Ideas */}
        <div className={`rounded-xl shadow p-6 ${cardBg}`}>
          <h2 className={`text-xl font-semibold mb-4 ${titleText}`}>✨ Creative & Viral Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creativeIdeas.map((idea, idx) => (
              <div key={idx} className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100'}`}>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>{idea.title}</h3>
                <p className={`text-sm ${bodyText}`}>{idea.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 90-Day Timeline */}
        <div className={`rounded-xl shadow p-6 ${cardBg}`}>
          <h2 className={`text-xl font-semibold mb-4 ${titleText}`}>📅 90-Day Launch Timeline</h2>
          <div className="space-y-6">
            {timelinePhases.map((phase) => (
              <div key={phase.name} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-4 h-4 rounded-full ${phase.color}`}></div>
                  <h3 className={`font-semibold ${titleText}`}>{phase.name}</h3>
                </div>
                <ul className={`space-y-2 pl-7 ${bodyText} text-sm`}>
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* KPIs & Metrics */}
        <div className={`rounded-xl shadow p-6 ${cardBg}`}>
          <h2 className={`text-xl font-semibold mb-4 ${titleText}`}>📊 Key Performance Indicators</h2>
          <div className="overflow-x-auto">
            <table className={`w-full text-sm ${bodyText}`}>
              <thead className={`${darkMode ? 'bg-slate-800' : 'bg-gray-50'} border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <tr>
                  <th className="text-left p-3 font-semibold">Metric</th>
                  <th className="text-left p-3 font-semibold">Target</th>
                  <th className="text-left p-3 font-semibold">Industry Benchmark</th>
                </tr>
              </thead>
              <tbody>
                {kpis.map((kpi, idx) => (
                  <tr key={idx} className={`${darkMode ? 'border-b border-slate-800' : 'border-b border-gray-100'}`}>
                    <td className="p-3 font-medium">{kpi.name}</td>
                    <td className="p-3 text-green-600 dark:text-green-400">{kpi.target}</td>
                    <td className="p-3 text-gray-500">{kpi.benchmark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Breakdown */}
        <div className={`rounded-xl shadow p-6 ${cardBg}`}>
          <h2 className={`text-xl font-semibold mb-4 ${titleText}`}>💰 Budget Allocation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-green-50'}`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Monthly Burn</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={mutedText}>Partnerships & Sponsorships</span>
                  <span className="font-medium">$200-500</span>
                </div>
                <div className="flex justify-between">
                  <span className={mutedText}>Paid Social Media</span>
                  <span className="font-medium">$500-800</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className={`font-semibold ${titleText}`}>Total</span>
                  <span className={`font-bold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>$700-1,300</span>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-blue-50'}`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>One-Time Launch Costs</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={mutedText}>App Store Assets (design, video)</span>
                  <span className="font-medium">$0-200</span>
                </div>
                <div className="flex justify-between">
                  <span className={mutedText}>Landing Page Setup</span>
                  <span className="font-medium">$0</span>
                </div>
                <div className="flex justify-between">
                  <span className={mutedText}>Press Release Distribution</span>
                  <span className="font-medium">$0-100</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className={`font-semibold ${titleText}`}>Total</span>
                  <span className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>$0-300</span>
                </div>
              </div>
            </div>
          </div>
          <p className={`text-xs ${mutedText} mt-4`}>
            * Budget is designed to be lean and scalable. Start at the lower end and increase spend on channels demonstrating positive ROI within 30 days.
          </p>
        </div>

        {/* Footer CTA */}
        <div className={`rounded-xl shadow p-8 text-center ${cardBg}`}>
          <h2 className={`text-2xl font-bold ${titleText} mb-4`}>Ready to Launch?</h2>
          <p className={`${mutedText} mb-6 max-w-xl mx-auto`}>
            This plan provides a clear roadmap to acquire and engage our target audience. Execution should be iterative, with weekly reviews of KPIs to optimize spend and tactics.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
