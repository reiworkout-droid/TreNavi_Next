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
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {

  const router = useRouter();
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

          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={() => router.push("/login")}>
              Login
            </Button>
          )}

        </Box>

      </Toolbar>
    </AppBar>
  );
}