/**
 * NHL Savant - Sharpflow
 * One public MCP URL for Perplexity (no auth) and ChatGPT (optional OAuth).
 * Streamable HTTP. The OAuth path only exists so a client that insists on
 * sign-in can finish the handshake. The data is the same either way.
 */

const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const {
  SERVER_NAME,
  TOOLS,
  etDate,
  publicLockedSide,
  gradedStake,
  emptyRecord,
  accumulate,
  finishRecord,
  indexFeeds,
  shortsInGames,
  handleMcpMessage,
  redirectAllowed,
  issueCode,
  verifyCode,
} = require('./sharpflowPublic');

const FEEDS = [
  ['ML', 'sharp_positions.json'],
  ['SPREAD', 'sharp_spread_positions.json'],
  ['TOTAL', 'sharp_total_positions.json'],
];
const COLLECTIONS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];
const CACHE_MS = 90 * 1000;

let feedCache = { at: 0, games: [], scannedAt: null };
let priceCache = { at: 0, data: null };
let recordCache = { at: 0, public: null };

function baseUrl(req) {
  const proto = req.get('x-forwarded-proto') || 'https';
  const host = req.get('x-forwarded-host') || req.get('host');
  const path = String(req.originalUrl || req.url || '/').split('?')[0];
  const suffix = path.replace(/\/(\.well-known\/.*|authorize|token|register)\/?$/, '');
  const root = suffix && suffix !== '/' ? suffix : '';
  return `${proto}://${host}${root}`.replace(/\/$/, '');
}

function routeOf(req) {
  const path = String(req.originalUrl || req.url || '/').split('?')[0];
  if (path.includes('oauth-protected-resource')) return 'protected';
  if (path.includes('oauth-authorization-server')) return 'metadata';
  if (path.endsWith('/authorize')) return 'authorize';
  if (path.endsWith('/token')) return 'token';
  if (path.endsWith('/register')) return 'register';
  return 'mcp';
}

async function fetchFeeds() {
  const now = Date.now();
  if (feedCache.games.length && now - feedCache.at < CACHE_MS) return feedCache;
  const feeds = [];
  for (const [market, file] of FEEDS) {
    const res = await fetch(`https://nhlsavant.com/${file}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Referer: 'https://nhlsavant.com/',
      },
    });
    if (!res.ok) throw new Error(`${file} returned ${res.status}`);
    feeds.push({ market, data: await res.json() });
  }
  const indexed = indexFeeds(feeds);
  feedCache = { at: now, games: indexed.games, scannedAt: indexed.scannedAt };
  return feedCache;
}

async function loadProfiles(shorts) {
  const db = admin.firestore();
  const map = new Map();
  const refs = shorts.map((id) => db.collection('sharpWalletProfiles').doc(id));
  for (let i = 0; i < refs.length; i += 100) {
    const snaps = await db.getAll(...refs.slice(i, i + 100));
    for (const snap of snaps) {
      if (snap.exists) map.set(snap.id, snap.data());
    }
  }
  return map;
}

async function loadPrices() {
  const now = Date.now();
  if (priceCache.data && now - priceCache.at < CACHE_MS) return priceCache.data;
  const res = await fetch('https://nhlsavant.com/pinnacle_history.json', {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Referer: 'https://nhlsavant.com/',
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  priceCache = { at: now, data };
  return data;
}

async function tallyRange(from, through) {
  const db = admin.firestore();
  const record = emptyRecord();
  for (const [col, market] of COLLECTIONS) {
    const snap = await db.collection(col)
      .where('date', '>=', from)
      .where('date', '<=', through)
      .select('sport', 'date', 'sides')
      .get();
    for (const doc of snap.docs) {
      const pick = doc.data() || {};
      for (const sideKey of Object.keys(pick.sides || {})) {
        accumulate(record, gradedStake(pick, sideKey, market));
      }
    }
  }
  return record;
}

function addDays(iso, days) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

async function loadRecord() {
  const now = Date.now();
  if (recordCache.public && now - recordCache.at < CACHE_MS) return recordCache.public;
  const db = admin.firestore();
  const snap = await db.collection('sharpflowMcpCache').doc('cardRecord').get();
  if (!snap.exists) return null;
  const base = snap.data() || {};
  const today = etDate();
  const from = base.through ? addDays(base.through, 1) : null;
  const record = base.buckets ? JSON.parse(JSON.stringify(base.buckets)) : emptyRecord();
  if (from && from <= today) {
    accumulateBuckets(record, await tallyRange(from, today));
  }
  const pub = finishRecord(record, '2026-06-01', today);
  recordCache = { at: now, public: pub };
  return pub;
}

function accumulateBuckets(into, extra) {
  if (!into.all) into.all = { wins: 0, losses: 0, pushes: 0, units: 0, profit: 0 };
  if (!into.sports) into.sports = {};
  if (!into.cells) into.cells = {};
  const pull = (bucket) => {
    if (!bucket) return;
    into.all.wins += bucket.wins || 0;
    into.all.losses += bucket.losses || 0;
    into.all.pushes += bucket.pushes || 0;
    into.all.units += bucket.units || 0;
    into.all.profit += bucket.profit || 0;
  };
  pull(extra.all);
  for (const [sport, bucket] of Object.entries(extra.sports || {})) {
    if (!into.sports[sport]) into.sports[sport] = { wins: 0, losses: 0, pushes: 0, units: 0, profit: 0 };
    const dest = into.sports[sport];
    dest.wins += bucket.wins || 0;
    dest.losses += bucket.losses || 0;
    dest.pushes += bucket.pushes || 0;
    dest.units += bucket.units || 0;
    dest.profit += bucket.profit || 0;
  }
  for (const [cell, bucket] of Object.entries(extra.cells || {})) {
    if (!into.cells[cell]) into.cells[cell] = { wins: 0, losses: 0, pushes: 0, units: 0, profit: 0 };
    const dest = into.cells[cell];
    dest.wins += bucket.wins || 0;
    dest.losses += bucket.losses || 0;
    dest.pushes += bucket.pushes || 0;
    dest.units += bucket.units || 0;
    dest.profit += bucket.profit || 0;
  }
}

async function loadAction() {
  const { games, scannedAt } = await fetchFeeds();
  const profiles = await loadProfiles(shortsInGames(games));
  return { games, scannedAt, profiles };
}

async function loadLocked({ date, sport }) {
  const db = admin.firestore();
  const plays = [];
  for (const [col, market] of COLLECTIONS) {
    const snap = await db.collection(col).where('date', '==', date).get();
    for (const doc of snap.docs) {
      const pick = doc.data() || {};
      if (sport && String(pick.sport || '').toUpperCase() !== sport) continue;
      for (const sideKey of Object.keys(pick.sides || {})) {
        const row = publicLockedSide(pick, sideKey, market);
        if (row) plays.push(row);
      }
    }
  }
  plays.sort((a, b) => String(a.kickoffEt || '').localeCompare(String(b.kickoffEt || '')));
  return plays;
}

function sendRpc(req, res, payload, status = 200) {
  const accept = String(req.headers.accept || '');
  if (accept.includes('text/event-stream')) {
    res.status(status);
    res.set('Content-Type', 'text/event-stream');
    res.set('Cache-Control', 'no-cache, no-transform');
    res.send(`event: message\ndata: ${JSON.stringify(payload)}\n\n`);
    return;
  }
  res.status(status).json(payload);
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body) return JSON.parse(req.body);
  return null;
}

function formBody(req) {
  const raw = typeof req.body === 'string' ? req.body : '';
  const params = new URLSearchParams(raw);
  const out = {};
  for (const [k, v] of params.entries()) out[k] = v;
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    return { ...out, ...req.body };
  }
  return out;
}

async function onMcp(req, res) {
  let body;
  try {
    body = readBody(req);
  } catch {
    sendRpc(req, res, { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, 400);
    return;
  }
  if (!body) {
    sendRpc(req, res, { jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid request' } }, 400);
    return;
  }
  const ctx = { loadLocked, loadAction, loadRecord, loadPrices };
  if (Array.isArray(body)) {
    const replies = [];
    for (const msg of body) {
      const reply = await handleMcpMessage(msg, ctx);
      if (reply) replies.push(reply);
    }
    if (!replies.length) {
      res.status(202).send('');
      return;
    }
    sendRpc(req, res, replies);
    return;
  }
  const reply = await handleMcpMessage(body, ctx);
  if (!reply) {
    res.status(202).send('');
    return;
  }
  sendRpc(req, res, reply);
}

function onMetadata(req, res) {
  const root = baseUrl(req);
  res.json({
    issuer: root,
    authorization_endpoint: `${root}/authorize`,
    token_endpoint: `${root}/token`,
    registration_endpoint: `${root}/register`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['none'],
  });
}

function onProtected(req, res) {
  const root = baseUrl(req);
  res.json({
    resource: root,
    authorization_servers: [root],
    bearer_methods_supported: ['header'],
  });
}

function onRegister(req, res) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  res.json({
    client_id: body.client_name ? `sharpflow-${String(body.client_name).slice(0, 24)}` : 'sharpflow-public',
    client_id_issued_at: Math.floor(Date.now() / 1000),
    client_secret_expires_at: 0,
    redirect_uris: body.redirect_uris || [],
    grant_types: ['authorization_code'],
    response_types: ['code'],
    token_endpoint_auth_method: 'none',
  });
}

function onAuthorize(req, res) {
  const q = req.query || {};
  if (!redirectAllowed(q.redirect_uri)) {
    res.status(400).json({ error: 'redirect_uri is not allowed' });
    return;
  }
  const url = new URL(q.redirect_uri);
  url.searchParams.set('code', issueCode(q.code_challenge));
  if (q.state) url.searchParams.set('state', q.state);
  res.redirect(302, url.toString());
}

function onToken(req, res) {
  const body = formBody(req);
  if (!verifyCode(body.code, body.code_verifier)) {
    res.status(400).json({ error: 'invalid_grant' });
    return;
  }
  res.json({
    access_token: 'public',
    token_type: 'Bearer',
    expires_in: 60 * 60 * 24,
  });
}

const sharpflowMcp = onRequest({
  region: 'us-central1',
  cors: true,
  memory: '512MiB',
  timeoutSeconds: 60,
  invoker: 'public',
}, async (req, res) => {
  try {
    if (req.method === 'GET' && routeOf(req) === 'mcp') {
      res.json({
        name: SERVER_NAME,
        transport: 'streamable-http',
        authentication: 'none, or the optional OAuth handshake on this same URL',
        tools: TOOLS.map((tool) => tool.name),
      });
      return;
    }
    const route = routeOf(req);
    if (route === 'protected') return onProtected(req, res);
    if (route === 'metadata') return onMetadata(req, res);
    if (route === 'register' && req.method === 'POST') return onRegister(req, res);
    if (route === 'authorize' && req.method === 'GET') return onAuthorize(req, res);
    if (route === 'token' && req.method === 'POST') return onToken(req, res);
    if (req.method === 'POST' && route === 'mcp') return await onMcp(req, res);
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    logger.error('sharpflowMcp', err);
    const today = etDate();
    res.status(500).json({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32603, message: err?.message || 'Server error' },
      date: today,
    });
  }
});

module.exports = { sharpflowMcp };
