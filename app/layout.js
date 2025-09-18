import './globals.css'
import ClientLayout from './client-layout'

export const metadata = {
  title: 'Grain Size Mapping Dashboard',
  description: 'Monitor and analyze coastal sediment data across Indian beaches',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}