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
import { useAuth } from "@/context/AuthContext";

export default function BottomNav() {

  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [value,setValue] = useState(0);

  const isTrainer = !!user?.trainer?.id;

  // =============================
  // 現在位置判定
  // =============================
  useEffect(() => {

    if(pathname.startsWith("/home")) setValue(0);
    else if(pathname.startsWith("/trainers")) setValue(1);
    else if(pathname.startsWith("/reservations")) setValue(2);
    else if(pathname.startsWith("/trainer") || pathname.startsWith("/profile")) setValue(3);

  },[pathname]);

  // =============================
  // プロフィール遷移先
  // =============================
  const goProfile = () => {
      router.push("/profile");
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

      <BottomNavigation
        showLabels
        value={value}
      >

        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          onClick={()=>router.push("/home")}
        />

        <BottomNavigationAction
          label="Search"
          icon={<SearchIcon />}
          onClick={()=>router.push("/trainers")}
        />

        <BottomNavigationAction
          label="予約"
          icon={<EventIcon />}
          onClick={()=>router.push("/reservations")}
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