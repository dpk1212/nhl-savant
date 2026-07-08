#!/usr/bin/env bash
# Restore ~/.xurl (the X API OAuth token store) from the XURL_TOKENS_B64
# Cloud Agent secret, so xurl / the X MCP bridge work headlessly in cloud runs.
#
# One-time setup (on the machine where xurl is already logged in):
#   base64 -w0 ~/.xurl        # macOS: base64 -i ~/.xurl | tr -d '\n'
# Paste the output as a Runtime Secret named XURL_TOKENS_B64 in
# Cursor dashboard -> Cloud Agents -> Secrets (scope it to this repo).
#
# Usage in a cloud run:  bash scripts/restore_xurl.sh
set -euo pipefail

if [ -s "$HOME/.xurl" ]; then
  echo "~/.xurl already exists - leaving it alone."
  exit 0
fi

if [ -z "${XURL_TOKENS_B64:-}" ]; then
  echo "ERROR: XURL_TOKENS_B64 is not set." >&2
  echo "Add it in Cursor dashboard -> Cloud Agents -> Secrets." >&2
  echo "Value = base64 of the ~/.xurl file from a logged-in machine." >&2
  exit 1
fi

umask 077
printf '%s' "$XURL_TOKENS_B64" | base64 -d > "$HOME/.xurl"
echo "Restored ~/.xurl ($(wc -c < "$HOME/.xurl") bytes)."

# Sanity check: shows registered app + token presence, no API credits spent.
npx -y @xdevplatform/xurl auth status || true
