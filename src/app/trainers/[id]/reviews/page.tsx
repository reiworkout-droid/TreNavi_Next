"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  CircularProgress,
  Divider
} from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// 数値をラベルに変換するヘルパー（ここはlibなどに切り出してもOK）
const getLabel = (key: string, value: number) => {
  const labels: Record<string, { low: string; high: string }> = {
    style: { low: "優しめ", high: "厳しめ" },
    talk: { low: "少なめ", high: "多め" },
    logic: { low: "感覚的", high: "科学的" },
    pace: { low: "ゆっくり", high: "ハード" },
    distance: { low: "フレンドリー", high: "プロっぽい" },
  };

  const val = Math.round(value); // 小数点がある場合を考慮
  if (val <= 2) return labels[key].low;
  if (val >= 4) return labels[key].high;
  return "標準的";
};

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function TrainerReviewsPage() {
  const params = useParams()
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/trainers/${params.id}/reviews`)
        if (!res.ok) throw new Error("取得失敗")
        const data = await res.json()
        setReviews(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [params.id])

  if (loading) return <Box sx={{ p: 4, textAlign: "center" }}><CircularProgress /></Box>

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => router.back()}
        sx={{ mb: 2 }}
      >
        トレーナー詳細へ戻る
      </Button>

      <Typography variant="h5" fontWeight="bold" mb={3}>
        口コミ一覧
      </Typography>

      {reviews.length === 0 ? (
        <Typography color="text.secondary">まだ口コミがありません。</Typography>
      ) : (
        <Stack spacing={3}>
          {reviews.map((review) => (
            <Card key={review.id} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                {/* 投稿者情報 */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {review.user_name} さん
                    </Typography>
                    {/* 投稿者のタイプを表示 */}
                    <Chip 
                      label={review.user_type || "タイプ未診断"} 
                      size="small"
                      color="secondary"
                      sx={{ fontWeight: "bold", mt: 0.5 }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {review.created_at}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                {/* フィードバック結果（言葉に変換） */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Chip label={`指導: ${getLabel("style", review.scores.style)}`} size="small" variant="outlined" />
                  <Chip label={`会話: ${getLabel("talk", review.scores.talk)}`} size="small" variant="outlined" />
                  <Chip label={`方法: ${getLabel("logic", review.scores.logic)}`} size="small" variant="outlined" />
                  <Chip label={`ペース: ${getLabel("pace", review.scores.pace)}`} size="small" variant="outlined" />
                  <Chip label={`距離感: ${getLabel("distance", review.scores.distance)}`} size="small" variant="outlined" />
                </Box>

                {/* もしコメント用のカラム(commentなど)を作っている場合はここに追加 */}
                {review.comment && (
                  <Typography variant="body2" sx={{ mt: 2, p: 1.5, bgcolor: "grey.50", borderRadius: 1 }}>
                    {review.comment}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  )
}