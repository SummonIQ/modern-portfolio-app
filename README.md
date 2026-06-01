<!-- SUMMONIQ-OSS-HEADER:START -->
<div align="center">

  <h1>Modern Portfolio App</h1>
  <p>Responsive portfolio website with an admin panel for managing projects and content.</p>

  <p>
    <a href="https://github.com/SummonIQ/modern-portfolio-app"><img alt="Repository" src="https://img.shields.io/badge/github-SummonIQ%2Fmodern-portfolio-app-24292f?logo=github"></a>
    <a href="https://unlicense.org/"><img alt="License: Unlicense" src="https://img.shields.io/badge/license-Unlicense-blue.svg"></a>
  </p>

</div>

---
<!-- SUMMONIQ-OSS-HEADER:END -->
# Modern Portfolio

A modern, responsive portfolio website with a built-in admin panel. Add, edit,
and remove projects without touching the code.

- **Public site** — Home, About, Skills, Projects index, Project detail, Contact
- **Admin panel** at `/admin` with secure login (Better Auth)
- **Rich-text editor** (PlateJS) for project descriptions and the about page
- **Image uploads** via Vercel Blob
- **Interactive 3D-feel hero** with mouse-reactive particle field & parallax orbs
- **Light & dark mode**, responsive across desktop / tablet / mobile
- **SEO-friendly** — metadata, OpenGraph, sitemap.xml, robots.txt

Stack: Next.js 16 (App Router) · TypeScript · Tailwind v4 · Prisma 7 · Better Auth · PlateJS · Postgres (Neon).

## Quick start (one command)

```bash
bash setup.sh
```

The wizard checks your tools, asks for a database URL + admin credentials, then
installs, migrates, and seeds sample content. Total time: about 2 minutes.

After it finishes:

```bash
bun run dev          # or: npm run dev
```

Visit:

- Public site → http://localhost:3030
- Admin panel → http://localhost:3030/admin

## Manual setup

If you'd rather do it by hand:

1. Copy `.env.example` → `.env.local` and fill in:
   - `DATABASE_URL` (Postgres — Neon, Vercel Postgres, etc.)
   - `BETTER_AUTH_SECRET` — `openssl rand -base64 32`
   - `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` — your site URL
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
   - `BLOB_READ_WRITE_TOKEN` — only needed for image uploads
2. Install:
   ```bash
   bun install
   ```
3. Push the schema:
   ```bash
   bun run db:push
   ```
4. Create the admin user + sample content:
   ```bash
   bun run seed
   ```
5. Start the dev server:
   ```bash
   bun run dev
   ```

## Editing content

Sign in at `/sign-in` and visit `/admin`:

- **Projects** — add, edit, delete, reorder. Cover image, gallery, tags, rich-text body, link.
- **Skills** — name, category, level (0–100), sort order.
- **Social links** — platform, URL, icon (lucide name like `github`, `linkedin`, etc.).
- **About me** — name, headline, tagline, full bio (rich text), portrait, résumé link.
- **Site settings** — section copy, contact info, SEO metadata.
- **Messages** — view & manage contact-form submissions.

## Deploying

The easy path — run the deploy helper:

```bash
bash deploy.sh
```

It walks you through:

1. Initialising git
2. Creating a GitHub repo (if you have `gh` installed and signed in)
3. Installing & signing in to the Vercel CLI under **your** account
4. Linking this folder to a new Vercel project
5. Pushing your `.env.local` values to Vercel
6. Running the first deploy

Or do it manually:

1. Push the repo to GitHub.
2. Run `npx vercel` and follow the prompts (or import via the Vercel dashboard).
3. Set the same environment variables in Vercel (Production tab).
4. Vercel runs `prisma generate && next build` automatically.

For images, create a Vercel Blob store under **Storage → Create → Blob** and
copy the read/write token into the `BLOB_READ_WRITE_TOKEN` env var.

> **Heads up:** the project doesn't ship with any pre-configured database,
> GitHub repo, or Vercel project. Everything is created under **your own**
> accounts when you run `setup.sh` and `deploy.sh`.

## Project layout

```
app/
  (site)/                 public marketing site
    page.tsx               home
    about/                 about page
    projects/              project index + detail
    contact/               contact page
  admin/                  admin panel (gated by Better Auth)
    actions.ts            server actions for all CRUD
    projects/              CRUD pages
    skills/, socials/, about/, settings/, messages/
  api/
    auth/[...all]/        better-auth route
    contact/              contact-form submission
    upload/               authenticated image upload (Vercel Blob)
  sign-in/                admin sign-in page
components/
  marketing/              public-site components (hero, header, cards…)
  admin/                  admin shell + form components
  ui/                     button, input, card, plate-markdown-editor
lib/
  auth/                   better-auth server + client
  db/client.ts            Prisma client (Neon-compatible adapter)
  portfolio.ts            data helpers
  site-settings.ts
prisma/schema.prisma      database schema
scripts/seed.ts           admin + sample-content seeder
setup.sh                  interactive setup wizard
```

## Tech notes

- The PlateJS editor stores Markdown text. The public site renders it via
  `marked` on the server.
- The contact form is rate-limit-friendly and includes a hidden honeypot.
- The hero uses a Canvas particle constellation that respects
  `prefers-reduced-motion` and falls back to a static gradient.

## Scripts

| Command           | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `bun run dev`     | Start the dev server on port 3030               |
| `bun run build`   | `prisma generate && next build`                 |
| `bun run start`   | Run the production build                        |
| `bun run db:push` | Sync `schema.prisma` to your database           |
| `bun run db:studio` | Open Prisma Studio (DB GUI)                   |
| `bun run seed`    | Create the admin user + sample content          |
| `bun run typecheck` | TypeScript check                              |

## License

MIT — do whatever you like with it.
