"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button
} from "@mui/material";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
// const router = useRouter();


type Area = { id: number; name: string };
type Category = { id: number; name: string };
type Speciality = { id: number; name: string };
type Plan = { id: number; title: string; duration: number; price: number };
type Trainer = {
  id: number;
  record: string;
  bio: string;
  profile_image: string | null;
  user: { name: string };
  areas: Area[];
  categories: Category[];
  specialities: Speciality[];
  plans: Plan[];
  likes_count: number;
  is_liked?: boolean;
};

export default function TrainerDetailPage() {
  const params = useParams() as { id: string };
  const id = parseInt(params.id, 10); // URLから取得した文字列を数値に変換

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTrainer = async () => {
      try {
        const res = await fetch(`${API_URL}/api/trainers/${id}`, {
            credentials: "include",
        });
        console.log(`${API_URL}/api/trainers/${id}`)
        const data = await res.json();
        console.log(data);  // <- user があるか確認
        setTrainer(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id]);

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
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
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

          <Typography sx={{ mb: 1 }}>実績: {trainer.record}</Typography>
          <Typography sx={{ mb: 1 }}>いいね: ❤️ {trainer.likes_count}</Typography>
          {trainer.is_liked !== undefined && (
            <Button variant={trainer.is_liked ? "contained" : "outlined"}>
              {trainer.is_liked ? "Liked" : "Like"}
            </Button>
          )}

          <Typography sx={{ mt: 3, fontWeight: "bold" }}>プラン一覧</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {trainer.plans.map((plan) => (
              <Grid size={{xs:12, md:4}} key={plan.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{plan.title}</Typography>
                    <Typography>⏱ {plan.duration}分</Typography>
                    <Typography sx={{ fontWeight: "bold", mt: 1 }}>💰 {plan.price}円</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography sx={{ mt: 3 }}>{trainer.bio}</Typography>
        </CardContent>
      </Card>
    {/* <Button color="inherit" onClick={() => router.push("/search")}>
    戻る
    </Button> */}

    </Box>
  );
}