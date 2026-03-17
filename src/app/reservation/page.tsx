"use client"

import { useEffect, useState } from "react"
import { Reservation } from "@/types"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack
} from "@mui/material"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ReservationsPage(){

  const [reservations,setReservations] = useState<Reservation[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    const fetchReservations = async()=>{

      const res = await fetch(`${API_URL}/api/reservations`,{
        credentials:"include"
      })

      const data: Reservation[] = await res.json()

      setReservations(data)
      setLoading(false)
    }

    fetchReservations()

  },[])

  if(loading) return <Typography p={4}>Loading...</Typography>

  return(
    <Box sx={{p:4,maxWidth:600,mx:"auto"}}>

      <Typography variant="h5" mb={3}>
        予約一覧
      </Typography>

      <Stack spacing={2}>
        {/* 予約のレコードを１件ずつ取り出す */}
        {reservations.map((r)=>(
          <Card key={r.id}>
            <CardContent>

              <Typography fontWeight="bold">
                {r.plan.name}
              </Typography>

            <Typography>
                👤 {r.trainer.user.name}
            </Typography>

              <Typography>
                🗓 {new Date(r.reserver_at).toLocaleString()}
              </Typography>

              <Typography>
                💰 ¥{r.price_snapshot}
              </Typography>

              <Typography>
                ステータス: {r.status}
              </Typography>

            </CardContent>
          </Card>
        ))}
      </Stack>

    </Box>
  )
}