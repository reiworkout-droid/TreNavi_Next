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
  const [history, setHistory] = useState<Reservation[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    const fetchReservations = async()=>{

      const [res1, res2] = await Promise.all([
        fetch(`${API_URL}/api/reservations`, { credentials:"include" }),
        fetch(`${API_URL}/api/reservations/past`, { credentials:"include" })
      ])

      const data1: Reservation[] = await res1.json()
      const data2: Reservation[] = await res2.json()

      setReservations(data1)
      setHistory(data2)
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
                ステータス: {r.status === "pending" ? "未承認" : r.status === "confirmed" ? "承認済み" : "却下"}
              </Typography>

            </CardContent>
          </Card>
        ))}
      </Stack>
      
      {/* 予約履歴 */}
      <Typography variant="h5" mt={6} mb={3}>
        予約履歴
      </Typography>

      <Stack spacing={2}>
        {history.map((r)=>(
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
                ステータス: {
                  r.status === "pending" ? "未承認" :
                  r.status === "confirmed" ? "承認済み" :
                  r.status === "canceled" ? "キャンセル" : "却下"
                }
              </Typography>

            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}