"use client"; // クライアントサイドで動作するコンポーネントであることを示す

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, TextField, Button, Typography } from "@mui/material";

// ========================================
// ログインページ（UIのみ）
// ========================================


export default function LoginPage() {
  // 画面遷移用
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isLogin, setIsLogin] = useState(true);
  // → true: ログイン / false: 新規登録

  const [error, setError] = useState("");
  // → エラーメッセージを保持

  const [loading, setLoading] = useState(false);
  // → 処理中かどうか（ボタンの無効化に使う）

  const handleLogin = async () => {

  const res = await fetch("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  })

  const data = await res.json()

  localStorage.setItem("token", data.token)

  router.push("/home")
}

  const handleAuth = async (e: React.FormEvent) => {
    // フォーム送信時のページリロードを防ぐ
    e.preventDefault();

    // エラーをクリア
    setError("");

    // ローディング開始
    setLoading(true);
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

          {!isLogin && (
            <TextField
              label="Name"
              type="name"
              fullWidth
            />
          )}

          <TextField
            label="Email"
            type="email"
            fullWidth
            className="!mt-6"
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            className="!mt-3"
          />

          <Button
            variant="contained"
            size="large"
            fullWidth
            className="!mt-10"
          >
            Login
          </Button>

        </CardContent>

      </Card>

    </main>
  )
}