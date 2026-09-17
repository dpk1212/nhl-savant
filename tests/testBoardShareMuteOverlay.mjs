/**
 * Board $ share mute (2026-09-17+).
 * Mute 25–45 always. <25 keep only when proven $ share ≥ 50%. ≥45 keep.
 * Usage: node tests/testBoardShareMuteOverlay.mjs
 */
import assert from 'assert';
import {
  applyBoardShareMuteOverlay,
  applyBoardShareMuteOverlayFromTicket,
  boardShareFromWalletDetails,
  isBoardShareMuteLive,
  BOARD_SHARE_MUTE_FROM,
  BOARD_SHARE_MUTED_BY,
  BOARD_SHARE_MUTE_MIN,
  BOARD_SHARE_MUTE_MAX,
  BOARD_SHARE_PROVEN_KEEP_MIN,
} from '../src/lib/boardShareMuteOverlay.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function run(args) {
  return applyBoardShareMuteOverlay({
    pickDate: '2026-09-17',
    hasWalletDetails: true,
    ...args,
  });
}

ok(isBoardShareMuteLive('2026-09-17'), 'live on cutover');
ok(!isBoardShareMuteLive('2026-09-16'), 'not live before cutover');
ok(BOARD_SHARE_MUTE_FROM === '2026-09-17', 'cutover date');
ok(BOARD_SHARE_MUTE_MIN === 0.25, 'mid floor');
ok(BOARD_SHARE_MUTE_MAX === 0.45, 'mid ceiling exclusive');
ok(BOARD_SHARE_PROVEN_KEEP_MIN === 0.50, 'proven keep');
ok(BOARD_SHARE_MUTED_BY === 'board-share', 'mutedBy');

{
  const r = run({ units: 4, share: 0.30, shareP: 0.80 });
  ok(r.action === 'MUTE' && r.units === 0, '25–45 mutes even with high proven share');
  ok(r.mutedBy === BOARD_SHARE_MUTED_BY, 'mid mute stamp');
  ok(r.reason === 'board_share_mid', 'mid reason');
  ok(r.unitsPrePolicy === 4, 'preserves pre units');
}
{
  const r = run({ units: 3, share: 0.25, shareP: 0.99 });
  ok(r.action === 'MUTE' && r.units === 0, 'exactly 25% is mute');
}
{
  const r = run({ units: 3, share: 0.449, shareP: 0.90 });
  ok(r.action === 'MUTE' && r.units === 0, 'just under 45% is mute');
}
{
  const r = run({ units: 5.4, share: 0.45, shareP: 0.10 });
  ok(r.action === 'HOLD' && r.units === 5.4 && r.mutedBy == null, 'exactly 45% keep');
}
{
  const r = run({ units: 2, share: 0.80, shareP: 0.10 });
  ok(r.action === 'HOLD' && r.units === 2, 'majority share keep');
}

{
  const r = run({ units: 4, share: 0.20, shareP: 0.50 });
  ok(r.action === 'HOLD' && r.units === 4, '<25 keep when proven ≥50');
  ok(r.reason === 'board_share_junk_against', 'junk-against reason');
  ok(r.mutedBy == null, 'junk-against is not a mute');
}
{
  const r = run({ units: 4, share: 0.10, shareP: 0.80 });
  ok(r.action === 'HOLD' && r.units === 4, 'deep junk-against keep');
}
{
  const r = run({ units: 4, share: 0.20, shareP: 0.499 });
  ok(r.action === 'MUTE' && r.units === 0, 'proven just under 50% is buried');
  ok(r.reason === 'board_share_buried', 'buried reason');
}
{
  const r = run({ units: 4, share: 0.10, shareP: 0.20 });
  ok(r.action === 'MUTE' && r.reason === 'board_share_buried', 'true buried mutes');
}
{
  const r = run({ units: 4, share: 0.10, shareP: null });
  ok(r.action === 'MUTE' && r.reason === 'board_share_buried', 'missing proven share is not the exception');
}

{
  const r = applyBoardShareMuteOverlay({
    units: 4, share: 0.30, shareP: 0.10, hasWalletDetails: true, pickDate: '2026-09-16',
  });
  ok(r.action === 'EXEMPT' && r.units === 4, 'pre-cutover does not rewrite history');
}
{
  const r = run({ units: 0, share: 0.30, shareP: 0.10 });
  ok(r.action === 'PASS' && r.units === 0, 'already 0u stays PASS');
}
{
  const r = applyBoardShareMuteOverlay({
    units: 4, share: null, shareP: null, hasWalletDetails: false, pickDate: '2026-09-17',
  });
  ok(r.action === 'HOLD' && r.units === 4, 'missing walletDetails fail-open');
  ok(r.reason === 'board_share_fail_open', 'fail-open reason');
}
{
  const r = applyBoardShareMuteOverlay({
    units: 4, share: null, shareP: 0.80, hasWalletDetails: true, pickDate: '2026-09-17',
  });
  ok(r.action === 'HOLD' && r.units === 4, 'uncomputable all-$ share fail-open');
}

{
  const profiles = new Map([
    ['aaaaaa', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } } }],
    ['bbbbbb', { bySport: { MLB: { whitelistTier: 'FLAT' } } }],
    ['cccccc', { bySport: { MLB: { whitelistTier: 'WR50' } } }],
    ['dddddd', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } } }],
  ]);
  const wd = [
    { side: 'home', walletShort: 'aaaaaa', invested: 200 },
    { side: 'home', walletShort: 'cccccc', invested: 100 },
    { side: 'away', walletShort: 'bbbbbb', invested: 700 },
    { side: 'away', walletShort: 'dddddd', invested: 1000 },
    { side: 'home', wallet: 'xxAAAAAA', invested: 9999 }, // dup of aaaaaa
  ];
  const s = boardShareFromWalletDetails(wd, 'home', 'MLB', profiles);
  ok(s.hasWalletDetails, 'details present');
  ok(Math.abs(s.share - (300 / 2000)) < 1e-9, 'all-$ share uses invested FOR/(FOR+AG)');
  ok(Math.abs(s.shareP - (200 / 1900)) < 1e-9, 'proven share is CONFIRMED+FLAT only');
  ok(s.nWallets === 4, 'dedupes wallet shorts');

  const junk = applyBoardShareMuteOverlayFromTicket({
    units: 3,
    pickDate: '2026-09-17',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 100 },
      { side: 'away', walletShort: 'cccccc', invested: 900 },
    ],
    side: 'home',
    sport: 'MLB',
    walletProfiles: profiles,
  });
  ok(junk.action === 'HOLD' && junk.reason === 'board_share_junk_against', 'ticket helper keeps junk-against');

  const mid = applyBoardShareMuteOverlayFromTicket({
    units: 3,
    pickDate: '2026-09-17',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 300 },
      { side: 'away', walletShort: 'dddddd', invested: 700 },
    ],
    side: 'home',
    sport: 'MLB',
    walletProfiles: profiles,
  });
  ok(mid.action === 'MUTE' && mid.reason === 'board_share_mid', 'ticket helper mutes 30% even with proven FOR');
}

console.log(`ok ${n} board-share mute checks`);
