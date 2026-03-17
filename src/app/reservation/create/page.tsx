"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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

export default function ReservationCreatePage(){
  const router = useRouter()
  const searchParams = useSearchParams()

  const planId = searchParams.get("plan_id")
  const nameParam = searchParams.get("name")
  const priceParam = searchParams.get("price")
  const durationParam = searchParams.get("duration")

  const [plan,setPlan] = useState<any>(null)
  const [reservedAt,setReservedAt] = useState("")
  const [loading,setLoading] = useState(true)

  // =========================
  // プラン取得（改良版）
  // =========================
  useEffect(()=>{

    if(!planId) return

    // ✅ ① URLにデータあるならそれ使う（最優先）
    if(nameParam && priceParam && durationParam){
      setPlan({
        id: planId,
        name: nameParam,
        price: Number(priceParam),
        duration_minutes: Number(durationParam)
      })
      setLoading(false)
      return
    }

    // ✅ ② fallback（リロード対策）
    const fetchPlan = async()=>{
      try{
        const res = await fetch(`${API_URL}/api/plans/${planId}`,{
          credentials:"include"
        })

        if(!res.ok){
          throw new Error("取得失敗")
        }

        const data = await res.json()
        setPlan(data)

      }catch(err){
        console.error(err)
      }finally{
        setLoading(false)
      }
    }

    fetchPlan()

  },[planId])

  // =========================
  // 予約作成
  // =========================
  const handleSubmit = async(e:React.FormEvent)=>{
    e.preventDefault()

    if(!reservedAt){
      alert("日時を選択してください")
      return
    }

    // CSRF
    await fetch(`${API_URL}/sanctum/csrf-cookie`,{
      credentials:"include"
    })

    const xsrfToken = decodeURIComponent(
      document.cookie.split("; ")
      .find(row=>row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1] ?? ""
    )

    const res = await fetch(`${API_URL}/api/reservations`,{
      method:"POST",
      credentials:"include",
      headers:{
        "Content-Type":"application/json",
        "X-XSRF-TOKEN":xsrfToken
      },
      body:JSON.stringify({
        plan_id: planId,
        reserved_at: reservedAt
      })
    })

    if(res.ok){
      alert("予約しました！")
      router.push("/reservation")
    }else{
      alert("予約に失敗しました")
    }
  }

  // =========================
  // UI
  // =========================
  if(loading) return <Typography p={4}>Loading...</Typography>
  if(!plan) return <Typography p={4}>プランが見つかりません</Typography>

  return(
    <Box sx={{p:4,maxWidth:500,mx:"auto"}}>

      <Typography variant="h5" mb={3}>
        予約確認
      </Typography>

      <Card sx={{mb:3}}>
        <CardContent>
          <Typography fontWeight="bold">
            {plan.name}
          </Typography>

          <Typography>
            ⏱ {plan.duration_minutes}分
          </Typography>

          <Typography sx={{mt:1}}>
            💰 ¥{plan.price}
          </Typography>
        </CardContent>
      </Card>

      <Stack spacing={3} component="form" onSubmit={handleSubmit}>

        <TextField
          label="予約日時"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          value={reservedAt}
          onChange={(e)=>setReservedAt(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
        >
          この内容で予約する
        </Button>

      </Stack>

    </Box>
  )
}