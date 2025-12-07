#!/bin/bash

# Setup script for automated price checking
# This script helps configure the cron job for automatic price checks

echo "======================================"
echo "Swing Trader - Price Check Setup"
echo "======================================"
echo ""

# Get the project directory
PROJECT_DIR=$(pwd)
echo "Project directory: $PROJECT_DIR"
echo ""

# Get the desired interval
echo "How often do you want to check prices?"
echo "1) Every 5 hours"
echo "2) Every 12 hours"
echo "3) Once a day (9 AM)"
echo "4) Twice a day (9 AM and 3 PM)"
echo "5) Custom"
read -p "Enter your choice (1-5): " CHOICE

case $CHOICE in
  1)
    CRON_SCHEDULE="0 */5 * * *"
    DESCRIPTION="every 5 hours"
    ;;
  2)
    CRON_SCHEDULE="0 */12 * * *"
    DESCRIPTION="every 12 hours"
    ;;
  3)
    CRON_SCHEDULE="0 9 * * *"
    DESCRIPTION="daily at 9 AM"
    ;;
  4)
    CRON_SCHEDULE="0 9,15 * * *"
    DESCRIPTION="daily at 9 AM and 3 PM"
    ;;
  5)
    read -p "Enter custom cron schedule (e.g., '0 9 * * *'): " CRON_SCHEDULE
    DESCRIPTION="custom schedule"
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "Cron job will run: $DESCRIPTION"
echo "Schedule: $CRON_SCHEDULE"
echo ""

# Create the cron job command
CRON_COMMAND="cd $PROJECT_DIR && npx ts-node scripts/check-prices.ts >> $PROJECT_DIR/logs/price-check.log 2>&1"

# Create logs directory
mkdir -p "$PROJECT_DIR/logs"

echo "To set up the cron job, run the following command:"
echo ""
echo "  (crontab -l 2>/dev/null; echo \"$CRON_SCHEDULE $CRON_COMMAND\") | crontab -"
echo ""
echo "Or manually add this line to your crontab (crontab -e):"
echo ""
echo "  $CRON_SCHEDULE $CRON_COMMAND"
echo ""

read -p "Do you want to add this cron job now? (y/n): " CONFIRM

if [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ]; then
  (crontab -l 2>/dev/null; echo "$CRON_SCHEDULE $CRON_COMMAND") | crontab -
  echo ""
  echo "✅ Cron job added successfully!"
  echo ""
  echo "To view your cron jobs: crontab -l"
  echo "To remove the cron job: crontab -e (and delete the line)"
  echo "Logs will be saved to: $PROJECT_DIR/logs/price-check.log"
else
  echo ""
  echo "Cron job not added. You can add it manually later."
fi

echo ""
echo "======================================"
echo "Setup complete!"
echo "======================================"
