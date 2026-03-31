"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button
} from "@mui/material";
import { Reservation } from "@/types";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const router = useRouter();

  const [nextReservation, setNextReservation] = useState<Reservation | null>(null);
  const [diagnosisDone, setDiagnosisDone] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  const fetchWithAuth = async (url: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      throw new Error("No token");
    }
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("API error");
    return res.json();
  };

  useEffect(() => {
    const init = async () => {
      try {
        const reservation = await fetchWithAuth(`${API_URL}/api/reservations/next`);
        setNextReservation(reservation);
        const user = await fetchWithAuth(`${API_URL}/api/user`);
        setDiagnosisDone(!!user.user_type);
        setUserType(user.user_type);
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, []);

  const handleDiagnosisClick = () => {
    if (diagnosisDone && userType) {
      router.push(`/diagnosis/result?type=${userType}`);
    } else {
      router.push("/diagnosis");
    }
  };

  return (
    /* Tailwind: 上部に余白(pt-20)でヘッダー分確保、左右余白を広めに、最大幅制限でスマホ最適化 */
    <Box sx={{ p: 0 }} className="pt-20 px-4 pb-8 max-w-lg mx-auto">

      {/* MUI sx: フォントを統一、色をセージグリーンに、Tailwind: 下余白 */}
      <Typography
        variant="h5"
        mb={3}
        sx={{
          fontWeight: 700,
          fontFamily: "'Outfit', 'Noto Sans JP', sans-serif",
          color: "#3d6b52",
          letterSpacing: "0.02em",
        }}
        className="mb-6"
      >
        ダッシュボード
      </Typography>

      {/* ===== トレーナー検索（最重要CTA）===== */}
      <Card
        sx={{
          mb: 3,
          /* MUI sx: 角丸を大きく、影を柔らかく → 安心感 */
          borderRadius: "16px",
          boxShadow: "0 2px 12px -2px rgba(90,158,124,0.12)",
          border: "1px solid rgba(90,158,124,0.1)",
          overflow: "hidden",
        }}
        className="mb-4"
      >
        <CardContent
          sx={{ p: 3 }}
          className="p-5"
        >
          {/* MUI sx: セクション見出しを統一 */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              fontFamily: "'Outfit', 'Noto Sans JP', sans-serif",
              color: "#2d2d2d",
            }}
          >
            トレーナーを探す
          </Typography>

          {/* MUI sx: サブテキストを柔らかいグレーで */}
          <Typography
            sx={{
              mt: 1,
              color: "#6b7280",
              fontSize: "0.875rem",
              lineHeight: 1.6,
            }}
          >
            あなたに合うトレーナーを見つけましょう
          </Typography>

          {/* MUI sx: メインCTAをコーラルオレンジで最も目立たせる */}
          <Button
            variant="contained"
            color="secondary"
            sx={{
              mt: 2,
              borderRadius: "999px",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.9rem",
              px: 4,
              py: 1.2,
              textTransform: "none",
              boxShadow: "0 4px 16px -2px rgba(232,115,74,0.35)",
              "&:hover": {
                backgroundColor: "#d4623c",
                boxShadow: "0 6px 20px -2px rgba(232,115,74,0.45)",
              },
            }}
            onClick={() => router.push("/trainers")}
          >
            検索する
          </Button>
        </CardContent>
      </Card>

      {/* ===== 次の予約 ===== */}
      <Card
        sx={{
          mb: 3,
          borderRadius: "16px",
          boxShadow: "0 2px 12px -2px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
        }}
        className="mb-4"
      >
        <CardContent sx={{ p: 3 }} className="p-5">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              fontFamily: "'Outfit', 'Noto Sans JP', sans-serif",
              color: "#2d2d2d",
            }}
          >
            次の予約
          </Typography>

          {nextReservation?.plan ? (
            <>
              {/* MUI sx: 予約名をセージグリーンで強調 */}
              <Typography
                fontWeight="bold"
                sx={{
                  mt: 1.5,
                  color: "#5a9e7c",
                  fontSize: "0.95rem",
                }}
              >
                {nextReservation.plan.name}
              </Typography>

              <Typography sx={{ mt: 0.5, color: "#4b5563", fontSize: "0.875rem" }}>
                👤 {nextReservation.trainer.user.name}
              </Typography>

              <Typography sx={{ mt: 0.5, color: "#4b5563", fontSize: "0.875rem" }}>
                🗓 {new Date(nextReservation.reserver_at).toLocaleString()}
              </Typography>
            </>
          ) : (
            <Typography
              color="text.secondary"
              sx={{ mt: 1.5, fontSize: "0.875rem", color: "#9ca3af" }}
            >
              予約はありません
            </Typography>
          )}

          {/* MUI sx: セカンダリボタンはセージグリーンのアウトライン */}
          <Button
            sx={{
              mt: 2,
              borderRadius: "999px",
              border: "1.5px solid #5a9e7c",
              color: "#5a9e7c",
              fontWeight: 600,
              fontSize: "0.8rem",
              px: 3,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(90,158,124,0.08)",
              },
            }}
            onClick={() => router.push("/reservation")}
          >
            予約一覧
          </Button>
        </CardContent>
      </Card>

      {/* ===== いいね一覧 ===== */}
      <Card
        sx={{
          mb: 3,
          borderRadius: "16px",
          boxShadow: "0 2px 12px -2px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
        }}
        className="mb-4"
      >
        <CardContent sx={{ p: 3 }} className="p-5">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              fontFamily: "'Outfit', 'Noto Sans JP', sans-serif",
              color: "#2d2d2d",
            }}
          >
            いいね一覧
          </Typography>

          <Button
            sx={{
              mt: 2,
              borderRadius: "999px",
              border: "1.5px solid #5a9e7c",
              color: "#5a9e7c",
              fontWeight: 600,
              fontSize: "0.8rem",
              px: 3,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(90,158,124,0.08)",
              },
            }}
            onClick={() => router.push("/like")}
          >
            いいね一覧
          </Button>
        </CardContent>
      </Card>

      {/* ===== 診断 ===== */}
      <Card
        sx={{
          mb: 3,
          borderRadius: "16px",
          boxShadow: "0 2px 12px -2px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
        }}
        className="mb-4"
      >
        <CardContent sx={{ p: 3 }} className="p-5">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              fontFamily: "'Outfit', 'Noto Sans JP', sans-serif",
              color: "#2d2d2d",
            }}
          >
            TreNavi診断
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#6b7280",
              fontSize: "0.875rem",
              lineHeight: 1.6,
            }}
          >
            理想のトレーナータイプを診断しましょう
          </Typography>

          {/* MUI sx: 診断ボタンもコーラルオレンジ系で行動を促す */}
          <Button
            sx={{
              mt: 2,
              borderRadius: "999px",
              backgroundColor: "#5a9e7c",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.85rem",
              px: 3,
              py: 1,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#4a8b6b",
              },
            }}
            variant="contained"
            onClick={handleDiagnosisClick}
          >
            診断する
          </Button>
        </CardContent>
      </Card>

    </Box>
  );
}
