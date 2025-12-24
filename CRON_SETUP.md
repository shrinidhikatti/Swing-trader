# Vercel Cron Setup for Automated Price Updates

This application uses Vercel Cron to automatically update stock prices every 15 minutes.

## How It Works

- **Schedule**: Every 15 minutes (`*/15 * * * *`)
- **Endpoint**: `/api/cron/update-prices`
- **Function**: Fetches latest prices from Yahoo Finance and updates all active trading calls
- **Result**: "Last checked" timestamp is always up-to-date, regardless of user logins

## Setup Instructions

### 1. Add CRON_SECRET to Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `CRON_SECRET`
   - **Value**: A secure random string (e.g., `your-super-secret-cron-key-12345`)
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**

### 2. Generate a Secure CRON_SECRET

You can generate a secure secret using:

```bash
# On Mac/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Deploy to Vercel

After pushing the code to GitHub, Vercel will automatically:
1. Detect the `vercel.json` cron configuration
2. Set up the cron job
3. Start calling `/api/cron/update-prices` every 15 minutes

### 4. Verify Cron Job is Running

1. Go to Vercel Dashboard → Your Project → **Cron**
2. You should see: `/api/cron/update-prices` with schedule `*/15 * * * *`
3. Check the **Logs** tab to see cron execution logs

## Security

The cron endpoint is protected by:
- **Bearer Token Authentication**: Vercel automatically adds `Authorization: Bearer <CRON_SECRET>` header
- **Request validation**: Only requests with valid CRON_SECRET are processed
- **No admin login required**: Runs automatically on the server

## Monitoring

Check Vercel logs for cron execution:
- Look for `[CRON]` prefixed log messages
- Each execution logs: timestamp, calls checked, calls updated

## Troubleshooting

### Cron job not running?
1. Verify `CRON_SECRET` is set in Vercel environment variables
2. Check Vercel Cron tab - the job should be listed
3. Look at Vercel Logs for errors

### Prices not updating?
1. Check that trading calls have `status: 'ACTIVE'`
2. Verify Yahoo Finance API is accessible
3. Check logs for specific stock fetch errors

## Important Notes

- **Cron jobs are available on Vercel Pro plans** (Hobby plan has limitations)
- **Minimum interval**: 1 minute (we use 15 minutes)
- **Execution time limit**: 10 seconds on Hobby, 5 minutes on Pro
- **Timezone**: All cron schedules use UTC time
