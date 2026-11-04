const { test, describe } = require('node:test');
const assert = require('node:assert');

// 1. STATISTICAL SIGNIFICANCE ENGINE TESTS
describe('A/B Testing Two-Proportion Z-Test Engine', () => {
  function calculateStatisticalSignificance(viewsA, impressionsA, viewsB, impressionsB) {
    if (impressionsA < 50 || impressionsB < 50) {
      return { zScore: 0, confidenceScore: 0, pValue: 1, isSignificant: false };
    }
    const pA = viewsA / impressionsA;
    const pB = viewsB / impressionsB;
    const pPooled = (viewsA + viewsB) / (impressionsA + impressionsB);
    const standardError = Math.sqrt(pPooled * (1 - pPooled) * (1 / impressionsA + 1 / impressionsB));
    if (standardError === 0) return { zScore: 0, confidenceScore: 0, pValue: 1, isSignificant: false };

    const zScore = Math.abs(pB - pA) / standardError;
    const t = 1.0 / (1.0 + 0.2316419 * zScore);
    const d = 0.3989423 * Math.exp((-zScore * zScore) / 2);
    const pOneTailed = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    const pValue = Math.min(1, Math.max(0, 2 * pOneTailed));
    const confidenceScore = parseFloat(Math.max(0, (1 - pValue) * 100).toFixed(1));

    return {
      zScore: parseFloat(zScore.toFixed(3)),
      confidenceScore,
      pValue: parseFloat(pValue.toFixed(4)),
      isSignificant: confidenceScore >= 95.0,
    };
  }

  test('returns 0 confidence if impressions are below 50', () => {
    const res = calculateStatisticalSignificance(5, 40, 10, 40);
    assert.strictEqual(res.confidenceScore, 0);
    assert.strictEqual(res.isSignificant, false);
  });

  test('identifies statistically significant CTR winner with >95% confidence', () => {
    // Variant A: 100 views / 1000 impressions (10.0% CTR)
    // Variant B: 150 views / 1000 impressions (15.0% CTR)
    const res = calculateStatisticalSignificance(100, 1000, 150, 1000);
    assert.ok(res.confidenceScore >= 95.0, `Expected confidence >= 95, got ${res.confidenceScore}`);
    assert.strictEqual(res.isSignificant, true);
  });

  test('identifies non-significant test when sample difference is noisy', () => {
    // Variant A: 100 views / 1000 impressions (10.0% CTR)
    // Variant B: 104 views / 1000 impressions (10.4% CTR)
    const res = calculateStatisticalSignificance(100, 1000, 104, 1000);
    assert.ok(res.confidenceScore < 90.0, `Expected confidence < 90, got ${res.confidenceScore}`);
    assert.strictEqual(res.isSignificant, false);
  });
});

// 2. OUTLIER VELOCITY MATHEMATICAL ENGINE
describe('Channel Outlier Velocity Math Engine', () => {
  function computeMultiplier(itemVel, medianVel) {
    return parseFloat((itemVel / (medianVel || 1)).toFixed(1));
  }

  test('correctly calculates 10x viral multiplier', () => {
    const median = 500;
    const viral = 5200;
    const mult = computeMultiplier(viral, median);
    assert.strictEqual(mult, 10.4);
    assert.ok(mult >= 4.0);
  });

  test('correctly calculates 2x above average multiplier', () => {
    const median = 500;
    const aboveAvg = 950;
    const mult = computeMultiplier(aboveAvg, median);
    assert.strictEqual(mult, 1.9);
    assert.ok(mult >= 1.6 && mult < 2.5);
  });
});

// 3. X-AXIS STEP CALCULATOR
describe('Recharts X-Axis Step Calculator', () => {
  function calculateXAxisInterval(dataLength, maxTicks = 7) {
    if (!dataLength || dataLength <= maxTicks) return 0;
    return Math.max(1, Math.floor(dataLength / maxTicks));
  }

  test('returns 0 for 7 or fewer data points', () => {
    assert.strictEqual(calculateXAxisInterval(7), 0);
    assert.strictEqual(calculateXAxisInterval(5), 0);
  });

  test('returns step of 4 for 28 daily points', () => {
    assert.strictEqual(calculateXAxisInterval(28, 7), 4);
  });

  test('returns step of 12 for 90 daily points', () => {
    assert.strictEqual(calculateXAxisInterval(90, 7), 12);
  });
});

// 4. NUMBER AND CURRENCY FORMATTING
describe('Short-scale Formatter Utility', () => {
  function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    if (Math.abs(num) >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (Math.abs(num) >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (Math.abs(num) >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toLocaleString('en-US');
  }

  test('formats thousands as K', () => {
    assert.strictEqual(formatNumber(248500), '248.5K');
    assert.strictEqual(formatNumber(1000), '1K');
  });

  test('formats millions as M', () => {
    assert.strictEqual(formatNumber(1500000), '1.5M');
  });

  test('formats billions as B', () => {
    assert.strictEqual(formatNumber(2500000000), '2.5B');
  });
});

// 5. STRIPE WEBHOOK SIGNATURE & SECURITY ENGINE
describe('Stripe Webhook Signature Verification Engine', () => {
  const crypto = require('crypto');

  function verifyStripeSignature(payload, signatureHeader, secret) {
    if (!signatureHeader || !secret) return false;
    try {
      const items = signatureHeader.split(',');
      let timestamp;
      const signatures = [];
      for (const item of items) {
        const [key, value] = item.trim().split('=');
        if (key === 't') timestamp = value;
        else if (key === 'v1') signatures.push(value);
      }
      if (!timestamp || signatures.length === 0) return false;

      const currentTime = Math.floor(Date.now() / 1000);
      const eventTime = parseInt(timestamp, 10);
      if (Math.abs(currentTime - eventTime) > 300) return false;

      const signedPayload = `${timestamp}.${payload}`;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(signedPayload, 'utf8')
        .digest('hex');

      const expectedBuf = Buffer.from(expectedSignature, 'hex');
      return signatures.some((sig) => {
        try {
          const sigBuf = Buffer.from(sig, 'hex');
          return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf);
        } catch {
          return false;
        }
      });
    } catch {
      return false;
    }
  }

  const secret = 'whsec_test_secret_key_12345';
  const payload = JSON.stringify({ id: 'evt_123', type: 'checkout.session.completed' });

  test('validates authentic Stripe HMAC signature successfully', () => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const hash = crypto.createHmac('sha256', secret).update(`${timestamp}.${payload}`, 'utf8').digest('hex');
    const header = `t=${timestamp},v1=${hash}`;

    const isValid = verifyStripeSignature(payload, header, secret);
    assert.strictEqual(isValid, true);
  });

  test('rejects tampered or forged Stripe signatures', () => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const header = `t=${timestamp},v1=forged_bad_hash_value`;

    const isValid = verifyStripeSignature(payload, header, secret);
    assert.strictEqual(isValid, false);
  });

  test('rejects expired webhook signatures older than 5 minutes', () => {
    const expiredTimestamp = (Math.floor(Date.now() / 1000) - 400).toString();
    const hash = crypto.createHmac('sha256', secret).update(`${expiredTimestamp}.${payload}`, 'utf8').digest('hex');
    const header = `t=${expiredTimestamp},v1=${hash}`;

    const isValid = verifyStripeSignature(payload, header, secret);
    assert.strictEqual(isValid, false);
  });
});

// 6. MULTI-NICHE CHANNEL ENGINE
describe('Multi-Niche Channel Catalog Engine', () => {
  function getVideosForChannel(channelId, collections) {
    if (channelId === 'ch-codecraft') return collections.codecraft;
    if (channelId === 'ch-creatorlab') return collections.creatorlab;
    return collections.techpulse;
  }

  const mockCollections = {
    techpulse: [{ id: 'v1', tags: ['SaaS', 'FullStack'] }],
    codecraft: [{ id: 'v2', tags: ['Rust', 'DevOps'] }],
    creatorlab: [{ id: 'v3', tags: ['Minecraft', 'Gaming'] }],
  };

  test('returns coding catalog for CodeCraft channel', () => {
    const videos = getVideosForChannel('ch-codecraft', mockCollections);
    assert.strictEqual(videos[0].tags[0], 'Rust');
  });

  test('returns gaming catalog for CreatorLab Shorts channel', () => {
    const videos = getVideosForChannel('ch-creatorlab', mockCollections);
    assert.strictEqual(videos[0].tags[0], 'Minecraft');
  });

  test('falls back to TechPulse for default or unknown channel', () => {
    const videos = getVideosForChannel('ch-unknown', mockCollections);
    assert.strictEqual(videos[0].tags[0], 'SaaS');
  });
});

// 7. SPONSORSHIP RATE CARD MATH ENGINE
describe('Sponsorship Rate Card Math Engine', () => {
  function calculateSponsorshipRates(projectedViews, cpm) {
    const baseline = (projectedViews / 1000) * cpm;
    return {
      midRoll: Math.round(baseline),
      dedicated: Math.round(baseline * 2.4),
      preRoll: Math.round(baseline * 0.6),
      short: Math.round(baseline * 0.45),
    };
  }

  test('calculates correct mid-roll and dedicated rates for 50k views at $30 CPM', () => {
    const rates = calculateSponsorshipRates(50000, 30);
    // baseline = 50 * 30 = 1500
    assert.strictEqual(rates.midRoll, 1500);
    assert.strictEqual(rates.dedicated, 3600); // 1500 * 2.4
    assert.strictEqual(rates.preRoll, 900);    // 1500 * 0.6
    assert.strictEqual(rates.short, 675);     // 1500 * 0.45
  });

  test('handles lower view volume gracefully without negative or fractional rates', () => {
    const rates = calculateSponsorshipRates(10000, 20);
    assert.strictEqual(rates.midRoll, 200);
    assert.strictEqual(rates.dedicated, 480);
    assert.ok(rates.short > 0);
  });
});

// 8. HEURISTIC TITLE OPTIMIZATION SCORER
describe('Heuristic Title Optimization Scorer Engine', () => {
  function scoreTitle(title) {
    if (!title) return { score: 0 };
    const lower = title.toLowerCase();
    const powerWords = ['stop', 'wrong', 'secret', 'never', 'how i', 'blueprint', 'tested', 'insane', 'proven', 'shocking'];
    const curiosityHooks = ['why', 'nobody', 'talking about', 'truth about', 'revealed', 'vs'];

    const hasPower = powerWords.some((pw) => lower.includes(pw));
    const hasCuriosity = curiosityHooks.some((hook) => lower.includes(hook));
    const len = title.length;
    const isOptimalLength = len >= 40 && len <= 65;

    let score = 50;
    if (isOptimalLength) score += 20;
    else if (len >= 30 && len <= 75) score += 10;
    else score -= 15;

    if (hasPower) score += 15;
    if (hasCuriosity) score += 15;

    return { score: Math.min(100, Math.max(0, score)), isOptimalLength, hasPower, hasCuriosity };
  }

  test('awards maximum score for optimal length, power word, and curiosity hook', () => {
    const title = 'Stop Building SaaS Wrong! The Truth About Next.js in 2026';
    const result = scoreTitle(title);
    assert.strictEqual(result.isOptimalLength, true);
    assert.strictEqual(result.hasPower, true);
    assert.strictEqual(result.hasCuriosity, true);
    assert.strictEqual(result.score, 100);
  });

  test('penalizes titles that are too short without triggers', () => {
    const title = 'My Cool App';
    const result = scoreTitle(title);
    assert.strictEqual(result.isOptimalLength, false);
    assert.ok(result.score < 50);
  });
});
