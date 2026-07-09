import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Bell, BellOff, Smartphone, Monitor, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import {
  onesignalGetPushStatus,
  onesignalEnableForPaidUser,
  onesignalOptOutPush,
} from '../lib/onesignal';

const cardShell = {
  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: '16px',
  padding: '2rem',
  marginBottom: '2rem',
};

function isIosDevice() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari
    window.navigator.standalone === true
  );
}

/**
 * Lock Alerts — Account settings card for paid users.
 * Opt-in / opt-out + desktop / Android / iOS directions.
 */
export default function LockAlertsCard({ user, tier, status, isPremium }) {
  const [pushStatus, setPushStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [showIos, setShowIos] = useState(false);
  const [showAndroid, setShowAndroid] = useState(false);

  const ios = isIosDevice();
  const standalone = isStandalone();

  const refreshStatus = useCallback(async () => {
    const s = await onesignalGetPushStatus();
    setPushStatus(s);
    return s;
  }, []);

  useEffect(() => {
    refreshStatus();
    const t = setInterval(refreshStatus, 8000);
    return () => clearInterval(t);
  }, [refreshStatus]);

  useEffect(() => {
    if (ios && !standalone) setShowIos(true);
  }, [ios, standalone]);

  const handleEnable = async () => {
    if (!user?.uid || !isPremium) return;
    setBusy(true);
    setMessage(null);
    try {
      if (ios && !standalone) {
        setMessage({
          type: 'info',
          text: 'On iPhone/iPad: Add NHL Savant to your Home Screen first, then open it from the icon and tap Enable again.',
        });
        setShowIos(true);
        setBusy(false);
        return;
      }
      const outcome = await onesignalEnableForPaidUser({
        uid: user.uid,
        email: user.email,
        tier,
        status,
      });
      await refreshStatus();
      if (outcome.ok) {
        setMessage({ type: 'success', text: 'Lock alerts are on for this device. We’ll ping you ~15 min before gametime.' });
      } else if (outcome.reason === 'denied') {
        setMessage({
          type: 'error',
          text: 'Notifications are blocked for this site. Open browser/site settings → allow Notifications, then try again.',
        });
      } else {
        setMessage({ type: 'info', text: 'Permission not granted yet. Allow notifications when the browser asks, then tap Enable again.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Could not enable alerts. Refresh and try again.' });
    } finally {
      setBusy(false);
    }
  };

  const handleDisable = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await onesignalOptOutPush();
      await refreshStatus();
      setMessage({ type: 'info', text: 'Lock alerts turned off on this browser.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Could not turn off alerts. Try again.' });
    } finally {
      setBusy(false);
    }
  };

  const optedIn = !!pushStatus?.optedIn;
  const denied = pushStatus?.permission === false;

  if (!isPremium) {
    return (
      <div style={cardShell}>
        <Header />
        <p style={{ fontSize: '0.938rem', color: 'rgba(241, 245, 249, 0.8)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Lock alerts ping you when a play locks (~15 minutes before gametime). Available on Scout, Elite, and Pro.
        </p>
        <Link
          to="/pricing"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem 1.5rem',
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
            borderRadius: '10px',
            color: '#0A0E27',
            fontSize: '0.938rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          View Premium Plans
        </Link>
      </div>
    );
  }

  return (
    <div style={cardShell}>
      <Header />

      <p style={{ fontSize: '0.938rem', color: 'rgba(241, 245, 249, 0.8)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
        Get a push when a Sharp Flow play <strong style={{ color: '#10B981' }}>locks</strong> — about 15 minutes before gametime.
        Opt in once per device (Home Screen on iPhone). Alerts keep working after you sign out while your plan is active; they stop if the subscription ends.
      </p>

      {/* Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          padding: '0.875rem 1rem',
          borderRadius: '10px',
          marginBottom: '1.25rem',
          background: optedIn ? 'rgba(16, 185, 129, 0.12)' : 'rgba(148, 163, 184, 0.08)',
          border: `1px solid ${optedIn ? 'rgba(16, 185, 129, 0.35)' : 'rgba(148, 163, 184, 0.2)'}`,
        }}
      >
        {optedIn ? <Bell size={18} color="#10B981" /> : <BellOff size={18} color="#94A3B8" />}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: '0.938rem', fontWeight: 600, color: optedIn ? '#10B981' : '#F1F5F9' }}>
            {optedIn ? 'Lock alerts on' : denied ? 'Notifications blocked' : 'Lock alerts off'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(241, 245, 249, 0.55)', marginTop: 2 }}>
            {ios && !standalone
              ? 'iOS: open from Home Screen to enable'
              : pushStatus?.subscriptionId
                ? `Device linked · ${String(pushStatus.subscriptionId).slice(0, 8)}…`
                : 'This browser only — enable on phone separately'}
          </div>
        </div>
        {optedIn ? (
          <button
            type="button"
            onClick={handleDisable}
            disabled={busy}
            style={btnSecondary}
          >
            Turn off
          </button>
        ) : (
          <button
            type="button"
            onClick={handleEnable}
            disabled={busy}
            style={btnPrimary}
          >
            {busy ? 'Working…' : 'Enable Lock Alerts'}
          </button>
        )}
      </div>

      {message && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            background:
              message.type === 'success'
                ? 'rgba(16, 185, 129, 0.15)'
                : message.type === 'error'
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(59, 130, 246, 0.15)',
            border: `1px solid ${
              message.type === 'success'
                ? 'rgba(16, 185, 129, 0.3)'
                : message.type === 'error'
                  ? 'rgba(239, 68, 68, 0.3)'
                  : 'rgba(59, 130, 246, 0.3)'
            }`,
            color:
              message.type === 'success' ? '#10B981' : message.type === 'error' ? '#EF4444' : '#60A5FA',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Desktop */}
      <GuideBlock
        icon={<Monitor size={16} color="#60A5FA" />}
        title="Desktop (Chrome / Edge / Firefox)"
        open
        onToggle={null}
      >
        <ol style={olStyle}>
          <li>Stay signed in on this page.</li>
          <li>Click <strong>Enable Lock Alerts</strong> and choose Allow.</li>
          <li>Keep notifications enabled for the browser in OS settings.</li>
        </ol>
      </GuideBlock>

      {/* Android */}
      <GuideBlock
        icon={<Smartphone size={16} color="#10B981" />}
        title="Android"
        open={showAndroid}
        onToggle={() => setShowAndroid((v) => !v)}
      >
        <ol style={olStyle}>
          <li>Open <strong>nhlsavant.com</strong> in Chrome (not Incognito).</li>
          <li>Sign in with your paid account.</li>
          <li>Go to Account → <strong>Enable Lock Alerts</strong> → Allow.</li>
          <li>Optional: Chrome menu → Install app / Add to Home screen.</li>
        </ol>
      </GuideBlock>

      {/* iOS */}
      <GuideBlock
        icon={<Smartphone size={16} color="#D4AF37" />}
        title="iPhone / iPad (iOS 16.4+)"
        open={showIos}
        onToggle={() => setShowIos((v) => !v)}
        highlight={ios && !standalone}
      >
        <p style={{ fontSize: '0.813rem', color: 'rgba(241, 245, 249, 0.7)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
          Apple only allows web push from a Home Screen app — not a normal Safari tab.
        </p>
        <ol style={olStyle}>
          <li>Open <strong>nhlsavant.com</strong> in Safari (or Chrome/Edge).</li>
          <li>Tap Share → <strong>Add to Home Screen</strong> → Add.</li>
          <li>Open <strong>NHL Savant from the Home Screen icon</strong> (not the browser tab).</li>
          <li>Sign in → Account → <strong>Enable Lock Alerts</strong> → Allow.</li>
        </ol>
        {ios && !standalone && (
          <p style={{ fontSize: '0.75rem', color: '#D4AF37', marginTop: '0.75rem', marginBottom: 0 }}>
            You’re in a browser tab right now. Add to Home Screen, then reopen from the icon.
          </p>
        )}
        <a
          href="https://documentation.onesignal.com/docs/en/web-push-for-ios"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            marginTop: '0.75rem',
            fontSize: '0.75rem',
            color: '#60A5FA',
            textDecoration: 'none',
          }}
        >
          iOS web push details <ExternalLink size={12} />
        </a>
      </GuideBlock>
    </div>
  );
}

function Header() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: 'rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Bell size={20} color="#10B981" strokeWidth={2.5} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>
        Lock Alerts
      </h3>
    </div>
  );
}

function GuideBlock({ icon, title, open, onToggle, children, highlight }) {
  const clickable = typeof onToggle === 'function';
  return (
    <div
      style={{
        marginBottom: '0.75rem',
        borderRadius: 10,
        border: `1px solid ${highlight ? 'rgba(212, 175, 55, 0.4)' : 'rgba(148, 163, 184, 0.15)'}`,
        background: highlight ? 'rgba(212, 175, 55, 0.06)' : 'rgba(15, 23, 42, 0.35)',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={clickable ? onToggle : undefined}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          background: 'transparent',
          border: 'none',
          color: '#F1F5F9',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: clickable ? 'pointer' : 'default',
          textAlign: 'left',
        }}
      >
        {icon}
        <span style={{ flex: 1 }}>{title}</span>
        {clickable && (open ? <ChevronUp size={16} color="#94A3B8" /> : <ChevronDown size={16} color="#94A3B8" />)}
      </button>
      {open && <div style={{ padding: '0 1rem 1rem' }}>{children}</div>}
    </div>
  );
}

const olStyle = {
  margin: 0,
  paddingLeft: '1.25rem',
  fontSize: '0.813rem',
  color: 'rgba(241, 245, 249, 0.75)',
  lineHeight: 1.65,
};

const btnPrimary = {
  padding: '0.625rem 1rem',
  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  border: 'none',
  borderRadius: 8,
  color: '#fff',
  fontSize: '0.813rem',
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const btnSecondary = {
  padding: '0.625rem 1rem',
  background: 'rgba(148, 163, 184, 0.12)',
  border: '1px solid rgba(148, 163, 184, 0.3)',
  borderRadius: 8,
  color: '#94A3B8',
  fontSize: '0.813rem',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};
