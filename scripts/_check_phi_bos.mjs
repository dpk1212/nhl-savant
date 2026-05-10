import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sak = join(__dirname, '..', 'serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
const db = admin.firestore();
const HC_RATIO = 1.5;
const QCUT = 30;

console.log('=== Loading wallet profiles ===');
const profiles = new Map();
const ps = await db.collection('sharpWalletProfiles').get();
ps.forEach(d => profiles.set(d.id.toLowerCase(), d.data()));
console.log(`Loaded ${profiles.size} profiles`);

for (const mkt of ['ML', 'SPREAD', 'TOTAL']) {
  console.log(`\n========== phi_bos / ${mkt} ==========`);
  const snap = await db.collection('sharp_action_positions')
    .where('date', '==', '2026-05-02')
    .where('gameKey', '==', 'phi_bos')
    .where('marketType', '==', mkt)
    .get();
  if (snap.empty) { console.log('(no positions)'); continue; }

  const rows = [];
  snap.forEach(d => {
    const p = d.data();
    const short = String(p.walletShort || p.wallet || '').slice(-6).toLowerCase();
    const profile = profiles.get(short);
    const tier = profile?.bySport?.NBA?.whitelistTier || null;
    const isWinner = profile?.bySport?.NBA?.isWinner || profile?.isNbaWinner || profile?.bySport?.NBA?.winner || false;
    const sr = p.v8_sizeRatio != null ? p.v8_sizeRatio : (p.avgSportBet > 0 ? (p.invested || 0) / p.avgSportBet : 0);
    const c = p.v8_walletContribution ?? 0;
    rows.push({ short, side: p.side, invested: p.invested, tier, sr, contrib: c, isWinner });
  });

  // Group by side
  const sides = ['away', 'home', 'over', 'under'];
  for (const side of sides) {
    const sideRows = rows.filter(r => r.side === side);
    if (!sideRows.length) continue;
    const teamLabel = side === 'away' ? '76ers' : side === 'home' ? 'Celtics' : side;
    console.log(`\n--- side=${side} (${teamLabel}) — ${sideRows.length} wallets ---`);
    sideRows.sort((a, b) => (b.invested || 0) - (a.invested || 0));
    for (const r of sideRows) {
      const tag = r.tier === 'CONFIRMED' ? '★CONFIRMED' : r.tier === 'FLAT' ? '·FLAT' : r.tier === 'WR50' ? '~WR50' : '∅none';
      const hc = r.tier === 'CONFIRMED' && r.sr >= HC_RATIO ? ' [HC×]' : '';
      const q = r.contrib >= QCUT ? '·Q' : '';
      console.log(`     ${r.short}  $${(r.invested||0).toLocaleString().padStart(8)}  sr=${r.sr.toFixed(2).padStart(5)}  contrib=${r.contrib.toFixed(1).padStart(5)}  ${tag}${hc}${q}`);
    }
  }

  // Compute consensus from each side's POV
  for (const mySide of [...new Set(rows.map(r => r.side))]) {
    let forW = 0, agW = 0, qFor = 0, qAg = 0, hcF = 0, hcA = 0;
    for (const r of rows) {
      if (r.contrib >= QCUT) {
        if (r.side === mySide) qFor++;
        else if (r.side) qAg++;
      }
      if (r.tier === 'CONFIRMED' || r.tier === 'FLAT') {
        if (r.side === mySide) forW++;
        else if (r.side) agW++;
      }
      if (r.tier === 'CONFIRMED' && r.sr >= HC_RATIO) {
        if (r.side === mySide) hcF++;
        else if (r.side) hcA++;
      }
    }
    const dw = forW - agW, dq = qFor - qAg, hcM = hcF - hcA, sum = dw + dq;
    const teamLabel = mySide === 'away' ? '76ers' : mySide === 'home' ? 'Celtics' : mySide;
    console.log(`  CONSENSUS for side=${mySide} (${teamLabel}):  dw=${dw}  dq=${dq}  Σ=${sum}  HC=${hcM}  → v7.4 floor: ${(hcM >= 1 && dw >= 0 && dq >= 0) || (dw >= 1 && dq >= 1 && sum >= 5) ? 'PASSES' : 'FAILS'}`);
  }
}

process.exit(0);
