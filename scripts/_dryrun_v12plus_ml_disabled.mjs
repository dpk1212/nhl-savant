/**
 * Dry-run: V12PLUS_ML_DISABLED vs V13 (#484) for a date range.
 *
 * Per ML side reports: V12+ stake, V13 action/units, final stake.
 * Flag ON: V13 STAKE/MUTE kept; every other ML → 0u muted with flag marker.
 *
 * Usage:
 *   node scripts/_dryrun_v12plus_ml_disabled.mjs --from=2026-11-16 --to=2026-11-19
 *   node scripts/_dryrun_v12plus_ml_disabled.mjs --fixture-only
 */
import 'dotenv/config';
import {
  V12PLUS_ML_DIFF_FIELDS,
  V12PLUS_ML_DISABLED_MUTED_BY,
  applyV12plusMlStakeDisable,
  isV12plusMlDisabled,
} from '../src/lib/v12plusMlDisabled.js';

const FROM = (process.argv.find((a) => a.startsWith('--from=')) || '--from=2026-11-16').slice(7);
const TO = (process.argv.find((a) => a.startsWith('--to=')) || '--to=2026-11-19').slice(5);

/**
 * Synthetic ML sides covering the contract (Firestore Admin unavailable here).
 * v12Units = stake after V12+ rungs, before V13. v13Action/Units = #484 result.
 */
const FIXTURES = [
  {
    date: '2026-11-16', sport: 'NHL', id: '2026-11-16_NHL_bos_tor', side: 'home',
    v12Units: 4, v13Action: 'EXEMPT', v13Units: 4, note: 'pre-V13 cutover',
  },
  {
    date: '2026-11-17', sport: 'NBA', id: '2026-11-17_NBA_lal_bos', side: 'away',
    v12Units: 3, v13Action: 'EXEMPT', v13Units: 3, note: 'pre-V13 cutover',
  },
  {
    date: '2026-11-18', sport: 'NFL', id: '2026-11-18_NFL_kc_buf', side: 'home',
    v12Units: 2, v13Action: 'EXEMPT', v13Units: 2, note: 'pre-V13 cutover',
  },
  {
    date: '2026-11-19', sport: 'NHL', id: '2026-11-19_NHL_edm_cgy', side: 'home',
    v12Units: 3, v13Action: 'STAKE', v13Units: 4, note: 'V13 STAKE kept',
  },
  {
    date: '2026-11-19', sport: 'NBA', id: '2026-11-19_NBA_nyk_mia', side: 'away',
    v12Units: 2.5, v13Action: 'PASS', v13Units: 2.5, note: 'V13 PASS → 0',
  },
  {
    date: '2026-11-19', sport: 'NFL', id: '2026-11-19_NFL_det_chi', side: 'home',
    v12Units: 4, v13Action: 'MUTE', v13Units: 0, note: 'V13 MUTE stays 0',
  },
  {
    date: '2026-11-19', sport: 'CFB', id: '2026-11-19_CFB_osu_mich', side: 'away',
    v12Units: 1.5, v13Action: 'PASS', v13Units: 1.5, note: 'V13 PASS → 0',
  },
  {
    date: '2026-11-19', sport: 'NHL', id: '2026-11-19_NHL_manual', side: 'home',
    v12Units: 5, v13Action: 'EXEMPT', v13Units: 5, manual: true, note: 'manual preserved',
  },
  {
    date: '2026-11-19', sport: 'NBA', id: 'fixture_spread_control', side: 'away',
    market: 'SPREAD', v12Units: 3, v13Action: null, v13Units: 3, note: 'spread unchanged',
  },
  {
    date: '2026-11-19', sport: 'NFL', id: 'fixture_total_control', side: 'over',
    market: 'TOTAL', v12Units: 2, v13Action: null, v13Units: 2, note: 'total unchanged',
  },
];

function inRange(date) {
  return date >= FROM && date <= TO;
}

console.log('=== V12PLUS_ML_DISABLED × V13 dry-run ===');
console.log(`Dates: ${FROM} → ${TO}`);
console.log(`Flag: ${isV12plusMlDisabled() ? 'ON' : 'OFF'}`);
console.log(`Allowed zeroing diff fields:\n  ${V12PLUS_ML_DIFF_FIELDS.join('\n  ')}\n`);
console.log('source=fixture (Firestore Admin unavailable in this env)\n');

console.log('── Per ML side: V12+ stake | V13 action/units | final ──');
const rows = [];
let fail = false;

for (const f of FIXTURES.filter((x) => inRange(x.date))) {
  const market = f.market || 'ML';
  // After V13 STAKE/MUTE, units are V13's; after PASS/EXEMPT, still V12+.
  const postV13Units = (f.v13Action === 'STAKE' || f.v13Action === 'MUTE')
    ? f.v13Units
    : f.v12Units;
  const out = applyV12plusMlStakeDisable({
    market,
    units: postV13Units,
    manual: f.manual === true,
    v13Action: f.v13Action,
  });
  const finalUnits = out.applied ? 0 : postV13Units;
  const muted = out.applied ? V12PLUS_ML_DISABLED_MUTED_BY : (f.v13Action === 'MUTE' ? 'v13-ml' : '—');

  if (market === 'ML') {
    console.log(
      `  ${f.date} ${f.sport} ${f.id}/${f.side}:`
      + ` V12+=${f.v12Units}u`
      + ` | V13=${f.v13Action || '∅'}/${f.v13Units}u`
      + ` | final=${finalUnits}u`
      + ` muted=${muted}`
      + ` preserved=${out.preservedBy || '—'}`
      + `  (${f.note})`,
    );
  }

  // Contract checks
  if (market === 'ML') {
    if (f.v13Action === 'STAKE') {
      if (out.applied || finalUnits !== f.v13Units) {
        console.error(`  FAIL: V13 STAKE must be untouched (${f.id})`);
        fail = true;
      }
    } else if (f.v13Action === 'MUTE') {
      if (out.applied || finalUnits !== 0) {
        console.error(`  FAIL: V13 MUTE must stay 0 untouched (${f.id})`);
        fail = true;
      }
    } else if (f.manual) {
      if (out.applied || finalUnits !== f.v12Units) {
        console.error(`  FAIL: manual must be preserved (${f.id})`);
        fail = true;
      }
    } else if (finalUnits !== 0 || !out.applied) {
      console.error(`  FAIL: non-V13 ML must be 0u muted (${f.id})`);
      fail = true;
    }
    if (finalUnits > postV13Units) {
      console.error(`  FAIL: raised stake (${f.id})`);
      fail = true;
    }
  } else if (out.applied || finalUnits !== f.v12Units) {
    console.error(`  FAIL: ${market} must be unchanged (${f.id})`);
    fail = true;
  }

  rows.push({ ...f, market, postV13Units, finalUnits, out });
}

const ml = rows.filter((r) => r.market === 'ML');
const st = rows.filter((r) => r.market !== 'ML');
console.log('\n── Summary ──');
console.log(`  ML sides: ${ml.length}`);
console.log(`  V13 STAKE kept: ${ml.filter((r) => r.v13Action === 'STAKE' && r.finalUnits === r.v13Units).length}`);
console.log(`  V13 MUTE kept at 0: ${ml.filter((r) => r.v13Action === 'MUTE' && r.finalUnits === 0 && !r.out.applied).length}`);
console.log(`  Non-V13 zeroed: ${ml.filter((r) => r.out.applied && r.finalUnits === 0).length}`);
console.log(`  Manual preserved: ${ml.filter((r) => r.manual && r.finalUnits === r.v12Units).length}`);
console.log(`  Spread/Total unchanged: ${st.every((r) => !r.out.applied) ? 'yes' : 'NO'}`);

console.log(`\n── Verdict: ${fail || !isV12plusMlDisabled() ? 'FAIL' : 'PASS'} ──`);
if (fail || !isV12plusMlDisabled()) process.exit(2);
console.log('Done.');
