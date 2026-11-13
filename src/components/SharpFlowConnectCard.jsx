import { useState } from 'react';
import { Link } from 'react-router-dom';
import { httpsCallable } from 'firebase/functions';
import { Plug, Copy, Check } from 'lucide-react';
import { functions } from '../firebase/config';

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

function Field({ label, value }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ fontSize: '0.75rem', color: 'rgba(241, 245, 249, 0.55)', marginBottom: 4 }}>{label}</div>
      <div style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: '0.875rem',
        color: '#F1F5F9',
        wordBreak: 'break-all',
        padding: '0.75rem 0.875rem',
        borderRadius: '8px',
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
      }}
      >
        {value}
      </div>
    </div>
  );
}

function Steps({ connection }) {
  return (
    <ol style={{
      margin: '1rem 0 0',
      paddingLeft: '1.25rem',
      color: 'rgba(241, 245, 249, 0.85)',
      fontSize: '0.938rem',
      lineHeight: 1.6,
    }}
    >
      <li>Open the connectors, plugins, or tools settings in the AI app you use.</li>
      <li>Add a custom MCP server.</li>
      <li style={{ marginTop: '0.75rem' }}>
        Fill it in.
        <div style={{ marginTop: '0.75rem' }}>
          <Field label="Name" value={connection.name} />
          <Field label="URL" value={connection.url} />
          <Field label="Authentication" value="Paste the key. The field may say API key, Bearer token, or Access token." />
        </div>
      </li>
      <li>Save it and start a new chat. Ask: “What should I know tonight?”</li>
      <li>When the app asks to use {connection.name}, allow it. Some apps ask again in each new chat.</li>
    </ol>
  );
}

export default function SharpFlowConnectCard({ isPremium }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [connection, setConnection] = useState(null);
  const [copied, setCopied] = useState(false);
  const [lockedNote, setLockedNote] = useState(false);

  const createKey = async () => {
    if (!isPremium) {
      setLockedNote(true);
      return;
    }
    setBusy(true);
    setError('');
    setCopied(false);
    try {
      const create = httpsCallable(functions, 'createSharpflowConnectorKey');
      const result = await create();
      setConnection(result.data);
    } catch (err) {
      const code = err?.code || '';
      if (code.includes('permission-denied')) {
        setError('An active plan or a free trial is required.');
      } else if (code.includes('unauthenticated')) {
        setError('Sign in first.');
      } else {
        setError('Could not create a key. Try again.');
      }
    } finally {
      setBusy(false);
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
        Add tonight’s card to ChatGPT, Claude, Perplexity, or any app that takes a custom server.
        The app asks for a name, an address, and a key. The key works while your plan is active or your free trial is running.
      </p>

      {!connection && (
        <button type="button" onClick={createKey} disabled={busy} style={{ ...goldButton, opacity: busy ? 0.7 : 1 }}>
          {busy ? 'Checking your plan…' : 'Show connection'}
        </button>
      )}

      {lockedNote && !isPremium && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '0.938rem', color: 'rgba(241, 245, 249, 0.8)', lineHeight: 1.6 }}>
            A free trial or a paid plan is required to open the connection.
          </p>
          <Link to="/pricing" style={goldButton}>View plans</Link>
        </div>
      )}

      {error && (
        <p style={{ color: '#FCA5A5', fontSize: '0.875rem', marginTop: '0.75rem' }}>{error}</p>
      )}

      {connection && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(241, 245, 249, 0.55)', marginBottom: 4 }}>Your key</div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
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
            {connection.trial
              ? 'This key works during your free trial. When the trial ends, the connector stops until a plan is active.'
              : 'This key works while your plan is active. If the plan ends, the connector stops.'}
            {' '}Creating another key turns this one off. Copy it now. It is shown once.
          </p>
          <Steps connection={connection} />
          <button
            type="button"
            onClick={createKey}
            disabled={busy}
            style={{
              marginTop: '1rem',
              background: 'transparent',
              border: 'none',
              color: 'rgba(241, 245, 249, 0.55)',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {busy ? 'Creating a new key…' : 'Create a new key'}
          </button>
        </div>
      )}
    </div>
  );
}
