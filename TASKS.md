# TASKS.md - Baby Shower de Rocío

> Development task tracker. Update as work progresses.

## Project Status: NOT STARTED

**Target:** MVP live within a couple of days
**Audience:** < 50 guests
**Post-Event Plan:** Dockerize for local development, evolve to multi-tenant SaaS

---

## Phase 0: Project Setup

### Infrastructure
- [ ] **0.1** Initialize Next.js 14 project with TypeScript
- [ ] **0.2** Configure Tailwind CSS with custom theme (daisy warmth colors)
- [ ] **0.3** Set up Prisma with PostgreSQL schema
- [ ] **0.4** Create Docker Compose (app + postgres in one setup)
- [ ] **0.5** Create Dockerfile for Next.js production build
- [ ] **0.6** Set up environment variables (.env.example)
- [ ] **0.7** Configure ESLint and Prettier
- [ ] **0.8** Add Google Fonts (Cormorant Garamond, Inter)

### Git & Documentation
- [x] **0.9** Initialize git repository
- [x] **0.10** Create CLAUDE.md context file
- [x] **0.11** Create TASKS.md tracker
- [ ] **0.12** Create .gitignore (node_modules, .env, .next, postgres data)
- [ ] **0.13** Initial commit

---

## Phase 1: Database & API Foundation

### Database Schema
- [ ] **1.1** Define Prisma schema (Category, Gift, Contribution, PaymentMethod, SiteSettings)
- [ ] **1.2** Create initial migration
- [ ] **1.3** Write seed script with default categories:
  - Ropa (Clothing)
  - Muebles (Furniture)
  - Higiene (Hygiene)
  - Alimentación (Feeding)
  - Juguetes (Toys)
  - Paseo (Stroller/Travel)
  - Decoración (Decoration)
  - Experiencias (Experiences)
  - Contribución Libre (Free Contribution)
- [ ] **1.4** Seed default payment methods (Bizum with phone number)
- [ ] **1.5** Seed default site settings

### API Routes
- [ ] **1.6** `POST /api/auth/guest` - Validate guest password, set session
- [ ] **1.7** `POST /api/auth/admin` - Validate admin password, set session
- [ ] **1.8** `GET /api/auth/check` - Check current session type
- [ ] **1.9** `POST /api/auth/logout` - Clear session

- [ ] **1.10** `GET /api/categories` - List all categories
- [ ] **1.11** `POST /api/categories` - Create category (admin)
- [ ] **1.12** `PUT /api/categories/[id]` - Update category (admin)
- [ ] **1.13** `DELETE /api/categories/[id]` - Delete category (admin)

- [ ] **1.14** `GET /api/gifts` - List gifts (with filters)
- [ ] **1.15** `GET /api/gifts/[id]` - Get single gift
- [ ] **1.16** `POST /api/gifts` - Create gift (admin)
- [ ] **1.17** `PUT /api/gifts/[id]` - Update gift (admin)
- [ ] **1.18** `DELETE /api/gifts/[id]` - Delete gift (admin)

- [ ] **1.19** `GET /api/contributions` - List contributions (admin)
- [ ] **1.20** `POST /api/contributions` - Submit contribution intent (guest)
- [ ] **1.21** `PUT /api/contributions/[id]` - Verify/reject (admin)

- [ ] **1.22** `GET /api/settings` - Get public settings
- [ ] **1.23** `PUT /api/settings` - Update settings (admin)

- [ ] **1.24** `GET /api/payment-methods` - List enabled payment methods
- [ ] **1.25** `PUT /api/payment-methods` - Update payment methods (admin)

---

## Phase 2: Core Components

### UI Base Components (src/components/ui/)
- [ ] **2.1** Button (variants: primary, secondary, ghost, danger)
- [ ] **2.2** Input (text, number, textarea)
- [ ] **2.3** Card (with image variant)
- [ ] **2.4** Modal/Dialog
- [ ] **2.5** Drawer (slide-over panel)
- [ ] **2.6** Progress bar (for funding progress)
- [ ] **2.7** Badge (status indicators)
- [ ] **2.8** Select/Dropdown
- [ ] **2.9** Loading spinner
- [ ] **2.10** Toast notifications

### Guest Components (src/components/guest/)
- [ ] **2.11** PasswordGate - Full-screen password entry
- [x] **2.12** HeroSection - Event info, welcome message, daisy theme
- [ ] **2.13** GiftCard - Display single gift with type-specific UI
  - Fundable: progress bar, contribute button
  - External: "Ver en tienda" + "Ya lo compré" buttons
  - Custom: amount input, message field
- [x] **2.14** GiftGallery - Grid with category filters (Bigger buttons, 4-column layout)
- [ ] **2.15** CartDrawer - Slide-over with cart items
- [ ] **2.16** CartItem - Single item in cart
- [ ] **2.17** CheckoutFlow - Multi-step: info → payment → confirm
- [ ] **2.18** PaymentInstructions - Display Bizum/Revolut/Bancolombia
- [ ] **2.19** WhatsAppButton - Generate pre-filled message
- [ ] **2.20** CurrencySelector - EUR/COP toggle

### Admin Components (src/components/admin/)
- [ ] **2.21** AdminSidebar - Navigation
- [ ] **2.22** AdminHeader - Title + logout
- [ ] **2.23** StatsCards - Overview metrics
- [ ] **2.24** GiftForm - Create/edit gift
- [ ] **2.25** GiftTable - List with actions
- [ ] **2.26** CategoryForm - Create/edit category
- [ ] **2.27** CategoryList - Draggable reorder
- [ ] **2.28** ContributionTable - Pending/verified/rejected tabs
- [ ] **2.29** ContributionActions - Verify/reject buttons
- [ ] **2.30** PaymentMethodForm - Configure each method
- [ ] **2.31** SettingsForm - Site settings
- [ ] **2.32** ImageUpload - For gift images, QR codes

---

## Phase 3: Pages & Flows

### Guest Pages
- [ ] **3.1** `/` (page.tsx) - Password gate, redirect to /gifts
- [ ] **3.2** `/(guest)/layout.tsx` - Auth check, cart provider
- [ ] **3.3** `/(guest)/page.tsx` - Hero + Gift gallery
- [ ] **3.4** `/(guest)/cart/page.tsx` - Cart review (optional, could be drawer-only)
- [ ] **3.5** `/(guest)/checkout/page.tsx` - Full checkout flow
- [ ] **3.6** `/(guest)/gracias/page.tsx` - Thank you page after submission

### Admin Pages
- [ ] **3.7** `/admin` - Password gate for admin
- [ ] **3.8** `/admin/layout.tsx` - Admin auth check, sidebar
- [ ] **3.9** `/admin/page.tsx` - Dashboard with stats
- [ ] **3.10** `/admin/gifts/page.tsx` - Gift management
- [ ] **3.11** `/admin/gifts/new/page.tsx` - Create gift form
- [ ] **3.12** `/admin/gifts/[id]/page.tsx` - Edit gift form
- [ ] **3.13** `/admin/categories/page.tsx` - Category management
- [ ] **3.14** `/admin/contributions/page.tsx` - Contribution queue
- [ ] **3.15** `/admin/payments/page.tsx` - Payment method config
- [ ] **3.16** `/admin/settings/page.tsx` - Site settings

---

## Phase 4: Integration & Polish

### Cart & Checkout Logic
- [ ] **4.1** Cart context/hook with session storage
- [ ] **4.2** Add to cart functionality
- [ ] **4.3** Remove from cart
- [ ] **4.4** Update quantities/amounts
- [ ] **4.5** Checkout form validation
- [ ] **4.6** Submit contribution to API
- [ ] **4.7** Generate WhatsApp message
- [ ] **4.8** Clear cart on successful submission

### Admin Operations
- [ ] **4.9** Real-time contribution count (polling or simple refresh)
- [ ] **4.10** Gift status auto-update when fully funded
- [ ] **4.11** Image upload to local storage (or keep URLs simple)
- [ ] **4.12** Contribution verification updates gift progress

### UX Polish
- [ ] **4.13** Loading states for all async operations
- [ ] **4.14** Error handling with user-friendly messages
- [ ] **4.15** Empty states (no gifts, no contributions, etc.)
- [ ] **4.16** Mobile responsiveness check
- [ ] **4.17** Keyboard navigation
- [ ] **4.18** Spanish copy review (all user-facing text)

---

## Phase 5: Docker & Deployment

### Docker Setup
- [ ] **5.1** Dockerfile for Next.js (multi-stage build)
- [ ] **5.2** docker-compose.yml (dev: hot reload)
- [ ] **5.3** docker-compose.prod.yml (production optimized)
- [ ] **5.4** Health checks for app and db
- [ ] **5.5** Volume for PostgreSQL data persistence
- [ ] **5.6** Volume for uploaded images

### Deployment
- [ ] **5.7** Test full Docker build locally
- [ ] **5.8** Document VPS deployment steps
- [ ] **5.9** Set up reverse proxy (nginx/traefik) if needed
- [ ] **5.10** SSL certificate (Let's Encrypt)
- [ ] **5.11** Domain configuration (if using custom domain)

---

## Phase 6: Testing & Launch

### Manual Testing
- [ ] **6.1** Guest flow: password → browse → add to cart → checkout → WhatsApp
- [ ] **6.2** Admin flow: login → add gift → verify contribution
- [ ] **6.3** Mobile testing (iOS Safari, Android Chrome)
- [ ] **6.4** Edge cases: race conditions, empty states, invalid input

### Launch Checklist
- [ ] **6.5** Change default passwords to real ones
- [ ] **6.6** Add real gifts with images
- [ ] **6.7** Configure all payment methods
- [ ] **6.8** Test WhatsApp link with real number
- [ ] **6.9** Share guest password with invitees
- [ ] **6.10** Monitor for first 24 hours

---

## Post-MVP Notes

### After the Event
1. Export contribution data
2. `docker-compose down -v` to remove from VPS
3. Keep repository for multi-tenant development

### Multi-Tenant Evolution (Future)
- Add event creation flow
- User authentication for organizers
- Event templates (baby shower, wedding, birthday)
- Custom domains per event
- Payment gateway integration
- Subscription/pricing model

### Technical Debt to Address
- [ ] Add automated tests
- [ ] Set up CI/CD pipeline
- [ ] Add proper logging
- [ ] GDPR compliance features
- [ ] Performance optimization (image lazy loading, etc.)

---

## Quick Reference

### Priority Order for MVP
1. Phase 0 (Setup) - Foundation
2. Phase 1 (Database/API) - Data layer
3. Phase 2 (Components) - UI building blocks
4. Phase 3 (Pages) - Wire everything together
5. Phase 4 (Integration) - Make it work end-to-end
6. Phase 5 (Docker) - Deployment ready
7. Phase 6 (Launch) - Go live

### Files to Create First
1. `package.json` + dependencies
2. `tailwind.config.ts` with theme
3. `prisma/schema.prisma`
4. `docker-compose.yml`
5. `src/app/layout.tsx` with fonts
6. `src/components/ui/Button.tsx` (to test setup)

### Commands to Remember
```bash
# Start dev environment
docker-compose up -d db && npm run dev

# Reset database
npx prisma migrate reset

# Deploy to VPS
docker-compose -f docker-compose.prod.yml up --build -d
```

---

*Last updated: January 2026*
