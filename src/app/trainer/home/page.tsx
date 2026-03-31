"use client"

import { Box, Typography, Button, Stack } from "@mui/material"
import { useRouter } from "next/navigation"

/* ダッシュボード用カードデータ */
const menuItems = [
  {
    label: "予約一覧を見る",
    description: "受付済み・確定済みの予約をまとめて確認できます",
    path: "/trainer/reservations",
    isCta: true,
    icon: "📋",
  },
  {
    label: "プラン追加",
    description: "新しいトレーニングプランを作成して公開しましょう",
    path: "/trainer/plan/create",
    isCta: false,
    icon: "➕",
  },
  {
    label: "プラン一覧",
    description: "既存プランの確認・編集・非公開設定ができます",
    path: "/trainer/plan",
    isCta: false,
    icon: "📦",
  },
]

export default function TrainerHomePage() {
  const router = useRouter()

  return (
    /* Tailwind: 全体余白・最大幅・中央寄せ */
    <Box sx={{ p: 4, maxWidth: 640, mx: "auto" }} className="py-8 px-4 sm:px-6">

      {/* MUI: タイトル強調 / Tailwind: 下余白 */}
      <Typography
        variant="h4"
        mb={3}
        sx={{ fontWeight: 800, color: "#5a9e7c", letterSpacing: "-0.02em" }}
        className="mb-1"
      >
        トレーナーホーム
      </Typography>

      {/* MUI: サブテキスト / Tailwind: 下余白 */}
      <Typography
        variant="body2"
        mb={3}
        sx={{ color: "text.secondary", fontSize: "0.9rem" }}
        className="mb-6"
      >
        お疲れさまです！今日もトレーニングを管理しましょう 💪
      </Typography>

      {/* Tailwind: カード間の余白 */}
      <Stack spacing={2} className="gap-3">
        {menuItems.map((item) => (
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push(item.path)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
                textTransform: "none",
                borderRadius: 3,
                px: 3,
                py: 3,
                mb: 3,

                /* ★ 少し強めに */
                borderColor: "#5a9e7c",
                color: "#3d6b52",              // ← 少し濃く
                bgcolor: "#ffffff",

                /* ★ 影を強化（ここが一番効く） */
                boxShadow: "0 4px 14px rgba(90,158,124,0.12)",

                "&:hover": {
                  bgcolor: "#f2faf6",          // ← 少しだけ濃い背景
                  borderColor: "#4a8e6c",
                  transform: "translateY(-3px)", // ← 少し強く
                  boxShadow: "0 8px 24px rgba(90,158,124,0.18)", // ← リッチ感
                },

                transition: "all 0.2s ease",
              }}
            >
              {/* MUI: アイコン + ラベル行 */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.08rem",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <span>{item.icon}</span> {item.label}
            </Typography>

            {/* MUI: 説明テキスト */}
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "0.8rem",
                mt: 0.5,
                opacity: 0.8,
                color: "text.secondary",
              }}
            >
              {item.description}
            </Typography>
          </Button>
        ))}
      </Stack>
    </Box>
  )
}
