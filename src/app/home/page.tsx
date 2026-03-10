"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function HomePage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },   // スマホ:16px PC:32px
        maxWidth: "1000px",
        mx: "auto"
      }}
    >
      <Typography variant="h4" mb={4}>
        TreNavi Dashboard
      </Typography>

      <Grid container spacing={3}>

        {/* 検索 */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                トレーナーを探す
              </Typography>

              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => router.push("/search")}
              >
                検索する
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* 次の予約 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                次の予約
              </Typography>

              <Typography mt={2}>
                予約はありません
              </Typography>

              <Button
                sx={{ mt: 2 }}
                onClick={() => router.push("/reservations")}
              >
                予約一覧
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* 体重 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                体重記録
              </Typography>

              <Typography mt={2}>
                最新体重: -- kg
              </Typography>

              <Button
                sx={{ mt: 2 }}
                onClick={() => router.push("/weight")}
              >
                体重管理
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* メニュー */}
        <Grid size={12}>
          <Card>
            <CardContent>

              <Typography variant="h6" mb={2}>
                メニュー
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Button fullWidth onClick={() => router.push("/search")}>
                    検索
                  </Button>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <Button fullWidth onClick={() => router.push("/reservations")}>
                    予約
                  </Button>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <Button fullWidth onClick={() => router.push("/weight")}>
                    体重
                  </Button>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <Button fullWidth onClick={() => router.push("/profile")}>
                    プロフィール
                  </Button>
                </Grid>
              </Grid>

            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}