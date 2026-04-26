"use client"

import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack
} from "@mui/material"
import { useEffect, useState } from "react"
import { diagnosisMap } from "@/lib/diagnosis"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function DiagnosisResultPage() {
  const router = useRouter()

  const [type, setType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          router.push("/login")
          return
        }

        const res = await fetch(`${API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("取得失敗")

        const data = await res.json()
        setType(data.user_type || null)

      } catch (err) {
        console.error(err)
        setType(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserType()
  }, [])

  const data = diagnosisMap[type ?? ""] || diagnosisMap["バランス型"]

  // タイプ説明
  // const getDescription = (type: string | null) => {
  //   switch (type) {
  //     case "ストイック型":
  //       return "目標達成に向けて厳しく追い込むタイプ。結果重視で効率よく成長したい人向け。"
  //     case "エンジョイ型":
  //       return "楽しく継続することを重視。モチベーションを保ちながら運動したい人向け。"
  //     case "サポート重視型":
  //       return "優しく支えてくれる環境を好むタイプ。安心感を大事にしたい人向け。"
  //     case "マイペース型":
  //       return "自分のリズムで無理なく進めたいタイプ。静かに集中したい人向け。"
  //     default:
  //       return "バランスよくトレーニングしたいタイプ。どんなスタイルにも適応可能。"
  //   }
  // }

  if (loading) {
    return <Typography p={4}>Loading...</Typography>
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
          {/* <Typography variant="h4" mb={2}>
            {type}
          </Typography> */}

          {/* <Typography color="text.secondary">
            {getDescription(type)}
          </Typography> */}
          <Typography variant="h4" mb={2}>
            {data.title}
          </Typography>

          <Box
            component="img"
            src={data.image}
            sx={{
              width: "100%",
              height: 220,
              objectFit: "contain",
              mb: 2
            }}
          />

          <Typography color="text.secondary">
            {data.description}
          </Typography>
        </CardContent>
      </Card>

      <Stack spacing={2} mt={4}>
        <Button
          variant="contained"
          onClick={() => router.push("/trainers")}
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