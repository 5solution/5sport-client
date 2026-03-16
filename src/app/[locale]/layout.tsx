import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { Providers } from "@/lib/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

const BASE_URL = "https://5sport.vn";
const TITLE = "5Sport - Nền tảng thể thao cộng đồng";
const DESCRIPTION =
  "5Sport – Kết nối cộng đồng thể thao Việt Nam. Đăng ký thi đấu, mua vé nhóm, theo dõi sự kiện marathon, chạy bộ và các giải thể thao trên toàn quốc.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: TITLE,
    template: "%s | 5Sport",
  },
  description: DESCRIPTION,
  keywords: [
    "5Sport",
    "thể thao cộng đồng",
    "marathon Việt Nam",
    "đăng ký thi đấu",
    "mua vé chạy bộ",
    "sự kiện thể thao",
    "running Vietnam",
    "giải chạy",
    "vé nhóm thể thao",
  ],
  authors: [{ name: "5Sport", url: BASE_URL }],
  creator: "5Sport",
  publisher: "5Sport",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "5Sport",
    title: TITLE,
    description: DESCRIPTION,
    locale: "vi_VN",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "5Sport - Nền tảng thể thao cộng đồng Việt Nam",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@5sportvn",
    creator: "@5sportvn",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      vi: `${BASE_URL}/vi`,
      en: `${BASE_URL}/en`,
    },
  },
  other: {
    // Facebook domain verification (thay bằng code thực tế từ Meta Business)
    // "facebook-domain-verification": "your_verification_code",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="beforeInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NKCSN8V3');`}</Script>
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-GBNF88D1PJ" />
        <Script id="gtag" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-GBNF88D1PJ');`}</Script>
      </head>
      <body className="min-h-screen font-sans antialiased">
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "5Sport",
              url: BASE_URL,
              logo: `${BASE_URL}/logo.png`,
              description: DESCRIPTION,
              email: "info@5sport.vn",
              telephone: "+84336963998",
              sameAs: [
                "https://www.facebook.com/5sportvn",
                "https://www.tiktok.com/@5sportvn",
              ],
              address: {
                "@type": "PostalAddress",
                addressCountry: "VN",
              },
            }),
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NKCSN8V3"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
