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
    <Card>

      <Box
        component="img"
        src={
          trainer.profile_image
            ? `${API_URL}/storage/${trainer.profile_image}`
            : "/noimage.png"
        }
        sx={{ width: "100%", height: 220, objectFit: "cover" }}
      />

      <CardContent>

        {score !== null && score >= 3.5 && (
        <Typography color="primary" fontWeight="bold">
            ⭐ あなたにおすすめ
        </Typography>
        )}

        <Typography
          variant="h6"
          onClick={() => router.push(`/trainers/${trainer.id}`)}
          sx={{ cursor: "pointer" }}
        >
          {trainer.user.name}
        </Typography>

        <Typography>
          {trainer.areas.map(a => a.name).join(" / ")}
        </Typography>

        <Typography>
          {trainer.categories.map(c => c.name).join(", ")}
        </Typography>

        <Typography>
          得意: {trainer.specialities.map(s => s.name).join(", ")}
        </Typography>

        {score !== null && (
        <Typography sx={{ 
            mt: 1, 
            fontWeight: "bold",
                    color:
            score && score >= 3.5
                ? "gold"
                : score && score >= 4
                ? "orange"
                : "gray"    
        }}>
            相性スコア: {renderStars(score)} {score} / 5
        </Typography>
        )}

        <Typography sx={{ mt: 1 }}>
          最安料金 {trainer.plans_min_price ?? "未設定"}円
        </Typography>

        <TrainerLikeButton
          trainerId={trainer.id}
          initialLiked={trainer.is_liked}
          initialCount={trainer.likes_count}
        />

      </CardContent>
    </Card>
  )
}