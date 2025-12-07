/**
 * Automated price checking script
 * This script can be run manually or scheduled as a cron job
 *
 * Usage:
 *   ts-node scripts/check-prices.ts
 *
 * Or set up as a cron job:
 *   0 */5 * * * cd /path/to/project && ts-node scripts/check-prices.ts
 */

import { PrismaClient } from '@prisma/client'
import { fetchStockPrice } from '../lib/stockApi'

const prisma = new PrismaClient()

async function checkPrices() {
  console.log('Starting price check...', new Date().toISOString())

  try {
    // Fetch all active calls
    const activeCalls = await prisma.tradingCall.findMany({
      where: {
        status: 'ACTIVE',
      },
    })

    if (activeCalls.length === 0) {
      console.log('No active calls to check')
      return
    }

    console.log(`Found ${activeCalls.length} active calls`)

    let updatedCount = 0
    const results: any[] = []

    // Check each call
    for (const call of activeCalls) {
      console.log(`Checking ${call.scriptName}...`)

      const priceData = await fetchStockPrice(call.scriptName)

      if (!priceData) {
        console.error(`Failed to fetch price for ${call.scriptName}`)
        results.push({
          scriptName: call.scriptName,
          status: 'ERROR',
          error: 'Failed to fetch price',
        })
        continue
      }

      const currentPrice = priceData.price
      let status = call.status
      let target1Hit = call.target1Hit
      let target2Hit = call.target2Hit
      let target3Hit = call.target3Hit
      let stopLossHit = call.stopLossHit
      let hitDate = call.hitDate

      console.log(`Current price: ₹${currentPrice}`)

      // Check if targets or stop loss hit
      if (currentPrice >= call.target3) {
        status = 'TARGET3_HIT'
        target1Hit = true
        target2Hit = true
        target3Hit = true
        hitDate = hitDate || new Date()
        console.log(`✅ Target 3 hit for ${call.scriptName}!`)
      } else if (currentPrice >= call.target2) {
        status = 'TARGET2_HIT'
        target1Hit = true
        target2Hit = true
        hitDate = hitDate || new Date()
        console.log(`✅ Target 2 hit for ${call.scriptName}!`)
      } else if (currentPrice >= call.target1) {
        status = 'TARGET1_HIT'
        target1Hit = true
        hitDate = hitDate || new Date()
        console.log(`✅ Target 1 hit for ${call.scriptName}!`)
      } else if (currentPrice <= call.stopLoss) {
        status = 'SL_HIT'
        stopLossHit = true
        hitDate = hitDate || new Date()
        console.log(`❌ Stop loss hit for ${call.scriptName}`)
      } else {
        console.log(`Still active - Price: ₹${currentPrice}`)
      }

      // Update the call
      await prisma.tradingCall.update({
        where: { id: call.id },
        data: {
          currentPrice,
          status,
          target1Hit,
          target2Hit,
          target3Hit,
          stopLossHit,
          hitDate,
          lastChecked: new Date(),
        },
      })

      updatedCount++
      results.push({
        scriptName: call.scriptName,
        currentPrice,
        status,
        previousStatus: call.status,
      })

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log(`\nPrice check complete!`)
    console.log(`Checked: ${activeCalls.length} calls`)
    console.log(`Updated: ${updatedCount} calls`)
    console.log(`\nResults:`)
    console.table(results)

  } catch (error) {
    console.error('Error during price check:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
checkPrices()
  .then(() => {
    console.log('\n✅ Price check completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Price check failed:', error)
    process.exit(1)
  })
