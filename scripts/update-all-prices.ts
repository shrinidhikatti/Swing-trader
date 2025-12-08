/**
 * Script to update all trading calls with current live prices
 * This will fetch real prices from Yahoo Finance and update the database
 */

import { PrismaClient } from '@prisma/client'
import { fetchStockPrice } from '../lib/stockApi'

const prisma = new PrismaClient()

async function updateAllPrices() {
  console.log('Starting to update all trading calls with live prices...\n')

  try {
    // Fetch ALL calls (not just active ones)
    const allCalls = await prisma.tradingCall.findMany({
      orderBy: {
        callDate: 'desc',
      },
    })

    if (allCalls.length === 0) {
      console.log('No calls found in database')
      return
    }

    console.log(`Found ${allCalls.length} total calls\n`)

    let successCount = 0
    let errorCount = 0

    // Update each call
    for (const call of allCalls) {
      console.log(`\n[${successCount + errorCount + 1}/${allCalls.length}] Processing ${call.scriptName}...`)

      const priceData = await fetchStockPrice(call.scriptName)

      if (!priceData) {
        console.error(`❌ Failed to fetch price for ${call.scriptName}`)
        errorCount++
        continue
      }

      const currentPrice = priceData.price
      let status = call.status
      let target1Hit = call.target1Hit
      let target2Hit = call.target2Hit
      let target3Hit = call.target3Hit
      let stopLossHit = call.stopLossHit
      let hitDate = call.hitDate

      console.log(`   Current Price: ₹${currentPrice}`)
      console.log(`   Entry Price: ₹${call.ltp}`)
      console.log(`   Targets: ₹${call.target1} / ₹${call.target2} / ₹${call.target3}`)
      console.log(`   Stop Loss: ₹${call.stopLoss}`)

      // Check if targets or stop loss hit
      if (currentPrice >= call.target3) {
        status = 'TARGET3_HIT'
        target1Hit = true
        target2Hit = true
        target3Hit = true
        hitDate = hitDate || new Date()
        console.log(`   ✅✅✅ Target 3 HIT!`)
      } else if (currentPrice >= call.target2) {
        status = 'TARGET2_HIT'
        target1Hit = true
        target2Hit = true
        hitDate = hitDate || new Date()
        console.log(`   ✅✅ Target 2 HIT!`)
      } else if (currentPrice >= call.target1) {
        status = 'TARGET1_HIT'
        target1Hit = true
        hitDate = hitDate || new Date()
        console.log(`   ✅ Target 1 HIT!`)
      } else if (currentPrice <= call.stopLoss) {
        status = 'SL_HIT'
        stopLossHit = true
        hitDate = hitDate || new Date()
        console.log(`   ❌ Stop Loss HIT`)
      } else {
        status = 'ACTIVE'
        console.log(`   📊 Still ACTIVE`)
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

      console.log(`   ✓ Updated successfully`)
      successCount++

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log('\n' + '='.repeat(60))
    console.log('UPDATE COMPLETE!')
    console.log('='.repeat(60))
    console.log(`Total Calls: ${allCalls.length}`)
    console.log(`✅ Successfully Updated: ${successCount}`)
    console.log(`❌ Failed: ${errorCount}`)
    console.log('='.repeat(60) + '\n')

  } catch (error) {
    console.error('Error during price update:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
updateAllPrices()
  .then(() => {
    console.log('✅ All prices updated successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Price update failed:', error)
    process.exit(1)
  })
