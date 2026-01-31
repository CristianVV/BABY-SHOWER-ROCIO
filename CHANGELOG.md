# Changelog

All notable changes to this project will be documented in this file.

## [2026-01-31] - External Purchase Flow & Docker Fixes

### Added

#### External Purchase Modal (`ExternalPurchaseModal.tsx`)
A new streamlined checkout flow for gifts purchased externally (e.g., from Amazon links):

- **Purpose**: When guests click "Ya lo compré" (I already bought it) on external gifts, instead of going through the cart, they see a direct modal to confirm their purchase
- **Flow**: Modal → Enter name + phone + optional message → Submit → WhatsApp notification → Redirect to /gracias
- **Features**:
  - Collects guest name (required)
  - Collects phone number (required)
  - Optional message for the baby
  - Sends contribution to API with `isExternalPurchase: true`
  - Opens WhatsApp with pre-filled message to notify the family
  - Body scroll lock when modal is open
  - Proper z-index (9999) for overlay
  - Responsive design with max-height scroll

**File**: `src/components/guest/ExternalPurchaseModal.tsx`

### Changed

#### GiftCard Component (`GiftCard.tsx`)
- Modified `handleMarkAsPurchased` function to open the new `ExternalPurchaseModal` instead of adding to cart
- Added state management for modal visibility (`showExternalModal`)
- Imported and integrated `ExternalPurchaseModal` component

#### Dockerfile - Debian Slim Migration
Migrated from Alpine to Debian Slim for Prisma OpenSSL compatibility:

**Before:**
```dockerfile
FROM node:20-alpine AS deps
FROM node:20-alpine AS builder
FROM node:20-alpine AS runner
```

**After:**
```dockerfile
FROM node:20-slim AS deps
FROM node:20-slim AS builder
FROM node:20-slim AS runner
```

**Reason**: Prisma requires OpenSSL libraries. Alpine Linux modern versions dont include OpenSSL 1.1, and the package doesnt exist. Debian Slim provides proper OpenSSL support out of the box.

#### Prisma Schema (`prisma/schema.prisma`)
Added binary target for Debian OpenSSL 3.0.x compatibility:

```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

#### Docker Compose (`docker-compose.yml`)
1. **Fixed port mapping**: Changed app port from `3000:3000` to `3003:3000` to match Cloudflare Tunnel configuration
2. **Removed database port exposure**: Removed `5433:5432` port mapping from db service to avoid conflict with `tradingops-timescale` container
3. **Fixed DATABASE_URL**: Changed from hardcoded password to `${DATABASE_URL}` to use the value from `.env` file

**Before:**
```yaml
services:
  db:
    ports:
      - "5433:5432"
  app:
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/babyshower
```

**After:**
```yaml
services:
  db:
    # NO PORTS EXPOSED - internal only
  app:
    ports:
      - "3003:3000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
```

### Fixed

1. **Prisma OpenSSL Error**: `Error loading shared library libssl.so.1.1: No such file or directory`
   - Solution: Migrated to Debian Slim and added correct Prisma binary target

2. **Database Authentication Error**: `Authentication failed against database server at db`
   - Solution: Use `${DATABASE_URL}` from `.env` instead of hardcoded password in docker-compose.yml

3. **Port Conflict**: Baby shower app was on wrong port (3000 instead of 3003)
   - Solution: Updated docker-compose.yml port mapping to `3003:3000`

4. **Modal Positioning**: External purchase modal appeared with weird positioning
   - Solution: Rewrote modal with proper z-index, flexbox centering, and body scroll lock

### Technical Notes

#### VPS Configuration
- **Server**: Hostinger VPS (72.62.28.196)
- **Domain**: rociovp.com (via Cloudflare Tunnel → localhost:3003)
- **Containers**: 
  - `babyshower-app` - Next.js application
  - `babyshower-db` - PostgreSQL 16 (internal only, no exposed ports)

#### Environment Variables
The app uses these key environment variables:
- `DATABASE_URL` - PostgreSQL connection string (from `.env`)
- `NEXT_PUBLIC_APP_URL` - Public URL (https://rociovp.com)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - WhatsApp for notifications

#### Deployment Command
```bash
cd /var/www/babyshower
docker compose build --no-cache app
docker compose up -d
```

---

## Previous Changes

See git history for changes prior to this changelog.
