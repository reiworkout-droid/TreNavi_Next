"use client"

import { useEffect, useState } from "react";
import { Trainer } from "@/types"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack
} from "@mui/material"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function LikePage() {

  const router = useRouter()
  
  const [likes, setLikes] = useState<Trainer[]>([]);
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    const fetchLikes = async() => {

      const res = await fetch(`${API_URL}/api/trainers/liked`, {
        credentials:"include"   
      })

      const data: Trainer[] = await res.json()

      setLikes(data)
      setLoading(false)
    }
    fetchLikes()

  }, [])

  if(loading) return <Typography p={4}>Loading...</Typography> 
  
  return (
    <>
    <Box sx={{p:4,maxWidth:600,mx:"auto"}}>

      <Typography variant="h5" mb={3}>
        いいね一覧
      </Typography>

      <Stack spacing={2}>
        {/* いいねのレコードを１件ずつ取り出す */}
        {likes.map((trainer) => (
          <Card key={trainer.id}>
            <CardContent>
              <Typography variant="h6"
                  sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                  onClick={() => router.push(`/trainers/${trainer.id}`)}>
                👤 {trainer.user?.name}
              </Typography>

              <Typography>
                📝 {trainer.record}
              </Typography>

              <Typography>
                💰 最安 ¥{trainer.plans?.[0]?.price ?? "なし"}
              </Typography>

              <Typography>
                ❤️ {trainer.likes_count ?? 0}
              </Typography>

            </CardContent>
          </Card>
        ))}
      </Stack>

    </Box>
    
    </>
  );
}