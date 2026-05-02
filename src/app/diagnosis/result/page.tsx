"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack
} from "@mui/material"
import { diagnosisMap } from "@/lib/diagnosis"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function DiagnosisResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const type = searchParams.get("type")

  if (!type || !diagnosisMap[type]) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error" mb={2}>
          診断結果が見つかりませんでした
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          もう一度最初から診断を行ってください。
        </Typography>
        <Button variant="contained" onClick={() => router.push("/diagnosis")}>
          診断ページへ戻る
        </Button>
      </Box>
    )
  }

  const data = diagnosisMap[type]

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h5" mb={3}>
        診断結果
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h5" mb={2}>
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