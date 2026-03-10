"use client"; // クライアントサイドで動作するコンポーネントであることを示す

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, TextField, Button, Typography } from "@mui/material";

// ログインページのコンポーネント
export default function LoginPage() {
  // 画面遷移用
  const router = useRouter();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isLogin, setIsLogin] = useState(true);
  // → true: ログイン / false: 新規登録

  const [error, setError] = useState("");
  // → エラーメッセージを保持

  const [loading, setLoading] = useState(false);
  // → 処理中かどうか（ボタンの無効化に使う）
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ログイン処理
  const handleLogin = async () => {

    try {

      // ① CSRF Cookie取得
      await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        credentials: "include" // Cookieをリクエストに含めるためのオプション
      })

      // ② CookieからXSRF-TOKEN取得
      const xsrfToken = decodeURIComponent(
        // CookieからXSRF-TOKENを取得する処理
        document.cookie
          .split("; ") // Cookieを分割して配列にする
          .find(row => row.startsWith("XSRF-TOKEN=")) // "XSRF-TOKEN="で始まるCookieを見つける
          ?.split("=")[1] || "" // 見つかったCookieを"="で分割して値を取得、見つからなければ空文字列
      )


      // ③ ログインAPIにリクエストを送る
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        credentials: "include", // Cookieをリクエストに含めるためのオプション
        headers: {
        "Content-Type": "application/json", // JSON形式でデータを送ることを示す
        "Accept": "application/json", // サーバーからJSON形式のレスポンスを期待することを示す
        "X-XSRF-TOKEN": xsrfToken // 取得したXSRFトークンをヘッダーに含める
      },
        body: JSON.stringify({ email, password }), // ログインに必要なデータをJSON形式で送る
    });

  // ステータスコードが200系じゃなければエラーにする
  // 例：401（認証失敗）
  if (!res.ok) {
    throw new Error("Login failed")
  }
  // レスポンスのJSONを取得
  const data = await res.json()

  router.push("/select-mode")
  
} catch(err) { // エラーが発生した場合はエラーメッセージをセット

  setError("ログイン失敗")

} finally {
  // ローディングOFF
  setLoading(false) // これで成功・失敗どちらの場合もローディングが終了するようになる

}
}

const handleRegister = async () => {
  // CSRF認証のためにまずCookieを取得する
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include"
  })
  // CookieからxsrfTokenを取得
  const xsrfToken = decodeURIComponent(
    document.cookie
      .split("; ") // cookieを分割して配列形式にする
      .find(row => row.startsWith("XSRF-TOKEN=")) // "XSRF-TOKEN="で始まるCookieを探す
      ?.split("=")[1] || "" // 見つかったCookieを"="で分割して値を取得、見つからなければ空文字列
  )


  const res = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json", //送る時     
      "Accept": "application/json", //受け取る時
      "X-XSRF-TOKEN": xsrfToken 
    },
    body:JSON.stringify({
      name,
      email,
      password
    })
  })
  const data = await res.json()
  console.log(data)
  
  router.push("/select-mode")

}

  const handleAuth = async (e: React.FormEvent) => {
    // フォーム送信時のページリロードを防ぐ
    e.preventDefault();

    // エラーをクリア
    setError("");

    // ローディング開始
    setLoading(true);

    if(isLogin) {
      await handleLogin()
    } else {
      await handleRegister()
    }
  };
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">

      <Card className="w-[400px] min-h-[450px] shadow-lg">

        <CardContent className="flex flex-col gap-6 !pt-12 !pb-8 !px-8">

          <Typography variant="h4" className="text-center font-bold">
            TreNavi Login
          </Typography>

          <div className="flex width mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={isLogin ? "border-b-2 border-blue-500" : "text-gray-400"}
            >
              ログイン
            </button>
            <button
              onClick={() => setIsLogin(false)}>
              新規登録
            </button>
          </div>

          <form onSubmit={handleAuth}>

          {!isLogin && (
            <TextField
              label="Name"
              value={name}
              fullWidth
              onChange={(e)=>setName(e.target.value)}
            />
          )}

          <TextField
            label="Email"
            type="email"
            value={email}
            fullWidth
            className="!mt-6"
            onChange={(e)=>setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            fullWidth
            className="!mt-3"
            onChange={(e)=>setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            className="!mt-10"
            // onClick={handleAuth}
          >
            {isLogin ? "ログイン" : "登録" }
          </Button>

        </form>

        </CardContent>

      </Card>

    </main>
  )
}