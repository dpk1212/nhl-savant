import test from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import {
  PACK_MIN_PROFILE_COUNT,
  PACK_PART_BYTES,
  WALLET_PROFILES_PACK_FORMAT,
  checkPackPointer,
  joinPackParts,
  packGenerationId,
  packPartId,
  profilesFromPackPayload,
  splitPackBytes,
} from './walletProfilesPack.js';
import { buildPack, checkProfilesFile, openPack } from '../../scripts/lib/walletProfilesPackNode.js';

const GENERATED_AT = '2026-11-21T08:10:06.007Z';

// A profiles file shaped like data/wallet-profiles.json, with the awkward
// values a real one carries: nulls, negative and fractional numbers, empty
// maps and lists, nested sport and market blocks, and non-ASCII names.
function sampleFile(count = 150, generatedAt = GENERATED_AT) {
  const profiles = {};
  for (let i = 0; i < count; i += 1) {
    const id = (i % 3 === 0 ? 'A' : 'a') + i.toString(16).padStart(5, '0');
    profiles[id] = {
      walletAddress: `0x${'0'.repeat(34)}${id}`,
      name: i % 7 === 0 ? `Señor Ünïcode ${i} 🏒` : null,
      verdict: i % 2 ? 'SHARP' : null,
      sizeSignal: { ratio: i / 7, n: i, empty: {} },
      whitelistSourceBySport: i % 5 === 0 ? { NBA: 'B' } : {},
      bySport: {
        NBA: {
          whitelistTier: i % 4 === 0 ? 'CONFIRMED' : null,
          trust: { state: 'STABLE_ON', days: 21 },
          positions: { n: i, invested: i * 1234.56, settledPnl: 0 - i * 0.01 },
          form: { curveLegs: Array.from({ length: i % 9 }, (_, k) => ({ date: '2026-11-01', pnl: k - 4.5 })), exited: [] },
          byMarket: {
            ML: { priceBands: { 1: { all: { n: 3, dollarRoi: -100 }, l30: { n: 1, dollarRoi: 12.5 } } }, sizeBands: {} },
          },
        },
      },
    };
  }
  return { generatedAt, v8Cutover: '2026-05-10', whitelistVersion: 5, totals: { wallets: count }, profiles };
}

test('generation and part ids are safe document ids and sort in order', () => {
  assert.equal(packGenerationId(GENERATED_AT), '2026-11-21T08-10-06-007Z');
  assert.equal(packPartId('2026-11-21T08-10-06-007Z', 0), '2026-11-21T08-10-06-007Z_p000');
  assert.equal(packPartId('g', 12), 'g_p012');
  assert.ok(!/[/.:]/.test(packPartId(packGenerationId(GENERATED_AT), 3)));
  assert.throws(() => packGenerationId('not a date'));
  assert.throws(() => packPartId('g', -1));
  assert.throws(() => packPartId('', 0));
});

test('split cuts into parts no larger than the limit and loses nothing', () => {
  const bytes = Uint8Array.from({ length: 2500 }, (_, i) => i % 251);
  const parts = splitPackBytes(bytes, 1000);
  assert.deepEqual(parts.map((p) => p.length), [1000, 1000, 500]);
  assert.deepEqual(Buffer.concat(parts.map((p) => Buffer.from(p))), Buffer.from(bytes));
  assert.deepEqual(splitPackBytes(bytes, 2500).map((p) => p.length), [2500]);
  assert.deepEqual(splitPackBytes(bytes, 9999).map((p) => p.length), [2500]);
  assert.throws(() => splitPackBytes(new Uint8Array(0)));
  assert.throws(() => splitPackBytes(bytes, 0));
});

test('a part with its other fields stays under the Firestore document limit', () => {
  assert.ok(PACK_PART_BYTES + 10_000 < 1_048_576);
});

test('the round trip returns the profiles exactly, in the same key order', () => {
  const file = sampleFile(150);
  const { pointer, parts, json } = buildPack(file, { partBytes: 700 });
  assert.ok(parts.length > 3, `${parts.length} parts`);
  assert.equal(pointer.partCount, parts.length);
  assert.equal(pointer.walletCount, 150);
  assert.equal(pointer.formatVersion, WALLET_PROFILES_PACK_FORMAT);
  assert.deepEqual(parts.map((p) => p.id), parts.map((_, i) => packPartId(pointer.generation, i)));
  const opened = openPack(pointer, parts);
  assert.equal(opened.json, json);
  assert.deepEqual(opened.profiles, file.profiles);
  assert.deepEqual(Object.keys(opened.profiles), Object.keys(file.profiles));
  // Ids keep their case: the page looks profiles up by the document id as written.
  assert.ok(Object.keys(opened.profiles).some((id) => /^A/.test(id)));
});

test('the pack is built from the file as written, so it holds what the file holds', () => {
  // The export writes the file with JSON.stringify, which has no way to write
  // NaN, Infinity, undefined, or minus zero. A file read back from disk never
  // carries them, so the pack never changes a value the file holds.
  const file = JSON.parse(JSON.stringify(sampleFile(120)));
  const { pointer, parts } = buildPack(file, { partBytes: 600 });
  assert.deepEqual(openPack(pointer, parts).profiles, file.profiles);
});

test('parts handed over in any order open the same', () => {
  const { pointer, parts, json } = buildPack(sampleFile(120), { partBytes: 500 });
  assert.equal(openPack(pointer, [...parts].reverse()).json, json);
});

test('the default part size packs a file into parts that each fit one document', () => {
  const { pointer, parts } = buildPack(sampleFile(400));
  assert.ok(parts.every((p) => p.data.length <= PACK_PART_BYTES));
  assert.equal(parts.reduce((s, p) => s + p.data.length, 0), pointer.gzipBytes);
});

test('a flipped byte is caught by the hash', () => {
  const { pointer, parts } = buildPack(sampleFile(120), { partBytes: 500 });
  const bad = parts.map((p) => ({ ...p, data: Buffer.from(p.data) }));
  bad[1].data[10] ^= 0xff;
  assert.throws(() => openPack(pointer, bad), /hash/);
});

test('a missing, extra, repeated, or empty part is refused', () => {
  const { pointer, parts } = buildPack(sampleFile(120), { partBytes: 500 });
  assert.throws(() => openPack(pointer, parts.slice(1)), /parts, pointer says/);
  assert.throws(() => openPack(pointer, [...parts, parts[0]]), /parts, pointer says/);
  assert.throws(() => openPack(pointer, [parts[0], ...parts.slice(0, -1)]), /twice/);
  assert.throws(() => openPack(pointer, parts.map((p, i) => (i === 2 ? { ...p, data: Buffer.alloc(0) } : p))), /no bytes/);
  assert.throws(() => openPack(pointer, parts.map((p, i) => (i === 2 ? { ...p, data: undefined } : p))), /no bytes/);
  assert.throws(() => openPack(pointer, parts.map((p, i) => (i === 2 ? { ...p, index: 99 } : p))), /outside/);
});

test('parts from two export runs never mix', () => {
  const a = buildPack(sampleFile(120, '2026-11-21T08:10:06.007Z'), { partBytes: 500 });
  const b = buildPack(sampleFile(120, '2026-11-21T00:41:12.000Z'), { partBytes: 500 });
  assert.notEqual(a.pointer.generation, b.pointer.generation);
  assert.ok(a.parts.every((p) => !b.parts.some((q) => q.id === p.id)), 'part ids differ by generation');
  const mixed = a.parts.map((p, i) => (i === 1 ? b.parts[1] : p));
  assert.throws(() => openPack(a.pointer, mixed), /generation/);
  // An old pointer with the new run's parts is refused too.
  assert.throws(() => openPack(b.pointer, a.parts), /parts, pointer says|generation/);
});

test('a cut-off part is refused by the size check before anything is unzipped', () => {
  const { pointer, parts } = buildPack(sampleFile(120), { partBytes: 500 });
  const cut = parts.map((p, i) => (i === parts.length - 1 ? { ...p, data: p.data.subarray(0, p.data.length - 1) } : p));
  assert.throws(() => openPack(pointer, cut), /bytes, pointer says/);
});

test('a pointer this code cannot read is refused with the reason', () => {
  const { pointer } = buildPack(sampleFile(120));
  assert.deepEqual(checkPackPointer(pointer), { ok: true });
  assert.equal(checkPackPointer(null).ok, false);
  assert.equal(checkPackPointer({ ...pointer, formatVersion: 2 }).ok, false);
  assert.equal(checkPackPointer({ ...pointer, generation: '' }).ok, false);
  assert.equal(checkPackPointer({ ...pointer, generatedAt: 'x' }).ok, false);
  assert.equal(checkPackPointer({ ...pointer, partCount: 0 }).ok, false);
  assert.equal(checkPackPointer({ ...pointer, gzipBytes: 0 }).ok, false);
  assert.equal(checkPackPointer({ ...pointer, walletCount: PACK_MIN_PROFILE_COUNT - 1 }).ok, false);
  assert.equal(checkPackPointer({ ...pointer, sha256: 'abc' }).ok, false);
  assert.throws(() => joinPackParts({ ...pointer, formatVersion: 2 }, []), /pointer rejected/);
});

test('a payload that does not match its pointer is refused', () => {
  const file = sampleFile(120);
  const { pointer } = buildPack(file);
  const payload = { generatedAt: file.generatedAt, profiles: file.profiles };
  assert.equal(profilesFromPackPayload(pointer, payload), file.profiles);
  assert.throws(() => profilesFromPackPayload(pointer, { ...payload, generatedAt: '2026-11-20T00:00:00.000Z' }), /generatedAt/);
  const fewer = { ...file.profiles };
  delete fewer[Object.keys(fewer)[0]];
  assert.throws(() => profilesFromPackPayload(pointer, { ...payload, profiles: fewer }), /profiles, pointer says/);
  assert.throws(() => profilesFromPackPayload(pointer, { ...payload, profiles: [] }), /no profiles object/);
  assert.throws(() => profilesFromPackPayload(pointer, {}), /no profiles object/);
});

test('a well-formed gzip of the wrong content is refused even when the hash is right', () => {
  // Someone writes valid parts and a matching pointer for a payload with a profile that is not an object.
  const file = sampleFile(120);
  const profiles = { ...file.profiles, broken: 'not an object' };
  const json = JSON.stringify({ generatedAt: file.generatedAt, whitelistVersion: 5, profiles });
  const gzip = gzipSync(Buffer.from(json));
  const pointer = {
    ...buildPack(file).pointer,
    walletCount: 121,
    partCount: 1,
    gzipBytes: gzip.length,
    jsonBytes: Buffer.byteLength(json),
    sha256: createHash('sha256').update(gzip).digest('hex'),
  };
  assert.throws(
    () => openPack(pointer, [{ generation: pointer.generation, index: 0, data: gzip }]),
    /is not an object/,
  );
});

test('a profiles file the server loader would reject is not packed', () => {
  assert.deepEqual(checkProfilesFile(sampleFile(120)), { ok: true, walletCount: 120 });
  assert.equal(checkProfilesFile(sampleFile(PACK_MIN_PROFILE_COUNT - 1)).ok, false);
  assert.equal(checkProfilesFile({ ...sampleFile(120), generatedAt: undefined }).ok, false);
  assert.equal(checkProfilesFile({ generatedAt: GENERATED_AT, profiles: [] }).ok, false);
  assert.equal(checkProfilesFile({ generatedAt: GENERATED_AT }).ok, false);
  assert.equal(checkProfilesFile(null).ok, false);
  const noSport = sampleFile(120);
  delete noSport.profiles[Object.keys(noSport.profiles)[0]].bySport;
  assert.equal(checkProfilesFile(noSport).ok, false);
  const notObject = sampleFile(120);
  notObject.profiles.zzz = 5;
  assert.equal(checkProfilesFile(notObject).ok, false);
  assert.throws(() => buildPack(sampleFile(3)), /rejected/);
});

test('the same file packs to the same bytes, so a re-run is recognised as already published', () => {
  const a = buildPack(sampleFile(150));
  const b = buildPack(sampleFile(150));
  assert.equal(a.pointer.sha256, b.pointer.sha256);
  assert.equal(a.pointer.generation, b.pointer.generation);
  const changed = sampleFile(150);
  changed.profiles[Object.keys(changed.profiles)[5]].verdict = 'CHANGED';
  assert.notEqual(buildPack(changed).pointer.sha256, a.pointer.sha256);
});
