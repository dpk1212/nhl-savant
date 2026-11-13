import assert from 'node:assert/strict';
import {
  isMainSoccerMatchSlug,
  isSoccerMarketTitle,
  makeSOCGameKey,
  resolveSOCTeam,
} from '../scripts/lib/soccerTeams.js';
import { positionFitsBoardSport } from '../src/lib/sportSlug.js';

assert.equal(isMainSoccerMatchSlug('unl-ser-ger-2026-11-13'), true);
assert.equal(isMainSoccerMatchSlug('conl-gua-can-2026-11-13'), true);
assert.equal(isMainSoccerMatchSlug('conl-guy1-pur-2026-11-16'), true);
assert.equal(isMainSoccerMatchSlug('unl-ser-ger-2026-11-13-total-corners'), false);
assert.equal(isMainSoccerMatchSlug('epl-ars-cov-2026-08-21'), true);

assert.equal(positionFitsBoardSport({ slug: 'unl-ser-ger-2026-11-13' }, 'SOC'), true);
assert.equal(positionFitsBoardSport({ slug: 'conl-hai-usa-2026-11-14' }, 'SOC'), true);
assert.equal(positionFitsBoardSport({ slug: 'unl-ser-ger-2026-11-13' }, 'NBA'), false);

const pairs = [
  ['Serbia vs. Germany', 'srb_ger'],
  ['Moldova vs. Kazakhstan', 'mda_kaz'],
  ['Luxembourg vs. Estonia', 'lux_est'],
  ['Slovakia vs. Faroe Islands', 'svk_fro'],
  ['Bulgaria vs. Iceland', 'bul_isl'],
  ['Scotland vs. North Macedonia', 'sco_mkd'],
  ['Slovenia vs. Switzerland', 'svn_sui'],
  ['Netherlands vs. Greece', 'ned_gre'],
  ['Liechtenstein vs. Azerbaijan', 'lie_aze'],
  ['Lithuania vs. Liechtenstein', 'ltu_lie'],
  ['Gibraltar vs. Malta', 'gib_mlt'],
  ['Andorra vs. Gibraltar', 'and_gib'],
  ['Kosovo vs. Israel', 'kvx_isr'],
  ['Georgia vs. Hungary', 'geo_hun'],
  ['Norway vs. Wales', 'nor_wal'],
  ['Portugal vs. Denmark', 'por_den'],
  ['Austria vs. Republic of Ireland', 'aut_irl'],
  ['Romania vs. Poland', 'rou_pol'],
  ['Sweden vs. Bosnia & Herzegovina', 'swe_bih'],
  ['Northern Ireland vs. Ukraine', 'nir_ukr'],
  ['Latvia vs. Armenia', 'lva_arm'],
  ['Cyprus vs. Montenegro', 'cyp_mne'],
  ['Belarus vs. Albania', 'blr_alb'],
  ['Finland vs. San Marino', 'fin_smr'],
  ['France vs. Türkiye', 'fra_tur'],
  ['Belgium vs. Italy', 'bel_ita'],
  ['Croatia vs. Czechia', 'cro_cze'],
  ['Puerto Rico vs. Dominica', 'pur_dma'],
  ['Bermuda vs. St. Lucia', 'ber_lca'],
  ['Grenada vs. St. Kitts and Nevis', 'grn_skn'],
  ['Saint-Martin vs. El Salvador', 'maf_slv'],
  ['Montserrat vs. Nicaragua', 'msr_nca'],
  ['Guatemala vs. Canada', 'gua_can'],
  ['Sint Maarten vs. French Guiana', 'sxm_guf'],
  ['Haiti vs. United States', 'hai_usa'],
  ['St. Vincent and the Grenadines vs. Belize', 'vin_blz'],
  ['Jamaica vs. Mexico', 'jam_mex'],
  ['Panama vs. Curaçao', 'pan_cuw'],
  ['Guadeloupe vs. Bermuda', 'glp_ber'],
  ['Guyana vs. Puerto Rico', 'guy_pur'],
  ['Cuba vs. Grenada', 'cub_grn'],
  ['Trinidad and Tobago vs. Antigua and Barbuda', 'tri_atg'],
  ['Martinique vs. Aruba', 'mtq_aru'],
  ['Dominica vs. Cayman Islands', 'dma_cay'],
  ['Belize vs. Sint Maarten', 'blz_sxm'],
  ['St. Lucia vs. Barbados', 'lca_brb'],
  ['St. Kitts and Nevis vs. Bonaire', 'skn_bon'],
  ['French Guiana vs. St. Vincent and the Grenadines', 'guf_vin'],
  ['United States vs. Haiti', 'usa_hai'],
  ['El Salvador vs. Saint-Martin', 'slv_maf'],
  ['Mexico vs. Jamaica', 'mex_jam'],
  ['Nicaragua vs. Montserrat', 'nca_msr'],
];

for (const [title, key] of pairs) {
  const m = title.match(/^(.+?)\s+vs\.?\s+(.+)$/);
  assert.ok(m, title);
  assert.equal(makeSOCGameKey(m[1], m[2]), key, title);
  assert.equal(isSoccerMarketTitle(title), true, title);
}

assert.equal(resolveSOCTeam('Curaçao'), 'CUW');
assert.equal(resolveSOCTeam('Korea Republic'), 'KOR');
assert.equal(resolveSOCTeam('Slovenia'), 'SVN');
assert.equal(resolveSOCTeam('ŠK Slovan Bratislava'), 'SLO');
assert.equal(resolveSOCTeam('Romania'), 'ROU');
assert.equal(resolveSOCTeam('AS Roma'), 'ROM');
assert.equal(resolveSOCTeam('North Macedonia'), 'MKD');
assert.equal(resolveSOCTeam('Manchester City'), 'MAC');
assert.equal(resolveSOCTeam('Northern Ireland'), 'NIR');
assert.equal(resolveSOCTeam('Republic of Ireland'), 'IRL');
assert.equal(resolveSOCTeam('Ireland'), 'IRL');
assert.equal(resolveSOCTeam('French Guiana'), 'GUF');
assert.equal(resolveSOCTeam('Guyana'), 'GUY');
assert.equal(isSoccerMarketTitle('New Mexico vs. Colorado State'), false);

console.log('nations league soccer ok', pairs.length);
