import { VideoItem } from '@/types';

export interface OutlierRating {
  videoId: string;
  velocityPerDay: number;
  multiplier: number;
  tier: '10x' | '5x' | '2x' | 'normal';
  label: string;
  badgeColor: string;
}

export interface OneOfTenAudit {
  latestVideo: VideoItem;
  rank: number; // 1 to 10
  totalCompared: number;
  deltaPercentVsMedian: number;
  verdict: string;
  recommendation: string;
}

/**
 * Calculates Outlier Velocity Multipliers relative to channel median performance
 */
export function calculateOutlierMetrics(videos: VideoItem[]): Map<string, OutlierRating> {
  const map = new Map<string, OutlierRating>();
  if (!videos || videos.length === 0) return map;

  const now = new Date().getTime();

  // Compute daily velocities
  const velocities = videos.map((v) => {
    const pubDate = new Date(v.publishedAt).getTime();
    const daysSince = Math.max(1, Math.round((now - pubDate) / (1000 * 60 * 60 * 24)));
    const vel = v.views / daysSince;
    return { id: v.id, vel };
  });

  // Calculate median velocity
  const sortedVelocities = [...velocities].map((item) => item.vel).sort((a, b) => a - b);
  const mid = Math.floor(sortedVelocities.length / 2);
  const medianVel =
    sortedVelocities.length % 2 !== 0
      ? sortedVelocities[mid]
      : (sortedVelocities[mid - 1] + sortedVelocities[mid]) / 2 || 1;

  velocities.forEach(({ id, vel }) => {
    const multiplier = parseFloat((vel / (medianVel || 1)).toFixed(1));
    let tier: OutlierRating['tier'] = 'normal';
    let label = 'Baseline';
    let badgeColor = 'text-slate-400 border-slate-700';

    if (multiplier >= 4.0) {
      tier = '10x';
      label = `${multiplier}x Viral Outlier`;
      badgeColor = 'text-amber-400 bg-amber-400/10 border-amber-400/30';
    } else if (multiplier >= 2.5) {
      tier = '5x';
      label = `${multiplier}x High Velocity`;
      badgeColor = 'text-rose-400 bg-rose-400/10 border-rose-400/30';
    } else if (multiplier >= 1.6) {
      tier = '2x';
      label = `${multiplier}x Above Avg`;
      badgeColor = 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
    }

    map.set(id, {
      videoId: id,
      velocityPerDay: Math.round(vel),
      multiplier,
      tier,
      label,
      badgeColor,
    });
  });

  return map;
}

/**
 * Calculates the classic YouTube Studio "1 of 10" Upload Rank
 */
export function calculateOneOfTenRank(videos: VideoItem[]): OneOfTenAudit | null {
  if (!videos || videos.length === 0) return null;

  // Sort by publish date descending
  const sortedByDate = [...videos].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const pool = sortedByDate.slice(0, 10);
  const latest = pool[0];

  // Rank pool by views
  const sortedByViews = [...pool].sort((a, b) => b.views - a.views);
  const rankIndex = sortedByViews.findIndex((v) => v.id === latest.id);
  const rank = rankIndex !== -1 ? rankIndex + 1 : 1;

  // Median views of previous 9
  const previousViews = pool.slice(1).map((v) => v.views);
  const medianPrevious =
    previousViews.length > 0
      ? previousViews.sort((a, b) => a - b)[Math.floor(previousViews.length / 2)]
      : latest.views;

  const delta = Math.round(((latest.views - medianPrevious) / (medianPrevious || 1)) * 100);

  let verdict = '';
  let recommendation = '';

  if (rank === 1) {
    verdict = '🎉 Ranking 1 of 10 (Highest Performing Recent Upload)';
    recommendation =
      'Initial CTR and audience retention are beating all 9 previous uploads. Pin an interactive discussion comment and prepare a follow-up video on this specific angle.';
  } else if (rank <= 3) {
    verdict = `🔥 Ranking ${rank} of 10 (High Algorithm Velocity)`;
    recommendation =
      'Strong initial audience velocity. Test Variant B thumbnail to push this video to the #1 spot.';
  } else if (rank <= 6) {
    verdict = `⚖️ Ranking ${rank} of 10 (Steady Channel Pace)`;
    recommendation =
      'Performing on par with channel average. Re-title with high curiosity keyword in the first 3 words.';
  } else {
    verdict = `⚠️ Ranking ${rank} of 10 (Underperforming Baseline)`;
    recommendation =
      'Impression velocity is slowing. Swap the thumbnail immediately and inspect hook drop-off in the first 30 seconds.';
  }

  return {
    latestVideo: latest,
    rank,
    totalCompared: pool.length,
    deltaPercentVsMedian: delta,
    verdict,
    recommendation,
  };
}
