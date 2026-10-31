/**
 * Locked filter bar. One sticky surface: stats, status, chips, and the sheet.
 * Gold is only the active state. Numbers stay tabular so the line does not jitter.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, SlidersHorizontal } from 'lucide-react';
import {
  defaultLockedFilter,
  describeLockedSlate,
  lockedSegmentStatus,
  normalizeLockedFilter,
} from '../../lib/lockedFilter.js';

const GOLD = '#D4AF37';
const INK = '#F4F7FB';
const SEC = '#9AA6BD';
const NUM = { fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum" 1' };

const SPORT_INK = {
  NHL: '#D4AF37',
  MLB: '#E31837',
  NBA: '#FF8C00',
  WNBA: '#F472B6',
  CBB: '#FF6B35',
  CFB: '#BF5700',
  NFL: '#4CAF50',
  SOC: '#2ECC71',
  UFC: '#C0392B',
  ATP: '#C8F542',
  CS2: '#FF6B1A',
  LOL: '#C8AA6E',
};

const SHEET_STATUS = [
  { id: 'pending', label: 'Pending' },
  { id: 'live', label: 'Live' },
  { id: 'settled', label: 'Settled' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
  { id: 'all', label: 'All' },
];

const SHEET_MARKET = [
  { id: 'all', label: 'All' },
  { id: 'ml', label: 'ML' },
  { id: 'spread', label: 'Spread' },
  { id: 'total', label: 'Total' },
];

const SHEET_ORDER = [
  { id: 'units', label: 'Units' },
  { id: 'time', label: 'Game time' },
  { id: 'winpct', label: 'Win %' },
  { id: 'profit', label: 'Profit' },
];

function useWide() {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 980px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 980px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

function useStuck(ref) {
  const [stuck, setStuck] = useState(false);
  const [navH, setNavH] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const nav = document.querySelector('nav');
      const h = nav?.offsetHeight || 0;
      setNavH(h);
      const top = el.getBoundingClientRect().top;
      setStuck(top <= h + 1);
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [ref]);
  return { stuck, navH };
}

export default function LockedFilterBar({ picksByDay, filter, view, onChange }) {
  const wide = useWide();
  const barRef = useRef(null);
  const mobileBtnRef = useRef(null);
  const wideBtnRef = useRef(null);
  const btnRef = wide ? wideBtnRef : mobileBtnRef;
  const { stuck, navH } = useStuck(barRef);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const f = normalizeLockedFilter(filter);
  const segment = lockedSegmentStatus(f.status);

  const openSheet = () => {
    setDraft(normalizeLockedFilter(f));
    setOpen(true);
  };
  const closeSheet = () => setOpen(false);
  const commit = (partial) => {
    setOpen(false);
    onChange(normalizeLockedFilter({ ...f, ...partial }));
  };

  return (
    <div
      ref={barRef}
      className="sf-locked-sticky"
      data-stuck={stuck ? '1' : '0'}
      data-wide={wide ? '1' : '0'}
      data-testid="locked-filter-bar"
      style={{ top: navH }}
    >
      <div className="sf-locked-mobile" data-testid="locked-filter-mobile">
        <div className="sf-locked-stats">
          <div className="sf-locked-stats-inner">
            <div className="sf-locked-stats-line" data-testid="locked-stats" style={NUM}>
              {view.dayLine.text}
            </div>
          </div>
        </div>
        <div className="sf-locked-main">
          <div className="sf-locked-faces">
            <div className="sf-locked-face sf-locked-face-rest">
              <StatusSegment
                value={segment}
                counts={view.statusCounts}
                onChange={(status) => commit({ status })}
              />
            </div>
            <div className="sf-locked-face sf-locked-face-mini">
              <MiniTitle dayLine={view.dayLine} />
              <button type="button" className="sf-locked-pill" onClick={openSheet} style={NUM} data-testid="locked-pill">
                {view.pill}
              </button>
            </div>
          </div>
          <SortButton
            btnRef={mobileBtnRef}
            count={view.badge}
            open={open}
            onClick={openSheet}
          />
        </div>
        <ChipRail
          filter={f}
          view={view}
          onAll={() => commit({ sport: 'all' })}
          onSport={(id) => commit({ sport: id })}
          onWeak={() => commit({ weak: !f.weak })}
        />
      </div>

      <div className="sf-locked-wide" data-testid="locked-filter-wide">
        <div className="sf-locked-ident">
          <span className="sf-locked-name">Locked</span>
          <span className="sf-locked-ident-stats" style={NUM}>{view.dayLine.mini}</span>
        </div>
        <StatusSegment
          value={segment}
          counts={view.statusCounts}
          onChange={(status) => commit({ status })}
        />
        <ChipRail
          filter={f}
          view={view}
          onAll={() => commit({ sport: 'all' })}
          onSport={(id) => commit({ sport: id })}
          onWeak={() => commit({ weak: !f.weak })}
        />
        <SortButton btnRef={wideBtnRef} count={view.badge} open={open} onClick={openSheet} />
      </div>

      {open && draft && (
        <FilterSheet
          wide={wide}
          anchorRef={btnRef}
          picksByDay={picksByDay}
          draft={draft}
          onDraft={setDraft}
          onClose={closeSheet}
          onShow={() => {
            onChange(normalizeLockedFilter(draft));
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function MiniTitle({ dayLine }) {
  return (
    <div className="sf-locked-mini">
      <span className="sf-locked-name">Locked</span>
      <span className="sf-locked-mini-sub" style={NUM}>{dayLine.mini}</span>
    </div>
  );
}

function StatusSegment({ value, counts, onChange }) {
  const opts = [
    { id: 'pending', label: 'Pending', n: counts.pending },
    { id: 'live', label: 'Live', n: counts.live },
    { id: 'settled', label: 'Settled', n: counts.settled },
  ];
  return (
    <div className="sf-locked-seg" role="tablist" aria-label="Status" data-testid="locked-status">
      {opts.map((opt) => {
        const on = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={on}
            className={on ? 'sf-locked-seg-btn is-on' : 'sf-locked-seg-btn'}
            onClick={() => onChange(opt.id)}
            style={NUM}
          >
            <span>{opt.label}</span>
            <span className="sf-locked-seg-n">{opt.n}</span>
          </button>
        );
      })}
    </div>
  );
}

function SortButton({ btnRef, count, open, onClick }) {
  return (
    <button
      ref={btnRef}
      type="button"
      className={open ? 'sf-locked-sort is-on' : 'sf-locked-sort'}
      aria-label={count > 0 ? `Filters, ${count} on` : 'Filters'}
      aria-expanded={open}
      data-testid="locked-filter-button"
      onClick={onClick}
    >
      <SlidersHorizontal size={16} strokeWidth={1.75} />
      {count > 0 && (
        <span className="sf-locked-badge" style={NUM}>{count}</span>
      )}
    </button>
  );
}

function ChipRail({ filter, view, onAll, onSport, onWeak }) {
  const scroller = useRef(null);
  const [fade, setFade] = useState(false);
  const sports = view.sports.filter((s) => s.count > 0);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return undefined;
    const check = () => {
      setFade(el.scrollWidth - el.clientWidth - el.scrollLeft > 8);
    };
    check();
    el.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      el.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [sports.length, view.allCount, view.weakCount, filter.sport, filter.weak]);

  return (
    <div className="sf-locked-rail-wrap">
      <div ref={scroller} className="sf-locked-rail" data-testid="locked-chip-rail">
        <Chip on={filter.sport === 'all'} onClick={onAll} dim={view.allCount === 0} testid="chip-all">
          <span>All</span>
          <span className="sf-locked-chip-n" style={NUM}>{view.allCount}</span>
        </Chip>
        {(view.weakCount > 0 || filter.weak) && (
          <Chip on={filter.weak} onClick={onWeak} testid="chip-weak">
            <AlertTriangle size={12} strokeWidth={2.25} color={filter.weak ? GOLD : '#D4A574'} />
            <span>Weakening</span>
            <span className="sf-locked-chip-n" style={NUM}>{view.weakCount}</span>
          </Chip>
        )}
        {sports.map((s) => (
          <Chip
            key={s.id}
            on={filter.sport === s.id}
            onClick={() => onSport(s.id)}
            testid={`chip-${s.id}`}
          >
            <span style={{ color: filter.sport === s.id ? GOLD : (SPORT_INK[s.id] || SEC) }}>{s.id}</span>
            <span className="sf-locked-chip-n" style={NUM}>{s.count}</span>
          </Chip>
        ))}
      </div>
      {fade && <div className="sf-locked-rail-fade" aria-hidden="true" />}
    </div>
  );
}

function Chip({ on, onClick, children, dim, testid }) {
  return (
    <button
      type="button"
      className={on ? 'sf-locked-chip is-on' : 'sf-locked-chip'}
      aria-pressed={on}
      data-testid={testid}
      onClick={onClick}
      style={{ opacity: dim && !on ? 0.4 : 1 }}
    >
      {children}
    </button>
  );
}

function FilterSheet({ wide, anchorRef, picksByDay, draft, onDraft, onClose, onShow }) {
  const draftView = useMemo(
    () => describeLockedSlate(picksByDay?.[draft.day] || [], draft),
    [picksByDay, draft],
  );
  const [box, setBox] = useState(null);

  useEffect(() => {
    if (!wide) return undefined;
    const place = () => {
      const r = anchorRef.current?.getBoundingClientRect();
      if (!r) return;
      const below = window.innerHeight - r.bottom;
      setBox({
        top: below < 280 && r.top > below ? null : r.bottom + 8,
        bottom: below < 280 && r.top > below ? window.innerHeight - r.top + 8 : null,
        right: Math.max(12, window.innerWidth - r.right),
      });
    };
    place();
    window.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place);
      window.removeEventListener('resize', place);
    };
  }, [wide, anchorRef]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (wide) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [wide]);

  const set = (partial) => onDraft(normalizeLockedFilter({ ...draft, ...partial }));
  const n = draftView.feed.length;
  const showLabel = `Show ${n} ${n === 1 ? 'play' : 'plays'}`;

  const body = (
    <div
      className="sf-locked-sheet"
      role="dialog"
      aria-modal="true"
      aria-label="Filter locked plays"
      data-testid="locked-sheet"
      style={wide && box ? {
        top: box.top ?? 'auto',
        bottom: box.bottom ?? 'auto',
        right: box.right,
      } : undefined}
    >
      <div className="sf-locked-sheet-scroll">
        {!wide && <div className="sf-locked-grab" aria-hidden="true" />}
        <div className="sf-locked-sheet-head">
          <span>Filter</span>
          <button type="button" className="sf-locked-x" onClick={onClose} aria-label="Close">Close</button>
        </div>

        <SheetLabel>Status</SheetLabel>
        <div className="sf-locked-choice">
          {SHEET_STATUS.map((opt) => (
            <Choice key={opt.id} on={draft.status === opt.id} onClick={() => set({ status: opt.id })}>
              {opt.label}
            </Choice>
          ))}
        </div>

        <SheetLabel>Sport</SheetLabel>
        <div className="sf-locked-sportgrid">
          <SportCell on={draft.sport === 'all'} label="All" count={draftView.allCount} onClick={() => set({ sport: 'all' })} />
          {draftView.sports.map((s) => (
            <SportCell
              key={s.id}
              on={draft.sport === s.id}
              label={s.id}
              count={s.count}
              ink={SPORT_INK[s.id]}
              dim={s.count === 0}
              onClick={() => set({ sport: s.id })}
            />
          ))}
        </div>

        <SheetLabel>Market</SheetLabel>
        <div className="sf-locked-choice">
          {SHEET_MARKET.map((opt) => (
            <Choice key={opt.id} on={draft.market === opt.id} onClick={() => set({ market: opt.id })}>
              {opt.label}
            </Choice>
          ))}
        </div>

        <SheetLabel>Order by</SheetLabel>
        <div className="sf-locked-choice">
          {SHEET_ORDER.map((opt) => (
            <Choice key={opt.id} on={draft.sort === opt.id} onClick={() => set({ sort: opt.id })}>
              {opt.label}
            </Choice>
          ))}
        </div>
        <p className="sf-locked-note">
          {draft.sort === 'winpct'
            ? 'A play has no win rate of its own, so this stays on units.'
            : draft.sort === 'profit'
              ? 'Profit ranks graded plays. Open plays stay on units.'
              : 'Units is the size on the card.'}
        </p>

        <SheetLabel>Day</SheetLabel>
        <div className="sf-locked-choice">
          <Choice on={draft.day === 'today'} onClick={() => set({ day: 'today' })}>Today</Choice>
          <Choice on={draft.day === 'yesterday'} onClick={() => set({ day: 'yesterday' })}>Yesterday</Choice>
        </div>

        <Toggle
          on={draft.weak}
          label="Weakening only"
          detail={draftView.weakCount}
          onClick={() => set({ weak: !draft.weak })}
        />
        <Toggle
          on={draft.cancelled}
          label="Cancelled"
          detail={draftView.cancelledCount}
          onClick={() => set({ cancelled: !draft.cancelled })}
        />
      </div>
      <div className="sf-locked-sheet-foot">
        <button
          type="button"
          className="sf-locked-reset"
          onClick={() => onDraft(defaultLockedFilter())}
        >
          Reset
        </button>
        <button
          type="button"
          className="sf-locked-show"
          data-testid="locked-show"
          style={NUM}
          onClick={onShow}
        >
          {showLabel}
        </button>
      </div>
    </div>
  );

  return createPortal(
    <div className={wide ? 'sf-locked-pop' : 'sf-locked-modal'} data-testid="locked-sheet-root">
      <button type="button" className="sf-locked-backdrop" aria-label="Dismiss filters" onClick={onClose} />
      {body}
    </div>,
    document.body,
  );
}

function SheetLabel({ children }) {
  return <div className="sf-locked-label">{children}</div>;
}

function Choice({ on, onClick, children }) {
  return (
    <button type="button" className={on ? 'sf-locked-choice-btn is-on' : 'sf-locked-choice-btn'} aria-pressed={on} onClick={onClick}>
      {children}
    </button>
  );
}

function SportCell({ on, label, count, ink, dim, onClick }) {
  return (
    <button
      type="button"
      className={on ? 'sf-locked-sport is-on' : 'sf-locked-sport'}
      aria-pressed={on}
      onClick={onClick}
      style={{ opacity: dim && !on ? 0.4 : 1 }}
    >
      <span style={{ color: on ? GOLD : (ink || INK) }}>{label}</span>
      <span className="sf-locked-chip-n" style={NUM}>{count}</span>
    </button>
  );
}

function Toggle({ on, label, detail, onClick }) {
  return (
    <button type="button" className="sf-locked-toggle" aria-pressed={on} onClick={onClick}>
      <span>{label}</span>
      <span className="sf-locked-toggle-end">
        <span className="sf-locked-chip-n" style={NUM}>{detail}</span>
        <span className={on ? 'sf-locked-switch is-on' : 'sf-locked-switch'} aria-hidden="true">
          <span />
        </span>
      </span>
    </button>
  );
}

