"use client";

import { useState, useEffect } from "react";
import { IconButton, Typography, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  trainerId: number;
}

export default function TrainerLikeButton({ trainerId }: Props) {

  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔑 共通fetch（改善版）
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      throw new Error("No token");
    }

    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    // 👇 ここ重要
    if (res.status === 401) {
      localStorage.removeItem("token");
      router.push("/login");
      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      const text = await res.text();
      console.error("API error:", text);
      throw new Error("API error");
    }

    return res.json();
  };

  // 初期取得
  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {
        const statusData = await fetchWithAuth(
          `${API_URL}/api/trainers/${trainerId}/like`
        );
        setLiked(statusData.is_liked);

        // 👇 countは公開APIならそのままでOK
        const resCount = await fetch(
          `${API_URL}/api/trainers/${trainerId}/like/count`
        );

        if (!resCount.ok) throw new Error("count取得失敗");

        const countData = await resCount.json();
        setCount(countData.count);

      } catch (err) {
        console.error("初期いいね取得失敗", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedStatus();
  }, [trainerId]);

  // トグル
  const toggleLike = async () => {
    setLoading(true);

    try {
      const method = liked ? "DELETE" : "POST";

      await fetchWithAuth(
        `${API_URL}/api/trainers/${trainerId}/like`,
        { method }
      );

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