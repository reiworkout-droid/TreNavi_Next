"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Trainer, ReviewSummary } from "@/types";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button
} from "@mui/material";
import { useRouter } from "next/navigation";
import TrainerLikeButton from "@/components/TrainerLikeButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TrainerDetailPage() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const id = parseInt(params.id, 10);

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);

  // 🔑 共通fetch
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

    if (!res.ok) throw new Error("API error");

    return res.json();
  };

  // ----------------------
  // トレーナー取得
  // ----------------------
  useEffect(() => {
    if (!id) return;

    const fetchTrainer = async () => {
      try {
        const data = await fetchWithAuth(`${API_URL}/api/trainers/${id}`);
        setTrainer(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id]);

  // ----------------------
  // レビュー集計取得
  // ----------------------
  useEffect(() => {
    if (!id) return;

    const fetchSummary = async () => {
      try {
        // ここは公開APIならトークン不要でもOK
        const res = await fetch(`${API_URL}/api/reviews/summary/${id}`);
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSummary();
  }, [id]);

  // ----------------------
  // render
  // ----------------------

  if (loading) return <div>Loading...</div>;
  if (!trainer) return <div>Trainer not found</div>;

  return (
    <Box sx={{ p: 4 }}>
      <Card sx={{ mb: 4 }}>
        {trainer.profile_image && (
          <Box
            component="img"
            src={`${API_URL}/storage/${trainer.profile_image}`}
            alt={trainer.user.name}
            sx={{
              width: "100%",
              height: 300,
              objectFit: "cover",
            }}
          />
        )}

        <CardContent>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {trainer.user.name}
          </Typography>

          <Typography sx={{ fontSize: 14, color: "gray", mb: 1 }}>
            {trainer.areas.map((a) => a.name).join(" / ")}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            カテゴリー: {trainer.categories.map((c) => c.name).join(", ")}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            専門: {trainer.specialities.map((s) => s.name).join(", ")}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            実績: {trainer.record}
          </Typography>

          {/* いいね */}
          <TrainerLikeButton trainerId={trainer.id} />

          {/* 口コミ */}
          {summary && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" mb={1}>
                口コミ平均
              </Typography>

              <Typography>指導スタイル: {summary.style ?? "-"}</Typography>
              <Typography>会話量: {summary.talk ?? "-"}</Typography>
              <Typography>論理性: {summary.logic ?? "-"}</Typography>
              <Typography>ペース: {summary.pace ?? "-"}</Typography>
              <Typography>距離感: {summary.distance ?? "-"}</Typography>
            </Box>
          )}

          {/* プラン */}
          <Typography sx={{ mt: 3, fontWeight: "bold" }}>
            プラン一覧
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            {trainer.plans.map((plan) => (
              <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{plan.name}</Typography>
                    <Typography>⏱ {plan.duration_minutes}分</Typography>
                    <Typography sx={{ fontWeight: "bold", mt: 1 }}>
                      💰 {plan.price}円
                    </Typography>

                    <Button
                      variant="contained"
                      onClick={() =>
                        router.push(
                          `/reservation/create?plan_id=${plan.id}&name=${plan.name}&price=${plan.price}&duration=${plan.duration_minutes}`
                        )
                      }
                    >
                      予約する
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography sx={{ mt: 3 }}>{trainer.bio}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}