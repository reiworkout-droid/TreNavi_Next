"use client";

import { useRouter, useParams } from "next/navigation"
import { Typography, Button } from "@mui/material"
import { useEffect, useState } from "react"
import DiagnosisResultView from "@/components/diagnosis/DiagnosisResultView"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function TrainerUserDiagnosisPage() {
  const router = useRouter()
  const { id: userId } = useParams() // URLパラメータからユーザーIDを取得
  const [type, setType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTargetUserType = async () => {
      try {
        const token = localStorage.getItem("token") // トレーナーのトークン
        
        // トレーナー用の「特定ユーザーの情報を取得するAPI」を叩く
        const res = await fetch(`${API_URL}/api/trainer/client/${userId}/diagnosis`, {
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

    if (userId) fetchTargetUserType()
  }, [userId])

  if (loading) return <Typography p={4}>Loading...</Typography>
  if (!type) return <Typography p={4}>ユーザーのタイプ情報がありません</Typography>

  return (
    <DiagnosisResultView type={type}>
      {/* トレーナー側専用のボタン（例：クライアント一覧に戻る） */}
      <Button 
        fullWidth 
        variant="outlined" 
        onClick={() => router.push("/trainer/reservations")}
      >
        クライアント一覧に戻る
      </Button>
    </DiagnosisResultView>
    
  )
}