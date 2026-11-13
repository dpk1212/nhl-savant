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
  <meta name="theme-color" content="#0B0F1F">
  <title>Sign in · SharpFlow</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0B0F1F;
      --card: #151923;
      --line: #252B3B;
      --gold: #D4AF37;
      --gold-2: #E5C158;
      --text: #F8FAFC;
      --muted: #94A3B8;
      --faint: #64748B;
      --danger: #FCA5A5;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; }
    body {
      font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif;
      background:
        radial-gradient(900px 420px at 50% -10%, rgba(212, 175, 55, 0.16), transparent 60%),
        var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
    }
    main {
      max-width: 26.5rem;
      margin: 0 auto;
      padding: 8vh 1.25rem 3rem;
    }
    .card {
      background: linear-gradient(180deg, rgba(255,255,255,0.03), transparent 28%), var(--card);
      border: 1px solid var(--line);
      border-radius: 18px;
      box-shadow: 0 24px 48px -24px rgba(0,0,0,0.75);
      padding: 1.75rem 1.5rem 1.35rem;
      position: relative;
      overflow: hidden;
    }
    .card:before {
      content: "";
      position: absolute;
      left: 0; right: 0; top: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      color: var(--gold);
      font-weight: 800;
      font-size: 1.15rem;
      letter-spacing: -0.03em;
    }
    .brand svg { flex: none; }
    .kicker {
      margin: 1.35rem 0 0.35rem;
      color: var(--gold-2);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    h1 {
      margin: 0;
      font-size: 1.65rem;
      line-height: 1.15;
      letter-spacing: -0.035em;
      font-weight: 800;
    }
    .lead {
      margin: 0.75rem 0 0;
      color: var(--muted);
      font-size: 0.95rem;
      line-height: 1.55;
    }
    ul {
      margin: 1.1rem 0 0;
      padding: 0;
      list-style: none;
      border-top: 1px solid var(--line);
    }
    li {
      display: flex;
      gap: 0.65rem;
      align-items: flex-start;
      padding: 0.72rem 0;
      border-bottom: 1px solid var(--line);
      color: #CBD5E1;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    li:before {
      content: "";
      width: 0.45rem;
      height: 0.45rem;
      margin-top: 0.4rem;
      border-radius: 99px;
      background: var(--gold);
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
      flex: none;
    }
    button {
      width: 100%;
      margin-top: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.7rem;
      background: #fff;
      color: #1F2937;
      border: 0;
      border-radius: 12px;
      padding: 0.85rem 1rem;
      font: inherit;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      box-shadow: 0 1px 0 rgba(255,255,255,0.4) inset, 0 8px 18px -12px rgba(0,0,0,0.8);
    }
    button:hover { background: #F8FAFC; }
    button:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
    button:disabled { cursor: wait; opacity: 0.72; }
    .err {
      min-height: 0;
      margin: 0.85rem 0 0;
      color: var(--danger);
      font-size: 0.88rem;
      line-height: 1.45;
    }
    .err:empty { display: none; }
    a.plans {
      display: inline-flex;
      margin-top: 0.85rem;
      color: #0B0F1F;
      background: linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%);
      text-decoration: none;
      font-weight: 700;
      font-size: 0.9rem;
      border-radius: 10px;
      padding: 0.7rem 1rem;
    }
    .foot {
      margin: 0.95rem 0 0;
      text-align: center;
      color: var(--faint);
      font-size: 0.75rem;
    }
    .foot a { color: var(--muted); }
  </style>
</head>
<body>
  <main>
    <section class="card">
      <div class="brand">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 17l6-6 4 4 8-8" stroke="#D4AF37" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 7h7v7" stroke="#D4AF37" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>SharpFlow</span>
      </div>
      <p class="kicker">NHL Savant</p>
      <h1 id="title">Sign in</h1>
      <p class="lead" id="lead"></p>
      <ul>
        <li>Reads your SharpFlow card</li>
        <li>Uses the Google account on your plan or free trial</li>
        <li>Turn it off anytime from your account page</li>
      </ul>
      <button id="go" type="button">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        <span id="label">Sign in with Google</span>
      </button>
      <p class="err" id="err"></p>
      <div id="extra"></div>
      <p class="foot">You return to the app after sign-in. <a href="https://nhlsavant.com">nhlsavant.com</a></p>
    </section>
  </main>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js"></script>
  <script id="sf-oauth" type="application/json">${payload}</script>
  <script>
    const boot = JSON.parse(document.getElementById('sf-oauth').textContent);
    const lead = document.getElementById('lead');
    const err = document.getElementById('err');
    const label = document.getElementById('label');
    const title = document.getElementById('title');
    const name = boot.clientName || 'This app';
    title.textContent = 'Connect ' + name;
    lead.textContent = 'Sign in with the Google account on your NHL Savant plan or free trial. ' + name + ' can then read your SharpFlow card.';
    firebase.initializeApp(boot.config);
    const auth = firebase.auth();
    sessionStorage.removeItem('sf_oauth');
    const params = boot.params;
    async function finish(user) {
      label.textContent = 'Sending you back…';
      const idToken = await user.getIdToken();
      const res = await fetch(boot.issuer + '/oauth/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ idToken: idToken }, params)),
      });
      const data = await res.json();
      sessionStorage.removeItem('sf_oauth');
      if (data.redirect) {
        window.location = data.redirect;
        return;
      }
      document.getElementById('go').style.display = 'none';
      err.textContent = data.message || 'This account needs an active plan or a free trial.';
      if (data.planUrl) {
        const link = document.createElement('a');
        link.className = 'plans';
        link.href = data.planUrl;
        link.textContent = 'View plans';
        document.getElementById('extra').appendChild(link);
      }
    }
    document.getElementById('go').onclick = async () => {
      const button = document.getElementById('go');
      button.disabled = true;
      err.textContent = '';
      label.textContent = 'Opening Google…';
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        const result = await auth.signInWithPopup(provider);
        if (result && result.user) await finish(result.user);
      } catch (e) {
        label.textContent = 'Sign in with Google';
        err.textContent = e && e.code === 'auth/popup-blocked'
          ? 'Allow the sign-in window, then click the button again.'
          : ((e && e.message) || 'Sign-in failed.');
      } finally {
        button.disabled = false;
        if (label.textContent === 'Opening Google…') label.textContent = 'Sign in with Google';
      }
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
      res.status(400).type('html').send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>SharpFlow</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;800&display=swap" rel="stylesheet">
<style>
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:#0B0F1F; color:#F8FAFC; font-family:Inter,system-ui,sans-serif; }
  main { max-width:24rem; padding:2rem 1.25rem; text-align:center; }
  strong { color:#D4AF37; font-size:1.15rem; letter-spacing:-0.03em; }
  p { color:#94A3B8; line-height:1.5; }
</style></head>
<body><main><strong>SharpFlow</strong><p>This connection could not be started. Go back to the app and try again.</p></main></body></html>`);
      return;
    }
    if (q.response_type !== 'code' || q.code_challenge_method !== 'S256' || !q.code_challenge) {
      res.status(400).json({ error: 'invalid_request' });
      return;
    }
    res.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
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
