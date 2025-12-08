/**
 * Add more test data to demonstrate pagination
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMoreTestData() {
  console.log('Adding more test trading calls for pagination demo...\n')

  const additionalCalls = [
    {
      scriptName: 'BAJFINANCE',
      ltp: 6800.00,
      currentPrice: 6920.00,
      target1: 7000.00,
      target2: 7200.00,
      target3: 7400.00,
      stopLoss: 6600.00,
      patternType: 'UB',
      longTermOutlook: 'Bullish',
      rank: 8,
      support: 6750.00,
      resistance: 7100.00,
      status: 'TARGET1_HIT',
      target1Hit: true,
      callDate: new Date('2025-11-25T10:00:00Z'),
      hitDate: new Date('2025-11-27T14:00:00Z'),
    },
    {
      scriptName: 'TITAN',
      ltp: 3450.00,
      currentPrice: 3390.00,
      target1: 3550.00,
      target2: 3650.00,
      target3: 3750.00,
      stopLoss: 3300.00,
      patternType: 'TR',
      longTermOutlook: 'Bullish',
      rank: 7,
      status: 'ACTIVE',
      callDate: new Date('2025-11-28T10:00:00Z'),
    },
    {
      scriptName: 'MARUTI',
      ltp: 12500.00,
      currentPrice: 12850.00,
      target1: 12800.00,
      target2: 13100.00,
      target3: 13500.00,
      stopLoss: 12200.00,
      patternType: 'BF',
      longTermOutlook: 'Bullish',
      rank: 9,
      status: 'TARGET2_HIT',
      target1Hit: true,
      target2Hit: true,
      callDate: new Date('2025-11-29T10:00:00Z'),
      hitDate: new Date('2025-12-02T11:00:00Z'),
    },
    {
      scriptName: 'LT',
      ltp: 3650.00,
      currentPrice: 3580.00,
      target1: 3750.00,
      target2: 3850.00,
      target3: 3950.00,
      stopLoss: 3500.00,
      patternType: 'TR',
      longTermOutlook: 'Neutral',
      rank: 6,
      status: 'ACTIVE',
      callDate: new Date('2025-11-30T10:00:00Z'),
    },
    {
      scriptName: 'SUNPHARMA',
      ltp: 1680.00,
      currentPrice: 1720.00,
      target1: 1750.00,
      target2: 1820.00,
      target3: 1900.00,
      stopLoss: 1620.00,
      patternType: 'UB',
      longTermOutlook: 'Bullish',
      rank: 8,
      status: 'TARGET1_HIT',
      target1Hit: true,
      callDate: new Date('2025-12-01T10:00:00Z'),
      hitDate: new Date('2025-12-03T15:00:00Z'),
    },
    {
      scriptName: 'BHARTIARTL',
      ltp: 1580.00,
      currentPrice: 1650.00,
      target1: 1620.00,
      target2: 1680.00,
      target3: 1750.00,
      stopLoss: 1520.00,
      patternType: 'BF',
      longTermOutlook: 'Bullish',
      rank: 7,
      status: 'TARGET2_HIT',
      target1Hit: true,
      target2Hit: true,
      callDate: new Date('2025-12-02T10:00:00Z'),
      hitDate: new Date('2025-12-05T12:00:00Z'),
    },
    {
      scriptName: 'HINDALCO',
      ltp: 645.00,
      currentPrice: 665.00,
      target1: 670.00,
      target2: 690.00,
      target3: 710.00,
      stopLoss: 620.00,
      patternType: 'TR',
      longTermOutlook: 'Bullish',
      rank: 8,
      status: 'ACTIVE',
      callDate: new Date('2025-12-03T10:00:00Z'),
    },
    {
      scriptName: 'ULTRACEMCO',
      ltp: 10500.00,
      currentPrice: 10750.00,
      target1: 10800.00,
      target2: 11100.00,
      target3: 11400.00,
      stopLoss: 10200.00,
      patternType: 'UB',
      longTermOutlook: 'Bullish',
      rank: 9,
      status: 'TARGET1_HIT',
      target1Hit: true,
      callDate: new Date('2025-12-04T10:00:00Z'),
      hitDate: new Date('2025-12-06T10:30:00Z'),
    },
  ]

  for (const call of additionalCalls) {
    await prisma.tradingCall.create({ data: call })
    console.log(`✓ Created call for ${call.scriptName}`)
  }

  console.log(`\n✅ Added ${additionalCalls.length} more calls!`)
  console.log('Total calls in database:', await prisma.tradingCall.count())
}

addMoreTestData()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
