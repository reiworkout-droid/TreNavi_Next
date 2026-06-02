"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Box, Typography, Button, Stack } from "@mui/material"
import { diagnosisMap } from "@/lib/diagnosis"
import DiagnosisResultView from "@/components/diagnosis/DiagnosisResultView"

function ResultContent() {
  // 画面遷移用
  const router = useRouter()
  const searchParams = useSearchParams()

  // URLパラメータ（?type=xxx）から診断タイプを取得
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

  // 診断データを取得（画像やタイトルなどが入っています）
  const data = diagnosisMap[type]

  return (
    // 共通化された DiagnosisResultView を使用して、診断結果を表示
    <DiagnosisResultView type={data.title}>
      {/* 診断データに画像がある場合は、綺麗にここに差し込む */}
      {data.image && (
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
      )}

      {/* もし DiagnosisResultView の中で data.description を表示させたい場合は、
          ここに配置するか、あるいは DiagnosisResultView 側で表示するように調整します。
          今回は main ブランチの「説明文」を children としてそのまま差し込む形にしています。 */}
      <Typography color="text.secondary" mb={4}>
        {data.description}
      </Typography>

      {/* クライアント側専用のボタン群 */}
      <Stack spacing={2}>
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
    </DiagnosisResultView>
  )
}

export default function DiagnosisResultPage() {
  return (
    <Suspense fallback={<Typography p={4}>Loading...</Typography>}>
      <ResultContent />
    </Suspense>
  )
}