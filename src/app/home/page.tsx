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

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function HomePage() {

  const router = useRouter();

const [nextReservation,setNextReservation] = useState<Reservation | null>(null)

useEffect(()=>{

  const fetchNext = async()=>{

    const res = await fetch(`${API_URL}/api/reservations/next`,{
      credentials:"include"
    })

    const data: Reservation | null = await res.json()
    setNextReservation(data)
  }

  fetchNext()

},[])
  return (

    <Box sx={{ p:3 }}>

      <Typography variant="h5" mb={3}>
        ダッシュボード
      </Typography>

      {/* トレーナー検索 */}

      <Card sx={{ mb:3 }}>
        <CardContent>

          <Typography variant="h6">
            トレーナーを探す
          </Typography>

          <Typography sx={{ mt:1 }}>
            あなたに合うトレーナーを見つけましょう
          </Typography>

          <Button
            variant="contained"
            sx={{ mt:2 }}
            onClick={()=>router.push("/trainers")}
          >
            検索する
          </Button>

        </CardContent>
      </Card>

      {/* 次の予約 */}
        {nextReservation?.plan ? (
          <Card sx={{mb:3}}>
          <CardContent>

            <Typography variant="h6">
              次の予約
            </Typography>

            <Typography fontWeight="bold">
              {nextReservation.plan.name}
            </Typography>

            <Typography>
              👤 {nextReservation.trainer.user.name}
            </Typography>

            <Typography>
              🗓 {new Date(nextReservation.reserver_at).toLocaleString()}
            </Typography>
            <Button
              sx={{ mt:2 }}
              onClick={()=>router.push("/reservation")}
            >
              予約一覧
            </Button>



          </CardContent>
        </Card>
      ) : (
        <Card sx={{mb:3}}>
          <CardContent>

            <Typography variant="h6">
              次の予約
            </Typography>

            <Typography color="text.secondary">
              予約はありません
            </Typography>
            <Button
              sx={{ mt:2 }}
              onClick={()=>router.push("/reservation")}
            >
              予約一覧
            </Button>

          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>

          <Typography variant="h6">
            予約一覧（トレーナー側）
          </Typography>

          <Button
            sx={{ mt:2 }}
            onClick={()=>router.push("/trainer/reservations")}
          >
            予約一覧へ
          </Button>

        </CardContent>
      </Card>



      {/* 体重 */}

      <Card>
        <CardContent>

          <Typography variant="h6">
            体重記録
          </Typography>

          <Typography sx={{ mt:1 }}>
            最新体重: -- kg
          </Typography>

          <Button
            sx={{ mt:2 }}
            onClick={()=>router.push("/weight")}
          >
            体重管理
          </Button>

        </CardContent>
      </Card>

    </Box>
  );
}