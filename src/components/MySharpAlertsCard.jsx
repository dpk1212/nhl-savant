import { useCallback, useEffect, useState } from 'react';
import { Bell, Users } from 'lucide-react';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  ALERT_OPTIONS,
  MY_SHARP_ALERT_CAP,
  MY_SHARP_ALERT_COLLECTION,
  MY_SHARP_ALERT_ROSTER_ID,
  alertSpotsLeft,
  emptyAlertPrefs,
  readAlertMember,
} from '../lib/mySharpAlerts';

const cardShell = {
  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: '16px',
  padding: '2rem',
  marginBottom: '2rem',
};

const rosterRef = () => doc(db, MY_SHARP_ALERT_COLLECTION, MY_SHARP_ALERT_ROSTER_ID);

function memberPayload(prefs, joinedAt) {
  return {
    together: prefs.together === true,
    pressing: prefs.pressing === true,
    exiting: prefs.exiting === true,
    joinedAt,
  };
}

/**
 * Claim or update this user's seat. The rules only allow the signed-in
 * user to add themselves, and only while the seat count is under the cap.
 */
async function writeSeat(uid, prefs, joinedAt) {
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(rosterRef());
    if (!snap.exists()) throw new Error('The beta roster is not open yet.');
    const data = snap.data() || {};
    const members = { ...(data.members || {}) };
    const mine = readAlertMember(members[uid]);
    const cap = Number(data.cap) || MY_SHARP_ALERT_CAP;
    if (!mine && Object.keys(members).length >= cap) {
      throw new Error('The beta is full.');
    }
    members[uid] = memberPayload(prefs, mine?.joinedAt || joinedAt);
    tx.update(rosterRef(), { members });
  });
}

export default function MySharpAlertsCard({ user, isPremium }) {
  const [roster, setRoster] = useState(null);
  const [prefs, setPrefs] = useState(emptyAlertPrefs);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const load = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const snap = await getDoc(rosterRef());
      const data = snap.exists() ? snap.data() : null;
      setRoster(data);
      const mine = readAlertMember(data?.members?.[user.uid]);
      setJoined(!!mine);
      if (mine) setPrefs(mine);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Could not load the beta roster. Refresh and try again.' });
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    load();
  }, [load]);

  const spots = alertSpotsLeft(roster);
  const full = !joined && spots.left <= 0;

  const save = async (next) => {
    if (!user?.uid || !isPremium) return;
    setBusy(true);
    setMessage(null);
    try {
      await writeSeat(user.uid, next, Date.now());
      setPrefs(next);
      setJoined(true);
      await load();
      setMessage({
        type: 'success',
        text: 'My Sharp alerts are updated. They land on the devices where Lock Alerts are on.',
      });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err?.message || 'Could not save. Try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={cardShell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
          }}
        >
          <Users size={20} color="#10B981" strokeWidth={2.5} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>
          My Sharp alerts
        </h3>
      </div>

      <p style={{ fontSize: '0.938rem', color: 'rgba(241, 245, 249, 0.8)', lineHeight: 1.6, marginTop: 0 }}>
        A push when your sharps are together, when one of them is pressing, or when one gets out.
        Beta is {MY_SHARP_ALERT_CAP} seats. Lock Alerts below have to be on or the phone has nothing to receive.
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.875rem 1rem',
          borderRadius: 10,
          marginBottom: '1rem',
          background: 'rgba(15, 23, 42, 0.45)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
        }}
      >
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F1F5F9', lineHeight: 1, minWidth: 48 }}>
          {loading ? '—' : spots.left}
        </div>
        <div>
          <div style={{ fontSize: '0.938rem', fontWeight: 700, color: '#F1F5F9' }}>
            {loading ? 'Checking seats' : `${spots.left} remaining`}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(241, 245, 249, 0.55)', marginTop: 2 }}>
            {MY_SHARP_ALERT_CAP} beta seats
            {joined ? ' · you’re in' : full ? ' · full' : ''}
          </div>
        </div>
      </div>

      {!isPremium && (
        <p style={{ fontSize: '0.875rem', color: 'rgba(241, 245, 249, 0.7)', marginTop: 0 }}>
          Paid accounts can take a seat. Upgrade, then come back and turn these on.
        </p>
      )}

      {isPremium && !joined && !loading && (
        <button
          type="button"
          disabled={busy || full}
          onClick={() => save(emptyAlertPrefs())}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.1rem',
            borderRadius: 10,
            border: 'none',
            cursor: busy || full ? 'default' : 'pointer',
            fontWeight: 700,
            color: '#fff',
            background: full ? 'rgba(148, 163, 184, 0.2)' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          }}
        >
          <Bell size={16} />
          {full ? 'Beta is full' : busy ? 'Saving…' : 'Turn on My Sharp alerts'}
        </button>
      )}

      {isPremium && joined && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {ALERT_OPTIONS.map((opt) => {
            const on = prefs[opt.id] === true;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={on}
                disabled={busy}
                onClick={() => save({ ...prefs, [opt.id]: !on })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  textAlign: 'left',
                  padding: '0.75rem 0.875rem',
                  borderRadius: 10,
                  cursor: busy ? 'wait' : 'pointer',
                  background: on ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.45)',
                  border: `1px solid ${on ? 'rgba(16, 185, 129, 0.4)' : 'rgba(148, 163, 184, 0.2)'}`,
                  color: '#F1F5F9',
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    flexShrink: 0,
                    background: on ? '#10B981' : 'transparent',
                    border: `2px solid ${on ? '#10B981' : 'rgba(148, 163, 184, 0.6)'}`,
                  }}
                />
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700 }}>{opt.title}</span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(241, 245, 249, 0.55)', marginTop: 2 }}>
                    {opt.blurb}
                  </span>
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: on ? '#10B981' : '#94A3B8' }}>
                  {on ? 'On' : 'Off'}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {message && (
        <p
          style={{
            marginTop: '0.875rem',
            marginBottom: 0,
            fontSize: '0.813rem',
            color: message.type === 'error' ? '#FCA5A5' : '#6EE7B7',
          }}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
