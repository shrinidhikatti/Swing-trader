/**
 * Fix calls that have both targets and stop loss hit (impossible situation)
 * Rule: If stop loss hit, remove all target hits
 *       If any target hit, remove stop loss hit
 * Priority: Keep whichever happened first based on hit dates
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixInconsistentData() {
  console.log('Finding calls with both targets and stop loss hit...\n')

  try {
    // Find calls where both targets and stop loss are marked as hit
    const inconsistentCalls = await prisma.tradingCall.findMany({
      where: {
        AND: [
          {
            OR: [
              { target1Hit: true },
              { target2Hit: true },
              { target3Hit: true },
            ],
          },
          { stopLossHit: true },
        ],
      },
    })

    console.log(`Found ${inconsistentCalls.length} inconsistent calls\n`)

    if (inconsistentCalls.length === 0) {
      console.log('✅ No inconsistent data found!')
      return
    }

    for (const call of inconsistentCalls) {
      console.log(`Processing ${call.scriptName}...`)
      console.log(`  Current: Target1=${call.target1Hit}, Target2=${call.target2Hit}, Target3=${call.target3Hit}, SL=${call.stopLossHit}`)

      // Determine which happened first based on dates
      const dates = []
      if (call.target1HitDate) dates.push({ type: 'target', date: call.target1HitDate })
      if (call.target2HitDate) dates.push({ type: 'target', date: call.target2HitDate })
      if (call.target3HitDate) dates.push({ type: 'target', date: call.target3HitDate })
      if (call.stopLossHitDate) dates.push({ type: 'stopLoss', date: call.stopLossHitDate })

      // Sort by date to find what happened first
      dates.sort((a, b) => a.date.getTime() - b.date.getTime())

      let updateData: any = {}

      if (dates.length > 0 && dates[0].type === 'stopLoss') {
        // Stop loss hit first - remove all target hits
        console.log(`  → Stop loss hit first (${call.stopLossHitDate?.toISOString()})`)
        console.log(`  → Removing target hits`)
        updateData = {
          status: 'SL_HIT',
          target1Hit: false,
          target2Hit: false,
          target3Hit: false,
          target1HitDate: null,
          target2HitDate: null,
          target3HitDate: null,
          hitDate: call.stopLossHitDate,
        }
      } else {
        // Target hit first - remove stop loss hit
        let highestTarget = 'TARGET1_HIT'
        if (call.target3Hit) highestTarget = 'TARGET3_HIT'
        else if (call.target2Hit) highestTarget = 'TARGET2_HIT'

        console.log(`  → Target hit first`)
        console.log(`  → Removing stop loss hit`)
        updateData = {
          status: highestTarget,
          stopLossHit: false,
          stopLossHitDate: null,
          hitDate: call.target3HitDate || call.target2HitDate || call.target1HitDate,
        }
      }

      // Update the call
      await prisma.tradingCall.update({
        where: { id: call.id },
        data: updateData,
      })

      console.log(`  ✓ Fixed ${call.scriptName} - Status: ${updateData.status}\n`)
    }

    console.log('='.repeat(60))
    console.log(`✅ Fixed ${inconsistentCalls.length} inconsistent calls`)
    console.log('='.repeat(60))
  } catch (error) {
    console.error('Error fixing data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

fixInconsistentData()
  .then(() => {
    console.log('\n✅ Data cleanup complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Cleanup failed:', error)
    process.exit(1)
  })
