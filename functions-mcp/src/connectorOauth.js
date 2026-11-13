/**
 * Sign-in for the member connector.
 * ChatGPT, Claude, and Grok register a public client, send the member
 * through NHL Savant login, and then call with a bearer token.
 * Pasted account keys stay valid for apps that only have a key field.
 */

const crypto = require('crypto');
const { hashKey } = require('./membership');
const firebaseWeb = require('./firebaseWebConfig');

const SCOPE = 'sharpflow.read';
const CODE_TTL_MS = 60 * 1000;
const ACCESS_TTL_MS = 60 * 60 * 1000;
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const PLAN_URL = 'https://nhlsavant.com/pricing';

function newSecret(prefix) {
  return `${prefix}_${crypto.randomBytes(32).toString('base64url')}`;
}

function pkceS256(verifier, challenge) {
  if (!verifier || !challenge) return false;
  const hash = crypto.createHash('sha256').update(String(verifier)).digest('base64url');
  const a = Buffer.from(hash);
  const b = Buffer.from(String(challenge));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function redirectAllowed(uri) {
  let url;
  try {
    url = new URL(uri);
  } catch {
    return false;
  }
  if (url.username || url.password) return false;
  const path = url.pathname.replace(/\/$/, '') || '/';
  if (url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
    return true;
  }
  if (url.protocol !== 'https:') return false;
  if (url.hostname === 'chatgpt.com') {
    return path.startsWith('/connector/oauth') || path === '/connector_platform_oauth_redirect';
  }
  if (url.hostname === 'claude.ai' || url.hostname === 'claude.com') {
    return path.startsWith('/api/');
  }
  if (url.hostname === 'grok.com') {
    return path === '/connectors-oauth-exchange-code' || path.startsWith('/oauth/');
  }
  return false;
}

function cleanRedirects(list) {
  const out = [];
  for (const uri of list || []) {
    if (typeof uri === 'string' && redirectAllowed(uri) && !out.includes(uri)) out.push(uri);
  }
  return out;
}

function cimdAllowed(uri) {
  let url;
  try {
    url = new URL(uri);
  } catch {
    return false;
  }
  return url.protocol === 'https:' && ['chatgpt.com', 'claude.ai', 'claude.com', 'grok.com'].includes(url.hostname);
}

function refreshDecision(token, family, now) {
  if (!token || token.type !== 'refresh') return { ok: false, revokeFamily: false };
  if (!(token.expiresAt > now)) return { ok: false, revokeFamily: false };
  if (!family || family.revoked) return { ok: false, revokeFamily: Boolean(family) };
  if (token.revoked || token.generation !== family.generation) {
    return { ok: false, revokeFamily: true };
  }
  return { ok: true, nextGeneration: family.generation + 1 };
}

function protectedResourceMetadata(issuer) {
  return {
    resource: issuer,
    authorization_servers: [issuer],
    scopes_supported: [SCOPE],
    bearer_methods_supported: ['header'],
  };
}

function authorizationServerMetadata(issuer) {
  return {
    issuer,
    authorization_endpoint: `${issuer}/oauth/authorize`,
    token_endpoint: `${issuer}/oauth/token`,
    registration_endpoint: `${issuer}/oauth/register`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    response_modes_supported: ['query'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['none'],
    scopes_supported: [SCOPE],
    client_id_metadata_document_supported: true,
  };
}

function wwwAuthenticate(issuer) {
  return `Bearer resource_metadata="${issuer}/.well-known/oauth-protected-resource", scope="${SCOPE}"`;
}

function appLabel(redirects, clientName) {
  if (clientName) return String(clientName).slice(0, 80);
  const host = redirects && redirects[0] ? new URL(redirects[0]).hostname : '';
  if (host === 'chatgpt.com') return 'ChatGPT';
  if (host === 'claude.ai' || host === 'claude.com') return 'Claude';
  if (host === 'grok.com') return 'Grok';
  return 'This app';
}

function loginPage({ issuer, params, clientName, config }) {
  const payload = JSON.stringify({
    issuer,
    params,
    clientName,
    config,
    planUrl: PLAN_URL,
  }).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sign in to NHL Savant</title>
  <style>
    body { margin: 0; font-family: Georgia, "Iowan Old Style", serif; background: #0A0E27; color: #F1F5F9; }
    main { max-width: 28rem; margin: 8vh auto; padding: 2rem 1.25rem; }
    h1 { font-size: 1.6rem; margin: 0 0 0.75rem; }
    p { line-height: 1.5; color: rgba(241,245,249,0.82); }
    button { margin-top: 1.25rem; background: #D4AF37; color: #0A0E27; border: 0; border-radius: 10px; padding: 0.9rem 1.2rem; font-weight: 700; font-size: 1rem; cursor: pointer; }
    a { color: #F5D76E; }
    .err { color: #FCA5A5; }
  </style>
</head>
<body>
  <main>
    <h1>NHL Savant</h1>
    <p id="lead"></p>
    <p class="err" id="err"></p>
    <button id="go" type="button">Sign in with Google</button>
  </main>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js"></script>
  <script id="sf-oauth" type="application/json">${payload}</script>
  <script>
    const boot = JSON.parse(document.getElementById('sf-oauth').textContent);
    const lead = document.getElementById('lead');
    const err = document.getElementById('err');
    lead.textContent = 'Allow ' + boot.clientName + ' to read your SharpFlow card while your plan or free trial is active.';
    firebase.initializeApp(boot.config);
    const auth = firebase.auth();
    const stored = sessionStorage.getItem('sf_oauth');
    const params = stored ? JSON.parse(stored) : boot.params;
    async function finish(user) {
      const idToken = await user.getIdToken();
      const res = await fetch(boot.issuer + '/oauth/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ idToken: idToken }, params)),
      });
      const data = await res.json();
      if (data.redirect) {
        window.location = data.redirect;
        return;
      }
      document.getElementById('go').style.display = 'none';
      err.textContent = data.message || 'This account needs an active plan or a free trial.';
      if (data.planUrl) {
        const link = document.createElement('a');
        link.href = data.planUrl;
        link.textContent = 'View plans';
        err.appendChild(document.createElement('br'));
        err.appendChild(link);
      }
    }
    auth.getRedirectResult().then((result) => {
      if (result && result.user) return finish(result.user);
    }).catch((e) => { err.textContent = e.message || 'Sign-in failed.'; });
    document.getElementById('go').onclick = () => {
      sessionStorage.setItem('sf_oauth', JSON.stringify(boot.params));
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithRedirect(provider);
    };
  </script>
</body>
</html>`;
}

function readForm(req) {
  const out = {};
  const raw = typeof req.body === 'string' ? req.body : '';
  if (raw) {
    const params = new URLSearchParams(raw);
    for (const [k, v] of params.entries()) out[k] = v;
  }
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    Object.assign(out, req.body);
  }
  return out;
}

async function loadClient(db, clientId) {
  if (typeof clientId === 'string' && clientId.startsWith('https://')) {
    if (!cimdAllowed(clientId)) return null;
    const res = await fetch(clientId, { headers: { accept: 'application/json' } });
    if (!res.ok) return null;
    const doc = await res.json();
    return {
      clientId,
      clientName: appLabel(doc.redirect_uris, doc.client_name),
      redirectUris: cleanRedirects(doc.redirect_uris),
    };
  }
  const snap = await db.collection('connectorOauthClients').doc(String(clientId || '')).get();
  if (!snap.exists) return null;
  return {
    clientId,
    clientName: snap.get('clientName') || 'This app',
    redirectUris: snap.get('redirectUris') || [],
  };
}

function createOauthHandlers({ db, auth, issuer, now = () => Date.now() }) {
  async function register(req, res) {
    const body = readForm(req);
    const redirectUris = cleanRedirects(body.redirect_uris);
    if (!redirectUris.length) {
      res.status(400).json({ error: 'invalid_redirect_uri' });
      return;
    }
    const clientId = newSecret('sfc');
    const clientName = appLabel(redirectUris, body.client_name);
    await db.collection('connectorOauthClients').doc(clientId).set({
      clientName,
      redirectUris,
      createdAt: now(),
    });
    res.json({
      client_id: clientId,
      client_id_issued_at: Math.floor(now() / 1000),
      client_secret_expires_at: 0,
      client_name: clientName,
      redirect_uris: redirectUris,
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      token_endpoint_auth_method: 'none',
    });
  }

  async function authorize(req, res) {
    const q = req.query || {};
    const client = await loadClient(db, q.client_id);
    if (!client || !redirectAllowed(q.redirect_uri) || !client.redirectUris.includes(q.redirect_uri)) {
      res.status(400).type('html').send('<!doctype html><title>NHL Savant</title><p>This connection could not be started.</p>');
      return;
    }
    if (q.response_type !== 'code' || q.code_challenge_method !== 'S256' || !q.code_challenge) {
      res.status(400).json({ error: 'invalid_request' });
      return;
    }
    res.type('html').send(loginPage({
      issuer,
      clientName: client.clientName,
      config: firebaseWeb,
      params: {
        clientId: q.client_id,
        redirectUri: q.redirect_uri,
        state: q.state || '',
        codeChallenge: q.code_challenge,
        codeChallengeMethod: q.code_challenge_method,
        resource: q.resource || issuer,
      },
    }));
  }

  async function complete(req, res) {
    const body = readForm(req);
    let uid = '';
    try {
      const decoded = await auth.verifyIdToken(body.idToken);
      uid = decoded.uid;
    } catch {
      res.status(401).json({ message: 'Sign in again.' });
      return;
    }
    const client = await loadClient(db, body.clientId);
    if (!client || !client.redirectUris.includes(body.redirectUri) || !redirectAllowed(body.redirectUri)) {
      res.status(400).json({ message: 'This app is not allowed to connect.' });
      return;
    }
    const user = await db.collection('users').doc(uid).get();
    const { membershipFromUser } = require('./membership');
    const member = membershipFromUser(user.data(), now());
    if (!member) {
      res.json({
        message: 'An active plan or a free trial is required.',
        planUrl: PLAN_URL,
      });
      return;
    }
    const code = newSecret('sfcod');
    await db.collection('connectorOauthCodes').doc(hashKey(code)).set({
      uid,
      clientId: body.clientId,
      redirectUri: body.redirectUri,
      codeChallenge: body.codeChallenge,
      resource: body.resource || issuer,
      expiresAt: now() + CODE_TTL_MS,
      used: false,
    });
    const url = new URL(body.redirectUri);
    url.searchParams.set('code', code);
    if (body.state) url.searchParams.set('state', body.state);
    res.json({ redirect: url.toString() });
  }

  async function issuePair(meta) {
    const access = newSecret('sfa');
    const refresh = newSecret('sfr');
    const family = meta.family || newSecret('sff');
    const generation = meta.generation || 1;
    const stamp = now();
    const batch = db.batch();
    if (!meta.family) {
      batch.set(db.collection('connectorOauthFamilies').doc(family), {
        uid: meta.uid,
        clientId: meta.clientId,
        clientName: meta.clientName || 'This app',
        generation,
        revoked: false,
        createdAt: stamp,
      });
    } else {
      batch.set(db.collection('connectorOauthFamilies').doc(family), { generation }, { merge: true });
    }
    batch.set(db.collection('connectorTokens').doc(hashKey(access)), {
      type: 'access',
      uid: meta.uid,
      clientId: meta.clientId,
      family,
      resource: meta.resource || issuer,
      expiresAt: stamp + ACCESS_TTL_MS,
      revoked: false,
    });
    batch.set(db.collection('connectorTokens').doc(hashKey(refresh)), {
      type: 'refresh',
      uid: meta.uid,
      clientId: meta.clientId,
      family,
      generation,
      resource: meta.resource || issuer,
      expiresAt: stamp + REFRESH_TTL_MS,
      revoked: false,
    });
    await batch.commit();
    return {
      access_token: access,
      token_type: 'Bearer',
      expires_in: Math.floor(ACCESS_TTL_MS / 1000),
      refresh_token: refresh,
      scope: SCOPE,
    };
  }

  async function token(req, res) {
    const body = readForm(req);
    if (body.grant_type === 'authorization_code') {
      const ref = db.collection('connectorOauthCodes').doc(hashKey(body.code || ''));
      let code;
      try {
        code = await db.runTransaction(async (tx) => {
          const snap = await tx.get(ref);
          if (!snap.exists || snap.get('used') || !(snap.get('expiresAt') > now())) {
            throw new Error('invalid_grant');
          }
          if (snap.get('clientId') !== body.client_id || snap.get('redirectUri') !== body.redirect_uri) {
            throw new Error('invalid_grant');
          }
          if (!pkceS256(body.code_verifier, snap.get('codeChallenge'))) {
            throw new Error('invalid_grant');
          }
          tx.update(ref, { used: true });
          return snap.data();
        });
      } catch {
        res.status(400).json({ error: 'invalid_grant' });
        return;
      }
      const client = await loadClient(db, code.clientId);
      const issued = await issuePair({
        uid: code.uid,
        clientId: code.clientId,
        clientName: client && client.clientName,
        resource: code.resource,
      });
      res.json(issued);
      return;
    }
    if (body.grant_type === 'refresh_token') {
      const ref = db.collection('connectorTokens').doc(hashKey(body.refresh_token || ''));
      let next;
      try {
        next = await db.runTransaction(async (tx) => {
          const snap = await tx.get(ref);
          const tokenRow = snap.exists ? snap.data() : null;
          const familyRef = tokenRow && tokenRow.family
            ? db.collection('connectorOauthFamilies').doc(tokenRow.family)
            : null;
          const familySnap = familyRef ? await tx.get(familyRef) : null;
          const decision = refreshDecision(tokenRow, familySnap && familySnap.exists ? familySnap.data() : null, now());
          if (!decision.ok) {
            if (decision.revokeFamily && familyRef) tx.set(familyRef, { revoked: true }, { merge: true });
            throw new Error('invalid_grant');
          }
          tx.set(familyRef, { generation: decision.nextGeneration }, { merge: true });
          tx.update(ref, { revoked: true });
          return {
            uid: tokenRow.uid,
            clientId: tokenRow.clientId,
            family: tokenRow.family,
            resource: tokenRow.resource,
            generation: decision.nextGeneration,
          };
        });
      } catch {
        res.status(400).json({ error: 'invalid_grant' });
        return;
      }
      const client = await loadClient(db, next.clientId);
      res.json(await issuePair({ ...next, clientName: client && client.clientName }));
      return;
    }
    res.status(400).json({ error: 'unsupported_grant_type' });
  }

  async function resolveAccessToken(raw) {
    const snap = await db.collection('connectorTokens').doc(hashKey(raw)).get();
    if (!snap.exists || snap.get('type') !== 'access' || snap.get('revoked') || !(snap.get('expiresAt') > now())) {
      return { ok: false, reason: 'bad-key' };
    }
    const family = await db.collection('connectorOauthFamilies').doc(snap.get('family')).get();
    if (family.exists && family.get('revoked') === true) return { ok: false, reason: 'bad-key' };
    return { ok: true, uid: snap.get('uid') };
  }

  return { register, authorize, complete, token, resolveAccessToken, loadClient };
}

module.exports = {
  SCOPE,
  CODE_TTL_MS,
  ACCESS_TTL_MS,
  REFRESH_TTL_MS,
  PLAN_URL,
  newSecret,
  pkceS256,
  redirectAllowed,
  cleanRedirects,
  cimdAllowed,
  refreshDecision,
  protectedResourceMetadata,
  authorizationServerMetadata,
  wwwAuthenticate,
  appLabel,
  createOauthHandlers,
};
