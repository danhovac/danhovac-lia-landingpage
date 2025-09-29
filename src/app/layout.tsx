import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://danhovac-lia-landingpage.vercel.app";
const ogImagePath = "/thumnail.png";
const ogImageUrl = `${siteUrl}${ogImagePath}`;

export const metadata: Metadata = {
  title: "Lia | 감정에서 시작하는 폐경 케어",
  description:
    "Lia는 감정 기반 CBT 미션과 호르몬 치료 가이드를 하나의 여정으로 연결해 주는 폐경 케어 동반자입니다.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Lia | 감정에서 시작하는 폐경 케어",
    description:
      "감정 체크인부터 맞춤 미션, 치료 준비까지 Lia와 함께하는 폐경 케어 여정을 만나보세요.",
    url: siteUrl,
    siteName: "Lia",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Lia 베타 런칭 썸네일",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lia | 감정에서 시작하는 폐경 케어",
    description:
      "Lia와 함께 감정에서 시작하는 폐경 케어 루틴을 만나보세요.",
    images: [ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-locale="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script id="locale-hydration" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: '(()=>{const a=(l)=>{const r=document.documentElement;if(!r)return;r.setAttribute("lang",l);r.setAttribute("data-locale",l);};const n=(v)=>{if(!v)return null;const s=v.toLowerCase();return s==="ko"||s==="en"?s:null;};try{const p=new URLSearchParams(window.location.search);const q=n(p.get("lang"));if(q){a(q);return;}}catch{}const m=document.cookie.match(/(?:^|; )lang=([^;]*)/);if(m){const c=n(decodeURIComponent(m[1]));if(c){a(c);return;}}a("ko");})();' }} />
        {children}
      </body>
    </html>
  );
}
