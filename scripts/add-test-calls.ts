/**
 * Add test calls with various scenarios for testing
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addTestCalls() {
  console.log('Adding test calls...\n')

  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const fiveDaysAgo = new Date(today)
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)

  const tenDaysAgo = new Date(today)
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)

  const twentyDaysAgo = new Date(today)
  twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20)

  const fortyDaysAgo = new Date(today)
  fortyDaysAgo.setDate(fortyDaysAgo.getDate() - 40)

  const testCalls = [
    // 1. Fresh active call (today)
    {
      scriptName: 'RELIANCE',
      ltp: 2500.00,
      currentPrice: 2520.00,
      target1: 2550.00,
      target2: 2600.00,
      target3: 2650.00,
      stopLoss: 2450.00,
      patternType: 'TR',
      longTermOutlook: 'Bullish',
      rank: 9,
      support: 2480.00,
      resistance: 2620.00,
      status: 'ACTIVE',
      callDate: today,
      tradeType: 'SWING',
      isFlashCard: false,
    },

    // 2. Flash card - golden priority (yesterday)
    {
      scriptName: 'INFY',
      ltp: 1450.00,
      currentPrice: 1480.00,
      target1: 1500.00,
      target2: 1550.00,
      target3: 1600.00,
      stopLoss: 1400.00,
      patternType: 'UB',
      longTermOutlook: 'Bullish',
      rank: 10,
      status: 'ACTIVE',
      callDate: yesterday,
      tradeType: 'SWING',
      isFlashCard: true, // Golden card!
      eventMarker: 'Bonus',
    },

    // 3. Target 1 hit (5 days ago)
    {
      scriptName: 'HDFCBANK',
      ltp: 1600.00,
      currentPrice: 1650.00,
      target1: 1650.00,
      target2: 1700.00,
      target3: 1750.00,
      stopLoss: 1550.00,
      patternType: 'BF',
      rank: 8,
      status: 'TARGET1_HIT',
      target1Hit: true,
      callDate: fiveDaysAgo,
      target1HitDate: new Date(fiveDaysAgo.getTime() + 3 * 60 * 60 * 1000), // 3 hours later
      tradeType: 'SWING',
      isFlashCard: false,
    },

    // 4. Target 2 hit (10 days ago)
    {
      scriptName: 'ICICIBANK',
      ltp: 950.00,
      currentPrice: 1020.00,
      target1: 980.00,
      target2: 1020.00,
      target3: 1050.00,
      stopLoss: 920.00,
      patternType: 'TR',
      longTermOutlook: 'Bullish',
      rank: 7,
      status: 'TARGET2_HIT',
      target1Hit: true,
      target2Hit: true,
      callDate: tenDaysAgo,
      target1HitDate: new Date(tenDaysAgo.getTime() + 5 * 60 * 60 * 1000), // 5 hours
      target2HitDate: new Date(tenDaysAgo.getTime() + 12 * 60 * 60 * 1000), // 12 hours
      tradeType: 'SWING',
      isFlashCard: false,
    },

    // 5. Target 3 hit - All targets (20 days ago)
    {
      scriptName: 'TCS',
      ltp: 3200.00,
      currentPrice: 3450.00,
      target1: 3300.00,
      target2: 3400.00,
      target3: 3450.00,
      stopLoss: 3100.00,
      patternType: 'UB',
      longTermOutlook: 'Bullish',
      rank: 9,
      status: 'TARGET3_HIT',
      target1Hit: true,
      target2Hit: true,
      target3Hit: true,
      callDate: twentyDaysAgo,
      target1HitDate: new Date(twentyDaysAgo.getTime() + 2 * 60 * 60 * 1000), // 2 hours
      target2HitDate: new Date(twentyDaysAgo.getTime() + 8 * 60 * 60 * 1000), // 8 hours
      target3HitDate: new Date(twentyDaysAgo.getTime() + 24 * 60 * 60 * 1000), // 1 day
      tradeType: 'SWING',
      isFlashCard: false,
      eventMarker: 'Dividend',
    },

    // 6. Stop loss hit (10 days ago)
    {
      scriptName: 'BAJFINANCE',
      ltp: 6500.00,
      currentPrice: 6200.00,
      target1: 6700.00,
      target2: 6900.00,
      target3: 7100.00,
      stopLoss: 6300.00,
      patternType: 'TR',
      rank: 6,
      status: 'SL_HIT',
      stopLossHit: true,
      callDate: tenDaysAgo,
      stopLossHitDate: new Date(tenDaysAgo.getTime() + 6 * 60 * 60 * 1000), // 6 hours
      tradeType: 'SWING',
      isFlashCard: false,
    },

    // 7. Old active call (40 days ago) - ONLY ADMIN SHOULD SEE
    {
      scriptName: 'MARUTI',
      ltp: 9500.00,
      currentPrice: 9520.00,
      target1: 9700.00,
      target2: 9900.00,
      target3: 10100.00,
      stopLoss: 9300.00,
      patternType: 'BF',
      rank: 5,
      status: 'ACTIVE',
      callDate: fortyDaysAgo,
      tradeType: 'SWING',
      isFlashCard: false,
    },

    // 8. Long term trade (30 days ago) - should show for everyone
    {
      scriptName: 'ASIANPAINT',
      ltp: 2900.00,
      currentPrice: 2920.00,
      target1: 3000.00,
      target2: 3100.00,
      target3: 3200.00,
      stopLoss: 2800.00,
      patternType: 'TR',
      longTermOutlook: 'Bullish',
      rank: 7,
      status: 'ACTIVE',
      callDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
      tradeType: 'LONG_TERM', // Long term trade
      isFlashCard: false,
    },

    // 9. Another flash card with event (today)
    {
      scriptName: 'TATAMOTORS',
      ltp: 750.00,
      currentPrice: 770.00,
      target1: 800.00,
      target2: 850.00,
      target3: 900.00,
      stopLoss: 720.00,
      patternType: 'UB',
      rank: 9,
      status: 'ACTIVE',
      callDate: today,
      tradeType: 'SWING',
      isFlashCard: true, // Golden!
      eventMarker: 'Split',
    },
  ]

  for (const call of testCalls) {
    await prisma.tradingCall.create({ data: call as any })
    console.log(`✓ Created ${call.scriptName} - ${call.status}`)
  }

  console.log('\n' + '='.repeat(60))
  console.log(`✅ Added ${testCalls.length} test calls`)
  console.log('='.repeat(60))
  console.log('\nTest scenarios:')
  console.log('- 2 Flash cards (golden) - RELIANCE & TATAMOTORS')
  console.log('- Active calls (recent): RELIANCE, INFY')
  console.log('- Target hits: HDFCBANK (T1), ICICIBANK (T2), TCS (T3)')
  console.log('- Stop loss hit: BAJFINANCE')
  console.log('- Old active (40 days, admin only): MARUTI')
  console.log('- Long term trade: ASIANPAINT')
  console.log('- Event markers: INFY (Bonus), TCS (Dividend), TATAMOTORS (Split)')
}

addTestCalls()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
