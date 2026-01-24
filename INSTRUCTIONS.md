# Setup & Deployment Instructions

> Complete guide for cloning this project and running it on any device.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (5 minutes)](#quick-start-5-minutes)
3. [Detailed Setup](#detailed-setup)
4. [Development Workflow](#development-workflow)
5. [Production Deployment](#production-deployment)
6. [VPS Deployment (Hostinger)](#vps-deployment-hostinger)
7. [Customizing for Your Event](#customizing-for-your-event)
8. [Backup & Restore](#backup--restore)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Purpose | Installation |
|----------|---------|---------|--------------|
| Node.js | 20.x LTS | JavaScript runtime | [nodejs.org](https://nodejs.org/) |
| npm | 10.x | Package manager | Comes with Node.js |
| Docker | 24.x+ | Containerization | [docker.com](https://www.docker.com/get-started/) |
| Docker Compose | 2.x | Multi-container orchestration | Comes with Docker Desktop |
| Git | 2.x | Version control | [git-scm.com](https://git-scm.com/) |

### Verify Installation

```bash
# Check all prerequisites
node --version    # Should show v20.x.x
npm --version     # Should show 10.x.x
docker --version  # Should show 24.x.x or higher
docker compose version  # Should show v2.x.x
git --version     # Should show 2.x.x
```

---

## Quick Start (5 minutes)

For those who want to get running immediately:

```bash
# 1. Clone the repository
git clone <repository-url> baby-shower-registry
cd baby-shower-registry

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Start PostgreSQL database
docker compose up -d db

# 5. Wait for database to be ready (5-10 seconds)
sleep 10

# 6. Run database migrations
npx prisma migrate dev

# 7. Seed initial data
npm run db:seed

# 8. Start development server
npm run dev
```

**Access the application:**
- Guest portal: http://localhost:3000 (password: `Rocio2026`)
- Admin panel: http://localhost:3000/admin/login (password: `AdminRocio2026`)

---

## Detailed Setup

### Step 1: Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/your-username/baby-shower-registry.git

# Or clone via SSH
git clone git@github.com:your-username/baby-shower-registry.git

# Enter the directory
cd baby-shower-registry
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all Node.js packages defined in `package.json`:
- Next.js 14 (React framework)
- Prisma (database ORM)
- Tailwind CSS (styling)
- Framer Motion (animations)
- And other utilities

### Step 3: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your preferred editor:

```env
# Database connection (for local development)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/babyshower?schema=public"

# App configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# WhatsApp number for payment confirmations
NEXT_PUBLIC_WHATSAPP_NUMBER="+34649225590"
```

### Step 4: Start the Database

```bash
# Start PostgreSQL in Docker
docker compose up -d db

# Verify it's running
docker ps
# Should show "babyshower-db" with status "Up" and "healthy"
```

**What this does:**
- Pulls PostgreSQL 16 Alpine image (lightweight)
- Creates a container named `babyshower-db`
- Exposes port 5432 for database connections
- Creates a persistent volume for data

### Step 5: Initialize the Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev

# Seed with initial data (categories, settings)
npm run db:seed
```

**Seed data includes:**
- 9 gift categories (Ropa, Muebles, Higiene, etc.)
- Default payment method (Bizum)
- Site settings with default passwords

### Step 6: Start Development Server

```bash
npm run dev
```

The server starts at http://localhost:3000

**If port 3000 is busy:**
```bash
PORT=3001 npm run dev
# or
PORT=3002 npm run dev
```

---

## Development Workflow

### Daily Development

```bash
# 1. Ensure database is running
docker compose up -d db

# 2. Start dev server
npm run dev

# 3. Make changes - hot reload is automatic

# 4. When done, stop the server (Ctrl+C)
```

### Database Management

```bash
# View database in browser GUI
npx prisma studio
# Opens at http://localhost:5555

# After changing schema.prisma, create migration
npx prisma migrate dev --name describe_your_change

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run docker:dev` | Start DB + dev server |
| `npm run docker:up` | Build & start all containers |
| `npm run docker:down` | Stop containers |
| `npm run docker:clean` | Stop & remove all data |

---

## Production Deployment

### Option 1: Docker Compose (Recommended)

This runs both the app and database in containers.

```bash
# Build and start everything
docker compose up --build -d

# Check status
docker compose ps

# View logs
docker compose logs -f

# Stop everything
docker compose down
```

**What happens:**
1. Builds Next.js app in multi-stage Docker build
2. Starts PostgreSQL container
3. Waits for database health check
4. Runs Prisma migrations automatically
5. Starts Next.js production server on port 3000

### Option 2: Manual Production Build

If you want to run the app outside Docker (database still in Docker):

```bash
# 1. Start database
docker compose up -d db

# 2. Set production environment
export NODE_ENV=production
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/babyshower?schema=public"

# 3. Build the app
npm run build

# 4. Run migrations
npx prisma migrate deploy

# 5. Start production server
npm run start
```

---

## VPS Deployment (Hostinger)

### Step 1: Prepare Your VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose plugin
apt install docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### Step 2: Clone and Configure

```bash
# Create app directory
mkdir -p /var/www
cd /var/www

# Clone repository
git clone <repository-url> baby-shower
cd baby-shower

# Create production environment file
cp .env.example .env
nano .env
```

Edit `.env` for production:

```env
# Use internal Docker network for database
DATABASE_URL="postgresql://postgres:YOUR_SECURE_PASSWORD@db:5432/babyshower?schema=public"

# Your domain
NEXT_PUBLIC_APP_URL="https://rocio.cristianvv.com"
NODE_ENV="production"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="+34649225590"
```

### Step 3: Update docker-compose.yml for Production

Edit `docker-compose.yml`:

```yaml
version: "3.8"

services:
  db:
    image: postgres:16-alpine
    container_name: babyshower-db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: YOUR_SECURE_PASSWORD  # Change this!
      POSTGRES_DB: babyshower
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    # Remove ports for security (only app container needs access)
    # ports:
    #   - "5432:5432"

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: babyshower-app
    restart: always
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:YOUR_SECURE_PASSWORD@db:5432/babyshower?schema=public
      NODE_ENV: production
      NEXT_PUBLIC_APP_URL: https://rocio.cristianvv.com
      NEXT_PUBLIC_WHATSAPP_NUMBER: "+34649225590"
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - uploads:/app/public/uploads

volumes:
  postgres_data:
  uploads:
```

### Step 4: Deploy

```bash
# Build and start
docker compose up --build -d

# Check logs
docker compose logs -f app

# Seed database (first time only)
docker compose exec app npx prisma db seed
```

### Step 5: Configure Reverse Proxy (Nginx)

If using Hostinger's built-in Nginx or installing your own:

```bash
# Install Nginx
apt install nginx

# Create site configuration
nano /etc/nginx/sites-available/babyshower
```

```nginx
server {
    listen 80;
    server_name rocio.cristianvv.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/babyshower /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

### Step 6: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d rocio.cristianvv.com

# Auto-renewal is configured automatically
```

### Step 7: Point Domain

In your domain registrar (or Hostinger DNS):

1. Add an A record pointing `rocio.cristianvv.com` to your VPS IP
2. Wait for DNS propagation (up to 24 hours, usually faster)

---

## Customizing for Your Event

### Change Event Details

1. **Via Admin Panel (Recommended):**
   - Go to `/admin/login`
   - Navigate to "Ajustes" (Settings)
   - Update event title, date, location, message

2. **Via Database Seed:**
   Edit `prisma/seed.ts`:
   ```typescript
   await prisma.siteSettings.upsert({
     where: { id: "settings" },
     update: {},
     create: {
       id: "settings",
       guestPassword: "YourPassword",
       adminPassword: "YourAdminPassword",
       eventTitle: "Your Event Name",
       eventDate: "Date of your event",
       eventTime: "Time",
       eventLocation: "Location",
       heroMessage: "Your welcome message",
       whatsappNumber: "+1234567890",
     },
   });
   ```

### Change Theme Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  background: {
    DEFAULT: "#YOUR_COLOR",
    light: "#YOUR_LIGHT_COLOR",
    white: "#YOUR_WHITE",
  },
  foreground: {
    DEFAULT: "#YOUR_TEXT_COLOR",
    // ...
  },
  accent: {
    yellow: "#YOUR_ACCENT",
    green: "#YOUR_SECONDARY_ACCENT",
  },
}
```

### Change Categories

Edit `prisma/seed.ts` or use the admin panel:

```typescript
const categories = [
  { name: "Your Category 1", slug: "category-1", order: 0 },
  { name: "Your Category 2", slug: "category-2", order: 1 },
  // ...
];
```

### Change Payment Methods

Via admin panel at `/admin/payments` or in `prisma/seed.ts`:

```typescript
await prisma.paymentMethod.create({
  data: {
    type: "bizum",
    label: "Bizum",
    value: "+34 YOUR NUMBER",
    currency: "EUR",
    enabled: true,
  },
});
```

---

## Backup & Restore

### Backup Database

```bash
# Create backup
docker compose exec db pg_dump -U postgres babyshower > backup_$(date +%Y%m%d).sql

# Or with compression
docker compose exec db pg_dump -U postgres babyshower | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restore Database

```bash
# From SQL file
docker compose exec -T db psql -U postgres babyshower < backup_20260124.sql

# From compressed file
gunzip -c backup_20260124.sql.gz | docker compose exec -T db psql -U postgres babyshower
```

### Backup Uploaded Files

```bash
# Copy uploads directory
docker cp babyshower-app:/app/public/uploads ./uploads_backup

# Or create tarball
tar -czvf uploads_$(date +%Y%m%d).tar.gz -C /var/lib/docker/volumes/baby-shower_uploads/_data .
```

### Full Backup Script

Create `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/babyshower"

mkdir -p $BACKUP_DIR

# Database
docker compose exec -T db pg_dump -U postgres babyshower | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Uploads
tar -czvf "$BACKUP_DIR/uploads_$DATE.tar.gz" -C /var/lib/docker/volumes/baby-shower_uploads/_data .

# Keep only last 7 days
find $BACKUP_DIR -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
chmod +x backup.sh
# Add to crontab for daily backups
crontab -e
# Add: 0 3 * * * /var/www/baby-shower/backup.sh
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check if containers are running
docker compose ps

# Check app logs
docker compose logs app

# Check database logs
docker compose logs db

# Restart everything
docker compose down && docker compose up --build -d
```

### Database Connection Failed

```bash
# Verify database is healthy
docker compose exec db pg_isready -U postgres

# Check database URL matches
echo $DATABASE_URL

# For local development, use localhost
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/babyshower?schema=public"

# For Docker, use service name
DATABASE_URL="postgresql://postgres:postgres@db:5432/babyshower?schema=public"
```

### Port Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill process or use different port
PORT=3001 npm run dev
```

### Migration Failed

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually
docker compose down -v
docker compose up -d db
npx prisma migrate dev
npm run db:seed
```

### Build Failed in Docker

```bash
# Clean Docker cache
docker system prune -af

# Rebuild without cache
docker compose build --no-cache

# Check Dockerfile logs
docker compose build 2>&1 | tee build.log
```

### SSL Certificate Issues

```bash
# Renew certificate manually
certbot renew

# Check certificate status
certbot certificates

# Test renewal
certbot renew --dry-run
```

### Memory Issues on VPS

```bash
# Check memory usage
free -h

# Add swap if needed
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## Need Help?

1. Check the [CLAUDE.md](./CLAUDE.md) for detailed project context
2. Review the [handoff_prompt.md](./handoff_prompt.md) to continue with AI assistance
3. Open an issue on GitHub

---

*Last updated: January 2026*
