/**
 * walletPipelineAudit.js — end-to-end sanity check of the wallet-tracking
 * stack that drives Sharp Intel's Δw / Δq / lock decisions.
 *
 * Walks every link in the chain and emits WALLET_PIPELINE_AUDIT.md:
 *
 *   §1. Source A — walletDetails coverage on graded v6-era picks
 *        - % of sides with walletDetails stamped (vs missing entirely)
 *        - per-day coverage (any day where stamping silently broke)
 *        - per-sport coverage
 *        - distinct wallets observed in walletDetails
 *
 *   §2. Source B — sharp_action_positions coverage
 *        - GRADED vs PENDING / OPEN
 *        - VAULT vs SHADOW split
 *        - per-day, per-sport coverage
 *        - distinct walletShort observed
 *
 *   §3. Profile collection — sharpWalletProfiles
 *        - count of profiles
 *        - last-updated freshness (if firstBet/lastBet available)
 *        - whitelist tier breakdown (CONFIRMED, FLAT, WR50, null) per sport
 *        - profiles whose bySport tier disagrees with rebuilt-on-the-fly tier
 *          (i.e. stale cache — exportWalletProfiles needs a re-run)
 *
 *   §4. Cross-source reconciliation
 *        - wallets in Source A but missing from sharpWalletProfiles
 *          (these are silently NOT counted in live Δw)
 *        - wallets in profiles but never seen in Source A
 *        - §7b roster growth rebuilt from Source A, then compared against
 *          how many of those wallets currently carry a non-null
 *          whitelistTier in the live profile collection
 *
 *   §5. Live utilization — last 7 days of LOCKED sides
 *        - share of LOCKED sides with Δw > 0 (i.e. at least one
 *          CONFIRMED/FLAT wallet fired)
 *        - sides where Δq > 0 but Δw == 0 (whitelist gap — quality wallets
 *          existed but none were promoted to CONFIRMED/FLAT yet)
 *        - sides whose Δw came from wallets whose live profile tier is now
 *          downgraded (cache lag)
 *
 *   §6. Verdict / action items
 *
 * Usage:
 *   node scripts/walletPipelineAudit.js                 # last 14 days, write MD
 *   node scripts/walletPipelineAudit.js --days=30       # explicit window
 *   node scripts/walletPipelineAudit.js --console-only  # don't write MD
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
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

const argv = process.argv.slice(2);
const flags = argv.filter(a => a.startsWith('--'));
const DAYS_FLAG = flags.find(f => f.startsWith('--days='));
const DAYS = DAYS_FLAG ? parseInt(DAYS_FLAG.split('=')[1], 10) : 14;
const CONSOLE_ONLY = flags.includes('--console-only');

const V6_CUTOVER = '2026-04-18';
const QUALITY_CUT = 30;
const WHITELIST_MIN_BETS = 2;
const COLLECTIONS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };

const todayET = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());
const TODAY = todayET();

const americanToDecimal = (odds) => odds === 0 ? 1.91 : (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
const flatProfit = (odds, won) => won ? americanToDecimal(odds) - 1 : -1;
const r1 = (v) => v == null ? null : Math.round(v * 10) / 10;

// ── §1 + §4 helpers ────────────────────────────────────────────────────
async function loadGradedPicksAndBets() {
  const sides = [];          // every side scanned (with coverage flags)
  const walletBets = [];     // every (game × wallet) bet derived from walletDetails
  const recentLocked = [];   // last-N-days locked sides for §5

  const recentCutoff = (() => {
    const d = new Date(TODAY + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() - 7);
    return d.toISOString().slice(0, 10);
  })();

  for (const [col, market] of COLLECTIONS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK';
      const date = d.date;
      const docSides = d.sides || {};

      let winningSide = null;
      for (const sk of Object.keys(docSides)) {
        const oc = docSides[sk]?.result?.outcome;
        if (oc === 'WIN') { winningSide = sk; break; }
        if (oc === 'LOSS' && OPPOSITE[sk]) { winningSide = OPPOSITE[sk]; break; }
      }

      const seenForBets = new Set();
      for (const [sideKey, side] of Object.entries(docSides)) {
        const peak = side.peak || side.lock || {};
        const wd = peak?.v8Scoring?.walletDetails;
        const oc = side?.result?.outcome;
        const graded = oc === 'WIN' || oc === 'LOSS' || oc === 'PUSH';
        const lockStage = side?.lockStage || null;
        const superseded = !!side.superseded;

        const sideRow = {
          col, market, docId: doc.id, date, sport, sideKey,
          lockStage, superseded,
          outcome: oc || null,
          graded,
          hasWalletDetails: Array.isArray(wd) && wd.length > 0,
          walletDetailsCount: Array.isArray(wd) ? wd.length : 0,
          dwFrozen: side.v8_walletConsensusDelta ?? null,
          dqFrozen: side.v8_walletConsensusQualityMargin ?? null,
          v8Tier: side.v8_lockTier ?? null,
        };
        sides.push(sideRow);

        if (date >= recentCutoff && lockStage === 'LOCKED' && !superseded) {
          recentLocked.push(sideRow);
        }

        if (graded && winningSide && Array.isArray(wd)) {
          for (const w of wd) {
            if (!w.wallet || !w.side) continue;
            const k = `${doc.id}_${w.wallet}`;
            if (seenForBets.has(k)) continue;
            seenForBets.add(k);
            const betSide = docSides[w.side];
            const betOdds = betSide?.peak?.odds ?? betSide?.lock?.odds ?? peak?.odds ?? 0;
            const won = w.side === winningSide ? 1 : 0;
            walletBets.push({
              gameKey: doc.id, date, sport, market,
              wallet: w.wallet,
              invested: Number(w.invested ?? 0),
              contribution: Number(w.contribution ?? 0),
              walletBase: w.walletBase ?? null,
              rank: w.rank ?? null,
              won,
              flat: flatProfit(betOdds, won === 1),
              odds: betOdds,
            });
          }
        }
      }
    }
  }
  return { sides, walletBets, recentLocked };
}

async function loadPositions() {
  const snap = await db.collection('sharp_action_positions').get();
  const all = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!d.wallet) return;
    all.push({
      docId: doc.id,
      date: d.date,
      sport: d.sport,
      market: d.marketType,
      walletShort: d.walletShort || String(d.wallet).slice(-6),
      status: d.status,
      vaultQualified: d.vaultQualified !== false,
      invested: Number(d.invested ?? d.size ?? 0),
      settledPnl: Number(d.settledPnl ?? d.positionPnl ?? 0),
      sportROI: d.sportROI,
      leaderboardRank: d.leaderboardRank,
    });
  });
  return all;
}

async function loadProfiles() {
  const snap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  snap.forEach(doc => profiles.set(doc.id, doc.data()));
  return profiles;
}

// ── stats helpers ─────────────────────────────────────────────────────
function summarizeWalletBets(rows) {
  const byWallet = new Map();
  for (const b of rows) {
    if (!byWallet.has(b.wallet)) byWallet.set(b.wallet, []);
    byWallet.get(b.wallet).push(b);
  }
  const out = [];
  for (const [wallet, bs] of byWallet) {
    const n = bs.length;
    const wins = bs.filter(x => x.won === 1).length;
    const flatPnl = bs.reduce((a, x) => a + (x.flat || 0), 0);
    out.push({
      wallet, n, wins, losses: n - wins,
      wr: n ? +(wins / n * 100).toFixed(1) : 0,
      flatPnl,
      flatRoi: n ? +(flatPnl / n * 100).toFixed(1) : 0,
    });
  }
  return out;
}

function summarizePositions(rows) {
  const byWallet = new Map();
  for (const p of rows) {
    if (!byWallet.has(p.walletShort)) byWallet.set(p.walletShort, []);
    byWallet.get(p.walletShort).push(p);
  }
  const out = [];
  for (const [wallet, ps] of byWallet) {
    const n = ps.length;
    const wins = ps.filter(p => p.settledPnl > 0).length;
    const invested = ps.reduce((a, p) => a + p.invested, 0);
    const pnl = ps.reduce((a, p) => a + p.settledPnl, 0);
    out.push({
      wallet, n, wins,
      wr: n ? +(wins / n * 100).toFixed(1) : 0,
      invested, settledPnl: pnl,
      dollarRoi: invested > 0 ? +(pnl / invested * 100).toFixed(1) : null,
    });
  }
  return out;
}

function classifyTier(picksAgg, posAgg) {
  const flatOk   = (picksAgg?.n ?? 0) >= WHITELIST_MIN_BETS && (picksAgg?.flatRoi ?? 0) > 0;
  const dollarOk = (posAgg?.n   ?? 0) >= WHITELIST_MIN_BETS && posAgg?.dollarRoi != null && posAgg.dollarRoi > 0;
  const wr50Ok   = (picksAgg?.n ?? 0) >= WHITELIST_MIN_BETS && (picksAgg?.wr     ?? 0) >= 50;
  if (flatOk && dollarOk) return 'CONFIRMED';
  if (flatOk) return 'FLAT';
  if (wr50Ok) return 'WR50';
  return null;
}

function fmtPct(num, den) {
  if (!den) return '—';
  return `${(num / den * 100).toFixed(1)}%`;
}

// ── main ──────────────────────────────────────────────────────────────
(async () => {
  console.log(`[walletPipelineAudit] today=${TODAY} window=last ${DAYS} days`);
  console.log('Loading Source A (walletDetails on graded picks)…');
  const { sides, walletBets, recentLocked } = await loadGradedPicksAndBets();

  console.log('Loading Source B (sharp_action_positions)…');
  const positions = await loadPositions();

  console.log('Loading sharpWalletProfiles cache…');
  const profiles = await loadProfiles();

  const out = [];
  out.push('# WALLET PIPELINE AUDIT');
  out.push('');
  out.push(`Generated: **${new Date().toISOString()}** · today=${TODAY} · v6 cutover=${V6_CUTOVER}`);
  out.push(`Window for §5 utilization: last 7 days (since ${(() => { const d = new Date(TODAY + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() - 7); return d.toISOString().slice(0, 10); })()}).`);
  out.push('');
  out.push('---');

  // ─────────────────────────── §1 ──────────────────────────────────────
  out.push('## §1. Source A — walletDetails coverage on graded v6-era picks');
  out.push('');
  const allSides = sides.length;
  const sidesWithWD = sides.filter(s => s.hasWalletDetails).length;
  const gradedSides = sides.filter(s => s.graded).length;
  const gradedWithWD = sides.filter(s => s.graded && s.hasWalletDetails).length;
  out.push('| Metric | Count | Coverage |');
  out.push('|---|---|---|');
  out.push(`| Total v6-era sides scanned | ${allSides} | — |`);
  out.push(`| Sides with walletDetails stamped | ${sidesWithWD} | ${fmtPct(sidesWithWD, allSides)} |`);
  out.push(`| Graded sides | ${gradedSides} | — |`);
  out.push(`| Graded sides with walletDetails | ${gradedWithWD} | ${fmtPct(gradedWithWD, gradedSides)} |`);
  out.push('');

  out.push('### §1a. Per-sport graded coverage');
  out.push('');
  const sportsAll = [...new Set(sides.map(s => s.sport))].sort();
  out.push('| Sport | Graded sides | With walletDetails | Coverage |');
  out.push('|---|---|---|---|');
  for (const sp of sportsAll) {
    const g = sides.filter(s => s.graded && s.sport === sp).length;
    const wd = sides.filter(s => s.graded && s.sport === sp && s.hasWalletDetails).length;
    out.push(`| ${sp} | ${g} | ${wd} | ${fmtPct(wd, g)} |`);
  }
  out.push('');

  out.push('### §1b. Per-date graded coverage (graded sides only, gaps highlighted)');
  out.push('');
  const datesAll = [...new Set(sides.map(s => s.date).filter(Boolean))].sort();
  out.push('| Date | Graded | Stamped | Coverage |');
  out.push('|---|---|---|---|');
  for (const date of datesAll) {
    const g = sides.filter(s => s.graded && s.date === date).length;
    if (!g) continue;
    const wd = sides.filter(s => s.graded && s.date === date && s.hasWalletDetails).length;
    const cov = (wd / g * 100).toFixed(1);
    const flag = wd < g ? ' ⚠️' : '';
    out.push(`| ${date} | ${g} | ${wd} | ${cov}%${flag} |`);
  }
  out.push('');

  const distinctWalletsA = new Set(walletBets.map(b => b.wallet));
  out.push(`**Distinct wallets observed in Source A:** ${distinctWalletsA.size}`);
  out.push('');
  out.push('---');

  // ─────────────────────────── §2 ──────────────────────────────────────
  out.push('## §2. Source B — sharp_action_positions coverage');
  out.push('');
  const total = positions.length;
  const graded = positions.filter(p => p.status === 'GRADED');
  const pending = positions.filter(p => p.status === 'PENDING');
  const open = positions.filter(p => p.status === 'OPEN');
  const vault = graded.filter(p => p.vaultQualified).length;
  const shadow = graded.length - vault;

  out.push('| Metric | Count |');
  out.push('|---|---|');
  out.push(`| Total positions | ${total} |`);
  out.push(`| GRADED | ${graded.length} |`);
  out.push(`| · VAULT-qualified | ${vault} |`);
  out.push(`| · SHADOW | ${shadow} |`);
  out.push(`| PENDING | ${pending.length} |`);
  out.push(`| OPEN | ${open.length} |`);
  out.push(`| Distinct walletShort (any status) | ${new Set(positions.map(p => p.walletShort)).size} |`);
  out.push(`| Distinct walletShort (GRADED only) | ${new Set(graded.map(p => p.walletShort)).size} |`);
  out.push('');

  out.push('### §2a. Per-sport GRADED position coverage');
  out.push('');
  const sportsB = [...new Set(graded.map(p => p.sport))].filter(Boolean).sort();
  out.push('| Sport | GRADED | Distinct wallets | First date | Last date |');
  out.push('|---|---|---|---|---|');
  for (const sp of sportsB) {
    const slice = graded.filter(p => p.sport === sp);
    const wallets = new Set(slice.map(p => p.walletShort));
    const dates = slice.map(p => p.date).filter(Boolean).sort();
    out.push(`| ${sp} | ${slice.length} | ${wallets.size} | ${dates[0] || '—'} | ${dates[dates.length - 1] || '—'} |`);
  }
  out.push('');

  out.push('### §2b. Recent activity (last 7 days)');
  out.push('');
  const cutoff7 = (() => {
    const d = new Date(TODAY + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() - 7);
    return d.toISOString().slice(0, 10);
  })();
  const recentG = graded.filter(p => p.date >= cutoff7);
  out.push(`Positions GRADED on/after ${cutoff7}: **${recentG.length}** (distinct wallets: **${new Set(recentG.map(p => p.walletShort)).size}**).`);
  out.push('');
  out.push('---');

  // ─────────────────────────── §3 ──────────────────────────────────────
  out.push('## §3. Profile collection — sharpWalletProfiles');
  out.push('');
  out.push(`Profiles in collection: **${profiles.size}**`);
  out.push('');

  const tierCount = { CONFIRMED: 0, FLAT: 0, WR50: 0, NULL: 0 };
  const tierBySport = {};       // { sport: { CONFIRMED: n, ... } }
  let totalSportEntries = 0;
  const profileLastDates = [];

  for (const [, p] of profiles) {
    if (p.lastBetDate) profileLastDates.push(p.lastBetDate);
    const bySport = p.bySport || {};
    for (const [sport, rec] of Object.entries(bySport)) {
      totalSportEntries++;
      const t = rec.whitelistTier || 'NULL';
      tierCount[t] = (tierCount[t] || 0) + 1;
      if (!tierBySport[sport]) tierBySport[sport] = { CONFIRMED: 0, FLAT: 0, WR50: 0, NULL: 0 };
      tierBySport[sport][t] = (tierBySport[sport][t] || 0) + 1;
    }
  }

  out.push('### §3a. Whitelist tier breakdown (across all wallet × sport entries)');
  out.push('');
  out.push('| Tier | Count | Share |');
  out.push('|---|---|---|');
  for (const t of ['CONFIRMED', 'FLAT', 'WR50', 'NULL']) {
    out.push(`| ${t} | ${tierCount[t] || 0} | ${fmtPct(tierCount[t] || 0, totalSportEntries)} |`);
  }
  out.push(`| **TOTAL** | **${totalSportEntries}** | 100% |`);
  out.push('');

  out.push('### §3b. Per-sport tier breakdown');
  out.push('');
  out.push('| Sport | CONFIRMED | FLAT | WR50 | NULL | Total |');
  out.push('|---|---|---|---|---|---|');
  for (const sp of Object.keys(tierBySport).sort()) {
    const r = tierBySport[sp];
    const tot = (r.CONFIRMED || 0) + (r.FLAT || 0) + (r.WR50 || 0) + (r.NULL || 0);
    out.push(`| ${sp} | ${r.CONFIRMED || 0} | ${r.FLAT || 0} | ${r.WR50 || 0} | ${r.NULL || 0} | ${tot} |`);
  }
  out.push('');

  // Profile freshness — when was the latest pick a profile saw?
  profileLastDates.sort();
  const freshness = {
    today: profileLastDates.filter(d => d === TODAY).length,
    yesterday: profileLastDates.filter(d => {
      const dd = new Date(TODAY + 'T00:00:00Z');
      dd.setUTCDate(dd.getUTCDate() - 1);
      return d === dd.toISOString().slice(0, 10);
    }).length,
    last7d: profileLastDates.filter(d => d >= cutoff7).length,
    older: profileLastDates.filter(d => d < cutoff7).length,
  };
  out.push('### §3c. Profile freshness (lastBetDate)');
  out.push('');
  out.push('| Bucket | # Profiles |');
  out.push('|---|---|');
  out.push(`| lastBetDate = today (${TODAY}) | ${freshness.today} |`);
  out.push(`| lastBetDate = yesterday | ${freshness.yesterday} |`);
  out.push(`| lastBetDate within last 7d | ${freshness.last7d} |`);
  out.push(`| lastBetDate older than 7d | ${freshness.older} |`);
  out.push('');
  out.push('---');

  // ─────────────────────────── §4 ──────────────────────────────────────
  out.push('## §4. Cross-source reconciliation');
  out.push('');

  // §4a: Wallets in A but not in profiles
  const profileShorts = new Set(profiles.keys());
  const walletShortsInA = new Set(distinctWalletsA);
  const inAButNotProfile = [...walletShortsInA].filter(w => !profileShorts.has(w));
  const inProfileButNotA = [...profileShorts].filter(w => !walletShortsInA.has(w));

  out.push('### §4a. Wallet set diff (Source A vs sharpWalletProfiles)');
  out.push('');
  out.push('| Direction | Count |');
  out.push('|---|---|');
  out.push(`| Wallets in Source A (graded picks) AND in profiles | ${[...walletShortsInA].filter(w => profileShorts.has(w)).length} |`);
  out.push(`| Wallets in Source A but **MISSING from profiles** | ${inAButNotProfile.length} ⚠️ |`);
  out.push(`| Wallets in profiles but never seen in Source A | ${inProfileButNotA.length} |`);
  out.push('');
  if (inAButNotProfile.length) {
    out.push('Sample of missing wallets (these silently DO NOT contribute to Δw):');
    out.push('');
    out.push('| WalletShort | N bets in A | First date | Last date |');
    out.push('|---|---|---|---|');
    const missing = inAButNotProfile.map(w => {
      const bs = walletBets.filter(x => x.wallet === w);
      const dates = bs.map(b => b.date).sort();
      return { wallet: w, n: bs.length, first: dates[0], last: dates[dates.length - 1] };
    }).sort((a, b) => b.n - a.n).slice(0, 20);
    for (const m of missing) {
      out.push(`| ${m.wallet} | ${m.n} | ${m.first} | ${m.last} |`);
    }
    out.push('');
  }

  // §4b: rebuild whitelist from current Source A + Source B and compare to stored
  const reBySportTier = { CONFIRMED: 0, FLAT: 0, WR50: 0, NULL: 0 };
  const rebuiltBySport = {};   // sport → { wallet → tier }
  const allWalletShorts = new Set([...walletShortsInA, ...positions.map(p => p.walletShort)]);
  for (const w of allWalletShorts) {
    const aBets = walletBets.filter(b => b.wallet === w);
    const bPos = positions.filter(p => p.walletShort === w && p.status === 'GRADED');
    const aBySport = {};
    for (const b of aBets) {
      if (!aBySport[b.sport]) aBySport[b.sport] = [];
      aBySport[b.sport].push(b);
    }
    const bBySport = {};
    for (const p of bPos) {
      if (!bBySport[p.sport]) bBySport[p.sport] = [];
      bBySport[p.sport].push(p);
    }
    const allSports = new Set([...Object.keys(aBySport), ...Object.keys(bBySport)]);
    for (const sport of allSports) {
      const aRow = summarizeWalletBets(aBySport[sport] || [])[0];
      const bRow = summarizePositions(bBySport[sport] || [])[0];
      const tier = classifyTier(aRow, bRow);
      reBySportTier[tier || 'NULL']++;
      if (!rebuiltBySport[sport]) rebuiltBySport[sport] = new Map();
      rebuiltBySport[sport].set(w, tier);
    }
  }

  out.push('### §4b. Whitelist tier rebuilt LIVE vs stored in `sharpWalletProfiles`');
  out.push('');
  out.push('Stored (per §3a) | Live-rebuild (right now from current Source A + B)');
  out.push('');
  out.push('| Tier | Stored | Live-rebuild | Δ |');
  out.push('|---|---|---|---|');
  for (const t of ['CONFIRMED', 'FLAT', 'WR50', 'NULL']) {
    const stored = tierCount[t] || 0;
    const live = reBySportTier[t] || 0;
    const delta = live - stored;
    const flag = Math.abs(delta) >= 3 ? ' ⚠️' : '';
    out.push(`| ${t} | ${stored} | ${live} | ${delta >= 0 ? '+' + delta : delta}${flag} |`);
  }
  out.push('');
  out.push('Big positive deltas in CONFIRMED/FLAT mean the stored cache is missing wallets that should be promoted — re-run `node scripts/exportWalletProfiles.js --write-firebase`.');
  out.push('');
  out.push('---');

  // ─────────────────────────── §5 ──────────────────────────────────────
  out.push('## §5. Live utilization — last 7 days of LOCKED sides');
  out.push('');
  const lockedTotal = recentLocked.length;
  const withDw = recentLocked.filter(s => Number.isFinite(s.dwFrozen) && s.dwFrozen > 0);
  const withoutDw = recentLocked.filter(s => Number.isFinite(s.dwFrozen) && s.dwFrozen <= 0);
  const dwButNoDq = withDw.filter(s => Number.isFinite(s.dqFrozen) && s.dqFrozen <= 0);
  const dqButNoDw = recentLocked.filter(s => Number.isFinite(s.dqFrozen) && s.dqFrozen > 0 && (!Number.isFinite(s.dwFrozen) || s.dwFrozen <= 0));

  out.push('| Metric | Count | Share |');
  out.push('|---|---|---|');
  out.push(`| Locked sides (last 7d) | ${lockedTotal} | — |`);
  out.push(`| · Δw > 0 (whitelist fired) | ${withDw.length} | ${fmtPct(withDw.length, lockedTotal)} |`);
  out.push(`| · Δw ≤ 0 (locked despite no whitelist support) | ${withoutDw.length} | ${fmtPct(withoutDw.length, lockedTotal)} ⚠️ |`);
  out.push(`| · Δw > 0 ∧ Δq ≤ 0 (whitelist for, quality against) | ${dwButNoDq.length} | ${fmtPct(dwButNoDq.length, lockedTotal)} |`);
  out.push(`| · Δq > 0 ∧ Δw ≤ 0 (quality only — whitelist gap) | ${dqButNoDw.length} | ${fmtPct(dqButNoDw.length, lockedTotal)} |`);
  out.push('');

  if (dqButNoDw.length) {
    out.push('Sample sides where the live engine had Δq > 0 but Δw = 0 (potential whitelist gap):');
    out.push('');
    out.push('| Date | Sport | Market | Side | docId | Δw | Δq | tier |');
    out.push('|---|---|---|---|---|---|---|---|');
    for (const s of dqButNoDw.slice(0, 15)) {
      out.push(`| ${s.date} | ${s.sport} | ${s.market} | ${s.sideKey} | \`${s.docId.slice(-30)}\` | ${s.dwFrozen} | ${s.dqFrozen} | ${s.v8Tier ?? '—'} |`);
    }
    out.push('');
  }

  out.push('---');

  // ─────────────────────────── §6 verdict ──────────────────────────────
  out.push('## §6. Verdict & action items');
  out.push('');
  const issues = [];
  const wins = [];

  const aCov = gradedSides ? gradedWithWD / gradedSides : 1;
  if (aCov < 0.95) issues.push(`Source A coverage is only ${(aCov*100).toFixed(1)}% on graded sides — \`peak.v8Scoring.walletDetails\` is missing on **${gradedSides - gradedWithWD}** graded sides. Some §7b counts are undercounting wallets.`);
  else wins.push(`Source A coverage is **${(aCov*100).toFixed(1)}%** — walletDetails is being stamped reliably.`);

  if (graded.length === 0) issues.push(`Source B (\`sharp_action_positions\`) has **0 GRADED rows** — the position pipeline is dead and live profile rebuilds will produce no CONFIRMED tier (only FLAT or null).`);
  else wins.push(`Source B has **${graded.length}** graded positions across **${new Set(graded.map(p => p.walletShort)).size}** distinct wallets.`);

  if (recentG.length === 0) issues.push(`No GRADED \`sharp_action_positions\` in the last 7 days — the position grader is stale; CONFIRMED tier won't refresh.`);

  const liveConfirmed = reBySportTier.CONFIRMED || 0;
  const storedConfirmed = tierCount.CONFIRMED || 0;
  if (liveConfirmed - storedConfirmed >= 3) issues.push(`Live rebuild has **+${liveConfirmed - storedConfirmed}** more CONFIRMED entries than the stored profiles — the profile cache is stale. Re-run \`exportWalletProfiles.js --write-firebase\`.`);

  if (inAButNotProfile.length >= 5) issues.push(`**${inAButNotProfile.length}** wallets appear in graded picks (Source A) but have no entry in \`sharpWalletProfiles\`. They never count toward Δw. Fix by re-running the profile export.`);

  if (lockedTotal > 0) {
    const dwFireRate = withDw.length / lockedTotal;
    if (dwFireRate < 0.50) issues.push(`Only ${(dwFireRate*100).toFixed(0)}% of last-7d LOCKED sides had Δw > 0. The whitelist isn't firing on most locks — likely small whitelist or stale tiers.`);
    else wins.push(`${(dwFireRate*100).toFixed(0)}% of last-7d LOCKED sides had Δw > 0 — whitelist is firing on the majority of locks.`);
  }

  if (wins.length) {
    out.push("### What's working");
    out.push('');
    for (const w of wins) out.push(`- ✓ ${w}`);
    out.push('');
  }

  if (issues.length) {
    out.push('### Action items');
    out.push('');
    for (const i of issues) out.push(`- ⚠ ${i}`);
    out.push('');
  } else {
    out.push('### No issues detected.');
    out.push('');
  }

  // ─────────────────────────── write ────────────────────────────────────
  const md = out.join('\n');
  if (!CONSOLE_ONLY) {
    const path = join(__dirname, '..', 'WALLET_PIPELINE_AUDIT.md');
    writeFileSync(path, md);
    console.log(`\nWrote ${path}`);
  }
  console.log('\n=== Headlines ===');
  console.log(`Source A graded coverage:   ${gradedWithWD}/${gradedSides} (${(aCov*100).toFixed(1)}%)`);
  console.log(`Source B graded positions:  ${graded.length} (last 7d: ${recentG.length})`);
  console.log(`Profiles in collection:     ${profiles.size}`);
  console.log(`Tier breakdown (stored):    CONFIRMED=${tierCount.CONFIRMED} FLAT=${tierCount.FLAT} WR50=${tierCount.WR50} NULL=${tierCount.NULL}`);
  console.log(`Tier breakdown (live):      CONFIRMED=${reBySportTier.CONFIRMED} FLAT=${reBySportTier.FLAT} WR50=${reBySportTier.WR50} NULL=${reBySportTier.NULL}`);
  console.log(`Wallets in A missing profile: ${inAButNotProfile.length}`);
  console.log(`Last-7d LOCKED sides:       ${lockedTotal} (Δw>0: ${withDw.length}, Δw≤0: ${withoutDw.length}, Δq>0∧Δw=0: ${dqButNoDw.length})`);
  console.log(`\nIssues: ${issues.length}, Wins: ${wins.length}`);

  process.exit(0);
})().catch(err => {
  console.error('[walletPipelineAudit] FATAL', err);
  process.exit(1);
});
