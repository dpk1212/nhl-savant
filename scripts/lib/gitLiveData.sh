# Branch helpers for the odds/wallet freshness path.
#
# Fast jobs commit JSON to `live-data` (no GitHub Pages build).
# publish-live-board.yml is the only routine writer to `gh-pages`.
#
# Source from a workflow `run:` step. Requires GH_TOKEN and GH_REPO,
# unless GIT_REMOTE_URL is set (local tests).
# shellcheck shell=bash

live_data_url() {
  if [ -n "${GIT_REMOTE_URL:-}" ]; then
    printf '%s\n' "$GIT_REMOTE_URL"
    return 0
  fi
  printf '%s\n' "https://x-access-token:${GH_TOKEN}@github.com/${GH_REPO}.git"
}

# clone_branch DIR BRANCH [create]
# create=1: if BRANCH is missing, push an empty commit so the other job can fetch it.
clone_branch() {
  local dir="$1" branch="$2" create="${3:-0}"
  rm -rf "$dir"
  if git clone --depth 1 --branch "$branch" "$(live_data_url)" "$dir"; then
    return 0
  fi
  rm -rf "$dir"
  if [ "$create" != "1" ]; then
    return 1
  fi
  echo "--- $branch missing, creating ---"
  mkdir -p "$dir"
  git -C "$dir" init -q
  git -C "$dir" checkout -q -b "$branch"
  git -C "$dir" remote add origin "$(live_data_url)"
  git -C "$dir" -c user.email=actions@github.com -c user.name="GitHub Actions" \
    commit --allow-empty -q -m "init $branch"
  if git -C "$dir" push -u origin "HEAD:${branch}"; then
    return 0
  fi
  # The other job created it first.
  rm -rf "$dir"
  git clone --depth 1 --branch "$branch" "$(live_data_url)" "$dir"
}

# Shallow update. The leading + accepts a force-push (ledger full build orphans gh-pages).
refresh_branch() {
  local dir="$1" branch="$2"
  [ -d "$dir/.git" ] || return 1
  git -C "$dir" fetch --depth 1 origin "+${branch}:refs/remotes/origin/${branch}" \
    && git -C "$dir" reset --hard "origin/${branch}"
}

# Copy public/$file into DIR and push BRANCH. files is a space-separated list.
# label is the commit-message prefix.
push_files_to_branch() {
  local dir="$1" branch="$2" files="$3" label="$4"
  local attempt f add_list
  for attempt in 1 2 3 4 5; do
    if ! refresh_branch "$dir" "$branch"; then
      echo "$label refresh failed (attempt $attempt)"
      sleep $((attempt * 2))
      continue
    fi
    add_list=""
    for f in $files; do
      if [ -f "public/$f" ]; then
        cp -f "public/$f" "$dir/$f"
        add_list="$add_list $f"
      fi
    done
    if [ -z "$add_list" ]; then
      echo "no $label files to publish"
      return 1
    fi
    if (
      cd "$dir"
      # shellcheck disable=SC2086
      git add $add_list
      if git diff --staged --quiet; then
        echo "--- $label unchanged ---"
        exit 0
      fi
      git -c user.email=actions@github.com -c user.name="GitHub Actions" \
        commit -m "$label [$(date -u +'%Y-%m-%d %H:%M:%S UTC')]"
      git push origin "HEAD:${branch}"
    ); then
      echo "--- $label push ok (attempt $attempt) ---"
      return 0
    fi
    echo "$label push failed (attempt $attempt)"
    sleep $((attempt * 2))
  done
  echo "::warning::$label push failed"
  return 1
}

# Copy files listed in the second arg from DIR into public/.
copy_files_from() {
  local dir="$1" files="$2"
  local f
  [ -d "$dir" ] || return 1
  for f in $files; do
    if [ -f "$dir/$f" ]; then
      cp -f "$dir/$f" "public/$f"
    fi
  done
}

# Copy live-data fast files and origin/main public/ ledger JSON onto a
# gh-pages checkout. Does not commit. Missing fast files are left alone
# so an empty live-data branch cannot wipe the site.
overlay_live_board() {
  local ghp="$1" live="$2" fast_files="$3" main_files="$4"
  local f tmp
  if [ -d "${live:-}/.git" ]; then
    if refresh_branch "$live" live-data; then
      for f in $fast_files; do
        if [ -f "$live/$f" ]; then
          cp -f "$live/$f" "$ghp/$f"
        fi
      done
    else
      echo "live-data refresh failed"
    fi
  fi
  if ! git -C "$ghp" fetch --depth 1 origin "+main:refs/remotes/origin/main"; then
    echo "main fetch failed"
    return 1
  fi
  for f in $main_files; do
    tmp=$(mktemp)
    if git -C "$ghp" show "origin/main:public/$f" > "$tmp"; then
      mv "$tmp" "$ghp/$f"
    else
      rm -f "$tmp"
      echo "main has no public/$f"
    fi
  done
  return 0
}

# One gh-pages commit. Retries after a non-fast-forward. No force-push.
publish_gh_pages() {
  local ghp="$1" live="$2" fast_files="$3" main_files="$4" label="$5"
  local attempt f add_list
  for attempt in 1 2 3 4 5; do
    if ! refresh_branch "$ghp" gh-pages; then
      echo "$label refresh failed (attempt $attempt)"
      sleep $((attempt * 2))
      continue
    fi
    if ! overlay_live_board "$ghp" "$live" "$fast_files" "$main_files"; then
      echo "$label overlay failed (attempt $attempt)"
      sleep $((attempt * 2))
      continue
    fi
    if (
      cd "$ghp"
      add_list=""
      for f in $fast_files $main_files; do
        if [ -f "$f" ]; then
          add_list="$add_list $f"
        fi
      done
      if [ -z "$add_list" ]; then
        echo "no $label files to publish"
        exit 1
      fi
      # shellcheck disable=SC2086
      git add $add_list
      if git diff --staged --quiet; then
        echo "--- $label unchanged ---"
        exit 0
      fi
      git -c user.email=actions@github.com -c user.name="GitHub Actions" \
        commit -m "$label [$(date -u +'%Y-%m-%d %H:%M:%S UTC')]"
      git push origin "HEAD:gh-pages"
    ); then
      echo "--- $label push ok (attempt $attempt) ---"
      return 0
    fi
    echo "$label push failed (attempt $attempt)"
    sleep $((attempt * 2))
  done
  echo "::warning::$label push failed"
  return 1
}
