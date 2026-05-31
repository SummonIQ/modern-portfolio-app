#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Modern Portfolio — One-command setup
#
# Designed for non-developers. Run:
#     bash setup.sh
#
# It walks you through:
#   1. Tooling check (Node.js / Bun)
#   2. Database — paste a Postgres URL (Neon, Supabase, Vercel Postgres…) or
#      open the signup page for a free Neon DB
#   3. Admin login (email + password you'll use to sign in to /admin)
#   4. Optional: image uploads via Vercel Blob
#   5. Install, push schema, seed sample content
#
# Nothing is provisioned for you under someone else's account. You stay in
# control of your own resources.
# ─────────────────────────────────────────────────────────────────────────────

set -e

B="\033[1m"; D="\033[2m"; G="\033[32m"; R="\033[31m"; Y="\033[33m"; C="\033[36m"; X="\033[0m"

step() { printf "\n${C}▸${X} ${B}%s${X}\n" "$1"; }
ok()   { printf "${G}✓${X} %s\n" "$1"; }
warn() { printf "${Y}!${X} %s\n" "$1"; }
err()  { printf "${R}✗${X} %s\n" "$1"; }
note() { printf "${D}%s${X}\n" "$1"; }

ask() {
  local prompt="$1"
  local default="$2"
  local value
  if [ -n "$default" ]; then
    read -r -p "$(printf "%s ${D}[%s]${X}: " "$prompt" "$default")" value
    echo "${value:-$default}"
  else
    read -r -p "$(printf "%s: " "$prompt")" value
    echo "$value"
  fi
}

ask_secret() {
  local prompt="$1"
  local value
  read -r -s -p "$(printf "%s: " "$prompt")" value
  echo
  echo "$value"
}

ask_yes_no() {
  local prompt="$1"
  local default="${2:-n}"
  local hint="(y/N)"
  [ "$default" = "y" ] && hint="(Y/n)"
  local answer
  read -r -p "$(printf "%s %s: " "$prompt" "$hint")" answer
  answer="${answer:-$default}"
  case "$answer" in
    y|Y|yes|YES) return 0 ;;
    *) return 1 ;;
  esac
}

require() { command -v "$1" >/dev/null 2>&1; }

open_url() {
  local url="$1"
  if require open; then open "$url"
  elif require xdg-open; then xdg-open "$url" >/dev/null 2>&1
  fi
}

# ─────────────────────────────────────────────────────────────────────────────

cat <<'BANNER'

  ╔════════════════════════════════════════════╗
  ║   Modern Portfolio — Setup wizard          ║
  ║   No accounts pre-configured for you.      ║
  ║   You stay in control of your resources.   ║
  ╚════════════════════════════════════════════╝

BANNER

# 1. Tooling check
step "Checking required tools"

if ! require node; then
  err "Node.js is not installed."
  echo "   Install Node.js 20+ from https://nodejs.org and re-run this script."
  exit 1
fi
NODE_VERSION=$(node -v)
ok "Node.js found: $NODE_VERSION"

PKG_MANAGER="bun"
if ! require bun; then
  warn "Bun not found. (Bun is recommended: https://bun.sh)"
  if ask_yes_no "Install Bun now?" "y"; then
    curl -fsSL https://bun.sh/install | bash
    if [ -f "$HOME/.bun/bin/bun" ]; then
      export PATH="$HOME/.bun/bin:$PATH"
      ok "Bun installed."
    else
      warn "Bun install didn't land where expected — falling back to npm."
      PKG_MANAGER="npm"
    fi
  else
    PKG_MANAGER="npm"
  fi
fi

if [ "$PKG_MANAGER" = "bun" ] && require bun; then
  ok "Bun found: $(bun -v)"
fi

# 2. .env.local
step "Configuring environment"

ENV_FILE=".env.local"

if [ -f "$ENV_FILE" ]; then
  warn ".env.local already exists. Press Enter to keep existing values, or type a new one."
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE" 2>/dev/null || true
  set +a
fi

# ── Database ────────────────────────────────────────────────────
echo
echo "  ${B}Database${X}"
echo "  This app needs a Postgres database. Free options:"
echo "    • Neon            — https://console.neon.tech (recommended)"
echo "    • Supabase        — https://supabase.com"
echo "    • Vercel Postgres — vercel.com/dashboard/stores"
echo
echo "  ${D}Format: postgresql://user:pass@host/dbname?sslmode=require${X}"
echo

if [ -z "${DATABASE_URL:-}" ]; then
  if ask_yes_no "Open the Neon signup page in your browser?" "n"; then
    open_url "https://console.neon.tech/signup"
    echo "  When you have a project: copy the connection string and paste it below."
    echo
  fi
fi

DATABASE_URL=$(ask "Database URL" "${DATABASE_URL:-}")
if [ -z "$DATABASE_URL" ]; then
  err "Database URL is required."
  exit 1
fi

# ── Admin user ──────────────────────────────────────────────────
echo
echo "  ${B}Admin login${X}"
echo "  These are the credentials you'll use to sign in at /admin."
echo

ADMIN_EMAIL=$(ask "Admin email" "${ADMIN_EMAIL:-admin@example.com}")
ADMIN_NAME=$(ask "Your name (shown on the site)" "${ADMIN_NAME:-Your Name}")

if [ -z "${ADMIN_PASSWORD:-}" ]; then
  ADMIN_PASSWORD=$(ask_secret "Admin password (min 8 chars)")
  if [ ${#ADMIN_PASSWORD} -lt 8 ]; then
    err "Password must be at least 8 characters."
    exit 1
  fi
else
  warn "Using existing ADMIN_PASSWORD from .env.local"
fi

DEFAULT_APP_URL="${NEXT_PUBLIC_APP_URL:-http://localhost:3030}"
APP_URL=$(ask "Site URL (use http://localhost:3030 for local dev)" "$DEFAULT_APP_URL")

# Generate Better Auth secret if missing
if [ -z "${BETTER_AUTH_SECRET:-}" ]; then
  if require openssl; then
    BETTER_AUTH_SECRET=$(openssl rand -base64 32)
  else
    BETTER_AUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
  fi
  ok "Generated BETTER_AUTH_SECRET."
fi

# ── Optional: Vercel Blob token ─────────────────────────────────
echo
echo "  ${B}Image uploads${X} ${D}(optional, skippable)${X}"
echo "  Image uploads in /admin use Vercel Blob storage. Without a token,"
echo "  uploads are disabled — but you can still paste image URLs by hand."
echo
echo "  Get a token: vercel.com/dashboard/stores → Create → Blob"
echo

BLOB_READ_WRITE_TOKEN_VALUE="${BLOB_READ_WRITE_TOKEN:-}"
if [ -z "$BLOB_READ_WRITE_TOKEN_VALUE" ]; then
  if ask_yes_no "Open Vercel Blob in your browser now?" "n"; then
    open_url "https://vercel.com/dashboard/stores"
  fi
  BLOB_READ_WRITE_TOKEN_VALUE=$(ask "Blob token (or leave blank to skip)" "")
fi

cat > "$ENV_FILE" <<EOF
# Generated by setup.sh on $(date -u +"%Y-%m-%dT%H:%M:%SZ")

DATABASE_URL="$DATABASE_URL"

BETTER_AUTH_SECRET="$BETTER_AUTH_SECRET"
BETTER_AUTH_URL="$APP_URL"
NEXT_PUBLIC_APP_URL="$APP_URL"

ADMIN_EMAIL="$ADMIN_EMAIL"
ADMIN_PASSWORD="$ADMIN_PASSWORD"
ADMIN_NAME="$ADMIN_NAME"

# Optional — image uploads in /admin
BLOB_READ_WRITE_TOKEN="$BLOB_READ_WRITE_TOKEN_VALUE"
EOF

ok "Wrote $ENV_FILE"

# 3. Install
step "Installing dependencies"

if [ "$PKG_MANAGER" = "bun" ]; then
  bun install
else
  npm install
fi
ok "Dependencies installed"

# 4. Database
step "Pushing the schema to your database"
if [ "$PKG_MANAGER" = "bun" ]; then
  bunx prisma generate
  bunx prisma db push
else
  npx prisma generate
  npx prisma db push
fi
ok "Schema pushed"

# 5. Seed
step "Creating admin user + seeding sample content"
if [ "$PKG_MANAGER" = "bun" ]; then
  bun run scripts/seed.ts
else
  if require tsx; then npx tsx scripts/seed.ts
  else npx tsx scripts/seed.ts
  fi
fi

# 6. Done
cat <<EOF

${G}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${X}
  ${B}All set.${X}

  Start the site:
      ${C}${PKG_MANAGER} run dev${X}

  Then open:
      Public site → ${C}${APP_URL}${X}
      Admin panel → ${C}${APP_URL}/admin${X}

  Sign in with:
      Email    → ${C}${ADMIN_EMAIL}${X}
      Password → (the one you just entered)

  Ready to go live? Run:
      ${C}bash deploy.sh${X}    ${D}(walks you through Vercel deploy)${X}

${G}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${X}

EOF
