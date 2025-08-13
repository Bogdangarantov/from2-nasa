#!/bin/bash

# SSL Setup Script for NASA.From2 Project
# Run this script on your VPS server

set -e

# Configuration
DOMAIN="${1:-your-domain.com}"
EMAIL="${2:-your-email@example.com}"

if [ "$DOMAIN" = "your-domain.com" ] || [ "$EMAIL" = "your-email@example.com" ]; then
    echo "Usage: $0 <domain> <email>"
    echo "Example: $0 nasa.from2.tech admin@from2.tech"
    exit 1
fi

echo "Setting up SSL for domain: $DOMAIN"
echo "Email: $EMAIL"

# Create necessary directories
mkdir -p ssl certbot/www certbot/conf

# Create .env file
cat > .env << EOF
DOMAIN=$DOMAIN
EMAIL=$EMAIL
NASA_API_KEY=your_nasa_api_key_here

# Vue API Configuration
# Leave empty for production (will use relative URLs)
VITE_API_URL=
EOF

echo "Created .env file with domain: $DOMAIN"

# Create initial nginx config without SSL (for initial certificate generation)
cat > vue/nginx-init.conf << EOF
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name $DOMAIN;

        # Let's Encrypt challenge
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Root directory
        root /usr/share/nginx/html;
        index index.html;

        # Handle Vue Router
        location / {
            try_files \$uri \$uri/ /index.html;
        }

        # API proxy to backend
        location /api/ {
            proxy_pass http://backend:3000;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF

echo "Created initial nginx config for certificate generation"

# Instructions for the user
echo ""
echo "=== SSL Setup Instructions ==="
echo ""
echo "1. Update your domain DNS to point to this server"
echo "2. Make sure ports 80 and 443 are open on your firewall"
echo "3. Run: docker-compose up -d frontend"
echo "4. Wait for frontend to start, then run:"
echo "   docker-compose run --rm certbot"
echo "5. After certificates are generated, run:"
echo "   docker-compose down"
echo "   docker-compose up -d"
echo ""
echo "Your site will be available at: https://$DOMAIN"
echo ""
echo "To set up automatic renewal, add to crontab:"
echo "0 12 * * * docker-compose exec frontend /usr/local/bin/ssl-renew.sh"
echo ""
echo "Note: Script automatically checks certificates daily and renews only when needed (< 30 days until expiration)"
echo ""
echo "=== Setup Complete ==="
