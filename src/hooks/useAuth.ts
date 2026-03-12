"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  export function useAuth() {
    const router = useRouter();
  // ページがロードされたときに認証状態をチェックする
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 認証チェックAPIにリクエストを送る（Cookieを含める）
        const res = await fetch(`${API_URL}/api/user`, {
            credentials: "include"
        });

    // 未ログイン
    if (!res.ok) {
    console.log("未ログイン → loginへ移動");
    router.push("/login");
    return;
    }

    const data = await res.json();// レスポンスから認証状態を取得
    console.log("ログインユーザー:", data);

    } catch (err) {
        console.error("認証チェック失敗:", err);
        router.push("/login");
    }
    };
    checkAuth();
  }, [router]);

}