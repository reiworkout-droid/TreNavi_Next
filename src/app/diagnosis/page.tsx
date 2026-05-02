"use client"

import { useState } from "react"
import ReviewSlider from "@/components/ui/ReviewSlider"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function DiagnosisPage() {

  const router = useRouter()

  const [style, setStyle] = useState(3)
  const [talk, setTalk] = useState(3)
  const [logic, setLogic] = useState(3)
  const [pace, setPace] = useState(3)
  const [distance, setDistance] = useState(3)
  const [loading, setLoading] = useState(false)

  const [resultType, setResultType] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/login")
        return
      }
      
      // サーバーへ数値を送信
      const res = await fetch(`${API_URL}/api/diagnosis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          style,
          talk,
          logic,
          pace,
          distance
        })
      })

      if (!res.ok) {
        alert("保存失敗")
        return
      }

      // サーバー側で判定されたタイプを受け取る
      const json = await res.json()
      const type = json.user_type || json.data?.user_type
      
    if (type) {
      // クエリパラメータとしてタイプを渡して遷移
      router.push(`/diagnosis/result?type=${encodeURIComponent(type)}`)
    }

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
        TreNaviタイプ診断
      </Typography>

      <Typography variant="h6" mb={3}>
        理想のトレーナータイプを診断しよう
      </Typography>

      <Stack spacing={4}>
        <ReviewSlider
          label="理想の指導スタイルは？"
          left="優しい"
          right="厳しい"
          value={style}
          onChange={setStyle}
          marks={marks}
        />

        <ReviewSlider
          label="理想の会話量は？"
          left="少ない"
          right="多い"
          value={talk}
          onChange={setTalk}
          marks={marks}
        />

        <ReviewSlider
          label="理想の指導方法は？"
          left="感覚的"
          right="論理的"
          value={logic}
          onChange={setLogic}
          marks={marks}
        />

        <ReviewSlider
          label="理想のトレーニングペースは？"
          left="ゆっくり"
          right="ハード"
          value={pace}
          onChange={setPace}
          marks={marks}
        />

        <ReviewSlider
          label="理想のトレーナーの距離感は？"
          left="フレンドリー"
          right="プロっぽい"
          value={distance}
          onChange={setDistance}
          marks={marks}
        />

        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "送信中..." : "診断する"}
        </Button>
      </Stack>
    </Box>
  )
}