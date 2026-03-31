"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search).get("redirect");
    setRedirect(params);
  }, []);

  // --- ユーザー情報取得 ---
  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/user`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("ユーザー情報取得失敗");
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  // --- ログイン ---
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "メールまたはパスワードが違います");
        return;
      }

      // トークンを保存
      localStorage.setItem("token", data.access_token);

      // ユーザー情報取得
      await fetchUser(data.access_token);

      // リダイレクト
      if (redirect) router.push(redirect);
      else router.push("/home");

    } catch (err) {
      console.error(err);
      setError("ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // --- 新規登録 ---
  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "登録に失敗しました");
        return;
      }

      localStorage.setItem("token", data.access_token);

      // ユーザー情報取得
      await fetchUser(data.access_token);

      router.push("/home");
    } catch (err) {
      console.error(err);
      setError("登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isLogin) await handleLogin();
    else await handleRegister();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px] min-h-[450px] shadow-lg">
        <CardContent className="flex flex-col gap-6 !pt-12 !pb-8 !px-8">
          <Typography variant="h4" className="text-center font-bold">TreNavi Login</Typography>

          <div className="flex bg-gray-100 rounded-full p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
                isLogin
                  ? "bg-white text-[#5a9e7c] shadow"
                  : "text-gray-400"
              }`}
            >
              ログイン
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
                !isLogin
                  ? "bg-white text-[#5a9e7c] shadow"
                  : "text-gray-400"
              }`}    
            >
              新規登録
            </button>
          </div>

          <form onSubmit={handleAuth}>
            {!isLogin && (
              <TextField label="Name" value={name} fullWidth onChange={(e) => setName(e.target.value)} />
            )}

            <TextField
              label="Email"
              type="email"
              value={email}
              fullWidth
              className="!mt-6"
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              fullWidth
              className="!mt-3"
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              size="large"
              fullWidth
              type="submit"
              className="!mt-10"
              disabled={loading}
            >
              {loading ? "処理中..." : isLogin ? "ログイン" : "登録"}
            </Button>
          </form>

          {error && <Typography color="error" align="center">{error}</Typography>}
        </CardContent>
      </Card>
    </main>
  );
}