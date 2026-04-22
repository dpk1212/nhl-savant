/**
 * probeTodayConsensusAllSports.js
 *
 * End-to-end sanity check for the Phase 2 wallet-consensus deploy.
 *
 *   Part 1 — Whitelist universe
 *     How many wallets are CONFIRMED/FLAT/WR50 per sport today.
 *
 *   Part 2 — sharp_action_positions (raw vault + shadow)
 *     For today, count total positions, unique wallets, and how many of
 *     those wallets are whitelisted for the sport of the bet. This tells
 *     us whether any profitable sharp is on the board today regardless
 *     of whether SharpFlow has locked anything.
 *
 *   Part 3 — sharpFlowPicks/Spreads/Totals
 *     For today, list every side with wallet-consensus details and check
 *     whether the v8_walletConsensus* fields are being stamped.
 *
 * Usage: node scripts/probeTodayConsensusAllSports.js [YYYY-MM-DD]
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!admin.apps.length) {
  const sakPath = join(__dirname, '../serviceAccountKey.json');
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

const todayET = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());
const DATE = process.argv[2] || todayET();

const PICK_COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

(async () => {
  console.log(`\n============================================================`);
  console.log(`  Phase 2 consensus probe — ${DATE}`);
  console.log(`============================================================\n`);

  // ─── Part 1: whitelist universe ───────────────────────────────────
  const profSnap = await db.collection('sharpWalletProfiles').get();
  const PROFILES = new Map();
  const whitelistedBySport = {}; // sport -> Set<walletShort>
  const tierCounts = {};         // sport -> { CONFIRMED, FLAT, WR50 }
  for (const d of profSnap.docs) {
    const p = d.data();
    PROFILES.set(d.id, p);
    const bySport = p?.bySport || {};
    for (const [sport, rec] of Object.entries(bySport)) {
      const t = rec?.whitelistTier;
      if (!t) continue;
      if (!tierCounts[sport]) tierCounts[sport] = { CONFIRMED: 0, FLAT: 0, WR50: 0 };
      if (t === 'CONFIRMED' || t === 'FLAT' || t === 'WR50') tierCounts[sport][t]++;
      if (t === 'CONFIRMED' || t === 'FLAT') {
        (whitelistedBySport[sport] ??= new Set()).add(d.id);
      }
    }
  }
  const isWL = (walletShort, sport) => whitelistedBySport[sport]?.has(walletShort) ?? false;

  console.log(`Part 1 — Whitelist universe (from sharpWalletProfiles, ${PROFILES.size} wallets)\n`);
  console.log(`Sport | CONFIRMED | FLAT | WR50 | whitelisted (C+F)`);
  console.log(`------|-----------|------|------|-------------------`);
  for (const sport of Object.keys(tierCounts).sort()) {
    const t = tierCounts[sport];
    const total = (whitelistedBySport[sport]?.size || 0);
    console.log(`${sport.padEnd(5)} | ${String(t.CONFIRMED).padStart(9)} | ${String(t.FLAT).padStart(4)} | ${String(t.WR50).padStart(4)} | ${String(total).padStart(17)}`);
  }

  // ─── Part 2: sharp_action_positions today ─────────────────────────
  console.log(`\n\nPart 2 — sharp_action_positions for ${DATE} (raw vault + shadow)\n`);
  const posSnap = await db.collection('sharp_action_positions').where('date', '==', DATE).get();
  console.log(`Total position docs: ${posSnap.size}`);

  const byBetKey = new Map();
  const sportPosCounts = {};
  const hitsBySport = {}; // sport -> { wallets: Set, rows: [] }

  for (const doc of posSnap.docs) {
    const d = doc.data();
    const sport = d.sport;
    const walletShort = d.walletShort || (d.wallet || '').slice(-6);
    sportPosCounts[sport] = (sportPosCounts[sport] || 0) + 1;

    // build a bet key (sport + game + market + side) so we can count wallets per bet
    const betKey = `${sport}|${d.gameKey || d.game || '?'}|${d.marketType || '?'}|${d.side || '?'}`;
    if (!byBetKey.has(betKey)) byBetKey.set(betKey, {
      sport, game: d.gameKey, market: d.marketType, side: d.side,
      wallets: new Set(),
      whitelisted: new Set(),
    });
    byBetKey.get(betKey).wallets.add(walletShort);
    if (isWL(walletShort, sport)) {
      byBetKey.get(betKey).whitelisted.add(walletShort);
      (hitsBySport[sport] ??= new Set()).add(walletShort);
    }
  }

  console.log(`\nPositions by sport:`);
  for (const [s, n] of Object.entries(sportPosCounts).sort()) {
    const hits = hitsBySport[s]?.size || 0;
    console.log(`  ${s.padEnd(5)} positions=${String(n).padStart(4)}   whitelisted wallets present today: ${hits}`);
  }

  // Per-bet summary — only print rows where ≥1 whitelisted wallet is on the bet
  const interesting = [...byBetKey.values()]
    .filter(r => r.whitelisted.size > 0)
    .sort((a, b) => b.whitelisted.size - a.whitelisted.size);
  console.log(`\nBets (game × market × side) with ≥1 whitelisted wallet: ${interesting.length}\n`);
  if (interesting.length) {
    console.log(`Sport | Game                        | Market  | Side    | #W  | #WL | Whitelisted wallets (tier)`);
    console.log(`------|-----------------------------|---------|---------|-----|-----|---------------------------`);
    for (const r of interesting) {
      const wlList = [...r.whitelisted].map(w => {
        const tier = PROFILES.get(w)?.bySport?.[r.sport]?.whitelistTier;
        return `${w}(${tier})`;
      }).join(', ');
      console.log(`${r.sport.padEnd(5)} | ${String(r.game).padEnd(27)} | ${String(r.market || '').padEnd(7)} | ${String(r.side || '').padEnd(7)} | ${String(r.wallets.size).padStart(3)} | ${String(r.whitelisted.size).padStart(3)} | ${wlList}`);
    }
  }

  // Compute per-bet Δ (forW − agW) by pairing opposite-side rows
  const sideOpp = { home: 'away', away: 'home', over: 'under', under: 'over' };
  const deltaRows = [];
  for (const r of byBetKey.values()) {
    if (!r.whitelisted.size) continue;
    if (!sideOpp[r.side]) continue;
    const oppKey = `${r.sport}|${r.game}|${r.market}|${sideOpp[r.side]}`;
    const opp = byBetKey.get(oppKey);
    const forW = r.whitelisted.size;
    const agW = opp?.whitelisted?.size || 0;
    const delta = forW - agW;
    const verdict =
      delta >= 2 ? 'STRONG_FOR' :
      delta === 1 ? 'LEAN_FOR' :
      delta === 0 ? 'NEUTRAL' :
      delta === -1 ? 'FADE_WEAK' : 'FADE_STRONG';
    deltaRows.push({ ...r, forW, agW, delta, verdict });
  }
  if (deltaRows.length) {
    console.log(`\nComputed Δ = forW − agW for each whitelisted-bet (what the live consensus layer would see):\n`);
    console.log(`Sport | Game                        | Market  | Side    | forW | agW | Δ   | Verdict`);
    console.log(`------|-----------------------------|---------|---------|------|-----|-----|---------`);
    deltaRows
      .sort((a, b) => b.delta - a.delta)
      .forEach(r => {
        console.log(`${r.sport.padEnd(5)} | ${String(r.game).padEnd(27)} | ${String(r.market || '').padEnd(7)} | ${String(r.side || '').padEnd(7)} | ${String(r.forW).padStart(4)} | ${String(r.agW).padStart(3)} | ${String(r.delta).padStart(3)} | ${r.verdict}`);
      });
  }

  // ─── Part 3: sharpFlowPicks/Spreads/Totals stamping audit ─────────
  console.log(`\n\nPart 3 — sharpFlowPicks/Spreads/Totals stamping audit\n`);
  let totalSides = 0, stamped = 0, withWhitelisted = 0;
  const staleTodo = [];
  for (const [col, mkt] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '==', DATE).get();
    console.log(`${col} — ${snap.size} docs`);
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport;
      for (const [sideKey, side] of Object.entries(d.sides || {})) {
        totalSides++;
        const peak = side.peak || side.lock;
        const wd = peak?.v8Scoring?.walletDetails || [];
        const consensusSide = peak?.v8Scoring?.consensusSide || sideKey;
        const forW = new Set(), agW = new Set();
        for (const w of wd) {
          if (!isWL(w.wallet, sport)) continue;
          if (w.side === consensusSide) forW.add(w.wallet);
          else if (w.side) agW.add(w.wallet);
        }
        if (forW.size + agW.size > 0) withWhitelisted++;
        const version = side.v8_walletConsensusVersion ?? peak?.v8_walletConsensusVersion;
        if (version != null) stamped++;
        const verdict = side.v8_walletConsensusVerdict ?? peak?.v8_walletConsensusVerdict;
        const delta = side.v8_walletConsensusDelta ?? peak?.v8_walletConsensusDelta;
        const stampedForW = side.v8_walletConsensusForW ?? peak?.v8_walletConsensusForW;
        const stampedAgW = side.v8_walletConsensusAgW ?? peak?.v8_walletConsensusAgW;
        const bonus = side.v8_walletConsensusStarBonus ?? peak?.v8_walletConsensusStarBonus;
        const flag = version == null ? 'UNSTAMPED' : 'STAMPED';
        const live = `live forW=${forW.size} agW=${agW.size} Δ=${forW.size - agW.size}`;
        const stampedStr = version != null
          ? `stamped v=${version} ${verdict} Δ=${delta} forW=${stampedForW} agW=${stampedAgW} bonus=${bonus}`
          : '—';
        console.log(`  [${mkt}] ${d.gameKey || doc.id} side=${sideKey} stage=${side.lockStage} stars=${peak?.stars} ${flag}`);
        console.log(`        ${live}   ${stampedStr}`);
        if (version == null && wd.length > 0) staleTodo.push({ col, doc: doc.id, side: sideKey });
      }
    }
  }

  console.log(`\n─── Stamp summary ───`);
  console.log(`Total sides for ${DATE}:   ${totalSides}`);
  console.log(`Stamped w/ v8_walletConsensus*: ${stamped} (${totalSides ? ((stamped/totalSides)*100).toFixed(0) : 0}%)`);
  console.log(`Sides with ≥1 whitelisted wallet in walletDetails: ${withWhitelisted}`);
  if (staleTodo.length) {
    console.log(`\n${staleTodo.length} sides have walletDetails but no stamp — these will get stamped on the next SharpFlow render cycle (or deploy-triggered resync).`);
  }

  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
