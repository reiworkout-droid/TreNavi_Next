"use client"

import { useEffect, useState } from "react"
import {
  Prefecture, City, Area, Category, Speciality, TrainerSearch
} from "@/types"
import { calculateMatchScore } from "@/components/logic/MatchingLogic"
import SearchForm from "@/components/form/SearchForm"
import TrainerList from "@/components/trainer/TrainerList"
import { Box, Typography } from "@mui/material"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Page() {

  const router = useRouter()

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

  useEffect(() => {
    fetch(`${API_URL}/api/prefectures`)
      .then(res => res.json())
      .then((data: Prefecture[]) => setPrefectures(data))
  }, [])

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

  useEffect(() => {
    if (!city) return
    fetch(`${API_URL}/api/areas?city_id=${city}`)
      .then(res => res.json())
      .then((data: Area[]) => {
        setAreas(data)
        setArea("")
      })
  }, [city])

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then(res => res.json())
      .then((data: Category[]) => setCategories(data))
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/api/specialities`)
      .then(res => res.json())
      .then((data: Speciality[]) => setSpecialities(data))
  }, [])

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

  useEffect(() => {
    if (userType) {
      handleSearch()
    }
  }, [userType])

  const handleSearch = async () => {
    const params = new URLSearchParams()
    if (area) params.append("area_id", area)
    if (category) params.append("category_id", category)
    if (speciality) params.append("speciality_id", speciality)
    if (keyword) params.append("keyword", keyword)

    const res = await fetch(`${API_URL}/api/trainers?${params}`)
    const data = await res.json()

    let result = data.data

    if (userType) {
      result = result.sort((a: TrainerSearch, b: TrainerSearch) => {
        const scoreA = calculateMatchScore(userType, a)
        const scoreB = calculateMatchScore(userType, b)
        return scoreB - scoreA
      })
    }

    setTrainers(result)
  }

  return (
    /* Tailwind: ヘッダー・ボトムナビ分の余白確保、中央寄せ、スマホ最適化 */
    <Box
      sx={{ p: 0 }}
      className="pt-20 pb-24 px-4 max-w-lg mx-auto"
    >

      {/* MUI sx: 見出しをセージグリーン + Outfitフォントで統一 */}
      <Typography
        variant="h4"
        mb={3}
        sx={{
          fontWeight: 800,
          fontSize: { xs: "1.5rem", sm: "1.75rem" },
          fontFamily: "'Outfit', 'Noto Sans JP', sans-serif",
          color: "#3d6b52",
          letterSpacing: "0.02em",
        }}
        className="mb-5"
      >
        トレーナー検索
      </Typography>

      {/* 
        SearchForm・TrainerList は子コンポーネントのため構造変更不可。
        親側からMUI ThemeProviderまたはグローバルCSSで
        子コンポーネント内のMUI要素をスタイリングするのが理想。
        
        以下は親Boxに適用するグローバルスタイルオーバーライド:
        - セレクトボックス・テキストフィールドの統一
        - カード内ボタンのCTA強調
      */}
      <Box
        sx={{
          /* MUI sx: SearchForm内のMUIコンポーネントをグローバルにスタイリング */

          /* テキストフィールド・セレクトの角丸と枠線を統一 */
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#fdfcfa",
            fontSize: "0.875rem",
            "& fieldset": {
              borderColor: "#e5e7eb",
              transition: "border-color 0.2s",
            },
            "&:hover fieldset": {
              borderColor: "#5a9e7c",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#5a9e7c",
              borderWidth: "2px",
            },
          },

          /* ラベルの色をセージグリーンに */
          "& .MuiInputLabel-root": {
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: "0.85rem",
            "&.Mui-focused": {
              color: "#5a9e7c",
            },
          },

          /* contained ボタン（検索ボタン）をコーラルオレンジCTAに */
          "& .MuiButton-contained": {
            borderRadius: "999px",
            backgroundColor: "#e8734a",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.9rem",
            textTransform: "none",
            px: 4,
            py: 1.2,
            boxShadow: "0 4px 16px -2px rgba(232,115,74,0.35)",
            "&:hover": {
              backgroundColor: "#d4623c",
              boxShadow: "0 6px 20px -2px rgba(232,115,74,0.45)",
            },
          },

          /* text/outlinedボタンをセージグリーンに統一 */
          "& .MuiButton-text, & .MuiButton-outlined": {
            color: "#5a9e7c",
            fontWeight: 600,
            fontSize: "0.8rem",
            textTransform: "none",
            borderRadius: "999px",
            "&:hover": {
              backgroundColor: "rgba(90,158,124,0.08)",
            },
          },
          "& .MuiButton-outlined": {
            borderColor: "#5a9e7c",
            borderWidth: "1.5px",
          },

          /* カード（トレーナーカード）を統一スタイルに */
          "& .MuiCard-root": {
            borderRadius: "16px",
            boxShadow: "0 2px 12px -2px rgba(0,0,0,0.06)",
            border: "1px solid #f0f0f0",
            overflow: "hidden",
            transition: "box-shadow 0.2s ease, transform 0.2s ease",
            "&:hover": {
              boxShadow: "0 4px 20px -4px rgba(90,158,124,0.15)",
              transform: "translateY(-2px)",
            },
          },

          "& .MuiCardContent-root": {
            padding: "20px",
          },

          /* カード内の見出し統一 */
          "& .MuiTypography-h6": {
            fontWeight: 700,
            fontSize: "1rem",
            fontFamily: "'Outfit', 'Noto Sans JP', sans-serif",
            color: "#2d2d2d",
          },

          /* セレクト内のメニューアイテム */
          "& .MuiMenuItem-root": {
            fontSize: "0.875rem",
            fontFamily: "'Noto Sans JP', sans-serif",
          },
        }}
      >
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

        {/* Tailwind: 検索フォームと結果リストの間に余白 */}
        <Box className="mt-6">
          <TrainerList
            trainers={trainers}
            userType={userType}
          />
        </Box>
      </Box>

    </Box>
  )
}
