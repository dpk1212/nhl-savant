/**
 * Account-page connector gate.
 * A key is valid only while users/{uid} is active or trialing
 * on scout, elite, or pro. Stripe writes that document. This check
 * reads it. It does not call Stripe.
 */

const crypto = require('crypto');

const PAID_TIERS = new Set(['scout', 'elite', 'pro']);
const LIVE_STATUS = new Set(['active', 'trialing', 'past_due']);

function timeMillis(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value < 1e12 ? value * 1000 : value;
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.seconds === 'number') return value.seconds * 1000;
  if (typeof value._seconds === 'number') return value._seconds * 1000;
  return null;
}

function membershipFromUser(data, now = Date.now()) {
  if (!data || typeof data !== 'object') return null;
  const status = String(data.status || '');
  const tier = String(data.tier || '');
  if (!LIVE_STATUS.has(status) || !PAID_TIERS.has(tier)) return null;
  if (status === 'trialing') {
    const ends = timeMillis(data.trialEndsAt);
    if (!(ends > now)) return null;
    return { status, tier, trial: true };
  }
  return { status, tier, trial: false };
}

function hashKey(key) {
  return crypto.createHash('sha256').update(String(key)).digest('hex');
}

function newKey() {
  return `sf_${crypto.randomBytes(32).toString('base64url')}`;
}

function bearerKey(headers) {
  const h = headers || {};
  const auth = String(h.authorization || h.Authorization || '').trim();
  const match = auth.match(/^Bearer\s+(\S+)\s*$/i);
  if (match) return match[1];
  if (auth && !auth.includes(' ')) return auth;
  const api = h['x-api-key'] || h['X-Api-Key'];
  if (api) return String(api).trim();
  return '';
}

function requiresCredential(body) {
  if (!body || typeof body !== 'object') return true;
  const msgs = Array.isArray(body) ? body : [body];
  if (!msgs.length) return true;
  return msgs.some((msg) => !msg || !String(msg.method || '').startsWith('notifications/'));
}

function asksForCard(body) {
  const msgs = Array.isArray(body) ? body : [body];
  return msgs.some((msg) => msg && msg.method === 'tools/call');
}

module.exports = {
  PAID_TIERS,
  LIVE_STATUS,
  membershipFromUser,
  hashKey,
  newKey,
  bearerKey,
  asksForCard,
  requiresCredential,
  timeMillis,
};
