#!/bin/bash

# Push the recency weighting changes to GitHub

echo "🚀 PUSHING TO GITHUB..."
echo "========================================"

cd "/Users/dalekolnitys/NHL Savant/nhl-savant"

# Push to GitHub
git push origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "========================================"
  echo "✅ PUSH SUCCESSFUL!"
  echo "========================================"
  echo ""
  echo "Changes are now on GitHub!"
  echo ""
  echo "🎯 NEXT STEPS:"
  echo "  1. Build: npm run build"
  echo "  2. Deploy: npm run deploy"
  echo "  3. Verify in browser console"
  echo ""
else
  echo ""
  echo "========================================"
  echo "❌ PUSH FAILED"
  echo "========================================"
  echo ""
  echo "Common issues:"
  echo "  1. Not authenticated (run: git config credential.helper store)"
  echo "  2. SSH key not configured"
  echo "  3. No internet connection"
  echo ""
  echo "Try again or use GitHub Desktop app"
  echo ""
fi

