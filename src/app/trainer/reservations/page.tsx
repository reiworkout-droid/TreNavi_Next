"use client"

import { useEffect, useState } from "react"
import { Box, Typography, Button, Stack, Card, CardContent } from "@mui/material"
import { TrainerReservation } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL


export default function TrainerReservationsPage() {
  const [reservations, setReservations] = useState<TrainerReservation[]>([])
  const [loading, setLoading] = useState(true)

  // 予約一覧取得
  const fetchReservations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/trainer/reservations`, {
        credentials: "include",
        headers: { Accept: "application/json" }
      })
      if (!res.ok) throw new Error("予約一覧取得失敗")
      const data = await res.json()
      setReservations(data)
    } catch (err) {
      console.error(err)
      alert("予約一覧の取得に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  // ステータス更新
  const updateStatus = async (reservationId: number, status: "confirmed" | "canceled") => {
    try {
      // CSRF取得
      await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: "include" })
      const xsrfToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1] ?? ""

      const res = await fetch(`${API_URL}/api/reservations/${reservationId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
          "Accept": "application/json"
        },
        body: JSON.stringify({ status })
      })

      if (!res.ok) throw new Error("更新失敗")
      const updated = await res.json()
      setReservations(prev =>
        prev.map(r => (r.id === updated.id ? updated : r))
      )
    } catch (err) {
      console.error(err)
      alert("ステータス更新に失敗しました")
    }
  }

  if (loading) return <Typography p={4}>Loading...</Typography>
  if (reservations.length === 0) return <Typography p={4}>予約はありません</Typography>

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" mb={3}>予約一覧</Typography>
      <Stack spacing={2}>
        {reservations.map(reservation => (
          <Card key={reservation.id}>
            <CardContent>
              <Typography fontWeight="bold">{reservation.plan?.name ?? "プランなし"}</Typography>
              <Typography>ユーザー: {reservation.user?.name ?? "不明"}</Typography>
              <Typography>日時: {new Date(reservation.reserver_at).toLocaleString()}</Typography>
              <Typography>ステータス: {reservation.status === "pending" ? "未承認" : reservation.status === "confirmed" ? "承認済み" : "却下" }</Typography>
              {reservation.status === "pending" && (
                <Stack direction="row" spacing={1} mt={1}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => updateStatus(reservation.id, "confirmed")}
                  >
                    承認
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => updateStatus(reservation.id, "canceled")}
                  >
                    却下
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}