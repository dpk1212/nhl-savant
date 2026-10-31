import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, BarChart3, Lock, Zap } from 'lucide-react';
import AuthModal from '../AuthModal';
import { clearLockChrome, setLockChrome } from '../../lib/lockTopChrome.js';

const NUM = { fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum" 1' };

const VIEWS = [
  { id: 'signals', label: 'Signals', icon: BarChart3 },
  { id: 'flow', label: 'Action', icon: Activity },
  { id: 'whaleSignals', label: 'Intel', icon: Zap },
  { id: 'sharpVault', label: 'Vault', icon: Lock },
];

function moneyTone(text) {
  const raw = String(text || '');
  const down = /^[−-]/.test(raw);
  return down ? 'is-down' : 'is-up';
}

function Sparkline({ points }) {
  if (!Array.isArray(points) || points.length < 2) return null;
  const w = 96;
  const h = 30;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const coords = points.map((v, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - 1 - ((v - min) / span) * (h - 4);
    return [x, y];
  });
  const line = coords.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const fill = `${line} L${w} ${h} L0 ${h} Z`;
  return (
    <svg className="sf-lock-spark" width="96" height="30" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <defs>
        <linearGradient id="sfLockSparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4fc27a" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#4fc27a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#sfLockSparkFill)" />
      <path d={line} fill="none" stroke="#4fc27a" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function HeroStats({ text }) {
  const bits = String(text || '').split(' · ').filter(Boolean);
  return (
    <div className="sf-lock-stats" data-testid="lock-hero-stats" style={NUM}>
      {bits.map((bit, i) => {
        const last = i === bits.length - 1;
        const money = /u/.test(bit) && !/risk/i.test(bit);
        return (
          <span key={`${bit}-${i}`} className="sf-lock-stat">
            {i > 0 ? <span className="sf-lock-dot">·</span> : null}
            <span className={last && money ? `sf-lock-stat-last ${moneyTone(bit)}` : undefined}>{bit}</span>
          </span>
        );
      })}
    </div>
  );
}

function ModelLine({ model, onOpen }) {
  const profit = Number.isFinite(model?.profit) ? model.profit : null;
  const pnl = profit == null ? '' : `${profit > 0 ? '+' : profit < 0 ? '−' : ''}${Math.abs(profit).toFixed(2)}u`;
  const record = model?.record && Number.isFinite(model?.winPct)
    ? `${model.record} · ${model.winPct.toFixed(1)}%`
    : '';
  const liveN = model?.liveN || 0;
  const climate = `${liveN} live · ${model?.sharps || '0'} sharps · ${model?.sharpMoney || '$0'} sharp $ today`;
  const dots = Array.isArray(model?.dots) ? model.dots.slice(0, 8) : [];
  return (
    <button type="button" className="sf-lock-model" onClick={onOpen} data-testid="lock-model">
      <div className="sf-lock-model-top">
        <span className="sf-lock-model-brand">
          <span className={profit == null ? 'sf-lock-pulse is-quiet' : 'sf-lock-pulse'} aria-hidden="true" />
          AGS-U V12
        </span>
        {record ? <span className="sf-lock-model-rec" style={NUM}>{record}</span> : null}
      </div>
      <div className="sf-lock-model-mid">
        {pnl ? <span className={`sf-lock-pnl ${moneyTone(pnl)}`} style={NUM}>{pnl}</span> : <span />}
        <Sparkline points={model?.series} />
      </div>
      <div className="sf-lock-climate">
        {dots.length > 0 && (
          <span className="sf-lock-dots" aria-hidden="true">
            {dots.map((d) => (
              <span key={d.sport} style={{ background: d.hue }} />
            ))}
          </span>
        )}
        <span className="sf-lock-climate-text">
          <span className={liveN > 0 ? 'is-live' : undefined}>{liveN} live</span>
          {` · ${model?.sharps || '0'} sharps · ${model?.sharpMoney || '$0'} sharp $ today`}
        </span>
      </div>
      <span className="sf-sr">{climate}</span>
    </button>
  );
}

export function SectionTabs({ tabs, value, onChange, page = false }) {
  const row = useRef(null);
  const [ink, setInk] = useState({ x: 0, w: 0 });
  useLayoutEffect(() => {
    const root = row.current;
    const btn = root?.querySelector('[aria-selected="true"] .sf-lock-tab-label');
    if (!root || !btn) return undefined;
    const rr = root.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setInk({ x: br.left - rr.left + root.scrollLeft, w: br.width });
    return undefined;
  }, [value, tabs]);
  return (
    <div className={page ? 'sf-lock-sections is-page' : 'sf-lock-sections'} ref={row} role="tablist" aria-label="Intel" data-testid="lock-section-tabs">
      {tabs.map((tab) => {
        const on = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={on}
            className={on ? 'sf-lock-section is-on' : 'sf-lock-section'}
            onClick={() => onChange(tab.id)}
          >
            <span className="sf-lock-tab-label">
              {tab.label}
              {tab.count > 0 ? <span className="sf-lock-tab-n" style={NUM} key={tab.count}>{tab.count}</span> : null}
            </span>
          </button>
        );
      })}
      <span className="sf-lock-ink" style={{ width: ink.w, transform: `translateX(${ink.x}px)` }} />
    </div>
  );
}

export function BottomTabs({ value, onChange }) {
  return (
    <nav className="sf-lock-tabbar" aria-label="Sharp Flow" data-testid="lock-bottom-tabs">
      {VIEWS.map((tab) => {
        const on = tab.id === value;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            className={on ? 'sf-lock-btab is-on' : 'sf-lock-btab'}
            aria-current={on ? 'page' : undefined}
            onClick={() => onChange(tab.id)}
          >
            <Icon size={18} strokeWidth={1.75} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function holdShellChrome(enabled) {
  if (!enabled) return undefined;
  document.documentElement.style.setProperty('--sf-lock-p', '0');
  setLockChrome({ mode: 'shell', pnl: '', rec: '' });
  return () => clearLockChrome();
}

/** Header + bottom tabs for every phone Sharp Flow page except Locked, which owns its own chrome. */
export function SharpFlowMobileNav({ viewMode, onViewMode, enabled }) {
  // Layout wins the first paint. The effect wins after Locked unmounts and clears chrome.
  useLayoutEffect(() => holdShellChrome(enabled), [enabled]);
  useEffect(() => holdShellChrome(enabled), [enabled]);
  if (!enabled) return null;
  return <BottomTabs value={viewMode} onChange={onViewMode} />;
}

export default function LockedMobileTop({
  guest = false,
  user = null,
  dateLabel = '',
  statsText = '',
  dayMini = '',
  model = null,
  sections = [],
  section = 'locked',
  onSection,
  viewMode = 'whaleSignals',
  onViewMode,
  onOpenModel,
  filters = null,
  children,
}) {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const collapseRef = useRef(null);
  const chipRef = useRef(null);
  const profit = Number.isFinite(model?.profit) ? model.profit : null;
  const pnl = profit == null ? '' : `${profit > 0 ? '+' : profit < 0 ? '−' : ''}${Math.abs(profit).toFixed(2)}u`;

  useLayoutEffect(() => {
    const y = window.scrollY || 0;
    setLockChrome({
      pnl,
      rec: dayMini,
      mode: guest ? 'guest' : (y > 64 ? 'collapsed' : 'rest'),
    });
  }, [guest, pnl, dayMini]);

  useEffect(() => {
    if (guest) {
      document.documentElement.style.setProperty('--sf-lock-p', '0');
      setLockChrome({ mode: 'guest' });
      return () => clearLockChrome();
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const apply = () => {
      const y = window.scrollY || 0;
      const p = reduce ? (y > 64 ? 1 : 0) : Math.max(0, Math.min(1, y / 64));
      document.documentElement.style.setProperty('--sf-lock-p', p.toFixed(3));
      setLockChrome({ mode: p >= 1 ? 'collapsed' : 'rest' });
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      clearLockChrome();
    };
  }, [guest]);

  useLayoutEffect(() => {
    const el = collapseRef.current;
    if (!el) return undefined;
    const measure = () => {
      const prev = el.style.maxHeight;
      el.style.maxHeight = 'none';
      const h = el.scrollHeight;
      el.style.maxHeight = prev;
      el.style.setProperty('--sf-lock-open', `${h}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [guest, statsText, dateLabel, model, sections, section]);

  useLayoutEffect(() => {
    const el = chipRef.current;
    if (!el) return undefined;
    const measure = () => {
      const prev = el.style.maxHeight;
      el.style.maxHeight = 'none';
      const h = el.scrollHeight;
      el.style.maxHeight = prev;
      if (h > 0) el.style.setProperty('--sf-lock-chips', `${h}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [guest, filters]);

  const unlock = () => {
    if (!user) setAuthOpen(true);
    else navigate('/pricing');
  };

  return (
    <div className={guest ? 'sf-locktop is-guest' : 'sf-locktop'} data-testid="locked-mobile-top">
      <div className="sf-lock-atmos" aria-hidden="true">
        <div className="sf-lock-glow" />
        <div className="sf-lock-noise" />
      </div>
      <div className="sf-lock-sticky">
        <div className="sf-lock-collapse" ref={collapseRef}>
          {guest ? (
            <header className="sf-lock-guest-hero">
              <h1>We follow winning bettors&rsquo; money.</h1>
              <p>Every result posted, losses included.</p>
            </header>
          ) : (
            <header className="sf-lock-hero">
              <div className="sf-lock-date">{dateLabel}</div>
              <h1 className="sf-lock-title" data-testid="lock-hero-title">Locked Picks</h1>
              <HeroStats text={statsText} />
            </header>
          )}
          {guest && (
            <div className="sf-lock-guest-stats">
              <div>
                <strong style={NUM}>{model?.sharps || '0'}</strong>
                <span>sharp bettors{model?.filtered ? ` · ${model.filtered} filtered` : ''}</span>
              </div>
              <div>
                <strong style={NUM}>{model?.sharpMoney || '$0'}</strong>
                <span>sharp money today</span>
              </div>
            </div>
          )}
          <ModelLine model={model} onOpen={onOpenModel} />
          {!guest && (
            <SectionTabs tabs={sections} value={section} onChange={onSection} />
          )}
        </div>
        {!guest && <div id="sf-lock-seg-slot" />}
      </div>
      {!guest && <div id="sf-lock-chip-slot" ref={chipRef} />}
      {filters}
      {guest && (
        <button type="button" className="sf-lock-cta" onClick={unlock}>
          Unlock today&rsquo;s locked picks
        </button>
      )}
      <div className={guest ? 'sf-lock-body is-guest' : 'sf-lock-body'}>{children}</div>
      {!guest && <BottomTabs value={viewMode} onChange={onViewMode} />}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

