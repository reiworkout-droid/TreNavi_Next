"use client"

import { useEffect, useState } from "react"
import { Plan, TrainerDetail } from "@/types"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button
} from "@mui/material"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function TrainerProfilePage() {

  const router = useRouter()

  const [trainer,setTrainer] = useState<TrainerDetail | null>(null)
  const [plans,setPlans] = useState<Plan[]>([])
  const [loading,setLoading] = useState(true)

  // =============================
  // トレーナー取得
  // =============================
  const fetchTrainer = async ()=>{

    try{

      const res = await fetch(`${API_URL}/api/trainers/profile`,{
        credentials:"include",
        headers:{
          Accept:"application/json"
        }
      })

      const data = await res.json()

      setTrainer(data)
      setPlans(data.plans ?? [])

    }catch(err){
      console.error(err)
    }finally{
      setLoading(false)
    }

  }

  useEffect(()=>{
    fetchTrainer()
  },[])

  // =============================
  // プラン削除
  // =============================
  const handleDeletePlan = async(id:number)=>{

    if(!confirm("このプランを削除しますか？")) return

    await fetch(`${API_URL}/sanctum/csrf-cookie`,{
      credentials:"include"
    })

    const xsrfToken = decodeURIComponent(
      document.cookie
      .split("; ")
      .find(row=>row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1] ?? ""
    )

    const res = await fetch(
      `${API_URL}/api/plans/${id}`,
      {
        method:"DELETE",
        credentials:"include",
        headers:{
          "X-XSRF-TOKEN":xsrfToken
        }
      }
    )

    if(res.ok){

      // UI更新
      setPlans(prev => prev.filter(p => p.id !== id))

    }

  }

  // =============================
  // loading
  // =============================
  if(loading) return <Typography p={4}>Loading...</Typography>

  if(!trainer) return <Typography p={4}>プロフィールがありません</Typography>

  // =============================
  // UI
  // =============================
  return(

    <Box sx={{p:4,maxWidth:800,mx:"auto"}}>

      <Typography variant="h4" sx={{mb:3}}>
        トレーナープロフィール
      </Typography>

      <Card>
        <CardContent>

          {/* 基本情報 */}

          <Typography variant="h5">
            {trainer.user.name}
          </Typography>

          <Typography sx={{mt:1}}>
            実績: {trainer.record}
          </Typography>

          <Typography sx={{mt:1}}>
            {trainer.bio}
          </Typography>

          <Typography sx={{mt:2}}>
            エリア: {trainer.areas.map(a=>a.name).join(", ")}
          </Typography>

          <Typography sx={{mt:1}}>
            カテゴリー: {trainer.categories.map(c=>c.name).join(", ")}
          </Typography>

          <Typography sx={{mt:1}}>
            専門: {trainer.specialities.map(s=>s.name).join(", ")}
          </Typography>

          <Button
            sx={{mt:3}}
            variant="contained"
            onClick={()=>router.push("/trainer/profile/edit")}
          >
            プロフィール編集
          </Button>

          {/* プラン */}

          <Typography variant="h6" sx={{mt:4,mb:2}}>
            プラン
          </Typography>

          {plans.length === 0 && (
            <Typography sx={{mb:2}}>
              プランがまだありません
            </Typography>
          )}

          {plans.map((plan)=>(
            <Card key={plan.id} sx={{p:2,mb:2}}>

              <Typography fontWeight="bold">
                {plan.name}
              </Typography>

              <Typography>
                ¥{plan.price}
              </Typography>

              <Typography>
                {plan.duration_minutes}分
              </Typography>

              {plan.session_count && (
                <Typography>
                  回数: {plan.session_count}
                </Typography>
              )}

              {plan.description && (
                <Typography sx={{mt:1}}>
                  {plan.description}
                </Typography>
              )}

              {/* ボタン */}

              <Box sx={{display:"flex",gap:1,mt:2}}>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={()=>router.push(`/trainer/plan/${plan.id}/edit`)}
                >
                  編集
                </Button>

                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={()=>handleDeletePlan(plan.id)}
                >
                  削除
                </Button>

              </Box>

            </Card>
          ))}

          <Button
            variant="outlined"
            sx={{mt:2}}
            onClick={()=>router.push("/trainer/plan/create")}
          >
            プラン追加
          </Button>

        </CardContent>
      </Card>

    </Box>
  )
}