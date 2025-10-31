/**
 * Full Model Audit Runner
 * 
 * Combines prediction accuracy testing and betting validation
 * Generates comprehensive audit report with timestamps
 * Tracks performance trends over time
 * 
 * Run with: node scripts/runFullModelAudit.js
 * Or: npm run test:full
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🏒 NHL SAVANT - FULL MODEL AUDIT');
console.log('='.repeat(70));
console.log(`\nStarted: ${new Date().toLocaleString()}\n`);

async function runFullAudit() {
  const timestamp = new Date().toISOString().split('T')[0];
  const resultsDir = join(__dirname, '..', 'testing', 'results');
  
  // Create results directory if it doesn't exist
  if (!existsSync(resultsDir)) {
    console.log('📁 Creating testing/results/ directory...\n');
    mkdirSync(resultsDir, { recursive: true });
  }
  
  const results = {
    timestamp: new Date().toISOString(),
    date: timestamp,
    accuracy: null,
    betting: null,
    summary: null
  };
  
  try {
    // Step 1: Run Prediction Accuracy Test
    console.log('='.repeat(70));
    console.log('\n🎯 STEP 1: PREDICTION ACCURACY TEST\n');
    console.log('='.repeat(70));
    
    try {
      const { stdout, stderr } = await execPromise('node scripts/test2025Accuracy.js');
      console.log(stdout);
      if (stderr) console.error(stderr);
      
      // Parse accuracy results from the generated markdown file
      const accuracyReportPath = join(__dirname, '..', 'EARLY_SEASON_2025_ACCURACY.md');
      if (existsSync(accuracyReportPath)) {
        const accuracyContent = readFileSync(accuracyReportPath, 'utf-8');
        
        // Extract key metrics using regex
        const rmseMatch = accuracyContent.match(/RMSE.*?(\d+\.\d+) goals/);
        const biasMatch = accuracyContent.match(/Average Error.*?([-+]?\d+\.\d+) goals/);
        const brierMatch = accuracyContent.match(/Brier Score.*?(\d+\.\d+)/);
        const winAccMatch = accuracyContent.match(/Win Accuracy.*?(\d+\.\d+)%/);
        const sampleMatch = accuracyContent.match(/Sample Size.*?(\d+)/);
        
        results.accuracy = {
          sampleSize: sampleMatch ? parseInt(sampleMatch[1]) : null,
          rmse: rmseMatch ? parseFloat(rmseMatch[1]) : null,
          bias: biasMatch ? parseFloat(biasMatch[1]) : null,
          brierScore: brierMatch ? parseFloat(brierMatch[1]) : null,
          winAccuracy: winAccMatch ? parseFloat(winAccMatch[1]) : null
        };
        
        console.log('\n✅ Accuracy test completed');
        console.log(`   Sample Size: ${results.accuracy.sampleSize} games`);
        console.log(`   RMSE: ${results.accuracy.rmse} goals`);
        console.log(`   Win Accuracy: ${results.accuracy.winAccuracy}%`);
      }
    } catch (error) {
      console.error('\n❌ Accuracy test failed:', error.message);
      results.accuracy = { error: error.message };
    }
    
    // Step 2: Run Betting Validation
    console.log('\n' + '='.repeat(70));
    console.log('\n🎰 STEP 2: BETTING RESULTS VALIDATION\n');
    console.log('='.repeat(70));
    
    try {
      const { stdout, stderr } = await execPromise('node scripts/validateBettingResults.js');
      console.log(stdout);
      if (stderr) console.error(stderr);
      
      // Parse betting results from the generated markdown file
      const bettingReportPath = join(__dirname, '..', 'BETTING_RESULTS_VALIDATION.md');
      if (existsSync(bettingReportPath)) {
        const bettingContent = readFileSync(bettingReportPath, 'utf-8');
        
        // Extract key metrics
        const totalBetsMatch = bettingContent.match(/Total Bets.*?(\d+)/);
        const winRateMatch = bettingContent.match(/Win Rate.*?(\d+\.?\d*)%/);
        const profitMatch = bettingContent.match(/Total Profit.*?([-+]?\d+\.?\d*) units/);
        const roiMatch = bettingContent.match(/ROI.*?([-+]?\d+\.?\d*)%/);
        
        results.betting = {
          totalBets: totalBetsMatch ? parseInt(totalBetsMatch[1]) : 0,
          winRate: winRateMatch ? parseFloat(winRateMatch[1]) : null,
          profit: profitMatch ? parseFloat(profitMatch[1]) : null,
          roi: roiMatch ? parseFloat(roiMatch[1]) : null
        };
        
        console.log('\n✅ Betting validation completed');
        console.log(`   Total Bets: ${results.betting.totalBets}`);
        console.log(`   Win Rate: ${results.betting.winRate}%`);
        console.log(`   ROI: ${results.betting.roi}%`);
      } else {
        console.log('\n⚠️  No betting results found (no completed bets in Firebase)');
        results.betting = { totalBets: 0, note: 'No completed bets found' };
      }
    } catch (error) {
      console.error('\n⚠️  Betting validation failed:', error.message);
      results.betting = { error: error.message };
    }
    
    // Step 3: Generate Summary
    console.log('\n' + '='.repeat(70));
    console.log('\n📊 AUDIT SUMMARY\n');
    console.log('='.repeat(70));
    
    const summary = {
      date: timestamp,
      accuracyGrade: null,
      bettingGrade: null,
      overallGrade: null,
      recommendations: []
    };
    
    // Grade accuracy
    if (results.accuracy && results.accuracy.rmse && results.accuracy.winAccuracy) {
      const rmse = results.accuracy.rmse;
      const winAcc = results.accuracy.winAccuracy;
      const brier = results.accuracy.brierScore;
      
      if (rmse < 2.0 && winAcc > 55 && brier < 0.23) {
        summary.accuracyGrade = 'A';
      } else if (rmse < 2.5 && winAcc > 52 && brier < 0.25) {
        summary.accuracyGrade = 'B';
      } else if (rmse < 3.0 && winAcc > 50) {
        summary.accuracyGrade = 'C';
      } else {
        summary.accuracyGrade = 'D';
      }
      
      // Add recommendations
      if (rmse >= 2.0) {
        summary.recommendations.push('Adjust calibration constant to reduce RMSE');
      }
      if (brier >= 0.23) {
        summary.recommendations.push('Adjust logistic function to improve Brier score');
      }
      if (results.accuracy.bias < -0.3) {
        summary.recommendations.push('Increase predictions - systematic under-prediction detected');
      }
      if (results.accuracy.bias > 0.3) {
        summary.recommendations.push('Decrease predictions - systematic over-prediction detected');
      }
    }
    
    // Grade betting
    if (results.betting && results.betting.totalBets > 0) {
      const roi = results.betting.roi;
      
      if (roi > 10) {
        summary.bettingGrade = 'A';
      } else if (roi > 5) {
        summary.bettingGrade = 'B';
      } else if (roi > 0) {
        summary.bettingGrade = 'C';
      } else {
        summary.bettingGrade = 'D';
      }
      
      if (roi < 0) {
        summary.recommendations.push('Model losing money - review betting strategy');
      }
    } else {
      summary.bettingGrade = 'N/A';
    }
    
    // Overall grade
    if (summary.accuracyGrade && summary.bettingGrade !== 'N/A') {
      const grades = { 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
      const avg = (grades[summary.accuracyGrade] + grades[summary.bettingGrade]) / 2;
      summary.overallGrade = Object.keys(grades).find(key => grades[key] === Math.round(avg));
    } else {
      summary.overallGrade = summary.accuracyGrade;
    }
    
    results.summary = summary;
    
    // Print summary
    console.log('\n📊 PERFORMANCE GRADES:\n');
    console.log(`  Prediction Accuracy: ${summary.accuracyGrade}`);
    if (results.accuracy) {
      console.log(`    - RMSE: ${results.accuracy.rmse} goals (target: <2.0)`);
      console.log(`    - Win Accuracy: ${results.accuracy.winAccuracy}% (target: >55%)`);
      console.log(`    - Brier Score: ${results.accuracy.brierScore} (target: <0.23)`);
    }
    
    console.log(`\n  Betting Performance: ${summary.bettingGrade}`);
    if (results.betting && results.betting.totalBets > 0) {
      console.log(`    - Total Bets: ${results.betting.totalBets}`);
      console.log(`    - Win Rate: ${results.betting.winRate}%`);
      console.log(`    - ROI: ${results.betting.roi}%`);
    } else {
      console.log(`    - No completed bets to analyze`);
    }
    
    console.log(`\n  OVERALL GRADE: ${summary.overallGrade}`);
    
    if (summary.recommendations.length > 0) {
      console.log('\n📋 RECOMMENDATIONS:\n');
      summary.recommendations.forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec}`);
      });
    } else {
      console.log('\n✅ Model performing well - no immediate changes needed');
    }
    
    // Step 4: Save results to archive
    console.log('\n' + '='.repeat(70));
    console.log('\n💾 SAVING RESULTS\n');
    
    // Save JSON summary
    const jsonPath = join(resultsDir, `audit_${timestamp}.json`);
    writeFileSync(jsonPath, JSON.stringify(results, null, 2));
    console.log(`✅ Saved JSON: testing/results/audit_${timestamp}.json`);
    
    // Copy markdown reports
    const accuracyReportPath = join(__dirname, '..', 'EARLY_SEASON_2025_ACCURACY.md');
    if (existsSync(accuracyReportPath)) {
      const destPath = join(resultsDir, `accuracy_${timestamp}.md`);
      const content = readFileSync(accuracyReportPath, 'utf-8');
      writeFileSync(destPath, content);
      console.log(`✅ Saved accuracy report: testing/results/accuracy_${timestamp}.md`);
    }
    
    const bettingReportPath = join(__dirname, '..', 'BETTING_RESULTS_VALIDATION.md');
    if (existsSync(bettingReportPath)) {
      const destPath = join(resultsDir, `betting_${timestamp}.md`);
      const content = readFileSync(bettingReportPath, 'utf-8');
      writeFileSync(destPath, content);
      console.log(`✅ Saved betting report: testing/results/betting_${timestamp}.md`);
    }
    
    // Compare to previous audit (if exists)
    const allAudits = [];
    try {
      const files = require('fs').readdirSync(resultsDir);
      files.filter(f => f.startsWith('audit_') && f.endsWith('.json'))
        .forEach(file => {
          try {
            const content = readFileSync(join(resultsDir, file), 'utf-8');
            allAudits.push(JSON.parse(content));
          } catch (e) {}
        });
      
      if (allAudits.length >= 2) {
        // Sort by date
        allAudits.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const prev = allAudits[allAudits.length - 2];
        const curr = allAudits[allAudits.length - 1];
        
        console.log('\n' + '='.repeat(70));
        console.log('\n📈 TREND ANALYSIS (vs previous audit)\n');
        
        if (prev.accuracy && curr.accuracy) {
          const rmseDelta = curr.accuracy.rmse - prev.accuracy.rmse;
          const winAccDelta = curr.accuracy.winAccuracy - prev.accuracy.winAccuracy;
          
          console.log('  Accuracy Changes:');
          console.log(`    RMSE: ${rmseDelta > 0 ? '+' : ''}${rmseDelta.toFixed(3)} goals ${rmseDelta < 0 ? '✅' : '⚠️'}`);
          console.log(`    Win Accuracy: ${winAccDelta > 0 ? '+' : ''}${winAccDelta.toFixed(1)}% ${winAccDelta > 0 ? '✅' : '⚠️'}`);
        }
        
        if (prev.betting && curr.betting && curr.betting.totalBets > 0) {
          const roiDelta = curr.betting.roi - prev.betting.roi;
          console.log('\n  Betting Changes:');
          console.log(`    ROI: ${roiDelta > 0 ? '+' : ''}${roiDelta.toFixed(1)}% ${roiDelta > 0 ? '✅' : '⚠️'}`);
        }
      }
    } catch (e) {
      // No previous audits or error reading them
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('\n✅ FULL AUDIT COMPLETE\n');
    console.log(`Finished: ${new Date().toLocaleString()}`);
    console.log('\n📄 View master audit report: MODEL_ACCURACY_AUDIT_2025-10-31.md\n');
    
  } catch (error) {
    console.error('\n❌ Audit failed:', error);
    console.error(error.stack);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runFullAudit()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { runFullAudit };

