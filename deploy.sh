#!/bin/bash

# Deploy script for PartySnap Guest Session Feature
# Run this on the VPS: ssh root@srv1297224
# Location: /var/www/demo.xenova.com.ar/party-snap

echo "🚀 Starting PartySnap deployment..."

# 1. Pull latest changes
echo "📥 Pulling latest changes..."
cd /var/www/demo.xenova.com.ar/party-snap
git pull origin main

# 2. Install backend dependencies
echo "📦 Installing backend dependencies..."
cd apps/backend
composer install --no-dev --optimize-autoloader

# 3. Run migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# 4. Seed guest session (generate QR token)
echo "🎟️ Generating guest session token..."
php artisan db:seed --class=GuestSessionSeeder --force

# 5. Clear caches
echo "🧹 Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# 6. Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd /var/www/demo.xenova.com.ar/party-snap
pnpm install

# 7. Build frontend
echo "🔨 Building frontend..."
pnpm --filter frontend build

# 8. Fix permissions
echo "🔒 Fixing permissions..."
chown -R www-data:www-data /var/www/demo.xenova.com.ar/party-snap/apps/frontend/dist
chmod -R 755 /var/www/demo.xenova.com.ar/party-snap/apps/frontend/dist

# 9. Restart backend (if using Supervisor)
echo "🔄 Restarting backend..."
# supervisorctl restart party-snap-server

# 10. Test nginx config
echo "🔍 Testing nginx configuration..."
nginx -t

# 11. Reload nginx
echo "🔄 Reloading nginx..."
systemctl reload nginx

echo "✅ Deployment complete!"
echo ""
echo "📱 IMPORTANT: Check the seeder output above for the QR token"
echo "   Use that token to generate QR codes for your event"
