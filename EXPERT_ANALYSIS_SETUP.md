# Expert Analysis - GitHub Action Setup

## Overview

Expert analysis articles are now generated automatically via GitHub Actions using the Perplexity AI API. This eliminates the need for client-side API calls and ensures professional content is available when users visit the site.

## How It Works

### 1. Scheduled Generation
- **Schedule**: Daily at 9 AM ET (2 PM UTC) - before afternoon/evening games
- **Trigger**: GitHub Actions cron job
- **Process**:
  1. Fetch today's NHL games from schedule CSV
  2. For each game, generate 2-3 conversational analysis paragraphs
  3. Cache results in Firebase `perplexityCache` collection
  4. Results cached for 6 hours

### 2. Manual Generation
You can manually trigger article generation in two ways:

#### GitHub Actions UI:
1. Go to: https://github.com/dpk1212/nhl-savant/actions
2. Click "Generate Expert Analysis" workflow
3. Click "Run workflow" button
4. Select branch (main)
5. Click "Run workflow"

#### Local Command:
```bash
npm run generate-analysis
```

**Requirements for local run**:
- All Firebase environment variables set
- `PERPLEXITY_API_KEY` environment variable set

## Configuration

### Environment Variables (GitHub Secrets)

The following secrets must be configured in GitHub repository settings:

1. **Firebase Credentials**:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

2. **Perplexity API**:
   - `PERPLEXITY_API_KEY`

### Adding Secrets to GitHub:
1. Go to: https://github.com/dpk1212/nhl-savant/settings/secrets/actions
2. Click "New repository secret"
3. Add name and value
4. Click "Add secret"

## Files

### Workflow Configuration
- **File**: `.github/workflows/generate-expert-analysis.yml`
- **Purpose**: Defines the GitHub Actions workflow
- **Schedule**: `0 14 * * *` (9 AM ET / 2 PM UTC)
- **Permissions**: Read contents, write to Firebase

### Generation Script
- **File**: `scripts/generateExpertAnalysis.js`
- **Purpose**: Node.js script that generates and caches analysis
- **Features**:
  - Reads today's games from schedule CSV
  - Calls Perplexity API for each matchup
  - Parses and validates JSON response
  - Caches in Firebase with proper structure
  - Rate limiting (2 second delay between requests)
  - Detailed logging and error handling

## User Experience

### When Articles Available
- Premium styled Expert Analysis section
- Swipeable carousel with 2-3 paragraphs per game
- Rainbow gradient heading
- Sparkles icons and glowing animations
- Smooth transitions between articles

### When Articles Unavailable
- Shows professional "Waiting for Expert Articles" message
- Premium styled waiting state
- Explains articles are generated daily before games
- **NO GENERIC FILLER CONTENT**

## Monitoring

### GitHub Actions Logs
View execution logs at:
https://github.com/dpk1212/nhl-savant/actions/workflows/generate-expert-analysis.yml

Each run shows:
- ✅ Success count
- ❌ Failure count
- 📊 Total games processed
- Individual game generation status

### Firebase Cache
Check cached articles in Firestore:
- Collection: `perplexityCache`
- Document ID format: `{awayTeam}-{homeTeam}-{date}-{timeKey}`
- Fields:
  - `content`: JSON string of analysis cards
  - `timestamp`: Generation time
  - `awayTeam`: Away team code
  - `homeTeam`: Home team code
  - `timeKey`: 'morning' or 'pregame'
  - `generatedBy`: 'github-action'

## Troubleshooting

### Action Fails to Run
1. Check GitHub Actions logs for error details
2. Verify all secrets are set correctly
3. Ensure Firebase rules allow writes to `perplexityCache`
4. Check Perplexity API quota/limits

### No Articles Showing on Site
1. Verify action ran successfully (check logs)
2. Check Firebase for cached documents
3. Confirm document date matches today
4. Check browser console for errors

### Rate Limiting
- Script includes 2-second delay between requests
- Perplexity API has daily quota limits
- If rate limited, remaining games will be skipped

## Cost Considerations

### Perplexity API Costs
- Charged per 1000 tokens
- ~1000 tokens per game analysis
- Daily cost: ~15 games × 1000 tokens = 15,000 tokens
- Approximate monthly cost: $5-10 (varies by plan)

### Firebase Costs
- Firestore reads: Users load cached articles
- Firestore writes: GitHub Action writes once per game per day
- Storage: Minimal (text content only)
- Expected cost: Within free tier for moderate traffic

## Future Enhancements

Possible improvements:
1. Add morning update (different analysis angle)
2. Include injury reports from API
3. Add betting market analysis
4. Generate post-game recap articles
5. A/B test different analysis styles
6. Add article quality scoring
7. Implement retry logic for failed generations
8. Send notifications on action failures

## Support

For issues or questions:
1. Check GitHub Actions logs
2. Review Firebase console
3. Verify environment variables
4. Test locally with `npm run generate-analysis`
5. Contact repository maintainer

