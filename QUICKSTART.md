# Quick Start Guide

Get the Swing Trader app running in 5 minutes!

## Step 1: Install Dependencies & Setup Database

```bash
npm run setup
```

This single command will:
- Install all npm packages
- Generate Prisma client
- Create the SQLite database
- Set up all tables

## Step 2: Start the Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

## Step 3: Login as Admin

1. Open http://localhost:3000 in your browser
2. Click "Admin Login" button in the top-right
3. Enter credentials:
   - **Username**: `admin`
   - **Password**: `SwingTrader@2024`
4. You'll be redirected to the main page with admin access

**Note**: Anyone can view calls without logging in, but admin access is required to add/edit/delete calls.

## Step 4: Add Your First Trading Call

1. After logging in, click "Add New Trading Call"
2. Fill in the form:
   - Script Name: `RELIANCE`
   - LTP: `2500`
   - Target 1: `2600`
   - Target 2: `2700`
   - Target 3: `2800`
   - Stop Loss: `2400`
   - Pattern Type: `TR` (or any pattern)
3. Click "Create Call"

## Step 5: Test Price Checking

1. Make sure you're logged in as admin
2. Click the "Check Prices Now" button to fetch current prices and see if targets are hit!

## Optional: Set Up Automated Price Checking

### Quick Cron Setup

```bash
./scripts/setup-cron.sh
```

Follow the prompts to choose your preferred interval (5 hours, daily, etc.)

### Manual Price Check

```bash
npm run check-prices
```

## Admin Access

**Default Credentials:**
- Username: `admin`
- Password: `SwingTrader@2024`

**To change credentials**, edit `.env`:
```env
ADMIN_USERNAME="your-username"
ADMIN_PASSWORD="your-secure-password"
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run check-prices` | Manually check all prices |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:reset` | Reset database (⚠️ deletes all data) |

## Testing with Real Data

Try adding calls for these popular Indian stocks:
- RELIANCE
- TCS
- INFY
- HDFCBANK
- ICICIBANK
- SBIN
- ITC
- HINDUNILVR
- BAJFINANCE
- BHARTIARTL

The app will automatically fetch real-time prices from Yahoo Finance!

## Need Help?

Check the main [README.md](README.md) for:
- Detailed documentation
- API endpoints
- Production deployment
- Troubleshooting

---

**You're all set! Happy Trading! 📈**
