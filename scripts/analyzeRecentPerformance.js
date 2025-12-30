import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🏒 NHL MODEL PERFORMANCE ANALYSIS');
console.log('='.repeat(70));

// Load completed picks
const csvPath = join(__dirname, '../public/data/nhl-picks-completed.csv');
const csvData = readFileSync(csvPath, 'utf8');
const lines = csvData.split('\n').filter(line => line.trim());
const header = lines[0];
const rows = lines.slice(1).map(line => {
  const [date, team, opponent, odds, grade, ev, units, result, profit] = line.split(',');
  return {
    date,
    team,
    opponent,
    odds: parseFloat(odds),
    grade,
    ev: parseFloat(ev?.replace('%', '')) || 0,
    units: parseFloat(units) || 1.0,
    result,
    profit: parseFloat(profit?.replace('u', '')) || 0
  };
});

console.log(`\n📊 TOTAL PICKS IN DATABASE: ${rows.length}`);

// Get date 3 weeks ago
const threeWeeksAgo = new Date();
threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
const threeWeeksAgoStr = threeWeeksAgo.toISOString().split('T')[0];

const recentPicks = rows.filter(r => r.date >= threeWeeksAgoStr && r.result !== 'N/A' && r.result);

console.log(`\n📅 LAST 3 WEEKS (since ${threeWeeksAgoStr}): ${recentPicks.length} picks`);

if (recentPicks.length === 0) {
  console.log('\n⚠️  No picks found in last 3 weeks with results!');
  process.exit(0);
}

// Overall stats
const wins = recentPicks.filter(p => p.result === 'WIN').length;
const losses = recentPicks.filter(p => p.result === 'LOSS').length;
const pushes = recentPicks.filter(p => p.result === 'PUSH').length;
const winRate = (wins / (wins + losses) * 100).toFixed(1);
const totalProfit = recentPicks.reduce((sum, p) => sum + p.profit, 0);
const totalUnitsRisked = recentPicks.reduce((sum, p) => sum + Math.abs(p.profit), 0);
const roi = (totalProfit / totalUnitsRisked * 100).toFixed(1);

console.log('\n' + '='.repeat(70));
console.log('📈 OVERALL PERFORMANCE (Last 3 Weeks)');
console.log('='.repeat(70));
console.log(`Win Rate: ${wins}W-${losses}L-${pushes}P (${winRate}%)`);
console.log(`Total Profit: ${totalProfit.toFixed(2)}u`);
console.log(`Units Risked: ${totalUnitsRisked.toFixed(2)}u`);
console.log(`ROI: ${roi}%`);
console.log(`Avg EV: ${(recentPicks.reduce((s, p) => s + p.ev, 0) / recentPicks.length).toFixed(1)}%`);

// By grade
console.log('\n' + '='.repeat(70));
console.log('📊 PERFORMANCE BY GRADE');
console.log('='.repeat(70));

const grades = ['A+', 'A', 'B+', 'B', 'C'];
grades.forEach(grade => {
  const picks = recentPicks.filter(p => p.grade === grade);
  if (picks.length === 0) return;
  
  const w = picks.filter(p => p.result === 'WIN').length;
  const l = picks.filter(p => p.result === 'LOSS').length;
  const wr = (w / (w + l) * 100).toFixed(1);
  const profit = picks.reduce((sum, p) => sum + p.profit, 0);
  const avgEv = (picks.reduce((s, p) => s + p.ev, 0) / picks.length).toFixed(1);
  
  console.log(`${grade}: ${w}W-${l}L (${wr}%) | Profit: ${profit.toFixed(2)}u | Avg EV: ${avgEv}%`);
});

// By EV bucket
console.log('\n' + '='.repeat(70));
console.log('📊 PERFORMANCE BY EDGE SIZE');
console.log('='.repeat(70));

const evBuckets = [
  { name: '0-3%', min: 0, max: 3 },
  { name: '3-5%', min: 3, max: 5 },
  { name: '5-8%', min: 5, max: 8 },
  { name: '8-12%', min: 8, max: 12 },
  { name: '12%+', min: 12, max: 100 }
];

evBuckets.forEach(bucket => {
  const picks = recentPicks.filter(p => p.ev >= bucket.min && p.ev < bucket.max);
  if (picks.length === 0) return;
  
  const w = picks.filter(p => p.result === 'WIN').length;
  const l = picks.filter(p => p.result === 'LOSS').length;
  const wr = (w / (w + l) * 100).toFixed(1);
  const profit = picks.reduce((sum, p) => sum + p.profit, 0);
  
  console.log(`${bucket.name}: ${w}W-${l}L (${wr}%) | Profit: ${profit.toFixed(2)}u | Count: ${picks.length}`);
});

// Favorites vs Underdogs
console.log('\n' + '='.repeat(70));
console.log('📊 FAVORITES vs UNDERDOGS');
console.log('='.repeat(70));

const favorites = recentPicks.filter(p => p.odds < 0);
const underdogs = recentPicks.filter(p => p.odds > 0);

const favWins = favorites.filter(p => p.result === 'WIN').length;
const favLosses = favorites.filter(p => p.result === 'LOSS').length;
const favWinRate = (favWins / (favWins + favLosses) * 100).toFixed(1);
const favProfit = favorites.reduce((sum, p) => sum + p.profit, 0);

const dogWins = underdogs.filter(p => p.result === 'WIN').length;
const dogLosses = underdogs.filter(p => p.result === 'LOSS').length;
const dogWinRate = (dogWins / (dogWins + dogLosses) * 100).toFixed(1);
const dogProfit = underdogs.reduce((sum, p) => sum + p.profit, 0);

console.log(`Favorites (<0): ${favWins}W-${favLosses}L (${favWinRate}%) | Profit: ${favProfit.toFixed(2)}u`);
console.log(`Underdogs (>0): ${dogWins}W-${dogLosses}L (${dogWinRate}%) | Profit: ${dogProfit.toFixed(2)}u`);

// Weekly breakdown
console.log('\n' + '='.repeat(70));
console.log('📊 WEEK-BY-WEEK BREAKDOWN');
console.log('='.repeat(70));

const weeks = [
  { name: 'Week 1 (Most Recent)', days: 7 },
  { name: 'Week 2', days: 14 },
  { name: 'Week 3', days: 21 }
];

weeks.forEach((week, idx) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - week.days);
  const endDate = idx === 0 ? new Date() : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const weekPicks = recentPicks.filter(p => {
    const pickDate = new Date(p.date);
    return pickDate >= startDate && pickDate < endDate;
  });
  
  if (weekPicks.length === 0) return;
  
  const w = weekPicks.filter(p => p.result === 'WIN').length;
  const l = weekPicks.filter(p => p.result === 'LOSS').length;
  const wr = (w / (w + l) * 100).toFixed(1);
  const profit = weekPicks.reduce((sum, p) => sum + p.profit, 0);
  
  console.log(`${week.name}: ${w}W-${l}L (${wr}%) | Profit: ${profit.toFixed(2)}u | Picks: ${weekPicks.length}`);
});

// Biggest losers
console.log('\n' + '='.repeat(70));
console.log('💸 WORST LOSSES (Last 3 Weeks)');
console.log('='.repeat(70));

const losses_sorted = recentPicks
  .filter(p => p.result === 'LOSS')
  .sort((a, b) => a.profit - b.profit)
  .slice(0, 10);

losses_sorted.forEach((pick, i) => {
  console.log(`${i+1}. ${pick.date} | ${pick.team} ${pick.odds > 0 ? '+' : ''}${pick.odds} | ${pick.grade} (${pick.ev.toFixed(1)}% EV) | Loss: ${pick.profit.toFixed(2)}u`);
});

// Key insights
console.log('\n' + '='.repeat(70));
console.log('🔍 KEY INSIGHTS');
console.log('='.repeat(70));

if (parseFloat(roi) < 0) {
  console.log('⚠️  NEGATIVE ROI - Model is losing money');
}
if (parseFloat(winRate) < 52) {
  console.log('⚠️  Win rate below 52% - Not beating the vig');
}
if (favProfit < dogProfit) {
  console.log('📊 Underdogs outperforming favorites - Possible market inefficiency');
}
if (favWinRate < 60) {
  console.log('⚠️  Favorites winning less than expected - Model may be overconfident');
}

const lowEdgePicks = recentPicks.filter(p => p.ev < 5);
const lowEdgeProfit = lowEdgePicks.reduce((sum, p) => sum + p.profit, 0);
if (lowEdgeProfit < 0) {
  console.log(`⚠️  Low edge picks (< 5% EV) are LOSING ${lowEdgeProfit.toFixed(2)}u - Consider raising threshold`);
}

console.log('\n' + '='.repeat(70));
console.log('✅ Analysis complete!');
console.log('='.repeat(70) + '\n');

