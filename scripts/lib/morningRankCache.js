/**
 * Morning top-3 seats and gap-lead books.
 *
 * Both rules read the same 30-day book of bets dated before this morning.
 * The scan used to re-read that book every cycle. It now reads two documents.
 * A grade run rebuilds them, and the first scan of a new date rebuilds them
 * when the stored morning does not match. Today's wallets still come from
 * the live positions on every cycle.
 */
import admin from 'firebase-admin';
import {
  buildTop3PickRanks,
  hydrateTop3PickRanks,
  isTop3PickLive,
  serializeTop3PickRanks,
  setTop3PickRanks,
  top3PickWindowStart,
} from '../../src/lib/top3PickRung.js';
import {
  buildGapLeadBooks,
  hydrateGapLeadBooks,
  isGapLeadLive,
  serializeGapLeadBooks,
  setGapLeadBooks,
} from '../../src/lib/gapLeadRescue.js';
import {
  buildMlMiniBook,
  hydrateMlMiniBook,
  isMlMiniLive,
  serializeMlMiniBook,
  setMlMiniBook,
} from '../../src/lib/mlMiniRung.js';
import {
  buildSpreadSteamBook,
  hydrateSpreadSteamBook,
  isSpreadSteamLive,
  serializeSpreadSteamBook,
  setSpreadSteamBook,
} from '../../src/lib/spreadSteamRung.js';
import {
  buildTotalMiniBook,
  hydrateTotalMiniBook,
  isTotalMiniLive,
  serializeTotalMiniBook,
  setTotalMiniBook,
} from '../../src/lib/totalMiniRung.js';
import {
  buildV13MlBook,
  hydrateV13MlBook,
  isV13MlLive,
  serializeV13MlBook,
  setV13MlBook,
  V13_ML_BOOK_VERSION,
} from '../../src/lib/v13MlPath.js';

export const MORNING_RANK_COLLECTION = 'morningRank';
const TOP3_DOC = 'top3';
const GAP_DOC = 'gap';
const ML_MINI_DOC = 'mlMini';
const SPREAD_STEAM_DOC = 'spreadSteam';
const TOTAL_MINI_DOC = 'totalMini';
const V13_ML_DOC = 'v13Ml';
const SKILL_FIELDS = [
  'wallet', 'walletShort', 'date', 'sport', 'marketType', 'invested', 'avgPrice',
  'result', 'won', 'side', 'gameKey', 'status', 'postponed',
  'title', 'outcome', 'outcomeIndex', 'slug', 'eventSlug',
  'entryLine', 'spreadLine', 'totalLine', 'away', 'home', 'awayName', 'homeName',
];
const FIELDS = ['wallet', 'walletShort', 'date', 'sport', 'marketType', 'invested', 'settledPnl', 'result', 'postponed', 'status'];

export function etSlateDate(now = new Date()) {
  return now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function seatCount(index) {
  let n = 0;
  for (const info of index.values()) if (info.rank <= 3) n += 1;
  return n;
}

async function readDoc(db, id, asOf) {
  const snap = await db.collection(MORNING_RANK_COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  const data = snap.data() || {};
  if (data.asOf !== asOf || !Array.isArray(data.rows)) return null;
  return data;
}

async function buildFromQuery(db, asOf) {
  const since = top3PickWindowStart(asOf);
  const snap = await db.collection('sharp_action_positions')
    .where('date', '>=', since)
    .where('date', '<', asOf)
    .select(...FIELDS)
    .get();
  const rows = snap.docs.map((d) => d.data());
  const top3 = isTop3PickLive(asOf) ? buildTop3PickRanks(rows, asOf) : new Map();
  const gap = isGapLeadLive(asOf) ? buildGapLeadBooks(rows, asOf) : new Map();
  return { since, bets: rows.length, top3, gap };
}

async function writeDocs(db, asOf, built) {
  const stamp = admin.firestore.FieldValue.serverTimestamp();
  const generatedAt = new Date().toISOString();
  const batch = db.batch();
  batch.set(db.collection(MORNING_RANK_COLLECTION).doc(TOP3_DOC), {
    ...serializeTop3PickRanks(built.top3, asOf),
    since: built.since,
    betCount: built.bets,
    generatedAt,
    updatedAt: stamp,
  });
  batch.set(db.collection(MORNING_RANK_COLLECTION).doc(GAP_DOC), {
    ...serializeGapLeadBooks(built.gap, asOf),
    since: built.since,
    betCount: built.bets,
    generatedAt,
    updatedAt: stamp,
  });
  await batch.commit();
}

function stats(built, source) {
  return {
    source,
    seats: seatCount(built.top3),
    gapWallets: built.gap.size,
    bets: built.bets,
    since: built.since,
  };
}

/**
 * Good-wallet moneyline bands, spread line cells, and total line cells
 * before this morning. The first scan of the day reads every graded
 * position once. Later scans read the stored books. A missing book
 * rebuilds all of them from that one read.
 */
async function ensureMorningSkillBooks(db, asOf, persist, { force = false } = {}) {
  const mlLive = isMlMiniLive(asOf);
  const spreadLive = isSpreadSteamLive(asOf);
  const totalLive = isTotalMiniLive(asOf);
  const v13Live = isV13MlLive(asOf);
  if (!mlLive) setMlMiniBook(new Map());
  if (!spreadLive) setSpreadSteamBook(new Map());
  if (!totalLive) setTotalMiniBook(new Map());
  if (!v13Live) setV13MlBook(new Map());
  if (!mlLive && !spreadLive && !totalLive && !v13Live) {
    return { mlMini: 0, spreadSteam: 0, totalMini: 0, v13Ml: 0 };
  }

  let mlDoc = null;
  let spreadDoc = null;
  let totalDoc = null;
  let v13Doc = null;
  if (!force && persist) {
    try {
      if (mlLive) mlDoc = await readDoc(db, ML_MINI_DOC, asOf);
      if (spreadLive) spreadDoc = await readDoc(db, SPREAD_STEAM_DOC, asOf);
      if (totalLive) totalDoc = await readDoc(db, TOTAL_MINI_DOC, asOf);
      if (v13Live) {
        v13Doc = await readDoc(db, V13_ML_DOC, asOf);
        if (v13Doc && v13Doc.bookVersion !== V13_ML_BOOK_VERSION) v13Doc = null;
      }
    } catch (err) {
      console.warn(`[morning-rank] skill book cache read failed, rebuilding: ${err.message}`);
      mlDoc = null;
      spreadDoc = null;
      totalDoc = null;
      v13Doc = null;
    }
    const mlReady = !mlLive || mlDoc;
    const spreadReady = !spreadLive || spreadDoc;
    const totalReady = !totalLive || totalDoc;
    const v13Ready = !v13Live || v13Doc;
    if (mlReady && spreadReady && totalReady && v13Ready) {
      const mlIndex = mlDoc ? hydrateMlMiniBook(mlDoc) : new Map();
      const spreadIndex = spreadDoc ? hydrateSpreadSteamBook(spreadDoc) : new Map();
      const totalIndex = totalDoc ? hydrateTotalMiniBook(totalDoc) : new Map();
      const v13Index = v13Doc ? hydrateV13MlBook(v13Doc) : new Map();
      if (mlLive) setMlMiniBook(mlIndex);
      if (spreadLive) setSpreadSteamBook(spreadIndex);
      if (totalLive) setTotalMiniBook(totalIndex);
      if (v13Live) setV13MlBook(v13Index);
      return {
        mlMini: mlIndex.size,
        spreadSteam: spreadIndex.size,
        totalMini: totalIndex.size,
        v13Ml: v13Index.size,
      };
    }
  }

  const snap = await db.collection('sharp_action_positions')
    .where('status', '==', 'GRADED')
    .select(...SKILL_FIELDS)
    .get();
  const rows = snap.docs.map((d) => d.data());
  let mlSize = 0;
  let spreadSize = 0;
  let totalSize = 0;
  let v13Size = 0;
  if (mlLive) {
    const index = buildMlMiniBook(rows, asOf);
    setMlMiniBook(index);
    mlSize = index.size;
    if (persist) {
      try {
        await db.collection(MORNING_RANK_COLLECTION).doc(ML_MINI_DOC).set({
          ...serializeMlMiniBook(index, asOf),
          generatedAt: new Date().toISOString(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (err) {
        console.warn(`[morning-rank] ml mini cache write failed: ${err.message}`);
      }
    }
  }
  if (spreadLive) {
    const index = buildSpreadSteamBook(rows, asOf);
    setSpreadSteamBook(index);
    spreadSize = index.size;
    if (persist) {
      try {
        await db.collection(MORNING_RANK_COLLECTION).doc(SPREAD_STEAM_DOC).set({
          ...serializeSpreadSteamBook(index, asOf),
          generatedAt: new Date().toISOString(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (err) {
        console.warn(`[morning-rank] spread steam cache write failed: ${err.message}`);
      }
    }
  }
  if (totalLive) {
    const index = buildTotalMiniBook(rows, asOf);
    setTotalMiniBook(index);
    totalSize = index.size;
    if (persist) {
      try {
        await db.collection(MORNING_RANK_COLLECTION).doc(TOTAL_MINI_DOC).set({
          ...serializeTotalMiniBook(index, asOf),
          generatedAt: new Date().toISOString(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (err) {
        console.warn(`[morning-rank] total mini cache write failed: ${err.message}`);
      }
    }
  }
  if (v13Live) {
    const index = buildV13MlBook(rows, asOf);
    setV13MlBook(index);
    v13Size = index.size;
    if (persist) {
      try {
        await db.collection(MORNING_RANK_COLLECTION).doc(V13_ML_DOC).set({
          ...serializeV13MlBook(index, asOf),
          generatedAt: new Date().toISOString(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (err) {
        console.warn(`[morning-rank] v13 ml cache write failed: ${err.message}`);
      }
    }
  }
  return { mlMini: mlSize, spreadSteam: spreadSize, totalMini: totalSize, v13Ml: v13Size };
}

/**
 * Use the stored morning when it matches this slate. A past --date= rebuilds
 * in memory and does not replace today's documents. Dry-run does not write.
 */
export async function loadMorningRanks(db, asOf, { write = true, liveDate = null } = {}) {
  const live = liveDate || etSlateDate();
  const persist = write && asOf === live;
  const skillBooks = await ensureMorningSkillBooks(db, asOf, persist);
  if (!isTop3PickLive(asOf) && !isGapLeadLive(asOf)) {
    setTop3PickRanks(new Map());
    setGapLeadBooks(new Map());
    return { source: 'not_live', seats: 0, gapWallets: 0, bets: 0, since: null, ...skillBooks };
  }
  if (persist) {
    try {
      const [top3Doc, gapDoc] = await Promise.all([
        readDoc(db, TOP3_DOC, asOf),
        readDoc(db, GAP_DOC, asOf),
      ]);
      if (top3Doc && gapDoc) {
        const top3 = hydrateTop3PickRanks(top3Doc);
        const gap = hydrateGapLeadBooks(gapDoc);
        setTop3PickRanks(top3);
        setGapLeadBooks(gap);
        return {
          source: 'cache',
          seats: seatCount(top3),
          gapWallets: gap.size,
          bets: top3Doc.betCount ?? null,
          since: top3Doc.since ?? null,
          ...skillBooks,
        };
      }
    } catch (err) {
      console.warn(`[morning-rank] cache read failed, rebuilding: ${err.message}`);
    }
  }
  const built = await buildFromQuery(db, asOf);
  setTop3PickRanks(built.top3);
  setGapLeadBooks(built.gap);
  if (persist) {
    try {
      await writeDocs(db, asOf, built);
    } catch (err) {
      console.warn(`[morning-rank] cache write failed: ${err.message}`);
    }
  }
  return { ...stats(built, 'built'), ...skillBooks };
}

/** Grade just changed an older bet. Replace the stored morning. */
export async function rebuildMorningRanks(db, asOf) {
  const built = await buildFromQuery(db, asOf);
  setTop3PickRanks(built.top3);
  setGapLeadBooks(built.gap);
  await writeDocs(db, asOf, built);
  const skillBooks = await ensureMorningSkillBooks(db, asOf, true, { force: true });
  return { ...stats(built, 'rebuilt'), ...skillBooks };
}
