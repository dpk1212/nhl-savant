/**
 * v71LockAudit.js — answer "is today's slate locking everything it should under v7.1?"
 *
 * Pulls every doc dated TODAY across sharpFlowPicks / sharpFlowSpreads /
 * sharpFlowTotals (or the date passed via --date=YYYY-MM-DD) and partitions
 * by lockStage / lockTier / health / hcDominant / promotedBy. Highlights:
 *
 *   • locked count (what UI is showing)
 *   • SHADOW count + how many SHADOW sides have v8_walletConsensusPromotionTriggered=true
 *     (those are docs we expected to lock but didn't — investigate)
 *   • LEAN count (Σ ∈ {3,4} that did NOT qualify for HC promotion)
 *   • HC-promoted count (Σ ∈ {3,4} ∧ hcDominant ∧ post-cutover → LOCKED)
 *   • System version distribution (v7.0 vs v7.1)
 *
 * Output: console + writes scripts/V71_LOCK_AUDIT.md
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sakPath)) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.VITE_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
}
const db = admin.firestore();

const argv = process.argv.slice(2);
const DATE_ARG = argv.find(a => a.startsWith('--date='))?.split('=')[1];
const TARGET_DATE = DATE_ARG || new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

const COLLECTIONS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];

(async () => {
  console.log(`\n══════════════════════════════════════════════════════════════════`);
  console.log(`  V7.1 LOCK AUDIT — ${TARGET_DATE} (ET)`);
  console.log(`══════════════════════════════════════════════════════════════════\n`);

  const allSides = [];
  for (const [col, market] of COLLECTIONS) {
    const snap = await db.collection(col).where('date', '==', TARGET_DATE).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK';
      for (const [sideKey, side] of Object.entries(d.sides || {})) {
        const peak = side.peak || side.lock || {};
        const dw = side.v8_walletConsensusDelta ?? null;
        const dq = side.v8_walletConsensusQualityMargin ?? null;
        const sum = (dw != null && dq != null) ? dw + dq : null;
        allSides.push({
          docId: doc.id, sport, market, sideKey,
          team: side.team || sideKey,
          away: d.away, home: d.home, commenceTime: d.commenceTime,
          lockStage: side.lockStage || null,
          health: side.health?.status || (side.lockStage === 'LOCKED' ? 'ACTIVE' : null),
          superseded: !!side.superseded,
          stars: peak.stars ?? null,
          units: peak.units ?? null,
          odds: peak.odds ?? null,
          dw, dq, sum,
          forW: side.v8_walletConsensusForW ?? null,
          agW:  side.v8_walletConsensusAgW ?? null,
          qFor: side.v8_walletConsensusQualityForT30 ?? null,
          qAg:  side.v8_walletConsensusQualityAgT30 ?? null,
          hcDominant: side.v8_hcDominant ?? null,
          hcConfFor: side.v8_hcConfFor ?? null,
          hcConfAg:  side.v8_hcConfAg ?? null,
          lockTier: side.v8_lockTier ?? null,
          systemVersion: side.v8_systemVersion ?? null,
          consensusVersion: side.v8_walletConsensusVersion ?? null,
          promotedBy: side.promotedBy ?? null,
          promotionTriggered: !!side.v8_walletConsensusPromotionTriggered,
          isTopPick: side.v8_topPick ?? null,
          isSuperTopPick: side.v8_superTopPick ?? null,
          totalInvested: peak.totalInvested ?? null,
          contribTier: side.contribTier ?? null,
        });
      }
    }
  }

  console.log(`Total sides scanned: ${allSides.length}`);
  if (!allSides.length) {
    console.log(`\nNo Firestore docs for ${TARGET_DATE}. Nothing to audit.\n`);
    process.exit(0);
  }

  // ─── Partitions ───
  const partition = (label, pred) => {
    const rows = allSides.filter(pred);
    return { label, rows, n: rows.length };
  };

  const isLockedFinal = (s) => s.lockStage === 'LOCKED' && !s.superseded
    && s.health !== 'CANCELLED' && s.health !== 'MUTED'
    && s.lockTier !== 'LEAN';
  const isLeanFinal = (s) => s.lockStage === 'LOCKED' && !s.superseded
    && s.health !== 'CANCELLED' && s.health !== 'MUTED'
    && s.lockTier === 'LEAN';

  const buckets = [
    partition('LOCKED (visible to users)',     isLockedFinal),
    partition('LEAN (locked-stage, 0u track)', isLeanFinal),
    partition('SHADOW',                         s => s.lockStage === 'SHADOW'),
    partition('MUTED (health)',                 s => s.lockStage === 'LOCKED' && s.health === 'MUTED'),
    partition('CANCELLED (health)',             s => s.lockStage === 'LOCKED' && s.health === 'CANCELLED'),
    partition('SUPERSEDED',                     s => s.superseded),
  ];

  console.log('\n── Partition by final state ──');
  for (const b of buckets) console.log(`  ${b.label.padEnd(36)} N=${b.n}`);

  // ─── System version distribution ───
  const v71 = allSides.filter(s => s.systemVersion === '7.1').length;
  const v70 = allSides.filter(s => s.systemVersion === '7.0').length;
  const noVer = allSides.filter(s => s.systemVersion == null).length;
  console.log('\n── v8_systemVersion stamp ──');
  console.log(`  v7.1: ${v71}    v7.0: ${v70}    unstamped: ${noVer}`);

  // ─── HC dominance distribution ───
  const hcD = allSides.filter(s => s.hcDominant === true).length;
  const hcPromoted = allSides.filter(s => s.promotedBy === 'hc-dominance').length;
  console.log('\n── HC dominance (v7.1 only) ──');
  console.log(`  hcDominant: ${hcD}    promotedBy=hc-dominance: ${hcPromoted}`);

  // ─── The headline question: should there be more locked picks? ───
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log(`  AUDIT QUESTIONS`);
  console.log('══════════════════════════════════════════════════════════════════\n');

  const lockedRows = allSides.filter(isLockedFinal);
  const leanRows   = allSides.filter(isLeanFinal);
  const shadowRows = allSides.filter(s => s.lockStage === 'SHADOW');

  console.log(`Q1: How many picks are locked and visible right now?`);
  console.log(`    → ${lockedRows.length}`);
  for (const r of lockedRows) {
    console.log(`      • ${r.sport}/${r.market} ${r.team} @ ${r.odds>0?'+':''}${r.odds} | stars=${r.stars} units=${r.units} Σ=${r.sum} HC=${r.hcDominant} promotedBy=${r.promotedBy} v=${r.systemVersion} ${r.isSuperTopPick?'SUPER':r.isTopPick?'TOP':''}`);
  }

  console.log(`\nQ2: SHADOW sides (sub-floor today) — these are the "should we have locked?" candidates`);
  console.log(`    → ${shadowRows.length} SHADOW`);
  // Promotion-eligible-but-still-shadow is the actually-interesting set:
  // wallet consensus said promote, but lockStage stayed SHADOW. Usually means
  // money floor or a render race kept it from getting written as LOCKED.
  const shadowButPromotable = shadowRows.filter(s => s.promotionTriggered);
  if (shadowButPromotable.length) {
    console.log(`    ⚠ ${shadowButPromotable.length} SHADOW sides have promotionTriggered=true (anomaly):`);
    for (const r of shadowButPromotable) {
      console.log(`      • ${r.sport}/${r.market} ${r.team} | stars=${r.stars} Σ=${r.sum} HC=${r.hcDominant} invested=$${r.totalInvested} contrib=${r.contribTier} lockTier=${r.lockTier}`);
    }
  } else {
    console.log(`    ✓ no SHADOW/promotable conflicts`);
  }

  console.log(`\nQ3: LEAN sides — Σ ∈ {3,4} that did NOT qualify for HC promotion`);
  console.log(`    → ${leanRows.length}`);
  for (const r of leanRows) {
    console.log(`      • ${r.sport}/${r.market} ${r.team} | stars=${r.stars} Σ=${r.sum} (Δw=${r.dw}/Δq=${r.dq}) HC_for=${r.hcConfFor} HC_ag=${r.hcConfAg}`);
  }

  console.log(`\nQ4: Should any LEAN have been HC-promoted? (LEAN ∧ hcDominant=true ∧ v7.1)`);
  const missedHc = leanRows.filter(r => r.hcDominant && r.systemVersion === '7.1');
  if (missedHc.length) {
    console.log(`    ⚠ ${missedHc.length} LEAN-with-HC-dominance — code path didn't fire?`);
    for (const r of missedHc) console.log(`      • ${r.sport}/${r.market} ${r.team}`);
  } else {
    console.log(`    ✓ no missed HC promotions`);
  }

  console.log(`\nQ5: System version on locked picks`);
  for (const r of lockedRows) {
    const flag = r.systemVersion === '7.1' ? '✓ v7.1' :
                 r.systemVersion === '7.0' ? '⚠ pre-cutover stamp on a today pick' :
                 '⚠ unstamped';
    console.log(`    ${flag}  ${r.sport}/${r.market} ${r.team}  consensusVer=${r.consensusVersion}`);
  }

  console.log(`\nQ6: HC chip eligibility — which locked picks should show "HC ×1.5"?`);
  for (const r of lockedRows) {
    const showHc = r.hcDominant && r.systemVersion === '7.1';
    console.log(`    ${showHc ? '★ HC ×1.5' : '  no HC chip'}  ${r.sport}/${r.market} ${r.team}  hcDominant=${r.hcDominant} v=${r.systemVersion}`);
  }

  console.log(`\nQ7: HC-dominant SHADOW sides — HC alone is not enough (still need Δw≥+1 ∧ Δq≥+1 ∧ Σ≥+3)`);
  const hcShadow = shadowRows.filter(s => s.hcDominant);
  if (!hcShadow.length) console.log('    (none)');
  else for (const r of hcShadow) {
    console.log(`      • ${r.sport}/${r.market} ${r.team} | stars=${r.stars} Σ=${r.sum} (Δw=${r.dw}/Δq=${r.dq}) HC=${r.hcConfFor}/${r.hcConfAg}  invested=$${r.totalInvested||0}`);
  }

  console.log(`\nQ8: All SHADOW sides at-a-glance (why nothing else locked)`);
  for (const r of shadowRows) {
    const reason = r.dw == null ? 'no Δw stamp yet'
                 : (r.dw < 1 || r.dq < 1) ? `Δw=${r.dw}/Δq=${r.dq} below floor`
                 : (r.dw + r.dq) < 3 ? `Σ=${r.sum} below +3 floor`
                 : 'unknown';
    console.log(`    ${r.sport}/${r.market} ${r.team.padEnd(20)} | stars=${(r.stars??'—').toString().padEnd(4)} | ${reason}`);
  }

  // ─── Markdown report ───
  const md = [];
  md.push(`# V7.1 Lock Audit — ${TARGET_DATE}`);
  md.push('');
  md.push(`Generated ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET`);
  md.push('');
  md.push(`Total sides scanned: **${allSides.length}**`);
  md.push('');
  md.push('## Partition');
  md.push('| Bucket | N |');
  md.push('|---|---|');
  for (const b of buckets) md.push(`| ${b.label} | ${b.n} |`);
  md.push('');
  md.push('## v7.1 stamp distribution');
  md.push(`| Field | Count |`);
  md.push(`|---|---|`);
  md.push(`| v8_systemVersion = "7.1" | ${v71} |`);
  md.push(`| v8_systemVersion = "7.0" | ${v70} |`);
  md.push(`| (unstamped) | ${noVer} |`);
  md.push(`| hcDominant = true | ${hcD} |`);
  md.push(`| promotedBy = "hc-dominance" | ${hcPromoted} |`);
  md.push('');
  md.push('## Locked picks (visible to users)');
  md.push('| Sport / Market | Side | Stars | Units | Odds | Σ (Δw/Δq) | HC | promotedBy | Version |');
  md.push('|---|---|---|---|---|---|---|---|---|');
  for (const r of lockedRows) {
    md.push(`| ${r.sport} ${r.market} | ${r.team} | ${r.stars} | ${r.units} | ${r.odds>0?'+':''}${r.odds} | ${r.sum} (${r.dw}/${r.dq}) | ${r.hcDominant ? `★ ${r.hcConfFor}/${r.hcConfAg}` : '—'} | ${r.promotedBy || '—'} | ${r.systemVersion || '—'} |`);
  }
  md.push('');
  md.push('## SHADOW sides with promotionTriggered (should-have-locked anomalies)');
  if (shadowButPromotable.length === 0) md.push('_None — no missed locks._');
  else {
    md.push('| Sport / Market | Side | Stars | Σ | HC | Invested | contribTier | lockTier |');
    md.push('|---|---|---|---|---|---|---|---|');
    for (const r of shadowButPromotable) {
      md.push(`| ${r.sport} ${r.market} | ${r.team} | ${r.stars} | ${r.sum} | ${r.hcDominant ? '★' : '—'} | $${r.totalInvested||0} | ${r.contribTier||'—'} | ${r.lockTier||'—'} |`);
    }
  }
  md.push('');
  md.push('## LEAN sides (Σ ∈ {3,4}, no HC)');
  if (leanRows.length === 0) md.push('_None._');
  else {
    md.push('| Sport / Market | Side | Σ | HC_for | HC_ag |');
    md.push('|---|---|---|---|---|');
    for (const r of leanRows) {
      md.push(`| ${r.sport} ${r.market} | ${r.team} | ${r.sum} | ${r.hcConfFor||0} | ${r.hcConfAg||0} |`);
    }
  }
  md.push('');

  const outPath = join(REPO_ROOT, 'V71_LOCK_AUDIT.md');
  writeFileSync(outPath, md.join('\n'));
  console.log(`\n→ wrote ${outPath}`);
  process.exit(0);
})().catch(err => { console.error(err); process.exit(1); });
