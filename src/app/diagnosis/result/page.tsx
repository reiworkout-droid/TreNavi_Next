"use client"

import { useSearchParams, useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack
} from "@mui/material"
import { useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function DiagnosisResultPage() {
  const router = useRouter()

  const [type, setType] = useState<string | null>(null)

  useEffect(() => {
  const fetchUserType = async () => {
    const res = await fetch(`${API_URL}/api/user`, { credentials: "include" })
    const data = await res.json()
    setType(data.user_type || null)
  }
  fetchUserType()
  }, [])

  // タイプ説明
  const getDescription = (type: string | null) => {
    switch (type) {
      case "ストイック型":
        return "目標達成に向けて厳しく追い込むタイプ。結果重視で効率よく成長したい人向け。"
      case "エンジョイ型":
        return "楽しく継続することを重視。モチベーションを保ちながら運動したい人向け。"
      case "サポート重視型":
        return "優しく支えてくれる環境を好むタイプ。安心感を大事にしたい人向け。"
      case "マイペース型":
        return "自分のリズムで無理なく進めたいタイプ。静かに集中したい人向け。"
      default:
        return "バランスよくトレーニングしたいタイプ。どんなスタイルにも適応可能。"
    }
  }

  if (!type) {
    return <Typography p={4}>タイプが取得できませんでした</Typography>
  }

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h5" mb={3}>
        診断結果
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h4" mb={2}>
            {type}
          </Typography>

          <Typography color="text.secondary">
            {getDescription(type)}
          </Typography>
        </CardContent>
      </Card>

      <Stack spacing={2} mt={4}>
        <Button
          variant="contained"
          onClick={() => router.push("/search")}
        >
          トレーナーを探す
        </Button>

        <Button
          variant="outlined"
          onClick={() => router.push("/diagnosis")}
        >
          もう一度診断する
        </Button>
      </Stack>
    </Box>
  )
}