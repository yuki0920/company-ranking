import "@/styles/globals.css"
import { Inter } from "next/font/google"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Suspense>
          <GoogleAnalytics />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
