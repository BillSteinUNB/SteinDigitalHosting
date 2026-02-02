# Naturally Fit Deployment Guide

## Architecture: WordPress on DreamHost + Next.js on Vercel

```
┌──────────────────────────┐         ┌──────────────────────────┐
│      DreamHost           │         │        Vercel            │
│  ┌────────────────────┐  │         │  ┌────────────────────┐  │
│  │    WordPress +     │  │ GraphQL │  │   Next.js App      │  │
│  │    WooCommerce     │◀─┼─────────┼──│   (This Project)   │  │
│  │    + WPGraphQL     │  │   API   │  │                    │  │
│  │    + MySQL DB      │  │         │  │  naturallyfit.ca   │  │
│  └────────────────────┘  │         │  └────────────────────┘  │
│   api.naturallyfit.ca    │         │                          │
└──────────────────────────┘         └──────────────────────────┘
```

---

## PART 1: DreamHost WordPress Setup

### Step 1: Create MySQL Database on DreamHost

1. Log into DreamHost Panel: https://panel.dreamhost.com
2. Go to **MySQL Databases** (under "More" or search)
3. Click **Create New MySQL Database**
   - Database name: `naturallyfit_db` (or similar)
   - New hostname: `mysql.yourdomain.com` (DreamHost will create this)
   - Create a new user with a strong password
4. **Save these credentials** - you'll need them:
   ```
   DB Host: mysql.yourdomain.com
   DB Name: naturallyfit_db
   DB User: your_username
   DB Pass: your_password
   ```

### Step 2: Import Your SQL Database

**Option A: Via phpMyAdmin (for files < 200MB)**
1. In DreamHost Panel, go to MySQL Databases
2. Click **phpMyAdmin** link next to your database
3. Select your database on the left
4. Click **Import** tab
5. Choose file: `naturallyfit_organized.sql`
6. Click **Go** (this may take several minutes)

**Option B: Via SSH (recommended for large files)**
1. Enable SSH on DreamHost Panel (Manage Users → Edit → Shell access)
2. Upload SQL file via SFTP to your home directory
3. SSH into server:
   ```bash
   ssh username@yourdomain.com
   ```
4. Import database:
   ```bash
   mysql -h mysql.yourdomain.com -u your_username -p naturallyfit_db < naturallyfit_organized.sql
   ```

### Step 3: Update Table Prefix (if needed)

Your SQL dump uses prefix `fts_`. If you need to change it:
```sql
-- Run in phpMyAdmin if needed
-- Most cases: just keep fts_ and update wp-config.php to match
```

### Step 4: Install WordPress on DreamHost

1. In DreamHost Panel, go to **Manage Websites**
2. Click **Add Website** or manage existing domain
3. Choose **WordPress** (One-Click Install) - BUT we'll override the DB
4. Or manually upload WordPress files via SFTP

**Manual WordPress Setup:**
1. Download WordPress: https://wordpress.org/download/
2. Upload via SFTP to your domain's web directory
3. Create `wp-config.php`:

```php
<?php
// wp-config.php

define('DB_NAME', 'naturallyfit_db');
define('DB_USER', 'your_username');
define('DB_PASSWORD', 'your_password');
define('DB_HOST', 'mysql.yourdomain.com');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

// IMPORTANT: Match your SQL dump's table prefix
$table_prefix = 'fts_';

// Authentication Keys - Generate at: https://api.wordpress.org/secret-key/1.1/salt/
define('AUTH_KEY',         'generate-unique-key-here');
define('SECURE_AUTH_KEY',  'generate-unique-key-here');
define('LOGGED_IN_KEY',    'generate-unique-key-here');
define('NONCE_KEY',        'generate-unique-key-here');
define('AUTH_SALT',        'generate-unique-key-here');
define('SECURE_AUTH_SALT', 'generate-unique-key-here');
define('LOGGED_IN_SALT',   'generate-unique-key-here');
define('NONCE_SALT',       'generate-unique-key-here');

// Debug (set to false in production)
define('WP_DEBUG', false);

// CORS for headless setup
define('HEADLESS_MODE_CLIENT_URL', 'https://naturallyfit.ca');

if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}

require_once ABSPATH . 'wp-settings.php';
```

### Step 5: Update WordPress URLs in Database

After import, update the site URL to your new domain:

```sql
-- Run in phpMyAdmin
UPDATE fts_options SET option_value = 'https://api.naturallyfit.ca' WHERE option_name = 'siteurl';
UPDATE fts_options SET option_value = 'https://api.naturallyfit.ca' WHERE option_name = 'home';

-- Also update any hardcoded URLs in content (optional)
UPDATE fts_posts SET post_content = REPLACE(post_content, 'https://old-domain.com', 'https://api.naturallyfit.ca');
UPDATE fts_postmeta SET meta_value = REPLACE(meta_value, 'https://old-domain.com', 'https://api.naturallyfit.ca');
```

### Step 6: Install Required WordPress Plugins

Log into WordPress admin (`https://api.naturallyfit.ca/wp-admin`) and install:

**Required Plugins:**
1. **WPGraphQL** - https://wordpress.org/plugins/wp-graphql/
2. **WPGraphQL for WooCommerce** - https://github.com/wp-graphql/wp-graphql-woocommerce
3. **WPGraphQL JWT Authentication** - https://github.com/wp-graphql/wp-graphql-jwt-authentication

**Install via WP-CLI (if available):**
```bash
wp plugin install wp-graphql --activate
wp plugin install https://github.com/wp-graphql/wp-graphql-woocommerce/releases/latest/download/wp-graphql-woocommerce.zip --activate
wp plugin install https://github.com/wp-graphql/wp-graphql-jwt-authentication/releases/latest/download/wp-graphql-jwt-authentication.zip --activate
```

### Step 7: Configure JWT Authentication

Add to `wp-config.php`:
```php
// JWT Secret - generate a strong random string
define('GRAPHQL_JWT_AUTH_SECRET_KEY', 'your-super-secret-key-min-32-chars');

// Allow token refresh
define('GRAPHQL_JWT_AUTH_REFRESH_SECRET_KEY', 'another-super-secret-key');
```

### Step 8: Configure CORS for Headless

Create/edit `.htaccess` or use a plugin:

```apache
# .htaccess - Add CORS headers
<IfModule mod_headers.c>
    SetEnvIf Origin "https://naturallyfit.ca" CORS_ORIGIN=$0
    SetEnvIf Origin "https://www.naturallyfit.ca" CORS_ORIGIN=$0
    SetEnvIf Origin "http://localhost:3000" CORS_ORIGIN=$0
    
    Header always set Access-Control-Allow-Origin %{CORS_ORIGIN}e env=CORS_ORIGIN
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
    Header always set Access-Control-Allow-Credentials "true"
</IfModule>
```

### Step 9: Test GraphQL Endpoint

Visit: `https://api.naturallyfit.ca/graphql`

Test query in GraphiQL:
```graphql
{
  products(first: 5) {
    nodes {
      id
      name
      ... on SimpleProduct {
        price
      }
    }
  }
}
```

---

## PART 2: Vercel Deployment (Next.js)

### Step 1: Prepare Your Repository

1. Push this project to GitHub:
   ```bash
   cd NaturallyFitRedo
   git init  # if not already
   git add .
   git commit -m "Initial commit - Naturally Fit headless storefront"
   git remote add origin https://github.com/yourusername/naturallyfit.git
   git push -u origin main
   ```

### Step 2: Create Vercel Account & Import Project

1. Go to https://vercel.com
2. Sign up / Log in with GitHub
3. Click **Add New** → **Project**
4. Import your `naturallyfit` repository
5. Configure project settings:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Configure Environment Variables in Vercel

In Vercel Project Settings → Environment Variables, add:

```env
# WordPress/GraphQL Connection
NEXT_PUBLIC_WORDPRESS_URL=https://api.naturallyfit.ca
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.naturallyfit.ca/graphql

# Wholesale Inquiry Form (WooCommerce REST - server-side)
# Create keys in WooCommerce Admin → Settings → Advanced → REST API (Read/Write)
WOOCOMMERCE_REST_URL=https://api.naturallyfit.ca
WOOCOMMERCE_CONSUMER_KEY=ck_live_...
WOOCOMMERCE_CONSUMER_SECRET=cs_live_...

# Authentication
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://naturallyfit.ca

# Site Config
NEXT_PUBLIC_SITE_URL=https://naturallyfit.ca
NEXT_PUBLIC_SITE_NAME=Naturally Fit

# DISABLE mock data for production
NEXT_PUBLIC_USE_MOCK_DATA=false

# Stripe (when ready)
# STRIPE_SECRET_KEY=sk_live_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Google Analytics (when ready)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 4: Deploy

1. Click **Deploy** in Vercel
2. Wait for build to complete
3. Your site will be live at: `https://your-project.vercel.app`

### Step 5: Configure Custom Domain

1. In Vercel: Project Settings → Domains
2. Add `naturallyfit.ca`
3. Update DNS at your registrar:
   - **A Record:** `@` → `76.76.21.21`
   - **CNAME:** `www` → `cname.vercel-dns.com`

---

## PART 3: DNS Configuration Summary

### For naturallyfit.ca (pointing to Vercel)
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### For api.naturallyfit.ca (pointing to DreamHost WordPress)
```
Type    Name    Value
A       api     [DreamHost IP - found in panel]
```

Or use a subdomain on DreamHost for the API.

---

## PART 4: Post-Deployment Checklist

### Immediately After Deployment

- [ ] Verify WordPress admin access: `https://api.naturallyfit.ca/wp-admin`
- [ ] Verify GraphQL endpoint: `https://api.naturallyfit.ca/graphql`
- [ ] Test product query in GraphQL
- [ ] Check Next.js site loads: `https://naturallyfit.ca`
- [ ] Test authentication (login/register)
- [ ] Test cart functionality
- [ ] Test checkout flow (will be mock until Stripe is configured)

### Before Going Live

- [ ] Configure Stripe for payments
- [ ] Set up email sending (contact forms, order notifications)
- [ ] Configure Google Analytics
- [ ] Set up SSL certificates (Vercel handles automatically, DreamHost may need configuration)
- [ ] Test all forms (contact, wholesale, newsletter)
- [ ] Remove/update broken navigation links

---

## Common Issues & Solutions

### CORS Errors
If you see CORS errors in browser console:
1. Verify `.htaccess` CORS rules on WordPress
2. Or install a CORS plugin on WordPress
3. Make sure the Origin matches exactly (http vs https, www vs non-www)

### GraphQL 403/401 Errors
1. Check WPGraphQL is activated
2. Check JWT Authentication plugin is configured
3. Verify `GRAPHQL_JWT_AUTH_SECRET_KEY` in wp-config.php

### Images Not Loading
1. WordPress media URLs may still point to old domain
2. Run URL replacement queries (Step 5 in Part 1)
3. Or configure Next.js image domains in `next.config.js`:
```js
// next.config.js
module.exports = {
  images: {
    domains: ['api.naturallyfit.ca', 'naturallyfit.ca'],
  },
}
```

### Database Import Timeout
For large databases on shared hosting:
1. Split the SQL file into smaller chunks
2. Import via SSH instead of phpMyAdmin
3. Contact DreamHost support to increase import limits

---

## Support Contacts

- **DreamHost Support:** https://help.dreamhost.com
- **Vercel Support:** https://vercel.com/support
- **WPGraphQL Discord:** https://discord.gg/AGVBqqyaUY

---

*Last Updated: January 31, 2026*
