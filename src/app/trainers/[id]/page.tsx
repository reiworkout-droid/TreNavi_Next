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
import TrainerLikeButton from "@/components/trainer/TrainerLikeButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TrainerDetailPage() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const id = parseInt(params.id, 10);

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);

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

  useEffect(() => {
    if (!id) return;
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reviews/summary/${id}`);
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSummary();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!trainer) return <p>Trainer not found</p>;

  return (
    <Box className="max-w-2xl mx-auto px-4 py-8">
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {trainer.profile_image && (
          <Box
            component="img"
            src={`${API_URL}/storage/${trainer.profile_image}`}
            sx={{ width: "100%", height: 280, objectFit: "cover" }}
          />
        )}

        <CardContent sx={{ px: 3, py: 3.5 }}>
          {/* MUI: 名前を大きく太く / Tailwind: 下余白 */}
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, fontSize: "1.4rem", color: "text.primary" }}
            className="mb-1"
          >
            {trainer.user.name}
          </Typography>

          {/* MUI: エリアを控えめに */}
          <Typography
            sx={{ fontSize: "0.9rem", color: "text.secondary" }}
            className="mb-0.5"
          >
            {trainer.areas.map((a) => a.name).join(" / ")}
          </Typography>

          <Typography
            sx={{ fontSize: "0.9rem", color: "text.secondary" }}
            className="mb-0.5"
          >
            カテゴリー: {trainer.categories.map((c) => c.name).join(", ")}
          </Typography>

          <Typography
            sx={{ fontSize: "0.9rem", color: "text.secondary", fontWeight: 500 }}
            className="mb-0.5"
          >
            専門: {trainer.specialities.map((s) => s.name).join(", ")}
          </Typography>

          <Typography
            sx={{ fontSize: "0.9rem", color: "text.secondary" }}
            className="mb-3"
          >
            実績: {trainer.record}
          </Typography>

          {/* Tailwind: いいねボタン周りの余白 */}
          <Box className="mb-4">
            <TrainerLikeButton trainerId={trainer.id} />
          </Box>

          {/* 口コミセクション */}
          {summary && (
            <Box
              sx={{
                bgcolor: "grey.50",
                borderRadius: 3,
                px: 2.5,
                py: 2,
              }}
              className="mb-5"
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, fontSize: "1rem", color: "text.primary" }}
                className="mb-2"
              >
                口コミ評価
              </Typography>

              {/* ⭐表示関数 */}
              {(() => {
                const renderStars = (value: number | null) => {
                  if (!value) return "ー";
                  const rounded = Math.round(value);
                  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
                };

                const items = [
                  { label: "指導スタイル", value: summary.style },
                  { label: "会話の多さ", value: summary.talk },
                  { label: "指導の論理性", value: summary.logic },
                  { label: "トレーニングペース", value: summary.pace },
                  { label: "距離感", value: summary.distance },
                ];

                return (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {items.map((item) => (
                      <Box
                        key={item.label}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "0.85rem", color: "text.secondary" }}
                        >
                          {item.label}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            color: "#f59e0b", // ゴールドっぽい色
                          }}
                        >
                          {renderStars(item.value)}{" "}
                          <span style={{ color: "#666", fontWeight: 400 }}>
                            {item.value ?? "-"}
                          </span>
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                );
              })()}
            </Box>
          )}
          {/* プラン一覧 */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, fontSize: "1.1rem", color: "text.primary" }}
            className="mb-3"
          >
            プラン一覧
          </Typography>

              <Grid container spacing={2}>
                {trainer.plans.map((plan) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={plan.id}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          border: "1px solid",
                          borderColor: "grey.200",
                          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                          transition: "box-shadow 0.2s ease",
                          "&:hover": {
                            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                          },
                        }}
                      >
                  <CardContent sx={{ px: 2.5, py: 2 }}>
                    <Typography
                      sx={{ fontWeight: 700, fontSize: "1rem", color: "text.primary" }}
                      className="mb-1"
                    >
                      {plan.name}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.85rem", color: "text.secondary" }}
                      className="mb-0.5"
                    >
                      ⏱ {plan.duration_minutes}分
                    </Typography>
                    <Typography
                      sx={{ fontWeight: 700, fontSize: "1.1rem", color: "text.primary" }}
                      className="mb-2"
                    >
                      💰 {plan.price}円
                    </Typography>

                    {/* MUI: CTAボタンを目立たせる */}
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        borderRadius: 2.5,
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        py: 1.2,
                        textTransform: "none",
                        boxShadow: "0 2px 8px rgba(25,118,210,0.3)",
                        "&:hover": {
                          boxShadow: "0 4px 16px rgba(25,118,210,0.4)",
                        },
                      }}
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

          {/* MUI: 自己紹介文 */}
          <Typography
            sx={{
              fontSize: "0.92rem",
              color: "text.secondary",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
            }}
            className="mt-2"
          >
            {trainer.bio}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
