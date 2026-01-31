# Handoff Prompt for Continuing Development

> Copy and paste this entire document as your first message when starting a new AI chat session to continue development on this project.

---

## Project Context

I'm working on a **baby shower gift registry web application** located at:

```
/Users/cristianvidal/Desktop/BABY SHOWER ROCIO
```

Please read the `CLAUDE.md` file in this directory first - it contains comprehensive documentation about the project, including architecture, database schema, API routes, design system, and code conventions.

## Current State (January 2026)

### Completed (MVP)

The MVP is **fully functional** and includes:

> **Note (2026-01-30):** Fixed checkout bugs and added external purchase tracking:
> 1. Payment methods weren't displaying (API format mismatch)
> 2. External purchase checkout now tracks in database (admin can verify → removes from gallery)
> 3. Added reminder popup when clicking "Ver en tienda"
> See TASKS.md changelog for details.

- **Guest Portal** (password: `Rocio2026`)
  - Password gate entry
  - Gift gallery with **improved 4-column grid layout** and **toggleable filters**
  - Three gift types: Fundable, External Purchase, Custom Contribution
  - Cart system with session storage
  - Checkout flow with payment instructions
  - WhatsApp confirmation integration

- **Design Refresh**
  - **New "Sand" Theme**: 
    - Background: `#E6DCCA`
    - Foreground: `#3D3225`
  - Typography: Cormorant Garamond (headings) + Inter (body)

- **Admin Dashboard** (password: `AdminRocio2026`)
  - Dashboard with stats overview
  - Gift CRUD (create, read, update, delete)
  - Category management
  - Contribution verification (pending/verified/rejected)
  - Payment methods configuration (Bizum, Revolut, Bancolombia)
  - Site settings (passwords, event details, messages)

- **Infrastructure**
  - Docker Compose setup (app + PostgreSQL)
  - Multi-stage Dockerfile for production builds
  - Prisma ORM with migrations
  - Database seeded with 9 categories + default settings

### Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 14.2.28 |
| TypeScript | 5.6.3 |
| Tailwind CSS | 3.4.14 |
| Prisma | 5.22.0 |
| PostgreSQL | 16-alpine |
| Framer Motion | 11.11.0 |

### Database Models

- **Category** - Gift categories (Ropa, Muebles, etc.)
- **Gift** - Gift items with type (fundable/external/custom), amounts, status
- **Contribution** - Guest contributions with verification status
- **PaymentMethod** - Configured payment options
- **SiteSettings** - Passwords, event details, messages

### Running the Project

```bash
# Start database
docker compose up -d db

# Start dev server
npm run dev
# Note: Check terminal output for port (usually 3000, 3001, or 3002)
```

The dev server was last running on **port 3001**.

---

## Event Details

| Field | Value |
|-------|-------|
| Event | Baby Shower de Rocio |
| Date | 15 February 2026, 13:00h |
| Location | Calle de la Azalea, Alcobendas, Madrid |
| WhatsApp | +34 649 22 55 90 |
| Domain | rocio.cristianvv.com |

---

## Design System: "Daisy Warmth" (Sand Edition)

Updated color palette based on user feedback:

- Background: `#E6DCCA` (Sand)
- Text: `#3D3225` (Dark Brown)
- Accent Yellow: `#E8B931` (Daisy center)
- Accent Green: `#7A9B5C` (Stem green)

Typography: Cormorant Garamond (headings) + Inter (body)

---

## What I Might Ask You To Do Next

Depending on what I request, here are common next steps:

### If I ask for new features:
- Scroll animation with invitation video frames (`/invitation-video-frames/`)
- Image upload functionality
- Export contributions to CSV
- Email notifications

### If I ask about deployment:
- VPS deployment to Hostinger
- Domain configuration (rocio.cristianvv.com)
- SSL setup with Let's Encrypt
- Nginx reverse proxy

### If I ask about bugs:
- Check the specific component/route mentioned
- The codebase follows Next.js 14 App Router patterns
- Server Components are default, `'use client'` for interactivity

### If I ask about the database:
- Prisma schema is in `/prisma/schema.prisma`
- Seed data is in `/prisma/seed.ts`
- Run `npx prisma studio` to view data

---

## Important Conventions

1. **Language**: UI text in Spanish, code/comments in English
2. **Money**: All amounts stored in cents (integers)
3. **Styling**: Tailwind CSS only, use `cn()` helper for conditionals
4. **Components**: Server Components by default
5. **Authentication**: Cookie-based sessions, no user accounts

---

## Files to Read First

When starting work, read these files for context:

1. `CLAUDE.md` - Full project documentation
2. `prisma/schema.prisma` - Database schema
3. `src/app/page.tsx` - Entry point
4. `tailwind.config.ts` - Theme colors

---

## Questions?

If anything is unclear:
1. Check `CLAUDE.md` for detailed documentation
2. Check `INSTRUCTIONS.md` for setup/deployment guides
3. Ask me for clarification

Let's continue building!
