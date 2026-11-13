import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { httpsCallable } from 'firebase/functions';
import { Plug, Copy, Check } from 'lucide-react';
import { functions } from '../firebase/config';

const CONNECTOR_URL = 'https://sharpflowmcpmember-lviwud3q2q-uc.a.run.app';
const CONNECTOR_NAME = 'NHL Savant - Sharpflow';

const cardShell = {
  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: '16px',
  padding: '2rem',
  marginBottom: '2rem',
};

const goldButton = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.875rem 1.5rem',
  background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
  border: 'none',
  borderRadius: '10px',
  color: '#0A0E27',
  fontSize: '0.938rem',
  fontWeight: 700,
  cursor: 'pointer',
  textDecoration: 'none',
};

const quietButton = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.7rem 1.1rem',
  background: 'transparent',
  border: '1px solid rgba(148, 163, 184, 0.35)',
  borderRadius: '10px',
  color: '#F1F5F9',
  fontSize: '0.938rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const APPS = [
  {
    id: 'chatgpt',
    title: 'ChatGPT',
    steps: [
      'Open Settings, then Apps, and turn on Developer mode if it asks.',
      'Go to Plugins, click +, then Add custom MCP server.',
      'Enter the Name and URL. Set Authentication to OAuth.',
      'Check “I understand”, then click Create as a plugin.',
      'Sign in with Google and click Allow.',
      'In a new chat, type @, pick NHL Savant - Sharpflow, and ask “What should I know tonight?”',
    ],
  },
  {
    id: 'claude',
    title: 'Claude',
    steps: [
      'Open Settings, then Connectors, then Add custom connector.',
      'Enter the Name and URL, click Add, then Connect.',
      'Sign in with Google and click Allow.',
    ],
  },
  {
    id: 'grok',
    title: 'Grok',
    steps: [
      'Go to grok.com/connectors, click New Connector, then Custom.',
      'Paste the URL, then sign in with Google and click Allow.',
    ],
  },
];

function Steps({ items }) {
  return (
    <ol style={{
      margin: '0.75rem 0 0',
      paddingLeft: '1.2rem',
      color: 'rgba(241, 245, 249, 0.85)',
      fontSize: '0.938rem',
      lineHeight: 1.55,
    }}
    >
      {items.map((step) => <li key={step} style={{ marginBottom: '0.4rem' }}>{step}</li>)}
    </ol>
  );
}

export default function SharpFlowConnectCard({ isPremium }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [connection, setConnection] = useState(null);
  const [copied, setCopied] = useState(false);
  const [apps, setApps] = useState([]);
  const [urlCopied, setUrlCopied] = useState(false);

  const loadApps = async () => {
    if (!isPremium) return;
    try {
      const list = httpsCallable(functions, 'listSharpflowConnectorApps');
      const result = await list();
      setApps(result.data?.apps || []);
    } catch {
      setApps([]);
    }
  };

  useEffect(() => {
    if (isPremium && open) loadApps();
  }, [isPremium, open]);

  const createKey = async () => {
    setBusy(true);
    setError('');
    setCopied(false);
    try {
      const create = httpsCallable(functions, 'createSharpflowConnectorKey');
      const result = await create();
      setConnection(result.data);
    } catch (err) {
      const code = err?.code || '';
      if (code.includes('permission-denied')) setError('An active plan or a free trial is required.');
      else if (code.includes('unauthenticated')) setError('Sign in first.');
      else setError('Could not create a key. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const disconnect = async (family) => {
    setError('');
    try {
      const revoke = httpsCallable(functions, 'revokeSharpflowConnectorApp');
      await revoke({ family });
      setApps((prev) => prev.filter((app) => app.family !== family));
    } catch {
      setError('Could not disconnect that app. Try again.');
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(CONNECTOR_URL);
      setUrlCopied(true);
    } catch {
      setUrlCopied(false);
    }
  };

  const copyKey = async () => {
    if (!connection?.key) return;
    try {
      await navigator.clipboard.writeText(connection.key);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div style={cardShell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <Plug size={18} color="#D4AF37" />
        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#F1F5F9' }}>
          SharpFlow in your AI
        </h3>
      </div>
      <p style={{ fontSize: '0.938rem', color: 'rgba(241, 245, 249, 0.8)', lineHeight: 1.6, marginTop: 0 }}>
        Add tonight&apos;s card to ChatGPT, Claude or Grok. You sign in with the Google account on your NHL Savant plan, and there&apos;s no key to copy. It works while your plan or free trial is active.
      </p>

      {!open && (
        <button type="button" onClick={() => setOpen(true)} style={goldButton}>
          Show connection
        </button>
      )}

      {open && !isPremium && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '0.938rem', color: 'rgba(241, 245, 249, 0.8)', lineHeight: 1.6 }}>
            A free trial or a paid plan is required to open the connection.
          </p>
          <Link to="/pricing" style={goldButton}>View plans</Link>
        </div>
      )}

      {open && isPremium && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(241, 245, 249, 0.55)', marginBottom: '0.3rem' }}>Name</div>
              <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: '#F1F5F9', fontSize: '0.9rem' }}>{CONNECTOR_NAME}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(241, 245, 249, 0.55)', marginBottom: '0.3rem' }}>URL</div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <div style={{
                  flex: 1,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: '0.8125rem',
                  color: '#F1F5F9',
                  wordBreak: 'break-all',
                  padding: '0.75rem 0.875rem',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                }}
                >
                  {CONNECTOR_URL}
                </div>
                <button type="button" onClick={copyUrl} style={{ ...goldButton, padding: '0.75rem 0.9rem' }}>
                  {urlCopied ? <Check size={16} /> : <Copy size={16} />}
                  {urlCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.8125rem', color: 'rgba(241, 245, 249, 0.55)' }}>
                Copy it exactly, with nothing after .app
              </p>
            </div>
          </div>

          {APPS.map((app) => (
            <section key={app.id} style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ margin: '0 0 0.25rem', color: '#F1F5F9', fontSize: '1rem' }}>{app.title}</h4>
              <Steps items={app.steps} />
            </section>
          ))}

          <section style={{ marginBottom: '1.25rem' }}>
            <p style={{ margin: '0 0 0.75rem', color: 'rgba(241, 245, 249, 0.75)', fontSize: '0.938rem', lineHeight: 1.55 }}>
              Using Perplexity, Cursor, or another app that asks for a key?
            </p>
            {!connection && (
              <button type="button" onClick={createKey} disabled={busy} style={{ ...quietButton, opacity: busy ? 0.7 : 1 }}>
                {busy ? 'Checking your plan…' : 'Create a key'}
              </button>
            )}
            {connection && (
              <div>
                <p style={{ margin: '0 0 0.75rem', color: 'rgba(241, 245, 249, 0.75)', fontSize: '0.938rem', lineHeight: 1.55 }}>
                  Paste this key in the field labeled API key, Bearer token, or Access token. It&apos;s shown once. Making a new key turns this one off.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <div style={{
                    flex: 1,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: '0.8125rem',
                    color: '#F1F5F9',
                    wordBreak: 'break-all',
                    padding: '0.75rem 0.875rem',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(212, 175, 55, 0.45)',
                  }}
                  >
                    {connection.key}
                  </div>
                  <button type="button" onClick={copyKey} style={{ ...goldButton, padding: '0.75rem 0.9rem' }}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </section>

          {apps.length > 0 && (
            <section>
              <h4 style={{ margin: '0 0 0.5rem', color: '#F1F5F9', fontSize: '1rem' }}>Connected apps</h4>
              {apps.map((app) => (
                <div key={app.family} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'rgba(241, 245, 249, 0.85)' }}>{app.name}</span>
                  <button type="button" onClick={() => disconnect(app.family)} style={{ background: 'transparent', border: 'none', color: '#FCA5A5', cursor: 'pointer' }}>
                    Disconnect
                  </button>
                </div>
              ))}
            </section>
          )}

          <p style={{ fontSize: '0.8125rem', color: 'rgba(241, 245, 249, 0.55)', lineHeight: 1.5 }}>
            Some apps ask permission again in each new chat. Click Allow. If your plan ends, the connection stops.
          </p>
        </div>
      )}

      {error && <p style={{ color: '#FCA5A5', fontSize: '0.875rem' }}>{error}</p>}
    </div>
  );
}
