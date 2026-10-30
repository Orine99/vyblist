import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vyblist — Event ticketing that matches the vibes',
  description: 'Smart RSVP, QR check-in, and Highlight Hub for Caribbean event promoters.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}