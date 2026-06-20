/**
 * analyzeMyTweets.mjs — Pull the @Real_NHL_Savant timeline via Firecrawl,
 * parse posts + engagement, and write a structured corpus the content agents
 * can study.
 *
 * Strategy:
 *   1. Scrape x.com/<handle> → labeled engagement (Likes / Retweets) on the
 *      most recent posts. This is the authoritative "what's working" signal.
 *   2. Scrape nitter mirror(s) → deeper text corpus (15-20 recent posts) for
 *      voice/format analysis. Nitter's trailing numbers are captured but
 *      treated as low-confidence (unlabeled).
 *   3. Merge by status ID, dedupe, write social_analysis/my_tweets.json.
 *
 * Usage: node scripts/analyzeMyTweets.mjs [handle]
 */
import Firecrawl from '@mendable/firecrawl-js';
import * as dotenv from 'dotenv';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
const HANDLE = process.argv[2] || 'Real_NHL_Savant';
const OUT_DIR = join(__dirname, '../social_analysis');
mkdirSync(OUT_DIR, { recursive: true });

const NITTER_INSTANCES = [
  `https://nitter.net/${HANDLE}`,
  `https://nitter.poast.org/${HANDLE}`,
  `https://lightbrd.com/${HANDLE}`,
];

const num = (s) => Number(String(s).replace(/[^0-9]/g, '')) || 0;

async function scrape(url) {
  const res = await firecrawl.scrape(url, {
    formats: ['markdown'],
    onlyMainContent: true,
    waitFor: 4000,
    timeout: 120000,
  });
  return res?.markdown || res?.data?.markdown || '';
}

/** Parse the x.com Firecrawl markdown (labeled engagement). */
function parseXCom(md) {
  const posts = [];
  // Blocks: "### N. Post\nPosted: <date>\nURL: [..](https://x.com/.../status/ID)\n> text..\nLikes: L | Retweets: R"
  const blocks = md.split(/###\s+\d+\.\s+Post/).slice(1);
  for (const b of blocks) {
    const idMatch = b.match(/status\/(\d+)/);
    const dateMatch = b.match(/Posted:\s*([^\n]+)/);
    const likeMatch = b.match(/Likes:\s*([\d,]+)/i);
    const rtMatch = b.match(/Retweets:\s*([\d,]+)/i);
    // text lines are the "> ..." quoted block
    const text = (b.match(/^>\s?.*$/gm) || [])
      .map((l) => l.replace(/^>\s?/, ''))
      .join('\n')
      .trim();
    if (!idMatch || !text) continue;
    posts.push({
      id: idMatch[1],
      date: dateMatch ? dateMatch[1].trim() : null,
      text,
      likes: likeMatch ? num(likeMatch[1]) : null,
      retweets: rtMatch ? num(rtMatch[1]) : null,
      source: 'x.com',
    });
  }
  return posts;
}

/** Parse a nitter timeline markdown into posts (deep text corpus). */
function parseNitter(md) {
  const posts = [];
  const anchorRe = /\[[^\]]+\]\(https:\/\/[^/]+\/[^/]+\/status\/(\d+)#m\s+"([^"]+)"\)/g;
  const anchors = [];
  let m;
  while ((m = anchorRe.exec(md)) !== null) {
    anchors.push({ id: m[1], dateTitle: m[2], start: m.index, end: anchorRe.lastIndex });
  }
  for (let i = 0; i < anchors.length; i++) {
    const a = anchors[i];
    const segEnd = i + 1 < anchors.length ? anchors[i + 1].start : md.length;
    let seg = md.slice(a.end, segEnd);
    // cut at the start of the next post's avatar/profile block
    const cut = seg.search(/profile_images%2F|\/pic\/profile_images/);
    if (cut > 0) seg = seg.slice(0, cut);
    const stats = [];
    const textLines = [];
    for (let line of seg.split('\n')) {
      line = line.trim();
      if (!line) continue;
      if (line.startsWith('[![](') || line.startsWith('![](')) continue; // media
      if (/^[\d,]+$/.test(line)) { stats.push(num(line)); continue; }
      if (/^\[@/.test(line) || /^\[NHL Savant/.test(line)) continue; // stray profile bits
      textLines.push(line);
    }
    const text = textLines.join('\n').trim();
    if (!text) continue;
    posts.push({
      id: a.id,
      dateTitle: a.dateTitle,
      text,
      // nitter trailing numbers: typically [replies, ... , views] — low confidence
      nitterStats: stats,
      source: 'nitter',
    });
  }
  return posts;
}

// ── Run ──────────────────────────────────────────────────────────────────────
console.log(`Analyzing @${HANDLE} ...`);

let xPosts = [];
try {
  const xmd = await scrape(`https://x.com/${HANDLE}`);
  xPosts = parseXCom(xmd);
  console.log(`x.com: parsed ${xPosts.length} posts (labeled engagement)`);
} catch (e) {
  console.log(`x.com scrape failed: ${e?.message || e}`);
}

let nitterPosts = [];
for (const url of NITTER_INSTANCES) {
  try {
    const nmd = await scrape(url);
    const parsed = parseNitter(nmd);
    if (parsed.length) {
      nitterPosts = parsed;
      console.log(`${url}: parsed ${parsed.length} posts (text corpus)`);
      break;
    }
  } catch (e) {
    console.log(`${url} failed: ${e?.message || e}`);
  }
}

// Merge by id (prefer labeled x.com engagement; fill text from either)
const byId = new Map();
for (const p of nitterPosts) byId.set(p.id, { ...p });
for (const p of xPosts) {
  const prev = byId.get(p.id) || {};
  byId.set(p.id, { ...prev, ...p, text: prev.text?.length > p.text.length ? prev.text : p.text });
}
const merged = [...byId.values()];

const out = {
  handle: HANDLE,
  fetchedAt: new Date().toISOString(),
  totalParsed: merged.length,
  withLabeledEngagement: merged.filter((p) => p.likes != null).length,
  posts: merged,
};
writeFileSync(join(OUT_DIR, 'my_tweets.json'), JSON.stringify(out, null, 2));
console.log(`\nWrote social_analysis/my_tweets.json — ${merged.length} unique posts`);

// quick console summary: top by likes (labeled) then by nitter view-ish stat
const ranked = [...merged].sort((a, b) => {
  const av = a.likes != null ? a.likes * 1000 : Math.max(...(a.nitterStats || [0]));
  const bv = b.likes != null ? b.likes * 1000 : Math.max(...(b.nitterStats || [0]));
  return bv - av;
});
console.log('\n── Top posts (best-effort engagement) ──');
for (const p of ranked.slice(0, 8)) {
  const eng = p.likes != null ? `${p.likes}❤ ${p.retweets}🔁` : `nitter:${(p.nitterStats || []).join('/')}`;
  console.log(`\n[${eng}] ${p.dateTitle || p.date || ''}`);
  console.log(p.text.slice(0, 240).replace(/\n+/g, ' / '));
}
