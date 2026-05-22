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
const GADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : "";
}

async function sendCapi(
  eventName: string,
  customData?: Record<string, unknown>
) {
  try {
    await fetch("/api/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: eventName,
        event_source_url: window.location.href,
        fbc: getCookie("_fbc"),
        fbp: getCookie("_fbp"),
        custom_data: customData,
      }),
    });
  } catch {
    // silently fail — browser pixel is the fallback
  }
}

export function TrackingScripts() {
  return (
    <>
      {/* ── Meta Pixel + CAPI ── */}
      {PIXEL_ID && (
        <Script id="fb-pixel" strategy="afterInteractive" onLoad={() => {
          // Server-side mirror via CAPI
          sendCapi("PageView");
          sendCapi("ViewContent", {
            content_name: "Rastreador GPS Veicular 2 em 1",
            content_category: "GPS / Rastreadores",
            content_ids: ["GPS-2EM1-1UN"],
            content_type: "product",
            value: 197.00,
            currency: "BRL",
          });
        }}>
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${PIXEL_ID}');
            fbq('track','PageView');
            fbq('track','ViewContent',{
              content_name:'Rastreador GPS Veicular 2 em 1',
              content_category:'GPS / Rastreadores',
              content_ids:['GPS-2EM1-1UN'],
              content_type:'product',
              value:197.00,
              currency:'BRL'
            });
          `}
        </Script>
      )}

      {/* ── GA4 ── */}
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
              gtag('config', '${GA4_ID}', {send_page_view: true});
              gtag('event', 'view_item', {
                currency: 'BRL',
                value: 197.00,
                items: [{
                  item_id: 'GPS-2EM1-1UN',
                  item_name: 'Rastreador GPS Veicular 2 em 1',
                  item_brand: 'Nexo Brasil',
                  item_category: 'GPS',
                  price: 197.00,
                  quantity: 1
                }]
              });
            `}
          </Script>
        </>
      )}

      {/* ── Google Ads ── */}
      {GADS_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gads-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GADS_ID}');
            `}
          </Script>
        </>
      )}
    </>
  );
}

const KIT_PRODUCT_MAP = {
  "1": { id: "GPS-2EM1-1UN", name: "Rastreador GPS 2 em 1 — 1 unidade",   price: 197.00 },
  "2": { id: "GPS-2EM1-2UN", name: "Kit 2 Unidades — Rastreador GPS 2 em 1", price: 347.00 },
  "3": { id: "GPS-2EM1-3UN", name: "Kit 3 Unidades — Rastreador GPS 2 em 1", price: 479.00 },
} as const;

export function trackCheckoutClick(kit: "1" | "2" | "3") {
  if (typeof window === "undefined") return;

  const product = KIT_PRODUCT_MAP[kit];
  const checkoutData = {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    num_items: Number(kit),
    value: product.price,
    currency: "BRL",
  };

  // Meta Pixel (browser)
  if (window.fbq) {
    window.fbq("trackCustom", `SelectKit${kit}`);
    window.fbq("track", "InitiateCheckout", checkoutData);
  }

  // Meta CAPI (server-side mirror)
  sendCapi("InitiateCheckout", checkoutData);

  // GA4
  if (window.gtag) {
    window.gtag("event", "begin_checkout", {
      currency: "BRL",
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_brand: "Nexo Brasil",
        item_category: "GPS",
        price: product.price,
        quantity: Number(kit),
      }],
    });
    window.gtag("event", `select_kit_${kit}`, { kit_number: kit });
  }
}
