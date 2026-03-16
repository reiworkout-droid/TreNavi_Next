"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button
} from "@mui/material";

export default function HomePage() {

  const router = useRouter();

  return (

    <Box sx={{ p:3 }}>

      <Typography variant="h5" mb={3}>
        ダッシュボード
      </Typography>

      {/* トレーナー検索 */}

      <Card sx={{ mb:3 }}>
        <CardContent>

          <Typography variant="h6">
            トレーナーを探す
          </Typography>

          <Typography sx={{ mt:1 }}>
            あなたに合うトレーナーを見つけましょう
          </Typography>

          <Button
            variant="contained"
            sx={{ mt:2 }}
            onClick={()=>router.push("/trainers")}
          >
            検索する
          </Button>

        </CardContent>
      </Card>

      {/* 次の予約 */}

      <Card sx={{ mb:3 }}>
        <CardContent>

          <Typography variant="h6">
            次の予約
          </Typography>

          <Typography sx={{ mt:1 }}>
            予約はありません
          </Typography>

          <Button
            sx={{ mt:2 }}
            onClick={()=>router.push("/reservations")}
          >
            予約一覧
          </Button>

        </CardContent>
      </Card>

      {/* 体重 */}

      <Card>
        <CardContent>

          <Typography variant="h6">
            体重記録
          </Typography>

          <Typography sx={{ mt:1 }}>
            最新体重: -- kg
          </Typography>

          <Button
            sx={{ mt:2 }}
            onClick={()=>router.push("/weight")}
          >
            体重管理
          </Button>

        </CardContent>
      </Card>

    </Box>
  );
}