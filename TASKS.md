# TASKS.md - Baby Shower de Rocío

> Development task tracker. Update as work progresses.

## Project Status: ✅ MVP COMPLETE

**Target:** MVP live within a couple of days ✅
**Audience:** < 50 guests
**Post-Event Plan:** Dockerize for local development, evolve to multi-tenant SaaS

---

## Changelog

### 2026-01-30 - Checkout Bug Fixes

#### Bug #1: Payment methods not displaying
- **Issue:** Payment method step in checkout was showing empty (no payment options displayed)
- **Root Cause:** API response format mismatch
  - `/api/payment-methods` returned raw array: `[{...}]`
  - Checkout page expected wrapped format: `{ success: true, data: [...] }`
- **Fix:** Updated `src/app/(guest)/checkout/page.tsx` to handle both response formats

#### Bug #2: External purchase submission error
- **Issue:** "Hubo un error al procesar tu contribución" when checking out after marking external gift as "Ya lo compré"
- **Root Cause:** External purchases added to cart with amount = 0
  - `GiftCard.tsx` line 83: `onAddToCart(gift.id, 0, "Comprado externamente")`
  - API validation requires `amount > 0`
- **Fix:** Added `isExternalPurchase` flag to API
  - External purchases now tracked in database with `isExternalPurchase: true`
  - API skips amount/currency/payment validation for external purchases
  - Admin can verify external purchases → Gift marked as "completed" → Removed from gallery
  - Added conditional WhatsApp message format for external-only purchases
- **Verified:** Both checkout flows now work (monetary + external purchases)

#### Enhancement: External purchase reminder popup
- Added confirmation popup when clicking "Ver en tienda"
- Message: "¡Recuerda volver aquí a marcar el regalo como que 'Ya lo has comprado'..."
- User must confirm before being redirected to external store

### 2026-01-24 - MVP Completion
- All core features implemented and verified
- Guest and Admin flows working end-to-end
- Docker deployment ready

---

## Phase 0: Project Setup ✅

### Infrastructure
- [x] **0.1** Initialize Next.js 14 project with TypeScript
- [x] **0.2** Configure Tailwind CSS with custom theme (daisy warmth colors)
- [x] **0.3** Set up Prisma with PostgreSQL schema
- [x] **0.4** Create Docker Compose (app + postgres in one setup)
- [x] **0.5** Create Dockerfile for Next.js production build
- [x] **0.6** Set up environment variables (.env.example)
- [x] **0.7** Configure ESLint and Prettier
- [x] **0.8** Add Google Fonts (Cormorant Garamond, Inter)

### Git & Documentation
- [x] **0.9** Initialize git repository
- [x] **0.10** Create CLAUDE.md context file
- [x] **0.11** Create TASKS.md tracker
- [x] **0.12** Create .gitignore (node_modules, .env, .next, postgres data)
- [x] **0.13** Initial commit

---

## Phase 1: Database & API Foundation ✅

### Database Schema
- [x] **1.1** Define Prisma schema (Category, Gift, Contribution, PaymentMethod, SiteSettings)
- [x] **1.2** Create initial migration
- [x] **1.3** Write seed script with categories
- [x] **1.4** Seed default payment methods (Bizum with phone number)
- [x] **1.5** Seed default site settings

### API Routes
- [x] **1.6** `POST /api/auth/guest` - Validate guest password, set session
- [x] **1.7** `POST /api/auth/admin` - Validate admin password, set session
- [x] **1.8** `GET /api/auth/check` - Check current session type
- [x] **1.9** `POST /api/auth/logout` - Clear session
- [x] **1.10** `GET /api/categories` - List all categories
- [x] **1.11** `POST /api/categories` - Create category (admin)
- [x] **1.12** `PUT /api/categories/[id]` - Update category (admin)
- [x] **1.13** `DELETE /api/categories/[id]` - Delete category (admin)
- [x] **1.14** `GET /api/gifts` - List gifts (with filters)
- [x] **1.15** `GET /api/gifts/[id]` - Get single gift
- [x] **1.16** `POST /api/gifts` - Create gift (admin)
- [x] **1.17** `PUT /api/gifts/[id]` - Update gift (admin)
- [x] **1.18** `DELETE /api/gifts/[id]` - Delete gift (admin)
- [x] **1.19** `GET /api/contributions` - List contributions (admin)
- [x] **1.20** `POST /api/contributions` - Submit contribution intent (guest)
- [x] **1.21** `PUT /api/contributions/[id]` - Verify/reject (admin)
- [x] **1.22** `GET /api/settings` - Get public settings
- [x] **1.23** `PUT /api/settings` - Update settings (admin)
- [x] **1.24** `GET /api/payment-methods` - List enabled payment methods
- [x] **1.25** `PUT /api/payment-methods` - Update payment methods (admin)

---

## Phase 2: Core Components ✅

### UI Base Components (src/components/ui/)
- [x] **2.1** Button (variants: primary, secondary, ghost, danger)
- [x] **2.2** Input (text, number, textarea)
- [x] **2.3** Card (with image variant)
- [x] **2.4** Modal/Dialog
- [x] **2.5** Drawer (slide-over panel)
- [x] **2.6** Progress bar (for funding progress)
- [x] **2.7** Badge (status indicators)
- [x] **2.8** Select/Dropdown
- [x] **2.9** Loading spinner
- [x] **2.10** Toast notifications

### Guest Components (src/components/guest/)
- [x] **2.11** PasswordGate - Full-screen password entry
- [x] **2.12** HeroSection - Event info, welcome message, daisy theme
- [x] **2.13** GiftCard - Display single gift with type-specific UI
- [x] **2.14** GiftGallery - Grid with category filters (4-column layout)
- [x] **2.15** CartDrawer - Slide-over with cart items
- [x] **2.16** CartItem - Single item in cart
- [x] **2.17** CheckoutFlow - Multi-step: info → payment → confirm
- [x] **2.18** PaymentInstructions - Display Bizum/Revolut/Bancolombia
- [x] **2.19** WhatsAppButton - Generate pre-filled message
- [x] **2.20** CurrencySelector - EUR/COP toggle

### Admin Components (src/components/admin/)
- [x] **2.21** AdminSidebar - Navigation
- [x] **2.22** AdminHeader - Title + logout
- [x] **2.23** StatsCards - Overview metrics
- [x] **2.24** GiftForm - Create/edit gift
- [x] **2.25** GiftTable - List with actions
- [x] **2.26** CategoryForm - Create/edit category
- [x] **2.27** CategoryList - Draggable reorder
- [x] **2.28** ContributionTable - Pending/verified/rejected tabs
- [x] **2.29** ContributionActions - Verify/reject buttons
- [x] **2.30** PaymentMethodForm - Configure each method
- [x] **2.31** SettingsForm - Site settings
- [x] **2.32** ImageUpload - For gift images, QR codes

---

## Phase 3: Pages & Flows ✅

### Guest Pages
- [x] **3.1** `/` (page.tsx) - Password gate, redirect to /gallery
- [x] **3.2** `/(guest)/layout.tsx` - Auth check, cart provider
- [x] **3.3** `/(guest)/gallery/page.tsx` - Hero + Gift gallery
- [x] **3.4** `/(guest)/checkout/page.tsx` - Full checkout flow
- [x] **3.5** `/(guest)/gracias/page.tsx` - Thank you page after submission

### Admin Pages
- [x] **3.6** `/admin/login` - Password gate for admin
- [x] **3.7** `/admin/layout.tsx` - Admin auth check, sidebar
- [x] **3.8** `/admin/page.tsx` - Dashboard with stats
- [x] **3.9** `/admin/gifts/page.tsx` - Gift management
- [x] **3.10** `/admin/categories/page.tsx` - Category management
- [x] **3.11** `/admin/contributions/page.tsx` - Contribution queue
- [x] **3.12** `/admin/payments/page.tsx` - Payment method config
- [x] **3.13** `/admin/settings/page.tsx` - Site settings

---

## Phase 4: Integration & Polish ✅

### Cart & Checkout Logic
- [x] **4.1** Cart context/hook with session storage
- [x] **4.2** Add to cart functionality
- [x] **4.3** Remove from cart
- [x] **4.4** Update quantities/amounts
- [x] **4.5** Checkout form validation
- [x] **4.6** Submit contribution to API
- [x] **4.7** Generate WhatsApp message
- [x] **4.8** Clear cart on successful submission

### Admin Operations
- [x] **4.9** Gift status auto-update when fully funded
- [x] **4.10** Contribution verification updates gift progress

### UX Polish
- [x] **4.11** Loading states for all async operations
- [x] **4.12** Error handling with user-friendly messages
- [x] **4.13** Mobile responsiveness check
- [x] **4.14** Spanish copy review (all user-facing text)

---

## Phase 5: Docker & Deployment ✅

### Docker Setup
- [x] **5.1** Dockerfile for Next.js (multi-stage build)
- [x] **5.2** docker-compose.yml (dev: hot reload)
- [x] **5.3** Health checks for app and db
- [x] **5.4** Volume for PostgreSQL data persistence

### Deployment
- [x] **5.5** Test full Docker build locally
- [x] **5.6** Document VPS deployment steps (INSTRUCTIONS.md)

---

## Phase 6: Testing & Launch

### Manual Testing
- [x] **6.1** Guest flow: password → browse → add to cart → checkout → WhatsApp
- [x] **6.2** Admin flow: login → add gift → verify contribution
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

## Known Issues & Fixes

| Date | Issue | Status | Details |
|------|-------|--------|---------|
| 2026-01-30 | Checkout payment methods not showing | ✅ Fixed | API response format mismatch in `checkout/page.tsx` |
| 2026-01-30 | External purchase checkout error | ✅ Fixed | Skip API submission for amount=0 items in `checkout/page.tsx` |

---

## Post-MVP / Next Steps

### Immediate (Before Event)
- [ ] Deploy to production VPS
- [ ] Configure SSL certificate
- [ ] Add real gift items
- [ ] Test with real payment methods

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

### Default Credentials
| Role | Password |
|------|----------|
| Guest | `Rocio2026` |
| Admin | `AdminRocio2026` |

### Commands to Remember
```bash
# Start dev environment
docker compose up -d db && npm run dev

# Reset database
npx prisma migrate reset

# Deploy to VPS
docker compose up --build -d
```

---

*Last updated: January 30, 2026*
