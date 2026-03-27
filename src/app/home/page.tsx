"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button
} from "@mui/material";
import { Reservation } from "@/types";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const router = useRouter();

  const [nextReservation, setNextReservation] = useState<Reservation | null>(null);
  const [diagnosisDone, setDiagnosisDone] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  // 🔑 共通fetch（トークン付き）
  const fetchWithAuth = async (url: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      throw new Error("No token");
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return res.json();
  };

  useEffect(() => {
    const init = async () => {
      try {
        // 次の予約
        const reservation = await fetchWithAuth(`${API_URL}/api/reservations/next`);
        setNextReservation(reservation);

        // ユーザー情報
        const user = await fetchWithAuth(`${API_URL}/api/user`);

        setDiagnosisDone(!!user.user_type);
        setUserType(user.user_type);

      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, []);

  const handleDiagnosisClick = () => {
    if (diagnosisDone && userType) {
      router.push(`/diagnosis/result?type=${userType}`);
    } else {
      router.push("/diagnosis");
    }
  };

  return (
    <Box sx={{ p: 3 }}>

      <Typography variant="h5" mb={3}>
        ダッシュボード
      </Typography>

      {/* トレーナー検索 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">
            トレーナーを探す
          </Typography>

          <Typography sx={{ mt: 1 }}>
            あなたに合うトレーナーを見つけましょう
          </Typography>

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => router.push("/trainers")}
          >
            検索する
          </Button>
        </CardContent>
      </Card>

      {/* 次の予約 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">
            次の予約
          </Typography>

          {nextReservation?.plan ? (
            <>
              <Typography fontWeight="bold">
                {nextReservation.plan.name}
              </Typography>

              <Typography>
                👤 {nextReservation.trainer.user.name}
              </Typography>

              <Typography>
                🗓 {new Date(nextReservation.reserver_at).toLocaleString()}
              </Typography>
            </>
          ) : (
            <Typography color="text.secondary">
              予約はありません
            </Typography>
          )}

          <Button
            sx={{ mt: 2 }}
            onClick={() => router.push("/reservation")}
          >
            予約一覧
          </Button>
        </CardContent>
      </Card>

      {/* いいね一覧 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">
            いいね一覧
          </Typography>

          <Button
            sx={{ mt: 2 }}
            onClick={() => router.push("/like")}
          >
            いいね一覧
          </Button>
        </CardContent>
      </Card>

      {/* 診断 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">
            TreNavi診断
          </Typography>

          <Typography sx={{ mt: 1 }}>
            理想のトレーナータイプを診断しましょう
          </Typography>

          <Button sx={{ mt: 2 }} onClick={handleDiagnosisClick}>
            診断する
          </Button>
        </CardContent>
      </Card>

    </Box>
  );
}