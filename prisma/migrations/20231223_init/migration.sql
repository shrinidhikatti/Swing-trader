-- CreateTable
CREATE TABLE "TradingCall" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "callDate" TIMESTAMP(3) NOT NULL,
    "scriptName" TEXT NOT NULL,
    "ltp" DOUBLE PRECISION NOT NULL,
    "target1" DOUBLE PRECISION NOT NULL,
    "target2" DOUBLE PRECISION NOT NULL,
    "target3" DOUBLE PRECISION NOT NULL,
    "stopLoss" DOUBLE PRECISION NOT NULL,
    "patternType" TEXT NOT NULL,
    "longTermOutlook" TEXT,
    "rank" INTEGER,
    "topPick" INTEGER,
    "support" DOUBLE PRECISION,
    "resistance" DOUBLE PRECISION,
    "tradeType" TEXT NOT NULL DEFAULT 'SWING',
    "isFlashCard" BOOLEAN NOT NULL DEFAULT false,
    "eventMarker" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "currentPrice" DOUBLE PRECISION,
    "lastChecked" TIMESTAMP(3),
    "target1Hit" BOOLEAN NOT NULL DEFAULT false,
    "target2Hit" BOOLEAN NOT NULL DEFAULT false,
    "target3Hit" BOOLEAN NOT NULL DEFAULT false,
    "stopLossHit" BOOLEAN NOT NULL DEFAULT false,
    "hitDate" TIMESTAMP(3),
    "target1HitDate" TIMESTAMP(3),
    "target2HitDate" TIMESTAMP(3),
    "target3HitDate" TIMESTAMP(3),
    "stopLossHitDate" TIMESTAMP(3),

    CONSTRAINT "TradingCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionStart" TIMESTAMP(3),
    "subscriptionEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TradingCall_callDate_idx" ON "TradingCall"("callDate");

-- CreateIndex
CREATE INDEX "TradingCall_status_idx" ON "TradingCall"("status");

-- CreateIndex
CREATE INDEX "TradingCall_tradeType_idx" ON "TradingCall"("tradeType");

-- CreateIndex
CREATE UNIQUE INDEX "AppConfig_key_key" ON "AppConfig"("key");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_subscriptionEnd_idx" ON "User"("subscriptionEnd");
