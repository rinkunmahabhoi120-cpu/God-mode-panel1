import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GOD MODE v5',
  description: 'Automation control panel',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#f4f4f5', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
