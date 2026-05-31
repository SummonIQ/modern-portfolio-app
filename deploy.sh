#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Modern Portfolio — Deploy helper
#
# Walks you through:
#   1. Initialising git (if not already)
#   2. Creating a GitHub repo (optional — only if you have `gh` installed
#      and signed in to your own GitHub account)
#   3. Installing & authenticating the Vercel CLI under YOUR account
#   4. Linking this folder to a Vercel project
#   5. Pushing your .env.local values to Vercel
#   6. Running the first deploy
#
# Nothing is provisioned for you under someone else's account.
# ─────────────────────────────────────────────────────────────────────────────

set -e

B="\033[1m"; D="\033[2m"; G="\033[32m"; R="\033[31m"; Y="\033[33m"; C="\033[36m"; X="\033[0m"

step() { printf "\n${C}▸${X} ${B}%s${X}\n" "$1"; }
ok()   { printf "${G}✓${X} %s\n" "$1"; }
warn() { printf "${Y}!${X} %s\n" "$1"; }
err()  { printf "${R}✗${X} %s\n" "$1"; }

ask_yes_no() {
  local prompt="$1"
  local default="${2:-n}"
  local hint="(y/N)"
  [ "$default" = "y" ] && hint="(Y/n)"
  local answer
  read -r -p "$(printf "%s %s: " "$prompt" "$hint")" answer
  answer="${answer:-$default}"
  case "$answer" in y|Y|yes|YES) return 0 ;; *) return 1 ;; esac
}

require() { command -v "$1" >/dev/null 2>&1; }

if [ ! -f ".env.local" ]; then
  err ".env.local is missing. Run ./setup.sh first."
  exit 1
fi

cat <<'BANNER'

  ╔════════════════════════════════════════════╗
  ║   Modern Portfolio — Deploy helper         ║
  ║   Pushes to YOUR GitHub & Vercel.          ║
  ╚════════════════════════════════════════════╝

BANNER

# ── Git init ──────────────────────────────────────────────────────────
step "Git"
if [ ! -d .git ]; then
  git init -q
  git add .
  git -c user.email="setup@local" -c user.name="setup" commit -q -m "Initial commit" || true
  ok "Initialised a new git repository."
else
  ok "Git repo already initialised."
fi

# ── GitHub (optional) ─────────────────────────────────────────────────
step "GitHub"

if ! require gh; then
  warn "GitHub CLI (\`gh\`) is not installed — skipping GitHub setup."
  echo "  ${D}You can install it from: https://cli.github.com${X}"
  echo "  ${D}Or push to GitHub manually later:${X}"
  echo "    git remote add origin git@github.com:YOU/YOUR-REPO.git"
  echo "    git push -u origin main"
else
  ok "GitHub CLI found."
  if ! gh auth status >/dev/null 2>&1; then
    warn "You're not signed in to GitHub. Running \`gh auth login\`…"
    gh auth login
  fi
  if ask_yes_no "Create a GitHub repo and push this code?" "y"; then
    REPO_NAME=$(basename "$(pwd)")
    read -r -p "Repo name [$REPO_NAME]: " custom
    REPO_NAME="${custom:-$REPO_NAME}"
    if ask_yes_no "Make the repo PUBLIC? (no = private)" "n"; then
      VIS="--public"
    else
      VIS="--private"
    fi
    gh repo create "$REPO_NAME" $VIS --source=. --remote=origin --push
    ok "Pushed to GitHub."
  else
    ok "Skipped GitHub."
  fi
fi

# ── Vercel CLI ────────────────────────────────────────────────────────
step "Vercel CLI"

if ! require vercel; then
  warn "Vercel CLI not found."
  if ask_yes_no "Install it now (npm i -g vercel)?" "y"; then
    npm i -g vercel
    ok "Installed Vercel CLI."
  else
    err "Vercel CLI is required to deploy. Aborting."
    exit 1
  fi
else
  ok "Vercel CLI found: $(vercel --version | head -1)"
fi

# ── Vercel auth ───────────────────────────────────────────────────────
if ! vercel whoami >/dev/null 2>&1; then
  warn "Not signed in to Vercel. Running \`vercel login\`…"
  vercel login
fi
ok "Signed in as: $(vercel whoami)"

# ── Link & deploy ─────────────────────────────────────────────────────
step "Linking this folder to a Vercel project"
if [ ! -f .vercel/project.json ]; then
  vercel link
else
  ok "Already linked."
fi

step "Pushing .env.local values to Vercel (Production + Preview + Development)"
# Use `vercel env add` per key, reading values from .env.local.
# (We re-source the file here.)
set -a
# shellcheck disable=SC1091
. ./.env.local
set +a

push_env() {
  local key="$1"
  local val="${!key}"
  if [ -z "$val" ]; then
    return 0
  fi
  for ENV in production preview development; do
    # `vercel env add` reads value from stdin; suppress error if it already exists.
    printf "%s" "$val" | vercel env add "$key" "$ENV" >/dev/null 2>&1 || true
  done
  ok "$key"
}

for key in DATABASE_URL BETTER_AUTH_SECRET BETTER_AUTH_URL NEXT_PUBLIC_APP_URL ADMIN_EMAIL ADMIN_PASSWORD ADMIN_NAME BLOB_READ_WRITE_TOKEN; do
  push_env "$key"
done

step "Deploying"
if ask_yes_no "Deploy to PRODUCTION now?" "y"; then
  vercel deploy --prod
else
  vercel deploy
fi

cat <<EOF

${G}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${X}
  ${B}Deployed.${X}

  Important: update BETTER_AUTH_URL and NEXT_PUBLIC_APP_URL in your
  Vercel dashboard to your real domain once it's live, then redeploy.
${G}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${X}

EOF
