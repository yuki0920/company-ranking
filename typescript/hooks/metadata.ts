import { Metadata } from 'next'

const defaultTitle = "上場企業ランキング"
const defaultDescription = "上場企業の業績、売上、利益、年収をランキング形式で掲載しています。"

export const metadata: Metadata = {
  title: defaultTitle,
  description: defaultDescription
}

// export const useMetadata = (
//   { pageTitle, pageDescription }:
//   { pageTitle: string, pageDescription: string }
// ): Metadata => {
//   const title = pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle
//   const description = pageDescription ? pageDescription : defaultDescription

//   return {
//     metadataBase: new URL("https://www.company-ranking.net/"),
//     title: title,
//     description: "",
//     keywords: "",
//     themeColor: "",
//     publisher: "",
//     icons: "",
//     // openGraph: "",
//     // twitter: "",
//   }
// }
