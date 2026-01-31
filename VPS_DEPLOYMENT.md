# VPS Deployment & Cleanup Guide

> Complete step-by-step guide for deploying to a VPS and completely removing the application when you're done, without leaving any residues.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [VPS Setup](#vps-setup)
3. [Application Deployment](#application-deployment)
4. [Post-Deployment Configuration](#post-deployment-configuration)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Complete Removal (Cleanup)](#complete-removal-cleanup)
7. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying to your VPS, ensure you have:

- [ ] VPS server with at least 1 GB RAM and 10 GB disk space
- [ ] Root or sudo access to the VPS
- [ ] Domain name configured (or using IP address)
- [ ] SSH access to the VPS
- [ ] Git repository URL
- [ ] Production passwords prepared (guest and admin)

**Recommended VPS Providers:**
- Hostinger VPS
- DigitalOcean
- Linode
- Vultr
- AWS Lightsail

---

## VPS Setup

### Step 1: Initial Server Setup

```bash
# SSH into your VPS
ssh root@your-vps-ip
# Or if you have a non-root user with sudo
ssh username@your-vps-ip

# Update the system
sudo apt update && sudo apt upgrade -y

# Install basic utilities
sudo apt install -y curl wget git nano ufw
```

### Step 2: Create Application User (Security Best Practice)

```bash
# Create a dedicated user for the application
sudo adduser babyshower
# Follow prompts to set password

# Add user to sudo group (if needed)
sudo usermod -aG sudo babyshower

# Switch to the new user
su - babyshower
```

### Step 3: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to the docker group
sudo usermod -aG docker $USER

# Install Docker Compose plugin
sudo apt install -y docker-compose-plugin

# Verify installation
docker --version
docker compose version

# Start Docker service
sudo systemctl enable docker
sudo systemctl start docker
```

**Log out and log back in** for group changes to take effect:
```bash
exit
ssh babyshower@your-vps-ip
```

### Step 4: Configure Firewall

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH (IMPORTANT: do this first!)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

---

## Application Deployment

### Step 1: Clone the Repository

```bash
# Create application directory
sudo mkdir -p /var/www
sudo chown $USER:$USER /var/www
cd /var/www

# Clone the repository
git clone https://github.com/your-username/baby-shower-rocio.git babyshower
cd babyshower

# Or if using private repository with SSH
# git clone git@github.com:your-username/baby-shower-rocio.git babyshower
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit the environment file
nano .env
```

**Production `.env` configuration:**

```env
# Database (Docker internal network)
DATABASE_URL="postgresql://postgres:CHANGE_THIS_PASSWORD@db:5432/babyshower?schema=public"

# App Configuration
NEXT_PUBLIC_APP_URL="https://rocio.cristianvv.com"
NODE_ENV="production"

# WhatsApp Number
NEXT_PUBLIC_WHATSAPP_NUMBER="+34649225590"
```

**IMPORTANT:** Replace `CHANGE_THIS_PASSWORD` with a strong password.

### Step 3: Update Docker Compose for Production

Edit `docker-compose.yml`:

```bash
nano docker-compose.yml
```

Update the database password and remove exposed ports for security:

```yaml
version: "3.8"

services:
  db:
    image: postgres:16-alpine
    container_name: babyshower-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: YOUR_SECURE_DB_PASSWORD  # Must match .env
      POSTGRES_DB: babyshower
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    # Remove public port exposure for security
    # Only app container needs database access via Docker network

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: babyshower-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:YOUR_SECURE_DB_PASSWORD@db:5432/babyshower?schema=public
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

### Step 4: Build and Start the Application

```bash
# Build and start containers
docker compose up --build -d

# This will:
# 1. Build the Next.js app
# 2. Start PostgreSQL database
# 3. Run database migrations
# 4. Start the production server

# Check if containers are running
docker compose ps

# View logs
docker compose logs -f
# Press Ctrl+C to exit log view
```

### Step 5: Seed the Database

```bash
# Run database seed (only first time)
docker compose exec app npx prisma db seed

# Verify the app is accessible
curl http://localhost:3000
```

---

## Post-Deployment Configuration

### Step 1: Install and Configure Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Create site configuration
sudo nano /etc/nginx/sites-available/babyshower
```

**Nginx configuration:**

```nginx
server {
    listen 80;
    server_name rocio.cristianvv.com www.rocio.cristianvv.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Client max body size (for image uploads)
    client_max_body_size 10M;

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
# Enable the site
sudo ln -s /etc/nginx/sites-available/babyshower /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 2: Configure SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d rocio.cristianvv.com -d www.rocio.cristianvv.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: yes)

# Verify auto-renewal is configured
sudo certbot renew --dry-run
```

**Certbot will automatically:**
- Obtain SSL certificate
- Configure Nginx for HTTPS
- Set up automatic renewal (cron job)

### Step 3: Configure Domain DNS

In your domain registrar (e.g., Namecheap, GoDaddy, Hostinger DNS):

1. **Add A Record:**
   - Type: `A`
   - Name: `@` (or `rocio`)
   - Value: `Your VPS IP address`
   - TTL: `3600` (or automatic)

2. **Add CNAME Record (optional for www):**
   - Type: `CNAME`
   - Name: `www`
   - Value: `rocio.cristianvv.com`
   - TTL: `3600`

3. **Wait for DNS propagation** (5 minutes to 24 hours)

Check propagation:
```bash
# Check from your local machine
dig rocio.cristianvv.com
nslookup rocio.cristianvv.com
```

### Step 4: Change Default Passwords

```bash
# Access the admin panel
# Go to https://rocio.cristianvv.com/admin/login
# Login with default password: AdminRocio2026
# Navigate to Settings (Ajustes)
# Change both guest and admin passwords
```

**IMPORTANT:** Change passwords immediately after deployment for security.

---

## Monitoring & Maintenance

### View Application Logs

```bash
# View all logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View only app logs
docker compose logs app

# View only database logs
docker compose logs db

# View last 50 lines
docker compose logs --tail=50
```

### Check Container Status

```bash
# List running containers
docker compose ps

# Check Docker stats (CPU, memory usage)
docker stats babyshower-app babyshower-db
```

### Restart the Application

```bash
cd /var/www/babyshower

# Restart all containers
docker compose restart

# Restart only app container
docker compose restart app

# Restart only database
docker compose restart db
```

### Update the Application

```bash
cd /var/www/babyshower

# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose up --build -d

# View logs to verify
docker compose logs -f app
```

### Backup Database

```bash
# Create backup directory
mkdir -p ~/backups

# Backup database
docker compose exec -T db pg_dump -U postgres babyshower > ~/backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with compression
docker compose exec -T db pg_dump -U postgres babyshower | gzip > ~/backups/backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Backup uploaded files
docker cp babyshower-app:/app/public/uploads ~/backups/uploads_$(date +%Y%m%d_%H%M%S)
```

### Automated Backup Script

```bash
# Create backup script
nano ~/backup-babyshower.sh
```

```bash
#!/bin/bash
# Backup script for Baby Shower app

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/backups/babyshower"
APP_DIR="/var/www/babyshower"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup database
cd "$APP_DIR"
docker compose exec -T db pg_dump -U postgres babyshower | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Backup uploads
docker cp babyshower-app:/app/public/uploads "$BACKUP_DIR/uploads_$DATE"
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" -C "$BACKUP_DIR" "uploads_$DATE"
rm -rf "$BACKUP_DIR/uploads_$DATE"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -type f -mtime +7 -delete

echo "✅ Backup completed: $DATE"
```

```bash
# Make executable
chmod +x ~/backup-babyshower.sh

# Test the script
~/backup-babyshower.sh

# Schedule daily backups (3 AM)
crontab -e
# Add this line:
0 3 * * * $HOME/backup-babyshower.sh >> $HOME/backup-babyshower.log 2>&1
```

---

## Complete Removal (Cleanup)

When the event is over and you want to completely remove the application from your VPS without leaving any residues, follow these steps:

### Step 1: Backup Data (Optional but Recommended)

```bash
# Final backup before removal
cd /var/www/babyshower

# Backup database
docker compose exec -T db pg_dump -U postgres babyshower | gzip > ~/final_backup_$(date +%Y%m%d).sql.gz

# Backup uploaded files
docker cp babyshower-app:/app/public/uploads ~/final_uploads_backup

# Download to your local machine (from your local terminal)
scp babyshower@your-vps-ip:~/final_backup_*.sql.gz ~/Downloads/
scp -r babyshower@your-vps-ip:~/final_uploads_backup ~/Downloads/
```

### Step 2: Stop and Remove Containers

```bash
cd /var/www/babyshower

# Stop all containers
docker compose down

# Remove containers AND volumes (this deletes all data)
docker compose down -v
```

### Step 3: Remove Docker Images

```bash
# List all images
docker images

# Remove specific images for this project
docker rmi babyshower-app:latest
docker rmi postgres:16-alpine

# Or remove all unused images
docker image prune -a
```

### Step 4: Remove Application Files

```bash
# Remove application directory
sudo rm -rf /var/www/babyshower

# Remove any backups (if you've already downloaded them)
rm -rf ~/backups/babyshower
rm -f ~/backup-babyshower.sh
rm -f ~/backup-babyshower.log
rm -f ~/final_backup_*.sql.gz
rm -rf ~/final_uploads_backup
```

### Step 5: Remove Nginx Configuration

```bash
# Remove site configuration
sudo rm /etc/nginx/sites-available/babyshower
sudo rm /etc/nginx/sites-enabled/babyshower

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 6: Remove SSL Certificates

```bash
# Delete SSL certificates
sudo certbot delete --cert-name rocio.cristianvv.com

# This removes:
# - SSL certificates
# - Let's Encrypt renewal configuration
```

### Step 7: Clean Up Docker System

```bash
# Remove unused Docker networks
docker network prune

# Remove unused Docker volumes
docker volume prune

# Remove all unused Docker data (containers, networks, images, build cache)
docker system prune -a --volumes

# Confirm when prompted with 'y'
```

### Step 8: Remove User and Permissions (Optional)

```bash
# If you created a dedicated user, remove it
sudo deluser --remove-home babyshower
```

### Step 9: Update Firewall Rules (Optional)

```bash
# If you no longer need HTTP/HTTPS access
sudo ufw delete allow 80/tcp
sudo ufw delete allow 443/tcp

# Check firewall status
sudo ufw status
```

### Step 10: Verify Complete Removal

Run these commands to ensure everything is removed:

```bash
# Check for running Docker containers
docker ps -a
# Should not show babyshower-app or babyshower-db

# Check for Docker volumes
docker volume ls
# Should not show babyshower volumes

# Check for application files
ls -la /var/www/
# Should not show babyshower directory

# Check Nginx sites
ls -la /etc/nginx/sites-enabled/
# Should not show babyshower

# Check SSL certificates
sudo certbot certificates
# Should not list rocio.cristianvv.com

# Check disk space (should have freed up space)
df -h
```

### Step 11: Remove DNS Records (Optional)

If you no longer need the domain:

1. Go to your domain registrar's DNS management
2. Delete the A record for `rocio.cristianvv.com`
3. Delete the CNAME record for `www` (if configured)

---

## Troubleshooting

### Application Not Accessible After Deployment

```bash
# Check if containers are running
docker compose ps

# Check app logs
docker compose logs app

# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx configuration
sudo nginx -t

# Check firewall
sudo ufw status
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificates manually
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# Check Nginx SSL configuration
sudo nano /etc/nginx/sites-available/babyshower
```

### Database Connection Failed

```bash
# Check database container
docker compose logs db

# Verify database is healthy
docker compose exec db pg_isready -U postgres

# Check environment variables
docker compose exec app env | grep DATABASE_URL

# Restart database
docker compose restart db
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Check Docker disk usage
docker system df

# Clean up Docker resources
docker system prune -a --volumes
```

### Port Conflicts

```bash
# Check what's using port 3000
sudo lsof -i :3000

# Check what's using port 80
sudo lsof -i :80

# If needed, change app port in docker-compose.yml
# Change "3000:3000" to "3001:3000"
```

### Container Won't Start

```bash
# Check detailed logs
docker compose logs --tail=100 app

# Try rebuilding
docker compose down
docker compose build --no-cache
docker compose up -d

# Check for errors
docker compose logs -f
```

---

## Security Checklist

Before going live, ensure:

- [ ] Changed default guest password from `Rocio2026`
- [ ] Changed default admin password from `AdminRocio2026`
- [ ] Database password is strong and unique
- [ ] SSL certificate is active (HTTPS)
- [ ] Firewall is configured (UFW)
- [ ] Database port (5432) is NOT exposed publicly
- [ ] Regular backups are scheduled
- [ ] Nginx security headers are configured
- [ ] Docker containers restart policy is set (`unless-stopped`)

---

## Performance Optimization

### For Low-Memory VPS (1GB RAM)

```bash
# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Enable Gzip in Nginx

Edit `/etc/nginx/nginx.conf`:

```nginx
http {
    # ... existing config ...

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

```bash
sudo systemctl reload nginx
```

---

## Post-Event Checklist

After the baby shower event:

- [ ] Download final backup of database
- [ ] Download all uploaded images
- [ ] Export contribution data to CSV (via admin panel)
- [ ] Thank guests (optional: send summary email)
- [ ] Follow complete removal steps above
- [ ] Verify no residues remain
- [ ] Archive repository for future multi-tenant development

---

## Need Help?

- **Documentation**: Check [CLAUDE.md](./CLAUDE.md) for project context
- **Setup Issues**: Review [INSTRUCTIONS.md](./INSTRUCTIONS.md)
- **Git Repository**: Open an issue on GitHub

---

*Last updated: January 31, 2026*
