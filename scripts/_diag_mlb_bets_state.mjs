// Snapshot of mlb_bets state for the last few days. Use this to verify
// that the live picks page (mlb_model_picks.json) and the Firestore
// tracked-bets are in sync — i.e. every displayed pick is a locked bet
// the grader will pick up.
//
// Run:  node scripts/_diag_mlb_bets_state.mjs [date1] [date2] ...
// e.g.  node scripts/_diag_mlb_bets_state.mjs 2026-05-07 2026-05-08

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saPath = path.join(__dirname, '..', 'serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(saPath, 'utf8'))),
});
const db = admin.firestore();

const args = process.argv.slice(2);
const dates = args.length ? args : (() => {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const today = `${yyyy}-${mm}-${dd}`;
  const y = new Date(d.getTime() - 86400000);
  const yyyy2 = y.getUTCFullYear();
  const mm2 = String(y.getUTCMonth() + 1).padStart(2, '0');
  const dd2 = String(y.getUTCDate()).padStart(2, '0');
  const yest = `${yyyy2}-${mm2}-${dd2}`;
  return [yest, today];
})();

(async () => {
  for (const date of dates) {
    console.log(`\n=== mlb_bets / date=${date} ===`);
    const snap = await db.collection('mlb_bets').where('date', '==', date).get();
    if (snap.empty) {
      console.log('  (no docs)');
      continue;
    }
    const rows = [];
    snap.forEach(d => {
      const b = d.data();
      rows.push({
        id: d.id,
        type: b.type || '-',
        isLocked: b.isLocked === true,
        status: b.status || '-',
        units: b.bet?.units ?? b.units ?? null,
        action: b.action || '-',
        side: b.bet?.side ?? b.bet?.pickCode ?? '-',
        commence: b.game?.commenceTime || '-',
        outcome: b.result?.outcome ?? '-',
      });
    });
    rows.sort((a, b) => a.id.localeCompare(b.id));
    for (const r of rows) {
      const flag =
        r.type === 'EVALUATION' && (r.units || 0) > 0 ? '  ⚠️ STUCK-EVAL-WITH-UNITS'
        : r.isLocked && r.status === 'PENDING' ? '  ✅ LOCKED-PENDING'
        : r.isLocked && r.status === 'COMPLETED' ? '  ✓ COMPLETED'
        : r.type === 'EVALUATION' ? '  · eval-only'
        : '  ?';
      console.log(`  ${r.id.padEnd(40)}  type=${(r.type || '-').padEnd(11)} locked=${String(r.isLocked).padEnd(5)} status=${(r.status || '-').padEnd(10)} units=${String(r.units).padEnd(4)} side=${(r.side || '-').padEnd(6)}${flag}`);
    }
    console.log(`  total=${rows.length}`);
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
