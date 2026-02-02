import './globals.css'
import type { Metadata } from 'next'
import { Playfair_Display, Source_Sans_3 } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Swing Trader Sagar - Trading Calls Management',
  description: 'Manage and track trading calls for Swing Trader Sagar WhatsApp group',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <body className={sourceSans.className}>{children}</body>
    </html>
  )
}
