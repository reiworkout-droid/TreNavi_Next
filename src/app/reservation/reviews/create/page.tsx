"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ReviewSlider from "@/components/ReviewSlider"
import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ReviewCreatePage() {
  const router = useRouter()

  // ⭐ ステート
  const [style, setStyle] = useState(3)
  const [talk, setTalk] = useState(3)
  const [logic, setLogic] = useState(3)
  const [pace, setPace] = useState(3)
  const [distance, setDistance] = useState(3)

  const [reservationId, setReservationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // ⭐ URLからID取得
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setReservationId(params.get("reservation_id"))
  }, [])

  // 🔑 共通
  const getToken = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      throw new Error("No token")
    }
    return token
  }

  // ⭐ 投稿処理
  const submitReview = async () => {
    if (!reservationId) {
      alert("予約IDが取得できません")
      return
    }

    setLoading(true)

    try {
      const token = getToken()

      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservation_id: reservationId,
          style,
          talk,
          logic,
          pace,
          distance
        })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err.message || "投稿失敗")
        return
      }

      alert("投稿しました！")

      router.push("/reservation")

    } catch (err) {
      console.error(err)
      alert("通信エラー")
    } finally {
      setLoading(false)
    }
  }

  const marks = [
    { value: 1, label: "1" },
    { value: 3, label: "3" },
    { value: 5, label: "5" }
  ]

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h5" mb={3}>
        口コミ投稿
      </Typography>

      <Stack spacing={4}>
        <ReviewSlider label="指導スタイル" left="優しい" right="厳しい" value={style} onChange={setStyle} marks={marks} />
        <ReviewSlider label="会話量" left="少ない" right="多い" value={talk} onChange={setTalk} marks={marks} />
        <ReviewSlider label="指導方法" left="体感型" right="論理型" value={logic} onChange={setLogic} marks={marks} />
        <ReviewSlider label="ペース" left="ゆっくり" right="テンポ良い" value={pace} onChange={setPace} marks={marks} />
        <ReviewSlider label="距離感" left="フレンドリー" right="プロっぽい" value={distance} onChange={setDistance} marks={marks} />

        <Button
          variant="contained"
          size="large"
          color="secondary"
          onClick={submitReview}
          disabled={loading}
        >
          {loading ? "送信中..." : "投稿する"}
        </Button>
      </Stack>
    </Box>
  )
}