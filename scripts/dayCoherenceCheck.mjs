#!/usr/bin/env node
/**
 * dayCoherenceCheck.mjs — THE TIMELINE GATE (added 7/7).
 *
 * tweetLint.mjs judges a draft in isolation. It cannot know that Colombia
 * was never our play, that an Over grade has been owed since 2:16 PM, or
 * that we already used the +57u flex twice today. This script pulls what
 * ACTUALLY happened on the account today and cross-checks a proposed draft
 * against it, so "coherent with our timeline and strategy" is a command,
 * not a hope.
 *
 * Usage:
 *   node scripts/dayCoherenceCheck.mjs "draft text..."
 *   node scripts/dayCoherenceCheck.mjs --file ready_to_post/2026-07-07_x.json
 *   node scripts/dayCoherenceCheck.mjs                 # context only, no draft
 *
 * Prints:
 *   1. Every post from OUR account in the last 12h (what's already been said)
 *   2. Open promises: any post containing "graded either way" / "either way"
 *      / a countdown that hasn't been followed by a matching grade post
 *   3. Repeated-angle warning if the draft's numbers/games echo a post
 *      from the last 12h (stat fatigue / game dedup, TWITTER_LOOP.md rule)
 *   4. The day script line from AA_TWITTER_NEXT_STEPS.md, so the draft can
 *      be checked against the STATED arc, not just against raw history.
 */
import { execFileSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const USER_ID = '1991513001204281345';

const args = process.argv.slice(2);
const fileArg = (() => { const i = args.indexOf('--file'); return i >= 0 ? args[i + 1] : null; })();
let draftText = fileArg
  ? (() => { try { return JSON.parse(readFileSync(join(root, fileArg), 'utf8')).hero?.text || ''; } catch { return ''; } })()
  : args.filter(a => !a.startsWith('--')).join(' ');

console.log('='.repeat(70));
console.log('DAY COHERENCE CHECK — what has ACTUALLY happened on the account today');
console.log('='.repeat(70));

let posts = [];
try {
  const out = execFileSync('npx', ['-y', '@xdevplatform/xurl',
    `/2/users/${USER_ID}/tweets?max_results=15&tweet.fields=created_at,public_metrics&exclude=replies`],
    { encoding: 'utf8', timeout: 60000 });
  const d = JSON.parse(out);
  const cutoff = Date.now() - 12 * 3600 * 1000;
  posts = (d.data || []).filter(t => new Date(t.created_at).getTime() >= cutoff);
} catch (e) {
  console.log(`FAILED to fetch timeline: ${(e?.message || e).toString().slice(0, 150)}`);
}

if (!posts.length) console.log('(no posts from us in the last 12h)');
for (const p of posts) {
  const t = new Date(p.created_at).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });
  console.log(`${t} ET | ${p.text.slice(0, 90).replace(/\n/g, ' / ')}`);
}

// ── open promises ──
console.log('\n── OPEN PROMISES (posts promising a grade that may not be honored yet) ──');
const PROMISE = /graded (here )?(either way|after)|locks? \d/i;
const GRADE_SIGNAL = /[✅❌]|cashed|misses?|handles it/i;
const promising = posts.filter(p => PROMISE.test(p.text));
const graded = posts.filter(p => GRADE_SIGNAL.test(p.text));
if (!promising.length) console.log('(none found)');
for (const p of promising) {
  // crude heuristic: is there a LATER post (by time) with grade language mentioning a shared keyword?
  const keywords = (p.text.match(/[A-Z][a-z]+(?= (ML|\+\d|-\d))/g) || []);
  const honored = graded.some(g => new Date(g.created_at) > new Date(p.created_at) && keywords.some(k => g.text.includes(k)));
  const t = new Date(p.created_at).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });
  console.log(`${honored ? '✅ honored' : '⚠️  STILL OWED'} — ${t} ET: "${p.text.slice(0, 70).replace(/\n/g, ' / ')}"`);
}

// ── day script ──
console.log('\n── STATED DAY SCRIPT (AA_TWITTER_NEXT_STEPS.md) ──');
const aaPath = join(root, 'AA_TWITTER_NEXT_STEPS.md');
if (existsSync(aaPath)) {
  const aa = readFileSync(aaPath, 'utf8');
  const m = aa.match(/## THE DAY SCRIPT[\s\S]{0,1500}?(?=\n---|\n##|$)/);
  console.log(m ? m[0].trim() : '(no ## THE DAY SCRIPT section found)');
} else {
  console.log('(AA_TWITTER_NEXT_STEPS.md not found)');
}

// ── draft cross-check ──
if (draftText) {
  console.log('\n── DRAFT CROSS-CHECK ──');
  console.log(`"${draftText.slice(0, 100).replace(/\n/g, ' / ')}${draftText.length > 100 ? '…' : ''}"`);
  const draftNumbers = draftText.match(/\+?\d[\d,.]*[%uKM]?/g) || [];
  let flags = 0;
  for (const p of posts) {
    const shared = draftNumbers.filter(n => n.length > 2 && p.text.includes(n));
    if (shared.length >= 2) {
      flags++;
      const t = new Date(p.created_at).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });
      console.log(`⚠️  REPEATED NUMBERS (${shared.join(', ')}) also appear in the ${t} ET post — stat fatigue risk, find a fresh angle or confirm it's intentional (e.g. a callback)`);
    }
  }
  const stillOwed = promising.filter(p => {
    const keywords = (p.text.match(/[A-Z][a-z]+(?= (ML|\+\d|-\d))/g) || []);
    return !graded.some(g => new Date(g.created_at) > new Date(p.created_at) && keywords.some(k => g.text.includes(k)));
  });
  if (stillOwed.length && !GRADE_SIGNAL.test(draftText)) {
    console.log(`⚠️  ${stillOwed.length} grade(s) still owed and this draft does not pay any of them off. Confirm that's intentional (e.g. game hasn't settled yet) before posting something unrelated.`);
  }
  if (!flags && (!stillOwed.length || GRADE_SIGNAL.test(draftText))) console.log('✅ no repetition or unpaid-promise conflicts detected.');
}

console.log('\nDone. This check is advisory — read the output, don\'t just check for zero warnings.');
