/**
 * One-off: dump first tracked WNBA slate from sharp_action_positions
 * (same Firebase collection that feeds DAILY_SHARP_ACTION_REPORT / AGSU wallet tracking).
 *
 * Usage: node scripts/_dumpWnbaSlate.mjs
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sakPath)) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.VITE_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
}
const db = admin.firestore();

function money(n) {
  if (n == null || !Number.isFinite(Number(n))) return '—';
  const v = Number(n);
  const sign = v < 0 ? '-' : v > 0 ? '+' : '';
  return `${sign}$${Math.abs(Math.round(v)).toLocaleString()}`;
}

async function main() {
  const snap = await db.collection('sharp_action_positions').where('sport', '==', 'WNBA').get();
  const rows = [];
  for (const d of snap.docs) {
    const x = d.data();
    rows.push({
      id: d.id,
      date: x.date || null,
      status: x.status || null,
      result: x.result || null,
      gameKey: x.gameKey || null,
      away: x.away || null,
      home: x.home || null,
      marketType: x.marketType || null,
      side: x.side || null,
      teamName: x.teamName || x.outcome || null,
      wallet: x.wallet || null,
      walletShort: x.walletShort || (x.wallet ? String(x.wallet).slice(-6) : null),
      name: x.name || null,
      tier: x.tier || null,
      label: x.label || null,
      invested: x.invested ?? null,
      settledPnl: x.settledPnl ?? null,
      avgPrice: x.avgPrice ?? null,
      betMultiplier: x.betMultiplier ?? null,
      vaultQualified: x.vaultQualified !== false,
      qualificationTier: x.qualificationTier || null,
      score: x.score || null,
      firstSeen: x.firstSeen?.toDate?.()?.toISOString?.() || x.firstSeen || null,
      gradedAt: x.gradedAt?.toDate?.()?.toISOString?.() || x.gradedAt || null,
    });
  }

  rows.sort((a, b) => {
    const da = `${a.date || ''}|${a.gameKey || ''}|${a.marketType || ''}|${a.walletShort || ''}`;
    const db_ = `${b.date || ''}|${b.gameKey || ''}|${b.marketType || ''}|${b.walletShort || ''}`;
    return da < db_ ? -1 : da > db_ ? 1 : 0;
  });

  const dates = [...new Set(rows.map(r => r.date).filter(Boolean))].sort();
  const firstDate = dates[0] || null;
  const firstSlate = firstDate ? rows.filter(r => r.date === firstDate) : rows;
  const graded = firstSlate.filter(r => r.status === 'GRADED' && r.result && r.result !== 'PUSH');

  const summary = {
    totalWnbaDocs: rows.length,
    dates,
    firstSlateDate: firstDate,
    firstSlateDocs: firstSlate.length,
    firstSlateGraded: graded.length,
  };

  console.log('WNBA sharp_action_positions dump');
  console.log(JSON.stringify(summary, null, 2));
  console.log('');

  const byGame = new Map();
  for (const r of graded) {
    const gk = r.gameKey || `${r.away}_${r.home}`;
    if (!byGame.has(gk)) byGame.set(gk, []);
    byGame.get(gk).push(r);
  }

  let w = 0, l = 0, inv = 0, pnl = 0;
  let vaultW = 0, vaultL = 0, vaultInv = 0, vaultPnl = 0;

  console.log(`# First WNBA slate — ${firstDate}`);
  console.log('');
  for (const [gk, list] of [...byGame.entries()].sort()) {
    const sample = list[0];
    const score = sample.score ? `${sample.score.away}-${sample.score.home}` : '';
    console.log(`## ${sample.away} @ ${sample.home} (${gk}) ${score}`);
    console.log('| Wallet | Name | Mkt | Side | Inv | Result | PnL | Vault | Tier |');
    console.log('|---|---|---|---|---|---|---|---|---|');
    for (const r of list.sort((a, b) => (b.invested || 0) - (a.invested || 0))) {
      const won = r.result === 'WIN';
      if (won) w++; else l++;
      inv += Number(r.invested) || 0;
      pnl += Number(r.settledPnl) || 0;
      if (r.vaultQualified) {
        if (won) vaultW++; else vaultL++;
        vaultInv += Number(r.invested) || 0;
        vaultPnl += Number(r.settledPnl) || 0;
      }
      console.log(
        `| ${r.walletShort || '—'} | ${r.name || '—'} | ${r.marketType} | ${r.teamName || r.side} | ${money(r.invested)} | ${r.result} | ${money(r.settledPnl)} | ${r.vaultQualified ? 'VAULT' : 'SHADOW'} | ${r.tier || '—'} |`
      );
    }
    console.log('');
  }

  console.log('## Totals');
  console.log(`All graded: ${w}-${l} | invested ${money(inv)} | PnL ${money(pnl)} | ROI ${inv ? ((pnl / inv) * 100).toFixed(1) + '%' : '—'}`);
  console.log(`VAULT only (report book): ${vaultW}-${vaultL} | invested ${money(vaultInv)} | PnL ${money(vaultPnl)} | ROI ${vaultInv ? ((vaultPnl / vaultInv) * 100).toFixed(1) + '%' : '—'}`);

  const out = { summary, firstSlate, graded };
  const outPath = join(REPO_ROOT, 'data/wnba_first_slate_dump.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${outPath}`);
}

main().catch(err => {
  console.error('FATAL', err);
  process.exit(1);
}).finally(() => process.exit(0));
