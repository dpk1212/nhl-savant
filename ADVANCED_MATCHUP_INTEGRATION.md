# Advanced Matchup Card - Integration Guide

## ✅ Component Created

**File:** `src/components/AdvancedMatchupCard.tsx`

**White-Labeled Features:**
- ❌ No "Barttorvik" mentioned in UI
- ✅ Branded as "Advanced Statistical Analysis"  
- ✅ Footer: "Powered by NHL Savant Advanced Analytics"
- ✅ Premium dark theme matching brand
- ✅ Switch button to toggle offense/defense views
- ✅ Expandable full stats section
- ✅ Color-coded rankings & visual progress bars

---

## 📦 How to Integrate

### Step 1: Import the Component

```typescript
import { AdvancedMatchupCard } from '../components/AdvancedMatchupCard';
```

### Step 2: Use in Your Basketball Game Component

```typescript
// In your game card/detail component
<AdvancedMatchupCard
  barttorvik={game.barttorvik}  // From Firebase/matched games
  awayTeam={game.awayTeam}
  homeTeam={game.homeTeam}
/>
```

### Step 3: Conditional Rendering (Only Show if Data Exists)

```typescript
{game.barttorvik && (
  <div className="mt-6">
    <AdvancedMatchupCard
      barttorvik={game.barttorvik}
      awayTeam={game.awayTeam}
      homeTeam={game.homeTeam}
    />
  </div>
)}
```

---

## 🧪 Testing the Component

### Option 1: View Demo Page

```bash
# Add demo route to your router
/basketball/matchup-demo
```

Import: `src/components/AdvancedMatchupCard.demo.tsx`

### Option 2: Test with Real Firebase Data

```typescript
// Fetch basketball_bets collection
// Each bet document now has barttorvik object
const bet = await getDoc(doc(db, 'basketball_bets', betId));
const barttorvik = bet.data().barttorvik; // Will exist for new bets
```

---

## 📊 Data Structure Expected

```typescript
interface BarttorвikData {
  away: {
    rank: number;           // 1-365
    adjOff: number;         // Adjusted Offensive Efficiency
    adjDef: number;         // Adjusted Defensive Efficiency
    eFG_off: number;        // Effective FG% Offense
    eFG_def: number;        // Effective FG% Defense
    to_off: number;         // Turnover % Offense
    to_def: number;         // Turnover % Defense
    oreb_off: number;       // Offensive Rebound %
    oreb_def: number;       // Defensive Rebound %
    twoP_off: number;       // 2-Point FG%
    threeP_off: number;     // 3-Point FG%
  };
  home: {
    // Same structure as away
  };
  matchup: {
    rankAdvantage: 'away' | 'home';
    rankDiff: number;
    offAdvantage: 'away' | 'home';
    offDiff: string;
    defAdvantage: 'away' | 'home';
    awayOffVsHomeDef: string;
    homeOffVsAwayDef: string;
  };
}
```

---

## 🎨 Customization Options

### Change Colors

```typescript
// In AdvancedMatchupCard.tsx, update class names:

// Away team (currently blue)
text-blue-400 → text-your-color

// Home team (currently red)
text-red-400 → text-your-color

// Success indicators
text-emerald-400 → text-your-success-color
```

### Change Branding Text

```typescript
// Line 339-341 in AdvancedMatchupCard.tsx
<div className="text-xs text-gray-500 text-center">
  Powered by NHL Savant Advanced Analytics  // ← Change this
</div>
```

### Adjust Card Width

```typescript
// Wrap component with max-width class
<div className="max-w-2xl mx-auto">  // ← Adjust max-w-*
  <AdvancedMatchupCard ... />
</div>
```

---

## 🔧 Where to Add in Existing Pages

### Basketball Picks Page (`src/pages/Basketball.tsx`)

```typescript
{bets.map(bet => (
  <div key={bet.id} className="space-y-4">
    {/* Existing bet card UI */}
    <BetCard bet={bet} />
    
    {/* NEW: Advanced Matchup Card */}
    {bet.barttorvik && (
      <AdvancedMatchupCard
        barttorvik={bet.barttorvik}
        awayTeam={bet.game.awayTeam}
        homeTeam={bet.game.homeTeam}
      />
    )}
  </div>
))}
```

### Basketball Detail Modal/Page

```typescript
function BasketballDetailModal({ bet }) {
  return (
    <div>
      {/* Existing content: Odds, Prediction, Model Breakdown */}
      
      {/* NEW: Add after Model Breakdown section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Matchup Analysis</h3>
        {bet.barttorvik && (
          <AdvancedMatchupCard
            barttorvik={bet.barttorvik}
            awayTeam={bet.game.awayTeam}
            homeTeam={bet.game.homeTeam}
          />
        )}
      </div>
    </div>
  );
}
```

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] Component renders without errors
- [ ] Switch button toggles between offense/defense views
- [ ] Expand/collapse button works smoothly
- [ ] Rankings show correct color coding (Top 25 = Gold)
- [ ] Progress bars display correct percentages
- [ ] No "Barttorvik" text visible anywhere in UI
- [ ] Footer shows "Powered by NHL Savant Advanced Analytics"
- [ ] Component is responsive (mobile-friendly)
- [ ] Dark theme matches overall site design
- [ ] Icons (Lucide React) render correctly

---

## 📱 Mobile Responsiveness

Component is mobile-friendly by default:
- Stacks vertically on small screens
- Text scales appropriately
- Touch-friendly button sizes
- Horizontal scroll prevented

For additional mobile optimization:

```typescript
<div className="md:max-w-2xl mx-auto">  // Max width only on desktop
  <AdvancedMatchupCard ... />
</div>
```

---

## 🚀 Next Steps

1. **Test Component** - Use demo file to verify rendering
2. **Integrate into Basketball Page** - Add to bet cards
3. **Test with Real Data** - Verify all 50 games display correctly
4. **Mobile Testing** - Check responsive behavior
5. **Deploy** - Push to production

---

## 🐛 Troubleshooting

### "barttorvik is undefined"
**Solution:** Bets written before Barttorvik integration won't have this data. Only new bets (after integration) will have it.

```typescript
// Always check if data exists
{bet.barttorvik ? (
  <AdvancedMatchupCard ... />
) : (
  <div className="text-gray-500 text-sm">
    Advanced stats unavailable for this game
  </div>
)}
```

### Icons not rendering
**Solution:** Install lucide-react if not already installed

```bash
npm install lucide-react
```

### Tailwind classes not working
**Solution:** Ensure component path is in `tailwind.config.js`

```javascript
content: [
  "./src/**/*.{js,jsx,ts,tsx}",  // ← Should include .tsx files
],
```

---

## 📊 Analytics Integration (Optional)

Track user engagement with the component:

```typescript
// Add to switch button
onClick={() => {
  setView(isAwayOffView ? 'homeOff_awayDef' : 'awayOff_homeDef');
  // Track event
  analytics.track('matchup_view_switched', {
    game: `${awayTeam} @ ${homeTeam}`,
    newView: view
  });
}}

// Add to expand button
onClick={() => {
  setExpanded(!expanded);
  // Track event
  analytics.track('matchup_stats_expanded', {
    game: `${awayTeam} @ ${homeTeam}`,
    expanded: !expanded
  });
}}
```

---

**Component Status:** ✅ Ready for Integration

**Estimated Integration Time:** 30 minutes - 1 hour

**Files Created:**
- `src/components/AdvancedMatchupCard.tsx` (main component)
- `src/components/AdvancedMatchupCard.demo.tsx` (demo/test)
- `ADVANCED_MATCHUP_INTEGRATION.md` (this file)


