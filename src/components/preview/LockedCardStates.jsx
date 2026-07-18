/**
 * LockedCardStates — renders the PRODUCTION LockedPositionCardView (the same
 * component Sharp Flow mounts) with one fixture per visual state, so card
 * design changes can be reviewed without Firebase. Open at #/locked-card-states.
 */
import { LockedPositionCardView } from '../sharpFlow/cards/PositionCards';

const now = Date.now();
const H = 36e5;

const base = {
  sport: 'MLB',
  away: 'Chicago White Sox',
  home: 'Toronto Blue Jays',
  gameTime: '3:08 PM',
  pickLabel: 'Sox ML',
  lockOdds: -112,
  peakOdds: -118,
  nowOdds: -115,
  clvPct: -2.1,
  units: 5.4,
  toWin: 4.82,
  stakePath: 'TOP_PICK',
  wallets: [],
};

const FIXTURES = [
  { title: 'Pending — locks in hours', f: { ...base, commenceMs: now + 3 * H } },
  { title: 'Closing — locks < 1h', f: { ...base, pickLabel: 'Tigers ML', lockOdds: -185, clvPct: 0.6, units: 4.0, toWin: 2.16, commenceMs: now + 0.8 * H } },
  { title: 'Urgent — locks < 15m', f: { ...base, pickLabel: 'Over 8.5', lockOdds: -110, clvPct: 0.4, units: 4.0, toWin: 3.64, commenceMs: now + (12 * 60 * 1000) + (15 * 60 * 1000) } },
  { title: 'Frozen — ticket SET', f: { ...base, pickLabel: 'Brewers ML', lockOdds: -126, clvPct: 1.7, units: 4.0, toWin: 3.17, commenceMs: now + 10 * 60 * 1000 } },
  { title: 'Tracked — tape mute', f: { ...base, pickLabel: 'Mariners ML', lockOdds: -137, clvPct: 1.5, units: 0, toWin: 0, commenceMs: now + 5 * H, mutedBy: 'tape-weak', unitsPreTape: 1.5, stakePath: 'MONITORING' } },
  { title: 'Graded — WIN', f: { ...base, pickLabel: 'Rays ML', lockOdds: -106, clvPct: 0.7, units: 4.0, toWin: 3.77, commenceMs: now - 5 * H, graded: true, outcome: 'WIN', profit: 3.77 } },
  { title: 'Graded — LOSS', f: { ...base, pickLabel: 'Coria ML', sport: 'UFC', lockOdds: -1100, clvPct: -1.2, units: 3.0, toWin: 0.27, commenceMs: now - 5 * H, graded: true, outcome: 'LOSS', profit: -3.0 } },
];

export default function LockedCardStates() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B0F1F', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ color: '#9aa6bd', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', marginBottom: 18 }}>
          LOCKED CARD — COLLAPSED STATES (PRODUCTION COMPONENT)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: 18 }}>
          {FIXTURES.map(({ title, f }) => (
            <div key={title}>
              <div style={{ color: '#647089', fontSize: '0.62rem', fontWeight: 700, marginBottom: 6, letterSpacing: '0.06em' }}>
                {title}
              </div>
              <LockedPositionCardView f={f} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
