# CLAUDE.md - Baby Shower Gift Registry

> **Context file for AI assistants.** Read this first before making any changes.

---

## Quick Reference

| Item | Value |
|------|-------|
| **Project** | Private gift registry for baby shower events |
| **Stack** | Next.js 14 + TypeScript + Tailwind + Prisma + PostgreSQL |
| **Deployment** | Docker Compose (app + database) |
| **Guest Password** | `Rocio2026` (configurable in admin) |
| **Admin Password** | `AdminRocio2026` (configurable in admin) |
| **Dev Server** | `http://localhost:3000` (or 3001/3002 if port busy) |
| **Admin Panel** | `/admin/login` |
| **VPS Guide** | See [VPS_DEPLOYMENT.md](./VPS_DEPLOYMENT.md) for deployment & cleanup |

---

## 🤖 Agentic Workflow Rules

1.  **Documentation First**: You **MUST** update `CLAUDE.md` (for context/rules) and `TASKS.md` (for progress) as you work.
2.  **Transparency**: If you make architectural changes, reference them in `README.md`.
3.  **Verification**: Always verify your changes before marking a task as complete.

---

## Project Overview

### What This Is

A **private, password-protected gift registry** for Rocio's baby shower. Designed to be reusable for other events (birthdays, weddings, etc.) in the future.

### Core Philosophy

This is a **family coordination interface**, NOT an e-commerce platform:

1. **Minimal friction** - Guest completes contribution in < 2 minutes
2. **Emotional clarity** - Warm, calm, personal UX
3. **Privacy by default** - Guests are anonymous to other guests
4. **Manual verification** - Admin verifies payments (Bizum, Revolut, etc.) manually

### Current Event Details

| Field | Value |
|-------|-------|
| Event | Baby Shower de Rocio |
| Date | 15 February 2026, 13:00h |
| Location | Calle de la Azalea, Alcobendas, Madrid |
| Expected Guests | < 50 people |
| Language | Spanish |
| Currencies | EUR (Bizum, Revolut), COP (Bancolombia) |
| WhatsApp | +34 649 22 55 90 |

---

## Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.28 | React framework with App Router |
| TypeScript | 5.6.3 | Type safety |
| Tailwind CSS | 3.4.14 | Styling |
| Prisma | 5.22.0 | Database ORM |
| PostgreSQL | 16-alpine | Database |
| Framer Motion | 11.11.0 | Animations |
| Docker | - | Containerization |

### Key Libraries

```json
{
  "@prisma/client": "^5.22.0",
  "clsx": "^2.1.1",
  "framer-motion": "^11.11.0",
  "tailwind-merge": "^2.5.4"
}
```

---

## Project Structure

```
baby-shower-rocio/
├── CLAUDE.md                    # This file - AI context
├── INSTRUCTIONS.md              # Setup & deployment guide
├── handoff_prompt.md            # Context for new AI sessions
├── TASKS.md                     # Development task tracker
│
├── docker-compose.yml           # App + PostgreSQL containers
├── Dockerfile                   # Multi-stage Next.js build
├── .env.example                 # Environment template
├── .gitignore
├── package.json
├── tailwind.config.ts           # Daisy Warmth theme colors
├── tsconfig.json
├── next.config.js               # standalone output for Docker
│
├── prisma/
│   ├── schema.prisma            # Database models
│   ├── seed.ts                  # Initial data (categories, settings)
│   └── migrations/              # Database migrations
│
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (fonts, metadata)
│   │   ├── page.tsx             # Password gate entry point
│   │   │
│   │   ├── (guest)/             # Guest route group
│   │   │   ├── layout.tsx       # Guest auth check
│   │   │   ├── gallery/page.tsx # Hero + gift gallery
│   │   │   ├── checkout/page.tsx# Payment instructions
│   │   │   └── gracias/page.tsx # Thank you page
│   │   │
│   │   ├── admin/               # Admin area
│   │   │   ├── login/page.tsx   # Admin login
│   │   │   └── (dashboard)/     # Protected dashboard routes
│   │   │       ├── page.tsx     # Dashboard overview
│   │   │       ├── gifts/       # Gift CRUD
│   │   │       ├── categories/  # Category management
│   │   │       ├── contributions/# Verify payments
│   │   │       ├── payments/    # Payment methods config
│   │   │       └── settings/    # Site settings
│   │   │
│   │   └── api/                 # API routes
│   │       ├── auth/            # Login/logout endpoints
│   │       ├── gifts/           # Gift CRUD API
│   │       ├── categories/      # Category API
│   │       ├── contributions/   # Contribution API
│   │       ├── payment-methods/ # Payment config API
│   │       └── settings/        # Site settings API
│   │
│   ├── components/
│   │   ├── guest/               # Guest-facing components
│   │   │   ├── PasswordGate.tsx # Password entry screen
│   │   │   ├── HeroSection.tsx  # Event info header
│   │   │   ├── GiftCard.tsx     # Individual gift display
│   │   │   ├── GiftGallery.tsx  # Gift grid with filters
│   │   │   ├── GalleryClient.tsx# Client-side gallery wrapper
│   │   │   ├── CartDrawer.tsx   # Slide-out cart
│   │   │   └── CurrencySelector.tsx
│   │   │
│   │   ├── admin/               # Admin components
│   │   │   ├── AdminSidebar.tsx # Navigation sidebar
│   │   │   ├── AdminPageWrapper.tsx
│   │   │   ├── GiftTable.tsx    # Gift list table
│   │   │   ├── ContributionCard.tsx
│   │   │   └── StatsCard.tsx    # Dashboard stats
│   │   │
│   │   └── ui/                  # Shared UI components
│   │       ├── Button.tsx
│   │       └── ProgressBar.tsx
│   │
│   ├── hooks/
│   │   └── useCart.tsx          # Cart state (React Context)
│   │
│   ├── lib/
│   │   ├── db.ts                # Prisma client singleton
│   │   ├── auth.ts              # Cookie-based session auth
│   │   └── utils.ts             # Helpers (cn, formatCurrency)
│   │
│   └── types/
│       └── index.ts             # TypeScript interfaces
│
├── public/
│   └── uploads/                 # User-uploaded images
│
└── invitation-video-frames/     # Source video frames (gitignored)
```

---

## Database Schema

### Models Overview

```
Category ──┬── Gift ──┬── Contribution
           │          │
PaymentMethod         │
           │          │
SiteSettings ─────────┘
```

### Category

```prisma
model Category {
  id        String   @id @default(cuid())
  name      String              // "Ropa", "Muebles", etc.
  slug      String   @unique    // "ropa", "muebles"
  order     Int      @default(0)
  gifts     Gift[]
}
```

### Gift

```prisma
model Gift {
  id            String      @id @default(cuid())
  categoryId    String
  title         String
  description   String?
  imageUrl      String?
  externalUrl   String?     // Amazon link for external purchases
  type          GiftType    // fundable | external | custom
  targetAmount  Int?        // In cents, for fundable gifts
  currentAmount Int         @default(0)  // Verified total
  status        GiftStatus  // available | partially_funded | completed | hidden
  order         Int         @default(0)
  contributions Contribution[]
}
```

### Contribution

```prisma
model Contribution {
  id            String             @id @default(cuid())
  giftId        String
  guestName     String
  guestPhone    String
  guestMessage  String?           // Optional message for baby
  amount        Int               // In cents
  currency      Currency          // EUR | COP
  paymentMethod PaymentMethodType // bizum | revolut | bancolombia
  status        ContributionStatus // pending | verified | rejected
  verifiedAt    DateTime?
  verifiedBy    String?
}
```

### PaymentMethod

```prisma
model PaymentMethod {
  id       String            @id @default(cuid())
  type     PaymentMethodType @unique
  label    String            // Display name
  value    String            // Phone number or link
  currency Currency
  enabled  Boolean           @default(true)
}
```

### SiteSettings

```prisma
model SiteSettings {
  id             String @id @default("settings")
  guestPassword  String @default("Rocio2026")
  adminPassword  String @default("AdminRocio2026")
  eventTitle     String @default("Baby Shower de Rocio")
  eventDate      String @default("15 de febrero de 2026")
  eventTime      String @default("13:00h")
  eventLocation  String
  heroMessage    String
  whatsappNumber String @default("+34649225590")
}
```

---

## Gift Types

### 1. Fundable Gift (`type: 'fundable'`)

- Has a target amount (e.g., €200 for a stroller)
- Multiple guests can contribute
- Shows progress bar
- Completed when `currentAmount >= targetAmount`
- Minimum contribution: €10

### 2. External Purchase (`type: 'external'`)

- Links to external store (Amazon, etc.)
- Guest clicks "I've bought this" and marks as purchased
- No monetary tracking, just status

### 3. Custom Contribution (`type: 'custom'`)

- Free-form amount, no target
- For general support / monetary gifts
- Optional message for the baby

---

## Authentication System

### How It Works

- **Cookie-based sessions** (no user accounts)
- Two session types: `guest` and `admin`
- Cookies stored in HTTP-only cookies via `src/lib/auth.ts`

### Authentication Flow

```
Guest Flow:
  / (page.tsx) → Check session → Not authenticated → Show PasswordGate
                               → Guest authenticated → Redirect to /gallery
                               → Admin authenticated → Redirect to /admin

Admin Flow:
  /admin/login → Enter password → Set admin session → Redirect to /admin
  /admin/(dashboard)/* → Check session → Not admin → Redirect to /admin/login
```

### Key Functions (`src/lib/auth.ts`)

```typescript
getSession()        // Returns: 'guest' | 'admin' | null
setGuestSession()   // Sets guest cookie
setAdminSession()   // Sets admin cookie
clearSession()      // Removes session cookie
```

---

## API Routes

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/guest` | Validate guest password |
| POST | `/api/auth/admin` | Validate admin password |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/auth/check` | Check current session |

### Gifts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gifts` | List all gifts |
| POST | `/api/gifts` | Create gift (admin) |
| GET | `/api/gifts/[id]` | Get single gift |
| PUT | `/api/gifts/[id]` | Update gift (admin) |
| DELETE | `/api/gifts/[id]` | Delete gift (admin) |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category (admin) |
| PUT | `/api/categories/[id]` | Update category |
| DELETE | `/api/categories/[id]` | Delete category |

### Contributions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contributions` | List contributions (admin) |
| POST | `/api/contributions` | Create contribution (guest) |
| PUT | `/api/contributions/[id]` | Verify/reject (admin) |
| GET | `/api/contributions/stats` | Get statistics |

### Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get site settings |
| PUT | `/api/settings` | Update settings (admin) |
| GET | `/api/payment-methods` | List payment methods |
| PUT | `/api/payment-methods` | Update payment methods |

---

## Design System: "Daisy Warmth"

### Color Palette

Inspired by the invitation video featuring chamomile/daisy bouquet.

```css
/* Backgrounds */
--background:       #E6DCCA;  /* Sand color */
--background-light: #F5F0E8;  /* Light cream (cards) */
--background-white: #FFFEF9;  /* Off-white */

/* Text */
--foreground:           #3D3225;  /* Dark brown */
--foreground-secondary: #6B5D4D;  /* Medium brown */
--foreground-muted:     #9A8B7A;  /* Light brown */

/* Accents */
--accent-yellow: #E8B931;  /* Daisy center gold */
--accent-green:  #7A9B5C;  /* Stem green */

/* States */
--state-success: #7A9B5C;  /* Green - verified */
--state-pending: #E8B931;  /* Yellow - pending */
--state-error:   #C75D5D;  /* Soft red - rejected */
```

### Typography

| Usage | Font | Source |
|-------|------|--------|
| Headings | Cormorant Garamond | Google Fonts |
| Body | Inter | Google Fonts |

### Visual Style Guidelines

- Apple-inspired "warm minimalism"
- Generous whitespace
- Rounded cards (`rounded-2xl` to `rounded-3xl`)
- Subtle shadows
- Mobile-first responsive design
- No cartoons or loud colors

---

## Commands Reference

### Development

```bash
# Install dependencies
npm install

# Start PostgreSQL (Docker)
docker-compose up -d db

# Run database migrations
npx prisma migrate dev

# Seed database with initial data
npm run db:seed

# Start development server
npm run dev

# Or start on different port
PORT=3002 npm run dev

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Production (Docker)

```bash
# Build and start all containers
docker-compose up --build -d

# View logs
docker-compose logs -f app

# Stop containers
docker-compose down

# Stop and remove all data
docker-compose down -v
```

### Database

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create a new migration
npx prisma migrate dev --name description_of_change

# Apply migrations in production
npx prisma migrate deploy

# Reset database (WARNING: destroys data)
npx prisma migrate reset
```

---

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
# Database (Docker internal network)
DATABASE_URL="postgresql://postgres:postgres@db:5432/babyshower?schema=public"

# For local development (outside Docker)
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/babyshower?schema=public"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="+34649225590"
```

---

## User Flows

### Guest Flow

```
1. Visit site → Password gate appears
2. Enter password "Rocio2026" → Redirected to /gallery
3. Browse gifts by category
4. Click gift → See details, contribute amount
5. Add to cart → Cart drawer opens
6. Proceed to checkout → Enter name, phone, optional message
7. See payment instructions (Bizum: +34 649 22 55 90)
8. Make external payment via Bizum app
9. Click "Send WhatsApp confirmation" → Opens WhatsApp with pre-filled message
10. See thank you page
```

### Admin Flow

```
1. Visit /admin/login → Enter admin password
2. Dashboard shows: pending contributions, recent activity, stats
3. Navigate via sidebar:
   - Gifts: Add/edit/delete gifts, set prices, upload images
   - Categories: Manage categories, reorder
   - Contributions: Verify or reject pending payments
   - Payments: Configure Bizum/Revolut/Bancolombia details
   - Settings: Change passwords, event details, hero message
4. When contribution comes in:
   - Check Bizum for matching payment
   - Click "Verify" to confirm → Updates gift progress
   - Click "Reject" if payment not found
```

---

## Seeded Data

The database is seeded with:

### Categories (9)

1. Ropa (Clothing)
2. Muebles (Furniture)
3. Higiene (Hygiene)
4. Alimentacion (Feeding)
5. Juguetes (Toys)
6. Paseo (Strollers/Travel)
7. Tecnologia (Technology)
8. Bano (Bathroom)
9. Otros (Other)

### Payment Methods (1 default)

- **Bizum**: +34 649 22 55 90 (EUR)

### Site Settings

- Guest password: `Rocio2026`
- Admin password: `AdminRocio2026`
- Event: Baby Shower de Rocio
- Date: 15 de febrero de 2026, 13:00h
- Location: Calle de la Azalea, Alcobendas, Madrid

---

## Code Style Guidelines

### TypeScript

- Strict mode enabled
- Use interfaces over types when possible
- Explicit return types on exported functions

### React

- Server Components by default
- `'use client'` only when needed (interactivity, hooks)
- Functional components with hooks
- Props interfaces defined above component

### Styling

- Tailwind CSS exclusively (no CSS modules)
- Use `cn()` helper from `lib/utils.ts` for conditional classes
- Consistent spacing with Tailwind scale

### Database

- All monetary values in **cents** (integer)
- Dates as ISO strings for display fields
- `cuid()` for all IDs

### Naming

- Files: PascalCase for components, camelCase for utils
- Variables/functions: camelCase
- Types/interfaces: PascalCase
- Database fields: camelCase
- UI text: Spanish
- Code comments: English

### Commit Messages

Format: `type: brief description`

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`

Example: `feat: add contribution verification flow`

---

## Verification Log

- **2026-01-30**: Fixed checkout bug where payment methods were not displaying. Root cause: API returns raw array but checkout expected `{ success, data }` wrapper. Updated `src/app/(guest)/checkout/page.tsx` to handle both formats.
- **2026-01-24**: Verified Guest and Admin flows. App runs successfully on Docker. Fallback port 3001 is used if 3000 is busy.

---

## Future Considerations (Post-MVP)

> These are noted for future phases. Do NOT implement unless explicitly requested.

### Phase 2: Polish

- [ ] Scroll-based animation using invitation video frames
- [ ] Email notifications for new contributions
- [ ] Export contributions to CSV
- [ ] Print-friendly gift list
- [ ] Image upload to external storage (S3/Cloudinary)

### Phase 3: Multi-Tenant

- [ ] Event creation wizard
- [ ] Multiple events per installation
- [ ] User accounts for event organizers
- [ ] Template system for different event types
- [ ] Stripe/payment gateway integration
- [ ] SaaS pricing model

### Compliance (Phase 2+)

- [ ] GDPR compliance audit
- [ ] Cookie consent banner
- [ ] Privacy policy page
- [ ] Terms of service

---

## Troubleshooting

### Port Already in Use

```bash
# Check what's using port 3000
lsof -i :3000

# Run on different port
PORT=3002 npm run dev
```

### Database Connection Issues

```bash
# Ensure PostgreSQL container is running
docker ps

# If not running, start it
docker-compose up -d db

# Check logs
docker-compose logs db
```

### Prisma Issues

```bash
# Regenerate client
npx prisma generate

# Reset database (development only)
npx prisma migrate reset

# View database in browser
npx prisma studio
```

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Deployment Documentation

For complete deployment and cleanup instructions, see:

- **[INSTRUCTIONS.md](./INSTRUCTIONS.md)** - Local development setup and Docker deployment
- **[VPS_DEPLOYMENT.md](./VPS_DEPLOYMENT.md)** - Complete VPS deployment guide with step-by-step cleanup instructions

**VPS_DEPLOYMENT.md includes:**
- Initial VPS setup and security configuration
- Application deployment with Docker
- Nginx reverse proxy configuration
- SSL certificate setup with Let's Encrypt
- Monitoring and maintenance procedures
- **Complete removal guide** - How to cleanly remove the application without leaving any residues after the event

---

## Contact

- **Developer**: Cristian Vidal
- **End User (Admin)**: Rocio (non-technical)
- **WhatsApp for contributions**: +34 649 22 55 90

---

*Last updated: January 31, 2026*
