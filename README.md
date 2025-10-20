# NHL Savant - Advanced Betting Analytics

A professional-grade static web application for NHL betting analysis, built with React and Vite. This tool uses advanced statistical models to identify betting edges through regression analysis and special teams mismatches.

## 🏒 Features

### Core Analytics
- **Expected Goals (xG) Analysis** - Quality-based scoring chance evaluation
- **PDO Regression Detection** - Identifies teams due for positive/negative regression
- **Special Teams Mismatches** - Finds elite power plays vs weak penalty kills
- **Per-60 Rate Statistics** - Normalized metrics for fair comparison
- **Situational Weighting** - 5v5 (77%), PP (12%), PK (11%) impact analysis

### Dashboard Pages
1. **Dashboard** - Top betting opportunities and league overview
2. **Team Analytics** - Deep dive into individual team performance
3. **Betting Opportunities** - Regression candidates and special teams mismatches
4. **Methodology** - Mathematical foundation and betting strategies

### Key Metrics
- **xG Differential per 60** - Expected goal difference
- **Shooting Efficiency** - Actual vs Expected goals ratio
- **Save Performance** - Goaltender performance vs expected
- **High Danger xG** - Slot and crease scoring chances
- **Score Adjusted xG** - Context-aware expected goals

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd nhl-savant

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Data Processing

The application processes NHL team statistics from CSV files, calculating:

- **Per-60 Rates**: All metrics normalized to 60-minute intervals
- **PDO Calculation**: Shooting% + Save% (100 = neutral)
- **Regression Scores**: Mathematical edge detection
- **Special Teams Analysis**: PP vs PK efficiency mismatches

## 🎯 Betting Strategy

### Regression Betting
- **Overperforming Teams** (PDO > 102, Shooting Eff > 1.1): BET UNDER/AGAINST
- **Underperforming Teams** (PDO < 98, Shooting Eff < 0.9): BET OVER/WITH

### Special Teams Mismatches
- Elite power plays vs weak penalty kills
- Focus on games with high penalty frequency
- Live betting opportunities during power plays

## 🛠️ Technology Stack

- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Papa Parse** - CSV data processing
- **Lucide React** - Icon library
- **Recharts** - Data visualization (ready for implementation)

## 📈 Performance Expectations

- **Win Rate**: 54-58% (Excellent performance)
- **Annual ROI**: 5-8% (Sustainable long-term)
- **Sample Size**: 100+ bets for statistical significance

## 🚨 Risk Management

- Never bet >5% of bankroll on single game
- Daily exposure limit = 15% of bankroll
- Stop loss = -10% of bankroll in 1 week
- Take profits at +20%, withdraw half

## 📝 Methodology

Based on advanced statistical analysis of NHL data:

1. **Expected Goals (xG)** - Quality-based scoring chance evaluation
2. **PDO Analysis** - Puck luck indicator for regression detection
3. **Situational Weighting** - Different game situations have different impacts
4. **Sample Size Requirements** - Minimum 10 games for statistical significance

## 🚀 Deployment

### GitHub Pages
```bash
# Deploy to GitHub Pages
npm run deploy
```

The application is configured for GitHub Pages deployment with the base path `/nhl-savant/`.

## 📊 Data Requirements

The application expects a CSV file named `teams.csv` in the `public/` directory with the following structure:
- Team abbreviations (NYI, NYR, TOR, etc.)
- Situational data (5v5, 5v4, 4v5, all, other)
- Advanced statistics (xG, Corsi, Fenwick, etc.)
- Per-game metrics for rate calculations

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── Dashboard.jsx
│   ├── TeamAnalytics.jsx
│   ├── BettingOpportunities.jsx
│   └── Methodology.jsx
├── utils/
│   └── dataProcessing.js # Core mathematical models
└── App.jsx             # Main application
```

### Key Files
- `src/utils/dataProcessing.js` - Mathematical models and calculations
- `public/teams.csv` - NHL team statistics data
- `vite.config.js` - Build configuration for GitHub Pages

## 📄 License

This project is for educational and personal use. Please ensure compliance with local gambling laws and regulations.

## ⚠️ Disclaimer

This tool is for educational purposes only. Sports betting involves risk, and past performance does not guarantee future results. Always bet responsibly and within your means.