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

  // =============================
  // 現在位置判定
  // =============================
  useEffect(() => {

    if(pathname.startsWith("/home") || pathname.startsWith("/trainer/home")) setValue(0);
    else if(pathname.startsWith("/trainers")) setValue(1);
    else if(pathname.startsWith("/reservation") || pathname.startsWith("/trainer/reservations")) setValue(2);
    else if(pathname.startsWith("/profile") || pathname.startsWith("/trainer/profile")) setValue(3);

  },[pathname]);

  // =============================
  // Home遷移
  // =============================
  const goHome = () => {
    if (isTrainerPage) {
      router.push("/trainer/home");
    } else {
      router.push("/home");
    }
  };

  // =============================
  // 予約遷移
  // =============================
  const goReservation = () => {
    if (isTrainerPage) {
      router.push("/trainer/reservations");
    } else {
      router.push("/reservation");
    }
  };

  // =============================
  // プロフィール遷移
  // =============================
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
        right: 0
      }}
      elevation={3}
    >

      <BottomNavigation showLabels value={value}>

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