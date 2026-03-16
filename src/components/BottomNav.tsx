"use client";

import {
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import PersonIcon from "@mui/icons-material/Person";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function BottomNav() {

  const router = useRouter();
  const pathname = usePathname();

  const [value,setValue] = useState(0);

  useEffect(() => {

    if(pathname.startsWith("/home")) setValue(0);
    else if(pathname.startsWith("/trainers")) setValue(1);
    else if(pathname.startsWith("/reservations")) setValue(2);
    else if(pathname.startsWith("/weight")) setValue(3);
    else if(pathname.startsWith("/trainer")) setValue(4);

  },[pathname]);

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
          label="体重"
          icon={<MonitorWeightIcon />}
          onClick={()=>router.push("/weight")}
        />

        <BottomNavigationAction
          label="Profile"
          icon={<PersonIcon />}
          onClick={()=>router.push("/trainer/profile")}
        />

      </BottomNavigation>

    </Paper>
  );
}