/**
 * Account-page Sharp Flow connector.
 * Same card as the public connector. A question is answered only when the
 * bearer key belongs to a user who is active or trialing on scout, elite, or pro.
 */

const { onRequest, onCall, HttpsError } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const { SERVER_NAME, TOOLS } = require('./sharpflowPublic');
const { postMcp } = require('./sharpflowMcp');
const {
  membershipFromUser,
  hashKey,
  newKey,
  bearerKey,
  asksForCard,
} = require('./membership');

const KEYS = 'sharpflowConnectorKeys';
const MEMBER_URL = 'https://sharpflowmcpmember-lviwud3q2q-uc.a.run.app';

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body) return JSON.parse(req.body);
  return null;
}

function denyMessage(reason) {
  if (reason === 'inactive') {
    return 'This key belongs to an account that is not on an active plan or a free trial.';
  }
  if (reason === 'bad-key') {
    return 'That key is not valid. Create a new one on your NHL Savant account page.';
  }
  return 'Create a key on your NHL Savant account page and paste it as the authentication.';
}

function sendDeny(req, res, body, reason) {
  const id = Array.isArray(body) ? null : (body?.id ?? null);
  const payload = {
    jsonrpc: '2.0',
    id,
    error: { code: -32001, message: denyMessage(reason) },
  };
  const accept = String(req.headers.accept || '');
  if (accept.includes('text/event-stream')) {
    res.status(401);
    res.set('Content-Type', 'text/event-stream');
    res.set('Cache-Control', 'no-cache, no-transform');
    res.send(`event: message\ndata: ${JSON.stringify(payload)}\n\n`);
    return;
  }
  res.status(401).json(payload);
}

async function resolveMember(req) {
  const key = bearerKey(req.headers);
  if (!key) return { ok: false, reason: 'no-key' };
  const snap = await admin.firestore().collection(KEYS).doc(hashKey(key)).get();
  if (!snap.exists || snap.get('revoked') === true || !snap.get('uid')) {
    return { ok: false, reason: 'bad-key' };
  }
  const user = await admin.firestore().collection('users').doc(snap.get('uid')).get();
  const member = membershipFromUser(user.data());
  if (!member) return { ok: false, reason: 'inactive' };
  return { ok: true, uid: snap.get('uid'), ...member };
}

const sharpflowMcpMember = onRequest({
  region: 'us-central1',
  cors: true,
  memory: '512MiB',
  timeoutSeconds: 60,
  invoker: 'public',
}, async (req, res) => {
  try {
    if (req.method === 'GET') {
      res.json({
        name: SERVER_NAME,
        transport: 'streamable-http',
        authentication: 'Bearer key from the NHL Savant account page. An active plan or a free trial is checked on every question.',
        tools: TOOLS.map((tool) => tool.name),
      });
      return;
    }
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    let body = null;
    try {
      body = readBody(req);
    } catch {
      body = null;
    }
    if (asksForCard(body)) {
      const member = await resolveMember(req);
      if (!member.ok) {
        sendDeny(req, res, body, member.reason);
        return;
      }
    }
    await postMcp(req, res);
  } catch (err) {
    logger.error('sharpflowMcpMember', err);
    res.status(500).json({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32603, message: 'Server error' },
    });
  }
});

const createSharpflowConnectorKey = onCall({
  region: 'us-central1',
  cors: true,
  invoker: 'public',
  timeoutSeconds: 30,
}, async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Sign in first.');
  }
  const uid = request.auth.uid;
  const db = admin.firestore();
  const userRef = db.collection('users').doc(uid);
  const user = await userRef.get();
  const member = membershipFromUser(user.data());
  if (!member) {
    throw new HttpsError('permission-denied', 'An active plan or a free trial is required.');
  }
  const key = newKey();
  const hash = hashKey(key);
  const prev = user.get('sharpflowConnectorKeyHash');
  const batch = db.batch();
  if (prev && prev !== hash) {
    batch.set(db.collection(KEYS).doc(prev), {
      revoked: true,
      revokedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  }
  batch.set(db.collection(KEYS).doc(hash), {
    uid,
    revoked: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  batch.set(userRef, { sharpflowConnectorKeyHash: hash }, { merge: true });
  await batch.commit();
  return {
    key,
    url: MEMBER_URL,
    name: SERVER_NAME,
    tier: member.tier,
    trial: member.trial,
  };
});

module.exports = { sharpflowMcpMember, createSharpflowConnectorKey, MEMBER_URL };
