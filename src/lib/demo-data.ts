import {
  Channel,
  DailyDataPoint,
  VideoItem,
  ShortItem,
  CompetitorChannel,
  KeywordInsight,
  VideoIdea,
  CalendarEvent,
  Goal,
  AuditHealthMetric,
  CommentSentimentItem,
  NotificationItem,
  UserProfile,
} from '@/types';

export const DEMO_CHANNELS: Channel[] = [
  {
    id: 'ch-techpulse',
    name: 'TechPulse Studio',
    handle: '@TechPulseStudio',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    subscribers: 248500,
    totalViews: 38420000,
    totalVideos: 184,
    joinedDate: '2022-04-12',
    category: 'Science & Technology',
    verified: true,
    status: 'active',
  },
  {
    id: 'ch-codecraft',
    name: 'CodeCraft Daily',
    handle: '@CodeCraftDaily',
    avatar: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80',
    subscribers: 86400,
    totalViews: 9240000,
    totalVideos: 92,
    joinedDate: '2023-01-18',
    category: 'Education & Tech',
    verified: false,
    status: 'active',
  },
  {
    id: 'ch-creatorlab',
    name: 'Creator Lab Shorts',
    handle: '@CreatorLabShorts',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subscribers: 412000,
    totalViews: 114900000,
    totalVideos: 320,
    joinedDate: '2023-06-05',
    category: 'Entertainment',
    verified: true,
    status: 'active',
  },
];

export const CURRENT_USER: UserProfile = {
  id: 'usr-8821',
  name: 'Alex Rivera',
  email: 'alex@creatorsuite.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  plan: 'Pro',
  channelsCount: 3,
  joinedDate: 'November 2023',
  role: 'creator',
};

// Pure deterministic pseudo-random generator
// Guarantees 100% identical outputs on Server (SSR) and Client (Hydration)
function pseudoRandom(index: number, seed: number = 1): number {
  const x = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Generate realistic daily trend data for a specified number of days
export function generateDailyData(daysCount: number = 90): DailyDataPoint[] {
  const points: DailyDataPoint[] = [];

  // Fixed UTC anchor date to avoid timezone or time-of-day discrepancy between SSR and client
  const anchorTime = Date.parse('2026-11-02T00:00:00Z');

  for (let i = daysCount - 1; i >= 0; i--) {
    const dayMs = anchorTime - i * 86400000;
    const d = new Date(dayMs);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    // Wave pattern with weekends higher
    const dayOfWeek = d.getUTCDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const factor = isWeekend ? 1.35 : 1.0;

    const rand1 = pseudoRandom(i, 1);
    const rand2 = pseudoRandom(i, 2);
    const rand3 = pseudoRandom(i, 3);
    const rand4 = pseudoRandom(i, 4);

    const gained = Math.round((120 + Math.sin(i * 0.4) * 40 + rand1 * 30) * factor);
    const lost = Math.round(18 + rand2 * 8);
    const net = gained - lost;

    const views = Math.round((16500 + Math.sin(i * 0.5) * 4500 + rand3 * 3000) * factor);
    const watchHours = Math.round((views * (4.2 + rand4 * 0.8)) / 60);
    const impressions = Math.round(views * (12.5 + rand2 * 3.5));
    const ctr = Number(((views / impressions) * 100).toFixed(2));
    const estimatedRevenue = Number(((views / 1000) * (3.85 + Math.sin(i * 0.3) * 0.9)).toFixed(2));

    points.push({
      date: dateStr,
      subscribersGained: gained,
      subscribersLost: lost,
      netSubscribers: net,
      views,
      watchHours,
      estimatedRevenue,
      impressions,
      ctr,
    });
  }

  return points;
}

export const DEMO_DAILY_DATA = generateDailyData(90);

export function getDataForRange(range: string, fullData: DailyDataPoint[] = DEMO_DAILY_DATA): DailyDataPoint[] {
  if (range === '7d') return fullData.slice(-7);
  if (range === '28d') return fullData.slice(-28);
  if (range === '90d') return fullData.slice(-90);
  return fullData;
}

export const DEMO_VIDEOS: VideoItem[] = [
  {
    id: 'v-101',
    title: 'How I Built a $10k/Month SaaS in 14 Days (Full Architecture)',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&auto=format&fit=crop&q=80',
    publishedAt: '2026-10-24T14:00:00Z',
    duration: '18:42',
    views: 148200,
    watchTimeHours: 19800,
    likes: 8920,
    comments: 642,
    ctr: 9.4,
    avgViewDuration: '08:01',
    avgViewPercentage: 42.8,
    estimatedRevenue: 642.5,
    sentimentScore: 94,
    tags: ['SaaS', 'FullStack', 'Nextjs', 'Startups', 'Coding'],
    type: 'video',
  },
  {
    id: 'v-102',
    title: 'Stop Using React the Wrong Way in 2026! (Avoid These 7 Mistakes)',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&auto=format&fit=crop&q=80',
    publishedAt: '2026-10-18T16:30:00Z',
    duration: '14:15',
    views: 224000,
    watchTimeHours: 28400,
    likes: 14300,
    comments: 1120,
    ctr: 11.2,
    avgViewDuration: '07:36',
    avgViewPercentage: 53.4,
    estimatedRevenue: 980.2,
    sentimentScore: 91,
    tags: ['React', 'WebDev', 'JavaScript', 'CleanCode'],
    type: 'video',
  },
  {
    id: 'v-103',
    title: 'My Complete Developer Desk Setup for Maximum Deep Work',
    thumbnail: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=640&auto=format&fit=crop&q=80',
    publishedAt: '2026-10-10T12:00:00Z',
    duration: '11:20',
    views: 89400,
    watchTimeHours: 9400,
    likes: 5410,
    comments: 480,
    ctr: 7.8,
    avgViewDuration: '06:18',
    avgViewPercentage: 55.6,
    estimatedRevenue: 420.0,
    sentimentScore: 88,
    tags: ['DeskSetup', 'Productivity', 'Workspace', 'Tech'],
    type: 'video',
  },
  {
    id: 'v-104',
    title: 'The AI Revolution Nobody Is Talking About: Autonomous Coding Agents',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=640&auto=format&fit=crop&q=80',
    publishedAt: '2026-10-02T15:00:00Z',
    duration: '22:10',
    views: 312500,
    watchTimeHours: 42100,
    likes: 21400,
    comments: 1980,
    ctr: 12.8,
    avgViewDuration: '10:45',
    avgViewPercentage: 48.5,
    estimatedRevenue: 1540.8,
    sentimentScore: 96,
    tags: ['AI', 'AutonomousAgents', 'FutureOfTech', 'MachineLearning'],
    type: 'video',
  },
  {
    id: 'v-105',
    title: 'Why I Switched from VS Code to Neovim (And Did I Regret It?)',
    thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=640&auto=format&fit=crop&q=80',
    publishedAt: '2026-09-22T17:00:00Z',
    duration: '16:04',
    views: 178000,
    watchTimeHours: 21500,
    likes: 11200,
    comments: 1450,
    ctr: 8.9,
    avgViewDuration: '07:15',
    avgViewPercentage: 45.1,
    estimatedRevenue: 730.0,
    sentimentScore: 82,
    tags: ['Neovim', 'VSCode', 'DeveloperTools', 'Productivity'],
    type: 'video',
  },
  {
    id: 'v-106',
    title: 'Top 5 CSS Tricks You Won\'t Believe Are Actually Pure CSS',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=640&auto=format&fit=crop&q=80',
    publishedAt: '2026-09-12T14:30:00Z',
    duration: '09:48',
    views: 95400,
    watchTimeHours: 9200,
    likes: 7100,
    comments: 320,
    ctr: 8.1,
    avgViewDuration: '05:47',
    avgViewPercentage: 58.9,
    estimatedRevenue: 380.0,
    sentimentScore: 95,
    tags: ['CSS', 'WebDesign', 'FrontEnd', 'Animation'],
    type: 'video',
  },
];

export const DEMO_SHORTS: ShortItem[] = [
  {
    id: 's-201',
    title: 'This 1-line CSS trick will replace 50 lines of JavaScript! 🤯',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
    publishedAt: '2026-10-28T18:00:00Z',
    duration: '00:44',
    views: 480200,
    watchTimeHours: 4950,
    likes: 38200,
    comments: 940,
    ctr: 14.5,
    avgViewDuration: '00:37',
    avgViewPercentage: 84.1,
    estimatedRevenue: 124.5,
    sentimentScore: 92,
    tags: ['Shorts', 'CSS', 'WebDev'],
    type: 'short',
    swipeAwayRate: 21.4,
    viewedVsSwiped: { viewed: 78.6, swiped: 21.4 },
    soundUsedCount: 142,
    remixCount: 38,
  },
  {
    id: 's-202',
    title: 'Why every junior developer fails the technical interview 💀',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80',
    publishedAt: '2026-10-21T17:30:00Z',
    duration: '00:58',
    views: 712000,
    watchTimeHours: 8400,
    likes: 62400,
    comments: 2180,
    ctr: 16.2,
    avgViewDuration: '00:51',
    avgViewPercentage: 87.9,
    estimatedRevenue: 188.0,
    sentimentScore: 86,
    tags: ['CodingInterview', 'TechCareer', 'Shorts'],
    type: 'short',
    swipeAwayRate: 18.2,
    viewedVsSwiped: { viewed: 81.8, swiped: 18.2 },
    soundUsedCount: 320,
    remixCount: 89,
  },
  {
    id: 's-203',
    title: 'The AI browser you need to install today #shorts',
    thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&auto=format&fit=crop&q=80',
    publishedAt: '2026-10-15T15:00:00Z',
    duration: '00:36',
    views: 345000,
    watchTimeHours: 3200,
    likes: 24500,
    comments: 540,
    ctr: 12.1,
    avgViewDuration: '00:31',
    avgViewPercentage: 86.1,
    estimatedRevenue: 86.4,
    sentimentScore: 90,
    tags: ['AI', 'TechHacks', 'Productivity'],
    type: 'short',
    swipeAwayRate: 24.5,
    viewedVsSwiped: { viewed: 75.5, swiped: 24.5 },
    soundUsedCount: 95,
    remixCount: 18,
  },
];

export const DEMO_COMPETITORS: CompetitorChannel[] = [
  {
    id: 'comp-1',
    name: 'ByteCode Academy',
    handle: '@bytecodeacademy',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=120&auto=format&fit=crop&q=80',
    subscribers: 310000,
    subGrowthRate: 4.8,
    avgViewsPerVideo: 68000,
    uploadFrequency: '2 videos / week',
    engagementRate: 6.4,
    topVideo: {
      title: 'Next.js 15 Full Crash Course for 2026',
      views: 450000,
      daysAgo: 14,
    },
  },
  {
    id: 'comp-2',
    name: 'DevMatrix Official',
    handle: '@devmatrix',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    subscribers: 185000,
    subGrowthRate: 6.2,
    avgViewsPerVideo: 42000,
    uploadFrequency: '3 videos / week',
    engagementRate: 7.8,
    topVideo: {
      title: 'Building an AI Agent from Scratch with Python',
      views: 310000,
      daysAgo: 7,
    },
  },
  {
    id: 'comp-3',
    name: 'SaaS Builder Club',
    handle: '@saasbuilderclub',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    subscribers: 142000,
    subGrowthRate: 8.5,
    avgViewsPerVideo: 54000,
    uploadFrequency: '1 video / week',
    engagementRate: 9.1,
    topVideo: {
      title: 'How Solo Devs Are Making $50k MRR Without VC Funding',
      views: 290000,
      daysAgo: 21,
    },
  },
];

export const DEMO_KEYWORDS: KeywordInsight[] = [
  {
    keyword: 'nextjs tutorial 2026',
    searchVolume: 84000,
    competition: 'Medium',
    overallScore: 82,
    trend: 'rising',
    cpc: '$4.20',
    topRelatedTags: ['nextjs 15', 'react tutorial', 'typescript nextjs', 'web development'],
  },
  {
    keyword: 'ai agent full stack tutorial',
    searchVolume: 122000,
    competition: 'Low',
    overallScore: 94,
    trend: 'rising',
    cpc: '$5.80',
    topRelatedTags: ['autonomous agents', 'langchain', 'ai coding', 'python ai'],
  },
  {
    keyword: 'how to build a saas product',
    searchVolume: 95000,
    competition: 'High',
    overallScore: 68,
    trend: 'stable',
    cpc: '$8.40',
    topRelatedTags: ['saas business', 'micro saas', 'indie hacker', 'saas pricing'],
  },
  {
    keyword: 'tailwind css modern dashboard',
    searchVolume: 42000,
    competition: 'Low',
    overallScore: 88,
    trend: 'rising',
    cpc: '$2.90',
    topRelatedTags: ['tailwind components', 'shadcn ui', 'react dashboard', 'ui design'],
  },
  {
    keyword: 'neovim setup for web development',
    searchVolume: 36000,
    competition: 'Medium',
    overallScore: 74,
    trend: 'stable',
    cpc: '$1.45',
    topRelatedTags: ['neovim lua', 'lazy nvim', 'ide vs neovim', 'terminal productivity'],
  },
];

export const DEMO_IDEAS: VideoIdea[] = [
  {
    id: 'idea-1',
    title: 'I Tested 10 AI Coding Agents so You Don\'t Have To',
    category: 'AI & Automation',
    targetKeywords: ['ai agents', 'cursor vs copilot', 'autonomous coding'],
    predictedPotential: 'Very High',
    status: 'scripting',
    notes: 'Focus on benchmarks: speed, bug-fixing, refactoring, code quality.',
    tags: ['AI', 'Productivity', 'Comparison'],
    createdAt: '2026-10-25',
    targetDate: '2026-11-06',
    favorite: true,
  },
  {
    id: 'idea-2',
    title: 'The Database Decision That Saves Startups $20,000/Year',
    category: 'Cloud & Database',
    targetKeywords: ['supabase vs postgres', 'database pricing', 'scalable architecture'],
    predictedPotential: 'High',
    status: 'idea',
    notes: 'Compare Supabase, Neon, PlanetScale, and Cloud SQL with real billing scenarios.',
    tags: ['Database', 'Architecture', 'CostOptimization'],
    createdAt: '2026-10-27',
    targetDate: '2026-11-12',
    favorite: false,
  },
  {
    id: 'idea-3',
    title: 'Clean Architecture in Next.js 15: From Junior to Principal Dev',
    category: 'Engineering & Code',
    targetKeywords: ['clean architecture', 'nextjs folder structure', 'enterprise typescript'],
    predictedPotential: 'Very High',
    status: 'recording',
    notes: 'Record screen showing domain driven design with server actions and repository pattern.',
    tags: ['TypeScript', 'Architecture', 'Nextjs'],
    createdAt: '2026-10-15',
    targetDate: '2026-11-04',
    favorite: true,
  },
  {
    id: 'idea-4',
    title: 'Day in the Life of a Solopreneur in 2026 (Reality Check)',
    category: 'Lifestyle & Career',
    targetKeywords: ['solopreneur day in life', 'remote tech worker', 'indie developer'],
    predictedPotential: 'Medium',
    status: 'editing',
    notes: 'B-roll footage already captured in home studio. Need background lofi track.',
    tags: ['Vlog', 'Solopreneur', 'Productivity'],
    createdAt: '2026-10-10',
    targetDate: '2026-11-03',
    favorite: false,
  },
  {
    id: 'idea-5',
    title: 'Top 7 Micro-SaaS Business Ideas for Solo Developers in 2027',
    category: 'Business & SaaS',
    targetKeywords: ['micro saas ideas', 'b2b software opportunities', 'indie hacking'],
    predictedPotential: 'Very High',
    status: 'idea',
    notes: 'Analyze niches with high ARPU and low churn (regulatory compliance, developer tooling).',
    tags: ['SaaS', 'Business', 'Ideas'],
    createdAt: '2026-10-29',
    targetDate: '2026-11-20',
    favorite: true,
  },
];

export const DEMO_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Upload: Clean Architecture in Next.js 15',
    date: '2026-11-04',
    type: 'upload',
    status: 'scheduled',
    timeSlot: '14:00 EST',
  },
  {
    id: 'ev-2',
    title: 'Short: Top 3 CSS Grid Hacks',
    date: '2026-11-05',
    type: 'short',
    status: 'scheduled',
    timeSlot: '17:30 EST',
  },
  {
    id: 'ev-3',
    title: 'Live Q&A: SaaS Pricing & Monetization Clinic',
    date: '2026-11-08',
    type: 'livestream',
    status: 'planned',
    timeSlot: '19:00 EST',
  },
  {
    id: 'ev-4',
    title: 'Upload: I Tested 10 AI Coding Agents',
    date: '2026-11-11',
    type: 'upload',
    status: 'planned',
    timeSlot: '14:00 EST',
  },
  {
    id: 'ev-5',
    title: 'Community Poll: What database do you use for SaaS?',
    date: '2026-11-06',
    type: 'community',
    status: 'draft',
    timeSlot: '10:00 EST',
  },
];

export const DEMO_GOALS: Goal[] = [
  {
    id: 'g-1',
    title: 'Reach 250,000 Subscribers',
    targetMetric: 'subscribers',
    currentValue: 248500,
    targetValue: 250000,
    deadline: '2026-11-15',
    unit: 'subs',
    completed: false,
  },
  {
    id: 'g-2',
    title: 'Monthly Estimated Revenue: $5,000',
    targetMetric: 'revenue',
    currentValue: 4320,
    targetValue: 5000,
    deadline: '2026-11-30',
    unit: '$',
    completed: false,
  },
  {
    id: 'g-3',
    title: 'Publish 8 High Quality Long-Form Videos',
    targetMetric: 'uploads',
    currentValue: 6,
    targetValue: 8,
    deadline: '2026-11-30',
    unit: 'videos',
    completed: false,
  },
  {
    id: 'g-4',
    title: 'Achieve 100,000 Watch Hours this Quarter',
    targetMetric: 'watch_hours',
    currentValue: 100000,
    targetValue: 100000,
    deadline: '2026-10-31',
    unit: 'hrs',
    completed: true,
  },
];

export const DEMO_AUDIT_METRICS: AuditHealthMetric[] = [
  {
    name: 'Click-Through Rate (CTR)',
    score: 88,
    status: 'good',
    impact: 'High',
    description: 'Average CTR is 9.8%, which is 42% higher than the platform average in your niche.',
    actionItem: 'Continue using high-contrast bold titles and face thumbnails with expressive lighting.',
  },
  {
    name: 'Audience Retention (First 30s)',
    score: 74,
    status: 'warning',
    impact: 'High',
    description: 'Hook retention drops by 26% within the first 30 seconds across long-form tutorials.',
    actionItem: 'Remove channel intros and start immediately with the promised takeaway in the first 5 seconds.',
  },
  {
    name: 'Upload Consistency',
    score: 95,
    status: 'good',
    impact: 'Medium',
    description: 'Consistent 2 videos per week posted every Tuesday and Friday for 16 consecutive weeks.',
    actionItem: 'Maintain current schedule; viewer return rate peaks during weekday evenings.',
  },
  {
    name: 'SEO & Metadata Optimization',
    score: 90,
    status: 'good',
    impact: 'High',
    description: 'Descriptions contain timestamps, primary keywords in the first 2 lines, and relevant links.',
    actionItem: 'Add 2-3 more chapter markers to long videos (>15 mins) for Google Search key moments.',
  },
  {
    name: 'End-Screen & Card Click Rate',
    score: 58,
    status: 'critical',
    impact: 'Medium',
    description: 'Only 1.8% of viewers click through your suggested next video at end screens.',
    actionItem: 'Use verbal bridge hooks ("Watch this video next to master the backend") instead of generic goodbye slides.',
  },
  {
    name: 'Shorts to Long-form Conversion',
    score: 65,
    status: 'warning',
    impact: 'Medium',
    description: 'Shorts drive great reach but only 3.2% of viewers check your long-form videos.',
    actionItem: 'Pin a comment on all viral Shorts linking directly to the full deep dive with a timestamp teaser.',
  },
];

export const DEMO_COMMENTS: CommentSentimentItem[] = [
  {
    id: 'c-1',
    author: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
    comment: 'This is without question the cleanest breakdown of SaaS architecture on YouTube. Deployed my first MVP today using your template!',
    videoTitle: 'How I Built a $10k/Month SaaS in 14 Days (Full Architecture)',
    publishedAt: '2 hours ago',
    sentiment: 'positive',
    sentimentScore: 98,
    likes: 84,
    hasReply: true,
    isQuestion: false,
  },
  {
    id: 'c-2',
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
    comment: 'What is your opinion on using Cloudflare Workers vs Next.js Server Actions for heavy API proxying?',
    videoTitle: 'Stop Using React the Wrong Way in 2026! (Avoid These 7 Mistakes)',
    publishedAt: '5 hours ago',
    sentiment: 'neutral',
    sentimentScore: 50,
    likes: 19,
    hasReply: false,
    isQuestion: true,
  },
  {
    id: 'c-3',
    author: 'DevDave_99',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80',
    comment: 'The audio volume in the middle segment was slightly low compared to the intro, but the content itself was pure gold.',
    videoTitle: 'The AI Revolution Nobody Is Talking About: Autonomous Coding Agents',
    publishedAt: '1 day ago',
    sentiment: 'neutral',
    sentimentScore: 65,
    likes: 31,
    hasReply: true,
    isQuestion: false,
  },
  {
    id: 'c-4',
    author: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=80',
    comment: 'I really struggled with the GitHub repo setup on Windows PowerShell because of path escaping. Could you provide a windows-specific snippet?',
    videoTitle: 'Stop Using React the Wrong Way in 2026! (Avoid These 7 Mistakes)',
    publishedAt: '1 day ago',
    sentiment: 'negative',
    sentimentScore: 32,
    likes: 12,
    hasReply: false,
    isQuestion: true,
  },
  {
    id: 'c-5',
    author: 'Kai Tanaka',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=80',
    comment: 'Your channel has helped me land my first junior full stack job! Cannot thank you enough for the quality you put out for free.',
    videoTitle: 'Top 5 CSS Tricks You Won\'t Believe Are Actually Pure CSS',
    publishedAt: '2 days ago',
    sentiment: 'positive',
    sentimentScore: 100,
    likes: 142,
    hasReply: true,
    isQuestion: false,
  },
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Subscriber Milestone!',
    description: 'You crossed 248,000 subscribers! You are now just 1,500 away from your 250k goal.',
    timeAgo: '15 mins ago',
    type: 'milestone',
    read: false,
    link: '/subscribers',
  },
  {
    id: 'notif-2',
    title: 'Viral Spike Detected 🚀',
    description: '"The AI Revolution..." is experiencing a 310% traffic surge from YouTube Suggested Videos.',
    timeAgo: '2 hours ago',
    type: 'alert',
    read: false,
    link: '/videos',
  },
  {
    id: 'notif-3',
    title: 'Weekly Performance Report Ready',
    description: 'Your channel gained 3,240 subscribers and earned an estimated $984.50 this week.',
    timeAgo: '1 day ago',
    type: 'system',
    read: true,
    link: '/reports',
  },
  {
    id: 'notif-4',
    title: 'High Potential Keyword Alert',
    description: 'Keyword "ai agent full stack tutorial" search volume jumped +48% with Low competition.',
    timeAgo: '2 days ago',
    type: 'tip',
    read: true,
    link: '/seo',
  },
];

export const AUDIENCE_DEMOGRAPHICS = {
  gender: [
    { name: 'Male', value: 81.4, color: '#3b82f6' },
    { name: 'Female', value: 16.8, color: '#ec4899' },
    { name: 'User-specified', value: 1.8, color: '#10b981' },
  ],
  age: [
    { range: '13-17', percentage: 4.2 },
    { range: '18-24', percentage: 34.8 },
    { range: '25-34', percentage: 42.1 },
    { range: '35-44', percentage: 12.6 },
    { range: '45-54', percentage: 4.5 },
    { range: '55+', percentage: 1.8 },
  ],
  geography: [
    { country: 'United States', code: 'US', percentage: 38.4, views: 184200 },
    { country: 'India', code: 'IN', percentage: 16.2, views: 77800 },
    { country: 'United Kingdom', code: 'GB', percentage: 8.9, views: 42700 },
    { country: 'Germany', code: 'DE', percentage: 6.4, views: 30700 },
    { country: 'Canada', code: 'CA', percentage: 5.8, views: 27800 },
    { country: 'Other (120+ countries)', code: 'OTHER', percentage: 24.3, views: 116600 },
  ],
  devices: [
    { device: 'Desktop / Laptop', percentage: 56.4, icon: 'Monitor' },
    { device: 'Mobile Phone', percentage: 36.8, icon: 'Smartphone' },
    { device: 'Tablet', percentage: 4.6, icon: 'Tablet' },
    { device: 'TV / Console', percentage: 2.2, icon: 'Tv' },
  ],
  trafficSources: [
    { source: 'YouTube Search', percentage: 41.2, color: '#3b82f6' },
    { source: 'Suggested Videos', percentage: 32.5, color: '#8b5cf6' },
    { source: 'Browse Features', percentage: 14.8, color: '#ec4899' },
    { source: 'External & Social', percentage: 6.7, color: '#10b981' },
    { source: 'Direct or Unknown', percentage: 4.8, color: '#f59e0b' },
  ],
};
