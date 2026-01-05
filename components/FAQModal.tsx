'use client'

import React from 'react'
import { X } from 'lucide-react'

interface FAQModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FAQModal({ isOpen, onClose }: FAQModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">FAQ on Swing Trading-Investing-BTST</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* FAQ Item 1 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What is swing trading?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Swing trading is a style of trading that attempts to capture short- to medium-term gains in a stock (or any financial instrument) over a period of a few days to several weeks. Swing traders primarily use technical analysis to look for trading opportunities. These traders may utilize fundamental analysis in addition to analyzing price trends and patterns.
            </p>
            <div className="mt-3 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-3">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">KEY TAKEAWAYS</h4>
              <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>Swing trading involves taking trades that last a couple of days up to several months in order to profit from an anticipated price move.</li>
                <li>Swing trading exposes a trader to overnight and weekend risk, where the price could gap and open the following session at a substantially different price.</li>
                <li>Swing traders can take profits utilizing an established risk/reward ratio based on a stop loss and profit target, or they can take profits or losses based on a technical indicator or price action movements.</li>
              </ul>
            </div>
          </div>

          {/* FAQ Item 2 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              When should I buy a stock given in the day's list?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              I usually pick stocks which have given a breakout in terms of price and volume. The buyers know that lot of others will also start buying the stock. Usually the stock will go down a bit and slowly start moving up. Ideal time would be after 30 minutes of market opening. The price would settle down and it can be purchased. Usually we should buy at a lower price compared to previous day's closing.
            </p>
          </div>

          {/* FAQ Item 3 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              How do I decide on the Stop loss levels based on the call given?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              If there is a call on say Zomato and the closing price was 300Rs and the stop loss given in the call is 270 Rs. Once the market opens probably the stock would open lower. You buy the stock around 285. Now the stop loss for this stock Zomato would be 285-30 i.e 255 (285-30). You should apply this new SL to your trade.
            </p>
          </div>

          {/* FAQ Item 4 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What is the strategy for exiting at Stop loss or Target?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Usually in a matter of few days or a months time the target will be achieved in swing trades. Best way to trade is after buying a stock use the Good Till Traded (GTT) orders. In GTT order you will give a SL and also a target. Usually in GTT one order cancels the other order. If SL is hit Target order is cancelled and vice versa. The advantage of GTT is that once the orders are placed till they get executed your trading system will automatically place the order on the exchange automatically. So you need not worry about placing the orders everyday.
            </p>
          </div>

          {/* FAQ Item 4 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              When to exit a stock on nearing SL or Target?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Since our calls are not for intraday, there will be slight ups and downs in the market. The best way is your SL should be less than 1 or 2 rupees below the SL given in the call and your target should be minus 1 or 2 rs below the target.
            </p>
          </div>

          {/* FAQ Item 5 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What strategy to be used for Target1 and Target2 given in the calls?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Usually based on the charts there are two levels which the stock would test as it moves up. On the first target lot of selling will come as earlier many buyers were trapped and are holding the stock and want to exit cost to cost. So usually resistance comes on first target and the stock comes down. If the news is good it will cross that resistance and move to the next resistance. It may pause for some time after testing the first resistance or target1. If you are a quick trader, you can exit at Target1 wait for some time and as it comes down, buy it again for the second target. Once the target1 is hit book 50% profit and for the remaining quantity move the SL to cost or cost+2 rs to cover your brokerage cost.
            </p>
          </div>

          {/* FAQ Item 6 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What to do when the stock has moved up but not hit the first target yet?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Usually swing trades are based on some insider news or operator game. Sometimes the stock moves up and suddenly comes down and goes below our SL. It may or may not recover at all. We should protect our investment in such cases. Suppose we buy X stock at 100 and SL is 94. The targets are 115 and 125. The stock moves to 108 and stays there. We should move our SL to 102 maintaining a difference of 6. This way we can protect our losses. This is for safe players. Those who can take risk can keep the SL intact at 94 and wait patiently.
            </p>
          </div>

          {/* FAQ Item 7 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              How do I manage my finances with swing trades as many calls will be there?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Since in swing trade it takes anywhere between 1 day to 1 month, you need to manage your finances properly and invest in maximum calls. Best strategy is use Maximum of 10% of your capital on one call. This will help you in investing in other calls also. Exit the calls as per your risk appetite and move on to the next trade.
            </p>
          </div>

          {/* FAQ Item 8 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Do you provide any updates during market hours?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Normally no, as the SL and targets are clearly defined. If there is any specific event or variation in the target/SL, I will update the same here.
            </p>
          </div>

          {/* FAQ Item 9 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What is the performance of you in trading. Can we see the details of earlier calls?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              <a
                href="https://docs.google.com/spreadsheets/d/1cPuLkqo7pVpjqrzg26kbhYJJ2EbuMexfkbghSwnsRwI/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Performance Sheet →
              </a>
            </p>
          </div>

          {/* FAQ Item 10 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What is Ranking in the calls you provide and how to use that information?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              I give Ranking in the range 1 to 3. <strong>Rank 1</strong> indicates that apart from the breakout the parameters like MACD, RSI, Moving average etc are positive and there is a likelihood that it will try to move up as early as possible. <strong>Rank 2</strong> means though it has given a breakout but the parameters are not positive (either negative divergence in RSI or overbought or negative convergence in moving averages. In such cases one can wait for it to settle down before buying. <strong>Rank 3</strong> means the stock needs to be kept under observation and can be bought at lower levels.
            </p>
          </div>

          {/* FAQ Item 11 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What is Target3?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Usually in swing trades after hitting first two targets the stock either goes into consolidation mode or corrects a bit before moving up again. When the stock is fundamentally and technically good it can go up further in the medium term. This target may be achieved in 3 to 6 months time. If you have enough cash with you, you can hold it for the third target also.
            </p>
          </div>

          {/* FAQ Item 12 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What are investment calls and how to invest in them?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Investment calls are mentioned in my list with a column long term as yes. Apart from this I also provide some investment calls based on fundamental analysis and calls received from my broker friends and Operators. These calls do not have stop loss. You need to hold them for a longer time say 6 months to 1 year. Usually they become multi baggers. They can give 2X, 3X returns in a short time. I usually update on when to exit them. You can also exit at your comfort level and happiness about the profits.
            </p>
          </div>

          {/* FAQ Item 13 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              How to play with BTST calls?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              I check all the breakout stocks previous day before closing and check the chart patterns and the parameters. They suggest us whether there is going to be a fast movement or consolidation happens. Usually BTST calls open higher and then correct a bit consolidate and move up in the coming days. If you are playing BTST on the stocks, make sure that you sell them once they open higher and book profits. You can also do swing trades in them later. Usually BTST calls appear in call list next day.
            </p>
          </div>

          {/* FAQ Item 14 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              How to do intraday trades on my calls?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Normally when Rank column and top pick columns are 1, they are the candidates for intraday trading. If it is a trend reversal and the stock has opened negative then keep buying in small tranches, usually it will move up in few minutes. You need to be fast in buying. Once bought keep a strict SL and book when you are happy with the profits or keep trailing the SL.
            </p>
          </div>

          {/* Closing Message */}
          <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-center">
            <p className="text-lg font-bold text-green-800 dark:text-green-200">
              HAPPY Swing Trading, Happy investing. Let us grow our money consistently
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
          >
            Close FAQ
          </button>
        </div>
      </div>
    </div>
  )
}
