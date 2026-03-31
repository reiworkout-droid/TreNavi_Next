"use client"

import { TrainerSearch } from "@/types"
import { calculateMatchScore } from "./MatchingLogic"
import {
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material"
import { useRouter } from "next/navigation"
import TrainerLikeButton from "./TrainerLikeButton"

const API_URL = process.env.NEXT_PUBLIC_API_URL

type Props = {
  trainer: TrainerSearch
  userType: string | null
}

export default function TrainerCard({ trainer, userType }: Props) {

  const router = useRouter()

  const score = userType
    ? calculateMatchScore(userType, trainer)
    : null

  const renderStars = (score: number) => {
    const rounded = Math.round(score)
    return "★".repeat(rounded) + "☆".repeat(5 - rounded)
    }
console.log(trainer)
console.log(
  trainer.id,
  trainer.style_avg,
  trainer.talk_avg
)
  return (
    // MUI: Card に角丸・影・ホバーエフェクト追加
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
        overflow: "hidden",
      }}
    >

      {/* MUI: 画像の高さを拡大 */}
      <Box
        component="img"
        src={
          trainer.profile_image
            ? `${API_URL}/storage/${trainer.profile_image}`
            : "/noimage.png"
        }
        sx={{ width: "100%", height: 240, objectFit: "cover" }}
      />

      {/* MUI: CardContent に余白を増やして読みやすく */}
      <CardContent sx={{ px: 2.5, py: 2.5 }}>

        {/* MUI: おすすめバッジ風スタイル */}
        {score !== null && score >= 3.5 && (
          <Typography
            fontWeight="bold"
            sx={{
              fontSize: "0.8rem",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "inline-block",
              px: 1.5,
              py: 0.3,
              borderRadius: 2,
              mb: 1,
            }}
          >
            ⭐ あなたにおすすめ
          </Typography>
        )}

        {/* MUI: 名前を目立たせる + ホバー装飾 / Tailwind: 下余白 */}
        <Typography
          variant="h6"
          onClick={() => router.push(`/trainers/${trainer.id}`)}
          sx={{
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "text.primary",
            "&:hover": { color: "primary.main", textDecoration: "underline" },
          }}
          className="mb-1"
        >
          {trainer.user.name}
        </Typography>

        {/* MUI: エリア情報を控えめに / Tailwind: 余白調整 */}
        <Typography
          sx={{ fontSize: "0.85rem", color: "text.secondary" }}
          className="mb-0.5"
        >
          {trainer.areas.map(a => a.name).join(" / ")}
        </Typography>

        {/* MUI: カテゴリを小さめに */}
        <Typography
          sx={{ fontSize: "0.85rem", color: "text.secondary" }}
          className="mb-0.5"
        >
          {trainer.categories.map(c => c.name).join(", ")}
        </Typography>

        {/* MUI: 得意分野を少し強調 / Tailwind: 下余白 */}
        <Typography
          sx={{ fontSize: "0.85rem", color: "text.secondary", fontWeight: 500 }}
          className="mb-2"
        >
          得意: {trainer.specialities.map(s => s.name).join(", ")}
        </Typography>

        {/* MUI: スコアの色分け・フォントサイズ調整 */}
        {score !== null && (
          <Typography sx={{
            mt: 1,
            fontWeight: "bold",
            fontSize: "0.9rem",
            color:
              score >= 4
                ? "orange"
                : score >= 3.5
                ? "gold"
                : "gray"
          }}>
            相性スコア: {renderStars(score)} {score} / 5
          </Typography>
        )}

        {/* MUI: 料金を太字で強調 / Tailwind: 上下余白 */}
        <Typography
          sx={{
            mt: 1.5,
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "text.primary",
          }}
          className="mb-3"
        >
          最安料金 {trainer.plans_min_price ?? "未設定"}円
        </Typography>

        {/* Tailwind: いいねボタン周りの余白確保 */}
        <Box className="pt-2">
          <TrainerLikeButton trainerId={trainer.id} />
        </Box>

      </CardContent>
    </Card>
  )
}
