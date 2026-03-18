"use client"

import { Box, Typography, Button, Stack } from "@mui/material"
import { useRouter } from "next/navigation"

export default function TrainerHomePage() {
  const router = useRouter()

  return (
    <Box sx={{p:4, maxWidth:600, mx:"auto"}}>
      <Typography variant="h4" mb={3}>
        トレーナーホーム
      </Typography>

      <Stack spacing={2}>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push("/trainer/reservations")}
        >
          予約一覧を見る
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push("/trainer/plan/create")}
        >
          プラン追加
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push("/trainer/plan/[id]/edit/")}
        >
          プラン変更
        </Button>
      </Stack>
    </Box>
  )
}