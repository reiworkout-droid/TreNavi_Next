"use client"

import { useEffect, useState } from "react";
import { Trainer } from "@/types";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack
} from "@mui/material";
import TrainerLikeButton from "@/components/TrainerLikeButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LikePage() {
  const router = useRouter();
  
  const [likes, setLikes] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔑 共通
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      throw new Error("No token");
    }
    return token;
  };

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const token = getToken();

        const res = await fetch(`${API_URL}/api/trainers/liked`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 401) router.push("/login");
          throw new Error("取得失敗");
        }

        const json = await res.json();

        // 配列保証
        const data: Trainer[] = Array.isArray(json) ? json : [];
        setLikes(data);

      } catch (err) {
        console.error("いいね一覧取得失敗", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, []);

  if (loading) return <Typography p={4}>Loading...</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" mb={3}>
        いいね一覧
      </Typography>

      <Stack spacing={2}>
        {likes.map((trainer) => (
          <Card key={trainer.id}>
            <CardContent>

              <Typography
                variant="h6"
                sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                onClick={() => router.push(`/trainers/${trainer.id}`)}
              >
                👤 {trainer.user?.name ?? "不明"}
              </Typography>

              <Typography>📝 {trainer.record ?? "未設定"}</Typography>
              <Typography>💰 最安 ¥{trainer.plans?.[0]?.price ?? "なし"}</Typography>

              <TrainerLikeButton trainerId={trainer.id} />

            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}