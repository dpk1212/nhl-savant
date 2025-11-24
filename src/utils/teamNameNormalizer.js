/**
 * Team Name Normalizer for College Basketball
 * Handles variations in team names across different data sources
 * 
 * Sources use different formats:
 * - OddsTrader: "Kansas", "St. John's", "North Carolina State"
 * - Haslametrics: "Kansas Jayhawks", "St. John's Red Storm", "NC State Wolfpack"
 * - D-Ratings: "Kansas Jayhawks", "St. John's Red Storm", "NC State Wolfpack"
 */

// Top 75 teams from major conferences (covers ~80% of games)
const TEAM_MAP = {
  // ACC
  'duke': { normalized: 'Duke', fullName: 'Duke Blue Devils', conference: 'ACC' },
  'duke blue devils': { normalized: 'Duke', fullName: 'Duke Blue Devils', conference: 'ACC' },
  'north carolina': { normalized: 'North Carolina', fullName: 'North Carolina Tar Heels', conference: 'ACC' },
  'north carolina tar heels': { normalized: 'North Carolina', fullName: 'North Carolina Tar Heels', conference: 'ACC' },
  'unc': { normalized: 'North Carolina', fullName: 'North Carolina Tar Heels', conference: 'ACC' },
  'nc state': { normalized: 'NC State', fullName: 'NC State Wolfpack', conference: 'ACC' },
  'nc state wolfpack': { normalized: 'NC State', fullName: 'NC State Wolfpack', conference: 'ACC' },
  'north carolina state': { normalized: 'NC State', fullName: 'NC State Wolfpack', conference: 'ACC' },
  'virginia': { normalized: 'Virginia', fullName: 'Virginia Cavaliers', conference: 'ACC' },
  'virginia cavaliers': { normalized: 'Virginia', fullName: 'Virginia Cavaliers', conference: 'ACC' },
  'clemson': { normalized: 'Clemson', fullName: 'Clemson Tigers', conference: 'ACC' },
  'clemson tigers': { normalized: 'Clemson', fullName: 'Clemson Tigers', conference: 'ACC' },
  'miami': { normalized: 'Miami', fullName: 'Miami Hurricanes', conference: 'ACC' },
  'miami hurricanes': { normalized: 'Miami', fullName: 'Miami Hurricanes', conference: 'ACC' },
  'syracuse': { normalized: 'Syracuse', fullName: 'Syracuse Orange', conference: 'ACC' },
  'syracuse orange': { normalized: 'Syracuse', fullName: 'Syracuse Orange', conference: 'ACC' },
  'louisville': { normalized: 'Louisville', fullName: 'Louisville Cardinals', conference: 'ACC' },
  'louisville cardinals': { normalized: 'Louisville', fullName: 'Louisville Cardinals', conference: 'ACC' },
  
  // Big Ten
  'purdue': { normalized: 'Purdue', fullName: 'Purdue Boilermakers', conference: 'Big Ten' },
  'purdue boilermakers': { normalized: 'Purdue', fullName: 'Purdue Boilermakers', conference: 'Big Ten' },
  'illinois': { normalized: 'Illinois', fullName: 'Illinois Fighting Illini', conference: 'Big Ten' },
  'illinois fighting illini': { normalized: 'Illinois', fullName: 'Illinois Fighting Illini', conference: 'Big Ten' },
  'michigan': { normalized: 'Michigan', fullName: 'Michigan Wolverines', conference: 'Big Ten' },
  'michigan wolverines': { normalized: 'Michigan', fullName: 'Michigan Wolverines', conference: 'Big Ten' },
  'michigan state': { normalized: 'Michigan State', fullName: 'Michigan State Spartans', conference: 'Big Ten' },
  'michigan state spartans': { normalized: 'Michigan State', fullName: 'Michigan State Spartans', conference: 'Big Ten' },
  'msu': { normalized: 'Michigan State', fullName: 'Michigan State Spartans', conference: 'Big Ten' },
  'wisconsin': { normalized: 'Wisconsin', fullName: 'Wisconsin Badgers', conference: 'Big Ten' },
  'wisconsin badgers': { normalized: 'Wisconsin', fullName: 'Wisconsin Badgers', conference: 'Big Ten' },
  'indiana': { normalized: 'Indiana', fullName: 'Indiana Hoosiers', conference: 'Big Ten' },
  'indiana hoosiers': { normalized: 'Indiana', fullName: 'Indiana Hoosiers', conference: 'Big Ten' },
  'ohio state': { normalized: 'Ohio State', fullName: 'Ohio State Buckeyes', conference: 'Big Ten' },
  'ohio state buckeyes': { normalized: 'Ohio State', fullName: 'Ohio State Buckeyes', conference: 'Big Ten' },
  'iowa': { normalized: 'Iowa', fullName: 'Iowa Hawkeyes', conference: 'Big Ten' },
  'iowa hawkeyes': { normalized: 'Iowa', fullName: 'Iowa Hawkeyes', conference: 'Big Ten' },
  'nebraska': { normalized: 'Nebraska', fullName: 'Nebraska Cornhuskers', conference: 'Big Ten' },
  'nebraska cornhuskers': { normalized: 'Nebraska', fullName: 'Nebraska Cornhuskers', conference: 'Big Ten' },
  'northwestern': { normalized: 'Northwestern', fullName: 'Northwestern Wildcats', conference: 'Big Ten' },
  'northwestern wildcats': { normalized: 'Northwestern', fullName: 'Northwestern Wildcats', conference: 'Big Ten' },
  'rutgers': { normalized: 'Rutgers', fullName: 'Rutgers Scarlet Knights', conference: 'Big Ten' },
  'rutgers scarlet knights': { normalized: 'Rutgers', fullName: 'Rutgers Scarlet Knights', conference: 'Big Ten' },
  
  // Big 12
  'kansas': { normalized: 'Kansas', fullName: 'Kansas Jayhawks', conference: 'Big 12' },
  'kansas jayhawks': { normalized: 'Kansas', fullName: 'Kansas Jayhawks', conference: 'Big 12' },
  'ku': { normalized: 'Kansas', fullName: 'Kansas Jayhawks', conference: 'Big 12' },
  'iowa state': { normalized: 'Iowa State', fullName: 'Iowa State Cyclones', conference: 'Big 12' },
  'iowa state cyclones': { normalized: 'Iowa State', fullName: 'Iowa State Cyclones', conference: 'Big 12' },
  'baylor': { normalized: 'Baylor', fullName: 'Baylor Bears', conference: 'Big 12' },
  'baylor bears': { normalized: 'Baylor', fullName: 'Baylor Bears', conference: 'Big 12' },
  'texas': { normalized: 'Texas', fullName: 'Texas Longhorns', conference: 'Big 12' },
  'texas longhorns': { normalized: 'Texas', fullName: 'Texas Longhorns', conference: 'Big 12' },
  'texas tech': { normalized: 'Texas Tech', fullName: 'Texas Tech Red Raiders', conference: 'Big 12' },
  'texas tech red raiders': { normalized: 'Texas Tech', fullName: 'Texas Tech Red Raiders', conference: 'Big 12' },
  'kansas state': { normalized: 'Kansas State', fullName: 'Kansas State Wildcats', conference: 'Big 12' },
  'kansas state wildcats': { normalized: 'Kansas State', fullName: 'Kansas State Wildcats', conference: 'Big 12' },
  'byu': { normalized: 'BYU', fullName: 'BYU Cougars', conference: 'Big 12' },
  'byu cougars': { normalized: 'BYU', fullName: 'BYU Cougars', conference: 'Big 12' },
  
  // SEC
  'tennessee': { normalized: 'Tennessee', fullName: 'Tennessee Volunteers', conference: 'SEC' },
  'tennessee volunteers': { normalized: 'Tennessee', fullName: 'Tennessee Volunteers', conference: 'SEC' },
  'alabama': { normalized: 'Alabama', fullName: 'Alabama Crimson Tide', conference: 'SEC' },
  'alabama crimson tide': { normalized: 'Alabama', fullName: 'Alabama Crimson Tide', conference: 'SEC' },
  'kentucky': { normalized: 'Kentucky', fullName: 'Kentucky Wildcats', conference: 'SEC' },
  'kentucky wildcats': { normalized: 'Kentucky', fullName: 'Kentucky Wildcats', conference: 'SEC' },
  'auburn': { normalized: 'Auburn', fullName: 'Auburn Tigers', conference: 'SEC' },
  'auburn tigers': { normalized: 'Auburn', fullName: 'Auburn Tigers', conference: 'SEC' },
  'florida': { normalized: 'Florida', fullName: 'Florida Gators', conference: 'SEC' },
  'florida gators': { normalized: 'Florida', fullName: 'Florida Gators', conference: 'SEC' },
  'arkansas': { normalized: 'Arkansas', fullName: 'Arkansas Razorbacks', conference: 'SEC' },
  'arkansas razorbacks': { normalized: 'Arkansas', fullName: 'Arkansas Razorbacks', conference: 'SEC' },
  'lsu': { normalized: 'LSU', fullName: 'LSU Tigers', conference: 'SEC' },
  'lsu tigers': { normalized: 'LSU', fullName: 'LSU Tigers', conference: 'SEC' },
  'mississippi state': { normalized: 'Mississippi State', fullName: 'Mississippi State Bulldogs', conference: 'SEC' },
  'mississippi state bulldogs': { normalized: 'Mississippi State', fullName: 'Mississippi State Bulldogs', conference: 'SEC' },
  'ole miss': { normalized: 'Ole Miss', fullName: 'Ole Miss Rebels', conference: 'SEC' },
  'ole miss rebels': { normalized: 'Ole Miss', fullName: 'Ole Miss Rebels', conference: 'SEC' },
  'georgia': { normalized: 'Georgia', fullName: 'Georgia Bulldogs', conference: 'SEC' },
  'georgia bulldogs': { normalized: 'Georgia', fullName: 'Georgia Bulldogs', conference: 'SEC' },
  'missouri': { normalized: 'Missouri', fullName: 'Missouri Tigers', conference: 'SEC' },
  'missouri tigers': { normalized: 'Missouri', fullName: 'Missouri Tigers', conference: 'SEC' },
  'vanderbilt': { normalized: 'Vanderbilt', fullName: 'Vanderbilt Commodores', conference: 'SEC' },
  'vanderbilt commodores': { normalized: 'Vanderbilt', fullName: 'Vanderbilt Commodores', conference: 'SEC' },
  
  // Big East
  'uconn': { normalized: 'UConn', fullName: 'UConn Huskies', conference: 'Big East' },
  'uconn huskies': { normalized: 'UConn', fullName: 'UConn Huskies', conference: 'Big East' },
  'connecticut': { normalized: 'UConn', fullName: 'UConn Huskies', conference: 'Big East' },
  'creighton': { normalized: 'Creighton', fullName: 'Creighton Bluejays', conference: 'Big East' },
  'creighton bluejays': { normalized: 'Creighton', fullName: 'Creighton Bluejays', conference: 'Big East' },
  "st. john's": { normalized: "St. John's", fullName: "St. John's Red Storm", conference: 'Big East' },
  "st. john's red storm": { normalized: "St. John's", fullName: "St. John's Red Storm", conference: 'Big East' },
  "st john's": { normalized: "St. John's", fullName: "St. John's Red Storm", conference: 'Big East' },
  'villanova': { normalized: 'Villanova', fullName: 'Villanova Wildcats', conference: 'Big East' },
  'villanova wildcats': { normalized: 'Villanova', fullName: 'Villanova Wildcats', conference: 'Big East' },
  'marquette': { normalized: 'Marquette', fullName: 'Marquette Golden Eagles', conference: 'Big East' },
  'marquette golden eagles': { normalized: 'Marquette', fullName: 'Marquette Golden Eagles', conference: 'Big East' },
  'xavier': { normalized: 'Xavier', fullName: 'Xavier Musketeers', conference: 'Big East' },
  'xavier musketeers': { normalized: 'Xavier', fullName: 'Xavier Musketeers', conference: 'Big East' },
  'butler': { normalized: 'Butler', fullName: 'Butler Bulldogs', conference: 'Big East' },
  'butler bulldogs': { normalized: 'Butler', fullName: 'Butler Bulldogs', conference: 'Big East' },
  'seton hall': { normalized: 'Seton Hall', fullName: 'Seton Hall Pirates', conference: 'Big East' },
  'seton hall pirates': { normalized: 'Seton Hall', fullName: 'Seton Hall Pirates', conference: 'Big East' },
  
  // Pac-12 / West Coast
  'arizona': { normalized: 'Arizona', fullName: 'Arizona Wildcats', conference: 'Big 12' },
  'arizona wildcats': { normalized: 'Arizona', fullName: 'Arizona Wildcats', conference: 'Big 12' },
  'arizona state': { normalized: 'Arizona State', fullName: 'Arizona State Sun Devils', conference: 'Big 12' },
  'arizona state sun devils': { normalized: 'Arizona State', fullName: 'Arizona State Sun Devils', conference: 'Big 12' },
  'asu': { normalized: 'Arizona State', fullName: 'Arizona State Sun Devils', conference: 'Big 12' },
  'ucla': { normalized: 'UCLA', fullName: 'UCLA Bruins', conference: 'Big Ten' },
  'ucla bruins': { normalized: 'UCLA', fullName: 'UCLA Bruins', conference: 'Big Ten' },
  'usc': { normalized: 'USC', fullName: 'USC Trojans', conference: 'Big Ten' },
  'usc trojans': { normalized: 'USC', fullName: 'USC Trojans', conference: 'Big Ten' },
  'oregon': { normalized: 'Oregon', fullName: 'Oregon Ducks', conference: 'Big Ten' },
  'oregon ducks': { normalized: 'Oregon', fullName: 'Oregon Ducks', conference: 'Big Ten' },
  'gonzaga': { normalized: 'Gonzaga', fullName: 'Gonzaga Bulldogs', conference: 'WCC' },
  'gonzaga bulldogs': { normalized: 'Gonzaga', fullName: 'Gonzaga Bulldogs', conference: 'WCC' },
  "saint mary's": { normalized: "Saint Mary's", fullName: "Saint Mary's Gaels", conference: 'WCC' },
  "saint mary's gaels": { normalized: "Saint Mary's", fullName: "Saint Mary's Gaels", conference: 'WCC' },
  "st. mary's": { normalized: "Saint Mary's", fullName: "Saint Mary's Gaels", conference: 'WCC' },
  
  // Additional notable teams
  'houston': { normalized: 'Houston', fullName: 'Houston Cougars', conference: 'Big 12' },
  'houston cougars': { normalized: 'Houston', fullName: 'Houston Cougars', conference: 'Big 12' },
  'cincinnati': { normalized: 'Cincinnati', fullName: 'Cincinnati Bearcats', conference: 'Big 12' },
  'cincinnati bearcats': { normalized: 'Cincinnati', fullName: 'Cincinnati Bearcats', conference: 'Big 12' },
  'notre dame': { normalized: 'Notre Dame', fullName: 'Notre Dame Fighting Irish', conference: 'ACC' },
  'notre dame fighting irish': { normalized: 'Notre Dame', fullName: 'Notre Dame Fighting Irish', conference: 'ACC' },
  'memphis': { normalized: 'Memphis', fullName: 'Memphis Tigers', conference: 'AAC' },
  'memphis tigers': { normalized: 'Memphis', fullName: 'Memphis Tigers', conference: 'AAC' },
  'san diego state': { normalized: 'San Diego State', fullName: 'San Diego State Aztecs', conference: 'MWC' },
  'san diego state aztecs': { normalized: 'San Diego State', fullName: 'San Diego State Aztecs', conference: 'MWC' },
  'sdsu': { normalized: 'San Diego State', fullName: 'San Diego State Aztecs', conference: 'MWC' },
  
  // Smaller schools that appear in data
  'toledo': { normalized: 'Toledo', fullName: 'Toledo Rockets', conference: 'MAC' },
  'toledo rockets': { normalized: 'Toledo', fullName: 'Toledo Rockets', conference: 'MAC' },
  'troy': { normalized: 'Troy', fullName: 'Troy Trojans', conference: 'Sun Belt' },
  'troy trojans': { normalized: 'Troy', fullName: 'Troy Trojans', conference: 'Sun Belt' },
  'towson': { normalized: 'Towson', fullName: 'Towson Tigers', conference: 'CAA' },
  'towson tigers': { normalized: 'Towson', fullName: 'Towson Tigers', conference: 'CAA' },
  'rhode island': { normalized: 'Rhode Island', fullName: 'Rhode Island Rams', conference: 'A-10' },
  'rhode island rams': { normalized: 'Rhode Island', fullName: 'Rhode Island Rams', conference: 'A-10' },
  'uri': { normalized: 'Rhode Island', fullName: 'Rhode Island Rams', conference: 'A-10' },
  'stony brook': { normalized: 'Stony Brook', fullName: 'Stony Brook Seawolves', conference: 'CAA' },
  'stony brook seawolves': { normalized: 'Stony Brook', fullName: 'Stony Brook Seawolves', conference: 'CAA' },
  'pacific': { normalized: 'Pacific', fullName: 'Pacific Tigers', conference: 'WCC' },
  'pacific tigers': { normalized: 'Pacific', fullName: 'Pacific Tigers', conference: 'WCC' },
  'bowling green': { normalized: 'Bowling Green', fullName: 'Bowling Green Falcons', conference: 'MAC' },
  'bowling green falcons': { normalized: 'Bowling Green', fullName: 'Bowling Green Falcons', conference: 'MAC' },
  'bucknell': { normalized: 'Bucknell', fullName: 'Bucknell Bison', conference: 'Patriot' },
  'bucknell bison': { normalized: 'Bucknell', fullName: 'Bucknell Bison', conference: 'Patriot' },
  'massachusetts': { normalized: 'UMass', fullName: 'UMass Minutemen', conference: 'A-10' },
  'umass': { normalized: 'UMass', fullName: 'UMass Minutemen', conference: 'A-10' },
  'umass minutemen': { normalized: 'UMass', fullName: 'UMass Minutemen', conference: 'A-10' },
  'texas a&m commerce': { normalized: 'Texas A&M Commerce', fullName: 'Texas A&M Commerce Lions', conference: 'Southland' },
  'texas a&m commerce lions': { normalized: 'Texas A&M Commerce', fullName: 'Texas A&M Commerce Lions', conference: 'Southland' },
  'fairleigh dickinson': { normalized: 'Fairleigh Dickinson', fullName: 'Fairleigh Dickinson Knights', conference: 'NEC' },
  'fairleigh dickinson knights': { normalized: 'Fairleigh Dickinson', fullName: 'Fairleigh Dickinson Knights', conference: 'NEC' },
  'oregon state': { normalized: 'Oregon State', fullName: 'Oregon State Beavers', conference: 'Pac-12' },
  'oregon state beavers': { normalized: 'Oregon State', fullName: 'Oregon State Beavers', conference: 'Pac-12' },
  'rutgers scarlet': { normalized: 'Rutgers', fullName: 'Rutgers Scarlet Knights', conference: 'Big Ten' },
  'uab': { normalized: 'UAB', fullName: 'UAB Blazers', conference: 'AAC' },
  'uab blazers': { normalized: 'UAB', fullName: 'UAB Blazers', conference: 'AAC' },
  'southern illinois': { normalized: 'Southern Illinois', fullName: 'Southern Illinois Salukis', conference: 'MVC' },
  'southern illinois salukis': { normalized: 'Southern Illinois', fullName: 'Southern Illinois Salukis', conference: 'MVC' },
  'bethune cookman': { normalized: 'Bethune Cookman', fullName: 'Bethune Cookman Wildcats', conference: 'SWAC' },
  'bethune cookman wildcats': { normalized: 'Bethune Cookman', fullName: 'Bethune Cookman Wildcats', conference: 'SWAC' },
  'belmont': { normalized: 'Belmont', fullName: 'Belmont Bruins', conference: 'MVC' },
  'belmont bruins': { normalized: 'Belmont', fullName: 'Belmont Bruins', conference: 'MVC' },
  'st. francis red flash': { normalized: 'St. Francis', fullName: 'St. Francis Red Flash', conference: 'NEC' },
  'st francis red flash': { normalized: 'St. Francis', fullName: 'St. Francis Red Flash', conference: 'NEC' },
  'vmi': { normalized: 'VMI', fullName: 'VMI Keydets', conference: 'SoCon' },
  'vmi keydets': { normalized: 'VMI', fullName: 'VMI Keydets', conference: 'SoCon' },
  'buffalo': { normalized: 'Buffalo', fullName: 'Buffalo Bulls', conference: 'MAC' },
  'buffalo bulls': { normalized: 'Buffalo', fullName: 'Buffalo Bulls', conference: 'MAC' },
  'seton hall pirates': { normalized: 'Seton Hall', fullName: 'Seton Hall Pirates', conference: 'Big East' },
  'wisconsin green bay': { normalized: 'Wisconsin Green Bay', fullName: 'Wisconsin Green Bay Phoenix', conference: 'Horizon' },
  'wisconsin green bay phoenix': { normalized: 'Wisconsin Green Bay', fullName: 'Wisconsin Green Bay Phoenix', conference: 'Horizon' },
  'iona': { normalized: 'Iona', fullName: 'Iona Gaels', conference: 'MAAC' },
  'iona gaels': { normalized: 'Iona', fullName: 'Iona Gaels', conference: 'MAAC' },
  'grambling state': { normalized: 'Grambling State', fullName: 'Grambling State Tigers', conference: 'SWAC' },
  'grambling state tigers': { normalized: 'Grambling State', fullName: 'Grambling State Tigers', conference: 'SWAC' },
  'uc riverside': { normalized: 'UC Riverside', fullName: 'UC Riverside Highlanders', conference: 'Big West' },
  'uc riverside highlanders': { normalized: 'UC Riverside Highlanders', fullName: 'UC Riverside Highlanders', conference: 'Big West' },
  'oakland golden': { normalized: 'Oakland', fullName: 'Oakland Golden Grizzlies', conference: 'Horizon' },
  'oakland golden grizzlies': { normalized: 'Oakland', fullName: 'Oakland Golden Grizzlies', conference: 'Horizon' },
  'lamar': { normalized: 'Lamar', fullName: 'Lamar Cardinals', conference: 'Southland' },
  'lamar cardinals': { normalized: 'Lamar', fullName: 'Lamar Cardinals', conference: 'Southland' },
  'william & mary': { normalized: 'William & Mary', fullName: 'William & Mary Tribe', conference: 'CAA' },
  'william & mary tribe': { normalized: 'William & Mary', fullName: 'William & Mary Tribe', conference: 'CAA' },
  'utep': { normalized: 'UTEP', fullName: 'UTEP Miners', conference: 'CUSA' },
  'utep miners': { normalized: 'UTEP', fullName: 'UTEP Miners', conference: 'CUSA' },
  'temple': { normalized: 'Temple', fullName: 'Temple Owls', conference: 'AAC' },
  'temple owls': { normalized: 'Temple', fullName: 'Temple Owls', conference: 'AAC' },
  'uc san diego': { normalized: 'UC San Diego', fullName: 'UC San Diego Tritons', conference: 'Big West' },
  'uc san diego tritons': { normalized: 'UC San Diego', fullName: 'UC San Diego Tritons', conference: 'Big West' },
  'kennesaw state': { normalized: 'Kennesaw State', fullName: 'Kennesaw State Owls', conference: 'CUSA' },
  'kennesaw state owls': { normalized: 'Kennesaw State', fullName: 'Kennesaw State Owls', conference: 'CUSA' },
  'rice': { normalized: 'Rice', fullName: 'Rice Owls', conference: 'AAC' },
  'rice owls': { normalized: 'Rice', fullName: 'Rice Owls', conference: 'AAC' },
  'mtsu': { normalized: 'MTSU', fullName: 'MTSU Blue Raiders', conference: 'CUSA' },
  'mtsu blue raiders': { normalized: 'MTSU', fullName: 'MTSU Blue Raiders', conference: 'CUSA' },
  'middle tennessee': { normalized: 'MTSU', fullName: 'MTSU Blue Raiders', conference: 'CUSA' },
  'oregon state': { normalized: 'Oregon State', fullName: 'Oregon State Beavers', conference: 'WCC' },
  'oregon state beavers': { normalized: 'Oregon State', fullName: 'Oregon State Beavers', conference: 'WCC' },
  'vermont': { normalized: 'Vermont', fullName: 'Vermont Catamounts', conference: 'America East' },
  'vermont catamounts': { normalized: 'Vermont', fullName: 'Vermont Catamounts', conference: 'America East' },
  'liberty': { normalized: 'Liberty', fullName: 'Liberty Flames', conference: 'CUSA' },
  'liberty flames': { normalized: 'Liberty', fullName: 'Liberty Flames', conference: 'CUSA' },
  'belmont': { normalized: 'Belmont', fullName: 'Belmont Bruins', conference: 'MVC' },
  'belmont bruins': { normalized: 'Belmont', fullName: 'Belmont Bruins', conference: 'MVC' },
  'uab': { normalized: 'UAB', fullName: 'UAB Blazers', conference: 'AAC' },
  'uab blazers': { normalized: 'UAB', fullName: 'UAB Blazers', conference: 'AAC' },
  'southern illinois': { normalized: 'Southern Illinois', fullName: 'Southern Illinois Salukis', conference: 'MVC' },
  'southern illinois salukis': { normalized: 'Southern Illinois', fullName: 'Southern Illinois Salukis', conference: 'MVC' },
  'boise state': { normalized: 'Boise State', fullName: 'Boise State Broncos', conference: 'MWC' },
  'boise state broncos': { normalized: 'Boise State', fullName: 'Boise State Broncos', conference: 'MWC' },
  'temple': { normalized: 'Temple', fullName: 'Temple Owls', conference: 'AAC' },
  'temple owls': { normalized: 'Temple', fullName: 'Temple Owls', conference: 'AAC' },
  'uc san diego': { normalized: 'UC San Diego', fullName: 'UC San Diego Tritons', conference: 'Big West' },
  'uc san diego tritons': { normalized: 'UC San Diego', fullName: 'UC San Diego Tritons', conference: 'Big West' },
  
  // Additional teams for complete coverage
  'central connecticut': { normalized: 'Central Connecticut', fullName: 'Central Connecticut Blue Devils', conference: 'NEC' },
  'central connecticut blue devils': { normalized: 'Central Connecticut', fullName: 'Central Connecticut Blue Devils', conference: 'NEC' },
  'florida gulf coast': { normalized: 'Florida Gulf Coast', fullName: 'Florida Gulf Coast Eagles', conference: 'ASUN' },
  'florida gulf coast eagles': { normalized: 'Florida Gulf Coast', fullName: 'Florida Gulf Coast Eagles', conference: 'ASUN' },
  'fgcu': { normalized: 'Florida Gulf Coast', fullName: 'Florida Gulf Coast Eagles', conference: 'ASUN' },
  'missouri state': { normalized: 'Missouri State', fullName: 'Missouri State Bears', conference: 'MVC' },
  'missouri state bears': { normalized: 'Missouri State', fullName: 'Missouri State Bears', conference: 'MVC' },
  'arkansas state': { normalized: 'Arkansas State', fullName: 'Arkansas State Red Wolves', conference: 'Sun Belt' },
  'arkansas state red wolves': { normalized: 'Arkansas State', fullName: 'Arkansas State Red Wolves', conference: 'Sun Belt' },
  'georgia southern': { normalized: 'Georgia Southern', fullName: 'Georgia Southern Eagles', conference: 'Sun Belt' },
  'georgia southern eagles': { normalized: 'Georgia Southern', fullName: 'Georgia Southern Eagles', conference: 'Sun Belt' },
  'northern arizona': { normalized: 'Northern Arizona', fullName: 'Northern Arizona Lumberjacks', conference: 'Big Sky' },
  'northern arizona lumberjacks': { normalized: 'Northern Arizona', fullName: 'Northern Arizona Lumberjacks', conference: 'Big Sky' },
  'mcneese': { normalized: 'McNeese', fullName: 'McNeese Cowboys', conference: 'Southland' },
  'mcneese state cowboys': { normalized: 'McNeese', fullName: 'McNeese Cowboys', conference: 'Southland' },
  'mcneese cowboys': { normalized: 'McNeese', fullName: 'McNeese Cowboys', conference: 'Southland' },
  'bradley': { normalized: 'Bradley', fullName: 'Bradley Braves', conference: 'MVC' },
  'bradley braves': { normalized: 'Bradley', fullName: 'Bradley Braves', conference: 'MVC' },
  'bradley university braves': { normalized: 'Bradley', fullName: 'Bradley Braves', conference: 'MVC' },
  'appalachian state': { normalized: 'Appalachian State', fullName: 'Appalachian State Mountaineers', conference: 'Sun Belt' },
  'appalachian state mountaineers': { normalized: 'Appalachian State', fullName: 'Appalachian State Mountaineers', conference: 'Sun Belt' },
  'evansville': { normalized: 'Evansville', fullName: 'Evansville Purple Aces', conference: 'MVC' },
  'evansville purple aces': { normalized: 'Evansville', fullName: 'Evansville Purple Aces', conference: 'MVC' },
  'holy cross': { normalized: 'Holy Cross', fullName: 'Holy Cross Crusaders', conference: 'Patriot' },
  'holy cross crusaders': { normalized: 'Holy Cross', fullName: 'Holy Cross Crusaders', conference: 'Patriot' },
  'fiu': { normalized: 'FIU', fullName: 'FIU Golden Panthers', conference: 'CUSA' },
  'fiu golden': { normalized: 'FIU', fullName: 'FIU Golden Panthers', conference: 'FIU' },
  'fiu golden panthers': { normalized: 'FIU', fullName: 'FIU Golden Panthers', conference: 'CUSA' },
  'florida international': { normalized: 'FIU', fullName: 'FIU Golden Panthers', conference: 'CUSA' },
  'florida atlantic': { normalized: 'Florida Atlantic', fullName: 'Florida Atlantic Owls', conference: 'AAC' },
  'florida atlantic owls': { normalized: 'Florida Atlantic', fullName: 'Florida Atlantic Owls', conference: 'AAC' },
  'fau': { normalized: 'Florida Atlantic', fullName: 'Florida Atlantic Owls', conference: 'AAC' },
  'oral roberts': { normalized: 'Oral Roberts', fullName: 'Oral Roberts Golden Eagles', conference: 'Summit' },
  'oral roberts golden': { normalized: 'Oral Roberts', fullName: 'Oral Roberts Golden Eagles', conference: 'Summit' },
  'oral roberts golden eagles': { normalized: 'Oral Roberts', fullName: 'Oral Roberts Golden Eagles', conference: 'Summit' },
  'charleston': { normalized: 'Charleston', fullName: 'Charleston Cougars', conference: 'CAA' },
  'charleston cougars': { normalized: 'Charleston', fullName: 'Charleston Cougars', conference: 'CAA' },
  'siena': { normalized: 'Siena', fullName: 'Siena Saints', conference: 'MAAC' },
  'siena saints': { normalized: 'Siena', fullName: 'Siena Saints', conference: 'MAAC' },
  'george mason': { normalized: 'George Mason', fullName: 'George Mason Patriots', conference: 'A-10' },
  'george mason patriots': { normalized: 'George Mason', fullName: 'George Mason Patriots', conference: 'A-10' },
  'ohio': { normalized: 'Ohio', fullName: 'Ohio Bobcats', conference: 'MAC' },
  'ohio bobcats': { normalized: 'Ohio', fullName: 'Ohio Bobcats', conference: 'MAC' },
  'elon': { normalized: 'Elon', fullName: 'Elon Phoenix', conference: 'CAA' },
  'elon phoenix': { normalized: 'Elon', fullName: 'Elon Phoenix', conference: 'CAA' },
  'youngstown state': { normalized: 'Youngstown State', fullName: 'Youngstown State Penguins', conference: 'Horizon' },
  'youngstown state penguins': { normalized: 'Youngstown State', fullName: 'Youngstown State Penguins', conference: 'Horizon' },
  'james madison': { normalized: 'James Madison', fullName: 'James Madison Dukes', conference: 'Sun Belt' },
  'james madison dukes': { normalized: 'James Madison', fullName: 'James Madison Dukes', conference: 'Sun Belt' },
  'umkc': { normalized: 'UMKC', fullName: 'UMKC Kangaroos', conference: 'Summit' },
  'umkc kangarros': { normalized: 'UMKC', fullName: 'UMKC Kangaroos', conference: 'Summit' },
  'umkc kangaroos': { normalized: 'UMKC', fullName: 'UMKC Kangaroos', conference: 'Summit' },
  'lindenwood': { normalized: 'Lindenwood', fullName: 'Lindenwood Lions', conference: 'OVC' },
  'lindenwood lions': { normalized: 'Lindenwood', fullName: 'Lindenwood Lions', conference: 'OVC' },
  'sacred heart': { normalized: 'Sacred Heart', fullName: 'Sacred Heart Pioneers', conference: 'MAAC' },
  'sacred heart pioneers': { normalized: 'Sacred Heart', fullName: 'Sacred Heart Pioneers', conference: 'MAAC' },
  'princeton': { normalized: 'Princeton', fullName: 'Princeton Tigers', conference: 'Ivy' },
  'princeton tigers': { normalized: 'Princeton', fullName: 'Princeton Tigers', conference: 'Ivy' },
  'new orleans': { normalized: 'New Orleans', fullName: 'New Orleans Privateers', conference: 'Southland' },
  'new orleans privateers': { normalized: 'New Orleans', fullName: 'New Orleans Privateers', conference: 'Southland' },
  'murray state': { normalized: 'Murray State', fullName: 'Murray State Racers', conference: 'MVC' },
  'murray state racers': { normalized: 'Murray State', fullName: 'Murray State Racers', conference: 'MVC' },
  'yale': { normalized: 'Yale', fullName: 'Yale Bulldogs', conference: 'Ivy' },
  'yale bulldogs': { normalized: 'Yale', fullName: 'Yale Bulldogs', conference: 'Ivy' },
  'akron': { normalized: 'Akron', fullName: 'Akron Zips', conference: 'MAC' },
  'akron zips': { normalized: 'Akron', fullName: 'Akron Zips', conference: 'MAC' },
  'liu': { normalized: 'LIU', fullName: 'LIU Sharks', conference: 'NEC' },
  'liu sharks': { normalized: 'LIU', fullName: 'LIU Sharks', conference: 'NEC' },
  'long island': { normalized: 'LIU', fullName: 'LIU Sharks', conference: 'NEC' },
  'jacksonville state': { normalized: 'Jacksonville State', fullName: 'Jacksonville State Gamecocks', conference: 'CUSA' },
  'jacksonville state gamecocks': { normalized: 'Jacksonville State', fullName: 'Jacksonville State Gamecocks', conference: 'CUSA' },
  'cal poly': { normalized: 'Cal Poly', fullName: 'Cal Poly Mustangs', conference: 'Big West' },
  'cal poly mustangs': { normalized: 'Cal Poly', fullName: 'Cal Poly Mustangs', conference: 'Big West' },
  'utrgv': { normalized: 'UTRGV', fullName: 'UTRGV Vaqueros', conference: 'WAC' },
  'utrgv vaqueros': { normalized: 'UTRGV', fullName: 'UTRGV Vaqueros', conference: 'WAC' },
  'illinois fighting': { normalized: 'Illinois', fullName: 'Illinois Fighting Illini', conference: 'Big Ten' },
  'jackson state': { normalized: 'Jackson State', fullName: 'Jackson State Tigers', conference: 'SWAC' },
  'jackson state tigers': { normalized: 'Jackson State', fullName: 'Jackson State Tigers', conference: 'SWAC' },
  'winthrop': { normalized: 'Winthrop', fullName: 'Winthrop Eagles', conference: 'Big South' },
  'winthrop eagles': { normalized: 'Winthrop', fullName: 'Winthrop Eagles', conference: 'Big South' },
  'davidson': { normalized: 'Davidson', fullName: 'Davidson Wildcats', conference: 'A-10' },
  'davidson wildcats': { normalized: 'Davidson', fullName: 'Davidson Wildcats', conference: 'A-10' },
  'utah state': { normalized: 'Utah State', fullName: 'Utah State Aggies', conference: 'MWC' },
  'utah state aggies': { normalized: 'Utah State', fullName: 'Utah State Aggies', conference: 'MWC' },
  
  // Abbreviated forms used by Haslametrics
  'appalachian st.': { normalized: 'Appalachian State', fullName: 'Appalachian State Mountaineers', conference: 'Sun Belt' },
  'appalachian st': { normalized: 'Appalachian State', fullName: 'Appalachian State Mountaineers', conference: 'Sun Belt' },
  'bethune-cookman': { normalized: 'Bethune Cookman', fullName: 'Bethune Cookman Wildcats', conference: 'SWAC' },
  'youngstown st.': { normalized: 'Youngstown State', fullName: 'Youngstown State Penguins', conference: 'Horizon' },
  'youngstown st': { normalized: 'Youngstown State', fullName: 'Youngstown State Penguins', conference: 'Horizon' },
  'mississippi st.': { normalized: 'Mississippi State', fullName: 'Mississippi State Bulldogs', conference: 'SEC' },
  'mississippi st': { normalized: 'Mississippi State', fullName: 'Mississippi State Bulldogs', conference: 'SEC' },
  'abil. christian': { normalized: 'Abilene Christian', fullName: 'Abilene Christian Wildcats', conference: 'WAC' },
  'abilene christian': { normalized: 'Abilene Christian', fullName: 'Abilene Christian Wildcats', conference: 'WAC' },
  'abilene christian wildcats': { normalized: 'Abilene Christian', fullName: 'Abilene Christian Wildcats', conference: 'WAC' },
  'fair. dickinson': { normalized: 'Fairleigh Dickinson', fullName: 'Fairleigh Dickinson Knights', conference: 'NEC' },
  'g. washington': { normalized: 'George Washington', fullName: 'George Washington Colonials', conference: 'A-10' },
  'ga southern': { normalized: 'Georgia Southern', fullName: 'Georgia Southern Eagles', conference: 'Sun Belt' },
  'louisiana lafayette': { normalized: 'Louisiana', fullName: 'Louisiana Ragin Cajuns', conference: 'Sun Belt' },
  'louisiana ragin cajuns': { normalized: 'Louisiana', fullName: 'Louisiana Ragin Cajuns', conference: 'Sun Belt' },
  'ul lafayette': { normalized: 'Louisiana', fullName: 'Louisiana Ragin Cajuns', conference: 'Sun Belt' },
  'ull': { normalized: 'Louisiana', fullName: 'Louisiana Ragin Cajuns', conference: 'Sun Belt' },
  'louisiana-lafayette': { normalized: 'Louisiana', fullName: 'Louisiana Ragin Cajuns', conference: 'Sun Belt' },
  'uc davis': { normalized: 'UC Davis', fullName: 'UC Davis Aggies', conference: 'Big West' },
  'uc davis aggies': { normalized: 'UC Davis', fullName: 'UC Davis Aggies', conference: 'Big West' },
  'california davis': { normalized: 'UC Davis', fullName: 'UC Davis Aggies', conference: 'Big West' },
  'southern miss': { normalized: 'Southern Miss', fullName: 'Southern Miss Golden Eagles', conference: 'Sun Belt' },
  'southern miss golden': { normalized: 'Southern Miss', fullName: 'Southern Miss Golden Eagles', conference: 'Sun Belt' },
  'southern miss golden eagles': { normalized: 'Southern Miss', fullName: 'Southern Miss Golden Eagles', conference: 'Sun Belt' },
  'usm': { normalized: 'Southern Miss', fullName: 'Southern Miss Golden Eagles', conference: 'Sun Belt' },
  'tennessee-martin': { normalized: 'Tennessee Martin', fullName: 'Tennessee Martin Skyhawks', conference: 'OVC' },
  'tennessee martin': { normalized: 'Tennessee Martin', fullName: 'Tennessee Martin Skyhawks', conference: 'OVC' },
  'tennessee martin skyhawks': { normalized: 'Tennessee Martin', fullName: 'Tennessee Martin Skyhawks', conference: 'OVC' },
  'ut martin': { normalized: 'Tennessee Martin', fullName: 'Tennessee Martin Skyhawks', conference: 'OVC' },
  'illinois state': { normalized: 'Illinois State', fullName: 'Illinois State Redbirds', conference: 'MVC' },
  'illinois state redbirds': { normalized: 'Illinois State', fullName: 'Illinois State Redbirds', conference: 'MVC' },
  'coastal carolina': { normalized: 'Coastal Carolina', fullName: 'Coastal Carolina Chanticleers', conference: 'Sun Belt' },
  'coastal carolina chanticleers': { normalized: 'Coastal Carolina', fullName: 'Coastal Carolina Chanticleers', conference: 'Sun Belt' },
  'queens': { normalized: 'Queens', fullName: 'Queens Royals', conference: 'ASUN' },
  'queens royals': { normalized: 'Queens', fullName: 'Queens Royals', conference: 'ASUN' },
  'furman': { normalized: 'Furman', fullName: 'Furman Paladins', conference: 'SoCon' },
  'furman paladins': { normalized: 'Furman', fullName: 'Furman Paladins', conference: 'SoCon' },
  'iupui': { normalized: 'IUPUI', fullName: 'IUPUI Jaguars', conference: 'Horizon' },
  'iupui jaguars': { normalized: 'IUPUI', fullName: 'IUPUI Jaguars', conference: 'Horizon' },
  'air force': { normalized: 'Air Force', fullName: 'Air Force Falcons', conference: 'MWC' },
  'air force falcons': { normalized: 'Air Force', fullName: 'Air Force Falcons', conference: 'MWC' },
  'south carolina': { normalized: 'South Carolina', fullName: 'South Carolina Gamecocks', conference: 'SEC' },
  'south carolina gamecocks': { normalized: 'South Carolina', fullName: 'South Carolina Gamecocks', conference: 'SEC' },
  'north dakota': { normalized: 'North Dakota', fullName: 'North Dakota Fighting Hawks', conference: 'Summit' },
  'north dakota fighting': { normalized: 'North Dakota', fullName: 'North Dakota Fighting Hawks', conference: 'Summit' },
  'north dakota fighting hawks': { normalized: 'North Dakota', fullName: 'North Dakota Fighting Hawks', conference: 'Summit' },
  'western illinois': { normalized: 'Western Illinois', fullName: 'Western Illinois Leathernecks', conference: 'OVC' },
  'western illinois leathernecks': { normalized: 'Western Illinois', fullName: 'Western Illinois Leathernecks', conference: 'OVC' },
  'mercyhurst': { normalized: 'Mercyhurst', fullName: 'Mercyhurst Lakers', conference: 'NEC' },
  'mercyhurst lakers': { normalized: 'Mercyhurst', fullName: 'Mercyhurst Lakers', conference: 'NEC' },
  'marshall': { normalized: 'Marshall', fullName: 'Marshall Thundering Herd', conference: 'Sun Belt' },
  'marshall thundering herd': { normalized: 'Marshall', fullName: 'Marshall Thundering Herd', conference: 'Sun Belt' },
  'tulane': { normalized: 'Tulane', fullName: 'Tulane Green Wave', conference: 'AAC' },
  'tulane green wave': { normalized: 'Tulane', fullName: 'Tulane Green Wave', conference: 'AAC' },
  'boston college': { normalized: 'Boston College', fullName: 'Boston College Eagles', conference: 'ACC' },
  'boston college eagles': { normalized: 'Boston College', fullName: 'Boston College Eagles', conference: 'ACC' },
  'bryant': { normalized: 'Bryant', fullName: 'Bryant Bulldogs', conference: 'America East' },
  'bryant bulldogs': { normalized: 'Bryant', fullName: 'Bryant Bulldogs', conference: 'America East' },
  'detroit': { normalized: 'Detroit', fullName: 'Detroit Titans', conference: 'Horizon' },
  'detroit titans': { normalized: 'Detroit', fullName: 'Detroit Titans', conference: 'Horizon' },
  'depaul': { normalized: 'DePaul', fullName: 'DePaul Blue Demons', conference: 'Big East' },
  'depaul blue demons': { normalized: 'DePaul', fullName: 'DePaul Blue Demons', conference: 'Big East' },
  'unc greensboro': { normalized: 'UNC Greensboro', fullName: 'UNC Greensboro Spartans', conference: 'SoCon' },
  'unc greensboro spartans': { normalized: 'UNC Greensboro', fullName: 'UNC Greensboro Spartans', conference: 'SoCon' },
  'uncg': { normalized: 'UNC Greensboro', fullName: 'UNC Greensboro Spartans', conference: 'SoCon' },
  
  // Haslametrics abbreviated forms - CRITICAL FOR MATCHING
  's. illinois': { normalized: 'Southern Illinois', fullName: 'Southern Illinois Salukis', conference: 'MVC' },
  'n. arizona': { normalized: 'Northern Arizona', fullName: 'Northern Arizona Lumberjacks', conference: 'Big Sky' },
  'jacksonville st.': { normalized: 'Jacksonville State', fullName: 'Jacksonville State Gamecocks', conference: 'CUSA' },
  'jmu': { normalized: 'James Madison', fullName: 'James Madison Dukes', conference: 'Sun Belt' },
  'cent. conn. st.': { normalized: 'Central Connecticut', fullName: 'Central Connecticut Blue Devils', conference: 'NEC' },
  'ill. state': { normalized: 'Illinois State', fullName: 'Illinois State Redbirds', conference: 'MVC' },
  
  // Jacksonville vs Jacksonville State - DIFFERENT SCHOOLS!
  'jacksonville': { normalized: 'Jacksonville', fullName: 'Jacksonville Dolphins', conference: 'ASUN' },
  'jacksonville dolphins': { normalized: 'Jacksonville', fullName: 'Jacksonville Dolphins', conference: 'ASUN' },
  
  // Teams that appear in D-Ratings but not in today's Haslametrics games
  'connecticut': { normalized: 'UConn', fullName: 'Connecticut Huskies', conference: 'Big East' },
  'connecticut huskies': { normalized: 'UConn', fullName: 'Connecticut Huskies', conference: 'Big East' },
  'st. francis': { normalized: 'St. Francis', fullName: 'St. Francis Red Flash', conference: 'NEC' },
};

/**
 * Normalize team name to consistent format
 * @param {string} teamName - Raw team name from data source
 * @returns {string} - Normalized team name
 */
export function normalizeTeamName(teamName) {
  if (!teamName) return null;
  
  // Clean the input
  const cleaned = teamName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .replace(/[#0-9]+/g, '') // Remove rankings like "#1" or "#20"
    .replace(/\([^)]*\)/g, '') // Remove parentheses and contents like "(5-0)"
    .trim();
  
  // Direct lookup
  if (TEAM_MAP[cleaned]) {
    return TEAM_MAP[cleaned].normalized;
  }
  
  // Try partial matches (e.g., "Kansas" matches "Kansas Jayhawks")
  for (const [key, value] of Object.entries(TEAM_MAP)) {
    if (key.includes(cleaned) || cleaned.includes(key)) {
      return value.normalized;
    }
  }
  
  // If no match found, return titlecased version
  return teamName
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get full team information
 * @param {string} teamName - Raw or normalized team name
 * @returns {object|null} - Team info or null
 */
export function getTeamInfo(teamName) {
  const normalized = normalizeTeamName(teamName);
  if (!normalized) return null;
  
  // Find by normalized name
  for (const value of Object.values(TEAM_MAP)) {
    if (value.normalized === normalized) {
      return value;
    }
  }
  
  return null;
}

/**
 * Check if two team names refer to the same team
 * @param {string} team1 - First team name
 * @param {string} team2 - Second team name
 * @returns {boolean} - True if same team
 */
export function isSameTeam(team1, team2) {
  const norm1 = normalizeTeamName(team1);
  const norm2 = normalizeTeamName(team2);
  return norm1 && norm2 && norm1 === norm2;
}

export { TEAM_MAP };

