/**
 * buildTwitterImprovementBrief.mjs — compare @Real_NHL_Savant performance vs the
 * niche viral corpus and emit structured findings for the Social Improvement agent.
 *
 * Inputs (from refresh-twitter-analysis workflow):
 *   social_analysis/my_tweets.json
 *   social_analysis/niche_trends.json
 *   social_analysis/growth_tips.json
 *
 * Output:
 *   social_analysis/improvement_brief.json
 *
 * Usage: node scripts/buildTwitterImprovementBrief.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '../social_analysis');

const EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u;

function loadJson(path) {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function features(text) {
  const lines = String(text || '').split('\n').filter(Boolean);
  const t = text || '';
  return {
    chars: t.length,
    lines: lines.length,
    hasEmoji: EMOJI_RE.test(t),
    hasQuestion: /\?/.test(t),
    hasNumbers: /\$[\d,]+|\d+%|\d+u\b|[-+]\d{1,2}u|\+\d+\.\d+u/.test(t),
    hasCheckmarks: /✅|✔/.test(t),
    hasRecordFlex: /\d-\d|yesterday|past \d days|cumulative|profit/i.test(t),
    hasPickUnits: /\d+u\b|units?/i.test(t),
    hasSharpStack: /proven|hc sharp|sharp money|pinnacle|whale|\$[\d,]+k/i.test(t),
    hasCTA: /like this|follow|riding with|which ticket|fade or|drop your/i.test(t),
    isThreadShaped: lines.length >= 6,
    firstLine: (lines[0] || '').slice(0, 120),
  };
}

function classifyPost(f) {
  if (f.hasRecordFlex && f.hasCTA) return 'record_flex_cta';
  if (f.hasPickUnits && f.hasSharpStack && f.hasQuestion) return 'single_game_deep_dive';
  if (/grilling|weekend|pay for it/i.test(f.firstLine)) return 'personality_card';
  if (/meanwhile|everybody|world cup|public/i.test(f.firstLine)) return 'contrarian_hook';
  if (/tracker|tool|monitoring/i.test(f.firstLine)) return 'product_reveal';
  if (f.hasCheckmarks && f.hasRecordFlex) return 'recap_checkmarks';
  if (f.hasPickUnits) return 'pick_card';
  return 'other';
}

function engagementScore(p) {
  if (Number.isFinite(p.likes)) return p.likes + (p.retweets || 0) * 3;
  if (Array.isArray(p.nitterStats) && p.nitterStats.length) return Math.max(...p.nitterStats);
  return 0;
}

function pct(arr, pred) {
  if (!arr.length) return 0;
  return +((arr.filter(pred).length / arr.length) * 100).toFixed(0);
}

function avg(arr, fn) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((s, x) => s + fn(x), 0) / arr.length);
}

function pickGrowthTipsForGaps(growthPosts, gaps) {
  if (!growthPosts.length) return [];
  const gapAreas = new Set(gaps.map((g) => g.area));
  const topicPriority = [];
  if (gapAreas.has('retweets')) topicPriority.push('shareability', 'hooks', 'cta');
  if (gapAreas.has('threads')) topicPriority.push('threads', 'hooks');
  if (gapAreas.has('question_close')) topicPriority.push('cta', 'engagement');
  if (gapAreas.has('post_length')) topicPriority.push('threads', 'hooks');
  topicPriority.push('algorithm', 'timing', 'general');

  const picked = [];
  const seen = new Set();
  for (const topic of topicPriority) {
    for (const p of growthPosts) {
      if (p.features?.topic !== topic || seen.has(p.id)) continue;
      seen.add(p.id);
      picked.push(p);
      if (picked.length >= 8) return picked;
    }
  }
  for (const p of growthPosts) {
    if (seen.has(p.id)) continue;
    picked.push(p);
    if (picked.length >= 8) break;
  }
  return picked;
}

function main() {
  const mine = loadJson(join(DIR, 'my_tweets.json'));
  const niche = loadJson(join(DIR, 'niche_trends.json'));
  const growth = loadJson(join(DIR, 'growth_tips.json'));
  if (!mine?.posts?.length) {
    console.error('Missing social_analysis/my_tweets.json — run analyzeMyTweets.mjs first.');
    process.exit(1);
  }
  if (!niche?.posts?.length) {
    console.warn('Missing niche_trends.json — brief will be own-account only.');
  }
  if (!growth?.posts?.length) {
    console.warn('Missing growth_tips.json — brief will omit platform growth tactics.');
  }

  const own = mine.posts.map((p) => {
    const f = features(p.text);
    return {
      id: p.id,
      date: p.date || p.dateTitle,
      textPreview: p.text.slice(0, 160).replace(/\n/g, ' · '),
      likes: p.likes ?? null,
      retweets: p.retweets ?? null,
      engagement: engagementScore(p),
      format: classifyPost(f),
      features: f,
      source: p.source,
    };
  }).sort((a, b) => b.engagement - a.engagement);

  const withLikes = own.filter((p) => p.likes != null);
  const nichePosts = niche?.posts || [];

  const ownAgg = {
    sampleSize: own.length,
    withLabeledEngagement: withLikes.length,
    avgLikes: withLikes.length ? +(withLikes.reduce((s, p) => s + p.likes, 0) / withLikes.length).toFixed(1) : null,
    totalRetweets: withLikes.reduce((s, p) => s + (p.retweets || 0), 0),
    pctWithEmoji: pct(own, (p) => p.features.hasEmoji),
    pctWithQuestion: pct(own, (p) => p.features.hasQuestion),
    pctWithNumbers: pct(own, (p) => p.features.hasNumbers),
    pctWithCTA: pct(own, (p) => p.features.hasCTA),
    pctThreadShaped: pct(own, (p) => p.features.isThreadShaped),
    avgChars: avg(own, (p) => p.features.chars),
    formatBreakdown: Object.fromEntries(
      [...new Set(own.map((p) => p.format))].map((fmt) => [
        fmt,
        {
          count: own.filter((p) => p.format === fmt).length,
          avgEngagement: avg(own.filter((p) => p.format === fmt), (p) => p.engagement),
          avgLikes: (() => {
            const xs = withLikes.filter((p) => p.format === fmt);
            return xs.length ? +(xs.reduce((s, p) => s + p.likes, 0) / xs.length).toFixed(1) : null;
          })(),
        },
      ])
    ),
  };

  const nicheAgg = niche?.aggregate || {
    pctWithEmoji: pct(nichePosts, (p) => p.features?.hasEmoji),
    pctWithQuestion: pct(nichePosts, (p) => p.features?.hasQuestion),
    pctWithNumbers: pct(nichePosts, (p) => p.features?.hasNumbers),
    avgChars: avg(nichePosts, (p) => p.features?.chars || 0),
  };

  const gaps = [];
  if (nichePosts.length) {
    if (ownAgg.pctWithQuestion < nicheAgg.pctWithQuestion - 10)
      gaps.push({ area: 'question_close', ours: ownAgg.pctWithQuestion, niche: nicheAgg.pctWithQuestion, severity: 'high' });
    if (ownAgg.avgChars < nicheAgg.avgChars * 0.75)
      gaps.push({ area: 'post_length', ours: ownAgg.avgChars, niche: nicheAgg.avgChars, severity: 'medium' });
    if (ownAgg.totalRetweets === 0)
      gaps.push({ area: 'retweets', ours: 0, niche: 'viral posts avg high RT', severity: 'critical' });
    if (ownAgg.pctThreadShaped < 15)
      gaps.push({ area: 'threads', ours: ownAgg.pctWithQuestion, niche: 'threads common in niche', severity: 'high' });
  }

  const experiments = [];
  if (ownAgg.totalRetweets === 0) {
    experiments.push({
      id: 'shareable_one_liner',
      action: 'Add one bold, screenshot-worthy line per post that stands alone without context.',
      why: 'Retweets are ~0; niche viral posts often have a quotable hook.',
    });
  }
  if (ownAgg.pctThreadShaped < 20) {
    experiments.push({
      id: 'thread_weekly',
      action: 'Ship one thread per week: hook tweet + 2–4 replies (deep dive or multi-pick card).',
      why: 'Single-game deep dives are thread-shaped but posted as one block.',
    });
  }
  const bestFmt = Object.entries(ownAgg.formatBreakdown)
    .filter(([, v]) => v.avgLikes != null)
    .sort((a, b) => (b[1].avgLikes || 0) - (a[1].avgLikes || 0))[0];
  if (bestFmt) {
    experiments.push({
      id: 'double_down_format',
      action: `Post more "${bestFmt[0]}" format — your best avg likes (${bestFmt[1].avgLikes}) in labeled sample.`,
      why: 'Double down on what already works before chasing new formats.',
    });
  }
  if (nichePosts.length) {
    const topNicheHook = nichePosts[0]?.features?.firstLine || nichePosts[0]?.text?.split('\n')[0];
    if (topNicheHook) {
      experiments.push({
        id: 'niche_hook_study',
        action: `Study niche opener pattern (not copy): "${String(topNicheHook).slice(0, 80)}…"`,
        why: `Top niche post this pull: ${nichePosts[0].engagement} engagement.`,
      });
    }
  }

  const growthPosts = growth?.posts || [];
  const relevantGrowthTips = pickGrowthTipsForGaps(growthPosts, gaps);
  for (const tip of relevantGrowthTips.slice(0, 3)) {
    const topic = tip.features?.topic || 'general';
    const hook = tip.features?.firstLine || tip.text?.split('\n')[0] || '';
    experiments.push({
      id: `growth_${topic}_${tip.id}`,
      action: `Apply ${topic} tactic from viral growth post (@${tip.handle}, ${tip.engagement} eng): "${String(hook).slice(0, 70)}…"`,
      why: 'Recent high-engagement X growth advice matched to a diagnosed gap.',
      source: 'growth_tips',
    });
  }

  const brief = {
    generatedAt: new Date().toISOString(),
    handle: mine.handle || 'Real_NHL_Savant',
    sources: {
      myTweetsFetchedAt: mine.fetchedAt,
      nicheTrendsFetchedAt: niche?.fetchedAt || null,
      nicheViralCount: nichePosts.length,
      growthTipsFetchedAt: growth?.fetchedAt || null,
      growthTipsCount: growthPosts.length,
    },
    ownPerformance: ownAgg,
    nicheBenchmark: nicheAgg,
    gaps,
    topOwnPosts: own.slice(0, 5).map(({ id, date, format, likes, retweets, engagement, textPreview, features: f }) => ({
      id, date, format, likes, retweets, engagement, textPreview,
      hook: f.firstLine,
    })),
    bottomOwnPosts: own.slice(-3).reverse().map(({ id, format, likes, engagement, textPreview }) => ({
      id, format, likes, engagement, textPreview,
    })),
    topNichePosts: nichePosts.slice(0, 8).map((p) => ({
      handle: p.handle,
      engagement: p.engagement,
      hook: p.features?.firstLine || p.text?.split('\n')[0]?.slice(0, 100),
      hasEmoji: p.features?.hasEmoji,
      hasQuestion: p.features?.hasQuestion,
      chars: p.features?.chars,
      textPreview: String(p.text || '').slice(0, 200).replace(/\n/g, ' · '),
    })),
    growthPlaybook: {
      topicBreakdown: growth?.topicBreakdown || {},
      aggregate: growth?.aggregate || null,
      topTips: relevantGrowthTips.map((p) => ({
        handle: p.handle,
        topic: p.features?.topic,
        engagement: p.engagement,
        hook: p.features?.firstLine?.slice(0, 120),
        isActionable: p.features?.hasActionVerbs || p.features?.hasNumberedList,
        textPreview: String(p.text || '').slice(0, 280).replace(/\n/g, ' · '),
        source: p.source,
      })),
    },
    recommendedExperiments: experiments,
    agentInstructions: [
      'Compare ownPerformance vs nicheBenchmark — call out specific deltas.',
      'For each gap, give one concrete fix for the next 7 days of posts.',
      'Extract 3 hook templates from topNichePosts adapted to Dale voice (not verbatim).',
      'Extract 3 anti-patterns from bottomOwnPosts.',
      'From growthPlaybook.topTips, pick 2–4 platform tactics to test this week (threads, RT hooks, timing, CTA).',
      'Map each growth tip to a specific gap — do not dump generic advice.',
      'Update the weekly experiment list with ONE priority test.',
    ],
  };

  writeFileSync(join(DIR, 'improvement_brief.json'), JSON.stringify(brief, null, 2));
  console.log(`Wrote social_analysis/improvement_brief.json`);
  console.log(`  Own: ${own.length} posts · avg likes ${ownAgg.avgLikes ?? 'n/a'} · RT total ${ownAgg.totalRetweets}`);
  console.log(`  Niche: ${nichePosts.length} viral · Growth: ${growthPosts.length} tips · gaps ${gaps.length} · experiments ${experiments.length}`);
}

main();
