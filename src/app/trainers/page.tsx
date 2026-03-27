"use client"

import { useEffect, useState } from "react"
import {
  Prefecture, City, Area, Category, Speciality, TrainerSearch
} from "@/types"
import { calculateMatchScore } from "@/components/MatchingLogic"
import SearchForm from "@/components/SearchForm"
import TrainerList from "@/components/TrainerList"
import { Box, Typography } from "@mui/material"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Page() {

  const router = useRouter()

  // ----------------------
  // state
  // ----------------------

  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [specialities, setSpecialities] = useState<Speciality[]>([])

  const [prefecture, setPrefecture] = useState("")
  const [city, setCity] = useState("")
  const [area, setArea] = useState("")
  const [category, setCategory] = useState("")
  const [speciality, setSpeciality] = useState("")
  const [keyword, setKeyword] = useState("")

  const [trainers, setTrainers] = useState<TrainerSearch[]>([])
  const [userType, setUserType] = useState<string | null>(null)

  // ----------------------
  // 🔑 共通fetch（トークン）
  // ----------------------

  const fetchWithAuth = async (url: string) => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      throw new Error("No token")
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) throw new Error("API error")

    return res.json()
  }

  // ----------------------
  // 都道府県取得（公開API）
  // ----------------------

  useEffect(() => {
    fetch(`${API_URL}/api/prefectures`)
      .then(res => res.json())
      .then((data: Prefecture[]) => setPrefectures(data))
  }, [])

  // ----------------------
  // 市区町村取得
  // ----------------------

  useEffect(() => {
    if (!prefecture) return

    fetch(`${API_URL}/api/cities?prefecture_id=${prefecture}`)
      .then(res => res.json())
      .then((data: City[]) => {
        setCities(data)
        setCity("")
        setAreas([])
        setArea("")
      })
  }, [prefecture])

  // ----------------------
  // エリア取得
  // ----------------------

  useEffect(() => {
    if (!city) return

    fetch(`${API_URL}/api/areas?city_id=${city}`)
      .then(res => res.json())
      .then((data: Area[]) => {
        setAreas(data)
        setArea("")
      })
  }, [city])

  // ----------------------
  // カテゴリー取得
  // ----------------------

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then(res => res.json())
      .then((data: Category[]) => setCategories(data))
  }, [])

  // ----------------------
  // 専門取得
  // ----------------------

  useEffect(() => {
    fetch(`${API_URL}/api/specialities`)
      .then(res => res.json())
      .then((data: Speciality[]) => setSpecialities(data))
  }, [])

  // ----------------------
  // 🔥 ユーザータイプ取得（修正ポイント）
  // ----------------------

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchWithAuth(`${API_URL}/api/user`)
        setUserType(data.user_type)
      } catch (err) {
        console.error(err)
      }
    }

    fetchUser()
  }, [])

  // ----------------------
  // 初期おすすめ表示
  // ----------------------

  useEffect(() => {
    if (userType) {
      handleSearch()
    }
  }, [userType])

  // ----------------------
  // 検索
  // ----------------------

  const handleSearch = async () => {

    const params = new URLSearchParams()

    if (area) params.append("area_id", area)
    if (category) params.append("category_id", category)
    if (speciality) params.append("speciality_id", speciality)
    if (keyword) params.append("keyword", keyword)

    const res = await fetch(`${API_URL}/api/trainers?${params}`)
    const data = await res.json()

    let result = data.data

    // 相性順ソート
    if (userType) {
      result = result.sort((a: TrainerSearch, b: TrainerSearch) => {
        const scoreA = calculateMatchScore(userType, a)
        const scoreB = calculateMatchScore(userType, b)
        return scoreB - scoreA
      })
    }

    setTrainers(result) // ←ここも修正
  }

  // ----------------------
  // render
  // ----------------------

  return (
    <Box sx={{ p: 4 }}>

      <Typography variant="h4" mb={3}>
        トレーナー検索
      </Typography>

      <SearchForm
        prefectures={prefectures}
        cities={cities}
        areas={areas}
        categories={categories}
        specialities={specialities}

        prefecture={prefecture}
        city={city}
        area={area}
        category={category}
        speciality={speciality}
        keyword={keyword}

        setPrefecture={setPrefecture}
        setCity={setCity}
        setArea={setArea}
        setCategory={setCategory}
        setSpeciality={setSpeciality}
        setKeyword={setKeyword}

        onSearch={handleSearch}
      />

      <TrainerList
        trainers={trainers}
        userType={userType}
      />

    </Box>
  )
}