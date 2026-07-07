/**
 * competitorIntel.mjs — pull niche leaders' recent timelines via the X API,
 * store a metrics corpus, and print a quantified pattern report.
 *
 * Usage:
 *   node scripts/competitorIntel.mjs            # refresh corpus + report
 *   node scripts/competitorIntel.mjs --report   # report from cached corpus (0 credits)
 *
 * Cost: 1 user-batch call + 1 timeline call per account (~6 calls). Run at
 * most weekly — the corpus is cached in social_analysis/competitor_corpus.json.
 */
import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CORPUS = join(__dirname, '../social_analysis/competitor_corpus.json');

const ACCOUNTS = [
  { username: 'invisiblestats', id: '1736627315075878912', note: 'data-reveal systems, 28K' },
  { username: 'PatrickE_Vegas', id: '2440926542', note: 'insider quotes, 90K' },
  { username: 'WizBetz', id: '1779716818837422080', note: 'personality + records, 24K' },
  { username: 'BookitWithTrent', id: '66287704', note: 'fade-god persona, 410K' },
  { username: 'br_betting', id: '1006968353359925248', note: 'media giant, 470K' },
];

function xapi(path) {
  const out = execFileSync('npx', ['-y', '@xdevplatform/xurl', path], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120000,
  });
  return JSON.parse(out);
}

function refresh() {
  const corpus = { refreshedAt: new Date().toISOString(), accounts: [] };
  for (const a of ACCOUNTS) {
    try {
      const d = xapi(`/2/users/${a.id}/tweets?max_results=40&exclude=retweets,replies&tweet.fields=public_metrics,created_at,attachments`);
      const tweets = (d.data || []).map(t => ({
        id: t.id,
        created_at: t.created_at,
        text: t.text,
        hasMedia: !!t.attachments,
        m: t.public_metrics,
      }));
      corpus.accounts.push({ ...a, tweets });
      console.log(`${a.username}: ${tweets.length} tweets pulled`);
    } catch (e) {
      console.log(`${a.username}: FAILED — ${(e?.message || e).toString().slice(0, 120)}`);
      corpus.accounts.push({ ...a, tweets: [], error: true });
    }
  }
  writeFileSync(CORPUS, JSON.stringify(corpus, null, 2));
  console.log(`Corpus saved → ${CORPUS}`);
  return corpus;
}

function report(corpus) {
  console.log(`\n=== COMPETITOR INTEL REPORT (corpus from ${corpus.refreshedAt.slice(0, 16)}Z) ===`);
  for (const a of corpus.accounts) {
    const ts = a.tweets || [];
    if (!ts.length) { console.log(`\n@${a.username}: no data`); continue; }
    const views = ts.map(t => t.m?.impression_count || 0).sort((x, y) => y - x);
    const med = views[Math.floor(views.length / 2)];
    const top = [...ts].sort((x, y) => (y.m?.impression_count || 0) - (x.m?.impression_count || 0)).slice(0, 3);
    const withQ = ts.filter(t => t.text.includes('?')).length;
    const withMedia = ts.filter(t => t.hasMedia).length;
    const avgLen = Math.round(ts.reduce((s, t) => s + t.text.length, 0) / ts.length);
    // posts per day
    const times = ts.map(t => new Date(t.created_at).getTime());
    const spanDays = Math.max(1, (Math.max(...times) - Math.min(...times)) / 864e5);
    console.log(`\n@${a.username} (${a.note}) — ${ts.length} posts over ${spanDays.toFixed(1)}d = ${(ts.length / spanDays).toFixed(1)}/day`);
    console.log(`  views: median ${med.toLocaleString()} · max ${views[0].toLocaleString()} · media ${Math.round(100 * withMedia / ts.length)}% · question ${Math.round(100 * withQ / ts.length)}% · avg ${avgLen} chars`);
    for (const t of top) {
      const one = t.text.replace(/\n/g, ' / ').slice(0, 110);
      console.log(`  TOP ${((t.m?.impression_count || 0)).toLocaleString().padStart(9)}v ${t.m?.reply_count}r ${t.m?.like_count}L | ${one}`);
    }
    // outlier ratio: what multiple of median is the best post (viral swings)
    console.log(`  outlier ratio (max/median): ${med ? (views[0] / med).toFixed(1) : 'n/a'}x`);
  }
  console.log('\nRead the TOP lines above like a swipe file: those are the current formats the algorithm is paying.');
}

const cached = existsSync(CORPUS) ? JSON.parse(readFileSync(CORPUS, 'utf8')) : null;
if (process.argv.includes('--report') && cached) report(cached);
else report(refresh());
