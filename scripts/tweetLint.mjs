/**
 * tweetLint.mjs — the executable taste gate.
 *
 * Scores a draft tweet against everything the system has MEASURED (competitor
 * corpus, our ledger) and every owner law (taste.md rejection log, brand
 * rules). Rules that live in prose get skipped under deadline pressure;
 * rules that run as code do not.
 *
 * Usage:
 *   node scripts/tweetLint.mjs "full tweet text..."               # REACH assumed
 *   node scripts/tweetLint.mjs --purpose RETAIN "text..."
 *   node scripts/tweetLint.mjs --file ready_to_post/2026-07-07_1130.json   # lints hero + alternates
 *
 * Verdicts: SHIP (>=85) · FIX (70-84) · KILL (<70).
 * A hero may not be shown to the owner below SHIP.
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const argVal = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const purpose = (argVal('--purpose') || 'REACH').toUpperCase();
const file = argVal('--file');

// ── the rules, as code ───────────────────────────────────────────────────────
const NEGATIVE_HOOK = /\b(lost|loss(es)?|sucked|cost (you|us|me)|down \d|drawdown|worst|blame|apolog|sorry|weak link|mistake|i was wrong|brutal|rough (day|night)|painful)\b/i;
const BANNED = [
  [/let'?s dive in/i, 'banned phrase (AI-tell): "let\'s dive in"'],
  [/game-?changer/i, 'banned phrase (AI-tell): "game-changer"'],
  [/\bdelve\b/i, 'banned phrase (AI-tell): "delve"'],
  [/tail or fade/i, 'banned default closer: "tail or fade"'],
  [/don'?t miss/i, 'ad-speak: "don\'t miss"'],
  [/sign.? ?up/i, 'ad-speak: "sign up" — the ask is "the first week is free", stated once, as fact'],
  [/scrolling past/i, 'owner-killed pattern (7/7): "scrolling past" ad-close'],
  [/convince me/i, 'owner-killed pattern (7/7): never debate the paywall'],
  [/check ?out|click (the )?link|link in bio/i, 'ad-speak'],
  [/#\w+/, 'hashtag — zero hashtags, always'],
];
const OPEN_LOOP = /(\.\.\.|…)\s*$/;
const FIRST_PERSON_STAKES = /^(i('ve| have| watched| put| bet| spent| tracked)|my )/i;
const EMOJI_ROW = /(\p{Extended_Pictographic}\s*){3,}/u;

function lint(text, label) {
  const findings = [];
  let score = 100;
  const hit = (pts, msg) => { score += pts; findings.push(`${pts > 0 ? '+' : ''}${pts}  ${msg}`); };

  const lines = text.split('\n').filter(Boolean);
  const line1 = lines[0] || '';

  // ── the hook (line 1 is most of the grade) ──
  if (NEGATIVE_HOOK.test(line1)) hit(-40, `NEGATIVE HOOK: "${line1.slice(0, 60)}" — owner law: lead green, always. (honest-L measured 0.4x baseline)`);
  if (line1.length > 130) hit(-10, `hook is ${line1.length} chars — the fold cuts it; land the punch in <100`);
  if (OPEN_LOOP.test(line1)) hit(+8, 'line-1 open loop ("...") — measured 2.1x in the 191-post corpus');
  if (FIRST_PERSON_STAKES.test(line1)) hit(+6, 'first-person stakes opener — measured 2.5x in corpus');
  if (!/\d/.test(line1) && !OPEN_LOOP.test(line1) && !FIRST_PERSON_STAKES.test(line1))
    hit(-6, 'hook has no number, no open loop, no persona stakes — what stops the scroll?');

  // ── body ──
  if (/https?:\/\//i.test(text)) hit(-25, 'LINK IN TWEET 1 — measured −50% reach; the link lives in the ~25-min self-reply');
  for (const [re, msg] of BANNED) if (re.test(text)) hit(-15, msg);
  if (EMOJI_ROW.test(text)) hit(-10, '3+ emoji row — not our brand');
  if (purpose === 'REACH' && text.length > 240)
    hit(-8, `${text.length} chars on a REACH post — corpus: >200-char posts average 1.30x vs 1.54x; move depth to the self-reply/thread`);
  if (text.length > 550) hit(-10, 'wall of text — dwell is scored, but only if the first screen earns it');
  const receipts = (text.match(/[✅❌]/g) || []).length;
  if (receipts >= 3 && purpose === 'REACH')
    hit(-8, `${receipts} receipt emojis on a REACH post — receipts-as-furniture measured 0.78x; receipts belong in RETAIN posts or must BE the story`);
  const caps = (text.match(/\b[A-Z]{3,}\b/g) || []).length;
  if (caps > 4) hit(-8, 'heavy ALL-CAPS — we are the calm professional in a screaming niche; that contrast IS the brand');

  // ── the close ──
  const last = lines[lines.length - 1] || '';
  if (/\?\s*$/.test(last)) hit(+4, 'closes on a question — replies are the 27x currency (make sure it is genuinely answerable)');
  else if (/(free|nhlsavant)/i.test(last) && purpose === 'REACH') hit(-5, 'REACH post closing on the ask — one job per tweet; the self-reply converts');

  const verdict = score >= 85 ? 'SHIP' : score >= 70 ? 'FIX' : 'KILL';
  console.log(`\n── ${label} · purpose ${purpose} · SCORE ${score} → ${verdict} ──`);
  console.log(`"${line1.slice(0, 80)}${line1.length > 80 ? '…' : ''}"`);
  for (const f of findings) console.log('  ' + f);
  if (!findings.length) console.log('  clean — no measured anti-patterns detected');
  if (verdict !== 'SHIP') console.log('  ⛔ below SHIP — do not show the owner; fix or kill.');
  return { score, verdict };
}

if (file) {
  const draft = JSON.parse(readFileSync(join(__dirname, '..', file), 'utf8'));
  if (draft.hero?.text) lint(draft.hero.text, 'hero');
  (draft.alternates || []).forEach((a, i) => a.text && lint(a.text, `alt${i + 1}`));
} else {
  const text = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--purpose' && args[i - 1] !== '--file').join(' ');
  if (!text) { console.error('Usage: node scripts/tweetLint.mjs [--purpose REACH|CONVERT|RETAIN] "text" | --file <draft.json>'); process.exit(1); }
  lint(text, 'draft');
}
