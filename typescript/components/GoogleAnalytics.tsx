"use client";

import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script";
import { useEffect } from "react";
import { existsGaId, GA_MEASUREMENT_ID, pageview } from "@/lib/gtag"

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!existsGaId) {
      return
    }
    const url = pathname + searchParams.toString()
    pageview(url)
  }, [pathname, searchParams])

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
