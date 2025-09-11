import type { Metadata } from 'next'
import { ClerkProvider } from "@clerk/nextjs"
import ChatWidget from '@/components/ChatWidget'
import PostSignUpHandler from '@/components/PostSignUpHandler'
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
    <ClerkProvider>
      <html lang="ro">
        <body className="bg-[#0B0B0F] text-white antialiased">
          {children}
          <PostSignUpHandler />
          <ChatWidget />
        </body>
      </html>
    </ClerkProvider>
  )
}