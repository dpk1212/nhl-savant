#!/usr/bin/env node
/**
 * My Sharp alerts for the 20-seat beta.
 * Together, pressing, and exiting. Audience is each member's Firebase uid
 * as a OneSignal external_id — never the paid tag, never the lock audience.
 *
 *   node scripts/sendMySharpAlerts.mjs                 live scan
 *   node scripts/sendMySharpAlerts.mjs --dry-run
 *   node scripts/sendMySharpAlerts.mjs --test-oilers   one Oilers alert to the owner
 *
 * Env: FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, VITE_FIREBASE_PROJECT_ID
 *      ONESIGNAL_REST_API_KEY (live sends)
 */

import { createHash } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import { betsFeedOn, parseMySharpsDoc } from '../src/lib/mySharps.js';
import {
  MY_SHARP_ALERT_CAP,
  MY_SHARP_ALERT_COLLECTION,
  MY_SHARP_ALERT_ROSTER_ID,
  emptyAlertPrefs,
  planMySharpAlerts,
  readAlertMember,
} from '../src/lib/mySharpAlerts.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run');
const TEST_OILERS = argv.includes('--test-oilers');
const OWNER_UID = 'TJs6JFr8JxXRzCsMmNMC8MIOtYw2';
const APP_ID = process.env.ONESIGNAL_APP_ID || 'd8fcb504-8d29-4354-a9e4-8b612d3eafeb';
const REST_KEY = process.env.ONESIGNAL_REST_API_KEY || '';
const SITE_URL = 'https://nhlsavant.com/#/sharps';
const ICON = 'https://nhlsavant.com/icons/icon-192.png';
const BOARD = 'https://nhlsavant.com';
const POSITION_FILES = [
  ['sharp_positions.json', 'ML'],
  ['sharp_spread_positions.json', 'SPREAD'],
  ['sharp_total_positions.json', 'TOTAL'],
];
const SPORTS = ['NHL', 'NBA', 'MLB', 'CBB', 'CFB', 'NFL', 'SOC', 'UFC', 'WNBA', 'ATP', 'CS2', 'LOL'];
const EXIT_FRESH_MS = 45 * 60 * 1000;
const REAL_EXIT_REASONS = new Set(['asset_absent', 'soft_key_absent_legacy']);

function initFirebase() {
  if (!admin.apps.length) {
    const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
    if (existsSync(sakPath)) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))),
      });
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
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

function shortOf(wallet) {
  return String(wallet || '').toLowerCase().slice(-6);
}

function etDate(now = new Date()) {
  return now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.json();
}

function commenceMs(game) {
  const raw = game?.commence || game?.polyGameTime || game?.commenceTime;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    const t = new Date(raw).getTime();
    return Number.isFinite(t) ? t : null;
  }
  return null;
}

function teamName(pos, game, market) {
  if (market === 'TOTAL') {
    if (pos.side === 'over') return 'Over';
    if (pos.side === 'under') return 'Under';
  }
  if (pos.side === 'draw') return 'Draw';
  if (pos.side === 'home') return game?.home || game?.homeTeam || pos.outcome || 'Home';
  if (pos.side === 'away') return game?.away || game?.awayTeam || pos.outcome || 'Away';
  return pos.outcome || pos.teamName || pos.side || 'Side';
}

function flattenBoard(files, poly, now) {
  const rows = [];
  for (const [data, marketFallback] of files) {
    if (!data || typeof data !== 'object') continue;
    for (const sport of SPORTS) {
      const games = data[sport];
      if (!games || typeof games !== 'object') continue;
      for (const [gameKey, game] of Object.entries(games)) {
        const start = commenceMs(poly?.[sport]?.[gameKey]) || commenceMs(game);
        if (start && now > start) continue;
        const positions = Array.isArray(game?.positions) ? game.positions : [];
        for (const pos of positions) {
          const walletShort = shortOf(pos.wallet || pos.walletShort);
          if (!walletShort) continue;
          const invested = Number(pos.invested) || 0;
          const usual = Number(pos.avgSportBet) || 0;
          const ratio = usual > 0 && invested > 0 ? invested / usual : null;
          const marketType = String(pos.marketType || marketFallback || '').toUpperCase();
          rows.push({
            sport,
            gameKey,
            away: game.away || game.awayTeam || null,
            home: game.home || game.homeTeam || null,
            walletShort,
            marketType: marketType === 'MONEYLINE' ? 'ML' : marketType,
            side: String(pos.side || '').toLowerCase(),
            team: teamName(pos, game, marketType === 'MONEYLINE' ? 'ML' : marketType),
            invested,
            ratio,
            commenceMs: start,
          });
        }
      }
    }
  }
  return rows;
}

function stampDocId(uid, stamp) {
  return `${uid}__${stamp}`.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 700);
}

function pushKey(uid, stamp) {
  return createHash('sha256').update(`${uid}::${stamp}`).digest('hex').slice(0, 40);
}

async function ensureOwnerSeat(db) {
  const ref = db.collection(MY_SHARP_ALERT_COLLECTION).doc(MY_SHARP_ALERT_ROSTER_ID);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({
      cap: MY_SHARP_ALERT_CAP,
      members: {
        [OWNER_UID]: { ...emptyAlertPrefs(), joinedAt: Date.now() },
      },
    });
    return (await ref.get()).data();
  }
  const data = snap.data() || {};
  const members = data.members || {};
  if (!members[OWNER_UID] && Object.keys(members).length < (Number(data.cap) || MY_SHARP_ALERT_CAP)) {
    await ref.update({
      [`members.${OWNER_UID}`]: { ...emptyAlertPrefs(), joinedAt: Date.now() },
    });
    return (await ref.get()).data();
  }
  return data;
}

async function loadRosterUsers(db, roster) {
  const uids = Object.keys(roster?.members || {});
  const out = [];
  for (const uid of uids) {
    const prefs = readAlertMember(roster.members[uid]);
    if (!prefs) continue;
    const userSnap = await db.collection('users').doc(uid).get();
    const sharps = parseMySharpsDoc(userSnap.data() || {});
    out.push({ uid, prefs, sharps });
  }
  return out;
}

function rowsForUser(boardRows, sharps) {
  const members = sharps?.members || {};
  const out = [];
  for (const row of boardRows) {
    const member = members[row.walletShort];
    if (!member || member.muted) continue;
    if (!betsFeedOn(member, row.sport, row.marketType)) continue;
    out.push(row);
  }
  return out;
}

async function loadExits(db, boardRows, date, now) {
  let snap;
  try {
    snap = await db.collection('sharp_action_positions')
      .where('date', '==', date)
      .where('status', '==', 'EXITED')
      .get();
  } catch (err) {
    console.error('Exit query failed:', err?.message || err);
    return [];
  }
  const stillOpen = new Set(
    boardRows.map((r) => `${r.walletShort}|${r.sport}|${r.gameKey}|${String(r.marketType).toUpperCase()}|${r.side}`),
  );
  const exits = [];
  for (const doc of snap.docs) {
    const data = doc.data() || {};
    if (!REAL_EXIT_REASONS.has(data.exitReason)) continue;
    const exitedAt = data.exitedAt?.toMillis?.() || null;
    if (!exitedAt || now - exitedAt > EXIT_FRESH_MS) continue;
    const walletShort = shortOf(data.walletShort || data.wallet);
    const marketType = String(data.marketType || '').toUpperCase();
    const side = String(data.side || '').toLowerCase();
    const key = `${walletShort}|${data.sport}|${data.gameKey}|${marketType}|${side}`;
    if (stillOpen.has(key)) continue;
    exits.push({
      sport: data.sport,
      gameKey: data.gameKey,
      away: data.away || null,
      home: data.home || null,
      walletShort,
      marketType,
      side,
      team: data.teamName || data.outcome || null,
      invested: Number(data.invested) || 0,
      exitedAt,
    });
  }
  return exits;
}

async function alreadySent(db, uid, stamp) {
  const snap = await db.collection('mySharpAlertSends').doc(stampDocId(uid, stamp)).get();
  return snap.exists;
}

async function markSent(db, uid, alert) {
  await db.collection('mySharpAlertSends').doc(stampDocId(uid, alert.stamp)).set({
    uid,
    reason: alert.reason,
    stamp: alert.stamp,
    heading: alert.heading,
    body: alert.body,
    sentAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function sendPush({ uid, alert }) {
  if (!REST_KEY) throw new Error('ONESIGNAL_REST_API_KEY is not set');
  const res = await fetch('https://api.onesignal.com/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${REST_KEY}`,
      'Idempotency-Key': pushKey(uid, alert.stamp),
    },
    body: JSON.stringify({
      app_id: APP_ID,
      target_channel: 'push',
      include_aliases: { external_id: [uid] },
      headings: { en: alert.heading },
      contents: { en: alert.body },
      url: SITE_URL,
      ttl: 7200,
      priority: 10,
      chrome_web_icon: ICON,
      firefox_icon: ICON,
      chrome_web_badge: ICON,
      web_push_topic: pushKey(uid, alert.stamp),
      name: alert.heading.slice(0, 128),
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || (json.errors && !json.id)) {
    const msg = json?.errors ? JSON.stringify(json.errors) : res.statusText;
    throw new Error(`OneSignal ${res.status}: ${msg}`);
  }
  return json.id || null;
}

function isOilersAlert(alert) {
  const blob = `${alert.gameKey || ''} ${alert.body || ''}`.toLowerCase();
  return blob.includes('uta_edm') || blob.includes('oiler');
}

async function main() {
  const now = Date.now();
  const date = etDate(new Date(now));
  console.log(`\n=== my sharp alerts — ${date} ===`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}${TEST_OILERS ? ' · OILERS TEST' : ''}`);

  const db = initFirebase();
  const roster = await ensureOwnerSeat(db);
  const spots = MY_SHARP_ALERT_CAP - Object.keys(roster.members || {}).length;
  console.log(`Beta seats taken: ${Object.keys(roster.members || {}).length} · ${Math.max(0, spots)} remaining`);

  const [poly, ...files] = await Promise.all([
    fetchJson(`${BOARD}/polymarket_data.json`).catch((err) => {
      console.error('polymarket board:', err.message);
      return {};
    }),
    ...POSITION_FILES.map(([name]) => fetchJson(`${BOARD}/${name}`).catch((err) => {
      console.error(`${name}:`, err.message);
      return null;
    })),
  ]);
  const paired = files.map((data, i) => [data, POSITION_FILES[i][1]]);
  const boardRows = flattenBoard(paired, poly, now);
  console.log(`Open pregame positions: ${boardRows.length}`);

  const exits = TEST_OILERS ? [] : await loadExits(db, boardRows, date, now);
  const users = await loadRosterUsers(db, roster);
  const targets = TEST_OILERS ? users.filter((u) => u.uid === OWNER_UID) : users;

  let sent = 0;
  let skipped = 0;
  for (const user of targets) {
    const mine = rowsForUser(boardRows, user.sharps);
    const mineShorts = new Set(Object.keys(user.sharps?.members || {}));
    const mineExits = exits.filter((row) => {
      const member = user.sharps?.members?.[row.walletShort];
      if (!member || member.muted || !mineShorts.has(row.walletShort)) return false;
      return betsFeedOn(member, row.sport, row.marketType);
    });
    let alerts = planMySharpAlerts({ prefs: user.prefs, rows: mine, exits: mineExits });
    if (TEST_OILERS) {
      alerts = alerts.filter((a) => a.reason === 'together' && isOilersAlert(a));
      if (!alerts.length) {
        console.error('No together alert on the Oilers for the owner. Not sending a stand-in.');
        process.exit(1);
      }
      alerts = alerts.slice(0, 1);
    }
    for (const alert of alerts) {
      const dup = await alreadySent(db, user.uid, alert.stamp);
      if (dup) {
        skipped += 1;
        console.log(`skip ${user.uid.slice(0, 6)} ${alert.stamp}`);
        continue;
      }
      console.log(`→ ${user.uid.slice(0, 6)} [${alert.reason}] ${alert.body}`);
      if (DRY_RUN) continue;
      const id = await sendPush({ uid: user.uid, alert });
      await markSent(db, user.uid, alert);
      sent += 1;
      console.log(`sent ${id || '(no id)'} ${alert.stamp}`);
    }
  }
  console.log(`Done. sent=${sent} already-sent=${skipped}${DRY_RUN ? ' (dry run, nothing sent)' : ''}`);
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
