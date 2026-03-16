"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
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

export default function PlanEditPage(){

  const router = useRouter()
  const params = useParams()
  const planId = params.id as string

  const [name,setName] = useState("")
  const [price,setPrice] = useState(0)
  const [duration,setDuration] = useState(60)
  const [description,setDescription] = useState("")
  const [planType,setPlanType] = useState("single")
  const [sessionCount,setSessionCount] = useState<number | null>(null)

  useEffect(()=>{

    const fetchPlan = async ()=>{

      const res = await fetch(`${API_URL}/api/plans/${planId}`,{
        credentials:"include"
      })

      const data = await res.json()

      setName(data.name)
      setPrice(data.price)
      setDuration(data.duration_minutes)
      setDescription(data.description ?? "")
      setPlanType(data.plan_type)
      setSessionCount(data.session_count)

    }

    fetchPlan()

  },[planId])

  const handleSubmit = async(e:React.FormEvent)=>{
    e.preventDefault()

    await fetch(`${API_URL}/sanctum/csrf-cookie`,{
      credentials:"include"
    })

    const xsrfToken = decodeURIComponent(
      document.cookie.split("; ")
      .find(row=>row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1] ?? ""
    )

    const res = await fetch(
      `${API_URL}/api/plans/${planId}`,
      {
        method:"PATCH",
        credentials:"include",
        headers:{
          "Content-Type":"application/json",
          "X-XSRF-TOKEN":xsrfToken
        },
        body:JSON.stringify({
          name,
          price,
          description,
          plan_type:planType,
          duration_minutes:duration,
          session_count:sessionCount
        })
      }
    )

    if(res.ok){
      router.push("/trainer/profile")
    }

  }

  return(

    <Box sx={{p:4,maxWidth:500}}>

      <Typography variant="h4" mb={3}>
        プラン編集
      </Typography>

      <Stack spacing={3} component="form" onSubmit={handleSubmit}>

        <TextField
          label="プラン名"
          value={name}
          onChange={e=>setName(e.target.value)}
        />

        <TextField
          label="価格"
          type="number"
          value={price}
          onChange={e=>setPrice(Number(e.target.value))}
        />

        <TextField
          label="時間（分）"
          type="number"
          value={duration}
          onChange={e=>setDuration(Number(e.target.value))}
        />

        <Select
          value={planType}
          onChange={e=>setPlanType(e.target.value)}
        >
          <MenuItem value="single">単発</MenuItem>
          <MenuItem value="ticket">回数券</MenuItem>
          <MenuItem value="monthly">月額</MenuItem>
        </Select>

        <TextField
          label="回数（回数券のみ）"
          type="number"
          value={sessionCount ?? ""}
          onChange={e=>setSessionCount(Number(e.target.value))}
        />

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
          更新
        </Button>

      </Stack>

    </Box>

  )
}