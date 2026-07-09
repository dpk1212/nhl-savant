#!/usr/bin/env node
/**
 * growthPulse.mjs — the self-improvement pulse for the Twitter loop.
 *
 * Pulls our recent heroes + outbound replies via xurl, scores them against
 * a rolling baseline, and writes a machine-readable pulse the next draft
 * MUST improve on. Never publishes. Never invents numbers.
 *
 * Usage:
 *   node scripts/growthPulse.mjs
 *   node scripts/growthPulse.mjs --save   # write twitter_drafts/growth_pulse.json
 *
 * Metrics that matter for OUR funnel (from TWITTER.md):
 *   impressions (reach) · replies (algo currency) · profile clicks (funnel)
 *   outbound-reply impressions (growth engine) · follower delta (north star)
 */
import { execFileSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const USER_ID = '1991513001204281345';
const save = process.argv.includes('--save');

function xurl(path) {
  const out = execFileSync('npx', ['-y', '@xdevplatform/xurl', path], {
    encoding: 'utf8',
    timeout: 90000,
    cwd: root,
  });
  return JSON.parse(out);
}

function median(nums) {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function classify(impr, baseline) {
  if (!baseline) return '—';
  const r = impr / baseline;
  if (r >= 1.5) return 'OVER';
  if (r <= 0.6) return 'UNDER';
  return 'PAR';
}

console.log('='.repeat(64));
console.log('GROWTH PULSE — virality + engagement self-improvement');
console.log('='.repeat(64));

let me;
try {
  me = xurl('/2/users/me?user.fields=public_metrics').data;
} catch (e) {
  console.error('FAILED get_users_me:', e.message?.slice(0, 120));
  process.exit(1);
}
const followers = me.public_metrics?.followers_count ?? 0;

let posts = [];
try {
  const d = xurl(
    `/2/users/${USER_ID}/tweets?max_results=30&tweet.fields=created_at,public_metrics,non_public_metrics,referenced_tweets&expansions=referenced_tweets.id`
  );
  posts = d.data || [];
} catch (e) {
  console.error('FAILED get posts:', e.message?.slice(0, 120));
  process.exit(1);
}

const heroes = [];
const outbound = [];
for (const p of posts) {
  const refs = p.referenced_tweets || [];
  const isReply = refs.some((r) => r.type === 'replied_to');
  const isQuote = refs.some((r) => r.type === 'quoted');
  const row = {
    id: p.id,
    created_at: p.created_at,
    text: (p.text || '').replace(/\n/g, ' ').slice(0, 90),
    impressions: p.public_metrics?.impression_count ?? 0,
    likes: p.public_metrics?.like_count ?? 0,
    replies: p.public_metrics?.reply_count ?? 0,
    reposts: p.public_metrics?.retweet_count ?? 0,
    quotes: p.public_metrics?.quote_count ?? 0,
    bookmarks: p.public_metrics?.bookmark_count ?? 0,
    profile_clicks: p.non_public_metrics?.user_profile_clicks ?? 0,
    link_clicks: p.non_public_metrics?.url_link_clicks ?? 0,
    engagements: p.non_public_metrics?.engagements ?? 0,
    kind: isReply ? 'outbound_reply' : isQuote ? 'quote' : 'hero',
  };
  // engScore: replies are the 2026 currency
  row.engScore = row.likes + 3 * row.reposts + 5 * row.replies + 2 * row.quotes + row.bookmarks;
  if (isReply) outbound.push(row);
  else heroes.push(row);
}

const heroImprs = heroes.map((h) => h.impressions).filter((n) => n > 0);
const baseline = median(heroImprs.slice(0, 10));
const outboundImprs = outbound.map((o) => o.impressions).filter((n) => n > 0);
const outboundBaseline = median(outboundImprs.slice(0, 10));

// prior pulse for follower delta
const pulsePath = join(root, 'twitter_drafts', 'growth_pulse.json');
let prevFollowers = null;
if (existsSync(pulsePath)) {
  try {
    prevFollowers = JSON.parse(readFileSync(pulsePath, 'utf8')).followers;
  } catch { /* ignore */ }
}
const followerDelta = prevFollowers != null ? followers - prevFollowers : null;

console.log(`\nFollowers: ${followers}${followerDelta != null ? ` (${followerDelta >= 0 ? '+' : ''}${followerDelta} since last pulse)` : ''}`);
console.log(`Hero baseline (median last ≤10): ${Math.round(baseline)} impr`);
console.log(`Outbound-reply baseline: ${Math.round(outboundBaseline)} impr`);
console.log(`\n── HEROES (newest first) ──`);
for (const h of heroes.slice(0, 8)) {
  const tag = classify(h.impressions, baseline);
  console.log(
    `${tag.padEnd(5)} ${String(h.impressions).padStart(5)}v  ${h.replies}r  ${h.engScore}eng  pc:${h.profile_clicks}  | ${h.kind} | ${h.text}`
  );
}
console.log(`\n── OUTBOUND REPLIES (growth engine) ──`);
if (!outbound.length) console.log('(none in last 30 posts)');
for (const o of outbound.slice(0, 8)) {
  const tag = classify(o.impressions, outboundBaseline || baseline);
  console.log(
    `${tag.padEnd(5)} ${String(o.impressions).padStart(5)}v  ${o.replies}r  ${o.engScore}eng  pc:${o.profile_clicks}  | ${o.text}`
  );
}

const overs = heroes.filter((h) => classify(h.impressions, baseline) === 'OVER');
const unders = heroes.filter((h) => classify(h.impressions, baseline) === 'UNDER');
const bestOutbound = [...outbound].sort((a, b) => b.impressions - a.impressions)[0];
const bestHero = [...heroes].sort((a, b) => b.impressions - a.impressions)[0];
const bestEng = [...heroes, ...outbound].sort((a, b) => b.engScore - a.engScore)[0];

console.log(`\n── RATCHET (next draft MUST use this) ──`);
console.log(`DOUBLE DOWN: ${overs.length ? overs.map((h) => `"${h.text.slice(0, 50)}…"`).join(' · ') : '(no OVER heroes — raise the bar or ship distribution)'}`);
console.log(`KILL / AVOID: ${unders.length ? unders.map((h) => `"${h.text.slice(0, 50)}…"`).join(' · ') : '(none UNDER)'}`);
if (bestOutbound) console.log(`BEST OUTBOUND: ${bestOutbound.impressions}v — "${bestOutbound.text}"`);
if (bestHero) console.log(`BEST HERO: ${bestHero.impressions}v — "${bestHero.text}"`);
if (bestEng) console.log(`BEST ENGAGEMENT: score ${bestEng.engScore} — "${bestEng.text}"`);

const nextBet = {
  content: overs[0]
    ? `Improve on OVER shape: one variable change from "${overs[0].text.slice(0, 60)}"`
    : bestHero
      ? `Beat ${bestHero.impressions}v hero — name the one variable you are changing`
      : 'Ship a decision-window or proprietary-anomaly hero',
  distribution: bestOutbound && bestOutbound.impressions >= 500
    ? `Repeat outbound pattern that did ${bestOutbound.impressions}v (high-velocity parent + proprietary receipt)`
    : 'Land 3–6 outbound replies on <60min niche posts with wallet/$ data',
  funnel: 'Profile clicks > link clicks. Link only in self-reply. Refresh pin if stale.',
};

console.log(`\nNEXT BET — content: ${nextBet.content}`);
console.log(`NEXT BET — distribution: ${nextBet.distribution}`);
console.log(`NEXT BET — funnel: ${nextBet.funnel}`);

const pulse = {
  savedAt: new Date().toISOString(),
  followers,
  followerDelta,
  baselines: { heroImpressions: baseline, outboundImpressions: outboundBaseline },
  heroes: heroes.slice(0, 12),
  outbound: outbound.slice(0, 12),
  overs: overs.map((h) => h.id),
  unders: unders.map((h) => h.id),
  bestHeroId: bestHero?.id ?? null,
  bestOutboundId: bestOutbound?.id ?? null,
  bestEngId: bestEng?.id ?? null,
  nextBet,
};

if (save) {
  const dir = join(root, 'twitter_drafts');
  mkdirSync(dir, { recursive: true });
  writeFileSync(pulsePath, JSON.stringify(pulse, null, 2) + '\n');
  console.log(`\nWrote twitter_drafts/growth_pulse.json`);
}

console.log('\nDone. Drafts this run must name improvesOn + prediction against this pulse.');
