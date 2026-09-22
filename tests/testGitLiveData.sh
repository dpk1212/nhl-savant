#!/usr/bin/env bash
# Local bare-repo check for scripts/lib/gitLiveData.sh.
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
TMP=$(mktemp -d)
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

BARE="$TMP/remote.git"
git init --bare -q "$BARE"
export GIT_REMOTE_URL="$BARE"
export GH_TOKEN=test
export GH_REPO=test/test
# shellcheck disable=SC1091
source "$ROOT/scripts/lib/gitLiveData.sh"

WORKDIR="$TMP/work"
mkdir -p "$WORKDIR/public"
cd "$WORKDIR"

clone_branch "$TMP/live" live-data 1
printf '%s\n' '{"updatedAt":"2026-09-22T00:00:00Z"}' > public/odds_heartbeat.json
printf '%s\n' '{"points":[1]}' > public/pinnacle_history.json
push_files_to_branch "$TMP/live" live-data "odds_heartbeat.json pinnacle_history.json" "Odds cycle"

# Second clone sees the tape (what the next odds cycle refreshes from).
clone_branch "$TMP/live2" live-data 0
test -f "$TMP/live2/pinnacle_history.json"
grep -q '"points":\[1\]' "$TMP/live2/pinnacle_history.json"

# Append-style refresh: copy remote tape into public/, then push a longer tape.
printf '%s\n' '{"points":[1,2]}' > public/pinnacle_history.json
push_files_to_branch "$TMP/live2" live-data "pinnacle_history.json" "Odds cycle"
refresh_branch "$TMP/live" live-data
grep -q '"points":\[1,2\]' "$TMP/live/pinnacle_history.json"

# Unchanged push is a no-op success.
push_files_to_branch "$TMP/live" live-data "pinnacle_history.json" "Odds cycle"

# gh-pages force-push (ledger full build) must still refresh.
mkdir -p "$TMP/orphan"
git -C "$TMP/orphan" init -q
git -C "$TMP/orphan" checkout -q -b gh-pages
printf '%s\n' 'site' > "$TMP/orphan/index.html"
git -C "$TMP/orphan" add index.html
git -C "$TMP/orphan" -c user.email=actions@github.com -c user.name="GitHub Actions" \
  commit -q -m "deploy"
git -C "$TMP/orphan" remote add origin "$BARE"
git -C "$TMP/orphan" push -q -f origin HEAD:gh-pages

clone_branch "$TMP/ghp" gh-pages 0
# Move gh-pages to an unrelated commit, as `git push -qf` does.
mkdir -p "$TMP/orphan2"
git -C "$TMP/orphan2" init -q
git -C "$TMP/orphan2" checkout -q -b gh-pages
printf '%s\n' 'site2' > "$TMP/orphan2/index.html"
git -C "$TMP/orphan2" add index.html
git -C "$TMP/orphan2" -c user.email=actions@github.com -c user.name="GitHub Actions" \
  commit -q -m "deploy2"
git -C "$TMP/orphan2" remote add origin "$BARE"
git -C "$TMP/orphan2" push -q -f origin HEAD:gh-pages
refresh_branch "$TMP/ghp" gh-pages
grep -q site2 "$TMP/ghp/index.html"

# Missing branch without create fails.
if clone_branch "$TMP/nope" missing-branch 0; then
  echo "expected missing branch to fail" >&2
  exit 1
fi

# Publisher copies live-data odds and main's ledger JSON onto gh-pages,
# including after a full-build force-push orphans the branch.
mkdir -p "$TMP/mainrepo"
git init -q "$TMP/mainrepo"
git -C "$TMP/mainrepo" checkout -q -b main
mkdir -p "$TMP/mainrepo/public"
printf '%s\n' '{"games":1}' > "$TMP/mainrepo/public/polymarket_data.json"
git -C "$TMP/mainrepo" add public/polymarket_data.json
git -C "$TMP/mainrepo" -c user.email=actions@github.com -c user.name="GitHub Actions" \
  commit -q -m "ledger"
git -C "$TMP/mainrepo" remote add origin "$BARE"
git -C "$TMP/mainrepo" push -q origin HEAD:main

publish_gh_pages "$TMP/ghp" "$TMP/live" "pinnacle_history.json odds_heartbeat.json" \
  "polymarket_data.json" "Publish live board"
clone_branch "$TMP/site" gh-pages 0
grep -q '"points":\[1,2\]' "$TMP/site/pinnacle_history.json"
grep -q '"games":1' "$TMP/site/polymarket_data.json"
grep -q site2 "$TMP/site/index.html"

mkdir -p "$TMP/orphan3"
git -C "$TMP/orphan3" init -q
git -C "$TMP/orphan3" checkout -q -b gh-pages
printf '%s\n' 'rebuilt' > "$TMP/orphan3/index.html"
git -C "$TMP/orphan3" add index.html
git -C "$TMP/orphan3" -c user.email=actions@github.com -c user.name="GitHub Actions" \
  commit -q -m "full build"
git -C "$TMP/orphan3" remote add origin "$BARE"
git -C "$TMP/orphan3" push -q -f origin HEAD:gh-pages
publish_gh_pages "$TMP/ghp" "$TMP/live" "pinnacle_history.json odds_heartbeat.json" \
  "polymarket_data.json" "Publish live board"
refresh_branch "$TMP/site" gh-pages
grep -q rebuilt "$TMP/site/index.html"
grep -q '"points":\[1,2\]' "$TMP/site/pinnacle_history.json"
grep -q '"games":1' "$TMP/site/polymarket_data.json"

echo "testGitLiveData: ok"
