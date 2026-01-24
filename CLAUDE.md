# CLAUDE.md - Baby Shower de Rocío

> Context file for Claude Code sessions. Read this first.

## Project Overview

**What:** A private, emotional gift registry web application for Rocío's baby shower.
**Why:** Enable friends and family to contribute to gifts with manual payment verification.
**Philosophy:** This is a **family coordination interface**, NOT an e-commerce platform.

### Core Principles
1. **Minimal friction** - Guest completes contribution in < 2 minutes
2. **Emotional clarity** - Warm, calm, personal UX
3. **Privacy by default** - Guests are anonymous to other guests
4. **Operational simplicity** - Admin (Rocío/partner) verifies payments manually

---

## Event Details

- **Event:** Baby Shower de Rocío
- **Date:** 15 February 2026, 13:00h
- **Location:** Calle de la Azalea, Alcobendas, Madrid
- **Expected Guests:** < 50 people
- **Primary Language:** Spanish
- **Currencies:** EUR (Bizum, Revolut), COP (Bancolombia)
- **Date Format:** European (DD/MM/YYYY)

---

## Technical Stack

### Framework & Runtime
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State:** React useState/useContext (session-based cart)

### Infrastructure
- **Hosting:** Hostinger VPS (Docker deployment)
- **Database:** PostgreSQL (in same Docker container)
- **Container:** Single Docker Compose setup (app + db)
- **Goal:** Easy deploy, easy teardown for MVP

### Development Environment
- **Primary IDE:** Google Antigravity (https://antigravity.google/)
- **AI Assistant:** Claude Code
- **Version Control:** Git

#### Google Antigravity Integration Notes

Google Antigravity is Google's AI-first IDE launched November 2025:
- **Base:** Modified fork of VS Code with agentic capabilities
- **AI Models:** Powered by Gemini 3, also supports Claude (Sonnet 4.5, Opus 4.5)
- **Key Feature:** "Agent-first" paradigm with Editor view and Manager view
- **MCP Support:** Model Context Protocol for secure data connections

**Working with Antigravity + Claude Code:**
- Both tools can be used in parallel (Antigravity for visual editing, Claude Code for CLI tasks)
- Antigravity's Manager view can orchestrate multiple agents across workspaces
- Claude Code (this tool) is ideal for:
  - Complex multi-file refactors
  - Database migrations and seeding
  - Docker configuration
  - Git operations
  - Deployment scripts
- Antigravity excels at:
  - Visual component development
  - Real-time preview
  - Google Cloud integrations (if needed later)

**Project Compatibility:**
- All code should be standard Next.js/TypeScript (works in any IDE)
- Dependencies managed via package.json
- npm scripts for all operations
- Docker Compose for environment parity
- No IDE-specific configurations required

---

## Design System

### Theme: "Daisy Warmth"
Inspired by the invitation video featuring chamomile/daisy bouquet.

### Color Palette
```css
:root {
  /* Backgrounds */
  --bg-primary: #D9CBBA;      /* Warm beige from invitation */
  --bg-secondary: #F5F0E8;    /* Lighter cream for cards */
  --bg-white: #FFFEF9;        /* Off-white */

  /* Text */
  --text-primary: #3D3225;    /* Dark brown/sepia */
  --text-secondary: #6B5D4D;  /* Medium brown */
  --text-muted: #9A8B7A;      /* Light brown */

  /* Accents */
  --accent-yellow: #E8B931;   /* Daisy center gold */
  --accent-green: #7A9B5C;    /* Stem green */
  --accent-white: #FFFFFF;    /* Daisy petals */

  /* States */
  --success: #7A9B5C;         /* Green - verified */
  --pending: #E8B931;         /* Yellow - pending */
  --error: #C75D5D;           /* Soft red - rejected */
}
```

### Typography
- **Headings:** Cormorant Garamond (elegant serif) - Google Fonts
- **Body:** Inter (clean sans-serif) - Google Fonts
- **Special:** "ROCÍO" uses a sophisticated serif with generous letter-spacing

### Visual Style
- Apple-inspired "warm minimalism"
- Generous whitespace
- Rounded cards (rounded-2xl to rounded-3xl)
- Subtle shadows and micro-interactions
- Mobile-first responsive design
- No cartoons, no loud colors

### Assets Location
- `/invitation-video-frames/` - 109 PNG frames from invitation video
  - Frame 000: Bouquet starting position
  - Frame 054: Mid-animation with falling petals
  - Frame 108: Final frame with event details (potential logo source)
  - These can be used for scroll animations, backgrounds, or creative elements

---

## Application Architecture

### User Roles

#### Guest (Anonymous)
- Access via shared password (e.g., "Rocio2026")
- Browse gift gallery
- Add contributions to cart
- Submit contribution intent
- See payment instructions
- Send WhatsApp confirmation

#### Admin (Rocío/Partner)
- Access via separate admin password
- Route: `/admin`
- Full CRUD on gifts and categories
- Verify/reject contributions
- Configure payment methods
- View contribution timeline
- Manage site settings

### Data Model

```typescript
// Core entities

interface Category {
  id: string;
  name: string;           // e.g., "Ropa", "Muebles", "Higiene"
  order: number;
  createdAt: Date;
}

interface Gift {
  id: string;
  categoryId: string;
  title: string;
  description?: string;
  imageUrl?: string;       // Uploaded or external (Amazon, etc.)
  externalUrl?: string;    // Link to store for "External Purchase" type
  type: 'fundable' | 'external' | 'custom';
  targetAmount?: number;   // For fundable gifts (in cents)
  currentAmount: number;   // Verified contributions only
  status: 'available' | 'partially_funded' | 'completed' | 'hidden';
  createdAt: Date;
  updatedAt: Date;
}

interface Contribution {
  id: string;
  giftId: string;
  guestName: string;
  guestPhone: string;
  guestMessage?: string;   // Message for the baby
  amount: number;          // In cents
  currency: 'EUR' | 'COP';
  paymentMethod: 'bizum' | 'revolut' | 'bancolombia';
  status: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
}

interface PaymentMethod {
  id: string;
  type: 'bizum' | 'revolut' | 'bancolombia';
  label: string;
  value: string;           // Phone number, link, or QR image URL
  currency: 'EUR' | 'COP';
  enabled: boolean;
}

interface SiteSettings {
  guestPassword: string;
  adminPassword: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  heroMessage: string;
  whatsappNumber: string;  // +34 649 22 55 90
}
```

### Gift Types

1. **Fundable Gift** (`type: 'fundable'`)
   - Has target amount
   - Multiple contributors allowed
   - Minimum contribution: €10
   - Shows progress bar
   - Completed when `currentAmount >= targetAmount`

2. **External Purchase** (`type: 'external'`)
   - Links to external store (Amazon, etc.)
   - Guest clicks "I've bought this"
   - Admin verifies purchase

3. **Custom Contribution** (`type: 'custom'`)
   - Free amount, no target
   - Optional message for baby
   - General support category

### Contribution Lifecycle
```
Guest submits intent
        ↓
  Status: PENDING
        ↓
Payment happens externally (Bizum/Revolut/Bancolombia)
        ↓
Admin verifies in dashboard
        ↓
  Status: VERIFIED ←→ REJECTED
        ↓
Progress bar updates (verified only)
```

---

## Key Features

### Guest Experience
1. **Password Gate** - Simple overlay, localStorage session
2. **Hero Section** - Event info, gratitude message, optional scroll animation
3. **Gift Gallery** - Filterable by category, clear status indicators
4. **Cart System** - Session-based, multiple gifts
5. **Checkout Flow** - Collect name, phone, message; show payment instructions
6. **WhatsApp Confirmation** - Pre-filled message to +34 649 22 55 90

### Admin Dashboard
1. **Gift Management** - CRUD, image upload/URL, reorder
2. **Category Management** - CRUD, reorder
3. **Contribution Queue** - Pending items, verify/reject actions
4. **Payment Settings** - Configure Bizum, Revolut, Bancolombia
5. **Site Settings** - Passwords, event details, messages
6. **Activity Log** - Recent contributions, timeline view

---

## Payment Configuration

### Default Payment Methods
```
Bizum: +34 649 22 55 90 (EUR)
Revolut: [To be configured in admin]
Bancolombia: [To be configured in admin - QR upload]
```

### WhatsApp Integration
- Number: +34 649 22 55 90
- Pre-filled message template:
  ```
  ¡Hola! Acabo de hacer una contribución para el baby shower de Rocío.

  Regalo(s): {gift_names}
  Cantidad: {amount} {currency}
  Método: {payment_method}
  Nombre: {guest_name}

  ¡Gracias! 🌼
  ```

---

## File Structure

```
/
├── CLAUDE.md                    # This file
├── TASKS.md                     # Development task tracker
├── docker-compose.yml           # App + PostgreSQL
├── Dockerfile                   # Next.js production build
├── .env.example                 # Environment template
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Initial categories + sample data
│
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout, fonts, providers
│   │   ├── page.tsx             # Password gate + redirect
│   │   ├── (guest)/
│   │   │   ├── layout.tsx       # Guest layout with auth check
│   │   │   ├── page.tsx         # Hero + Gift gallery
│   │   │   ├── cart/
│   │   │   │   └── page.tsx     # Cart review
│   │   │   └── checkout/
│   │   │       └── page.tsx     # Payment instructions
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx       # Admin layout with auth
│   │   │   ├── page.tsx         # Dashboard overview
│   │   │   ├── gifts/
│   │   │   ├── categories/
│   │   │   ├── contributions/
│   │   │   ├── payments/
│   │   │   └── settings/
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       ├── gifts/
│   │       ├── categories/
│   │       ├── contributions/
│   │       └── settings/
│   │
│   ├── components/
│   │   ├── ui/                  # Base components (Button, Card, Input, etc.)
│   │   ├── guest/               # Guest-facing components
│   │   │   ├── PasswordGate.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── GiftCard.tsx
│   │   │   ├── GiftGallery.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── CheckoutFlow.tsx
│   │   │
│   │   └── admin/               # Admin components
│   │       ├── Sidebar.tsx
│   │       ├── GiftForm.tsx
│   │       ├── ContributionTable.tsx
│   │       └── ...
│   │
│   ├── lib/
│   │   ├── db.ts                # Prisma client
│   │   ├── auth.ts              # Password session logic
│   │   ├── utils.ts             # Helpers
│   │   └── constants.ts         # App constants
│   │
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useAuth.ts
│   │   └── ...
│   │
│   └── types/
│       └── index.ts             # TypeScript interfaces
│
├── public/
│   ├── fonts/
│   └── images/
│
└── invitation-video-frames/     # Source frames (not deployed)
    └── *.png
```

---

## Commands Reference

### Development
```bash
# Install dependencies
npm install

# Start development (with Docker DB)
docker-compose up -d db
npm run dev

# Run database migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Open Prisma Studio (DB GUI)
npx prisma studio
```

### Production
```bash
# Build and start all containers
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop and remove
docker-compose down

# Stop and remove INCLUDING data
docker-compose down -v
```

### Deployment to Hostinger VPS
```bash
# SSH into VPS
ssh user@your-vps-ip

# Clone repo
git clone <repo-url>
cd baby-shower-rocio

# Copy environment
cp .env.example .env
# Edit .env with production values

# Start
docker-compose -f docker-compose.prod.yml up --build -d
```

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@db:5432/babyshower?schema=public"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Initial passwords (can be changed in admin)
INITIAL_GUEST_PASSWORD="Rocio2026"
INITIAL_ADMIN_PASSWORD="AdminRocio2026"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="+34649225590"
```

---

## Future Considerations (Post-MVP)

> These are noted for future development phases. Do NOT implement in MVP.

### Phase 2: Polish
- [ ] Scroll-based animation using video frames
- [ ] Email notifications (optional)
- [ ] Export contributions to CSV
- [ ] Print-friendly gift list

### Phase 3: Multi-Tenant
- [ ] Event creation wizard
- [ ] Subdomain or path-based routing (`/events/{slug}`)
- [ ] User accounts for event organizers
- [ ] Template system for different event types
- [ ] Stripe/payment gateway integration
- [ ] SaaS pricing model

### Compliance (Phase 2+)
- [ ] GDPR compliance audit
- [ ] Cookie consent
- [ ] Data retention policies
- [ ] Privacy policy page
- [ ] Terms of service

---

## Working with Claude Code

### Session Start Checklist
1. Read this CLAUDE.md file
2. Check TASKS.md for current progress
3. Review any recent git commits
4. Ask for clarification if task is ambiguous

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Server Components by default, 'use client' when needed
- Tailwind for styling (no CSS modules)
- Prisma for database operations
- Descriptive variable names in English
- UI text in Spanish

### Commit Messages
Format: `type: brief description`
Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`
Example: `feat: add gift card component with progress bar`

---

## Contacts

- **Developer:** Cristian Vidal
- **End User (Admin):** Rocío (non-technical)
- **WhatsApp for contributions:** +34 649 22 55 90

---

*Last updated: January 2026*
