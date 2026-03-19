"use client";

import { useState, useEffect } from "react";
import { IconButton, Typography, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Trainer } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  trainerId: number;
  initialLiked?: boolean;
  initialCount?: number;
}

export default function TrainerLikeButton({ trainerId }: Props) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 初期状態取得
  const fetchLikedStatus = async () => {
    try {
      await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        credentials: "include",
      });

      const res = await fetch(`${API_URL}/api/trainers/liked`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("liked取得失敗");

      const data: Trainer[] = await res.json();

      // 👍 いいね状態
      const isLiked = data.some((tr) => tr.id === trainerId);
      setLiked(isLiked);

      // 👍 件数（簡易版：length）
      setCount(data.length);

    } catch (err) {
      console.error("初期いいね取得失敗", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedStatus();
  }, [trainerId]);

  // トグル
  const toggleLike = async () => {
    setLoading(true);

    try {
      await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        credentials: "include",
      });

      const xsrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1] ?? "";

      const method = liked ? "DELETE" : "POST";

      const res = await fetch(
        `${API_URL}/api/trainers/${trainerId}/like`,
        {
          method,
          credentials: "include",
          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("いいね操作失敗");

      // UI即更新
      setLiked(!liked);
      setCount((prev) => (liked ? prev - 1 : prev + 1));

    } catch (err) {
      console.error(err);
      alert("操作に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" alignItems="center">

      <IconButton onClick={toggleLike} disabled={loading}>
        {liked ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>

      <Typography>{count}</Typography>

    </Box>
  );
}