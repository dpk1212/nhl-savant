/**
 * socialLedger.mjs — the memory of the Twitter system.
 *
 * Every tweet we actually post gets logged here with its creative DNA
 * (structure, mechanic, hook) and then re-measured over time via Firecrawl.
 * This is what makes the self-improvement loop real: after a few weeks the
 * report answers "which structures/mechanics actually grow us" with data.
 *
 * Commands:
 *   log      — record a posted tweet
 *              node scripts/socialLedger.mjs log --url https://x.com/Real_NHL_Savant/status/123 \
 *                [--draft ready_to_post/2026-07-06_0915.json --pick hero] \
 *                [--structure confession-flex --mechanic polarizing-question --note "..."]
 *              With --draft, tags (structure/mechanic/refTag/rtLine) are copied
 *              from the draft JSON (--pick hero | alt1 | alt2...).
 *   refresh  — Firecrawl-scrape every logged tweet's live engagement and the
 *              profile follower count; store timestamped snapshots.
 *              node scripts/socialLedger.mjs refresh
 *   report   — leaderboards by structure + mechanic, best/worst posts,
 *              follower growth, experiment status.
 *              node scripts/socialLedger.mjs report
 *
 * Data: social_analysis/post_ledger.json  (committed — this is durable memory)
 */
import Firecrawl from '@mendable/firecrawl-js';
import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const HANDLE = 'Real_NHL_Savant';
const LEDGER_PATH = join(__dirname, '../social_analysis/post_ledger.json');
const EXPERIMENTS_PATH = join(__dirname, '../social_analysis/experiments.json');

const loadLedger = () => existsSync(LEDGER_PATH)
  ? JSON.parse(readFileSync(LEDGER_PATH, 'utf8'))
  : { handle: HANDLE, posts: [], followerHistory: [] };
const saveLedger = (l) => writeFileSync(LEDGER_PATH, JSON.stringify(l, null, 2));

const args = process.argv.slice(2);
const cmd = args[0];
const argVal = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
};
const num = (s) => {
  if (s == null) return null;
  const str = String(s).trim().toUpperCase();
  const mult = str.endsWith('K') ? 1e3 : str.endsWith('M') ? 1e6 : 1;
  const n = parseFloat(str.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? Math.round(n * mult) : null;
};

// ── log ─────────────────────────────────────────────────────────────────────
function cmdLog() {
  const url = argVal('--url');
  if (!url) { console.error('log requires --url'); process.exit(1); }
  const idMatch = url.match(/status\/(\d+)/);
  if (!idMatch) { console.error('URL must contain /status/<id>'); process.exit(1); }
  const id = idMatch[1];

  const ledger = loadLedger();
  if (ledger.posts.some(p => p.id === id)) { console.log(`Already logged: ${id}`); return; }

  let tags = {
    structure: argVal('--structure'),
    mechanic: argVal('--mechanic'),
    refTag: argVal('--ref'),
    rtLine: null,
    slot: argVal('--slot'),
    text: null,
  };
  const draftPath = argVal('--draft');
  if (draftPath) {
    const draft = JSON.parse(readFileSync(join(__dirname, '..', draftPath), 'utf8'));
    const pick = argVal('--pick') || 'hero';
    const src = pick === 'hero' ? draft.hero : (draft.alternates || [])[parseInt(pick.replace('alt', ''), 10) - 1];
    if (!src) { console.error(`--pick ${pick} not found in ${draftPath}`); process.exit(1); }
    tags = {
      structure: src.structure || tags.structure,
      mechanic: src.mechanic || tags.mechanic,
      refTag: src.refTag || tags.refTag,
      rtLine: src.rtLine || null,
      slot: draft.slot || tags.slot,
      text: src.text || null,
      draft: draftPath,
      pick,
    };
  }

  ledger.posts.push({
    id, url,
    postedAt: argVal('--posted-at') || new Date().toISOString(),
    loggedAt: new Date().toISOString(),
    note: argVal('--note') || null,
    ...tags,
    snapshots: [],
  });
  saveLedger(ledger);
  console.log(`Logged ${id}  structure=${tags.structure}  mechanic=${tags.mechanic}  ref=${tags.refTag}`);
  console.log(`Ledger now has ${ledger.posts.length} posts. Run 'refresh' in ~24h to capture engagement.`);
}

// ── refresh ─────────────────────────────────────────────────────────────────
function parseStatusPage(md) {
  // x.com single-status pages via Firecrawl typically carry
  // "Likes: N | Retweets: N" and sometimes Replies / Views / Bookmarks.
  const get = (re) => { const m = md.match(re); return m ? num(m[1]) : null; };
  return {
    likes: get(/Likes:\s*([\d,.KM]+)/i),
    retweets: get(/Retweets?:\s*([\d,.KM]+)/i),
    replies: get(/Repl(?:ies|y)[:\s]*([\d,.KM]+)/i),
    views: get(/Views?:\s*([\d,.KM]+)/i),
    bookmarks: get(/Bookmarks?:\s*([\d,.KM]+)/i),
  };
}

async function cmdRefresh() {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) { console.error('FIRECRAWL_API_KEY not set'); process.exit(1); }
  const firecrawl = new Firecrawl({ apiKey: key });
  const scrape = async (url) => {
    const res = await firecrawl.scrape(url, { formats: ['markdown'], onlyMainContent: true, waitFor: 4000, timeout: 120000 });
    return res?.markdown || res?.data?.markdown || '';
  };

  const ledger = loadLedger();

  // follower count — nitter renders it reliably ("Followers2,007"); x.com fallback
  let gotFollowers = false;
  for (const url of [`https://nitter.net/${HANDLE}`, `https://nitter.poast.org/${HANDLE}`, `https://x.com/${HANDLE}`]) {
    try {
      const md = await scrape(url);
      const fm = md.match(/Followers\s*([\d,.]+[KM]?)/i) || md.match(/([\d,.]+[KM]?)\s*Followers/i);
      if (fm) {
        const followers = num(fm[1]);
        ledger.followerHistory.push({ at: new Date().toISOString(), followers, source: new URL(url).hostname });
        console.log(`Followers: ${followers} (via ${new URL(url).hostname})`);
        gotFollowers = true;
        break;
      }
    } catch (e) { /* try next source */ }
  }
  if (!gotFollowers) console.log('Followers: not found this run');

  let ok = 0, fail = 0;
  for (const post of ledger.posts) {
    const ageH = (Date.now() - new Date(post.postedAt).getTime()) / 36e5;
    // stop re-measuring after 14 days — engagement is settled
    const last = post.snapshots[post.snapshots.length - 1];
    const lastAgeH = last ? (Date.now() - new Date(last.at).getTime()) / 36e5 : Infinity;
    if (ageH > 14 * 24 && post.snapshots.length > 0) continue;
    if (lastAgeH < 6) continue; // don't spam snapshots
    try {
      const md = await scrape(post.url);
      const stats = parseStatusPage(md);
      if (stats.likes == null && stats.retweets == null) { fail++; console.log(`  ${post.id}: no labeled stats parsed`); continue; }
      post.snapshots.push({ at: new Date().toISOString(), hoursSincePost: +ageH.toFixed(1), ...stats });
      ok++;
      console.log(`  ${post.id}: ${stats.likes ?? '?'}❤ ${stats.retweets ?? '?'}🔁 ${stats.replies ?? '?'}💬 ${stats.views ?? '?'}👁 (${ageH.toFixed(0)}h old)`);
    } catch (e) { fail++; console.log(`  ${post.id}: scrape failed — ${e?.message || e}`); }
  }
  saveLedger(ledger);
  console.log(`\nRefreshed: ${ok} ok, ${fail} failed. Ledger saved.`);
}

// ── report ──────────────────────────────────────────────────────────────────
function latestStats(post) {
  return post.snapshots[post.snapshots.length - 1] || null;
}
function score(post) {
  const s = latestStats(post);
  if (!s) return null;
  // replies are the algo's 27x signal; RTs are distribution; likes baseline
  return (s.likes ?? 0) + 3 * (s.retweets ?? 0) + 5 * (s.replies ?? 0);
}

function cmdReport() {
  const ledger = loadLedger();
  const measured = ledger.posts.filter(p => latestStats(p));
  console.log(`=== POST LEDGER REPORT — ${new Date().toISOString().slice(0, 16)}Z ===`);
  console.log(`Posts logged: ${ledger.posts.length} · measured: ${measured.length}`);
  if (measured.length < 8) console.log('⚠️  n < 8 — treat every conclusion below as DIRECTIONAL, not statistical.');

  if (ledger.followerHistory.length) {
    const first = ledger.followerHistory[0], lastF = ledger.followerHistory[ledger.followerHistory.length - 1];
    console.log(`Followers: ${first.followers} (${first.at.slice(0, 10)}) → ${lastF.followers} (${lastF.at.slice(0, 10)})`);
  }

  for (const dim of ['structure', 'mechanic']) {
    const groups = {};
    for (const p of measured) {
      const k = p[dim] || 'untagged';
      (groups[k] ||= []).push(p);
    }
    console.log(`\n── By ${dim} ──`);
    const rows = Object.entries(groups)
      .map(([k, ps]) => ({ k, n: ps.length, avg: ps.reduce((s, p) => s + score(p), 0) / ps.length }))
      .sort((a, b) => b.avg - a.avg);
    for (const r of rows) console.log(`  ${r.k.padEnd(28)} avgScore ${r.avg.toFixed(1)}  (n=${r.n})`);
  }

  const ranked = [...measured].sort((a, b) => score(b) - score(a));
  console.log('\n── Top 5 ──');
  for (const p of ranked.slice(0, 5)) {
    const s = latestStats(p);
    console.log(`  [${score(p)}] ${p.structure || '?'} / ${p.mechanic || '?'} — ${s.likes ?? 0}❤ ${s.retweets ?? 0}🔁 ${s.replies ?? '?'}💬 — "${(p.text || '').split('\n')[0].slice(0, 70)}"`);
  }
  console.log('\n── Bottom 3 ──');
  for (const p of ranked.slice(-3).reverse()) {
    const s = latestStats(p);
    console.log(`  [${score(p)}] ${p.structure || '?'} / ${p.mechanic || '?'} — ${s.likes ?? 0}❤ ${s.retweets ?? 0}🔁 — "${(p.text || '').split('\n')[0].slice(0, 70)}"`);
  }

  if (existsSync(EXPERIMENTS_PATH)) {
    const ex = JSON.parse(readFileSync(EXPERIMENTS_PATH, 'utf8'));
    console.log('\n── Experiments ──');
    for (const e of ex.experiments) {
      console.log(`  [${e.status.toUpperCase()}] ${e.id}: ${e.hypothesis}${e.verdict ? ` → ${e.verdict}` : ''}`);
    }
  }
  console.log('\nScore = likes + 3·RTs + 5·replies (replies are the 2026 algo currency).');
}

// ── main ────────────────────────────────────────────────────────────────────
if (cmd === 'log') cmdLog();
else if (cmd === 'refresh') await cmdRefresh();
else if (cmd === 'report') cmdReport();
else {
  console.log('Usage: node scripts/socialLedger.mjs <log|refresh|report> [flags]');
  process.exit(1);
}
