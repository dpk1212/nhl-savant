/**
 * CONFIRMED Action desk — row builder + strength ranking.
 * Observational strength only (no stake units / path stamps).
 */
import { buildFlatDollarQBySport, shortWalletId, CLV_SKILL_MIN_N } from './walletClvSkill.js';
import {
  lookupSharpTierCellStats,
  formatSharpTierCellHist,
  tierLetterFromQ,
} from './sharpTierCellStats.js';
import { sportBookForDisplay } from './walletSportBook.js';

const SPORTS = ['NHL', 'CBB', 'MLB', 'NBA', 'SOC', 'UFC', 'WNBA', 'NFL'];

/** Action tape = CONFIRMED only (FLAT wins less — kept off this board). */
const ACTION_TIERS = new Set(['CONFIRMED']);
/** writeSharpActions SHADOW floor — token bets don't count as opposed money. */
const MODEL_MIN_SIZE = 0.10;

/** Sharp tier = ROI rank among CONFIRMED in-sport (flat+dollar) — not win rate. */
const SKILL_BAND = {
  1: { key: 'high', label: 'A', weight: 4 },
  2: { key: 'mid', label: 'B', weight: 3 },
  3: { key: 'low', label: 'C', weight: 2 },
  4: { key: 'bottom', label: 'D', weight: 1 },
};

/** Missing flatDollar Q (sport <4 scored, or no flat+$ ROIs) — not a quartile. */
const SKILL_THIN = { key: 'thin', label: 'Thin sample', weight: 1.5 };

const SIZE_WEIGHT = { press: 4, full: 3, lean: 2, light: 1 };

export function skillBandFromQ(q) {
  if (q === 1 || q === 2 || q === 3 || q === 4) return SKILL_BAND[q];
  return SKILL_THIN;
}

export function sizeBandFromRatio(sr) {
  if (!Number.isFinite(sr)) return { key: 'lean', label: 'usual', weight: 1.5, ratio: null };
  if (sr >= 1.5) return { key: 'press', label: 'press', weight: SIZE_WEIGHT.press, ratio: sr };
  if (sr >= 1.0) return { key: 'full', label: 'usual', weight: SIZE_WEIGHT.full, ratio: sr };
  if (sr >= 0.5) return { key: 'lean', label: 'lean', weight: SIZE_WEIGHT.lean, ratio: sr };
  return { key: 'light', label: 'light', weight: SIZE_WEIGHT.light, ratio: sr };
}

/** Counted proven ticket (not a SHADOW/token bet). */
export function isCountedProvenSize(sizeRatio) {
  if (!Number.isFinite(sizeRatio)) return true; // legacy / unknown → count
  return sizeRatio >= MODEL_MIN_SIZE;
}

function profileFor(walletProfiles, short) {
  if (!walletProfiles || !short) return null;
  const s = String(short).toLowerCase();
  if (typeof walletProfiles.get === 'function') {
    return walletProfiles.get(s)
      || walletProfiles.get(s.toUpperCase())
      || walletProfiles.get(short)
      || null;
  }
  return walletProfiles[s] || walletProfiles[short] || null;
}

/** Model / filter size — stamped cross-sport usual (do not change for display). */
function sizeRatioOf(pos) {
  if (Number.isFinite(pos.v8_sizeRatio)) return Number(pos.v8_sizeRatio);
  const invested = Number(pos.invested || 0);
  const usual = Number(pos.avgSportBet || pos.usualBet || 0);
  if (invested > 0 && usual > 0) return invested / usual;
  return null;
}

/**
 * Display-only: invested / this wallet's average stake *in this sport*
 * (bySport.positions). Falls back to model sizeRatio when sport usual unknown.
 */
function sportDisplaySizeRatio(pos, prof, sport) {
  const invested = Number(pos.invested || pos.size || 0);
  const rec = prof?.bySport?.[sport]?.positions;
  const n = Number(rec?.n) || 0;
  const sportInvested = Number(rec?.invested);
  if (invested > 0 && n > 0 && Number.isFinite(sportInvested) && sportInvested > 0) {
    const usual = sportInvested / n;
    if (usual > 0) return invested / usual;
  }
  return sizeRatioOf(pos);
}

function teamLabel(gd, side) {
  if (side === 'draw') return 'Draw';
  if (side === 'over') return 'Over';
  if (side === 'under') return 'Under';
  const raw = side === 'away' ? (gd.away || gd.awayTeam) : (gd.home || gd.homeTeam);
  if (!raw) return side;
  const parts = String(raw).trim().split(/\s+/);
  return parts[parts.length - 1] || raw;
}

function pinMoveFor(pinnacleHistory, sport, gameKey, side) {
  const g = pinnacleHistory?.[sport]?.[gameKey];
  const dir = g?.movement?.direction;
  if (!dir || !side) return null;
  if (side === 'over' || side === 'under') return null; // ML movement only for now
  if (dir === side) return 'with';
  if (dir === 'away' || dir === 'home') return 'against';
  return null;
}

function formFromProfile(prof, sport) {
  const rec = prof?.bySport?.[sport];
  const form = rec?.form;
  if (form && (form.l10 || form.flatCurve)) {
    return {
      l5: form.l5 || null,
      l10: form.l10 || null,
      flatCurve: Array.isArray(form.flatCurve) ? form.flatCurve : null,
      flatEnd: Number.isFinite(form.flatEnd) ? form.flatEnd : null,
      book: null,
      source: 'form',
    };
  }
  const picks = rec?.picks;
  if (picks && (picks.n || 0) > 0) {
    return {
      l5: null,
      l10: null,
      flatCurve: null,
      flatEnd: Number.isFinite(picks.flatPnl) ? picks.flatPnl : null,
      book: { w: picks.wins || 0, l: picks.losses || 0, n: picks.n || 0 },
      source: 'book',
    };
  }
  return { l5: null, l10: null, flatCurve: null, flatEnd: null, book: null, source: null };
}

function formLabel(form) {
  if (form?.l10 && (form.l10.w + form.l10.l) > 0) {
    return { text: `L10 ${form.l10.w}-${form.l10.l}`, kind: 'l10' };
  }
  if (form?.l5 && (form.l5.w + form.l5.l) > 0) {
    return { text: `L5 ${form.l5.w}-${form.l5.l}`, kind: 'l5' };
  }
  if (form?.book && form.book.n > 0) {
    return { text: `Book ${form.book.w}-${form.book.l}`, kind: 'book' };
  }
  return { text: '—', kind: null };
}

/**
 * Same “Why we trust them” spine as LockedClarity / receipts:
 * stronger of Source A (picks) vs Source B (positions), plus beat-close %.
 */
function trustFromProfile(prof, sport) {
  const book = sportBookForDisplay(prof?.bySport?.[sport]);
  const wins = Number(book?.wins);
  const losses = Number(book?.losses);
  const n = Number(book?.n) || 0;
  const wr = Number(book?.wr);
  const roi = Number(book?.roi);

  const clvN = Number(prof?.clvSkill?.n) || 0;
  const clvPct = Number(prof?.clvSkill?.pctPos);
  const priorClvPct = (clvN >= CLV_SKILL_MIN_N && Number.isFinite(clvPct))
    ? Math.round(clvPct)
    : null;

  const record = (n > 0 && Number.isFinite(wins) && Number.isFinite(losses))
    ? `${wins}-${losses}`
    : null;

  if (!record && !Number.isFinite(priorClvPct) && !Number.isFinite(roi)) return null;
  return {
    record,
    wr: Number.isFinite(wr) ? Math.round(wr) : null,
    roi: Number.isFinite(roi) ? Math.round(roi) : null,
    priorClvPct,
    bookN: n,
    bookKind: book?.kind || null,
  };
}

function parseTs(raw) {
  if (raw == null) return 0;
  if (typeof raw === 'number') return raw < 1e12 ? raw * 1000 : raw;
  if (typeof raw?.toMillis === 'function') return raw.toMillis();
  if (typeof raw?._seconds === 'number') return raw._seconds * 1000;
  const t = Date.parse(raw);
  return Number.isFinite(t) ? t : 0;
}

/** Prefer first-seen / entry time over last update. */
function entryTsMs(pos) {
  return parseTs(pos.firstSeen || pos.createdAt || pos.entryAt || pos.ts || pos.updatedAt);
}

/** Polymarket price → 0–1 probability (handles 0–1 or 1–100¢). */
function normalizeProb(price) {
  const p = Number(price);
  if (!Number.isFinite(p) || p <= 0) return null;
  if (p <= 1) return p;
  if (p <= 100) return p / 100;
  return null;
}

function probToAmerican(p) {
  if (p == null || !Number.isFinite(p) || p <= 0 || p >= 1) return null;
  if (p >= 0.5) return Math.round((-100 * p) / (1 - p));
  return Math.round((100 * (1 - p)) / p);
}

function fmtAmerican(odds) {
  if (!Number.isFinite(odds)) return null;
  return odds > 0 ? `+${odds}` : `${odds}`;
}

function collectPositions(feed, marketType) {
  const out = [];
  if (!feed || typeof feed !== 'object') return out;
  for (const sport of SPORTS) {
    const games = feed[sport];
    if (!games || typeof games !== 'object') continue;
    for (const [gameKey, gd] of Object.entries(games)) {
      const list = gd?.positions || [];
      for (const p of list) {
        out.push({ sport, gameKey, gd, marketType, pos: p });
      }
    }
  }
  return out;
}

/**
 * @returns {{ rows: object[], qBySport: Map, stats: object }}
 */
export function buildConfirmedActionRows({
  sharpPositions,
  spreadPositions,
  totalPositions,
  walletProfiles,
  pinnacleHistory,
  cellStatsTable = null,
} = {}) {
  const qBySport = buildFlatDollarQBySport(walletProfiles);
  const raw = [
    ...collectPositions(sharpPositions, 'ML'),
    ...collectPositions(spreadPositions, 'SPREAD'),
    ...collectPositions(totalPositions, 'TOTAL'),
  ];

  const rows = [];
  for (const { sport, gameKey, gd, marketType, pos } of raw) {
    const short = shortWalletId(pos.walletShort || pos.wallet);
    if (!short) continue;
    const prof = profileFor(walletProfiles, short);
    const tier = String(prof?.bySport?.[sport]?.whitelistTier || '').toUpperCase();
    if (!ACTION_TIERS.has(tier)) continue;
    if (pos.status && pos.status !== 'PENDING') continue;

    const side = pos.side;
    if (!side) continue;
    const qMap = qBySport.get(sport) || new Map();
    const q = qMap.get(short) || qMap.get(String(short).toLowerCase()) || null;
    const skill = skillBandFromQ(q);
    const sr = sizeRatioOf(pos);
    const size = sizeBandFromRatio(sr);
    const dispSr = sportDisplaySizeRatio(pos, prof, sport);
    const dispSize = sizeBandFromRatio(dispSr);
    const counted = isCountedProvenSize(sr);
    const form = formFromProfile(prof, sport);
    const formDisp = formLabel(form);
    const pin = pinMoveFor(pinnacleHistory, sport, gameKey, side);
    const invested = Number(pos.invested || pos.size || 0) || 0;
    const ts = entryTsMs(pos);
    const rawPrice = pos.entryAvgPrice ?? pos.avgPrice ?? pos.price ?? null;
    const prob = normalizeProb(rawPrice);
    const cents = prob != null ? Math.round(prob * 100) : null;
    const americanOdds = Number.isFinite(pos.odds)
      ? Math.round(pos.odds)
      : probToAmerican(prob);

    rows.push({
      id: `${sport}|${gameKey}|${marketType}|${short}|${side}`,
      sport,
      gameKey,
      marketType,
      side,
      team: teamLabel(gd, side),
      away: gd.away || gd.awayTeam || null,
      home: gd.home || gd.homeTeam || null,
      walletShort: short,
      invested,
      price: prob,
      cents,
      americanOdds,
      americanLabel: fmtAmerican(americanOdds),
      sizeRatio: size.ratio,
      sizeBand: size.key,
      sizeLabel: size.label,
      sizeWeight: size.weight,
      // UI only — sport-local usual. Filters/Best math still use sizeRatio.
      displaySizeRatio: dispSize.ratio,
      displaySizeBand: dispSize.key,
      displaySizeLabel: dispSize.label,
      whitelistTier: tier,
      counted,
      skillKey: skill.key,
      skillLabel: skill.label,
      skillWeight: skill.weight,
      skillQ: q,
      form,
      formText: formDisp.text,
      formKind: formDisp.kind,
      flatCurve: form.flatCurve,
      flatEnd: form.flatEnd,
      trust: trustFromProfile(prof, sport),
      pinMove: pin, // 'with' | 'against' | null
      opposed: null, // filled below
      opposedBy: 0,
      ts,
      firstSeen: pos.firstSeen || null,
      odds: americanOdds,
    });
  }

  // Opposition: other counted CONFIRMED (≥0.10×) on opposite side.
  const byCluster = new Map();
  for (const r of rows) {
    const k = `${r.sport}|${r.gameKey}|${r.marketType}`;
    if (!byCluster.has(k)) byCluster.set(k, []);
    byCluster.get(k).push(r);
  }
  const oppSide = {
    away: 'home', home: 'away', over: 'under', under: 'over', draw: null,
  };
  for (const list of byCluster.values()) {
    for (const r of list) {
      const opp = oppSide[r.side];
      if (!opp) {
        r.opposed = 'clear';
        r.opposedBy = 0;
        continue;
      }
      const foes = list.filter((x) => x.side === opp && x.counted);
      r.opposedBy = foes.length;
      r.opposed = foes.length > 0 ? 'contested' : 'clear';
    }
  }

  for (const r of rows) {
    r.strengthScore = strengthScore(r);
    const tier = tierLetterFromQ(r.skillQ);
    const hit = lookupSharpTierCellStats({
      tier,
      sizeBand: r.sizeBand,
      unopposed: r.opposed === 'clear',
    }, cellStatsTable);
    r.cellHist = hit;
    r.cellHistText = formatSharpTierCellHist(hit);
  }

  const stats = {
    total: rows.length,
    highMid: rows.filter((r) => r.skillKey === 'high' || r.skillKey === 'mid').length,
    clear: rows.filter((r) => r.opposed === 'clear').length,
    pinWith: rows.filter((r) => r.pinMove === 'with').length,
  };

  return { rows, qBySport, stats };
}

/**
 * "Best" ≈ researched edge order, not raw conviction theatre.
 * Spine: CONFIRMED flatDollar Q1 × sized (≥0.5×) × unopposed, then pin/form/price.
 * Uses model sizeRatio (cross-sport stamp) — display size is separate.
 */
export function strengthScore(r) {
  let s = 0;

  // Skill quartile (flat$ peer rank) — Q1 carried the as-of edge
  if (r.skillKey === 'high') s += 100;
  else if (r.skillKey === 'mid') s += 42;
  else if (r.skillKey === 'low') s += 12;
  else if (r.skillKey === 'bottom') s += 0;
  else s += 8; // thin sample

  // Size vs usual (model) — Q1 promote floor was ≥0.5×; light tickets are weak
  const sr = Number(r.sizeRatio);
  if (Number.isFinite(sr)) {
    if (sr >= 1.5) s += 55;
    else if (sr >= 1.0) s += 48;
    else if (sr >= 0.5) s += 38;
    else if (sr >= 0.25) s += 6;
    else s -= 28;
  } else {
    s -= 8;
  }

  // Field — unopposed helps; contested is soft (Q1 survived opposition in research)
  if (r.opposed === 'clear') s += 28;
  else s -= 6;

  if (r.pinMove === 'with') s += 14;
  else if (r.pinMove === 'against') s -= 16;

  // Recent form — secondary signal
  const wr = formWinRate(r);
  if (wr > 0) s += (wr - 0.5) * 36;

  // Entry price — favorites cash more often (modest; not the edge story)
  if (Number.isFinite(r.price) && r.price > 0 && r.price < 1) {
    s += (r.price - 0.5) * 18;
  }

  // Freshness (small)
  if (r.ts) {
    const ageH = (Date.now() - r.ts) / 36e5;
    if (ageH < 6) s += Math.max(0, 5 - ageH * 0.7);
  }

  return s;
}

export function sortActionRows(rows, mode = 'strength') {
  const list = [...rows];
  const cmp = {
    strength: (a, b) => (b.strengthScore - a.strengthScore) || (b.invested - a.invested),
    size: (a, b) => (b.sizeRatio || 0) - (a.sizeRatio || 0) || (b.invested - a.invested),
    skill: (a, b) => (b.skillWeight - a.skillWeight) || (b.strengthScore - a.strengthScore),
    form: (a, b) => {
      const ar = formWinRate(a);
      const br = formWinRate(b);
      return br - ar || (b.flatEnd || 0) - (a.flatEnd || 0);
    },
    trend: (a, b) => (b.flatEnd || -999) - (a.flatEnd || -999),
    recency: (a, b) => (b.ts || 0) - (a.ts || 0),
    dollars: (a, b) => b.invested - a.invested,
  };
  list.sort(cmp[mode] || cmp.strength);
  return list;
}

function formWinRate(r) {
  const f = r.form;
  if (f?.l10 && (f.l10.w + f.l10.l) > 0) return f.l10.w / (f.l10.w + f.l10.l);
  if (f?.l5 && (f.l5.w + f.l5.l) > 0) return f.l5.w / (f.l5.w + f.l5.l);
  if (f?.book && f.book.n > 0) return f.book.w / f.book.n;
  return 0;
}

export function filterActionRows(rows, {
  sport = 'All',
  highMidOnly = false,
  sizedOnly = false,
  clearOnly = false,
  pinWithOnly = false,
} = {}) {
  return rows.filter((r) => {
    if (sport && sport !== 'All' && sport !== 'ALL' && r.sport !== sport) return false;
    if (highMidOnly && r.skillKey !== 'high' && r.skillKey !== 'mid') return false;
    if (sizedOnly && !(Number.isFinite(r.sizeRatio) && r.sizeRatio >= 0.5)) return false;
    if (clearOnly && r.opposed !== 'clear') return false;
    if (pinWithOnly && r.pinMove !== 'with') return false;
    return true;
  });
}

/** Marquee items for the CONFIRMED Action strip. */
export function buildConfirmedActionMarquee(rows, limit = 18) {
  return [...rows]
    .filter((r) => r.invested >= 500)
    .sort((a, b) => (b.ts || 0) - (a.ts || 0))
    .slice(0, limit)
    .map((r) => ({
      sport: r.sport,
      team: r.team,
      invested: r.invested,
      price: r.price,
      cents: r.cents,
      americanLabel: r.americanLabel,
      ts: r.ts,
      skillLabel: r.skillLabel,
      opposed: r.opposed,
    }));
}
