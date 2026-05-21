import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TrackingScripts } from "@/components/TrackingScripts";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexo Brasil — Rastreador GPS Veicular por menos de R$20/mês",
  description:
    "Rastreador GPS veicular 2 em 1 com carregador USB-C 30W. Saiba onde seu veículo está por 10x de R$19,70. Ideal para carros e motos.",
  openGraph: {
    title: "Nexo Brasil — Rastreador GPS Veicular por menos de R$20/mês",
    description:
      "Rastreador GPS veicular 2 em 1 com carregador USB-C 30W. Saiba onde seu veículo está por 10x de R$19,70.",
    type: "website",
    locale: "pt_BR",
  },
};

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <TrackingScripts />
        {/* Meta Pixel noscript fallback */}
        {META_PIXEL_ID && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
