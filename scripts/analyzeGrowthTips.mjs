/**
 * analyzeGrowthTips.mjs — pull recent VIRAL X/Twitter growth advice via Firecrawl
 * (nitter search + growth-creator accounts). Feeds Leg 2 (Social Improvement) with
 * platform tactics beyond niche betting content.
 *
 * Config: social_analysis/growth_config.json
 * Output: social_analysis/growth_tips.json
 *
 * Usage: node scripts/analyzeGrowthTips.mjs
 */
import Firecrawl from '@mendable/firecrawl-js';
import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });
const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

const DIR = join(__dirname, '../social_analysis');
mkdirSync(DIR, { recursive: true });
const cfg = JSON.parse(readFileSync(join(DIR, 'growth_config.json'), 'utf8'));

const INSTANCES = ['https://nitter.net', 'https://nitter.poast.org', 'https://lightbrd.com'];

const num = (s) => Number(String(s).replace(/[^0-9]/g, '')) || 0;
const EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u;

async function scrape(url) {
  const res = await firecrawl.scrape(url, {
    formats: ['markdown'], onlyMainContent: true, waitFor: 5000, timeout: 120000,
  });
  return res?.markdown || res?.data?.markdown || '';
}

function parsePosts(md) {
  const posts = [];
  const re = /\[[^\]]*\]\(https:\/\/[^/]+\/([^/]+)\/status\/(\d+)#m\s+"([^"]+)"\)/g;
  const anchors = [];
  let m;
  while ((m = re.exec(md)) !== null) {
    anchors.push({ handle: m[1], id: m[2], dateTitle: m[3], start: m.index, end: re.lastIndex });
  }
  for (let i = 0; i < anchors.length; i++) {
    const a = anchors[i];
    const segEnd = i + 1 < anchors.length ? anchors[i + 1].start : md.length;
    let seg = md.slice(a.end, segEnd);
    const cut = seg.search(/profile_images%2F|\/pic\/profile_images/);
    if (cut > 0) seg = seg.slice(0, cut);
    const stats = [];
    const textLines = [];
    for (let line of seg.split('\n')) {
      line = line.trim();
      if (!line) continue;
      if (line.startsWith('[![](') || line.startsWith('![](')) continue;
      if (/^[\d,]+$/.test(line)) { stats.push(num(line)); continue; }
      if (/^\[@/.test(line) || /retweeted$/.test(line) || /^\[[^\]]+\]\(https:\/\/[^/]+\/[^/]+ "/.test(line)) continue;
      textLines.push(line);
    }
    let text = textLines.join('\n').trim();
    if (/^\[?\s*(https?:\/\/|x\.com\/i\/|t\.co\/)/i.test(text)) continue;
    if (!text || text.length < 20) continue;
    posts.push({
      handle: a.handle,
      id: a.id,
      dateTitle: a.dateTitle,
      text,
      engagement: stats.length ? Math.max(...stats) : 0,
      stats,
    });
  }
  return posts;
}

// ── relevance guard: nitter search returns lots of foreign-language "tips"
// (Indonesian/Malay K-pop AU/RP fandom posts where "main X" = "use Twitter",
// "thread" = an AU thread). Those match our loose requireAny ("tip","thread",
// "post") and poison the growth corpus. Gate on real English advice. ──
const EN_STOPWORDS = ['the', 'and', 'you', 'your', 'for', 'with', 'this', 'that',
  'how', 'why', 'what', 'when', 'are', 'is', 'to', 'of', 'on', 'in', 'a', 'i',
  'it', 'they', 'we', 'if', 'but', 'not', 'get', 'make', 'will', 'can', 'do'];

// Fandom / roleplay / non-English-market markers — if present, almost never
// real growth advice for a sports-betting account.
const FANDOM_BLOCK = [
  ' au ', 'au ', ' rp ', 'roleplay', 'role play', 'pretest', 'reread', 'panel',
  'menfess', 'mutuals', ' moots', 'fanbase', 'fan account', 'kpop', 'k-pop',
  'idol', ' bias', 'comeback stage', 'fess', ' wts', ' wtb', ' wtt', ' ph ',
  ' ina ', ' nder', 'rt ya', 'rbf', 'slow respon', 'fast respon',
  // common Indonesian/Malay tokens that flag non-English posts
  ' yang ', ' yg ', ' kalau ', ' dgn ', ' dengan ', ' banget', ' bgt', ' aku ',
  ' kamu ', ' tapi ', ' bisa ', ' dicoba', ' keren', ' lolos', ' main x',
];

/** Is this post primarily English advice (vs foreign-fandom noise)? */
function isEnglishAdvice(text) {
  const t = ` ${text.toLowerCase().replace(/\s+/g, ' ')} `;
  if (FANDOM_BLOCK.some((b) => t.includes(b))) return false;
  // latin-script majority (reject heavy non-latin content)
  const letters = (text.match(/\p{L}/gu) || []).length;
  const latin = (text.match(/[a-z]/gi) || []).length;
  if (letters > 0 && latin / letters < 0.85) return false;
  // require a minimum density of common English function words
  const words = t.split(' ').filter(Boolean);
  const hits = words.filter((w) => EN_STOPWORDS.includes(w)).length;
  return hits >= 3;
}

function classifyTopic(text) {
  const t = text.toLowerCase();
  if (/algorithm|for you|timeline|ranking|distribution|impression|reach|fyp/.test(t)) return 'algorithm';
  if (/hook|opener|first line|headline|scroll.?stop|pattern interrupt/.test(t)) return 'hooks';
  if (/thread|🧵|1\/|1\.|numbered|carousel/.test(t)) return 'threads';
  if (/retweet|quote tweet|shareable|screenshot|bookmark|repost/.test(t)) return 'shareability';
  if (/reply|comment|conversation|engage|engagement|like back|community/.test(t)) return 'engagement';
  if (/time to post|posting time|schedule|frequency|consistency|daily|cadence/.test(t)) return 'timing';
  if (/bio|profile|pinned|header|link in|follower|follow back/.test(t)) return 'profile';
  if (/cta|call to action|question|poll|binary choice|vote/.test(t)) return 'cta';
  return 'general';
}

function features(text) {
  const lines = text.split('\n').filter(Boolean);
  const t = text.toLowerCase();
  return {
    chars: text.length,
    lines: lines.length,
    hasEmoji: EMOJI_RE.test(text),
    hasNumberedList: /^\s*\d+[\.)]\s/m.test(text) || /\n\d+[\.)]\s/.test(text),
    hasBulletList: /^[\-•]\s/m.test(text) || /\n[\-•]\s/.test(text),
    isThreadShaped: lines.length >= 5 || /🧵|thread/i.test(text),
    hasActionVerbs: /\b(do|stop|start|post|write|ask|reply|test|try|avoid|never|always)\b/i.test(text),
    hasMetrics: /\d+%|\d+k|\d+ (followers|impressions|likes|retweets)/i.test(text),
    topic: classifyTopic(text),
    firstLine: lines[0] || '',
  };
}

async function pullFromInstances(pathBuilder) {
  for (const base of INSTANCES) {
    try {
      const md = await scrape(pathBuilder(base));
      const posts = parsePosts(md);
      if (posts.length) return posts;
    } catch { /* try next instance */ }
  }
  return [];
}

console.log('Pulling growth tips...');
const all = new Map();

for (const q of cfg.searches || []) {
  const enc = encodeURIComponent(q);
  const posts = await pullFromInstances((b) => `${b}/search?f=tweets&q=${enc}`);
  console.log(`search "${q}": ${posts.length} posts`);
  for (const p of posts.slice(0, cfg.maxPerSource || 15)) {
    p.source = `search:${q}`;
    if (!all.has(p.id)) all.set(p.id, p);
  }
}

for (const handle of cfg.accounts || []) {
  const posts = await pullFromInstances((b) => `${b}/${handle}`);
  console.log(`@${handle}: ${posts.length} posts`);
  for (const p of posts.slice(0, cfg.maxPerSource || 15)) {
    p.source = `account:${handle}`;
    if (!all.has(p.id)) all.set(p.id, p);
  }
}

const requireAny = (cfg.requireAny || []).map((s) => s.toLowerCase());
const exclude = (cfg.exclude || []).map((s) => s.toLowerCase());
const passesFilter = (text) => {
  const t = text.toLowerCase();
  if (!isEnglishAdvice(text)) return false;
  if (exclude.some((x) => t.includes(x))) return false;
  if (requireAny.length && !requireAny.some((r) => t.includes(r))) return false;
  return true;
};

const rawCandidates = [...all.values()];
const droppedNonEnglish = rawCandidates.filter((p) => !isEnglishAdvice(p.text)).length;
let posts = rawCandidates
  .filter((p) => p.engagement >= (cfg.minEngagement || 0))
  .filter((p) => passesFilter(p.text))
  .map((p) => ({ ...p, features: features(p.text) }))
  .sort((a, b) => b.engagement - a.engagement);
console.log(`Relevance gate: ${rawCandidates.length} raw → dropped ${droppedNonEnglish} non-English/fandom → ${posts.length} kept`);

const topicCounts = {};
for (const p of posts) {
  const topic = p.features.topic;
  topicCounts[topic] = (topicCounts[topic] || 0) + 1;
}

const out = {
  fetchedAt: new Date().toISOString(),
  config: { searches: cfg.searches, accounts: cfg.accounts, minEngagement: cfg.minEngagement },
  totalTips: posts.length,
  relevanceGate: { rawCandidates: rawCandidates.length, droppedNonEnglish, kept: posts.length },
  topicBreakdown: topicCounts,
  aggregate: {
    pctWithEmoji: posts.length ? +(posts.filter((p) => p.features.hasEmoji).length / posts.length * 100).toFixed(0) : 0,
    pctNumberedList: posts.length ? +(posts.filter((p) => p.features.hasNumberedList).length / posts.length * 100).toFixed(0) : 0,
    pctThreadShaped: posts.length ? +(posts.filter((p) => p.features.isThreadShaped).length / posts.length * 100).toFixed(0) : 0,
    pctWithMetrics: posts.length ? +(posts.filter((p) => p.features.hasMetrics).length / posts.length * 100).toFixed(0) : 0,
    avgChars: posts.length ? Math.round(posts.reduce((s, p) => s + p.features.chars, 0) / posts.length) : 0,
  },
  posts: posts.slice(0, 40),
};

writeFileSync(join(DIR, 'growth_tips.json'), JSON.stringify(out, null, 2));
console.log(`\nWrote social_analysis/growth_tips.json — ${posts.length} growth tips`);
console.log('Topics:', topicCounts);
console.log('\n── Top 5 growth tips ──');
for (const p of posts.slice(0, 5)) {
  console.log(`\n[${p.engagement} eng | ${p.features.topic} | @${p.handle}] ${p.features.firstLine.slice(0, 90)}`);
}
