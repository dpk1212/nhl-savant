/**
 * Account-page connector gate.
 * A key is valid only while users/{uid} is active or trialing
 * on scout, elite, or pro. Stripe writes that document. This check
 * reads it. It does not call Stripe.
 */

const crypto = require('crypto');

const PAID_TIERS = new Set(['scout', 'elite', 'pro']);
const LIVE_STATUS = new Set(['active', 'trialing']);

function membershipFromUser(data) {
  if (!data || typeof data !== 'object') return null;
  const status = String(data.status || '');
  const tier = String(data.tier || '');
  if (!LIVE_STATUS.has(status) || !PAID_TIERS.has(tier)) return null;
  return { status, tier, trial: status === 'trialing' };
}

function hashKey(key) {
  return crypto.createHash('sha256').update(String(key)).digest('hex');
}

function newKey() {
  return `sf_${crypto.randomBytes(32).toString('base64url')}`;
}

function bearerKey(headers) {
  const h = headers || {};
  const auth = h.authorization || h.Authorization || '';
  const match = String(auth).match(/^Bearer\s+(\S+)\s*$/i);
  if (match) return match[1];
  const api = h['x-api-key'] || h['X-Api-Key'];
  if (api) return String(api).trim();
  return '';
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
};
