"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    // 固定ヘッダー
    <AppBar position="fixed">
        {/* ヘッダー内容 */}
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* 文字 */}
        <Typography
          variant="h6"
          sx={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => router.push("/home")}
        >
          TreNavi
        </Typography>
        
        {/* ナビゲーションボタン */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" onClick={() => router.push("/search")}>
            お気に入り
          </Button>

          <Button color="inherit" onClick={() => router.push("/search")}>
            検索
          </Button>

          <Button color="inherit" onClick={() => router.push("/reservations")}>
            予約
          </Button>

          <Button color="inherit" onClick={() => router.push("/profile")}>
            プロフィール
          </Button>
        </Box>

      </Toolbar>
    </AppBar>
  );
}