import Head from 'next/head'

const defaultTitle = "上場企業ランキング"
const defaultDescription = "上場企業の業績、売上、利益、年収をランキング形式で掲載しています。"
const defaultSiteURL = "https://www.company-ranking.net/"
const defaultImageWidth = 1280
const defaultImageHeight = 640

interface MetaData {
  pageTitle?: string
  pageDescription?: string
  pagePath?: string
  pageImage?: string
  pageImageWidth?: number
  pageImageHeight?: number
}

export default function SeoHead({
  pageTitle,
  pageDescription,
  pagePath,
  pageImage,
  pageImageWidth,
  pageImageHeight
}: MetaData) {
  const title = pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle
  const description = pageDescription ? pageDescription : defaultDescription
  const url = pagePath ? pagePath : defaultSiteURL
  const imageUrl = pageImage
  const imageWidth = pageImageWidth ? pageImageWidth : defaultImageWidth
  const imageHeight = pageImageHeight ? pageImageHeight : defaultImageHeight

  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link rel="canonical" href={url} />
    </Head>
  )
}
