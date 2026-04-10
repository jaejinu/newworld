import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/boardList.css";
import "swiper/css";
import Header from "@/components/layout/header/Header";
import TopBanner from "@/components/topBanner/TopBanner";
import { pretendard, spectral, poppins } from "./fonts";
import Footer from "@/components/layout/footer/Footer";
import ScrollClassEffect from "@/components/ScrollClassEffect";


export const metadata = {
  title: "더원서울안과 공식 블로그",
  description: "강남구 신사역 6.8번 출구 신사스퀘어 8.9층 망막녹내장백내장노안 일반 안질환진료등 예약 상담안내 강남안과, 강남역 안과, 망막안과, 강남안과추천",
  
  openGraph: {
    title: "더원서울안과 공식 블로그",
    description: "강남구 신사역 6.8번 출구 신사스퀘어 8.9층 망막녹내장백내장노안 일반 안질환진료등 예약 상담안내 강남안과, 강남역 안과, 망막안과, 강남안과추천",    
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} ${spectral.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
