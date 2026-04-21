"use client";

import {
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function BottomNav() {

  const router = useRouter();
  const pathname = usePathname();

  const [value,setValue] = useState(0);

  const isTrainerPage = pathname.startsWith("/trainer");

  useEffect(() => {
    if(pathname.startsWith("/home") || pathname.startsWith("/trainer/home")) setValue(0);
    else if(pathname.startsWith("/trainers")) setValue(1);
    else if(pathname.startsWith("/reservation") || pathname.startsWith("/trainer/reservations")) setValue(2);
    else if(pathname.startsWith("/profile") || pathname.startsWith("/trainer/profile")) setValue(3);
  },[pathname]);

  const goHome = () => {
    if (isTrainerPage) {
      router.push("/trainer/home");
    } else {
      router.push("/home");
    }
  };

  const goReservation = () => {
    if (isTrainerPage) {
      router.push("/trainer/reservations");
    } else {
      router.push("/reservation");
    }
  };

  const goProfile = () => {
    if (isTrainerPage) {
      router.push("/trainer/profile");
    } else {
      router.push("/profile");
    }
  };

  return (

    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        /* MUI sx: 影を上方向に柔らかく → 浮いている感を軽減し安心感 */
        boxShadow: "0 -2px 12px -2px rgba(0,0,0,0.08)",
        /* MUI sx: 上部に薄いボーダーで境界を明確に */
        borderTop: "1px solid #f0f0f0",
      }}
      elevation={0} /* MUI: デフォルト影を消してカスタム影のみ使用 */
    >

      <BottomNavigation
        showLabels
        value={value}
        sx={{
          /* MUI sx: 高さを少し広げてタップしやすく（初心者配慮） */
          height: 64,
          /* MUI sx: 背景を温かみのあるオフホワイトに */
          backgroundColor: "#fdfcfa",
          /* MUI sx: 選択中のアイテムの色をセージグリーンに統一 */
          "& .Mui-selected": {
            color: "#5a9e7c !important",
          },
          /* MUI sx: 非選択アイテムを控えめグレーに */
          "& .MuiBottomNavigationAction-root": {
            color: "#9ca3af",
            minWidth: "auto",
            padding: "8px 0",
            transition: "color 0.2s ease",
            /* MUI sx: ラベルのフォントを統一 */
            "& .MuiBottomNavigationAction-label": {
              fontFamily: "'Outfit', 'Noto Sans JP', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 500,
              marginTop: "2px",
              "&.Mui-selected": {
                fontSize: "0.7rem",
                fontWeight: 700,
              },
            },
            /* MUI sx: アイコンサイズを少し大きくして視認性UP */
            "& .MuiSvgIcon-root": {
              fontSize: "1.4rem",
            },
          },
        }}
      >

        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          onClick={goHome}
        />

        <BottomNavigationAction
          label="Search"
          icon={<SearchIcon />}
          onClick={()=>router.push("/trainers")}
        />

        <BottomNavigationAction
          label="予約"
          icon={<EventIcon />}
          onClick={goReservation}
        />

        <BottomNavigationAction
          label="Profile"
          icon={<PersonIcon />}
          onClick={goProfile}
        />

      </BottomNavigation>

    </Paper>
  );
}
