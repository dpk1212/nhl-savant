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
 * Verdicts: ELITE (>=105, all elite gates passed) · SHIP (>=85) · FIX (70-84)
 * · KILL (<70).
 *
 * RAISED BAR (7/7 — the SHIP bar was proven insufficient): every hero
 * tonight scored SHIP (85-114) on its FIRST draft and still needed 3-6 owner
 * catches before it was actually top-1%. SHIP means "no measured
 * anti-pattern" — it does NOT mean "elite." A REACH hero may not be shown to
 * the owner below ELITE. The elite gates below are the five structural laws
 * discovered tonight, now enforced as code instead of relying on memory:
 *   1. AUTHORITY — a verified record/number that answers "why should a
 *      stranger care?" (a W-L record, +Xu, a $ growth figure, or a receipt
 *      stack standing in as its own authority).
 *   2. PROPRIETARY PUNCH — the one detail nobody else could post: named
 *      wallet receipts, a $ + % figure, unanimity language, or a sizing
 *      anomaly. A hook that talks about "the wallets" with zero proprietary
 *      data attached is generic-clever, not elite (killed twice tonight).
 *   3. Not a naked grade — a REACH post that only reports a result with no
 *      forward-looking live pick is leaving reach on the table (the combo
 *      law: fuse a same-day win into the next live pick, don't split them).
 *   4. Scroll-stopping hook (open loop / first-person stakes / receipt stack).
 *   5. No critical violation (negative hook, banned phrase, link in tweet 1,
 *      dense unscannable block).
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
// THE RECEIPT STACK (added 7/7 — owner bookmarked our own April tweets that
// used this exact shape and out-performed our current output 2-5x). A named
// receipt line is a last-4 hex wallet tag + a dollar figure on its own line
// — e.g. "23c4  $46.2K". Generate these with scripts/walletReceipts.mjs.
const NAMED_RECEIPT = /^\s*[0-9a-f]{4}\s+\$[\d,.]+[KM]?\b/im;
// ── ELITE GATES (added 7/7 — codifying tonight's five hard-won structural laws) ──
const AUTHORITY_MARKER = /\b\d{2,3}-\d{2,3}\b|\+\d+(\.\d+)?\s?u(nits)?\b|since june ?1|\$[\d,]+\s?(→|->|to)\s?\$[\d,]+/i;
const PROPRIETARY_PUNCH = /\$[\d,.]+[KM]?\b.{0,40}\d{1,3}(\.\d+)?%|not one|every (proven )?winner|unanimous|100% (of|agreement)|\d+(\.\d+)?x (his|her|their|its|own|avg|average)/i;
const GRADE_LANGUAGE = /[✅❌]|\bcashed\b|\bmissed\b|\bhandles it\b/i;
const FORWARD_PICK = /\blocks?\b.{0,20}\b(et|pm|am)\b|first pitch|first lock|kicks off|\bcountdown\b/i;
const CRITICAL_FLAG = (findings) => findings.some(f => /^-(1[5-9]|[2-9]\d)\s/.test(f));

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
  const namedReceiptCount = (text.match(new RegExp(NAMED_RECEIPT, 'gim')) || []).length;
  const hasReceiptStack = namedReceiptCount >= 2;
  if (hasReceiptStack) hit(+12, `${namedReceiptCount} named wallet receipts (hex tag + $) — our own historical top-3 posts (7.2K-11K impressions, 7/7 owner-verified via bookmarks) used exactly this shape; it is our proprietary, unreplicable format`);
  if (purpose === 'REACH' && text.length > 240 && !hasReceiptStack)
    hit(-8, `${text.length} chars on a REACH post — corpus: >200-char posts average 1.30x vs 1.54x; move depth to the self-reply/thread`);
  else if (purpose === 'REACH' && text.length > 240 && hasReceiptStack)
    hit(-2, `${text.length} chars, but a receipt stack earns its length — dwell is scored and this is our proven exception (bookmarked exemplars ran 300-400+ chars)`);
  if (text.length > 550) hit(-10, 'wall of text — dwell is scored, but only if the first screen earns it');
  const receipts = (text.match(/[✅❌]/g) || []).length;
  if (receipts >= 3 && purpose === 'REACH')
    hit(-8, `${receipts} receipt emojis on a REACH post — receipts-as-furniture measured 0.78x; receipts belong in RETAIN posts or must BE the story`);
  const caps = (text.match(/\b[A-Z]{3,}\b/g) || []).length;
  if (caps > 4) hit(-8, 'heavy ALL-CAPS — we are the calm professional in a screaming niche; that contrast IS the brand');

  // visual formatting: the punch must be ISOLATED, not buried in a block
  const dense = lines.filter(l => l.length > 150);
  if (dense.length) hit(-8, `dense block (${dense[0].length} chars on one line) — isolate the punch: short stacked lines, vertical escalation, key numbers on their own line`);
  if (lines.length >= 3 && !lines.some(l => l.length < 45))
    hit(-4, 'no short line anywhere — a scannable post needs at least one isolated beat');

  // ── the close ──
  const last = lines[lines.length - 1] || '';
  if (/\?\s*$/.test(last)) hit(+4, 'closes on a question — replies are the 27x currency (make sure it is genuinely answerable)');
  else if (/(free|nhlsavant)/i.test(last) && purpose === 'REACH') hit(-5, 'REACH post closing on the ask — one job per tweet; the self-reply converts');

  // ── THE ELITE GATES (7/7) — these do NOT add/subtract score; they gate the
  // verdict independently. A post can be SHIP-scored and still fail ELITE. ──
  const hasAuthority = AUTHORITY_MARKER.test(text);
  const hasPunch = PROPRIETARY_PUNCH.test(text) || hasReceiptStack;
  const hasGrade = GRADE_LANGUAGE.test(text);
  const hasForwardPick = FORWARD_PICK.test(text);
  const scrollStop = OPEN_LOOP.test(line1) || FIRST_PERSON_STAKES.test(line1) || hasReceiptStack || /\d/.test(line1);
  const eliteGates = {
    'AUTHORITY (a verified record/number, or the receipt stack standing in as its own authority)': hasAuthority || hasReceiptStack,
    'PROPRIETARY PUNCH (named receipts / $+% / unanimity / sizing anomaly — not a generic narrative turn)': hasPunch,
    'NOT A NAKED GRADE (if reporting a result, a forward-looking live pick is fused in — the combo law)': !hasGrade || hasForwardPick || purpose !== 'REACH',
    'SCROLL-STOPPING HOOK (open loop / first-person stakes / receipt stack / hard number in line 1)': scrollStop,
    'NO CRITICAL VIOLATION (negative hook / banned phrase / link in tweet 1 / dense block)': !CRITICAL_FLAG(findings),
  };
  const failedGates = Object.entries(eliteGates).filter(([, pass]) => !pass).map(([g]) => g);
  const isElite = score >= 105 && failedGates.length === 0;

  const verdict = isElite ? 'ELITE' : score >= 85 ? 'SHIP' : score >= 70 ? 'FIX' : 'KILL';
  console.log(`\n── ${label} · purpose ${purpose} · SCORE ${score} → ${verdict} ──`);
  console.log(`"${line1.slice(0, 80)}${line1.length > 80 ? '…' : ''}"`);
  for (const f of findings) console.log('  ' + f);
  if (!findings.length) console.log('  clean — no measured anti-patterns detected');
  if (verdict === 'ELITE') {
    console.log('  ✅ ELITE — all 5 gates passed. This may be shown to the owner as a finished hero.');
  } else {
    console.log(`  ⛔ NOT ELITE (verdict ${verdict}) — do not show this as a finished hero. Failed gates:`);
    for (const g of failedGates.length ? failedGates : ['score below 105 — push a stronger hook, authority line, or proprietary punch']) console.log('     • ' + g);
  }
  return { score, verdict, eliteGates, failedGates };
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
