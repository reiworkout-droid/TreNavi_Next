"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Reservation } from "@/types"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button
} from "@mui/material"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ReservationsPage(){

  const router = useRouter()

  const [reservations,setReservations] = useState<Reservation[]>([])
  const [history, setHistory] = useState<Reservation[]>([])
  const [loading,setLoading] = useState(true)

  // 🔑 共通fetch
  const fetchWithAuth = async (url: string) => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      throw new Error("No token")
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) throw new Error("API error")

    return res.json()
  }

  useEffect(()=>{

    const fetchReservations = async()=>{
      try {
        const [data1, data2] = await Promise.all([
          fetchWithAuth(`${API_URL}/api/reservations`),
          fetchWithAuth(`${API_URL}/api/reservations/past`)
        ])

        setReservations(data1)
        setHistory(data2)

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
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
                ステータス: {
                  r.status === "pending" ? "未承認" :
                  r.status === "confirmed" ? "承認済み" :
                  "却下"
                }
              </Typography>

            </CardContent>
          </Card>
        ))}
      </Stack>
      
      {/* 履歴 */}
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
                  r.status === "canceled" ? "キャンセル" :
                  "却下"
                }
              </Typography>

              {/* レビュー分岐 */}
              {r.review ? (
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => router.push(`/reservation/reviews/${r.review?.id}`)}
                >
                  投稿を見る
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() =>
                    router.push(`/reservation/reviews/create?reservation_id=${r.id}`)
                  }
                >
                  口コミを書く
                </Button>
              )}

            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}