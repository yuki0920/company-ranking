import '@/styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Metadata } from 'next'
import { NEXT_PUBLIC_TWITTER_ID } from '@/constant'
import { getDictionary } from '@/hooks/GetDictionary'

export async function generateMetadata(
  { params: { lang } }:
  { params: { lang: string } }
): Promise<Metadata> {
  const dict = await getDictionary(lang)

  const title = dict.metadata.title
  const description = dict.metadata.description
  const url = new URL(dict.metadata.url)

  return {
    metadataBase: url,
    title: {
      default: title,
      template: `%s  ${title}`,
    },
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: url,
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      creator: `@${NEXT_PUBLIC_TWITTER_ID}`,
    },
    verification: {
      // google: 'search console verification code',
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const dictionary = await getDictionary(lang)

  return (
    <>
      <Header lang={lang} dict={dictionary.components.Header}>
        <div className="flex justify-center">
          <div className="container">
            {children}
          </div>
        </div>
      </Header>
      <Footer lang={lang} dict={dictionary.components.Footer}/>
    </>
  )
}
