import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

// metadata
const defaultTitle = "上場企業ランキング"
const defaultDescription = "上場企業の業績、売上、利益、年収をランキング形式で掲載しています。"
const defaultURL = new URL("https://www.company-ranking.net/")

export const metadata: Metadata = {
  metadataBase: defaultURL,
  title: {
    default: defaultTitle,
    template: `%s  ${defaultTitle}`,
  },
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: defaultURL,
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    creator: '@_yuki0920_',
  },
  verification: {
    // google: 'search console verification code',
  },
  alternates: {
    canonical: defaultURL,
  },
}
// metadata

const inter = Inter({ subsets: ['latin'] })
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header>
          <div className="flex justify-center">
            <div className="container">
              {children}
            </div>
          </div>
        </Header>
        <Footer />
      </body>
    </html>
  )
}
