# Subscription Renewal Reminders Setup

This document explains the automated subscription renewal reminder system.

## Overview

The renewal reminder system automatically sends email notifications to active users **one day before** their subscription expires, prompting them to renew.

**NO CRON JOB NEEDED!** The system runs automatically when anyone visits your website.

## Features

- ✅ **Zero configuration** - works automatically on free hosting
- ✅ Sends emails only to **ACTIVE** users with **APPROVED** status
- ✅ Emails sent **1 day before** subscription expires
- ✅ **Smart throttling** - runs only once per day (no duplicate emails)
- ✅ Triggered by site visits (like scheduled post publishing)
- ✅ Beautiful HTML email template matching your brand
- ✅ Manual testing capability
- ✅ Detailed logging

## Setup Steps

### 1. Environment Variables

Make sure these variables are set in your `.env` file:

```bash
# Resend API Key (for sending emails)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Your website URL (for email links)
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

### 2. Get Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up / Log in
3. Verify your domain (`tradewithsagar.com`)
4. Get your API key from the dashboard
5. Add it to `.env` file

### 3. Deploy and Done! 🎉

That's it! The system is **already integrated** and works automatically:

- When anyone visits your website, the system checks if renewal reminders need to be sent
- Smart throttling ensures emails are sent only **once per day**
- No cron jobs, no external services, no complicated setup
- Works perfectly on **free hosting** (Vercel, Netlify, etc.)

### 4. Test Manually (Optional)

To test before deployment:

```bash
# Preview users expiring tomorrow (doesn't send emails)
curl http://localhost:3000/api/send-renewal-reminders

# Send emails manually
npm run send-renewal-reminders
```

Or visit in browser:
```
http://localhost:3000/api/send-renewal-reminders
```

## How It Works

1. **User Visits Site**: Anyone visits your website (admin, user, or public visitor)
2. **Background Check**: System silently checks if reminders need to be sent today
3. **Smart Throttling**: If already ran today, skip (prevents duplicate emails)
4. **Find Users**: System queries database for:
   - Active users (`isActive: true`)
   - Approved status (`status: APPROVED`)
   - Subscription ending tomorrow
5. **Send Emails**: Sends reminder email to each matching user
6. **Create Marker**: Creates hidden marker to track that it ran today
7. **Log Results**: Logs success/failure for each email

The system is completely passive - it runs automatically in the background whenever someone visits your site, similar to how scheduled calls are auto-published.

## Email Template

The reminder email includes:
- User's name
- Expiry date (tomorrow)
- Call-to-action button to renew
- Benefits of renewal
- Professional branding matching your site

## Testing

### Test with a User

1. Create a test user in admin panel
2. Set their `subscriptionEnd` to tomorrow's date
3. Mark them as `ACTIVE` and `APPROVED`
4. Run the script manually:
   ```bash
   npm run send-renewal-reminders
   ```
5. Check the test user's email

### Check Preview

To see which users will receive emails tomorrow:
```bash
curl http://localhost:3000/api/send-renewal-reminders
```

## Monitoring

### Check Sent Emails

Log into [Resend Dashboard](https://resend.com/emails) to see:
- All sent emails
- Delivery status
- Open rates
- Click rates

### View System Markers

The system creates hidden announcement markers to track when it last ran:
- Open your database (Prisma Studio: `npm run db:studio`)
- Look for announcements starting with `[SYSTEM_RENEWAL_CHECK_`
- These are hidden (`isActive: false`) and track daily runs

## Troubleshooting

### Emails Not Sending

1. **Check Resend API Key**: Make sure it's valid and domain is verified in Resend
2. **Check User Status**: User must be `isActive: true` and `status: APPROVED`
3. **Check Subscription Date**: Must be exactly tomorrow (midnight to midnight)
4. **Check Browser Console**: Look for error messages
5. **Test Manually**: Run `npm run send-renewal-reminders` to see detailed output

### System Not Running

The system runs when someone visits your site. If no one visits:
- First visitor of the day will trigger it
- For critical timing, visit your site once daily yourself
- Or use the manual script: `npm run send-renewal-reminders`

### Already Ran Today

If you see "Renewal check already ran today" but want to test:
- Delete the latest `[SYSTEM_RENEWAL_CHECK_` marker from announcements table
- The system will run again on next site visit

### Wrong Timezone

The system uses IST (Indian Standard Time) by default. To change, adjust the date logic in:
```
app/api/send-renewal-reminders/route.ts
```

## Security Notes

- ✅ Runs silently in background on page load
- ✅ Smart throttling prevents duplicate emails
- ✅ Email addresses are never exposed in responses
- ✅ Failed email sends don't expose user data
- ✅ No external cron services needed (more secure)

## Customization

### Change When Check Happens

The check happens when anyone visits the site. To customize timing:
- Run manual script at specific time: `npm run send-renewal-reminders`
- Or modify `app/page.tsx` to check at different intervals

### Change Email Content

Edit the email template in:
```
app/api/send-renewal-reminders/route.ts
```

Look for the `resend.emails.send()` call and modify the HTML.

### Send 2 Days Before Instead

In `app/api/send-renewal-reminders/route.ts`, change:
```javascript
tomorrow.setDate(tomorrow.getDate() + 1)  // Current: 1 day
// Change to:
tomorrow.setDate(tomorrow.getDate() + 2)  // New: 2 days
```

### Send Multiple Reminders

To send reminders at 3 days, 2 days, and 1 day before expiry:
- Duplicate the logic for different day offsets
- Use different marker names for each reminder type

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Resend dashboard for email delivery status
3. Check server logs for detailed error messages
4. Verify all environment variables are set correctly

---

**Last Updated**: January 2025
