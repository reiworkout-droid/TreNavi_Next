"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Select,
  MenuItem
} from "@mui/material"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function PlanCreatePage(){

  const router = useRouter()

  const [name,setName] = useState("")
  const [price,setPrice] = useState(0)
  const [duration,setDuration] = useState(60)
  const [description,setDescription] = useState("")
  const [planType,setPlanType] = useState("single")
  const [sessionCount,setSessionCount] = useState<number | null>(null)

  // 🔑 トークン取得
  const getToken = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      throw new Error("No token")
    }
    return token
  }

  const handleSubmit = async(e:React.FormEvent)=>{
    e.preventDefault()

    try {

      const token = getToken()

      console.log("CREATE PLAN",{
        name,
        price,
        duration,
        description,
        planType,
        sessionCount
      })

      const res = await fetch(`${API_URL}/api/plans`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`,
          Accept:"application/json"
        },
        body:JSON.stringify({
          name,
          price,
          description,
          plan_type:planType,
          duration_minutes:duration,
          session_count:planType === "ticket" ? sessionCount : null // ←地味に重要
        })
      })

      console.log("CREATE RESULT",res)

      if(!res.ok){
        throw new Error("作成失敗")
      }

      router.push("/trainer/profile")

    } catch(err){
      console.error(err)
      alert("プラン作成に失敗しました")
    }
  }

  return(
    <Box sx={{p:4,maxWidth:500}}>

      <Typography variant="h4" mb={3}>
        プラン作成
      </Typography>

      <Stack spacing={3} component="form" onSubmit={handleSubmit}>

        <TextField
          label="プラン名"
          value={name}
          onChange={e=>setName(e.target.value)}
          required
        />

        <TextField
          label="価格"
          type="number"
          value={price}
          onChange={e=>setPrice(Number(e.target.value))}
          required
        />

        <TextField
          label="時間（分）"
          type="number"
          value={duration}
          onChange={e=>setDuration(Number(e.target.value))}
          required
        />

        <Select
          value={planType}
          onChange={e=>setPlanType(e.target.value)}
        >
          <MenuItem value="single">単発</MenuItem>
          <MenuItem value="ticket">回数券</MenuItem>
          <MenuItem value="monthly">月額</MenuItem>
        </Select>

        {planType === "ticket" && (
          <TextField
            label="回数"
            type="number"
            value={sessionCount ?? ""}
            onChange={e=>setSessionCount(Number(e.target.value))}
          />
        )}

        <TextField
          label="説明"
          multiline
          rows={3}
          value={description}
          onChange={e=>setDescription(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
        >
          作成
        </Button>

      </Stack>

    </Box>
  )
}