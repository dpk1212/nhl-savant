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

const APPS = [
  {
    id: 'chatgpt',
    title: 'ChatGPT',
    steps: [
      'Open ChatGPT on the web. Go to Settings, then Apps, and turn on Developer mode if it asks.',
      'Open Plugins, click +, then Add custom MCP server.',
      `Name: ${CONNECTOR_NAME}. Server URL: ${CONNECTOR_URL}. Authentication: OAuth.`,
      'Scan the tools. An NHL Savant sign-in window opens. Sign in with Google and click through.',
      'Create the plugin and install it if asked.',
      'In a new chat, type @, pick NHL Savant - Sharpflow, and ask: “What should I know tonight?”',
    ],
  },
  {
    id: 'claude',
    title: 'Claude',
    steps: [
      'Open Settings, then Connectors, then Add custom connector.',
      `Enter the name ${CONNECTOR_NAME} and the URL ${CONNECTOR_URL}, then click Add.`,
      'Click Connect. Sign in to NHL Savant and allow the card.',
      'In a chat, turn the connector on from the tools menu and ask: “What should I know tonight?”',
    ],
  },
  {
    id: 'grok',
    title: 'Grok',
    steps: [
      'Go to grok.com/connectors.',
      'Click New Connector, then Custom.',
      `Enter ${CONNECTOR_URL} and continue. Grok opens NHL Savant sign-in.`,
      'Sign in with Google and allow the card.',
      'In a new chat, ask: “What should I know tonight?”',
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
        Connect ChatGPT, Claude, or Grok. You sign in with NHL Savant. The card answers while your plan or free trial is active.
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
          {APPS.map((app) => (
            <section key={app.id} style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ margin: '0 0 0.25rem', color: '#F1F5F9', fontSize: '1rem' }}>{app.title}</h4>
              <Steps items={app.steps} />
            </section>
          ))}

          <section style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.25rem', color: '#F1F5F9', fontSize: '1rem' }}>Apps that ask for a key</h4>
            <p style={{ margin: '0.25rem 0 0.75rem', color: 'rgba(241, 245, 249, 0.75)', fontSize: '0.938rem', lineHeight: 1.55 }}>
              Perplexity, Cursor, and other apps take a key instead of a sign-in window. The name and URL are the same. Paste the key in the field labeled API key, Bearer token, or Access token.
            </p>
            {!connection && (
              <button type="button" onClick={createKey} disabled={busy} style={{ ...goldButton, opacity: busy ? 0.7 : 1 }}>
                {busy ? 'Checking your plan…' : 'Create key'}
              </button>
            )}
            {connection && (
              <div>
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
                <p style={{ fontSize: '0.8125rem', color: 'rgba(241, 245, 249, 0.6)', lineHeight: 1.5 }}>
                  Shown once. Creating another key turns this one off. It works while your plan or free trial is active.
                </p>
                <p style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.8125rem', color: '#F1F5F9' }}>
                  {CONNECTOR_URL}
                </p>
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
            Some apps ask permission again in each new chat. Allow it. Disconnecting an app, or creating a new key, turns that access off.
          </p>
        </div>
      )}

      {error && <p style={{ color: '#FCA5A5', fontSize: '0.875rem' }}>{error}</p>}
    </div>
  );
}
