"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button
} from "@mui/material"

type Plan = {
  id: number
  name: string
  price: number
  duration_minutes: number
  plan_type: string
  session_count: number | null
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function TrainerPlansPage(){

  const router = useRouter()

  const [plans,setPlans] = useState<Plan[]>([])
  const [loading,setLoading] = useState(true)

  // =============================
  // トークン取得
  // =============================
  const getToken = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      throw new Error("No token")
    }
    return token
  }

  // =============================
  // プラン一覧取得
  // =============================
  const fetchPlans = async () => {
    try {

      const token = getToken()

      const res = await fetch(`${API_URL}/api/plans`,{
        headers:{
          Authorization:`Bearer ${token}`,
          Accept:"application/json"
        }
      })

      if(!res.ok) throw new Error("取得失敗")

      const data = await res.json()

      setPlans(data)

    } catch(err){
      console.error(err)
      alert("プラン取得に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchPlans()
  },[])

  // =============================
  // 削除
  // =============================
  const handleDelete = async (id:number) => {

    if(!confirm("削除しますか？")) return

    try {

      const token = getToken()

      const res = await fetch(`${API_URL}/api/plans/${id}`,{
        method:"DELETE",
        headers:{
          Authorization:`Bearer ${token}`,
          Accept:"application/json"
        }
      })

      if(!res.ok) throw new Error("削除失敗")

      setPlans(prev => prev.filter(p => p.id !== id))

    } catch(err){
      console.error(err)
      alert("削除に失敗しました")
    }
  }

  // =============================
  // UI
  // =============================
  if(loading) return <Typography p={4}>Loading...</Typography>

  return(

    <Box sx={{p:4,maxWidth:800,mx:"auto"}}>

      <Typography variant="h5" mb={3}>
        プラン一覧
      </Typography>

      <Button
        variant="contained"
        sx={{mb:3}}
        onClick={()=>router.push("/trainer/plan/create")}
      >
        ＋ プラン作成
      </Button>

      {plans.length === 0 && (
        <Typography>プランがありません</Typography>
      )}

      <Stack spacing={2}>

        {plans.map(plan=>(
          <Card key={plan.id}>
            <CardContent>

              <Typography fontWeight="bold">
                {plan.name}
              </Typography>

              <Typography>
                ¥{plan.price}
              </Typography>

              <Typography>
                {plan.duration_minutes}分
              </Typography>

              <Typography>
                {plan.plan_type === "single" && "単発"}
                {plan.plan_type === "ticket" && "回数券"}
                {plan.plan_type === "monthly" && "月額"}
              </Typography>

              {plan.session_count && (
                <Typography>
                  回数: {plan.session_count}
                </Typography>
              )}

              <Stack direction="row" spacing={1} mt={2}>

                <Button
                  variant="outlined"
                  onClick={()=>router.push(`/trainer/plan/${plan.id}/edit`)}
                >
                  編集
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={()=>handleDelete(plan.id)}
                >
                  削除
                </Button>

              </Stack>

            </CardContent>
          </Card>
        ))}

      </Stack>

    </Box>
  )
}