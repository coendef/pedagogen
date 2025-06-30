import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pedagogen Platform - Spreek met Grote Denkers',
  description: 'Stel vragen aan de grootste pedagogische denkers uit de geschiedenis. Van Rudolf Steiner tot Paulo Freire - ontdek hun unieke visies op onderwijs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}