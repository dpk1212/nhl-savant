/**
 * buildTwitterImprovementBrief.mjs — compare @Real_NHL_Savant vs niche peers and emit
 * structured, high-signal findings for the Social Improvement agent.
 *
 * Design principles:
 *   - Labeled x.com likes/RTs are authoritative; nitter view counts are NOT engagement.
 *   - Niche structure recipes beat generic "use more emoji" deltas.
 *   - Output pre-digested matchups + rewrite candidates so the agent coaches, not recites.
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
  const first = lines[0] || '';
  return {
    chars: t.length,
    lines: lines.length,
    hasEmoji: EMOJI_RE.test(t),
    hasQuestion: /\?/.test(t),
    hasNumbers: /\$[\d,]+|\d+%|\d+u\b|[-+]\d{1,2}u|\+\d+\.\d+u/.test(t),
    hasCheckmarks: /✅|✔/.test(t),
    hasRecordFlex: /\d-\d|yesterday|past \d days|cumulative|profit|went \d/i.test(t),
    hasPickUnits: /\d+u\b|units?/i.test(t),
    hasSharpStack: /proven|hc sharp|sharp money|pinnacle|whale|\$[\d,]+k/i.test(t),
    hasSharpPublicSplit: /public|sharp.*%|%\s*(bets|dollars|money)|vs\.? sharps?/i.test(t),
    hasLineMove: /move:|->|line move|opened|now at/i.test(t),
    hasCTA: /like this|follow|riding with|which ticket|fade or|drop your|repost|rt if/i.test(t),
    isTrueThread: /🧵|^1\/\d/m.test(t),
    isMultiLineCard: lines.length >= 4 && !/🧵/.test(t),
    firstLine: first.slice(0, 120),
    lastLine: (lines[lines.length - 1] || '').slice(0, 120),
  };
}

function classifyPost(f) {
  if (f.hasRecordFlex && f.hasCTA) return 'record_flex_cta';
  if (f.hasSharpPublicSplit && !f.hasPickUnits) return 'sharp_public_board';
  if (f.hasRecordFlex && f.hasCheckmarks) return 'recap_checkmarks';
  if (f.hasRecordFlex && f.hasPickUnits) return 'record_plus_picks';
  if (f.hasPickUnits && f.hasSharpStack) return 'pick_with_proof';
  if (/tracker|tool|monitoring/i.test(f.firstLine)) return 'product_reveal';
  if (/meanwhile|everybody|world cup|public is/i.test(f.firstLine)) return 'contrarian_hook';
  if (f.hasPickUnits) return 'pick_card';
  if (f.hasCheckmarks) return 'recap_only';
  return 'other';
}

function classifyNichePattern(text, f) {
  const t = String(text || '').toLowerCase();
  if (/where the sharps?\/public|public vs sharps?|sharp action/i.test(t)) return 'sharp_public_board';
  if (/recap|✅|❌/.test(t) && f.hasRecordFlex) return 'honest_recap';
  if (/play of the day|pod\b|lock/i.test(t)) return 'play_of_day';
  if (f.hasLineMove || /%\s*bets/.test(t)) return 'line_move_table';
  if (f.hasPickUnits || /moneyline|spread|ml\b/i.test(t)) return 'pick_card';
  return 'other';
}

function labeledScore(p) {
  if (!Number.isFinite(p.likes)) return null;
  return p.likes + (p.retweets || 0) * 3;
}

function nitterViewEstimate(p) {
  if (!Array.isArray(p.nitterStats) || !p.nitterStats.length) return null;
  return Math.max(...p.nitterStats);
}

function pct(arr, pred) {
  if (!arr.length) return 0;
  return +((arr.filter(pred).length / arr.length) * 100).toFixed(0);
}

function avg(arr, fn) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((s, x) => s + fn(x), 0) / arr.length);
}

function nicheStructureRecipe(text, pattern) {
  const lines = String(text || '').split('\n').filter(Boolean);
  const recipes = {
    sharp_public_board: {
      pattern: 'sharp_public_board',
      line1Job: 'Name the game/slate + promise sharp vs public split',
      proofBlock: 'Side-by-side: public % vs sharp $, line move, or "notable sharp action" bullets',
      closeJob: 'One verdict line — which side the market is wrong about',
      exemplarLines: lines.slice(0, 6),
    },
    honest_recap: {
      pattern: 'honest_recap',
      line1Job: 'Label it a recap + own the record immediately',
      proofBlock: 'Checkmarks AND misses — losses named, not buried',
      closeJob: 'Tease next board or lesson from the miss',
      exemplarLines: lines.slice(0, 6),
    },
    line_move_table: {
      pattern: 'line_move_table',
      line1Job: 'Slate header (round/week/game)',
      proofBlock: 'Compact table: team, public %, sharp %, book, move arrow',
      closeJob: 'Optional — which side is the story',
      exemplarLines: lines.slice(0, 6),
    },
    pick_with_proof: {
      pattern: 'pick_with_proof',
      line1Job: 'Record or tension hook BEFORE the pick',
      proofBlock: 'Units + wallet count + dollar stack',
      closeJob: 'Binary choice or tail/fade question',
      exemplarLines: lines.slice(0, 6),
    },
  };
  return recipes[pattern] || {
    pattern,
    line1Job: 'Scroll-stopping hook with specific game/market',
    proofBlock: 'Numbers, wallets, or line evidence',
    closeJob: 'Question or next-action',
    exemplarLines: lines.slice(0, 4),
  };
}

function structuralDiff(ownPost, nicheRecipe) {
  const f = ownPost.features;
  const missing = [];
  if (nicheRecipe.pattern === 'sharp_public_board' && !f.hasSharpPublicSplit) {
    missing.push('No sharp/public split — post leads with picks not market map');
  }
  if (nicheRecipe.pattern === 'sharp_public_board' && f.hasPickUnits && !f.hasSharpPublicSplit) {
    missing.push('Pick-first structure; niche winners lead with "where money is" board');
  }
  if (nicheRecipe.pattern === 'honest_recap' && f.hasCheckmarks && !/❌|miss|lost|blew/.test(ownPost.textPreview || '')) {
    missing.push('Recap shows wins only — niche recaps name the miss');
  }
  if (nicheRecipe.pattern === 'pick_with_proof' && !f.hasRecordFlex) {
    missing.push('Pick dropped without record/tension setup');
  }
  if (nicheRecipe.pattern === 'pick_with_proof' && !f.hasSharpStack) {
    missing.push('Pick lacks wallet/dollar proof stack');
  }
  if (f.isMultiLineCard && !f.isTrueThread && f.chars > 400) {
    missing.push('Long single-tweet wall — split into hook + reply thread');
  }
  return missing;
}

function pickGrowthTipsForGaps(growthPosts, gaps) {
  if (!growthPosts.length) return [];
  const gapAreas = new Set(gaps.map((g) => g.area));
  const topicPriority = [];
  if (gapAreas.has('shareability')) topicPriority.push('shareability', 'hooks');
  if (gapAreas.has('structure')) topicPriority.push('threads', 'hooks');
  if (gapAreas.has('proof_stack')) topicPriority.push('hooks', 'general');
  topicPriority.push('algorithm', 'timing', 'general');

  const sorted = [...growthPosts].sort((a, b) => {
    const aSmall = a.engagement <= 25000 ? 1 : 0;
    const bSmall = b.engagement <= 25000 ? 1 : 0;
    if (bSmall !== aSmall) return bSmall - aSmall;
    return b.engagement - a.engagement;
  });

  const picked = [];
  const seen = new Set();
  for (const topic of topicPriority) {
    for (const p of sorted) {
      if (p.features?.topic !== topic || seen.has(p.id)) continue;
      seen.add(p.id);
      picked.push(p);
      if (picked.length >= 5) return picked;
    }
  }
  for (const p of sorted) {
    if (seen.has(p.id)) continue;
    picked.push(p);
    if (picked.length >= 5) break;
  }
  return picked;
}

function buildDiagnosis(labeled, nicheRecipes, formatBreakdown) {
  const best = labeled.sort((a, b) => (b.labeledScore || 0) - (a.labeledScore || 0))[0];
  const worst = labeled.filter((p) => p.labeledScore === 0);
  const bestFmt = Object.entries(formatBreakdown)
    .filter(([, v]) => v.avgLikes != null && v.count >= 1)
    .sort((a, b) => (b[1].avgLikes || 0) - (a[1].avgLikes || 0))[0];

  const parts = [];
  if (labeled.length < 8) {
    parts.push(`Only ${labeled.length} posts have labeled likes — conclusions are directional, not statistical.`);
  }
  if (bestFmt) {
    parts.push(`Best labeled format: ${bestFmt[0]} (avg ${bestFmt[1].avgLikes} likes, n=${bestFmt[1].labeledCount}).`);
  }
  if (best) {
    parts.push(`Top labeled post (${best.labeledScore} score) opens: "${best.features.firstLine.slice(0, 60)}…"`);
  }
  if (worst.length) {
    parts.push(`${worst.length} labeled posts at 0 likes — mostly recaps/contextless replies.`);
  }
  if (nicheRecipes.length) {
    parts.push(`Niche winners in our lane use "${nicheRecipes[0].pattern}" structure — Dale rarely posts that shape.`);
  }
  return parts.join(' ');
}

function main() {
  const mine = loadJson(join(DIR, 'my_tweets.json'));
  const niche = loadJson(join(DIR, 'niche_trends.json'));
  const growth = loadJson(join(DIR, 'growth_tips.json'));
  if (!mine?.posts?.length) {
    console.error('Missing social_analysis/my_tweets.json — run analyzeMyTweets.mjs first.');
    process.exit(1);
  }

  const rawPosts = mine.posts.map((p) => {
    const f = features(p.text);
    const ls = labeledScore(p);
    const views = nitterViewEstimate(p);
    return {
      id: p.id,
      date: p.date || p.dateTitle,
      text: p.text,
      textPreview: p.text.slice(0, 200).replace(/\n/g, ' · '),
      likes: p.likes ?? null,
      retweets: p.retweets ?? null,
      labeledScore: ls,
      nitterViews: views,
      hasLabeledEngagement: ls != null,
      format: classifyPost(f),
      features: f,
      source: p.source,
    };
  });

  const labeled = rawPosts.filter((p) => p.hasLabeledEngagement);
  const nichePosts = (niche?.posts || []).map((p) => {
    const f = p.features || features(p.text);
    const pattern = classifyNichePattern(p.text, f);
    return { ...p, features: f, nichePattern: pattern };
  });

  const nicheInLane = nichePosts.filter((p) =>
    ['sharp_public_board', 'honest_recap', 'line_move_table', 'pick_with_proof', 'pick_card'].includes(p.nichePattern)
  );

  const nicheRecipes = [];
  const seenPatterns = new Set();
  for (const p of nicheInLane) {
    if (seenPatterns.has(p.nichePattern)) continue;
    seenPatterns.add(p.nichePattern);
    nicheRecipes.push({
      pattern: p.nichePattern,
      handle: p.handle,
      engagement: p.engagement,
      hook: p.features?.firstLine || p.text?.split('\n')[0]?.slice(0, 100),
      recipe: nicheStructureRecipe(p.text, p.nichePattern),
    });
    if (nicheRecipes.length >= 4) break;
  }

  const formatBreakdown = {};
  for (const p of rawPosts) {
    if (!formatBreakdown[p.format]) {
      formatBreakdown[p.format] = { count: 0, labeledCount: 0, likesSum: 0, rtSum: 0 };
    }
    const b = formatBreakdown[p.format];
    b.count++;
    if (p.hasLabeledEngagement) {
      b.labeledCount++;
      b.likesSum += p.likes;
      b.rtSum += p.retweets || 0;
    }
  }
  for (const [, b] of Object.entries(formatBreakdown)) {
    b.avgLikes = b.labeledCount ? +(b.likesSum / b.labeledCount).toFixed(1) : null;
    b.avgLabeledScore = b.labeledCount
      ? +((b.likesSum + b.rtSum * 3) / b.labeledCount).toFixed(1)
      : null;
  }

  const labeledAgg = {
    sampleSize: labeled.length,
    totalPosts: rawPosts.length,
    avgLikes: labeled.length ? +(labeled.reduce((s, p) => s + p.likes, 0) / labeled.length).toFixed(1) : null,
    totalRetweets: labeled.reduce((s, p) => s + (p.retweets || 0), 0),
    bestPost: labeled.sort((a, b) => (b.labeledScore || 0) - (a.labeledScore || 0))[0]?.id || null,
    zeroLikeCount: labeled.filter((p) => p.likes === 0).length,
  };

  const corpusAgg = {
    pctWithEmoji: pct(rawPosts, (p) => p.features.hasEmoji),
    pctWithQuestion: pct(rawPosts, (p) => p.features.hasQuestion),
    pctWithSharpPublicSplit: pct(rawPosts, (p) => p.features.hasSharpPublicSplit),
    pctTrueThreads: pct(rawPosts, (p) => p.features.isTrueThread),
    pctMultiLineCards: pct(rawPosts, (p) => p.features.isMultiLineCard),
    avgChars: avg(rawPosts, (p) => p.features.chars),
  };

  const nicheAgg = niche?.aggregate || {
    pctWithEmoji: pct(nichePosts, (p) => p.features?.hasEmoji),
    avgChars: avg(nichePosts, (p) => p.features?.chars || 0),
  };

  const gaps = [];
  if (corpusAgg.pctWithSharpPublicSplit < 20 && nicheInLane.some((p) => p.nichePattern === 'sharp_public_board')) {
    gaps.push({
      area: 'structure',
      issue: 'Missing sharp/public board format',
      ours: `${corpusAgg.pctWithSharpPublicSplit}% of posts`,
      niche: 'PatrickE_Vegas / invisiblestats lead with market map',
      severity: 'high',
      fix: 'Lead with "where sharp vs public money is" BEFORE naming the pick',
    });
  }
  if (labeledAgg.zeroLikeCount > 0) {
    gaps.push({
      area: 'recap_format',
      issue: 'Zero-like labeled posts',
      ours: `${labeledAgg.zeroLikeCount} posts at 0 likes`,
      niche: 'AlexCaruso recaps name misses and still get engagement',
      severity: 'high',
      fix: 'Never post win-only recaps; lead with the miss + lesson',
    });
  }
  if (labeledAgg.totalRetweets === 0 && labeled.length >= 3) {
    gaps.push({
      area: 'shareability',
      issue: 'No retweets in labeled sample',
      ours: '0 RTs',
      niche: 'Viral niche posts have a quotable market-read line',
      severity: 'medium',
      fix: 'First line must work as a standalone screenshot (market read, not pick list)',
    });
  }
  const bestLabeledFmt = Object.entries(formatBreakdown)
    .filter(([, v]) => v.labeledCount >= 1 && v.avgLikes != null)
    .sort((a, b) => (b[1].avgLikes || 0) - (a[1].avgLikes || 0))[0];
  const worstLabeledFmt = Object.entries(formatBreakdown)
    .filter(([, v]) => v.labeledCount >= 1 && v.avgLikes === 0)
    .map(([k]) => k);
  if (worstLabeledFmt.length && bestLabeledFmt) {
    gaps.push({
      area: 'format_mix',
      issue: 'Posting formats that labeled data says fail',
      ours: worstLabeledFmt.join(', '),
      niche: `Double ${bestLabeledFmt[0]} (avg ${bestLabeledFmt[1].avgLikes} likes)`,
      severity: 'high',
      fix: `Pause ${worstLabeledFmt[0]} until record/proof hook is fixed`,
    });
  }

  const topLabeled = [...labeled]
    .sort((a, b) => (b.labeledScore || 0) - (a.labeledScore || 0))
    .slice(0, 5)
    .map(({ id, date, format, likes, retweets, labeledScore, textPreview, features: f }) => ({
      id, date, format, likes, retweets, labeledScore, textPreview,
      hook: f.firstLine,
      close: f.lastLine,
      structure: {
        hasRecordFlex: f.hasRecordFlex,
        hasSharpStack: f.hasSharpStack,
        hasSharpPublicSplit: f.hasSharpPublicSplit,
        isTrueThread: f.isTrueThread,
      },
    }));

  const bottomLabeled = [...labeled]
    .sort((a, b) => (a.labeledScore || 0) - (b.labeledScore || 0))
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      format: p.format,
      likes: p.likes,
      textPreview: p.textPreview,
      hook: p.features.firstLine,
      whyWeak: structuralDiff(p, nicheRecipes[0]?.recipe || { pattern: 'pick_with_proof' }),
    }));

  const formatMatchups = [];
  const primaryRecipe = nicheRecipes.find((r) => r.pattern === 'sharp_public_board') || nicheRecipes[0];
  if (primaryRecipe) {
    const daleClosest = [...rawPosts]
      .filter((p) => p.format === 'record_plus_picks' || p.format === 'pick_with_proof' || p.format === 'contrarian_hook')
      .sort((a, b) => (b.nitterViews || 0) - (a.nitterViews || 0))[0];
    if (daleClosest) {
      formatMatchups.push({
        nichePattern: primaryRecipe.pattern,
        nicheExemplar: `@${primaryRecipe.handle}: "${primaryRecipe.hook}"`,
        dalePostId: daleClosest.id,
        daleHook: daleClosest.features.firstLine,
        structuralGaps: structuralDiff(daleClosest, primaryRecipe.recipe),
        nicheRecipe: primaryRecipe.recipe,
      });
    }
  }

  const rewriteCandidates = bottomLabeled.map((b) => {
    const full = rawPosts.find((p) => p.id === b.id);
    const targetRecipe = nicheRecipes.find((r) => r.pattern === 'honest_recap')
      || nicheRecipes.find((r) => r.pattern === 'pick_with_proof')
      || nicheRecipes[0];
    return {
      postId: b.id,
      currentHook: b.hook,
      currentFormat: b.format,
      labeledLikes: b.likes,
      structuralProblems: b.whyWeak.length ? b.whyWeak : ['Weak hook — no tension, record, or market read in line 1'],
      applyRecipe: targetRecipe?.pattern || 'pick_with_proof',
      rewriteSlots: targetRecipe?.recipe || nicheStructureRecipe('', 'pick_with_proof'),
    };
  });

  const growthPosts = growth?.posts || [];
  const relevantGrowthTips = pickGrowthTipsForGaps(growthPosts, gaps);

  const experiments = [];
  if (bestLabeledFmt && bestLabeledFmt[1].labeledCount >= 1) {
    experiments.push({
      id: 'format_double_down',
      priority: 1,
      hypothesis: `${bestLabeledFmt[0]} is the only format with proven labeled likes`,
      test: `Post 3x ${bestLabeledFmt[0]} this week using the same hook → proof → close order as post ${labeledAgg.bestPost}`,
      baseline: `${labeledAgg.avgLikes} avg likes (n=${labeledAgg.sampleSize})`,
      successMetric: `≥${Math.max(8, Math.ceil((bestLabeledFmt[1].avgLikes || 5) * 1.2))} avg likes on the 3-test batch`,
    });
  }
  if (primaryRecipe) {
    experiments.push({
      id: 'sharp_public_board_test',
      priority: 2,
      hypothesis: 'Market-map openers outperform pick-first cards in niche',
      test: `One post copied from ${primaryRecipe.pattern} structure: hook names slate, body is public% vs sharp$, close is verdict`,
      baseline: `${corpusAgg.pctWithSharpPublicSplit}% of current posts use this shape`,
      successMetric: 'Beats 3-like avg OR gets ≥1 RT',
    });
  }
  if (rewriteCandidates.length) {
    experiments.push({
      id: 'rewrite_weakest',
      priority: 3,
      hypothesis: 'Restructuring 0-like posts using niche recipe lifts floor',
      test: `Rewrite post ${rewriteCandidates[0].postId} using ${rewriteCandidates[0].applyRecipe} slots before reposting similar content`,
      baseline: '0 likes on original',
      successMetric: '≥3 likes on the restructured version',
    });
  }

  const brief = {
    generatedAt: new Date().toISOString(),
    handle: mine.handle || 'Real_NHL_Savant',
    dataQuality: {
      labeledPostCount: labeled.length,
      totalPostCount: rawPosts.length,
      warning: labeled.length < 8
        ? 'CRITICAL: Fewer than 8 labeled posts. Use labeledEngagement section ONLY for performance claims. Do NOT rank posts by nitterViews.'
        : null,
      rules: [
        'labeledScore = likes + 3*RTs from x.com scrape — authoritative',
        'nitterViews = view-ish stats — NEVER cite as likes or engagement',
        'Do not recommend "more emoji" unless tied to a specific niche peer comparison',
      ],
    },
    diagnosis: buildDiagnosis(labeled, nicheRecipes, formatBreakdown),
    sources: {
      myTweetsFetchedAt: mine.fetchedAt,
      nicheTrendsFetchedAt: niche?.fetchedAt || null,
      growthTipsFetchedAt: growth?.fetchedAt || null,
      growthTipsCount: growthPosts.length,
    },
    labeledEngagement: labeledAgg,
    corpusConstruction: corpusAgg,
    formatBreakdown,
    nicheBenchmark: {
      inLanePostCount: nicheInLane.length,
      aggregate: nicheAgg,
      structureRecipes: nicheRecipes,
    },
    gaps,
    topLabeledPosts: topLabeled,
    bottomLabeledPosts: bottomLabeled,
    formatMatchups,
    rewriteCandidates,
    topNicheInLane: nicheInLane.slice(0, 6).map((p) => ({
      handle: p.handle,
      pattern: p.nichePattern,
      engagement: p.engagement,
      hook: p.features?.firstLine,
      chars: p.features?.chars,
      textPreview: String(p.text || '').slice(0, 250).replace(/\n/g, ' · '),
    })),
    growthPlaybook: growthPosts.length ? {
      topTips: relevantGrowthTips.map((p) => ({
        handle: p.handle,
        topic: p.features?.topic,
        engagement: p.engagement,
        hook: p.features?.firstLine?.slice(0, 120),
        textPreview: String(p.text || '').slice(0, 200).replace(/\n/g, ' · '),
      })),
      note: 'Secondary input only — niche peer structure beats generic growth hacks',
    } : { topTips: [], note: 'No growth_tips.json — skip platform growth section in guide' },
    recommendedExperiments: experiments.sort((a, b) => a.priority - b.priority),
    agentInstructions: [
      'Open with diagnosis field — do not invent a new thesis.',
      'ALL performance numbers from labeledEngagement only (n=' + labeled.length + ').',
      'NEVER cite nitterViews as engagement.',
      'Use formatMatchups + rewriteCandidates for before/after coaching.',
      'Teach structure from nicheBenchmark.structureRecipes — line 1 / proof / close.',
      'Skip growthPlaybook section entirely if topTips is empty.',
      'Output exactly 3 post blueprints for the next slate — not generic templates.',
      'ONE experiment only — pick highest priority from recommendedExperiments.',
      'Ban: "add repost ask", "use more emoji", "post threads" unless tied to a specific peer exemplar + post ID.',
    ],
  };

  writeFileSync(join(DIR, 'improvement_brief.json'), JSON.stringify(brief, null, 2));
  console.log(`Wrote social_analysis/improvement_brief.json`);
  console.log(`  Labeled: ${labeled.length}/${rawPosts.length} · avg likes ${labeledAgg.avgLikes ?? 'n/a'}`);
  console.log(`  Niche in-lane: ${nicheInLane.length} · recipes ${nicheRecipes.length} · gaps ${gaps.length}`);
  console.log(`  Diagnosis: ${brief.diagnosis.slice(0, 120)}…`);
}

main();
