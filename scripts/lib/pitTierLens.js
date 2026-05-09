// Point-in-time wallet-tier lens. Replays bet + position events
// chronologically and exposes `tierAsOf(walletKey, sport, date)` so
// downstream analysis can ask "what tier was this wallet on the date
// this pick was scored?" without leaking any look-ahead.
//
// Tier rules mirror production (`scripts/dailyV6Report.js → buildTierLens`):
//   • CONFIRMED — flat-positive in Source A (≥2 graded bets) AND
//                 dollar-positive in Source B (≥2 graded positions).
//   • FLAT      — flat-positive in Source A (≥2 graded bets).
//   • WR50      — leading indicator: ≥2 bets with WR ≥ 50% in Source A.
//
// `strict` controls whether same-date events count toward the tier:
//   • strict=true  → only events with date < pickDate contribute
//                    (use this for honest backtests of pick-date scoring)
//   • strict=false → events with date <= pickDate count (production behavior)
//
// The `profiles` map (walletShort → profile) is used only for canonical
// address resolution, so Source-A (walletShort) and Source-B (full address
// or short) records collapse onto the same wallet key.

export function buildCanonicalizer(profiles) {
  const map = new Map();
  for (const [key, p] of profiles) {
    const full = p?.walletAddress || null;
    map.set(key, full || key);
    if (full) {
      map.set(full, full);
      map.set(full.slice(-6).toLowerCase(), full);
    }
  }
  return (k) => map.get(k) || k;
}

export function buildPitTierLens(walletBets, positionRows, profiles, { strict = true } = {}) {
  const canonicalize = buildCanonicalizer(profiles);

  const events = [];
  for (const b of walletBets) {
    if (!b?.sport || !b?.wallet || !b?.date) continue;
    events.push({
      date: b.date,
      sport: b.sport,
      canonical: canonicalize(b.wallet),
      source: 'A',
      payload: b,
    });
  }
  for (const p of positionRows) {
    if (!p?.sport || !p?.wallet || !p?.date) continue;
    events.push({
      date: p.date,
      sport: p.sport,
      canonical: canonicalize(p.wallet),
      source: 'B',
      payload: p,
    });
  }
  events.sort((x, y) => x.date.localeCompare(y.date));

  // For each (wallet, sport) we record the FIRST date the wallet crossed
  // each threshold. tierAsOf(date) then asks: which thresholds were
  // crossed strictly before (or on, depending on `strict`) that date.
  const stat = new Map();
  const getStat = (c, s) => {
    const k = `${c}|${s}`;
    let st = stat.get(k);
    if (!st) {
      st = {
        aN: 0, aWins: 0, aFlatPnl: 0,
        bN: 0, bInvested: 0, bPnl: 0,
        firstWR50: null, firstFlat: null, firstConfirmed: null,
      };
      stat.set(k, st);
    }
    return st;
  };

  for (const e of events) {
    const s = getStat(e.canonical, e.sport);
    if (e.source === 'A') {
      s.aN += 1;
      s.aWins += (e.payload.won || 0);
      s.aFlatPnl += (e.payload.flat ?? 0);
    } else {
      s.bN += 1;
      s.bInvested += (e.payload.invested || 0);
      s.bPnl += (e.payload.settledPnl || 0);
    }
    const aMet  = s.aN >= 2 && s.aFlatPnl > 0;
    const aWr50 = s.aN >= 2 && (s.aWins / s.aN) >= 0.5;
    const bMet  = s.bN >= 2 && s.bInvested > 0 && (s.bPnl / s.bInvested) > 0;
    if (aMet && bMet && !s.firstConfirmed) s.firstConfirmed = e.date;
    if (aMet         && !s.firstFlat)      s.firstFlat      = e.date;
    if (aWr50        && !s.firstWR50)      s.firstWR50      = e.date;
  }

  const cmp = (firstDate, askDate) => {
    if (firstDate == null) return false;
    return strict ? (firstDate < askDate) : (firstDate <= askDate);
  };

  function tierAsOf(walletKey, sport, date) {
    const k = `${canonicalize(walletKey)}|${sport}`;
    const s = stat.get(k);
    if (!s) return null;
    if (cmp(s.firstConfirmed, date)) return 'CONFIRMED';
    if (cmp(s.firstFlat,      date)) return 'FLAT';
    if (cmp(s.firstWR50,      date)) return 'WR50';
    return null;
  }

  function isProvenAsOf(walletKey, sport, date) {
    const t = tierAsOf(walletKey, sport, date);
    return t === 'CONFIRMED' || t === 'FLAT';
  }

  return { tierAsOf, isProvenAsOf, canonicalize };
}
