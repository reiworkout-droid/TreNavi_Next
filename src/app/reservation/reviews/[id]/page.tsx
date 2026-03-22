"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Box, Typography, Card, CardContent } from "@mui/material"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ReviewDetailPage() {
  const { id } = useParams()

  const [review, setReview] = useState<any>(null)

  useEffect(() => {
    const fetchReview = async () => {
      const res = await fetch(`${API_URL}/api/reviews/${id}`, {
        credentials: "include"
      })
      const data = await res.json()
      setReview(data)
    }

    fetchReview()
  }, [id])

  if (!review) return <Typography p={4}>Loading...</Typography>

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h5" mb={3}>
        口コミ詳細
      </Typography>

    <Typography mb={2}>
    👤 {review.trainer?.user.name}
    </Typography>
    
      <Card>
        <CardContent>
          <Typography>指導スタイル: {review.style}</Typography>
          <Typography>会話量: {review.talk}</Typography>
          <Typography>論理性: {review.logic}</Typography>
          <Typography>ペース: {review.pace}</Typography>
          <Typography>距離感: {review.distance}</Typography>
        </CardContent>
      </Card>
    </Box>
  )
}