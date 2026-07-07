/**
 * socialBrief.mjs — the one-command data brief for the Twitter Loop.
 *
 * Runs everything Phase 0 needs and prints a single combined brief:
 *   1. verified records (yesterday · last 7d · since June 1)
 *   2. today's board, time-bucketed
 *   3. ledger refresh (X API metrics + followers) and report
 *   4. unanswered mentions (inbound gold)
 *
 * Usage: node scripts/socialBrief.mjs
 * (git pull first — the picks file updates hourly.)
 */
import { execSync, execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const USER_ID = '1991513001204281345';

const run = (label, cmd) => {
  console.log(`\n${'='.repeat(70)}\n${label}\n${'='.repeat(70)}`);
  try {
    console.log(execSync(cmd, { cwd: root, encoding: 'utf8', timeout: 180000 }));
  } catch (e) {
    console.log(`FAILED: ${(e?.message || e).toString().slice(0, 200)}`);
  }
};

const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const yesterday = new Date(Date.now() - 864e5).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const d7 = new Date(Date.now() - 7 * 864e5).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
console.log(`SOCIAL BRIEF — ${nowET} ET`);

run('RECORDS · yesterday', `node scripts/socialRecords.mjs --from ${yesterday} --to ${yesterday}`);
run('RECORDS · last 7 days', `node scripts/socialRecords.mjs --from ${d7}`);
run('RECORDS · since June 1', 'node scripts/socialRecords.mjs --from 2026-06-01');
run('BOARD · today (run exportTodaysPicks first if stale)', 'node scripts/socialBoard.mjs');
run('LEDGER · refresh (X API)', 'node scripts/socialLedger.mjs refresh');
run('LEDGER · report', 'node scripts/socialLedger.mjs report');
run('LEDGER · ratchet analysis', 'node scripts/socialLedger.mjs analyze');
run('COMPETITOR INTEL (cached, free)', 'node scripts/competitorIntel.mjs --report');

// mentions — inbound gold
console.log(`\n${'='.repeat(70)}\nMENTIONS · latest 10 (answer inbound questions FIRST)\n${'='.repeat(70)}`);
try {
  const out = execFileSync('npx', ['-y', '@xdevplatform/xurl',
    `/2/users/${USER_ID}/mentions?max_results=10&tweet.fields=created_at,public_metrics,author_id&expansions=author_id&user.fields=username,public_metrics`],
    { encoding: 'utf8', timeout: 120000 });
  const d = JSON.parse(out);
  const users = Object.fromEntries((d.includes?.users || []).map(u => [u.id, u]));
  for (const t of d.data || []) {
    const u = users[t.author_id] || {};
    console.log(`${t.created_at} @${u.username} (${u.public_metrics?.followers_count}f): ${t.text.slice(0, 140).replace(/\n/g, ' ')}`);
  }
} catch (e) {
  console.log(`FAILED: ${(e?.message || e).toString().slice(0, 200)}`);
}

console.log(`\nBRIEF COMPLETE — read social_analysis/taste.md before drafting. Today: ${today}`);
