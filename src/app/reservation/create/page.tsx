"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SimplePlan } from "@/types"
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack
} from "@mui/material"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ReservationCreatePage() {
  const router = useRouter()

  const [planId, setPlanId] = useState<string | null>(null)
  const [nameParam, setNameParam] = useState<string | null>(null)
  const [priceParam, setPriceParam] = useState<string | null>(null)
  const [durationParam, setDurationParam] = useState<string | null>(null)

  const [plan, setPlan] = useState<SimplePlan | null>(null)
  const [reservedAt, setReservedAt] = useState("")
  const [loading, setLoading] = useState(true)

  // 🔑 共通fetch
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      throw new Error("No token")
    }

    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    })

    if (!res.ok) throw new Error("API error")

    return res.json()
  }

  // URLパラメータ取得
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setPlanId(params.get("plan_id"))
    setNameParam(params.get("name"))
    setPriceParam(params.get("price"))
    setDurationParam(params.get("duration"))
  }, [])

  // プラン取得
  useEffect(() => {
    if (!planId) {
      setLoading(false)
      return
    }

    // URLパラメータ優先
    if (nameParam && priceParam && durationParam) {
      setPlan({
        id: Number(planId),
        name: nameParam,
        price: Number(priceParam),
        duration_minutes: Number(durationParam)
      })
      setLoading(false)
      return
    }

    const fetchPlan = async () => {
      try {
        const data = await fetchWithAuth(`${API_URL}/api/plans/${planId}`)
        setPlan(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [planId, nameParam, priceParam, durationParam])

  // 予約作成
  const createReservation = async () => {
    if (!reservedAt) {
      alert("日時を選択してください")
      return
    }

    try {
      await fetchWithAuth(`${API_URL}/api/reservations`, {
        method: "POST",
        body: JSON.stringify({
          plan_id: planId,
          reserver_at: reservedAt
        })
      })

      alert("予約しました！")
      router.push("/reservation")

    } catch (err) {
      console.error("通信エラー:", err)
      alert("予約に失敗しました")
    }
  }

  if (loading) return <Typography p={4}>Loading...</Typography>
  if (!plan) return <Typography p={4}>プランが見つかりません</Typography>

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h5" mb={3}>
        予約確認
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography fontWeight="bold">{plan.name}</Typography>
          <Typography>⏱ {plan.duration_minutes}分</Typography>
          <Typography sx={{ mt: 1 }}>💰 ¥{plan.price}</Typography>
        </CardContent>
      </Card>

      <Stack spacing={3}>
        <TextField
          label="予約日時"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          value={reservedAt}
          onChange={e => setReservedAt(e.target.value)}
        />

        <Button onClick={createReservation} variant="contained" size="large">
          この内容で予約する
        </Button>
      </Stack>
    </Box>
  )
}