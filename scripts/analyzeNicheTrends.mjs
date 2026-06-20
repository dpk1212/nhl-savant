/**
 * analyzeNicheTrends.mjs — pull VIRAL posts from the sports-betting / sharp-money
 * niche via Firecrawl (nitter search + peer accounts), rank by engagement, and
 * extract light construction patterns. Output feeds the Social Loop agent so it
 * can study what's trending and how the viral posts are built.
 *
 * Config: social_analysis/niche_config.json (searches, accounts, thresholds).
 * Output: social_analysis/niche_trends.json
 *
 * Usage: node scripts/analyzeNicheTrends.mjs
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
const cfg = JSON.parse(readFileSync(join(DIR, 'niche_config.json'), 'utf8'));

// nitter instances to try (first that returns content wins per target)
const INSTANCES = ['https://nitter.net', 'https://nitter.poast.org', 'https://lightbrd.com'];

const num = (s) => Number(String(s).replace(/[^0-9]/g, '')) || 0;
const EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u;

async function scrape(url) {
  const res = await firecrawl.scrape(url, {
    formats: ['markdown'], onlyMainContent: true, waitFor: 5000, timeout: 120000,
  });
  return res?.markdown || res?.data?.markdown || '';
}

/** Parse any nitter timeline/search markdown into posts with author + stats. */
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
    // drop article/link-card entries whose "text" is basically just a URL
    if (/^\[?\s*(https?:\/\/|x\.com\/i\/|t\.co\/)/i.test(text)) continue;
    if (!text || text.length < 15) continue;
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

/** Light construction signals so the agent can spot patterns fast. */
function features(text) {
  const lines = text.split('\n').filter(Boolean);
  return {
    chars: text.length,
    lines: lines.length,
    hasEmoji: EMOJI_RE.test(text),
    hasQuestion: /\?\s*$/.test(text.trim()) || /\?/.test(lines[lines.length - 1] || ''),
    hasNumbers: /\$[\d,]+|\d+%|\d+u\b|[-+]\d{3}/.test(text),
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

// ── Run ──────────────────────────────────────────────────────────────────────
console.log('Pulling niche trends...');
const all = new Map(); // id -> post

for (const q of cfg.searches || []) {
  const enc = encodeURIComponent(q);
  const posts = await pullFromInstances((b) => `${b}/search?f=tweets&q=${enc}`);
  console.log(`search "${q}": ${posts.length} posts`);
  for (const p of posts.slice(0, cfg.maxPerSource || 20)) {
    p.source = `search:${q}`;
    if (!all.has(p.id)) all.set(p.id, p);
  }
}

for (const handle of cfg.accounts || []) {
  const posts = await pullFromInstances((b) => `${b}/${handle}`);
  console.log(`@${handle}: ${posts.length} posts`);
  for (const p of posts.slice(0, cfg.maxPerSource || 20)) {
    p.source = `account:${handle}`;
    if (!all.has(p.id)) all.set(p.id, p);
  }
}

const requireAny = (cfg.requireAny || []).map((s) => s.toLowerCase());
const exclude = (cfg.exclude || []).map((s) => s.toLowerCase());
const passesNiche = (text) => {
  const t = text.toLowerCase();
  if (exclude.some((x) => t.includes(x))) return false;
  if (requireAny.length && !requireAny.some((r) => t.includes(r))) return false;
  return true;
};

let posts = [...all.values()]
  .filter((p) => p.engagement >= (cfg.minEngagement || 0))
  .filter((p) => passesNiche(p.text))
  .map((p) => ({ ...p, features: features(p.text) }))
  .sort((a, b) => b.engagement - a.engagement);

const out = {
  fetchedAt: new Date().toISOString(),
  config: { searches: cfg.searches, accounts: cfg.accounts, minEngagement: cfg.minEngagement },
  totalViralPosts: posts.length,
  aggregate: {
    pctWithEmoji: posts.length ? +(posts.filter((p) => p.features.hasEmoji).length / posts.length * 100).toFixed(0) : 0,
    pctWithQuestion: posts.length ? +(posts.filter((p) => p.features.hasQuestion).length / posts.length * 100).toFixed(0) : 0,
    pctWithNumbers: posts.length ? +(posts.filter((p) => p.features.hasNumbers).length / posts.length * 100).toFixed(0) : 0,
    avgChars: posts.length ? Math.round(posts.reduce((s, p) => s + p.features.chars, 0) / posts.length) : 0,
  },
  posts: posts.slice(0, 60),
};
writeFileSync(join(DIR, 'niche_trends.json'), JSON.stringify(out, null, 2));
console.log(`\nWrote social_analysis/niche_trends.json — ${posts.length} viral posts`);
console.log('Aggregate:', out.aggregate);
console.log('\n── Top 6 viral posts in niche ──');
for (const p of posts.slice(0, 6)) {
  console.log(`\n[${p.engagement} eng | @${p.handle}] ${p.features.firstLine.slice(0, 80)}`);
}
