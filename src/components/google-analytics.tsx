"use client";

import Script from "next/script";

const GTAG_ID = "G-49H8YKV7QV";
export function GoogleAnalytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`} />

      <Script
        id="ga"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GTAG_ID}');
        `,
        }}
      />
    </>
  );
}
