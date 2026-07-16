#!/usr/bin/env node
/**
 * twitterLearn.mjs — closed-loop Learn stage (Social Neuron Stage 5 analogue).
 *
 * Reads growth_pulse.json, tags each post with a mechanic, scores OVER/PAR/UNDER,
 * and writes:
 *   twitter_agents/SHARED/learning_ledger.json
 *   twitter_agents/SHARED/learn_brief_latest.md
 *
 * Optionally appends confirmed UNDER kills into researcher/knowledge/kill_list.md
 * (idempotent block marker) and prepends promote weights into hook_patterns.md.
 *
 * Usage:
 *   node scripts/twitterLearn.mjs
 *   node scripts/twitterLearn.mjs --from twitter_drafts/growth_pulse.json
 *   node scripts/growthPulse.mjs --save && node scripts/twitterLearn.mjs
 *
 * Never publishes. Never invents metrics — pulse is source of truth.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const fromIdx = process.argv.indexOf('--from');
const pulsePath = fromIdx >= 0
  ? (process.argv[fromIdx + 1].startsWith('/')
      ? process.argv[fromIdx + 1]
      : join(root, process.argv[fromIdx + 1]))
  : join(root, 'twitter_drafts', 'growth_pulse.json');

if (!existsSync(pulsePath)) {
  console.error(`No pulse at ${pulsePath} — run: node scripts/growthPulse.mjs --save`);
  process.exit(1);
}

const pulse = JSON.parse(readFileSync(pulsePath, 'utf8'));
const baseline = pulse.baselines?.heroImpressions || 0;
const outBaseline = pulse.baselines?.outboundImpressions || baseline;

function classify(impr, base) {
  if (!base) return 'PAR';
  const r = impr / base;
  if (r >= 1.5) return 'OVER';
  if (r <= 0.6) return 'UNDER';
  return 'PAR';
}

/** Tag mechanic from post text — heuristic, evidence still cites pulse ids. */
function tagMechanic(text = '', kind = 'hero') {
  const t = String(text).toLowerCase();
  if (kind === 'outbound_reply') {
    if (/sharp|wallet|\$|rank|locked|units|\du\b/.test(t)) return 'outbound_receipt';
    return 'outbound_thin';
  }
  if (/top\s*0\.?1|best[- ]kept secret|best kept secret/.test(t)) return 'tipster_secret';
  if ((t.match(/[✅❌]/g) || []).length >= 2) return 'scoreboard_ledger';
  if (/i hate|don't have nearly|gold.*(quiet|thin)|weekend.*sharp|almost (quit|closed)/.test(t)) {
    return 'confession_costly';
  }
  if (/\$[\d.]+[kKmM]|\d+\.?\d*%\s*win|rescue path|35-17|67\.3/.test(t)) return 'receipt_proof';
  if (/still fir|fading .+ or|dog|chalk|would you/.test(t)) return 'forced_take';
  if (/quietly watching|around for the ride|many of you found/.test(t)) return 'welcome_identity';
  if (/lunch today|full week|\$\d+\/(week|mo)/.test(t)) return 'promo_price';
  if (/so back|\+[\d.]+u yesterday|new all-time/.test(t)) return 'flex_milestone';
  return 'other';
}

function weightDelta(band, replies, profileClicks) {
  let w = 0;
  if (band === 'OVER') w += 2;
  if (band === 'UNDER') w -= 2;
  if (replies >= 2) w += 2;
  else if (replies === 1) w += 1;
  else if (band !== 'UNDER') w -= 0.5; // reach without replies = incomplete
  if (profileClicks > 0) w += 1;
  return w;
}

const rows = [];
for (const h of pulse.heroes || []) {
  const band = classify(h.impressions, baseline);
  const mechanic = tagMechanic(h.text, h.kind || 'hero');
  rows.push({
    id: h.id,
    kind: h.kind || 'hero',
    text: h.text,
    impressions: h.impressions,
    replies: h.replies,
    profile_clicks: h.profile_clicks ?? 0,
    engScore: h.engScore,
    band,
    mechanic,
    weight: weightDelta(band, h.replies, h.profile_clicks ?? 0),
  });
}
for (const o of pulse.outbound || []) {
  const band = classify(o.impressions, outBaseline || baseline);
  const mechanic = tagMechanic(o.text, 'outbound_reply');
  rows.push({
    id: o.id,
    kind: 'outbound_reply',
    text: o.text,
    impressions: o.impressions,
    replies: o.replies,
    profile_clicks: o.profile_clicks ?? 0,
    engScore: o.engScore,
    band,
    mechanic,
    weight: weightDelta(band, o.replies, o.profile_clicks ?? 0),
  });
}

// Aggregate mechanic weights
const byMechanic = {};
for (const r of rows) {
  if (!byMechanic[r.mechanic]) {
    byMechanic[r.mechanic] = { mechanic: r.mechanic, n: 0, weightSum: 0, overs: 0, unders: 0, replies: 0, ids: [] };
  }
  const m = byMechanic[r.mechanic];
  m.n += 1;
  m.weightSum += r.weight;
  m.replies += r.replies;
  if (r.band === 'OVER') m.overs += 1;
  if (r.band === 'UNDER') m.unders += 1;
  m.ids.push(r.id);
}
const mechanics = Object.values(byMechanic)
  .map((m) => ({ ...m, avgWeight: +(m.weightSum / m.n).toFixed(2) }))
  .sort((a, b) => b.avgWeight - a.avgWeight);

const NEVER_PROMOTE = new Set([
  'tipster_secret',
  'promo_price',
  'scoreboard_ledger',
  'flex_milestone',
  'outbound_thin',
  'other',
]);
const HARD_KILL = new Set(['tipster_secret', 'scoreboard_ledger', 'promo_price']);

const promote = mechanics.filter(
  (m) => m.avgWeight >= 0.5 && !NEVER_PROMOTE.has(m.mechanic),
);
const kill = mechanics.filter(
  (m) => HARD_KILL.has(m.mechanic)
    || m.avgWeight <= -1.5
    || (HARD_KILL.has(m.mechanic) === false
      && m.unders >= 1
      && m.overs === 0
      && m.avgWeight <= -1
      && m.mechanic !== 'outbound_receipt'),
);
// Always surface hard kills even if not in this pulse sample
for (const hk of HARD_KILL) {
  if (!kill.some((m) => m.mechanic === hk) && byMechanic[hk]) {
    kill.push(byMechanic[hk]);
  }
}

const ledger = {
  savedAt: new Date().toISOString(),
  sourcePulse: pulse.savedAt || null,
  followers: pulse.followers,
  baselines: pulse.baselines,
  posts: rows,
  mechanics,
  promote: promote.map((m) => m.mechanic),
  kill: kill.map((m) => m.mechanic),
  nextIdeateBias: {
    prefer: promote.slice(0, 5).map((m) => m.mechanic),
    avoid: kill.map((m) => m.mechanic),
    note: 'Researcher must cite these weights in angle_candidates / idea_queue',
  },
};

const sharedDir = join(root, 'twitter_agents', 'SHARED');
mkdirSync(sharedDir, { recursive: true });
const ledgerPath = join(sharedDir, 'learning_ledger.json');
writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + '\n');

const briefLines = [
  `# LEARN BRIEF`,
  `date: ${new Date().toISOString().slice(0, 10)}`,
  `source_pulse: ${pulse.savedAt || 'unknown'}`,
  `followers: ${pulse.followers ?? '—'}`,
  ``,
  `## Promote (weight into Ideate)`,
  ...(promote.length
    ? promote.map((m) => `- **${m.mechanic}** avgWeight=${m.avgWeight} · n=${m.n} · overs=${m.overs} · replies=${m.replies} · ids=${m.ids.slice(0, 3).join(',')}`)
    : ['- (none above threshold — raise craft bar)']),
  ``,
  `## Kill (do not echo)`,
  ...(kill.length
    ? kill.map((m) => `- **${m.mechanic}** avgWeight=${m.avgWeight} · unders=${m.unders} · ids=${m.ids.slice(0, 3).join(',')}`)
    : ['- (none confirmed this pulse)']),
  ``,
  `## Next ideate bias`,
  `- prefer: ${ledger.nextIdeateBias.prefer.join(', ') || '—'}`,
  `- avoid: ${ledger.nextIdeateBias.avoid.join(', ') || '—'}`,
  ``,
  `## Coach / Researcher law`,
  `- Coach: autopsy must reconcile with this brief (evidence > vibes).`,
  `- Researcher: every angle_candidate cites at least one promote mechanic OR explicitly escapes a kill.`,
  `- Missing this brief → FAIL loop start (unless Dale spine override).`,
  ``,
];
const briefPath = join(sharedDir, 'learn_brief_latest.md');
writeFileSync(briefPath, briefLines.join('\n'));

// Idempotent kill_list append
const killListPath = join(root, 'twitter_agents', 'researcher', 'knowledge', 'kill_list.md');
if (existsSync(killListPath) && kill.length) {
  let killMd = readFileSync(killListPath, 'utf8');
  const marker = '<!-- twitterLearn:auto -->';
  const block = [
    '',
    marker,
    `## Auto-kills from Learn (${ledger.savedAt.slice(0, 10)})`,
    ...kill.map((m) => `- **${m.mechanic}** (avgWeight ${m.avgWeight}) — pulse ids: ${m.ids.join(', ')}`),
    '',
  ].join('\n');
  if (killMd.includes(marker)) {
    killMd = killMd.replace(
      new RegExp(`${marker}[\\s\\S]*?(?=\\n## |\\n# |$)`),
      block.trimEnd() + '\n\n',
    );
  } else {
    killMd = killMd.trimEnd() + '\n' + block;
  }
  writeFileSync(killListPath, killMd);
}

// Light promote note in hook_patterns (idempotent section)
const hooksPath = join(root, 'twitter_agents', 'researcher', 'knowledge', 'hook_patterns.md');
if (existsSync(hooksPath) && promote.length) {
  let hooksMd = readFileSync(hooksPath, 'utf8');
  const marker = '<!-- twitterLearn:promote -->';
  const block = [
    '',
    marker,
    `## Learn weights (${ledger.savedAt.slice(0, 10)})`,
    `Prefer mechanics: ${promote.map((m) => m.mechanic).join(', ')}.`,
    `Avoid: ${kill.map((m) => m.mechanic).join(', ') || '—'}.`,
    `Full ledger: \`twitter_agents/SHARED/learning_ledger.json\`.`,
    '',
  ].join('\n');
  if (hooksMd.includes(marker)) {
    hooksMd = hooksMd.replace(
      new RegExp(`${marker}[\\s\\S]*?(?=\\n## |\\n# |$)`),
      block.trimEnd() + '\n\n',
    );
  } else {
    hooksMd = hooksMd.trimEnd() + '\n' + block;
  }
  writeFileSync(hooksPath, hooksMd);
}

// Cap craft_recommendations append to 3 rules
const craftPath = join(root, 'twitter_agents', 'coach', 'memory', 'craft_recommendations.md');
if (existsSync(craftPath)) {
  const marker = '<!-- twitterLearn:craft -->';
  const rules = [];
  if (promote[0]) rules.push(`Double down mechanic **${promote[0].mechanic}** (Learn avgWeight ${promote[0].avgWeight}).`);
  if (kill[0]) rules.push(`Kill mechanic **${kill[0].mechanic}** on sight (Learn).`);
  if (rows.some((r) => r.band !== 'UNDER' && r.replies === 0 && r.kind !== 'outbound_reply')) {
    rules.push('Reach without replies = incomplete — forced take required on every hero.');
  }
  const slice = rules.slice(0, 3);
  if (slice.length) {
    let craft = readFileSync(craftPath, 'utf8');
    const block = ['', marker, `## Learn craft deltas (${ledger.savedAt.slice(0, 10)})`, ...slice.map((r, i) => `${i + 1}. ${r}`), ''].join('\n');
    if (craft.includes(marker)) {
      craft = craft.replace(
        new RegExp(`${marker}[\\s\\S]*?(?=\\n## |\\n# |$)`),
        block.trimEnd() + '\n\n',
      );
    } else {
      craft = craft.trimEnd() + '\n' + block;
    }
    writeFileSync(craftPath, craft);
  }
}

console.log('LEARN — wrote', ledgerPath);
console.log('LEARN — wrote', briefPath);
console.log(`Promote: ${ledger.promote.join(', ') || '—'}`);
console.log(`Kill: ${ledger.kill.join(', ') || '—'}`);
