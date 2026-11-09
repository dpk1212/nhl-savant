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

export const MORNING_RANK_COLLECTION = 'morningRank';
const TOP3_DOC = 'top3';
const GAP_DOC = 'gap';
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
 * Use the stored morning when it matches this slate. A past --date= rebuilds
 * in memory and does not replace today's documents. Dry-run does not write.
 */
export async function loadMorningRanks(db, asOf, { write = true, liveDate = null } = {}) {
  const live = liveDate || etSlateDate();
  const persist = write && asOf === live;
  if (!isTop3PickLive(asOf) && !isGapLeadLive(asOf)) {
    setTop3PickRanks(new Map());
    setGapLeadBooks(new Map());
    return { source: 'not_live', seats: 0, gapWallets: 0, bets: 0, since: null };
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
  return stats(built, 'built');
}

/** Grade just changed an older bet. Replace the stored morning. */
export async function rebuildMorningRanks(db, asOf) {
  const built = await buildFromQuery(db, asOf);
  setTop3PickRanks(built.top3);
  setGapLeadBooks(built.gap);
  await writeDocs(db, asOf, built);
  return stats(built, 'rebuilt');
}
