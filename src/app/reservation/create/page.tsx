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

  // ⚠ クライアントサイドでのみ URL パラメータを取得
  const [planId, setPlanId] = useState<string | null>(null)
  const [nameParam, setNameParam] = useState<string | null>(null)
  const [priceParam, setPriceParam] = useState<string | null>(null)
  const [durationParam, setDurationParam] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setPlanId(params.get("plan_id"))
    setNameParam(params.get("name"))
    setPriceParam(params.get("price"))
    setDurationParam(params.get("duration"))
  }, [])

  const [plan, setPlan] = useState<SimplePlan | null>(null)
  const [reservedAt, setReservedAt] = useState("")
  const [loading, setLoading] = useState(true)

  // プラン情報の取得
  useEffect(() => {
    if (!planId) {
      setLoading(false)
      return
    }

    // URLパラメータから取得できる場合はそれを使う
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

    // APIからプラン取得
    const fetchPlan = async () => {
      try {
        const res = await fetch(`${API_URL}/api/plans/${planId}`, {
          credentials: "include"
        })
        if (!res.ok) throw new Error("プラン取得失敗")
        const data = await res.json()
        setPlan(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlan()
  }, [planId, nameParam, priceParam, durationParam])

  // 予約作成関数
  const createReservation = async () => {
    if (!reservedAt) {
      alert("日時を選択してください")
      return
    }

    try {
      await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: "include" })
      const xsrfToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1]

      if (!xsrfToken) throw new Error("XSRFトークンが取得できません")

      const res = await fetch(`${API_URL}/api/reservations`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(xsrfToken)
        },
        body: JSON.stringify({
          plan_id: planId,
          reserver_at: reservedAt
        })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "不明なエラー" }))
        alert(`予約に失敗しました: ${errorData.message}`)
        return
      }

      alert("予約しました！")
      router.push("/reservation")
    } catch (err) {
      console.error("通信エラー:", err)
      alert("通信エラーが発生しました")
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