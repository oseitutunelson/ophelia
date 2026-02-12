# [Ophelia](https://wwww) &middot; [![Author Sexyprogrammer](https://img.shields.io/badge/Author-oseitutunelson-%3C%3E)](https://www.linkedin.com/in/sexyprogrammer/)

 
 
# Ophelia — Creative portfolio & marketplace

Ophelia is a Dribbble-like application built with Next.js for sharing and discovering creative work.

This repository contains the Next.js app, components, API routes, and configuration used to run the project locally and deploy it.

## Features

- Share and browse creative work
- Authentication (Clerk)
- Profile pages, search and filters
- Uploads handled via Edgestore
- Prisma + a database for persistence
- Tailwind CSS + shadcn/ui components

## Recent UI changes (in this branch)

- Added a "Learn design" dropdown in the navbar.
	- Opens on hover (implemented as a small client component to keep `Navbar` server-side).
	- Menu items: Fashion Design Basics, Sketching Techniques, Color Theory for Fashion, Fabric & Textiles 101, Silhouettes & Proportions.
	- Larger menu, bigger typography, icons for each item, and pointer cursor on hover.

## Tech stack

- Next.js 14 (app router)
- React + TypeScript
- Tailwind CSS
- shadcn/ui (Radix + Tailwind primitives)
- Clerk (authentication)
- Prisma (ORM)
- Edgestore (image uploads)
- Zustand (client state)

## Setup (local development)

1. Copy environment variables

```bash
cp .env.example .env
# Edit .env with your DB URL, Clerk keys, Edgestore config, etc.
```

2. Install dependencies and generate Prisma client

```bash
npm install
npx prisma generate
```

3. Run the database migrations / push schema (if using a database)

```bash
npx prisma db push
```

4. Run the dev server

```bash
npm run dev
# or
pnpm dev
```

Open http://localhost:3000 in your browser.

## Building for production

```bash
npm run build
npm start
```

## Notes about large files & Git LFS

You may encounter a Git push rejection caused by a large file: `node_modules/@next/swc-darwin-x64/next-swc.darwin-x64.node` exceeding GitHub's 100MB limit. Two options to resolve this:

1. Migrate that file to Git LFS (recommended if you must keep it). Example commands:

```bash
# install and init LFS
brew install git-lfs
git lfs install

# track the specific binary
git lfs track "node_modules/@next/swc-darwin-x64/next-swc.darwin-x64.node"
git add .gitattributes
git commit -m "Track next-swc binary with Git LFS"

# migrate history to LFS (rewrites history)
git lfs migrate import --include="node_modules/@next/swc-darwin-x64/next-swc.darwin-x64.node" --everything

# cleanup and force push
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
git push origin --force --tags
```

2. Or purge the file from history (recommended) and keep `node_modules/` ignored. Example using git-filter-repo:

```bash
python3 -m pip install --user git-filter-repo
git filter-repo --invert-paths --path node_modules
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
```

Important: both approaches rewrite history and require collaborators to re-clone or reset. Prefer ignoring `node_modules/` and not committing build artifacts.

## Contributing

- Fork and open a pull request.
- If you rewrite history to remove large files, communicate with collaborators so they can update their local clones.

## Files & structure highlights

- `app/` — Next.js app routes and pages
- `components/` — UI components (navbar, dropdowns, menus, etc.)
- `lib/` — database, fetcher and utility code
- `prisma/` — Prisma schema

## Contact / author

If you need help with setup or the Git LFS migration steps, open an issue or message me directly in the repo — I can run the migration for you or help troubleshoot push errors.
