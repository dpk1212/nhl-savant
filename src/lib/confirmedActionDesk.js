/**
 * CONFIRMED Action desk — row builder + strength ranking.
 * Observational strength only (no stake units / path stamps).
 */
import { buildFlatDollarQBySport, shortWalletId } from './walletClvSkill.js';

const SPORTS = ['NHL', 'CBB', 'MLB', 'NBA', 'SOC', 'UFC', 'WNBA', 'NFL'];

const SKILL_BAND = {
  1: { key: 'high', label: 'High', weight: 4 },
  2: { key: 'mid', label: 'Mid', weight: 3 },
  3: { key: 'low', label: 'Low', weight: 2 },
  4: { key: 'thin', label: 'Thin', weight: 1 },
};

const SIZE_WEIGHT = { press: 4, full: 3, lean: 2, light: 1 };

export function skillBandFromQ(q) {
  if (q === 1 || q === 2 || q === 3 || q === 4) return SKILL_BAND[q];
  return { key: 'mid', label: 'Mid', weight: 2.5 }; // unscored CONFIRMED → neutral Mid
}

export function sizeBandFromRatio(sr) {
  if (!Number.isFinite(sr)) return { key: 'lean', label: '—', weight: 1.5, ratio: null };
  if (sr >= 1.5) return { key: 'press', label: 'press', weight: SIZE_WEIGHT.press, ratio: sr };
  if (sr >= 1.0) return { key: 'full', label: 'full', weight: SIZE_WEIGHT.full, ratio: sr };
  if (sr >= 0.5) return { key: 'lean', label: 'lean', weight: SIZE_WEIGHT.lean, ratio: sr };
  return { key: 'light', label: 'light', weight: SIZE_WEIGHT.light, ratio: sr };
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

function sizeRatioOf(pos) {
  if (Number.isFinite(pos.v8_sizeRatio)) return Number(pos.v8_sizeRatio);
  const invested = Number(pos.invested || 0);
  const usual = Number(pos.avgSportBet || pos.usualBet || 0);
  if (invested > 0 && usual > 0) return invested / usual;
  return null;
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

function tsMs(pos) {
  const raw = pos.updatedAt || pos.firstSeen || pos.createdAt || pos.ts;
  if (raw == null) return 0;
  if (typeof raw === 'number') return raw < 1e12 ? raw * 1000 : raw;
  if (typeof raw?.toMillis === 'function') return raw.toMillis();
  if (typeof raw?._seconds === 'number') return raw._seconds * 1000;
  const t = Date.parse(raw);
  return Number.isFinite(t) ? t : 0;
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
    const tier = prof?.bySport?.[sport]?.whitelistTier;
    if (tier !== 'CONFIRMED') continue;
    if (pos.status && pos.status !== 'PENDING') continue;

    const side = pos.side;
    if (!side) continue;
    const qMap = qBySport.get(sport) || new Map();
    const q = qMap.get(short) || qMap.get(String(short).toLowerCase()) || null;
    const skill = skillBandFromQ(q);
    const sr = sizeRatioOf(pos);
    const size = sizeBandFromRatio(sr);
    const form = formFromProfile(prof, sport);
    const formDisp = formLabel(form);
    const pin = pinMoveFor(pinnacleHistory, sport, gameKey, side);
    const invested = Number(pos.invested || pos.size || 0) || 0;
    const ts = tsMs(pos);
    const firstSeen = pos.firstSeen || null;

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
      price: pos.avgPrice ?? pos.price ?? null,
      sizeRatio: size.ratio,
      sizeBand: size.key,
      sizeLabel: size.label,
      sizeWeight: size.weight,
      skillKey: skill.key,
      skillLabel: skill.label,
      skillWeight: skill.weight,
      skillQ: q,
      form,
      formText: formDisp.text,
      formKind: formDisp.kind,
      flatCurve: form.flatCurve,
      flatEnd: form.flatEnd,
      pinMove: pin, // 'with' | 'against' | null
      opposed: null, // filled below
      ts,
      firstSeen,
      odds: pos.odds ?? null,
    });
  }

  // Opposition: other CONFIRMED on opposite side of same sport|game|market
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
    const sides = new Set(list.map((r) => r.side));
    for (const r of list) {
      const opp = oppSide[r.side];
      r.opposed = opp && sides.has(opp) ? 'contested' : 'clear';
    }
  }

  for (const r of rows) {
    r.strengthScore = strengthScore(r);
  }

  const stats = {
    total: rows.length,
    highMid: rows.filter((r) => r.skillKey === 'high' || r.skillKey === 'mid').length,
    clear: rows.filter((r) => r.opposed === 'clear').length,
    pinWith: rows.filter((r) => r.pinMove === 'with').length,
  };

  return { rows, qBySport, stats };
}

export function strengthScore(r) {
  let s = 0;
  s += (r.skillWeight || 0) * 100;
  s += (r.sizeWeight || 0) * 20;
  s += r.opposed === 'clear' ? 15 : 0;
  if (r.pinMove === 'with') s += 10;
  else if (r.pinMove === 'against') s -= 8;
  // Recency bump (0–10): fresher within 6h
  if (r.ts) {
    const ageH = (Date.now() - r.ts) / 36e5;
    if (ageH < 6) s += Math.max(0, 10 - ageH * 1.5);
  }
  s += Math.min(5, Math.log10(Math.max(1, r.invested)) - 2);
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
      ts: r.ts,
      skillLabel: r.skillLabel,
      opposed: r.opposed,
    }));
}
