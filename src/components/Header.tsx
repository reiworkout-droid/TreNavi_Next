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
  const onTrainerHome = pathname?.startsWith("/trainer/home");

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <AppBar position="fixed" color="primary" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        {/* ロゴ */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={() => router.push("/home")}
        >
          TreNavi
        </Typography>

        {/* 右側 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>

          {/* トレーナー関連のボタン */}
          {user && (!user.trainer || Object.keys(user.trainer).length === 0) && (
            <Button
              color="inherit"
              size="small"
              onClick={() => router.push("/register_trainer")}
            >
              登録
            </Button>
          )}
          
          {user?.trainer && (
            <>
              <Button
                color="inherit"
                size="small"
                startIcon={<HomeIcon />}
                onClick={() => router.push("/trainer/home")}
              >
                Trainer
              </Button>

              {/* トレーナーホームにいる場合のみ表示 */}
              {pathname?.startsWith("/trainer/home") && (
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<PeopleIcon />}
                  onClick={() => router.push("/home")}
                >
                  Client
                </Button>
              )}
            </>
          )}

          {/* ログイン/ログアウト */}
          {user ? (
            <Button color="inherit" size="small" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" size="small" onClick={() => router.push("/login")}>
              Login
            </Button>
          )}

        </Box>

      </Toolbar>
    </AppBar>
  );
}