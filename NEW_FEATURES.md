# New Features - January 2025

## 1. 🎯 Auto-Announcements for Target/SL Hits

**Location:** `/app/api/check-prices/route.ts`

### What it does:
Automatically creates announcements in the UPDATES ticker when any active trading call hits target or stop loss.

### Features:
- ✅ **Target Hit**: Creates congratulatory message when target is hit
- ✅ **Stop Loss Hit**: Creates notification when SL is hit
- ✅ **Automatic**: Runs during price checks, no manual action needed
- ✅ **Admin Control**: Admins can edit/delete/toggle announcements

### Messages:
- **Target**: `🎯 RELIANCE has hit Target 2! Congratulations to everyone who took the call!`
- **Stop Loss**: `⚠️ RELIANCE has hit Stop Loss.`

### How to manage:
- Go to Admin Dashboard → "Manage Announcements"
- View all auto-generated announcements
- Edit, delete, or deactivate any announcement

---

## 2. 📧 Automatic Subscription Renewal Reminders

**Location:** `/app/api/send-renewal-reminders/route.ts`

### What it does:
Automatically sends email reminders to users **one day before** their subscription expires.

### Features:
- ✅ **Zero Configuration**: Works automatically on free hosting (no cron needed!)
- ✅ **Smart Throttling**: Sends emails only once per day
- ✅ **Passive Trigger**: Runs when anyone visits the site
- ✅ **Beautiful Emails**: Professional HTML template with your branding
- ✅ **Targeted**: Only sends to ACTIVE users with APPROVED status

### Setup Required:
1. Add `RESEND_API_KEY` to `.env` file
2. Verify your domain at [resend.com](https://resend.com)
3. Deploy - that's it!

### How it works:
1. Anyone visits your website
2. System checks if reminders need to be sent today
3. If not already sent today, finds users expiring tomorrow
4. Sends beautiful reminder email to each user
5. Creates hidden marker to prevent duplicate sends
6. All happens silently in the background

### Email Content:
- User's name and expiry date
- Call-to-action button to renew
- Benefits reminder
- Professional branding

### Testing:
```bash
# Preview users expiring tomorrow
curl http://localhost:3000/api/send-renewal-reminders

# Send manually
npm run send-renewal-reminders
```

### Full Documentation:
See `/scripts/RENEWAL_REMINDERS_SETUP.md` for detailed setup and troubleshooting.

---

## Environment Variables Needed

Add these to your `.env` file:

```bash
# For email functionality (both features)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_BASE_URL="https://tradewithsagar.com"
```

## Benefits

### For Users:
- ✅ Never miss important target/SL updates
- ✅ Get reminded to renew before subscription expires
- ✅ Stay engaged with real-time announcements

### For Admin:
- ✅ Less manual work announcing hits
- ✅ Reduced support requests about expiring subscriptions
- ✅ Better user retention through timely reminders
- ✅ Full control over all auto-generated content

### For Hosting:
- ✅ Works perfectly on free tier hosting
- ✅ No external cron services needed
- ✅ No complex setup or configuration
- ✅ Efficient and cost-effective

---

**Last Updated:** January 19, 2025
