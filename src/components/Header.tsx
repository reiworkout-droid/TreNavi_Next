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

  // ログアウト処理
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // トレーナー登録後に即UIを更新
  const handleRegisterTrainer = async () => {
    router.push("/register_trainer");
    await refreshUser(); // AuthContext からユーザーを再取得
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

          {/* トレーナー登録 */}
          {user && !isTrainer && (
            <Button
              color="inherit"
              size="small"
              onClick={handleRegisterTrainer}
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
                startIcon={<HomeIcon />}
                onClick={() => router.push("/trainer/home")}
              >
                Trainer
              </Button>

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
            <Button
              color="inherit"
              size="small"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}