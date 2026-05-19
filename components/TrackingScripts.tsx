"use client";

import Script from "next/script";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

export function TrackingScripts() {
  return (
    <>
      {PIXEL_ID && (
        <>
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init','${PIXEL_ID}');
              fbq('track','PageView');
              fbq('track','ViewContent',{content_name:'Rastreador GPS Nexo Brasil'});
            `}
          </Script>
        </>
      )}
      {GA4_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}');
            `}
          </Script>
        </>
      )}
    </>
  );
}

export function trackCheckoutClick(kit: "1" | "2" | "3") {
  if (typeof window === "undefined") return;
  const eventMap = {
    "1": "SelectKit1",
    "2": "SelectKit2",
    "3": "SelectKit3",
  };
  const event = eventMap[kit];
  if (window.fbq) {
    window.fbq("trackCustom", event);
    window.fbq("track", "InitiateCheckout");
  }
  if (window.gtag) {
    window.gtag("event", "click_checkout", { kit });
  }
}
