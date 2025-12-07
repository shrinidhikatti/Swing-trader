# Swing Trader Sagar - Trading Calls Management System

A comprehensive web application for managing and tracking stock trading calls for the "Swing Trader Sagar" WhatsApp group (1453 members).

## Features

### 1. Trading Call Management
- Create, view, and manage trading calls
- Track all essential details:
  - Script name (stock symbol)
  - LTP (Last Traded Price) - entry price
  - Multiple targets (Target 1, 2, 3)
  - Stop Loss
  - Pattern type (TR, UB, BF, etc.)
  - Long-term outlook
  - Rank (1-10)
  - Support and Resistance levels

### 2. Automated Price Tracking
- Automatic verification of targets and stop loss
- Configurable check intervals (5 hours, 1 day, 2 days, etc.)
- Real-time price updates from Yahoo Finance API
- Visual indicators:
  - ✅ Green checkmark when targets are hit
  - ❌ Red mark when stop loss is hit
  - Status badges showing current state

### 3. Calendar Organization
- Date-wise filtering of trading calls
- View calls for specific dates
- Filter by status (Active, Target Hit, Stop Loss Hit)

### 4. Dashboard & Analytics
- Real-time statistics:
  - Total calls
  - Active calls
  - Targets hit
  - Stop loss hit
- Beautiful, responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 (React)
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Stock API**: Yahoo Finance API
- **Scheduling**: Node-cron / Cron jobs

## Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Swing-trader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Configure environment variables**

   The `.env` file is already created with defaults:
   ```env
   DATABASE_URL="file:./dev.db"
   CHECK_INTERVAL_HOURS=5
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Adding a Trading Call

1. Click the "Add New Trading Call" button
2. Fill in all required fields:
   - Script Name (e.g., RELIANCE, TCS, INFY)
   - Call Date
   - LTP (Entry Price)
   - Pattern Type
   - Target 1, 2, 3
   - Stop Loss
3. Optionally add:
   - Support/Resistance levels
   - Rank (1-10)
   - Long-term outlook
4. Click "Create Call"

### Checking Prices Manually

Click the "Check Prices Now" button in the top control panel to manually trigger a price check for all active calls.

### Filtering Calls

- **By Date**: Select a date from the calendar picker to view calls for that specific date
- **By Status**: Use the status dropdown to filter by:
  - All Status
  - Active
  - Target 1 Hit
  - Target 2 Hit
  - Target 3 Hit
  - Stop Loss Hit

## Automated Price Checking

### Manual Script Execution

Run the price check script manually:

```bash
npx ts-node scripts/check-prices.ts
```

### Setting Up Automated Checks (Cron Job)

#### Option 1: Using the Setup Script

```bash
chmod +x scripts/setup-cron.sh
./scripts/setup-cron.sh
```

Follow the interactive prompts to choose your preferred interval.

#### Option 2: Manual Cron Setup

1. Open crontab:
   ```bash
   crontab -e
   ```

2. Add one of these lines based on your preferred interval:

   ```bash
   # Every 5 hours
   0 */5 * * * cd /path/to/Swing-trader && npx ts-node scripts/check-prices.ts >> logs/price-check.log 2>&1

   # Every 12 hours
   0 */12 * * * cd /path/to/Swing-trader && npx ts-node scripts/check-prices.ts >> logs/price-check.log 2>&1

   # Daily at 9 AM
   0 9 * * * cd /path/to/Swing-trader && npx ts-node scripts/check-prices.ts >> logs/price-check.log 2>&1

   # Twice daily (9 AM and 3 PM IST)
   0 9,15 * * * cd /path/to/Swing-trader && npx ts-node scripts/check-prices.ts >> logs/price-check.log 2>&1
   ```

3. Save and exit

#### Option 3: Using Node-cron (For Production)

The app can also use node-cron for scheduling. This is useful for deployments where cron jobs aren't available.

## API Endpoints

### Trading Calls

- `GET /api/calls` - Fetch all calls (with optional date and status filters)
- `POST /api/calls` - Create a new trading call
- `GET /api/calls/[id]` - Fetch a specific call
- `PUT /api/calls/[id]` - Update a call
- `DELETE /api/calls/[id]` - Delete a call

### Price Checking

- `POST /api/check-prices` - Trigger price check for all active calls
- `GET /api/check-prices` - Get last check timestamp

### Configuration

- `GET /api/config?key=<key>` - Get configuration value
- `POST /api/config` - Update configuration

## Database Schema

### TradingCall Model
- `id`: Unique identifier
- `callDate`: Date of the call
- `scriptName`: Stock symbol/name
- `ltp`: Entry price (Last Traded Price)
- `target1`, `target2`, `target3`: Target prices
- `stopLoss`: Stop loss price
- `patternType`: Chart pattern (TR, UB, BF, etc.)
- `longTermOutlook`: Long-term market outlook
- `rank`: Priority rank (1-10)
- `support`, `resistance`: Key price levels
- `status`: Current status (ACTIVE, TARGET1_HIT, etc.)
- `currentPrice`: Latest fetched price
- `lastChecked`: Last price check timestamp
- `target1Hit`, `target2Hit`, `target3Hit`, `stopLossHit`: Hit status flags
- `hitDate`: Date when target/SL was hit

### AppConfig Model
- `id`: Unique identifier
- `key`: Configuration key
- `value`: Configuration value

## Stock Symbol Format

For Indian stocks, the app automatically appends `.NS` (NSE) to stock symbols. Examples:

- Input: `RELIANCE` → Fetches: `RELIANCE.NS`
- Input: `TCS` → Fetches: `TCS.NS`
- Input: `INFY.BO` → Fetches: `INFY.BO` (BSE, as specified)

## Production Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables
4. Deploy

**Note**: For production, consider upgrading from SQLite to PostgreSQL:
- Update `prisma/schema.prisma` datasource to PostgreSQL
- Set `DATABASE_URL` to your PostgreSQL connection string
- Run `npx prisma db push`

### Alternative Deployments

The app can be deployed to:
- Netlify
- Railway
- Render
- Any Node.js hosting platform

## Troubleshooting

### Price Fetching Issues

If stock prices aren't fetching:
1. Check internet connectivity
2. Verify stock symbol format (should be NSE/BSE symbol)
3. Check Yahoo Finance API availability
4. Look at logs: `tail -f logs/price-check.log`

### Database Issues

Reset the database:
```bash
rm prisma/dev.db
npx prisma db push
```

### Build Errors

Clear Next.js cache:
```bash
rm -rf .next
npm run build
```

## Development

### Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── calls/        # Trading calls endpoints
│   │   ├── check-prices/ # Price checking endpoint
│   │   └── config/       # Configuration endpoint
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── CallCard.tsx      # Trading call display card
│   └── CallEntryForm.tsx # Form to create calls
├── lib/
│   ├── prisma.ts         # Prisma client
│   └── stockApi.ts       # Stock price fetching
├── prisma/
│   └── schema.prisma     # Database schema
├── scripts/
│   ├── check-prices.ts   # Price checking script
│   └── setup-cron.sh     # Cron setup helper
└── public/               # Static assets
```

### Adding New Features

1. Database changes: Update `prisma/schema.prisma` and run `npx prisma db push`
2. API endpoints: Add routes in `app/api/`
3. UI components: Create in `components/`
4. Pages: Add in `app/`

## License

MIT License - feel free to use and modify for your needs.

## Support

For issues or questions:
- Create an issue in the repository
- Contact: Ksheer Sagar (Swing Trader Sagar)

---

**Happy Trading! 📈**
