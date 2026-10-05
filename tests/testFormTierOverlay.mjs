/**
 * Form × tier layer (2026-10-05+).
 * Usage: node tests/testFormTierOverlay.mjs
 */
import assert from 'assert';
import {
  applyFormTierOverlay,
  classifyFormTier,
  formBoostUnits,
  formOf,
  gradeFromTiers,
  gradeSportBook,
  isFormTierLive,
  skillTier,
  timeTier,
  FORM_TIER_FROM,
  FORM_OUT_MUTED_BY,
  FORM_CONTESTED_MUTED_BY,
  FORM_PRESS_BOOSTED_BY,
  FORM_PRESS_RESCUED_BY,
  FORM_BOOST_FLOOR_U,
  FORM_BOOST_CAP_U,
  FORM_RESCUE_U,
} from '../src/lib/formTierOverlay.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}
function eq(a, b, msg) {
  assert.strictEqual(a, b, `${msg} (got ${a}, want ${b})`);
  n++;
}

// ── grading ────────────────────────────────────────────────────────────────
eq(timeTier(14), 'T0', 'T0');
eq(timeTier(15), 'T1', 'T1');
eq(timeTier(30), 'T2', 'T2');
eq(timeTier(60), 'T3', 'T3');
eq(skillTier(20, 54.9, 80), 'S0', 'WR below 55 is S0 regardless of ROI');
eq(skillTier(20, 60, 60), 'S4', 'S4');
eq(skillTier(20, 60, 35), 'S3', 'S3');
eq(skillTier(20, 60, 20), 'S2', 'S2');
eq(skillTier(20, 60, 10), 'S1', 'S1');
eq(skillTier(20, 60, 9.9), 'S0', 'S0 under 10');
eq(gradeFromTiers('S4', 'T1'), 'PROVEN', 'S4@T1 PROVEN');
eq(gradeFromTiers('S3', 'T2'), 'PROVEN', 'S3@T2 PROVEN');
eq(gradeFromTiers('S3', 'T1'), 'ESTABLISHED', 'S3@T1 ESTABLISHED');
eq(gradeFromTiers('S2', 'T3'), 'ESTABLISHED', 'S2@T3 ESTABLISHED');
eq(gradeFromTiers('S2', 'T1'), 'RISING', 'S2@T1 RISING');
eq(gradeFromTiers('S2', 'T2'), 'STALLED', 'S2@T2 STALLED');
eq(gradeFromTiers('S0', 'T1'), 'BELOW', 'S0@T1 BELOW');
eq(gradeFromTiers('S4', 'T0'), 'EARLY', 'T0 EARLY');

// ── form ───────────────────────────────────────────────────────────────────
eq(formOf('PROVEN', { L5: 2, L10: 8 }), 'OUT', 'PROVEN L5 ≤ 2 is OUT even when L10 hot');
eq(formOf('PROVEN', { L5: 3, L10: 7 }), 'IN', 'PROVEN L10 ≥ 7 IN');
eq(formOf('PROVEN', { L5: 3, L10: 6 }), 'MID', 'PROVEN MID');
eq(formOf('PROVEN', { L5: null, L10: null }), 'MID', 'PROVEN no windows → MID');
eq(formOf('ESTABLISHED', { L20: 13 }), 'IN', 'ESTABLISHED L20 ≥ 13 IN');
eq(formOf('ESTABLISHED', { L20: 11 }), 'OUT', 'ESTABLISHED L20 11 OUT');
eq(formOf('ESTABLISHED', { L20: 12 }), 'OUT', 'ESTABLISHED L20 12 OUT');
eq(formOf('ESTABLISHED', { L20: 10 }), 'MID', 'ESTABLISHED L20 10 MID');
eq(formOf('ESTABLISHED', { L20: null, L10: 9 }), 'MID', 'ESTABLISHED no L20 → MID (fail-open)');
eq(formOf('RISING', { L10: 7 }), 'IN', 'RISING L10 7 IN');
eq(formOf('RISING', { L10: 6 }), 'OUT', 'RISING L10 6 OUT');
eq(formOf('RISING', { L10: null }), 'MID', 'RISING < 10 settled MID');
eq(formOf('STALLED', { L10: 9 }), 'MID', 'non-performing always MID');

// ── profile book ───────────────────────────────────────────────────────────
function book(n, wr, roi, { l5 = null, l10 = null, l20 = null, invested = null } = {}) {
  return {
    positions: { n, wr, dollarRoi: roi, invested: invested ?? n * 1000 },
    form: {
      actionL5: l5 ? { w: l5[0], l: l5[1] } : undefined,
      actionL10: l10 ? { w: l10[0], l: l10[1] } : undefined,
      actionL20: l20 ? { w: l20[0], l: l20[1] } : undefined,
    },
  };
}
function profile(sport, b) {
  return { bySport: { [sport]: b } };
}

const provenIn = profile('MLB', book(40, 60, 40, { l5: [3, 2], l10: [7, 3] }));
const provenOut = profile('MLB', book(40, 60, 40, { l5: [1, 4], l10: [5, 5] }));
const provenMid = profile('MLB', book(40, 60, 40, { l5: [3, 2], l10: [6, 4] }));
const estIn = profile('MLB', book(20, 60, 40, { l10: [6, 4], l20: [13, 7] }));
const estNoL20 = profile('MLB', book(20, 60, 40, { l10: [8, 2] }));
const risingIn = profile('MLB', book(18, 60, 25, { l10: [7, 3] }));
const stalled = profile('MLB', book(45, 50, 2, { l10: [8, 2] }));
const early = profile('MLB', book(8, 75, 80, { l5: [5, 0] }));
const noBook = { bySport: {} };

const gb = gradeSportBook(provenIn, 'MLB');
eq(gb.grade, 'PROVEN', 'book grade PROVEN');
eq(gb.form, 'IN', 'book form IN');
eq(gb.L10, 7, 'L10 read');
eq(gradeSportBook(provenIn, 'NFL').schema, false, 'no sport book → schema false');
eq(gradeSportBook(early, 'MLB').grade, 'EARLY', 'n 8 EARLY');
eq(gradeSportBook(stalled, 'MLB').grade, 'STALLED', 'STALLED');
eq(gradeSportBook(estNoL20, 'MLB').form, 'MID', 'ESTABLISHED without L20 is MID');

// ── classification ─────────────────────────────────────────────────────────
const profiles = new Map([
  ['aaaaaa', provenIn],
  ['bbbbbb', provenOut],
  ['cccccc', provenMid],
  ['dddddd', estIn],
  ['eeeeee', risingIn],
  ['ffffff', stalled],
  ['111111', early],
  ['222222', noBook],
]);
// sport usual = invested / n = 1000 per book above; press = ≥1500.
const W = (short, side, invested, extra = {}) => ({ walletShort: short, side, invested, ...extra });

function run(args) {
  return applyFormTierOverlay({
    pickDate: '2026-10-05',
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'over',
    walletProfiles: profiles,
    ...args,
  });
}

ok(isFormTierLive('2026-10-05'), 'live on cutover');
ok(!isFormTierLive('2026-10-04'), 'not live before cutover');
eq(FORM_TIER_FROM, '2026-10-05', 'cutover');
eq(FORM_BOOST_FLOOR_U, 4, 'boost floor');
eq(FORM_BOOST_CAP_U, 5, 'boost cap');
eq(FORM_RESCUE_U, 3, 'rescue size');

eq(run({ units: 3, pickDate: '2026-10-04', walletDetails: [W('bbbbbb', 'over', 1000)] }).action, 'EXEMPT', 'pre-cutover exempt');
eq(run({ units: 3, marketType: 'PROP', walletDetails: [W('bbbbbb', 'over', 1000)] }).action, 'EXEMPT', 'prop exempt');
eq(run({ units: 3, walletProfiles: null, walletDetails: [W('bbbbbb', 'over', 1000)] }).action, 'HOLD', 'no profiles → HOLD');
eq(run({ units: 3, walletDetails: [W('222222', 'over', 1000)] }).action, 'HOLD', 'no sport book on any wallet → HOLD');
eq(run({ units: 3, walletDetails: [] }).action, 'HOLD', 'empty ticket → HOLD');

// no performing FOR → PASS, size untouched, classification still returned
let r = run({ units: 3, walletDetails: [W('ffffff', 'over', 3000), W('111111', 'over', 3000)] });
eq(r.action, 'PASS', 'STALLED/EARLY only → PASS');
eq(r.units, 3, 'units untouched');
eq(r.tier, 'STALLED', 'best tier stamped');
eq(r.perfForN, 0, 'perfForN 0');

// rule 1 — OUT form mutes
r = run({ units: 3, walletDetails: [W('bbbbbb', 'over', 1000)] });
eq(r.action, 'MUTE', 'PROVEN OUT mutes');
eq(r.units, 0, 'OUT → 0u');
eq(r.mutedBy, FORM_OUT_MUTED_BY, 'form-out stamp');
eq(r.unitsPrePolicy, 3, 'pre units kept');
r = run({ units: 3, walletDetails: [W('bbbbbb', 'over', 1000), W('aaaaaa', 'over', 1000)] });
eq(r.action, 'PASS', 'OUT wallet plus IN wallet → best form IN, no mute');
eq(r.form, 'IN', 'best form IN');
r = run({ units: 0, mutedBy: 'steam-tail', unitsPreMute: 3, walletDetails: [W('bbbbbb', 'over', 1000)] });
eq(r.action, 'HOLD', 'already muted OUT → HOLD');
eq(r.units, 0, 'stays 0');

// rule 2 — IN-form performing AG mutes
r = run({ units: 3, walletDetails: [W('cccccc', 'over', 1000), W('aaaaaa', 'under', 1000)] });
eq(r.action, 'MUTE', 'IN-form PROVEN against mutes');
eq(r.mutedBy, FORM_CONTESTED_MUTED_BY, 'form-contested stamp');
eq(r.oppo, 'in-form', 'oppo in-form');
r = run({ units: 3, walletDetails: [W('aaaaaa', 'over', 3000), W('dddddd', 'under', 1000)] });
eq(r.action, 'MUTE', 'contested beats the press boost');
r = run({ units: 3, walletDetails: [W('cccccc', 'over', 1000), W('bbbbbb', 'under', 1000)] });
eq(r.action, 'PASS', 'OUT-form PROVEN against is not contested');
eq(r.oppo, 'mid-out', 'oppo mid-out');
r = run({ units: 3, walletDetails: [W('aaaaaa', 'over', 1000), W('ffffff', 'under', 9000)] });
eq(r.action, 'PASS', 'STALLED against (even pressing) is not opposition');
eq(r.oppo, 'none', 'oppo none');

// rule 3 — IN + press + nobody against boosts
r = run({ units: 3, walletDetails: [W('aaaaaa', 'over', 1500)] });
eq(r.action, 'BOOST', 'PROVEN IN pressing 1.5× boosts');
eq(r.units, 4, '3u → 4u floor');
eq(r.boostedBy, FORM_PRESS_BOOSTED_BY, 'boost stamp');
eq(r.inPressN, 1, 'inPressN 1');
r = run({ units: 1.5, walletDetails: [W('eeeeee', 'over', 2000)] });
eq(r.action, 'BOOST', 'RISING IN pressing boosts');
eq(r.units, 4, '1.5u → 4u');
r = run({ units: 4.5, walletDetails: [W('dddddd', 'over', 2000)] });
eq(r.action, 'PASS', '4.5u already in band');
eq(r.units, 4.5, 'left alone');
r = run({ units: 6, walletDetails: [W('aaaaaa', 'over', 2000)] });
eq(r.action, 'PASS', '6u above cap is not cut');
eq(r.units, 6, 'left alone');
r = run({ units: 3, walletDetails: [W('aaaaaa', 'over', 1499)] });
eq(r.action, 'PASS', '1.499× is not a press');
eq(r.reason, 'in_form_hold', 'in form, not pressing → hold');
r = run({ units: 3, walletDetails: [W('aaaaaa', 'over', 1000), W('cccccc', 'over', 2000)] });
eq(r.action, 'PASS', 'press must come from an IN-form wallet (MID presser does not count)');
r = run({ units: 3, walletDetails: [W('aaaaaa', 'over', 2000), W('cccccc', 'under', 1000)] });
eq(r.action, 'PASS', 'MID-form PROVEN against blocks the boost without muting');
eq(r.units, 3, 'units held');
r = run({ units: 3, walletDetails: [W('cccccc', 'over', 2000)] });
eq(r.action, 'PASS', 'MID form pressing → hold');
eq(r.reason, 'mid_form_hold', 'mid form reason');
eq(formBoostUnits(0), 0, 'no boost from 0');
eq(formBoostUnits(4), 4, 'already 4');
eq(formBoostUnits(5), 5, 'already 5');

// dedupe: same wallet listed twice, largest stake wins
r = run({ units: 3, walletDetails: [W('aaaaaa', 'over', 500), W('aaaaaa', 'over', 2000)] });
eq(r.action, 'BOOST', 'largest listing counts for press');
eq(r.perfForN, 1, 'deduped');

// explicit AG direction is not FOR
r = run({ units: 3, walletDetails: [W('aaaaaa', 'over', 2000, { direction: 'AG' })] });
eq(r.action, 'PASS', 'AG-direction wallet on our side is not FOR');
eq(r.perfForN, 0, 'perfForN 0 with AG direction');

// rule 4 — rescue from the three board-shape mutes only
r = run({ units: 0, mutedBy: 'board-share', unitsPreMute: 3, walletDetails: [W('aaaaaa', 'over', 2000)] });
eq(r.action, 'RESCUE', 'board-share rescued');
eq(r.units, 3, 'rescue 3u');
eq(r.rescuedBy, FORM_PRESS_RESCUED_BY, 'rescue stamp');
eq(r.rescuedFrom, 'board-share', 'rescued from');
r = run({ units: 0, mutedBy: 'st-fat', unitsPreMute: 4, walletDetails: [W('aaaaaa', 'over', 2000)] });
eq(r.action, 'RESCUE', 'st-fat rescued');
eq(r.units, 3, 'rescue is 3u, not pre');
r = run({ units: 0, mutedBy: 'ev-drift-edge', unitsPreMute: 2, walletDetails: [W('eeeeee', 'over', 2000)] });
eq(r.action, 'RESCUE', 'ev-drift-edge rescued');
r = run({ units: 0, mutedBy: 'steam-tail', unitsPreMute: 3, walletDetails: [W('aaaaaa', 'over', 2000)] });
eq(r.action, 'HOLD', 'steam-tail stays muted');
eq(r.units, 0, 'still 0');
r = run({ units: 0, mutedBy: 'tape-weak', unitsPreMute: 3, walletDetails: [W('aaaaaa', 'over', 2000)] });
eq(r.action, 'HOLD', 'tape-weak stays muted');
r = run({ units: 0, mutedBy: 'believed-cut', unitsPreMute: 3, walletDetails: [W('aaaaaa', 'over', 2000)] });
eq(r.action, 'HOLD', 'believed-cut stays muted');
r = run({ units: 0, mutedBy: null, unitsPreMute: 0, walletDetails: [W('aaaaaa', 'over', 2000)] });
eq(r.action, 'HOLD', 'unstamped 0u is not rescued');
r = run({ units: 0, mutedBy: 'board-share', unitsPreMute: 0, walletDetails: [W('aaaaaa', 'over', 2000)] });
eq(r.action, 'HOLD', 'no pre units → HOLD');
r = run({ units: 0, mutedBy: 'board-share', unitsPreMute: 3, walletDetails: [W('aaaaaa', 'over', 1000)] });
eq(r.action, 'PASS', 'not pressing → no rescue');
eq(r.units, 0, 'stays muted');
r = run({ units: 0, mutedBy: 'board-share', unitsPreMute: 3, walletDetails: [W('aaaaaa', 'over', 2000), W('cccccc', 'under', 1000)] });
eq(r.action, 'PASS', 'performing AG blocks rescue');
eq(r.units, 0, 'stays muted');
r = run({ units: 0, mutedBy: 'board-share', unitsPreMute: 3, walletDetails: [W('bbbbbb', 'over', 2000)] });
eq(r.action, 'HOLD', 'OUT form never rescued');

// classify exposes the roster
const cls = classifyFormTier([W('aaaaaa', 'over', 2000), W('bbbbbb', 'under', 1000), W('ffffff', 'under', 500)], 'over', 'MLB', profiles);
eq(cls.perfForN, 1, 'cls perfForN');
eq(cls.perfAgN, 1, 'cls perfAgN');
eq(cls.inAgN, 0, 'cls inAgN');
eq(cls.bestTier, 'PROVEN', 'cls bestTier');
eq(cls.bestForm, 'IN', 'cls bestForm');
eq(cls.inPressN, 1, 'cls inPressN');
eq(cls.schemaN, 3, 'cls schemaN');

console.log(`testFormTierOverlay: ${n} assertions passed`);
