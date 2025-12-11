import type { Metadata } from "next";

// SEO를 위한 기본 메타데이터 객체
export const metadata: Metadata = {
  metadataBase: new URL("https://bookjeok.com"),
  title: {
    template: "%s | bookjeok", // 페이지별 제목이 %s 위치에 들어갑니다.
    default: "bookjeok - 중고책 거래와 리뷰를 한곳에", // 기본 제목
  },
  applicationName: "bookjeok",
  appleWebApp: {
    title: "bookjeok",
  },
  description:
    "bookjeok(북적)에서 중고 서적을 거래하고 솔직한 리뷰를 나눠보세요.",
  keywords: [
    "bookjeok",
    "북적",
    "중고책",
    "중고서적",
    "책거래",
    "중고책 거래",
    "독서",
    "서평",
    "북리뷰",
    "독서모임",
    "공연",
    "전시",
    "문화예술",
    "지식공유",
    "커뮤니티",
  ],
  openGraph: {
    title: "bookjeok - 책과 지식의 선순환",
    description:
      "다양한 문화 예술 정보를 탐색하고, 중고 서적을 거래하며 지식의 가치를 발견하는 공간입니다.",
    url: "https://bookjeok.com",
    siteName: "bookjeok",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "bookjeok - 책과 지식의 선순환",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "bookjeok - 책과 지식의 선순환",
    description:
      "공연, 전시, 중고 서적 거래를 한 곳에서. 당신의 문화 생활을 업그레이드하세요.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: {
      url: "/logo.svg",
      type: "image/svg+xml",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "04FIlPfM3tjBU80tzoVObOuhIYffXxg0AzUK8ZuL41s",
  },
};
