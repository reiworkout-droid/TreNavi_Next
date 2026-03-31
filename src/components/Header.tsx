"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, refreshUser } = useAuth();

  const isTrainer = !!user?.trainer?.id;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleRegisterTrainer = async () => {
    router.push("/register_trainer");
    await refreshUser();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0} /* MUI: フラットにして柔らかい印象に */
      sx={{
        /* MUI sx: 安心感のあるセージグリーン背景 + 下線で軽やかに */
        backgroundColor: "#5a9e7c",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          /* MUI sx: 左右の余白を増やして読みやすく */
          px: { xs: 2, sm: 3 },
          minHeight: { xs: 56 },
        }}
      >
        {/* ロゴ — MUI sx: フォントサイズ・letter-spacingで洗練された印象に */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.04em",
            fontSize: "1.25rem",
            fontFamily: "'Outfit', 'Noto Sans JP', sans-serif",
          }}
          onClick={() => router.push("/home")}
        >
          TreNavi
        </Typography>

        {/* 右側 — MUI sx: gap を広げてボタン同士の窮屈さを解消 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* 通知アイコン — MUI sx: ホバー時に柔らかいハイライト */}
          <IconButton
            color="inherit"
            sx={{
              transition: "background-color 0.2s",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
            }}
          >
            <NotificationsIcon sx={{ fontSize: 22 }} />
          </IconButton>

          {/* トレーナー登録 — MUI sx: 白枠ボタンでCTAとして目立たせる */}
          {user && !isTrainer && (
            <Button
              color="inherit"
              size="small"
              onClick={handleRegisterTrainer}
              sx={{
                borderRadius: "999px",
                border: "1.5px solid rgba(255,255,255,0.7)",
                px: 2,
                fontSize: "0.75rem",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderColor: "#fff",
                },
              }}
            >
              登録
            </Button>
          )}

          {/* トレーナー切替 */}
          {isTrainer && (
            <>
              <Button
                color="inherit"
                size="small"
                startIcon={<HomeIcon sx={{ fontSize: 18 }} />}
                onClick={() => router.push("/trainer/home")}
                sx={{
                  borderRadius: "999px",
                  px: 1.5,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                }}
              >
                Trainer
              </Button>

              {pathname?.startsWith("/trainer/home") && (
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<PeopleIcon sx={{ fontSize: 18 }} />}
                  onClick={() => router.push("/home")}
                  sx={{
                    borderRadius: "999px",
                    px: 1.5,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                  }}
                >
                  Client
                </Button>
              )}
            </>
          )}

          {/* ログイン/ログアウト — MUI sx: ログインは白背景で最も目立つCTAに */}
          {user ? (
            <Button
              color="inherit"
              size="small"
              onClick={handleLogout}
              sx={{
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 500,
                opacity: 0.85,
                "&:hover": {
                  opacity: 1,
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              color="inherit"
              size="small"
              onClick={() => router.push("/login")}
              sx={{
                /* MUI sx: 白背景+グリーン文字で最重要CTAを強調 */
                borderRadius: "999px",
                backgroundColor: "#fff",
                color: "#5a9e7c",
                px: 2.5,
                fontSize: "0.8rem",
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": {
                  backgroundColor: "#f0faf4",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
