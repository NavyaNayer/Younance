import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { SidebarLayout } from '@/components/sidebar'
import './globals.css'

export const metadata: Metadata = {
  title: 'YouNance - AI-Powered Financial Planning',
  description: 'Transform your financial future with AI conversations. Chat with your future self and visualize the impact of today\'s financial decisions.',
  keywords: 'financial planning, AI chat, investment calculator, personal finance, savings goals',
  authors: [{ name: 'YouNance Team' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'YouNance - Meet Your Future Financial Self',
    description: 'AI-powered financial planning that makes smart money decisions engaging and visual.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily}, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
  font-feature-settings: 'rlig' 1, 'calt' 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
        `}</style>
      </head>
      <body className="font-sans antialiased bg-white text-gray-900 leading-relaxed">
        <SidebarLayout>
          {children}
        </SidebarLayout>
      </body>
    </html>
  )
}
