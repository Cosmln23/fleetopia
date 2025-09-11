import type { Metadata } from 'next'
import ChatWidget from '@/components/ChatWidget'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fletopia — Smart Freight Network',
  description: 'Marketplace AI pentru transport marfă',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <body className="bg-[#0B0B0F] text-white antialiased">
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}