/**
 * CFB (NCAA football) team resolution — shared by fetchPolymarketData,
 * snapshotPinnacle, scanSharpPositions, scanWhitelistedWallets,
 * seedSportsSharps, buildWhaleProfiles, gradeSharpActions.
 *
 * Polymarket game events look like:
 *   slug:  cfb-maine-tows-2026-08-27
 *   title: Maine vs. Towson
 *   Markets: ML (2-way) + spreads + totals (NFL-style)
 *
 * Odds API sport key: americanfootball_ncaaf
 * Game keys: `${code}_${code}` lowercased, e.g. "mne_tows".
 *
 * Classify BEFORE CBB and NFL — school names (Duke, Kentucky) and
 * nicknames (Tigers, Eagles, Bulldogs) collide heavily. Never match
 * generic nicknames alone; prefer school names / cfb slug/tag.
 */

/** Fold diacritics then strip non-alphanumerics. */
export function normalizeCFBName(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

const CFB_TEAMS = [
  { code: "ACU", names: ["Abilene Christian Wildcats", "Abilene Christian"] },
  { code: "AFA", names: ["Air Force Falcons", "Air Force"] },
  { code: "AKR", names: ["Akron Zips", "Akron", "Zips", "zips"] },
  { code: "ALA", names: ["Alabama Crimson Tide", "Alabama", "Crimson Tide", "crimson tide"] },
  { code: "ALBY", names: ["Albany"] },
  { code: "ALCN", names: ["Alcorn State Braves", "Alcorn State", "Braves"] },
  { code: "APP", names: ["Appalachian State Mountaineers", "Appalachian State"] },
  { code: "APSU", names: ["Austin Peay Governors", "Austin Peay"] },
  { code: "ARIZ", names: ["Arizona Wildcats", "Arizona"] },
  { code: "ARK", names: ["Arkansas Razorbacks", "Arkansas", "razorbacks", "Razorbacks"] },
  { code: "ARMY", names: ["Army Black Knights", "Army", "Black Knights", "black knights"] },
  { code: "ARST", names: ["Arkansas State Red Wolves", "Arkansas State", "Red Wolves"] },
  { code: "ASU", names: ["Arizona State Sun Devils", "Arizona State", "Sun Devils", "sun devils"] },
  { code: "AUB", names: ["Auburn Tigers", "Auburn"] },
  { code: "BALL", names: ["Ball State Cardinals", "Ball State"] },
  { code: "BAY", names: ["Baylor Bears", "Baylor"] },
  { code: "BC", names: ["Boston College Eagles", "Boston College"] },
  { code: "BCU", names: ["Bethune-Cookman Wildcats", "Bethune-Cookman"] },
  { code: "BGSU", names: ["Bowling Green Falcons", "Bowling Green"] },
  { code: "BRY", names: ["Bryant Bulldogs", "Bryant"] },
  { code: "BSU", names: ["Boise State Broncos", "Boise State"] },
  { code: "BUFF", names: ["Buffalo Bulls", "Buffalo"] },
  { code: "BYU", names: ["BYU Cougars", "BYU"] },
  { code: "CAL", names: ["California Golden Bears", "California", "Golden Bears"] },
  { code: "CCU", names: ["Coastal Carolina Chanticleers", "Chanticleers", "chanticleers", "Coastal Carolina"] },
  { code: "CHAR", names: ["Charlotte 49ers", "49ers", "Charlotte"] },
  { code: "CHSO", names: ["Charleston Southern Buccaneers", "Buccaneers", "Charleston Southern"] },
  { code: "CIN", names: ["Cincinnati Bearcats", "Cincinnati"] },
  { code: "CIT", names: ["Citadel Bulldogs", "Citadel", "The Citadel"] },
  { code: "CLEM", names: ["Clemson Tigers", "Clemson"] },
  { code: "CMU", names: ["Central Michigan Chippewas", "Central Michigan", "Chippewas", "chippewas"] },
  { code: "COLO", names: ["Colorado Buffaloes", "Buffaloes", "Colorado"] },
  { code: "CONN", names: ["UConn Huskies", "UConn"] },
  { code: "CSU", names: ["Colorado State Rams", "Colorado State"] },
  { code: "DEL", names: ["Delaware Blue Hens", "Blue Hens", "Delaware"] },
  { code: "DELST", names: ["Delaware State Hornets", "Delaware State", "Delst"] },
  { code: "DUKE", names: ["Duke Blue Devils", "blue devils", "Blue Devils", "Duke"] },
  { code: "DUQ", names: ["Duquesne Dukes", "Duquesne"] },
  { code: "ECU", names: ["East Carolina Pirates", "East Carolina"] },
  { code: "EIU", names: ["Eastern Illinois Panthers", "Eastern Illinois"] },
  { code: "EKU", names: ["Eastern Kentucky Colonels", "Eastern Kentucky"] },
  { code: "EMU", names: ["Eastern Michigan Eagles", "Eastern Michigan", "Emich"] },
  { code: "FAU", names: ["Florida Atlantic Owls", "Florida Atlantic"] },
  { code: "FIU", names: ["Florida International Panthers", "Florida International"] },
  { code: "FLA", names: ["Florida Gators", "Florida", "Gators", "gators"] },
  { code: "FOR", names: ["Fordham Rams", "Fordham"] },
  { code: "FRES", names: ["Fresno State Bulldogs", "Fresno State"] },
  { code: "FSU", names: ["Florida State Seminoles", "Florida St", "Florida St.", "Florida State", "Flst", "Seminoles", "seminoles"] },
  { code: "FUR", names: ["Furman Paladins", "Furman"] },
  { code: "GASO", names: ["Georgia Southern Eagles", "Georgia Southern"] },
  { code: "GAST", names: ["Georgia State Panthers", "Georgia State"] },
  { code: "GT", names: ["Georgia Tech Yellow Jackets", "Georgia Tech", "Yellow Jackets", "yellow jackets"] },
  { code: "HAW", names: ["Hawaii Rainbow Warriors", "Hawai'i", "Hawaii", "Rainbow Warriors", "rainbow warriors"] },
  { code: "HCU", names: ["Houston Baptist Huskies", "Houston Baptist", "Houston Christian", "Houston Christian Huskies"] },
  { code: "HOU", names: ["Houston Cougars", "Houston"] },
  { code: "IDHO", names: ["Idaho Vandals", "Idaho", "Vandals"] },
  { code: "IDST", names: ["Idaho State Bengals", "Bengals", "Idaho State"] },
  { code: "ILL", names: ["Illinois Fighting Illini", "Fighting Illini", "fighting illini", "Illinois"] },
  { code: "IND", names: ["Indiana Hoosiers", "hoosiers", "Hoosiers", "Indiana"] },
  { code: "INST", names: ["Indiana State Sycamores", "Indiana State"] },
  { code: "IOWA", names: ["Iowa Hawkeyes", "hawkeyes", "Hawkeyes", "Iowa"] },
  { code: "ISU", names: ["Iowa State Cyclones", "cyclones", "Cyclones", "Iowa State"] },
  { code: "JMU", names: ["James Madison Dukes", "James Madison"] },
  { code: "JVST", names: ["Jacksonville State Gamecocks", "Jacksonville State", "Jaxst"] },
  { code: "KENN", names: ["Kennesaw State Owls", "Kennesaw State"] },
  { code: "KENT", names: ["Kent State Golden Flashes", "Golden Flashes", "golden flashes", "Kent State"] },
  { code: "KSU", names: ["Kansas State Wildcats", "Kansas State"] },
  { code: "KU", names: ["Kansas Jayhawks", "Jayhawks", "jayhawks", "Kansas"] },
  { code: "LAF", names: ["Lafayette Leopards", "Lafayette", "Leopards"] },
  { code: "LAM", names: ["Lamar Cardinals", "Lamar"] },
  { code: "LIB", names: ["Liberty Flames", "Flames", "flames", "Liberty"] },
  { code: "LIU", names: ["LIU Sharks", "LIU", "Sharks"] },
  { code: "LOU", names: ["Louisville Cardinals", "Louisville"] },
  { code: "LSU", names: ["LSU Tigers", "LSU"] },
  { code: "LT", names: ["Louisiana Tech Bulldogs", "Louisiana Tech"] },
  { code: "MASS", names: ["UMass Minutemen", "UMass"] },
  { code: "MD", names: ["Maryland Terrapins", "Maryland", "terrapins", "Terrapins"] },
  { code: "MEM", names: ["Memphis Tigers", "Memphis", "Mphs"] },
  { code: "MIA", names: ["Miami Hurricanes", "Miami", "Miami (FL)", "Miami FL"] },
  { code: "MIAOH", names: ["Miami (OH) RedHawks", "Miami (OH)", "Miami (Ohio)", "Miami OH", "Miami Ohio"] },
  { code: "MICH", names: ["Michigan Wolverines", "Michigan", "Wolverines", "wolverines"] },
  { code: "MINN", names: ["Minnesota Golden Gophers", "golden gophers", "Golden Gophers", "Minnesota"] },
  { code: "MISS", names: ["Ole Miss Rebels", "Mississippi", "Ole Miss"] },
  { code: "MIZZ", names: ["Missouri Tigers", "Missouri"] },
  { code: "MNE", names: ["Maine Black Bears", "Black Bears", "Maine"] },
  { code: "MORG", names: ["Morgan State Bears", "Morgan State"] },
  { code: "MOST", names: ["Missouri State Bears", "Missouri State"] },
  { code: "MRCY", names: ["Mercyhurst Lakers", "Mercyhurst", "Mrcy"] },
  { code: "MRMK", names: ["Merrimack Warriors", "Merrimack"] },
  { code: "MRSH", names: ["Marshall Thundering Herd", "Marshall", "thundering herd", "Thundering Herd"] },
  { code: "MSST", names: ["Mississippi State Bulldogs", "Mississippi State"] },
  { code: "MSU", names: ["Michigan State Spartans", "Michigan State"] },
  { code: "MTSU", names: ["Middle Tennessee Blue Raiders", "blue raiders", "Blue Raiders", "Middle Tennessee"] },
  { code: "MUR", names: ["Murray State Racers", "Murray State"] },
  { code: "MVSU", names: ["Mississippi Valley State Delta Devils", "Delta Devils", "Mississippi Valley State"] },
  { code: "NAU", names: ["Northern Arizona Lumberjacks", "Lumberjacks", "Northern Arizona"] },
  { code: "NAVY", names: ["navy midshipmen", "Midshipmen", "midshipmen", "Navy", "Navy Midshipmen"] },
  { code: "NCAT", names: ["North Carolina A&T Aggies", "North Carolina A&T"] },
  { code: "NCST", names: ["North Carolina State", "N.C. State", "NC State", "NC State Wolfpack", "NCST", "Wolfpack"] },
  { code: "ND", names: ["Notre Dame Fighting Irish", "fighting irish", "Fighting Irish", "Notre Dame"] },
  { code: "NDSU", names: ["North Dakota State Bison", "Ndkst", "NDSU", "North Dakota State"] },
  { code: "NEB", names: ["Nebraska Cornhuskers", "Cornhuskers", "cornhuskers", "Nebraska"] },
  { code: "NEV", names: ["Nevada Wolf Pack", "Nevada"] },
  { code: "NICH", names: ["Nicholls State Colonels", "Nicholls State"] },
  { code: "NIU", names: ["Northern Illinois Huskies", "Northern Illinois"] },
  { code: "NMSU", names: ["New Mexico State Aggies", "New Mexico State", "Nmxst"] },
  { code: "NORF", names: ["Norfolk State Spartans", "Norfolk State"] },
  { code: "NW", names: ["Northwestern Wildcats", "Northwestern"] },
  { code: "NWST", names: ["Northwestern State Demons", "Northwestern State"] },
  { code: "ODU", names: ["Old Dominion Monarchs", "Monarchs", "monarchs", "Old Dominion"] },
  { code: "OHIO", names: ["Ohio Bobcats", "Ohio"] },
  { code: "OKLA", names: ["Oklahoma Sooners", "Oklahoma", "sooners", "Sooners"] },
  { code: "OKST", names: ["Oklahoma State Cowboys", "Oklahoma State"] },
  { code: "ORE", names: ["Oregon Ducks", "Oregon"] },
  { code: "ORST", names: ["Oregon State Beavers", "beavers", "Beavers", "Oregon State"] },
  { code: "OSU", names: ["Ohio State Buckeyes", "buckeyes", "Buckeyes", "Ohio State"] },
  { code: "PITT", names: ["Pittsburgh Panthers", "Pittsburgh"] },
  { code: "PRST", names: ["Portland State Vikings", "Portland State"] },
  { code: "PSU", names: ["Penn State Nittany Lions", "Nittany Lions", "nittany lions", "Penn State"] },
  { code: "PUR", names: ["Purdue Boilermakers", "Boilermakers", "boilermakers", "Purdue"] },
  { code: "RICE", names: ["Rice Owls", "Rice"] },
  { code: "RUTG", names: ["Rutgers Scarlet Knights", "Rutgers", "scarlet knights", "Scarlet Knights"] },
  { code: "SAC", names: ["Sacramento State Hornets", "Sacramento State", "Sacst"] },
  { code: "SCAR", names: ["South Carolina Gamecocks", "South Carolina"] },
  { code: "SDST", names: ["South Dakota State Jackrabbits", "South Dakota State"] },
  { code: "SDSU", names: ["San Diego State Aztecs", "Aztecs", "aztecs", "San Diego State"] },
  { code: "SELA", names: ["Southeastern Louisiana Lions", "Southeastern Louisiana"] },
  { code: "SEMO", names: ["Southeast Missouri State Redhawks", "Southeast Missouri State"] },
  { code: "SHSU", names: ["Sam Houston State Bearkats", "Bearkats", "Sam Houston State"] },
  { code: "SJSU", names: ["San Jose State Spartans", "San Jose State", "SJST"] },
  { code: "SMU", names: ["SMU Mustangs", "SMU"] },
  { code: "STAN", names: ["Stanford Cardinal", "Cardinal", "Stan", "Stanford"] },
  { code: "STBR", names: ["Stony Brook Seawolves", "Stbr", "Stony Brook"] },
  { code: "SYR", names: ["Syracuse Orange", "Orange", "Syracuse"] },
  { code: "TAMU", names: ["Texas A&M Aggies", "Texas A&M"] },
  { code: "TAR", names: ["Tarleton State Texans", "Tarleton State", "Texans"] },
  { code: "TCU", names: ["TCU Horned Frogs", "Horned Frogs", "horned frogs", "TCU"] },
  { code: "TEM", names: ["Temple Owls", "Temple"] },
  { code: "TENN", names: ["Tennessee Volunteers", "Tennessee", "volunteers", "Volunteers"] },
  { code: "TEX", names: ["Texas Longhorns", "longhorns", "Longhorns", "Texas"] },
  { code: "TLSA", names: ["Tulsa Golden Hurricane", "Golden Hurricane", "golden hurricane", "Tulsa"] },
  { code: "TNST", names: ["Tennessee State Tigers", "Tennessee State"] },
  { code: "TOL", names: ["Toledo Rockets", "rockets", "Rockets", "Toledo"] },
  { code: "TOWS", names: ["Towson Tigers", "Tows", "Towson"] },
  { code: "TROY", names: ["Troy Trojans", "Troy"] },
  { code: "TTU", names: ["Texas Tech Red Raiders", "Red Raiders", "red raiders", "Texas Tech"] },
  { code: "TULN", names: ["Tulane Green Wave", "Green Wave", "green wave", "Tulane"] },
  { code: "TXST", names: ["Texas State Bobcats", "Texas State"] },
  { code: "UAB", names: ["UAB Blazers", "Blazers", "blazers", "UAB"] },
  { code: "UAPB", names: ["Arkansas Pine Bluff Golden Lions", "Arkansas Pine Bluff", "Golden Lions"] },
  { code: "UCF", names: ["UCF Knights", "UCF"] },
  { code: "UCLA", names: ["UCLA Bruins", "UCLA"] },
  { code: "UGA", names: ["Georgia Bulldogs", "Georgia"] },
  { code: "UK", names: ["Kentucky Wildcats", "Kentucky"] },
  { code: "ULL", names: ["Louisiana Ragin Cajuns", "Louisiana", "Ragin Cajuns", "ragin cajuns", "ragin' cajuns", "Ragin' Cajuns"] },
  { code: "ULM", names: ["UL Monroe Warhawks", "UL Monroe", "Warhawks"] },
  { code: "UNA", names: ["North Alabama Lions", "North Alabama"] },
  { code: "UNC", names: ["North Carolina Tar Heels", "Ncar", "North Carolina", "tar heels", "Tar Heels", "UNC"] },
  { code: "UNH", names: ["New Hampshire Wildcats", "New Hampshire"] },
  { code: "UNLV", names: ["UNLV Runnin'", "UNLV", "UNLV Rebels", "UNLV Runnin"] },
  { code: "UNM", names: ["New Mexico Lobos", "Lobos", "lobos", "New Mexico"] },
  { code: "UNT", names: ["North Texas Mean Green", "mean green", "Mean Green", "North Texas"] },
  { code: "URI", names: ["Rhode Island Rams", "Rhode Island"] },
  { code: "USA", names: ["South Alabama Jaguars", "Jaguars", "South Alabama"] },
  { code: "USC", names: ["Southern California", "USC", "USC Trojans"] },
  { code: "USF", names: ["South Florida Bulls", "South Florida"] },
  { code: "USM", names: ["Southern Mississippi Golden Eagles", "Golden Eagles", "Southern Mississippi"] },
  { code: "USU", names: ["Utah State Aggies", "Utah State"] },
  { code: "UTAH", names: ["Utah Utes", "Utah"] },
  { code: "UTEP", names: ["UTEP Miners", "miners", "Miners", "UTEP"] },
  { code: "UTRGV", names: ["UT Rio Grande Valley Vaqueros", "UT Rio Grande Valley"] },
  { code: "UTSA", names: ["UTSA Roadrunners", "roadrunners", "Roadrunners", "UTSA"] },
  { code: "UTU", names: ["Utah Tech Trailblazers", "Utah Tech"] },
  { code: "UVA", names: ["Virginia Cavaliers", "cavaliers", "Cavaliers", "Vir", "Virginia"] },
  { code: "UWG", names: ["West Georgia Wolves", "West Georgia"] },
  { code: "VAN", names: ["Vanderbilt Commodores", "Commodores", "commodores", "Vanderbilt"] },
  { code: "VMI", names: ["VMI Keydets", "VMI"] },
  { code: "VT", names: ["Virginia Tech Hokies", "hokies", "Hokies", "Virginia Tech"] },
  { code: "WAKE", names: ["Wake Forest Demon Deacons", "demon deacons", "Demon Deacons", "Wake Forest"] },
  { code: "WASH", names: ["Washington Huskies", "Washington"] },
  { code: "WISC", names: ["Wisconsin Badgers", "badgers", "Badgers", "Wisconsin"] },
  { code: "WKU", names: ["Western Kentucky Hilltoppers", "Hilltoppers", "hilltoppers", "Western Kentucky"] },
  { code: "WMU", names: ["Western Michigan Broncos", "Western Michigan"] },
  { code: "WSU", names: ["Washington State Cougars", "Washington State"] },
  { code: "WVU", names: ["West Virginia Mountaineers", "West Virginia"] },
  { code: "WYO", names: ["Wyoming Cowboys", "Wyoming"] },
  { code: "YSU", names: ["Youngstown State Penguins", "Yngst", "Youngstown St", "Youngstown St Penguins", "Youngstown State"] },
];

/** normalized alias -> CFB code */
export const CFB_NAME_TO_CODE = {};
for (const { code, names } of CFB_TEAMS) {
  CFB_NAME_TO_CODE[normalizeCFBName(code)] = code;
  for (const n of names) CFB_NAME_TO_CODE[normalizeCFBName(n)] = code;
}

/** Canonical display names (longest alias) keyed by code. */
export const CFB_CODE_TO_NAME = {};
for (const { code, names } of CFB_TEAMS) CFB_CODE_TO_NAME[code] = names[0];

const OTHER_SPORT_CUE = /\b(esports?|dota|csgo|valorant|lol|nba|wnba|mlb|nhl|ufc|mma|nfl)\b/i;

/**
 * Resolve a raw team string to a CFB code, or null.
 * Exact normalized match first, then longest safe prefix.
 * Generic nicknames (Tigers, Eagles) are not registered as aliases.
 */
export function resolveCFBTeam(raw) {
  if (!raw) return null;
  const cleaned = String(raw)
    .replace(/\s*\((?:cfb|ncaaf|ncaa\s*football|college\s*football|fbs|fcs)\)\s*$/i, '')
    .replace(/^(?:cfb|ncaaf|ncaa)\s*:\s*/i, '')
    .replace(/\s+runnin['’]?\s*$/i, '')
    .trim();
  if (OTHER_SPORT_CUE.test(cleaned) && !/\b(cfb|ncaaf|ncaa\s*football|college\s*football)\b/i.test(cleaned)) {
    return null;
  }
  const n = normalizeCFBName(cleaned);
  if (!n) return null;
  if (CFB_NAME_TO_CODE[n]) return CFB_NAME_TO_CODE[n];

  // Prefix match only when the remainder is a mascot, not another school
  // ("North Carolina Central" must not become UNC; "Texas A&M" still hits TAMU).
  const OTHER_SCHOOL = /^(state|st|central|southern|northern|eastern|western|christian|tech|am|aandm|ia|ohio|martin|permian|international|baptist|college|aandm|famu|poly|mines)/;
  let best = null;
  let bestLen = 0;
  for (const [alias, code] of Object.entries(CFB_NAME_TO_CODE)) {
    if (alias.length < 4) continue;
    if (!n.startsWith(alias)) continue;
    const rest = n.slice(alias.length);
    if (rest && OTHER_SCHOOL.test(rest)) continue;
    if (alias.length > bestLen) {
      best = code;
      bestLen = alias.length;
    }
  }
  if (best) return best;
  return null;
}

/** Game key from two team name strings (away_home). */
export function makeCFBGameKey(a, b) {
  const aa = resolveCFBTeam(a);
  const bb = resolveCFBTeam(b);
  if (!aa || !bb || aa === bb) return null;
  return `${aa.toLowerCase()}_${bb.toLowerCase()}`;
}

/**
 * True if a Polymarket event slug is a MAIN CFB game (not futures/props).
 * Observed shapes:
 *   ✅ cfb-maine-tows-2026-08-27
 *   ✅ cfb-stbr-delst-2026-08-27
 *   ❌ ncaa-football-2026-heisman-award-winner
 *   ❌ ncaa-football-2026-national-champion
 */
export function isMainCFBGameSlug(slug) {
  const s = (slug || '').toLowerCase();
  if (!s.startsWith('cfb-') && !s.startsWith('ncaaf-')) return false;
  if (/champion|heisman|winner|mvp|award|futures?|win-total|wintotal|cover-athlete|coach|playoff|cfp|ranked|conference-winner|season-wins/.test(s)) return false;
  if (/total|spread|o-u|over-under|player|passing|rushing|receiving|first-half|td-scorer/.test(s)) return false;
  if (!/\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const body = s.replace(/^(cfb|ncaaf)-/, '').replace(/-\d{4}-\d{2}-\d{2}$/, '');
  const parts = body.split('-').filter(Boolean);
  return parts.length >= 2;
}

/**
 * Precise CFB-title classifier for wallet-universe sport tagging.
 * Prefer explicit cfb/ncaaf/college football; also accept known school-pair vs titles.
 */
export function isCFBMarketTitle(title) {
  const t = (title || '').toLowerCase();
  if (/\b(cfb|ncaaf|ncaa\s*football|college\s*football)\b/.test(t)) return true;
  if (/\bbasketball\b|\bcbb\b|march madness/.test(t)) return false;
  let m = t.match(/^will\s+(?:the\s+)?(.+?)\s+win(?:\s+on\s+\d{4}-\d{2}-\d{2})?\s*\?*$/);
  if (m && resolveCFBTeam(m[1]) && /\b(cfb|ncaaf|football)\b/.test(t)) return true;
  m = t.match(/^(.+?)\s+vs\.?\s+(.+?)$/);
  if (m && resolveCFBTeam(m[1]) && resolveCFBTeam(m[2])) return true;
  m = t.match(/^(.+?)\s+@\s+(.+?)$/);
  if (m && resolveCFBTeam(m[1]) && resolveCFBTeam(m[2])) return true;
  return false;
}

function etDateOf(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  } catch {
    return null;
  }
}

/**
 * Match a Polymarket position/market title to a CFB game in todaysGames
 * (keys are "CFB:awaycode_homecode").
 */
export function matchCFBPositionTitle(posTitle, todaysGames) {
  const t = (posTitle || '').trim();
  if (!t) return null;
  const hasCfbCue = /\b(cfb|ncaaf|ncaa\s*football|college\s*football)\b/i.test(t);

  let m = t.match(/^will\s+(?:the\s+)?(.+?)\s+win(?:\s+on\s+(\d{4}-\d{2}-\d{2}))?\s*\?*$/i);
  if (m) {
    const code = resolveCFBTeam(m[1]);
    if (!code) return null;
    if (!hasCfbCue) {
      const c = code.toLowerCase();
      const any = Object.keys(todaysGames).some((k) => {
        if (!k.startsWith('CFB:')) return false;
        const [aw, hm] = k.slice(4).split('_');
        return aw === c || hm === c;
      });
      if (!any) return null;
    }
    const c = code.toLowerCase();
    const titleDate = m[2] || null;
    let fallback = null;
    for (const [fullKey, g] of Object.entries(todaysGames)) {
      if (!fullKey.startsWith('CFB:')) continue;
      const gameKey = fullKey.slice(4);
      const [aw, hm] = gameKey.split('_');
      if (aw !== c && hm !== c) continue;
      const cand = {
        key: gameKey,
        sport: 'CFB',
        side: aw === c ? 'away' : 'home',
        awayName: g.away,
        homeName: g.home,
      };
      if (titleDate) {
        const gameDate = etDateOf(g.commence);
        if (gameDate === titleDate) return cand;
        if (!gameDate && !fallback) fallback = cand;
      } else {
        return cand;
      }
    }
    return fallback;
  }

  m = t.match(/^(.+?)\s+(?:vs\.?|@)\s+(.+?)$/i);
  if (m) {
    const a = resolveCFBTeam(m[1]);
    const b = resolveCFBTeam(m[2]);
    if (!a || !b) return null;
    const key = `${a.toLowerCase()}_${b.toLowerCase()}`;
    if (todaysGames[`CFB:${key}`]) {
      const g = todaysGames[`CFB:${key}`];
      return { key, sport: 'CFB', side: null, awayName: g.away, homeName: g.home };
    }
    const rev = `${b.toLowerCase()}_${a.toLowerCase()}`;
    if (todaysGames[`CFB:${rev}`]) {
      const g = todaysGames[`CFB:${rev}`];
      return { key: rev, sport: 'CFB', side: null, awayName: g.away, homeName: g.home };
    }
  }

  return null;
}

/** True when two raw team strings resolve to the same CFB code. */
export function cfbTeamsMatch(rawA, rawB) {
  const a = resolveCFBTeam(rawA);
  const b = resolveCFBTeam(rawB);
  return !!(a && b && a === b);
}

