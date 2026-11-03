export type DateRange = '7d' | '28d' | '90d' | '365d' | 'all';

export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  subscribers: number;
  totalViews: number;
  totalVideos: number;
  joinedDate: string;
  category: string;
  verified: boolean;
  status: 'active' | 'syncing' | 'needs_reauth';
}

export interface MetricCard {
  label: string;
  value: string | number;
  change: number; // percentage e.g. +14.2
  trend: 'up' | 'down' | 'neutral';
  timeframe: string;
  subtitle?: string;
}

export interface DailyDataPoint {
  date: string;
  subscribersGained: number;
  subscribersLost: number;
  netSubscribers: number;
  views: number;
  watchHours: number;
  estimatedRevenue: number;
  impressions: number;
  ctr: number; // percentage
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  views: number;
  watchTimeHours: number;
  likes: number;
  comments: number;
  ctr: number; // Click-through rate %
  avgViewDuration: string;
  avgViewPercentage: number;
  estimatedRevenue: number;
  sentimentScore: number; // 0 - 100
  tags: string[];
  type: 'video' | 'short';
}

export interface ShortItem extends VideoItem {
  type: 'short';
  swipeAwayRate: number; // % who swiped away
  viewedVsSwiped: { viewed: number; swiped: number };
  soundUsedCount: number;
  remixCount: number;
}

export interface CompetitorChannel {
  id: string;
  name: string;
  avatar: string;
  handle: string;
  subscribers: number;
  subGrowthRate: number; // % monthly
  avgViewsPerVideo: number;
  uploadFrequency: string; // e.g. "3 videos / week"
  engagementRate: number;
  topVideo: {
    title: string;
    views: number;
    daysAgo: number;
  };
}

export interface KeywordInsight {
  keyword: string;
  searchVolume: number; // Monthly search volume
  competition: 'Low' | 'Medium' | 'High' | 'Very High';
  overallScore: number; // 1-100
  trend: 'rising' | 'stable' | 'declining';
  cpc: string;
  topRelatedTags: string[];
}

export interface VideoIdea {
  id: string;
  title: string;
  category: string;
  targetKeywords: string[];
  predictedPotential: 'High' | 'Very High' | 'Medium';
  status: 'idea' | 'scripting' | 'recording' | 'editing' | 'scheduled' | 'published';
  notes?: string;
  tags: string[];
  createdAt: string;
  targetDate?: string;
  favorite?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'upload' | 'livestream' | 'short' | 'community';
  status: 'planned' | 'draft' | 'scheduled' | 'published';
  thumbnailUrl?: string;
  timeSlot?: string;
}

export interface Goal {
  id: string;
  title: string;
  targetMetric: 'subscribers' | 'views' | 'revenue' | 'watch_hours' | 'uploads';
  currentValue: number;
  targetValue: number;
  deadline: string;
  unit: string;
  completed: boolean;
}

export interface AuditHealthMetric {
  name: string;
  score: number; // 0-100
  status: 'good' | 'warning' | 'critical';
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  actionItem: string;
}

export interface CommentSentimentItem {
  id: string;
  author: string;
  avatar: string;
  comment: string;
  videoTitle: string;
  publishedAt: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  likes: number;
  hasReply: boolean;
  isQuestion: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  type: 'milestone' | 'alert' | 'tip' | 'system';
  read: boolean;
  link?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'Free' | 'Pro' | 'Creator';
  channelsCount: number;
  joinedDate: string;
  role: 'creator' | 'admin';
}

