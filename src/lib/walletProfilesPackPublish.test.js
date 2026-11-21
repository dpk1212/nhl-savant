import test from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import {
  WALLET_PROFILES_PACK_COLLECTION as PACK,
  WALLET_PROFILES_PACK_POINTER_ID as POINTER,
} from './walletProfilesPack.js';
import { buildPack, openPack } from '../../scripts/lib/walletProfilesPackNode.js';
import { publishWalletProfilesPack } from '../../scripts/lib/publishWalletProfilesPack.js';

const STAMP = 'walletProfilesMeta/current';
const POINTER_PATH = `${PACK}/${POINTER}`;

function sampleFile(generatedAt, count = 400, mark = '') {
  const profiles = {};
  for (let i = 0; i < count; i += 1) {
    // Varied text so the gzip is large enough to need several parts.
    const noise = Array.from({ length: 60 }, (_, k) => ((i * 7919 + k * 104729) % 9973).toString(36)).join('');
    profiles[`w${i.toString(16).padStart(5, '0')}`] = {
      name: `wallet ${i}${mark}`,
      noise,
      bySport: { NBA: { whitelistTier: i % 4 ? null : 'CONFIRMED', positions: { n: i, invested: i * 10.5 } } },
    };
  }
  return { generatedAt, whitelistVersion: 5, totals: { wallets: count }, profiles };
}

// An in-memory stand-in for the four Firestore calls the publish flow makes.
function fakeDb(seed = {}) {
  const store = new Map(Object.entries(seed));
  const ops = [];
  const hooks = { failSet: null, failGetAll: false, afterSet: null, failSelect: false };
  const snap = (path) => {
    const d = store.get(path);
    return { id: path.split('/')[1], exists: d !== undefined, data: () => d, get: (f) => d?.[f], ref: docRef(path) };
  };
  function docRef(path) {
    return {
      path,
      get: async () => { ops.push(['get', path]); return snap(path); },
      set: async (data) => {
        if (hooks.failSet?.(path)) throw new Error('write refused');
        ops.push(['set', path]);
        store.set(path, { ...data, ...(data.data ? { data: Buffer.from(data.data) } : {}) });
        hooks.afterSet?.(path, store);
      },
      delete: async () => { ops.push(['delete', path]); store.delete(path); },
    };
  }
  return {
    store,
    ops,
    hooks,
    writes: () => ops.filter(([op]) => op !== 'get'),
    collection: (c) => ({
      doc: (id) => docRef(`${c}/${id}`),
      select: () => ({
        get: async () => {
          if (hooks.failSelect) throw new Error('list refused');
          return { docs: [...store.keys()].filter((k) => k.startsWith(`${c}/`)).map(snap) };
        },
      }),
    }),
    getAll: async (...refs) => {
      if (hooks.failGetAll) throw new Error('read refused');
      return refs.map((r) => snap(r.path));
    },
  };
}

// Small parts so the sample needs several, as the real file does.
const PART = 4000;
const quiet = { log: () => {}, warn: () => {}, partBytes: PART };
const stampFor = (file) => ({ generatedAt: file.generatedAt, walletCount: Object.keys(file.profiles).length });
const partPaths = (db, generation) => [...db.store.keys()].filter((k) => k.startsWith(`${PACK}/${generation}_p`)).sort();

// What a reader would do: fetch the pointer, fetch that generation's parts, open them.
function readLive(db) {
  const pointer = db.store.get(POINTER_PATH);
  const parts = partPaths(db, pointer.generation).map((k) => db.store.get(k));
  return openPack(pointer, parts).profiles;
}

const G1 = '2026-11-21T00:41:12.000Z';
const G2 = '2026-11-21T08:10:06.007Z';
const G3 = '2026-11-21T17:22:40.500Z';

test('offline mode builds and checks without touching Firestore', async () => {
  const r = await publishWalletProfilesPack({ file: sampleFile(G1), mode: 'offline', db: null, ...quiet });
  assert.equal(r.outcome, 'offline');
  assert.equal(r.code, 0);
});

test('check mode reads two documents and writes nothing', async () => {
  const file = sampleFile(G1);
  const db = fakeDb({ [STAMP]: stampFor(file) });
  const r = await publishWalletProfilesPack({ file, mode: 'check', db, ...quiet });
  assert.equal(r.outcome, 'checked');
  assert.deepEqual(db.writes(), []);
  assert.deepEqual(db.ops.map(([, p]) => p).sort(), [POINTER_PATH, STAMP].sort());
});

test('first publish: parts, then read-back, then the pointer, and only in its own collection', async () => {
  const file = sampleFile(G1);
  const db = fakeDb({ [STAMP]: stampFor(file), 'sharpWalletProfiles/w00001': { untouched: true } });
  const r = await publishWalletProfilesPack({ file, mode: 'write', db, ...quiet });
  assert.equal(r.outcome, 'published');
  assert.equal(r.code, 0);
  const writes = db.writes();
  assert.ok(writes.every(([, path]) => path.startsWith(`${PACK}/`)), 'every write is inside walletProfilesPacked');
  const pointerAt = writes.findIndex(([op, path]) => op === 'set' && path === POINTER_PATH);
  assert.equal(pointerAt, r.pointer.partCount, 'the pointer is written after every part');
  assert.ok(r.pointer.partCount >= 3, `${r.pointer.partCount} parts`);
  assert.deepEqual(db.store.get('sharpWalletProfiles/w00001'), { untouched: true });
  assert.deepEqual(db.store.get(STAMP), stampFor(file));
  assert.deepEqual(readLive(db), file.profiles);
  assert.equal(db.store.get(POINTER_PATH).previousGeneration, null);
});

test('a Firestore timestamp on the stamp is read the same as a string', async () => {
  const file = sampleFile(G1);
  const db = fakeDb({ [STAMP]: { generatedAt: { toDate: () => new Date(G1) }, walletCount: 400 } });
  const r = await publishWalletProfilesPack({ file, mode: 'write', db, ...quiet });
  assert.equal(r.outcome, 'published');
});

test('refuses when the file and the profile documents are from different export runs', async () => {
  const file = sampleFile(G2);
  for (const stamp of [undefined, { generatedAt: G1, walletCount: 400 }, { generatedAt: G2, walletCount: 399 }, { walletCount: 400 }]) {
    const db = fakeDb(stamp ? { [STAMP]: stamp } : {});
    const r = await publishWalletProfilesPack({ file, mode: 'write', db, ...quiet });
    assert.equal(r.outcome, 'refused');
    assert.equal(r.code, 0);
    assert.deepEqual(db.writes(), []);
  }
});

test('refuses a file the server loader would reject, before any Firestore call', async () => {
  const db = fakeDb({ [STAMP]: { generatedAt: G1, walletCount: 3 } });
  const r = await publishWalletProfilesPack({ file: sampleFile(G1, 3), mode: 'write', db, ...quiet });
  assert.equal(r.outcome, 'refused');
  assert.deepEqual(db.ops, []);
});

test('running twice on the same export writes nothing the second time', async () => {
  const file = sampleFile(G1);
  const db = fakeDb({ [STAMP]: stampFor(file) });
  await publishWalletProfilesPack({ file, mode: 'write', db, ...quiet });
  const before = db.writes().length;
  const r = await publishWalletProfilesPack({ file, mode: 'write', db, ...quiet });
  assert.equal(r.outcome, 'already-published');
  assert.equal(db.writes().length, before);
});

test('a live generation is never rewritten in place', async () => {
  const file = sampleFile(G1);
  const db = fakeDb({ [STAMP]: stampFor(file) });
  await publishWalletProfilesPack({ file, mode: 'write', db, ...quiet });
  const before = db.writes().length;
  const sameStampOtherBytes = sampleFile(G1, 400, ' changed');
  const r = await publishWalletProfilesPack({ file: sameStampOtherBytes, mode: 'write', db, ...quiet });
  assert.equal(r.outcome, 'refused');
  assert.equal(db.writes().length, before);
  assert.deepEqual(readLive(db), file.profiles);
});

test('the next export replaces the pointer, keeps the previous generation, and drops older ones', async () => {
  const f1 = sampleFile(G1, 400, ' one');
  const f2 = sampleFile(G2, 401, ' two');
  const f3 = sampleFile(G3, 402, ' three');
  const db = fakeDb({ [STAMP]: stampFor(f1) });
  const r1 = await publishWalletProfilesPack({ file: f1, mode: 'write', db, ...quiet });

  db.store.set(STAMP, stampFor(f2));
  const r2 = await publishWalletProfilesPack({ file: f2, mode: 'write', db, ...quiet });
  assert.equal(r2.outcome, 'published');
  assert.equal(db.store.get(POINTER_PATH).previousGeneration, r1.pointer.generation);
  assert.equal(partPaths(db, r1.pointer.generation).length, r1.pointer.partCount, 'previous generation kept');
  assert.deepEqual(readLive(db), f2.profiles);
  // A reader still holding the old pointer can finish with the old parts.
  assert.deepEqual(
    openPack(r1.pointer, partPaths(db, r1.pointer.generation).map((k) => db.store.get(k))).profiles,
    f1.profiles,
  );

  db.store.set(STAMP, stampFor(f3));
  const r3 = await publishWalletProfilesPack({ file: f3, mode: 'write', db, ...quiet });
  assert.equal(r3.outcome, 'published');
  assert.equal(partPaths(db, r1.pointer.generation).length, 0, 'oldest generation removed');
  assert.equal(partPaths(db, r2.pointer.generation).length, r2.pointer.partCount, 'previous generation kept');
  assert.deepEqual(readLive(db), f3.profiles);
  assert.equal(db.store.has(POINTER_PATH), true);
});

test('a part that reads back wrong: the pointer does not move and the old copy stays whole', async () => {
  const f1 = sampleFile(G1, 400, ' one');
  const f2 = sampleFile(G2, 400, ' two');
  const db = fakeDb({ [STAMP]: stampFor(f1) });
  const r1 = await publishWalletProfilesPack({ file: f1, mode: 'write', db, ...quiet });

  db.store.set(STAMP, stampFor(f2));
  const g2 = buildPack(f2, { partBytes: PART }).pointer.generation;
  db.hooks.afterSet = (path, store) => {
    if (path === `${PACK}/${g2}_p001`) { const d = store.get(path); d.data[5] ^= 0xff; }
  };
  const r2 = await publishWalletProfilesPack({ file: f2, mode: 'write', db, ...quiet });
  assert.equal(r2.outcome, 'failed');
  assert.equal(r2.code, 1);
  assert.equal(db.store.get(POINTER_PATH).generation, r1.pointer.generation, 'pointer still on the old generation');
  assert.equal(partPaths(db, g2).length, 0, 'the bad parts are removed');
  assert.deepEqual(readLive(db), f1.profiles);
});

test('a write that fails part-way: nothing live changes and the half-written parts are removed', async () => {
  const f1 = sampleFile(G1, 400, ' one');
  const f2 = sampleFile(G2, 400, ' two');
  const db = fakeDb({ [STAMP]: stampFor(f1) });
  const r1 = await publishWalletProfilesPack({ file: f1, mode: 'write', db, ...quiet });

  db.store.set(STAMP, stampFor(f2));
  const g2 = buildPack(f2, { partBytes: PART }).pointer.generation;
  db.hooks.failSet = (path) => path === `${PACK}/${g2}_p001`;
  const r2 = await publishWalletProfilesPack({ file: f2, mode: 'write', db, ...quiet });
  assert.equal(r2.outcome, 'failed');
  assert.equal(db.store.get(POINTER_PATH).generation, r1.pointer.generation);
  assert.equal(partPaths(db, g2).length, 0);
  assert.deepEqual(readLive(db), f1.profiles);
});

test('a failed read-back or a failed pointer write leaves the old copy live', async () => {
  const f1 = sampleFile(G1, 400, ' one');
  const f2 = sampleFile(G2, 400, ' two');
  for (const breakIt of [(db) => { db.hooks.failGetAll = true; }, (db) => { db.hooks.failSet = (path) => path === POINTER_PATH; }]) {
    const db = fakeDb({ [STAMP]: stampFor(f1) });
    const r1 = await publishWalletProfilesPack({ file: f1, mode: 'write', db, ...quiet });
    db.store.set(STAMP, stampFor(f2));
    breakIt(db);
    const r2 = await publishWalletProfilesPack({ file: f2, mode: 'write', db, ...quiet });
    assert.equal(r2.outcome, 'failed');
    assert.equal(db.store.get(POINTER_PATH).generation, r1.pointer.generation);
    assert.equal(partPaths(db, buildPack(f2, { partBytes: PART }).pointer.generation).length, 0);
    assert.deepEqual(readLive(db), f1.profiles);
  }
});

test('a failed cleanup does not undo a good publish', async () => {
  const file = sampleFile(G1);
  const db = fakeDb({ [STAMP]: stampFor(file) });
  db.hooks.failSelect = true;
  const r = await publishWalletProfilesPack({ file, mode: 'write', db, ...quiet });
  assert.equal(r.outcome, 'published');
  assert.deepEqual(readLive(db), file.profiles);
});

test('an unreadable pointer left behind is replaced, not trusted', async () => {
  const file = sampleFile(G1);
  const db = fakeDb({ [STAMP]: stampFor(file), [POINTER_PATH]: { formatVersion: 99, generation: 'junk' } });
  const r = await publishWalletProfilesPack({ file, mode: 'write', db, ...quiet });
  assert.equal(r.outcome, 'published');
  assert.equal(db.store.get(POINTER_PATH).previousGeneration, null);
  assert.deepEqual(readLive(db), file.profiles);
});
