/**
 * Generate Expert Analysis - GitHub Action Script
 * 
 * PURPOSE:
 * - Runs daily at 9 AM ET (before games)
 * - Fetches today's NHL games
 * - Generates AI analysis for each matchup using Perplexity API
 * - Caches results in Firebase for instant page loads
 * 
 * USAGE:
 * - Scheduled: GitHub Actions runs automatically daily
 * - Manual: npm run generate-analysis
 * - Local: node scripts/generateExpertAnalysis.js
 * 
 * REQUIREMENTS:
 * - PERPLEXITY_API_KEY environment variable
 * - Firebase credentials (VITE_FIREBASE_*)
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
// Note: fetch is built-in to Node.js 18+, no import needed

// Import date utilities for ET timezone handling
import { getETDate, formatDateForSchedule, logDateDebug } from '../src/utils/dateUtils.js';

// Note: Import edge calculator and data processor only when needed
// (dynamically imported in loadOddsAndCalculateEdges function)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK (bypasses security rules, better for server-side)
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

// Validate credentials before initializing
if (!serviceAccount.project_id) {
  console.error('❌ VITE_FIREBASE_PROJECT_ID environment variable not set');
  process.exit(1);
}
if (!serviceAccount.client_email) {
  console.error('❌ FIREBASE_CLIENT_EMAIL environment variable not set');
  process.exit(1);
}
if (!serviceAccount.private_key) {
  console.error('❌ FIREBASE_PRIVATE_KEY environment variable not set');
  process.exit(1);
}

console.log(`✅ Service account loaded: ${serviceAccount.client_email}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Get Perplexity API key from environment variable (GitHub Secret)
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

if (!PERPLEXITY_API_KEY) {
  console.error('❌ PERPLEXITY_API_KEY environment variable not set');
  console.error('ℹ️ Add PERPLEXITY_API_KEY as a GitHub Secret');
  process.exit(1);
}

/**
 * Team name mapping (from ScheduleHelper - KEEP IN SYNC)
 */
const TEAM_NAME_TO_CODE = {
  'Anaheim Ducks': 'ANA',
  'Boston Bruins': 'BOS',
  'Buffalo Sabres': 'BUF',
  'Calgary Flames': 'CGY',
  'Carolina Hurricanes': 'CAR',
  'Chicago Blackhawks': 'CHI',
  'Colorado Avalanche': 'COL',
  'Columbus Blue Jackets': 'CBJ',
  'Dallas Stars': 'DAL',
  'Detroit Red Wings': 'DET',
  'Edmonton Oilers': 'EDM',
  'Florida Panthers': 'FLA',
  'Los Angeles Kings': 'LAK',
  'Minnesota Wild': 'MIN',
  'Montreal Canadiens': 'MTL',
  'Nashville Predators': 'NSH',
  'New Jersey Devils': 'NJD',
  'New York Islanders': 'NYI',
  'New York Rangers': 'NYR',
  'Ottawa Senators': 'OTT',
  'Philadelphia Flyers': 'PHI',
  'Pittsburgh Penguins': 'PIT',
  'San Jose Sharks': 'SJS',
  'Seattle Kraken': 'SEA',
  'St. Louis Blues': 'STL',
  'Tampa Bay Lightning': 'TBL',
  'Toronto Maple Leafs': 'TOR',
  'Utah Mammoth': 'UTA',
  'Vancouver Canucks': 'VAN',
  'Vegas Golden Knights': 'VGK',
  'Washington Capitals': 'WSH',
  'Winnipeg Jets': 'WPG'
};

/**
 * Get today's NHL games from schedule (SAME AS APP.JSX)
 * Uses nhl-202526-asplayed.csv with columns: Date, Visitor, Home
 * 
 * CRITICAL FIX: Uses ET timezone to match client-side date calculations
 */
function getTodaysGames() {
  try {
    // SAME FILE AS PRODUCTION APP
    const schedulePath = join(__dirname, '../public/nhl-202526-asplayed.csv');
    const scheduleData = readFileSync(schedulePath, 'utf-8');
    const lines = scheduleData.trim().split('\n');
    
    // CSV Format: Date,Start Time (Sask),Start Time (ET),Visitor,Score,Home,Score,Status
    // CRITICAL FIX: Use ET date instead of local/UTC date
    const todayStr = formatDateForSchedule(); // Returns "M/D/YYYY" in ET
    
    // Log for debugging timezone issues
    const { utcDate, etDate } = logDateDebug('GitHub Action - getTodaysGames');
    console.log(`🔍 Looking for games on: ${todayStr} (ET)`);
    
    const games = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      const values = line.split(',');
      const gameDate = values[0]?.trim();
      const visitorName = values[3]?.trim(); // Full name like "Toronto Maple Leafs"
      const homeName = values[5]?.trim(); // Full name like "Columbus Blue Jackets"
      
      if (gameDate === todayStr && visitorName && homeName) {
        // Convert full names to team codes (SAME AS PRODUCTION)
        const awayTeam = TEAM_NAME_TO_CODE[visitorName];
        const homeTeam = TEAM_NAME_TO_CODE[homeName];
        
        if (awayTeam && homeTeam) {
          games.push({
            awayTeam,
            homeTeam,
            date: todayStr
          });
          console.log(`   ✓ Found: ${awayTeam} @ ${homeTeam}`);
        } else {
          console.warn(`   ⚠️ Could not map teams: ${visitorName} vs ${homeName}`);
        }
      }
    }
    
    if (games.length === 0) {
      console.warn(`⚠️ No games found for ${todayStr}`);
      console.log(`   This could be normal (off day) or a timezone issue.`);
      console.log(`   UTC date: ${utcDate}, ET date: ${etDate}`);
    }
    
    return games;
  } catch (error) {
    console.error('❌ Error reading schedule:', error);
    return [];
  }
}

/**
 * Generate analysis using Perplexity API
 */
async function generateAnalysis(awayTeam, homeTeam, apiKey) {
  const prompt = `You are NHL Savant's in-the-trenches hockey sharp writing hot, human, no-BS takes for tonight's ${awayTeam} @ ${homeTeam} game.

⭐️⭐️⭐️ WRITE LIKE THIS: ⭐️⭐️⭐️
- Sound like a real, passionate hockey fan texting a friend after seeing today's lines
- Use language actual fans use: "here's what jumps out," "look, nobody else is talking about this," "honestly, this makes zero sense to me"
- Drop the analyst mask—be opinionated, honest, even a little raw. (Short sentences, contractions, direct and occasionally spicy.)
- Add natural emotional touches: "that made me yell at my TV," "I've been burned by this team before, but this spot..."
- Zero robotic phrases, zero $10 words, never write like you're on a panel or TV broadcast—you're an actual bettor talking shop.

🚫 HARD RULES - ZERO CORPORATE PHRASES:
- Don't use "leverage," "framework," "optimized," "statistically significant," or "expected value proposition" EVER.
- Don't repeat safe, generic cliches ("both teams want to win," "defense wins championships").
- Don't say "recent metrics suggest"—just say exactly what you see, how you'd say it.

🚨 STRUCTURE:
Return JSON in this format:
[
  {
    "hook": "Bold, punchy opener a real fan would yell in a group chat. No stats unless you can verify. Needs to grab attention.",
    "headline": "5-7 word ultra-casual, scroll-stopping headline (no buzzwords, all attitude)",
    "analysis": "2-3 paragraphs of real-talk analysis. Mix confidence with humility. Use verified insights only—if you're at all unsure, call it out. Don't be afraid to admit 'this is more gut than data' when appropriate. Point out weird market moves, goalie drama, lines that feel off. Embrace honest uncertainty.",
    "bettingAngle": "If there's a sharp, contrarian, or actionable angle, spell it out in plain English—like you're texting a betting friend, not pitching a crowd. If not, say so honestly ('I'll watch, I'm not playing it'). Never sell, always just talk value."
  }
]

🔥 HOW TO BE HUMAN:
- Start with a take, not a summary.
- Reference emotion—nervous, hyped, skeptical, burned by this matchup before, etc.
- Be willing to risk being wrong ("could look like an idiot, but…").
- Use everyday metaphors: "they play like a housecat chasing a laser pointer"; "this line smells off."
- Sign off with your real point of view, not a corporate conclusion.

📣 ANTI-HALLUCINATION GOLDEN RULES:
- NEVER make up player stats, injury info, goalie news, or recent results.
- NEVER cite records, streaks, or market moves that aren't from today's news (unless you can confirm).
- VERIFIABLE ONLY: If you can't verify, use general team trends or say "not totally sure, but I'm watching for X."

💡 IF INFO ISN'T VERIFIED—ADMIT IT!
- "I *think* they're starting Saros, but waiting for confirmation."
- "Honestly, I can't figure out why this line is so high. Maybe something behind the scenes?"

EXAMPLES OF HUMAN OPENERS:
- "Is it just me, or are these odds nuts?"
- "Here's what nobody's talking about: ___"
- "Honestly, I can't believe this line isn't getting hammered."

EXAMPLES OF BAD OPENERS:
- "The St. Louis Blues arrive at Madison Square Garden with a 57% implied win probability." // Too formal, might be hallucinated
- "Both teams are trending upward and have strong special teams." // Generic, boring, and could apply to anyone

❌ Absolutely forbid:
- Making up statistical data of any kind
- Fake source citations
- Safe, boring analysis

✅ Instead:
- Talk like a real sharp who wants to HELP not sell
- If you have an edge, explain it like you're tipping off a friend

Be bold. Be honest. Be HUMAN. And seriously, if you can't verify it, don't write it.`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a real hockey sharp texting a betting friend—passionate, honest, raw, and human. Drop the corporate analyst voice completely. Use short sentences, contractions, everyday language, emotion, and even admit uncertainty when you feel it. Be willing to risk being wrong. NEVER use buzzwords like "leverage" or "framework." 🚨 ZERO TOLERANCE FOR HALLUCINATION: Never make up stats, injury info, goalie news, records, streaks, or any data you cannot verify RIGHT NOW. If unsure, say so honestly ("I think X but waiting for confirmation"). Return ONLY valid JSON arrays with no markdown. Be bold, be human, never fabricate data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '[]';
    
    console.log(`📥 Raw Perplexity response (first 500 chars):`, content.substring(0, 500));
    
    // Clean markdown formatting
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // CRITICAL FIX: Unescape quotes that Perplexity sometimes adds
    // Replace \" with " but only within JSON values, not the structure
    content = content.replace(/\\"/g, '"');
    
    // Also handle escaped backslashes
    content = content.replace(/\\\\/g, '\\');
    
    console.log(`🔧 Cleaned content (first 500 chars):`, content.substring(0, 500));
    
    let cards;
    try {
      cards = JSON.parse(content);
      if (!Array.isArray(cards)) {
        throw new Error('Response is not an array');
      }
      cards = cards.slice(0, 4); // Max 4 cards
      console.log(`✅ Parsed ${cards.length} cards from Perplexity`);
      
      // VALIDATE each card has required fields for new structure
      cards = cards.map((card, idx) => {
        if (!card || typeof card !== 'object') {
          throw new Error(`Card ${idx} is not an object: ${typeof card}`);
        }
        
        // Validate and structure the new format
        return {
          hook: String(card.hook || ''),
          headline: String(card.headline || ''),
          analysis: String(card.analysis || ''),
          bettingAngle: String(card.bettingAngle || '')
        };
      });
      
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', content);
      throw parseError;
    }

    return cards;
  } catch (error) {
    console.error(`❌ Error generating analysis for ${awayTeam} @ ${homeTeam}:`, error.message);
    return null;
  }
}

/**
 * Cache analysis in Firebase
 * 
 * CRITICAL FIX: Uses ET timezone for cache keys to match client-side lookups
 */
async function cacheAnalysis(awayTeam, homeTeam, cards) {
  // VALIDATE INPUT DATA
  if (!awayTeam || !homeTeam) {
    console.error('❌ Invalid team names:', { awayTeam, homeTeam });
    throw new Error('Team names cannot be empty');
  }
  
  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    console.error('❌ Invalid cards data:', { cards });
    throw new Error('Cards must be a non-empty array');
  }
  
  // CRITICAL FIX: Use ET date instead of UTC date
  // This ensures cache keys match client-side lookups (which also use ET)
  const etDate = getETDate();
  const cacheKey = `${awayTeam}-${homeTeam}-${etDate}`;
  const cacheRef = db.collection('perplexityCache').doc(cacheKey);
  
  // Log for debugging
  const utcDate = new Date().toISOString().split('T')[0];
  console.log(`📝 Cache key: ${cacheKey}`);
  if (utcDate !== etDate) {
    console.log(`   ⚠️ UTC date (${utcDate}) differs from ET date (${etDate})`);
  }
  
  // VALIDATE DOCUMENT ID
  if (cacheKey.includes('/') || cacheKey.startsWith('.') || cacheKey.startsWith('__')) {
    console.error('❌ Invalid document ID:', cacheKey);
    throw new Error('Invalid document ID format');
  }

  try {
    // Prepare data object with validation
    const dataToWrite = {
      content: JSON.stringify(cards),
      timestamp: Date.now(),
      awayTeam: String(awayTeam),
      homeTeam: String(homeTeam),
      generatedBy: 'github-action'
    };
    
    console.log(`💾 Writing to Firebase: ${cacheKey}`);
    console.log(`   Data size: ${dataToWrite.content.length} characters`);
    console.log(`   Content preview: ${dataToWrite.content.substring(0, 200)}...`);
    
    // VALIDATE: Check for undefined or null values
    for (const [key, value] of Object.entries(dataToWrite)) {
      if (value === undefined) {
        throw new Error(`Field '${key}' is undefined`);
      }
      if (value === null) {
        throw new Error(`Field '${key}' is null`);
      }
    }
    
    await cacheRef.set(dataToWrite);
    console.log(`✅ Cached analysis for ${awayTeam} @ ${homeTeam}`);
  } catch (error) {
    console.error(`❌ Failed to cache analysis for ${awayTeam} @ ${homeTeam}:`);
    console.error(`   Error code: ${error.code}`);
    console.error(`   Error message: ${error.message}`);
    console.error(`   Document ID: ${cacheKey}`);
    if (error.stack) {
      console.error(`   Stack trace:`, error.stack);
    }
    throw error; // Re-throw to stop execution
  }
}

/**
 * Generate bet hook (1-2 sentences affirming our model's pick)
 */
async function generateBetHook(game, bestEdge, factors, apiKey) {
  if (!bestEdge || !factors || factors.length === 0) {
    console.log(`⚠️ No edge data available for bet hook`);
    return null;
  }

  // Format pick description (MONEYLINE ONLY)
  const pickDesc = `${bestEdge.team} ML`;

  // Format top factors - EXCLUDE the last bullet (EV summary) to avoid any number confusion
  // Focus on qualitative factors only (offensive/defensive/special teams edges)
  const topFactors = factors.slice(0, -1).slice(0, 3).join('\n');

  console.log(`   📝 Generating qualitative bet hook (no numbers, factors only)`);

  const prompt = `GAME: ${game.awayTeam} @ ${game.homeTeam}

🎯 WE ARE BETTING ON: ${bestEdge.team} (${bestEdge.team === game.awayTeam ? 'AWAY' : 'HOME'})
OUR MODEL'S PICK: ${pickDesc} at ${bestEdge.odds > 0 ? '+' : ''}${bestEdge.odds}

KEY FACTORS WHY ${bestEdge.team} HAS VALUE:
${topFactors}

⭐️⭐️⭐️ WRITE LIKE A REAL BETTOR TALKING TO A FRIEND: ⭐️⭐️⭐️
- Sound like a passionate hockey sharp texting after seeing this line
- Use language actual bettors use: "here's what jumps out," "look, the market's missing this," "honestly, this value is nuts"
- Drop the analyst voice—be opinionated, honest, even a little raw
- Short sentences. Contractions. Direct and occasionally spicy.
- Be willing to risk being wrong: "could backfire, but..." "I know this sounds crazy, but..."

🚫 BANNED PHRASES:
- Don't use "leverage," "framework," "optimized," "expected value proposition"
- Don't say "recent metrics suggest"—just say what you see
- Zero corporate-speak. Zero robotic analysis.

🚨 CRITICAL - YOU MUST EXPLAIN WHY ${bestEdge.team} IS THE PLAY:
- Your hook must be about why ${bestEdge.team} has betting value
- DO NOT write about why ${bestEdge.team === game.awayTeam ? game.homeTeam : game.awayTeam} is better
- The factors above explain ${bestEdge.team}'s edge - use them!

INSTRUCTIONS:
Write 1-2 compelling sentences (30-50 words) that hook the reader with WHY ${bestEdge.team} has value. Lead with emotion and the mispricing. Sound like you're tipping off a friend, not writing a report.

📣 ANTI-HALLUCINATION GOLDEN RULES:
- ONLY discuss the factors explicitly provided above
- DO NOT mention percentage numbers, EV%, win probabilities, or any stats
- DO NOT add player names, team records, recent games, injuries, or ANY data not in the factors
- If info isn't in the factors, don't write it

🔥 CRITICAL - MIX UP YOUR OPENINGS:
- DO NOT start every hook with "Look" or any repeated phrase
- Vary your approach: sometimes start with the team, sometimes the value, sometimes emotion
- Each hook should feel fresh and different from the last

Examples (notice the VARIETY in openings):
✓ "The market's sleeping on Vegas's control edge here—they're getting slighted and I'm all over it at -135."
✓ "Honestly, this line makes zero sense to me. Florida's defensive setup gets torched by teams like this."
✓ "Vegas at home? With their play control advantage? Yeah, I'm backing VGK straight up."
✓ "I know it sounds crazy, but Florida's the kind of team that gets pushed around by Vegas's style."
✓ "Here's what jumps out: the market's pricing this like Florida has a chance to control play. They don't."

Return plain text only (no markdown, no JSON, no bold/italic).`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a real hockey bettor texting a friend after seeing a line you love—passionate, honest, raw, and human. Drop the analyst voice completely. Use short sentences, contractions, everyday language, emotion. Be willing to risk being wrong. Admit if it\'s more gut than data. NEVER use buzzwords like "leverage" or "framework." 🔥 CRITICAL - VARY YOUR STYLE: DO NOT start every hook with "Look" or any repeated phrase. Mix up your openings—sometimes lead with the team, sometimes the value, sometimes emotion. Real bettors don\'t all talk the same way. 🚨 You MUST explain why the SPECIFIC TEAM mentioned in "WE ARE BETTING ON" has value. DO NOT write about the wrong team. 🚨 ZERO TOLERANCE FOR HALLUCINATION: ONLY discuss factors explicitly provided. DO NOT mention percentages, probabilities, player names, team records, injuries, recent games, or ANY data not in the factors. If unsure, say so honestly ("I think X but..."). Sound like a real bettor with a unique voice, not a template.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Clean up any markdown or extra formatting
    const cleaned = content.replace(/```/g, '').replace(/\*\*/g, '').trim();
    
    console.log(`✅ Generated bet hook - qualitative only (${cleaned.length} chars)`);
    return cleaned;
  } catch (error) {
    console.error(`❌ Error generating bet hook:`, error.message);
    return null;
  }
}

/**
 * Generate full story (2 paragraphs, 150-200 words, premium tone)
 */
async function generateFullStory(game, bestEdge, altBet, factors, altFactors, apiKey) {
  if (!bestEdge || !factors || factors.length === 0) {
    console.log(`⚠️ No edge data available for full story`);
    return null;
  }

  // Format primary bet (MONEYLINE ONLY)
  const primaryPick = `${bestEdge.team} ML`;

  // Format factors - EXCLUDE the last bullet (EV summary) since it has actual percentages
  // We'll inject those ourselves via placeholders
  const primaryFactors = factors.slice(0, -1).slice(0, 5).map(f => `  ${f}`).join('\n');

  // Format alternative bet (MONEYLINE ONLY)
  let altSection = '';
  if (altBet && altFactors && altFactors.length > 0) {
    const altPick = `${altBet.team} ML`;
    // EXCLUDE the last bullet (EV summary) from alt factors too
    const altFactorList = altFactors.slice(0, -1).slice(0, 5).map(f => `  ${f}`).join('\n');

    altSection = `
ALTERNATIVE BET: ${altPick} at ${altBet.odds > 0 ? '+' : ''}${altBet.odds}
Supporting factors:
${altFactorList}`;
  }

  console.log(`   📝 Generating qualitative full story (no numbers, factors only)`);

  const prompt = `GAME: ${game.awayTeam} @ ${game.homeTeam}

🎯 WE ARE BETTING ON: ${bestEdge.team} (${bestEdge.team === game.awayTeam ? 'AWAY' : 'HOME'})
PRIMARY BET: ${primaryPick} at ${bestEdge.odds > 0 ? '+' : ''}${bestEdge.odds}

KEY FACTORS WHY ${bestEdge.team} HAS VALUE:
${primaryFactors}${altSection}

⭐️⭐️⭐️ WRITE LIKE A REAL SHARP TALKING SHOP: ⭐️⭐️⭐️
- Sound like a passionate hockey bettor explaining why you're on this play
- Use language actual bettors use: "here's the thing," "look, the market's missing," "honestly, I'm all over this"
- Drop the analyst mask—be opinionated, honest, even a little raw
- Short sentences. Contractions. Direct and occasionally spicy.
- Add natural emotional touches: "I've been burned by this team before, but this spot..." "that makes me confident here"
- Zero robotic phrases, zero $10 words

🚫 BANNED PHRASES:
- Don't use "leverage," "framework," "optimized," "statistically significant," "expected value proposition" EVER
- Don't say "recent metrics suggest"—just say exactly what you see
- No safe, generic cliches like "both teams want to win"

🚨 CRITICAL - YOU MUST EXPLAIN WHY ${bestEdge.team} IS THE PLAY:
- Your entire analysis must be about why ${bestEdge.team} has betting value
- DO NOT write about why ${bestEdge.team === game.awayTeam ? game.homeTeam : game.awayTeam} is the better team
- DO NOT analyze the matchup generically - explain specifically why ${bestEdge.team} creates value
- If you write about the wrong team, this narrative is useless
- The factors above explain ${bestEdge.team}'s advantages - use them!

INSTRUCTIONS:
Write EXACTLY 2 paragraphs (150-200 words total) explaining why ${bestEdge.team} is the play:

PARAGRAPH 1 (~80-100 words): Lead with THE EDGE for ${bestEdge.team} in real-talk language. Explain why you're on ${bestEdge.team} and what the market's missing. Mix confidence with honesty—if it's partly gut, say so. Use everyday metaphors. Reference emotion when appropriate ("this makes me nervous but..." or "honestly, I love this spot"). Be contrarian but sound like a real person.

PARAGRAPH 2 (~70-100 words): Supporting context about ${bestEdge.team}'s advantages. ${altBet ? 'Mention the alternative bet angle.' : 'Add supporting dynamics.'} End with your conviction about ${bestEdge.team}'s value - but keep it conversational, like you're texting a friend. Be willing to risk being wrong ("could backfire, but I'm rolling with it").

TONE: Real bettor talking to another bettor over drinks, NOT a corporate report. Natural language, contractions, casual phrases, emotion.

📣 ANTI-HALLUCINATION GOLDEN RULES:
- ONLY discuss the factors explicitly provided above
- DO NOT mention percentage numbers, EV%, win probabilities, or any stats
- DO NOT add player names, team records, recent games, injuries, or ANY data not in the factors
- If info isn't verified, admit it: "I *think* X, but waiting for confirmation"

🔥 CRITICAL - VARY YOUR OPENINGS & STYLE:
- DO NOT start every paragraph with "Look" or any repeated phrase
- Mix up your approach: sometimes lead with the team, sometimes the value, sometimes emotion, sometimes a question
- Each story should feel unique and fresh
- Real bettors don't all talk the same way

Examples (notice the VARIETY in structure):
✓ "Vegas controls the pace way better than Florida, and that's the whole story here. The xGD numbers don't lie..."
✓ "Honestly, I've watched Florida struggle with teams like this all season. Their defensive setup gets torched by Vegas's style."
✓ "Here's the thing—the market's got Vegas at -132, which feels right on the surface, but Florida's the kind of team that gets pushed around..."
✓ "This one makes me nervous, not gonna lie. But Vegas's control edge at home? That's exactly where value lives."
✓ "I know Florida's got some weapons, but Vegas doesn't just win—they win by controlling what happens. That makes me confident here."

Return plain text only (no JSON, no markdown, no bold/italic, no **asterisks**).`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a real hockey sharp explaining why you\'re on this play to a betting friend—passionate, honest, raw, and human. Drop the corporate analyst voice completely. Use short sentences, contractions, everyday language, emotion. Be willing to risk being wrong. Use everyday metaphors ("they play like a housecat chasing a laser"). Admit if it\'s partly gut ("honestly, I can\'t figure out why this line is so high"). NEVER use buzzwords like "leverage" or "framework." 🔥 CRITICAL - VARY YOUR STYLE: DO NOT start every story with "Look" or any repeated phrase. Mix up how you begin—sometimes lead with the team, sometimes the stat, sometimes emotion, sometimes a question. Each story should have its own voice and feel. Real bettors don\'t all sound identical. 🚨🚨 CRITICAL: You MUST explain why the SPECIFIC TEAM mentioned in "WE ARE BETTING ON" has value. Writing about the wrong team makes this useless. 🚨 ZERO TOLERANCE FOR HALLUCINATION: ONLY discuss factors explicitly provided. DO NOT mention percentages, probabilities, player names, team records, recent games, injuries, or ANY data not in the factors. If info isn\'t verified, say so honestly ("I *think* X but..."). Sound like a unique bettor with their own voice, not a template.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 400,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Clean up any markdown or extra formatting
    const cleaned = content.replace(/```/g, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
    
    console.log(`✅ Generated full story - qualitative only (${cleaned.length} chars)`);
    return cleaned;
  } catch (error) {
    console.error(`❌ Error generating full story:`, error.message);
    return null;
  }
}

/**
 * Cache bet narrative in Firebase
 */
async function cacheBetNarrative(awayTeam, homeTeam, content, type) {
  if (!awayTeam || !homeTeam || !content) {
    console.error('❌ Invalid narrative data');
    return false;
  }

  // Use ET date to match client-side cache key lookups
  const etDate = getETDate();
  const cacheKey = `${awayTeam}-${homeTeam}-${etDate}-${type}`;
  const cacheRef = db.collection('perplexityCache').doc(cacheKey);

  try {
    await cacheRef.set({
      content: String(content),
      timestamp: Date.now(),
      awayTeam: String(awayTeam),
      homeTeam: String(homeTeam),
      type: String(type),
      generatedBy: 'github-action'
    });
    console.log(`✅ Cached ${type} for ${awayTeam} @ ${homeTeam}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to cache ${type}:`, error.message);
    return false;
  }
}

/**
 * Load odds data and calculate edges for bet narratives
 */
async function loadOddsAndCalculateEdges(games) {
  try {
    // Look for odds files (they're named odds_money.md and odds_total.md, NOT odds_puck.md!)
    const oddsMoneyPath = join(__dirname, '../public/odds_money.md');
    const oddsTotalPath = join(__dirname, '../public/odds_total.md');
    
    console.log(`📂 Looking for odds files:`);
    console.log(`   Money: ${oddsMoneyPath}`);
    console.log(`   Total: ${oddsTotalPath}`);
    
    let oddsMoneyData, oddsTotalData;
    try {
      oddsMoneyData = readFileSync(oddsMoneyPath, 'utf-8');
      console.log(`✅ Loaded odds_money.md (${oddsMoneyData.length} chars)`);
    } catch (error) {
      console.log(`❌ Could not read odds_money.md: ${error.message}`);
      return null;
    }
    
    try {
      oddsTotalData = readFileSync(oddsTotalPath, 'utf-8');
      console.log(`✅ Loaded odds_total.md (${oddsTotalData.length} chars)`);
    } catch (error) {
      console.log(`❌ Could not read odds_total.md: ${error.message}`);
      return null;
    }

    // Dynamically import modules (avoids loading them when odds aren't available)
    const { EdgeCalculator } = await import('../src/utils/edgeCalculator.js');
    const { NHLDataProcessor } = await import('../src/utils/dataProcessing.js');
    const { GoalieProcessor } = await import('../src/utils/goalieProcessor.js');
    const { ScheduleHelper } = await import('../src/utils/scheduleHelper.js');
    
    // Load and PARSE required data files (they need arrays, not raw CSV strings!)
    console.log('📊 Loading CSV files...');
    const teamsCSV = readFileSync(join(__dirname, '../public/teams.csv'), 'utf-8');
    const goaliesCSV = readFileSync(join(__dirname, '../public/goalies.csv'), 'utf-8');
    const scheduleCSV = readFileSync(join(__dirname, '../public/nhl-202526-asplayed.csv'), 'utf-8');

    // Parse teams.csv
    const teamsData = Papa.parse(teamsCSV, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => {
        if (value === '' || value === null) return null;
        const trimmed = value.toString().trim();
        if (!isNaN(trimmed) && !isNaN(parseFloat(trimmed))) return parseFloat(trimmed);
        return trimmed;
      }
    }).data.filter(row => row && Object.keys(row).some(key => row[key] !== null));
    
    console.log(`✅ Parsed teams.csv: ${teamsData.length} rows`);

    // Parse goalies.csv
    const goaliesData = Papa.parse(goaliesCSV, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    }).data.filter(row => row && Object.keys(row).some(key => row[key] !== null));
    
    console.log(`✅ Parsed goalies.csv: ${goaliesData.length} rows`);

    // Parse schedule.csv
    const scheduleData = Papa.parse(scheduleCSV, {
      header: true,
      skipEmptyLines: true
    }).data.filter(row => row && Object.keys(row).some(key => row[key] !== null));
    
    console.log(`✅ Parsed schedule.csv: ${scheduleData.length} rows`);

    // Initialize processors with PARSED data (arrays, not strings!)
    const goalieProcessor = new GoalieProcessor(goaliesData);
    const scheduleHelper = new ScheduleHelper(scheduleData);
    const dataProcessor = new NHLDataProcessor(teamsData, goalieProcessor, scheduleHelper);
    
    // Load MoneyPuck predictions (same as UI does)
    console.log('🎯 Loading MoneyPuck predictions...');
    let moneyPuckPredictions = null;
    try {
      const moneyPuckData = readFileSync(join(__dirname, '../public/moneypuck_predictions.json'), 'utf-8');
      moneyPuckPredictions = JSON.parse(moneyPuckData);
      console.log(`✅ Loaded ${moneyPuckPredictions.length} MoneyPuck predictions`);
    } catch (error) {
      console.log('⚠️ moneypuck_predictions.json not available - using market ensemble fallback');
    }
    
    // Initialize edge calculator with MoneyPuck predictions (use 'total' not 'puck')
    // CRITICAL: 4th parameter enables MoneyPuck calibration and disables agreement filter
    const edgeCalculator = new EdgeCalculator(
      dataProcessor,
      { moneyText: oddsMoneyData, totalText: oddsTotalData },
      null, // Starting goalies (optional)
      moneyPuckPredictions // Enable MoneyPuck calibration (matches UI behavior)
    );

            const allEdges = edgeCalculator.calculateAllEdges();
            console.log(`✅ Calculated edges for ${allEdges.length} games`);
            
            // Return BOTH allEdges and edgeCalculator so we can use getTopEdges() (same as UI)
            return { allEdges, dataProcessor, edgeCalculator };
  } catch (error) {
    console.error('❌ Error loading odds data:', error.message);
    console.error(error.stack);
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Expert Analysis Generation');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log('✅ Perplexity API key loaded from environment');
  console.log('');

  // Get today's games
  const games = getTodaysGames();
  console.log(`📊 Found ${games.length} games today`);
  console.log('');

  if (games.length === 0) {
    console.log('ℹ️ No games scheduled for today');
    return;
  }

  // Generate matchup insights for each game
  let insightsSuccessCount = 0;
  let insightsFailureCount = 0;

  console.log('📰 PHASE 1: Generating Matchup Insights');
  console.log('='.repeat(50));
  
  for (const game of games) {
    console.log(`⏳ Generating insights: ${game.awayTeam} @ ${game.homeTeam}`);
    
    const cards = await generateAnalysis(game.awayTeam, game.homeTeam, PERPLEXITY_API_KEY);
    
    if (cards && cards.length > 0) {
      await cacheAnalysis(game.awayTeam, game.homeTeam, cards);
      insightsSuccessCount++;
      console.log('');
    } else {
      insightsFailureCount++;
      console.log(`⚠️ Skipped caching (generation failed)`);
      console.log('');
    }

    // Rate limiting: Wait 2 seconds between requests
    if (game !== games[games.length - 1]) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('');
  console.log('📊 Phase 1 Summary:');
  console.log(`✅ Insights Success: ${insightsSuccessCount}`);
  console.log(`❌ Insights Failed: ${insightsFailureCount}`);
  console.log('');

  // PHASE 2: Generate bet narratives (if odds data available)
  console.log('🎯 PHASE 2: Generating Bet Narratives');
  console.log('='.repeat(50));
  
  const edgeData = await loadOddsAndCalculateEdges(games);
  
  if (!edgeData) {
    console.log('⏭️ Skipping bet narratives - odds data not available');
    console.log('   (This is normal if running before odds are scraped)');
  } else {
    const { allEdges, dataProcessor, edgeCalculator } = edgeData;
    
    // Import generateBetNarrative dynamically to get factors array
    const { generateBetNarrative } = await import('../src/utils/narrativeGenerator.js');
    
    // Get topEdges using EXACT SAME LOGIC as the UI
    const topEdges = edgeCalculator.getTopEdges(0); // 0 = all edges, not just positive EV
    console.log(`✅ Got ${topEdges.length} total edge opportunities`);
    
    let narrativesSuccessCount = 0;
    let narrativesFailureCount = 0;

    for (const gameEdge of allEdges) {
      const gameInfo = games.find(g => 
        g.awayTeam === gameEdge.awayTeam && g.homeTeam === gameEdge.homeTeam
      );
      
      if (!gameInfo) continue;

      console.log(`⏳ Generating narratives: ${gameEdge.awayTeam} @ ${gameEdge.homeTeam}`);
      
      // Find best edge using EXACT SAME LOGIC as UI (TodaysGames.jsx line 2612)
      const bestEdge = topEdges
        .filter(e => e.game === gameEdge.game && e.evPercent > 0)
        .sort((a, b) => b.evPercent - a.evPercent)[0];

      if (!bestEdge || bestEdge.evPercent <= 0) {
        console.log('   ⚠️ No positive EV bet found - skipping');
        continue;
      }
      
      // Log the exact bestEdge data we're using (should match UI exactly)
      console.log(`   ✓ Best Edge: ${bestEdge.pick} at ${bestEdge.odds > 0 ? '+' : ''}${bestEdge.odds}`);
      console.log(`   ✓ Raw bestEdge data: EV=${bestEdge.evPercent}, modelProb=${bestEdge.modelProb} (decimal)`);
      console.log(`   ✓ Formatted for display: EV=${bestEdge.evPercent.toFixed(1)}%, Model=${(bestEdge.modelProb * 100).toFixed(1)}%`);

      // Generate narrative data to get bullets (supporting factors)
      const narrativeData = generateBetNarrative(gameEdge, bestEdge, dataProcessor);
      
      if (!narrativeData || !narrativeData.bullets || narrativeData.bullets.length === 0) {
        console.log('   ⚠️ No narrative bullets available - skipping');
        narrativesFailureCount++;
        continue;
      }
      
      // Extract bullets (formatted factor strings) for Perplexity prompts
      const factors = narrativeData.bullets;

      // Find alternative bet using EXACT SAME LOGIC as UI
      const altBet = topEdges
        .filter(e => e.game === gameEdge.game && e.evPercent > 0 && e.team !== bestEdge.team)
        .sort((a, b) => b.evPercent - a.evPercent)[0];

      // Generate bet hook
      const betHook = await generateBetHook(gameInfo, bestEdge, factors, PERPLEXITY_API_KEY);
      if (betHook) {
        await cacheBetNarrative(gameEdge.awayTeam, gameEdge.homeTeam, betHook, 'bet-hook');
      }

      // Generate full story
      const fullStory = await generateFullStory(
        gameInfo, 
        bestEdge, 
        altBet, 
        factors,
        altBet ? factors : null,
        PERPLEXITY_API_KEY
      );
      if (fullStory) {
        await cacheBetNarrative(gameEdge.awayTeam, gameEdge.homeTeam, fullStory, 'full-story');
      }

      if (betHook && fullStory) {
        narrativesSuccessCount++;
      } else {
        narrativesFailureCount++;
      }

      console.log('');

      // Rate limiting: Wait 2 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('');
    console.log('📊 Phase 2 Summary:');
    console.log(`✅ Narratives Success: ${narrativesSuccessCount}`);
    console.log(`❌ Narratives Failed: ${narrativesFailureCount}`);
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('✨ Expert Analysis Generation Complete');
  console.log('='.repeat(50));
}

// Run
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});

