/**
 * A/B Testing Statistical Significance Engine
 * Uses Two-Proportion Z-Test to evaluate CTR uplift between Variant A and Variant B.
 */
export function calculateStatisticalSignificance(
  viewsA: number,
  impressionsA: number,
  viewsB: number,
  impressionsB: number
): { zScore: number; confidenceScore: number; pValue: number; isSignificant: boolean } {
  if (impressionsA < 50 || impressionsB < 50) {
    return { zScore: 0, confidenceScore: 0, pValue: 1, isSignificant: false };
  }

  const pA = viewsA / impressionsA;
  const pB = viewsB / impressionsB;

  // Pooled proportion
  const pPooled = (viewsA + viewsB) / (impressionsA + impressionsB);

  // Standard error
  const standardError = Math.sqrt(
    pPooled * (1 - pPooled) * (1 / impressionsA + 1 / impressionsB)
  );

  if (standardError === 0) {
    return { zScore: 0, confidenceScore: 0, pValue: 1, isSignificant: false };
  }

  const zScore = Math.abs(pB - pA) / standardError;

  // Approximate normal cumulative distribution function (CDF)
  const t = 1.0 / (1.0 + 0.2316419 * zScore);
  const d = 0.3989423 * Math.exp((-zScore * zScore) / 2);
  const pOneTailed =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  const pValue = Math.min(1, Math.max(0, 2 * pOneTailed));
  const confidenceScore = parseFloat(Math.max(0, (1 - pValue) * 100).toFixed(1));

  return {
    zScore: parseFloat(zScore.toFixed(3)),
    confidenceScore,
    pValue: parseFloat(pValue.toFixed(4)),
    isSignificant: confidenceScore >= 95.0,
  };
}

/**
 * Heuristic 0–100 Title Optimization Scorer
 */
export function scoreTitleOptimization(title: string): {
  score: number;
  hasPowerWords: boolean;
  hasNumbers: boolean;
  hasCuriosityGap: boolean;
  lengthOptimal: boolean;
} {
  if (!title) {
    return { score: 0, hasPowerWords: false, hasNumbers: false, hasCuriosityGap: false, lengthOptimal: false };
  }

  const lower = title.toLowerCase();
  const powerWords = ['stop', 'wrong', 'secret', 'never', 'how i', 'blueprint', 'tested', 'insane', 'proven', 'shocking', 'best'];
  const curiosityHooks = ['why', 'nobody', 'talking about', 'what happens', 'truth about', 'revealed', 'vs'];

  const hasPowerWords = powerWords.some((pw) => lower.includes(pw));
  const hasNumbers = /\d+/.test(title);
  const hasCuriosityGap = curiosityHooks.some((hook) => lower.includes(hook));
  const len = title.length;
  const lengthOptimal = len >= 40 && len <= 65;

  let score = 50;
  if (lengthOptimal) score += 20;
  else if (len >= 30 && len <= 75) score += 10;
  else score -= 15;

  if (hasPowerWords) score += 15;
  if (hasNumbers) score += 10;
  if (hasCuriosityGap) score += 10;

  const finalScore = Math.min(Math.max(score, 20), 100);

  return {
    score: finalScore,
    hasPowerWords,
    hasNumbers,
    hasCuriosityGap,
    lengthOptimal,
  };
}
