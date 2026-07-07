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
 *   refresh  — pull every logged tweet's live engagement + the follower count
 *              and store timestamped snapshots. PRIMARY source: the X API via
 *              the xurl bridge (authoritative public_metrics incl. impressions
 *              and bookmarks, one batch call). FALLBACK: Firecrawl scraping
 *              (the pre-MCP path) if the API call fails.
 *              node scripts/socialLedger.mjs refresh
 *   report   — leaderboards by structure + mechanic, best/worst posts,
 *              follower growth, experiment status.
 *              node scripts/socialLedger.mjs report
 *   analyze  — THE RATCHET (added 7/7): per-post expected-vs-actual against
 *              the account's rolling baseline (views ~24h), OVER/UNDER flags,
 *              prediction grading for posts that declared one, and a list of
 *              posts still missing a post-mortem lesson.
 *              node scripts/socialLedger.mjs analyze
 *   lesson   — attach the one-line post-mortem to a post (required for every
 *              settled post; analyze nags until it exists).
 *              node scripts/socialLedger.mjs lesson --id <tweetId> --text "..."
 *
 * Data: social_analysis/post_ledger.json  (committed — this is durable memory)
 */
import Firecrawl from '@mendable/firecrawl-js';
import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
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
    improvesOn: argVal('--improves-on'), // "<prevTweetId>: <the ONE variable changed>"
    prediction: argVal('--prediction'),  // "OVER|PAR baseline because <reason>"
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
      improvesOn: src.improvesOn || tags.improvesOn,
      prediction: src.prediction || tags.prediction,
      draft: draftPath,
      pick,
    };
  }
  if (!tags.improvesOn) console.log('⚠️  no improvesOn — the ratchet wants every post to name its predecessor and the ONE variable improved.');
  if (!tags.prediction) console.log('⚠️  no prediction — declare OVER/PAR vs baseline and why, so analyze can grade our judgment.');

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
const USER_ID = '1991513001204281345'; // @Real_NHL_Savant

// X API via the xurl OAuth bridge (token cached in ~/.xurl, auto-refreshes)
function xapi(path) {
  const out = execFileSync('npx', ['-y', '@xdevplatform/xurl', path], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120000,
  });
  return JSON.parse(out);
}

function snapshotsDue(ledger) {
  return ledger.posts.filter((post) => {
    const ageH = (Date.now() - new Date(post.postedAt).getTime()) / 36e5;
    const last = post.snapshots[post.snapshots.length - 1];
    const lastAgeH = last ? (Date.now() - new Date(last.at).getTime()) / 36e5 : Infinity;
    if (ageH > 14 * 24 && post.snapshots.length > 0) return false; // settled
    if (lastAgeH < 6) return false; // don't spam snapshots
    return true;
  });
}

function refreshViaApi(ledger) {
  const me = xapi('/2/users/me?user.fields=public_metrics');
  const followers = me?.data?.public_metrics?.followers_count;
  if (Number.isFinite(followers)) {
    ledger.followerHistory.push({ at: new Date().toISOString(), followers, source: 'x-api' });
    console.log(`Followers: ${followers} (via X API)`);
  }

  const due = snapshotsDue(ledger);
  if (!due.length) { console.log('No posts due for a snapshot.'); return { ok: 0, fail: 0 }; }

  let ok = 0, fail = 0;
  for (let i = 0; i < due.length; i += 100) {
    const batch = due.slice(i, i + 100);
    const ids = batch.map(p => p.id).join(',');
    const res = xapi(`/2/tweets?ids=${ids}&tweet.fields=public_metrics`);
    const byId = Object.fromEntries((res.data || []).map(t => [t.id, t.public_metrics]));
    for (const post of batch) {
      const m = byId[post.id];
      if (!m) { fail++; console.log(`  ${post.id}: not returned (deleted?)`); continue; }
      const ageH = (Date.now() - new Date(post.postedAt).getTime()) / 36e5;
      post.snapshots.push({
        at: new Date().toISOString(),
        hoursSincePost: +ageH.toFixed(1),
        likes: m.like_count ?? null,
        retweets: m.retweet_count ?? null,
        replies: m.reply_count ?? null,
        views: m.impression_count ?? null,
        bookmarks: m.bookmark_count ?? null,
        quotes: m.quote_count ?? null,
        source: 'x-api',
      });
      ok++;
      console.log(`  ${post.id}: ${m.like_count}❤ ${m.retweet_count}🔁 ${m.reply_count}💬 ${m.impression_count}👁 ${m.bookmark_count}🔖 (${ageH.toFixed(0)}h old)`);
    }
  }
  return { ok, fail };
}

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
  const ledger = loadLedger();

  // PRIMARY: X API (authoritative metrics, one batch call)
  try {
    const { ok, fail } = refreshViaApi(ledger);
    saveLedger(ledger);
    console.log(`\nRefreshed via X API: ${ok} ok, ${fail} failed. Ledger saved.`);
    return;
  } catch (e) {
    console.log(`X API refresh failed (${(e?.message || e).toString().slice(0, 120)}) — falling back to Firecrawl.`);
  }

  await refreshViaFirecrawl(ledger);
}

// FALLBACK: the pre-MCP Firecrawl scraping path
async function refreshViaFirecrawl(ledger) {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) { console.error('FIRECRAWL_API_KEY not set'); process.exit(1); }
  const firecrawl = new Firecrawl({ apiKey: key });
  const scrape = async (url) => {
    const res = await firecrawl.scrape(url, { formats: ['markdown'], onlyMainContent: true, waitFor: 4000, timeout: 120000 });
    return res?.markdown || res?.data?.markdown || '';
  };

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
    const days = Math.max(1, (new Date(lastF.at) - new Date(first.at)) / 864e5);
    const perDay = ((lastF.followers - first.followers) / days).toFixed(1);
    console.log(`Followers: ${first.followers} (${first.at.slice(0, 10)}) → ${lastF.followers} (${lastF.at.slice(0, 10)}) · ${perDay}/day`);
    console.log(`G0 TARGET: +50/day at steady state — current pace is ${perDay}/day. ${perDay < 5 ? 'Growth engine not yet compounding; prioritize DISTRIBUTION events (franchise 3).' : ''}`);
    // last 7 days pace
    const cutoff = Date.now() - 7 * 864e5;
    const recent = ledger.followerHistory.filter(f => new Date(f.at) >= cutoff);
    if (recent.length >= 2) {
      const rd = Math.max(0.5, (new Date(recent[recent.length - 1].at) - new Date(recent[0].at)) / 864e5);
      console.log(`Last-7d pace: ${((recent[recent.length - 1].followers - recent[0].followers) / rd).toFixed(1)}/day`);
    }
  }
  // reach layer
  const withViews = measured.filter(p => latestStats(p).views != null);
  if (withViews.length) {
    const totV = withViews.reduce((s, p) => s + latestStats(p).views, 0);
    const best = [...withViews].sort((a, b) => latestStats(b).views - latestStats(a).views)[0];
    console.log(`Reach: ${totV.toLocaleString()} total views across ${withViews.length} measured posts · best ${latestStats(best).views.toLocaleString()} ("${(best.text || '').split('\n')[0].slice(0, 50)}")`);
  }

  for (const dim of ['structure', 'mechanic']) {
    const groups = {};
    for (const p of measured) {
      const k = p[dim] || 'untagged';
      (groups[k] ||= []).push(p);
    }
    console.log(`\n── By ${dim} ──`);
    const rows = Object.entries(groups)
      .map(([k, ps]) => ({
        k, n: ps.length,
        avg: ps.reduce((s, p) => s + score(p), 0) / ps.length,
        avgViews: ps.reduce((s, p) => s + (latestStats(p).views || 0), 0) / ps.length,
      }))
      .sort((a, b) => b.avgViews - a.avgViews);
    for (const r of rows) console.log(`  ${r.k.slice(0, 38).padEnd(40)} avgViews ${Math.round(r.avgViews).toString().padStart(6)}  engScore ${r.avg.toFixed(1)}  (n=${r.n})`);
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

// ── analyze (THE RATCHET) ───────────────────────────────────────────────────
// Views at the snapshot closest to 24h (fair comparison across posts).
function viewsAt24h(post) {
  const snaps = post.snapshots.filter(s => s.views != null);
  if (!snaps.length) return null;
  return snaps.reduce((best, s) =>
    Math.abs((s.hoursSincePost ?? 999) - 24) < Math.abs((best.hoursSincePost ?? 999) - 24) ? s : best
  ).views;
}

function cmdAnalyze() {
  const ledger = loadLedger();
  const posts = [...ledger.posts]
    .filter(p => !(p.structure || '').includes('reply'))
    .sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt));
  const measured = posts.filter(p => viewsAt24h(p) != null);
  console.log(`=== RATCHET ANALYSIS — ${new Date().toISOString().slice(0, 16)}Z ===`);
  console.log('Baseline = median ~24h views of the prior 10 measured posts. OVER ≥ 1.5x · PAR · UNDER ≤ 0.6x\n');

  let baselineNow = null;
  for (let i = 0; i < measured.length; i++) {
    const p = measured[i];
    const prior = measured.slice(Math.max(0, i - 10), i).map(viewsAt24h).sort((a, b) => a - b);
    const base = prior.length >= 3 ? prior[Math.floor(prior.length / 2)] : null;
    const v = viewsAt24h(p);
    const ratio = base ? v / base : null;
    const flag = ratio == null ? '  —  ' : ratio >= 1.5 ? 'OVER ' : ratio <= 0.6 ? 'UNDER' : ' par ';
    const first = (p.text || '').split('\n')[0].slice(0, 55);
    console.log(`${flag} ${String(v).padStart(6)}v${base ? ` (${ratio.toFixed(1)}x of ${base})` : ' (no baseline yet)'} ${p.postedAt.slice(5, 10)} ${p.structure || '?'} | "${first}"`);
    if (p.prediction) console.log(`       predicted: ${p.prediction} → ${ratio == null ? 'ungradable' : (p.prediction.toUpperCase().startsWith('OVER') === (ratio >= 1.5)) ? 'CORRECT' : 'WRONG'}`);
    if (p.improvesOn) console.log(`       improved on: ${p.improvesOn}`);
    if (p.lesson) console.log(`       lesson: ${p.lesson}`);
    if (base) baselineNow = base;
  }
  if (baselineNow) console.log(`\nCURRENT BASELINE: ~${baselineNow} views in 24h. The next post's job is to beat it and to say HOW in advance.`);

  const settled = measured.filter(p => (Date.now() - new Date(p.postedAt)) / 36e5 > 24 && !p.lesson);
  if (settled.length) {
    console.log(`\n⚠️  ${settled.length} settled post(s) missing a lesson — write one line each (what worked / what to change):`);
    for (const p of settled) console.log(`   node scripts/socialLedger.mjs lesson --id ${p.id} --text "..."   ← "${(p.text || '').split('\n')[0].slice(0, 50)}"`);
  } else {
    console.log('\nAll settled posts have lessons. The ratchet is engaged.');
  }
}

function cmdLesson() {
  const id = argVal('--id'), text = argVal('--text');
  if (!id || !text) { console.error('lesson requires --id and --text'); process.exit(1); }
  const ledger = loadLedger();
  const post = ledger.posts.find(p => p.id === id);
  if (!post) { console.error(`post ${id} not in ledger`); process.exit(1); }
  post.lesson = text;
  saveLedger(ledger);
  console.log(`Lesson saved on ${id}: ${text}`);
}

// ── main ────────────────────────────────────────────────────────────────────
if (cmd === 'log') cmdLog();
else if (cmd === 'refresh') await cmdRefresh();
else if (cmd === 'report') cmdReport();
else if (cmd === 'analyze') cmdAnalyze();
else if (cmd === 'lesson') cmdLesson();
else {
  console.log('Usage: node scripts/socialLedger.mjs <log|refresh|report|analyze|lesson> [flags]');
  process.exit(1);
}
