"use client"

import { useEffect, useState } from "react"
import { UserProfile } from "@/types/api";
import { useRouter } from "next/navigation"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem
} from "@mui/material"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ProfilePage(){

  const router = useRouter()

  const [user,setUser] = useState<UserProfile | null>(null)
  const [loading,setLoading] = useState(true)

  const [name,setName] = useState("")
  const [sex,setSex] = useState("")
  const [birth,setBirth] = useState("")
  const [tel,setTel] = useState("")

  // =============================
  // 初期データ取得
  // =============================
  useEffect(()=>{

    const fetchUser = async()=>{

      try{

        const token = localStorage.getItem("token")
        if(!token) return

        const res = await fetch(`${API_URL}/api/user`,{
          headers:{
            Authorization:`Bearer ${token}`,
            Accept:"application/json"
          }
        })

        if(!res.ok) throw new Error("取得失敗")

        const data:UserProfile = await res.json()

        setUser(data)

        setName(data.name)
        setSex(data.sex ?? "")
        setBirth(data.birth ?? "")
        setTel(data.tel ?? "")

      }catch(err){
        console.error(err)
      }finally{
        setLoading(false)
      }
    }

    fetchUser()

  },[])

  // =============================
  // 更新
  // =============================
  const handleSubmit = async(e:React.FormEvent)=>{
    e.preventDefault()

    try{

      const token = localStorage.getItem("token")
      if(!token) return

      const res = await fetch(`${API_URL}/api/user`,{
        method:"PUT",
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"application/json",
          Accept:"application/json"
        },
        body:JSON.stringify({
          name,
          sex,
          birth,
          tel
        })
      })

      if(!res.ok) throw new Error("更新失敗")

      const updated = await res.json()

      setUser(updated)

      alert("更新しました")

      router.push("/home")

    }catch(err){
      console.error(err)
      alert("更新に失敗しました")
    }
  }

  if(loading) return <Typography p={4}>Loading...</Typography>

  return(

    <Box sx={{p:4}}>

      <Typography variant="h4" mb={3}>
        プロフィール編集
      </Typography>

      {user?.trainer && (
        <Button
            variant="contained"
            onClick={() => router.push("/trainer/profile")}
        >
            トレーナープロフィールへ
        </Button>
      )}


      <Card sx={{maxWidth:500}}>

        <CardContent>

          <Stack spacing={3} component="form" onSubmit={handleSubmit}>

            <TextField
              label="名前"
              value={name}
              onChange={e=>setName(e.target.value)}
              fullWidth
            />

            <Select
              value={sex}
              onChange={e=>setSex(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">未設定</MenuItem>
              <MenuItem value="male">男性</MenuItem>
              <MenuItem value="female">女性</MenuItem>
            </Select>

            <TextField
              label="生年月日"
              type="date"
              value={birth}
              onChange={e=>setBirth(e.target.value)}
              InputLabelProps={{shrink:true}}
              fullWidth
            />

            <TextField
              label="電話番号"
              value={tel}
              onChange={e=>setTel(e.target.value)}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
            >
              更新
            </Button>

          </Stack>

        </CardContent>

      </Card>

    </Box>
  )
}