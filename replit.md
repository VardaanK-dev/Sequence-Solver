# replit.md

## Overview

This is a **math puzzle game** where players solve number sequence patterns (in the form `an + b`). The server generates puzzles with a missing number in a sequence, and players guess the missing value. Correct answers trigger confetti celebrations, while incorrect answers end the game. The app includes a leaderboard that persists high scores to a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Structure
The project follows a **monorepo layout** with three top-level directories:
- `client/` — React frontend (SPA)
- `server/` — Express backend (API server)
- `shared/` — Shared types, schemas, and API route definitions used by both client and server

### Frontend (`client/src/`)
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: `wouter` for client-side routing (single page: Home)
- **State/Data Fetching**: `@tanstack/react-query` for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, styled with Tailwind CSS
- **Animations**: `framer-motion` for feedback animations, `canvas-confetti` for celebration effects
- **Styling**: Tailwind CSS with CSS variables for theming (dark mode default), custom fonts (Fredoka, Nunito, JetBrains Mono)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

### Backend (`server/`)
- **Framework**: Express.js on Node with TypeScript (run via `tsx`)
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **Key Endpoints**:
  - `GET /api/puzzle` — Generate a new puzzle
  - `POST /api/puzzle/check` — Validate a guess against a stored puzzle
  - `GET /api/scores` — Fetch top 10 scores
  - `POST /api/scores` — Submit a new score
- **Puzzle Storage**: Active puzzles are stored **in-memory** (Map) on the server since they're ephemeral. Capped at 1000 entries.
- **Dev Server**: Vite dev server is used as middleware in development; static files served in production from `dist/public/`

### Shared Layer (`shared/`)
- `schema.ts` — Drizzle ORM table definitions and Zod validation schemas (source of truth for DB types)
- `routes.ts` — API route definitions with paths, methods, and Zod response schemas (used by both client hooks and server handlers)

### Database
- **PostgreSQL** via `pg` (node-postgres) connection pool
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Single `scores` table with `id` (serial), `username` (text), `score` (integer), `createdAt` (timestamp)
- **Migrations**: Managed via `drizzle-kit push` (schema-first approach, no migration files needed for dev)
- **Connection**: Requires `DATABASE_URL` environment variable

### Build System
- **Dev**: `tsx server/index.ts` runs the server with Vite middleware for HMR
- **Production Build**: Custom `script/build.ts` that runs Vite build for client and esbuild for server, outputting to `dist/`
- **Server output**: `dist/index.cjs` (CommonJS bundle)
- **Client output**: `dist/public/` (static files)

## External Dependencies

### Database
- **PostgreSQL** — Required. Must have `DATABASE_URL` environment variable set. Used for persistent score storage.

### Key NPM Packages
- `drizzle-orm` + `drizzle-zod` + `drizzle-kit` — Database ORM and schema management
- `express` — HTTP server framework
- `pg` — PostgreSQL client
- `zod` — Runtime schema validation (shared between client and server)
- `@tanstack/react-query` — Client-side data fetching/caching
- `framer-motion` — Animation library for puzzle feedback
- `canvas-confetti` — Confetti effect on correct answers
- `wouter` — Lightweight client-side router
- `shadcn/ui` components (Radix UI primitives) — Full UI component library
- `tailwindcss` — Utility-first CSS framework

### Fonts (External CDN)
- Google Fonts: Fredoka, Nunito, JetBrains Mono, DM Sans, Fira Code, Architects Daughter, Geist Mono

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal` — Runtime error overlay in dev
- `@replit/vite-plugin-cartographer` — Dev tooling (dev only)
- `@replit/vite-plugin-dev-banner` — Dev banner (dev only)