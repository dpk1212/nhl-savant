/**
 * Server-side OneSignal tag sync for subscription entitlement.
 *
 * Keeps tag paid honest when users cancel and never reopen the app.
 * Uses REST API: PATCH /apps/{app_id}/users/by/external_id/{uid}
 *
 * Only writes the single tag `paid` — org plan hits entitlements-tag-limit
 * if we send tier/email/lock_alerts extras.
 *
 * Values:
 *   all | edge11 | false  (legacy true treated as all)
 * When marking paid, preserve edge11/all; migrate true → all; default all.
 * When marking free, always false.
 *
 * Env: ONESIGNAL_APP_ID, ONESIGNAL_REST_API_KEY
 */

const APP_ID = process.env.ONESIGNAL_APP_ID || 'd8fcb504-8d29-4354-a9e4-8b612d3eafeb';
const REST_KEY = process.env.ONESIGNAL_REST_API_KEY || '';

function paidTagForEntitlement(current) {
  if (current === 'edge11') return 'edge11';
  if (current === 'all' || current === 'true') return 'all';
  return 'all';
}

async function fetchPaidTag(externalId) {
  const url = `https://api.onesignal.com/apps/${APP_ID}/users/by/external_id/${encodeURIComponent(externalId)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Key ${REST_KEY}` },
  });
  if (res.status === 404) return { exists: false, paid: null };
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GET ${res.status}: ${text}`);
  }
  const json = await res.json().catch(() => ({}));
  const paid = json?.properties?.tags?.paid ?? json?.tags?.paid ?? null;
  return { exists: true, paid };
}

/**
 * @param {string} externalId Firebase uid
 * @param {{ paid: boolean, tier?: string, status?: string }} opts
 */
async function syncOnesignalPaidTags(externalId, opts) {
  if (!externalId) return { ok: false, reason: 'no_uid' };
  if (!REST_KEY) {
    console.warn('[OneSignal] ONESIGNAL_REST_API_KEY not set — skip tag sync');
    return { ok: false, reason: 'no_key' };
  }

  let paidValue = 'false';
  if (opts.paid) {
    try {
      const current = await fetchPaidTag(externalId);
      paidValue = paidTagForEntitlement(current.paid);
    } catch (err) {
      console.warn('[OneSignal] could not read current tag — defaulting to all:', err.message || err);
      paidValue = 'all';
    }
  }

  const tags = { paid: paidValue };

  const url = `https://api.onesignal.com/apps/${APP_ID}/users/by/external_id/${encodeURIComponent(externalId)}`;
  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${REST_KEY}`,
      },
      body: JSON.stringify({ properties: { tags } }),
    });
    if (res.status === 404) {
      console.log(`[OneSignal] no user for external_id=${externalId} (404)`);
      return { ok: true, reason: 'no_onesignal_user' };
    }
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`[OneSignal] tag sync failed ${res.status}: ${text}`);
      return { ok: false, reason: `http_${res.status}` };
    }
    console.log(`[OneSignal] tags synced for ${externalId}: paid=${tags.paid}`);
    return { ok: true, paid: tags.paid };
  } catch (err) {
    console.error('[OneSignal] tag sync error:', err.message || err);
    return { ok: false, reason: 'network' };
  }
}

module.exports = { syncOnesignalPaidTags };
