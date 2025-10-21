// Check actual team xG ranges
import Papa from 'papaparse';
import fs from 'fs';

const teamsCSV = fs.readFileSync('backtesting/data/teams_2024.csv', 'utf-8');
const teamsParsed = Papa.parse(teamsCSV, { header: true, dynamicTyping: true });
const teams5v5 = teamsParsed.data.filter(t => t.situation === '5on5');

const stats = teams5v5.map(t => ({
  team: t.team,
  xGF: t.xGF_per60,
  xGA: t.xGA_per60,
  scoreAdj_xGF: t.scoreAdj_xGF_per60,
  scoreAdj_xGA: t.scoreAdj_xGA_per60
})).filter(t => t.xGF > 0);

// Sort by xGF
stats.sort((a, b) => b.xGF - a.xGF);

console.log('\n🏒 Top 5 Offenses (xGF/60):');
stats.slice(0, 5).forEach(t => {
  console.log(`${t.team}: ${t.xGF.toFixed(2)} (score-adj: ${t.scoreAdj_xGF.toFixed(2)})`);
});

console.log('\n🏒 Bottom 5 Offenses (xGF/60):');
stats.slice(-5).forEach(t => {
  console.log(`${t.team}: ${t.xGF.toFixed(2)} (score-adj: ${t.scoreAdj_xGF.toFixed(2)})`);
});

const xGF_values = stats.map(t => t.xGF);
const min_xGF = Math.min(...xGF_values);
const max_xGF = Math.max(...xGF_values);
const avg_xGF = xGF_values.reduce((a, b) => a + b) / xGF_values.length;

console.log(`\n📊 xGF Range: ${min_xGF.toFixed(2)} to ${max_xGF.toFixed(2)}`);
console.log(`   Average: ${avg_xGF.toFixed(2)}`);
console.log(`   Spread: ${((max_xGF - min_xGF) / avg_xGF * 100).toFixed(1)}%`);

// Check strength ratios
console.log(`\n📊 Strength Ratios (xGF / avg):`);
console.log(`   Best: ${(max_xGF / avg_xGF).toFixed(3)}`);
console.log(`   Worst: ${(min_xGF / avg_xGF).toFixed(3)}`);
console.log(`   Range: ${((max_xGF / avg_xGF) - (min_xGF / avg_xGF)).toFixed(3)}`);

