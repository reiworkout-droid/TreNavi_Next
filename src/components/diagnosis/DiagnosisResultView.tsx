import { Box, Typography, Card, CardContent } from "@mui/material"

// 他の場所でもタイプ判定を使う可能性があれば export しておくと便利です
export const getDescription = (type: string | null) => {
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

type DiagnosisResultViewProps = {
  type: string
  children?: React.ReactNode // ボタンなどのアクションを外から注入する
}

export default function DiagnosisResultView({ type, children }: DiagnosisResultViewProps) {
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

      {/* ボタンなどがあれば表示 */}
      {children && <Box mt={4}>{children}</Box>}
    </Box>
  )
}