/**
 * Add a test call with staggered target hit times
 * Example: Target 1 hit after 2hr, Target 2 hit after 8hr, Target 3 hit after 1d 5hr
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addStaggeredTestCall() {
  console.log('Adding test call with staggered target hits...\n')

  const callDate = new Date('2025-12-08T09:00:00Z') // 9 AM today

  // Target 1 hit after 2 hours
  const target1HitDate = new Date(callDate.getTime() + (2 * 60 * 60 * 1000))

  // Target 2 hit after 8 hours
  const target2HitDate = new Date(callDate.getTime() + (8 * 60 * 60 * 1000))

  // Target 3 hit after 1 day 5 hours (29 hours)
  const target3HitDate = new Date(callDate.getTime() + (29 * 60 * 60 * 1000))

  const testCall = {
    scriptName: 'DEMO-T3',
    ltp: 1000.00,
    currentPrice: 1250.00,
    target1: 1050.00,
    target2: 1150.00,
    target3: 1250.00,
    stopLoss: 950.00,
    patternType: 'TR',
    longTermOutlook: 'Bullish',
    rank: 9,
    support: 980.00,
    resistance: 1200.00,
    status: 'TARGET3_HIT',
    target1Hit: true,
    target2Hit: true,
    target3Hit: true,
    stopLossHit: false,
    callDate: callDate,
    hitDate: target3HitDate, // Final hit date
    target1HitDate: target1HitDate,
    target2HitDate: target2HitDate,
    target3HitDate: target3HitDate,
  }

  await prisma.tradingCall.create({ data: testCall })
  console.log('✓ Created DEMO-T3 call')
  console.log(`  Call Date: ${callDate.toISOString()}`)
  console.log(`  Target 1 Hit: ${target1HitDate.toISOString()} (after 2 hours)`)
  console.log(`  Target 2 Hit: ${target2HitDate.toISOString()} (after 8 hours)`)
  console.log(`  Target 3 Hit: ${target3HitDate.toISOString()} (after 1d 5h)`)

  // Add another example with Target 2 only
  const callDate2 = new Date('2025-12-07T10:00:00Z')
  const target1HitDate2 = new Date(callDate2.getTime() + (5 * 60 * 60 * 1000)) // 5 hours
  const target2HitDate2 = new Date(callDate2.getTime() + (14 * 60 * 60 * 1000)) // 14 hours

  const testCall2 = {
    scriptName: 'DEMO-T2',
    ltp: 500.00,
    currentPrice: 550.00,
    target1: 525.00,
    target2: 550.00,
    target3: 575.00,
    stopLoss: 475.00,
    patternType: 'UB',
    longTermOutlook: 'Bullish',
    rank: 8,
    status: 'TARGET2_HIT',
    target1Hit: true,
    target2Hit: true,
    target3Hit: false,
    stopLossHit: false,
    callDate: callDate2,
    hitDate: target2HitDate2,
    target1HitDate: target1HitDate2,
    target2HitDate: target2HitDate2,
  }

  await prisma.tradingCall.create({ data: testCall2 })
  console.log('\n✓ Created DEMO-T2 call')
  console.log(`  Call Date: ${callDate2.toISOString()}`)
  console.log(`  Target 1 Hit: ${target1HitDate2.toISOString()} (after 5 hours)`)
  console.log(`  Target 2 Hit: ${target2HitDate2.toISOString()} (after 14 hours)`)

  console.log('\n✅ Demo calls added! Refresh your browser to see the staggered timings.')
}

addStaggeredTestCall()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
