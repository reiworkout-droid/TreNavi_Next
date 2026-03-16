// NextのSEO設定の型
import type { Metadata } from "next";
// Googleフォントのインポート
import { Geist, Geist_Mono } from "next/font/google";
// ツールバーのインポート
import { Toolbar } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import { AuthProvider } from "@/context/AuthContext"
// ヘッダーコンポーネントのインポート
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav"
import "./globals.css";

// フォントの設定
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// 等幅フォントの設定
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO設定
export const metadata: Metadata = {
  title: "TreNavi",
  description: "Matchmaking service for personal trainers and clients",
};

// ルートレイアウトコンポーネント
// すべてのページで共通のレイアウトを提供するコンポーネント
export default function RootLayout({
  children, //各page.tsxの内容が入る
}: Readonly<{ //childrenは書き換え禁止
  children: React.ReactNode; 
}>) {
  return (
    <html lang="ja">
      {/* body全体にフォントの設定を行うCSS */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <AuthProvider>
            {/* ヘッダー */}
            <Header />

            <Header />

            <Toolbar />

            <main style={{ marginTop: "64px", marginBottom: "80px" }}>
              {children}
            </main>

            <BottomNav />
            
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
