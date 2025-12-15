import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Sample successful trading calls
  const sampleCalls = [
    {
      scriptName: 'RELIANCE',
      ltp: 2450.00,
      currentPrice: 2680.00,
      target1: 2550.00,
      target2: 2650.00,
      target3: 2750.00,
      stopLoss: 2380.00,
      patternType: 'BO',
      status: 'TARGET2_HIT',
      target1Hit: true,
      target2Hit: true,
      target3Hit: false,
      stopLossHit: false,
      callDate: new Date('2024-12-10'),
      hitDate: new Date('2024-12-14'),
      target1HitDate: new Date('2024-12-12'),
      target2HitDate: new Date('2024-12-14'),
      tradeType: 'SWING',
      isFlashCard: false,
      longTermOutlook: 'Bullish',
      rank: 9,
    },
    {
      scriptName: 'TCS',
      ltp: 3800.00,
      currentPrice: 4100.00,
      target1: 3920.00,
      target2: 4050.00,
      target3: 4200.00,
      stopLoss: 3720.00,
      patternType: 'TR',
      status: 'TARGET2_HIT',
      target1Hit: true,
      target2Hit: true,
      target3Hit: false,
      stopLossHit: false,
      callDate: new Date('2024-12-08'),
      hitDate: new Date('2024-12-13'),
      target1HitDate: new Date('2024-12-11'),
      target2HitDate: new Date('2024-12-13'),
      tradeType: 'SWING',
      isFlashCard: false,
      longTermOutlook: 'Bullish',
      rank: 8,
    },
    {
      scriptName: 'INFY',
      ltp: 1520.00,
      currentPrice: 1680.00,
      target1: 1590.00,
      target2: 1650.00,
      target3: 1720.00,
      stopLoss: 1470.00,
      patternType: 'UB',
      status: 'TARGET3_HIT',
      target1Hit: true,
      target2Hit: true,
      target3Hit: true,
      stopLossHit: false,
      callDate: new Date('2024-12-05'),
      hitDate: new Date('2024-12-12'),
      target1HitDate: new Date('2024-12-08'),
      target2HitDate: new Date('2024-12-10'),
      target3HitDate: new Date('2024-12-12'),
      tradeType: 'SWING',
      isFlashCard: true,
      longTermOutlook: 'Bullish',
      rank: 10,
      eventMarker: 'Earnings',
    },
    {
      scriptName: 'HDFCBANK',
      ltp: 1650.00,
      currentPrice: 1760.00,
      target1: 1710.00,
      target2: 1760.00,
      target3: 1820.00,
      stopLoss: 1600.00,
      patternType: 'BF',
      status: 'TARGET2_HIT',
      target1Hit: true,
      target2Hit: true,
      target3Hit: false,
      stopLossHit: false,
      callDate: new Date('2024-12-09'),
      hitDate: new Date('2024-12-14'),
      target1HitDate: new Date('2024-12-12'),
      target2HitDate: new Date('2024-12-14'),
      tradeType: 'SWING',
      isFlashCard: false,
      longTermOutlook: 'Bullish',
      rank: 9,
    },
    {
      scriptName: 'ITC',
      ltp: 420.00,
      currentPrice: 455.00,
      target1: 435.00,
      target2: 450.00,
      target3: 468.00,
      stopLoss: 408.00,
      patternType: 'TR',
      status: 'TARGET2_HIT',
      target1Hit: true,
      target2Hit: true,
      target3Hit: false,
      stopLossHit: false,
      callDate: new Date('2024-12-07'),
      hitDate: new Date('2024-12-13'),
      target1HitDate: new Date('2024-12-10'),
      target2HitDate: new Date('2024-12-13'),
      tradeType: 'SWING',
      isFlashCard: false,
      longTermOutlook: 'Bullish',
      rank: 8,
      eventMarker: 'Dividend',
    },
  ]

  console.log('Adding sample successful trading calls...')

  for (const call of sampleCalls) {
    const created = await prisma.tradingCall.create({
      data: call,
    })
    console.log(`✓ Created call for ${created.scriptName}`)
  }

  console.log('\n✓ Successfully added all sample calls!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
