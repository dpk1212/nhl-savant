#!/usr/bin/env node
/**
 * saveTwitterDrafts.mjs — end-of-run draft saver for the Twitter loop.
 *
 * WHY THIS EXISTS: the X consumer "Drafts" folder (compose → Save draft) is
 * NOT exposed on the pay-per-use X API our MCP uses. Official draft_tweets
 * lives on the Ads API only. Until we have Ads access, this script is the
 * draft system: writes copy-paste files + one-tap compose URLs that open X
 * with the text pre-filled (you hit Post).
 *
 * Usage:
 *   node scripts/saveTwitterDrafts.mjs --file twitter_drafts/inbox.json
 *   node scripts/saveTwitterDrafts.mjs --stdin   # pipe JSON
 *
 * Input JSON shape:
 * {
 *   "runLabel": "2026-07-09_morning",          // optional folder name
 *   "drafts": [
 *     {
 *       "id": "hero",
 *       "kind": "hero|self_reply|reply|quote|inbound",
 *       "text": "full tweet text...",
 *       "replyToId": "2074...",                 // optional — for replies
 *       "quoteId": "2074...",                   // optional — for QTs
 *       "attach": "dashboard screenshots",      // optional note
 *       "when": "post now / ~12:21 PM lock",    // optional timing note
 *       "improvesOn": "post id or shape from growth_pulse",  // ratchet
 *       "prediction": "beat X impr / Y replies because ..." // ratchet
 *     }
 *   ]
 * }
 *
 * Writes:
 *   twitter_drafts/<runLabel>/00_INDEX.md
 *   twitter_drafts/<runLabel>/<nn>_<id>.txt
 *   twitter_drafts/<runLabel>/compose_links.md   // one-tap open in browser
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outRoot = join(root, 'twitter_drafts');

const args = process.argv.slice(2);
const fileIdx = args.indexOf('--file');
const useStdin = args.includes('--stdin');

function loadInput() {
  if (fileIdx >= 0) {
    const p = args[fileIdx + 1];
    const abs = p.startsWith('/') ? p : join(root, p);
    return JSON.parse(readFileSync(abs, 'utf8'));
  }
  if (useStdin) {
    return JSON.parse(readFileSync(0, 'utf8'));
  }
  console.error('Usage: node scripts/saveTwitterDrafts.mjs --file <path.json> | --stdin');
  process.exit(1);
}

const input = loadInput();
const drafts = input.drafts || [];
if (!drafts.length) {
  console.error('No drafts in input.');
  process.exit(1);
}

const now = new Date();
const et = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
const stamp = now.toISOString().slice(0, 16).replace('T', '_').replace(':', '');
const runLabel = (input.runLabel || stamp).replace(/[^\w.-]+/g, '_');
const dir = join(outRoot, runLabel);
mkdirSync(dir, { recursive: true });

function composeUrl(d) {
  // Official intent URL — opens X compose with text pre-filled.
  // Replies: in_reply_to lands you in the reply composer when supported.
  const params = new URLSearchParams();
  params.set('text', d.text);
  if (d.replyToId) params.set('in_reply_to', d.replyToId);
  if (d.quoteId) {
    // Quote via URL append — user can also paste quoteId note from the .txt
    params.set('url', `https://x.com/i/status/${d.quoteId}`);
  }
  return `https://x.com/intent/tweet?${params.toString()}`;
}

const indexLines = [
  `# Drafts — ${runLabel}`,
  `Saved ${et} ET · ${drafts.length} items`,
  ``,
  `Native X Drafts folder is NOT available on our API (Ads API only).`,
  `These files + compose links are the draft system until Ads access exists.`,
  ``,
  `| # | id | kind | when | file |`,
  `|---|---|---|---|---|`,
];

const linkLines = [
  `# One-tap compose links — ${runLabel}`,
  ``,
  `Open a link → X compose opens with text filled → review → Post.`,
  `Attach media manually. Replies open against the parent when in_reply_to is set.`,
  ``,
];

drafts.forEach((d, i) => {
  const n = String(i).padStart(2, '0');
  const id = (d.id || `draft_${i}`).replace(/[^\w.-]+/g, '_');
  const fname = `${n}_${id}.txt`;
  const body = [
    `KIND: ${d.kind || 'hero'}`,
    d.when ? `WHEN: ${d.when}` : null,
    d.attach ? `ATTACH: ${d.attach}` : null,
    d.improvesOn ? `IMPROVES_ON: ${d.improvesOn}` : null,
    d.prediction ? `PREDICTION: ${d.prediction}` : null,
    d.replyToId ? `REPLY_TO: https://x.com/i/status/${d.replyToId}` : null,
    d.quoteId ? `QUOTE: https://x.com/i/status/${d.quoteId}` : null,
    `COMPOSE: ${composeUrl(d)}`,
    ``,
    `--- COPY BELOW THIS LINE ---`,
    ``,
    d.text.trim(),
    ``,
  ].filter(Boolean).join('\n');

  writeFileSync(join(dir, fname), body, 'utf8');
  indexLines.push(`| ${n} | ${id} | ${d.kind || 'hero'} | ${d.when || '—'} | ${fname} |`);
  linkLines.push(`## ${n} — ${id} (${d.kind || 'hero'})`);
  if (d.when) linkLines.push(`When: ${d.when}`);
  if (d.attach) linkLines.push(`Attach: ${d.attach}`);
  linkLines.push(``);
  linkLines.push(composeUrl(d));
  linkLines.push(``);
});

writeFileSync(join(dir, '00_INDEX.md'), indexLines.join('\n') + '\n', 'utf8');
writeFileSync(join(dir, 'compose_links.md'), linkLines.join('\n') + '\n', 'utf8');
writeFileSync(join(dir, 'manifest.json'), JSON.stringify({ runLabel, savedAt: now.toISOString(), drafts }, null, 2) + '\n', 'utf8');

console.log(`Saved ${drafts.length} drafts → twitter_drafts/${runLabel}/`);
console.log(`  00_INDEX.md · compose_links.md · ${drafts.length} .txt files`);
console.log(`Open compose_links.md and click through — or copy from the .txt files.`);
