-- AlterTable
ALTER TABLE "TradingCall" ADD COLUMN "scheduledFor" TIMESTAMP(3),
ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT true;
