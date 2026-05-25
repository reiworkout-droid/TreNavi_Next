"use client"

import { useRouter } from "next/navigation"
import { Typography, Button, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import DiagnosisResultView from "@/components/diagnosis/DiagnosisResultView"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function DiagnosisResultPage() {
  const router = useRouter()
  const [type, setType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const res = await fetch(`${API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("取得失敗")

        const data = await res.json()
        setType(data.user_type || null)
      } catch (err) {
        console.error(err)
        setType(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserType()
  }, [router])

  if (loading) return <Typography p={4}>Loading...</Typography>
  if (!type) return <Typography p={4}>タイプが取得できませんでした</Typography>

  return (
    <DiagnosisResultView type={type}>
      {/* クライアント側専用のボタン群 */}
      <Stack spacing={2}>
        <Button variant="contained" onClick={() => router.push("/trainers")}>
          トレーナーを探す
        </Button>
        <Button variant="outlined" onClick={() => router.push("/diagnosis")}>
          もう一度診断する
        </Button>
      </Stack>
    </DiagnosisResultView>
  )
}