"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField
} from "@mui/material"

const API_URL = process.env.NEXT_PUBLIC_API_URL

type Prefecture = {
  id: number
  name: string
}

type City = {
  id: number
  name: string
}

type Area = {
  id: number
  name: string
}

type Category = {
  id: number
  name: string
}

type Speciality = {
  id: number
  name: string
}

type Trainer = {
  id: number
  name: string
  record: string
  bio: string
  profile_image: string | null

  user: { name:string }

  plans_min_price: number
  likes_count: number

  areas: { id:number; name:string }[]
  categories: { id:number; name:string }[]
  specialities: { id:number; name:string }[]
  is_liked?: boolean
}

export default function SearchPage() {

  const router = useRouter()

  // 地域データ
  const [prefectures,setPrefectures] = useState<Prefecture[]>([])
  const [cities,setCities] = useState<City[]>([])
  const [areas,setAreas] = useState<Area[]>([])

  // その他マスタ
  const [categories,setCategories] = useState<Category[]>([])
  const [specialities,setSpecialities] = useState<Speciality[]>([])

  // 検索条件
  const [prefecture,setPrefecture] = useState("")
  const [city,setCity] = useState("")
  const [area,setArea] = useState("")

  const [category,setCategory] = useState("")
  const [speciality,setSpeciality] = useState("")
  const [keyword,setKeyword] = useState("")

  // 検索結果
  const [trainers,setTrainers] = useState<Trainer[]>([])

  // ----------------------
  // 都道府県取得
  // ----------------------

  useEffect(()=>{

    fetch(`${API_URL}/api/prefectures`)
      .then(res=>res.json())
      .then((data:Prefecture[])=>setPrefectures(data))

  },[])

  // ----------------------
  // 市区町村取得
  // ----------------------

  useEffect(()=>{

    if(!prefecture) return

    fetch(`${API_URL}/api/cities?prefecture_id=${prefecture}`)
      .then(res=>res.json())
      .then((data:City[])=>{
        setCities(data)
        setCity("")
        setAreas([])
        setArea("")
      })

  },[prefecture])

  // ----------------------
  // エリア取得
  // ----------------------

  useEffect(()=>{

    if(!city) return

    fetch(`${API_URL}/api/areas?city_id=${city}`)
      .then(res=>res.json())
      .then((data:Area[])=>{
        setAreas(data)
        setArea("")
      })

  },[city])

  // ----------------------
  // カテゴリー取得
  // ----------------------

  useEffect(()=>{

    fetch(`${API_URL}/api/categories`)
      .then(res=>res.json())
    .then((data:Category[])=>{
      console.log("categories",data)
      setCategories(data)
    })
  },[])

  // ----------------------
  // 専門取得
  // ----------------------

  useEffect(()=>{

    fetch(`${API_URL}/api/specialities`)
      .then(res=>res.json())
      .then((data:Speciality[])=>setSpecialities(data))

  },[])

  // ----------------------
  // 検索
  // ----------------------

  const handleSearch = async () => {

    const params = new URLSearchParams()

    if(area) params.append("area_id",area)
    if(category) params.append("category_id",category)
    if(speciality) params.append("speciality_id",speciality)
    if(keyword) params.append("keyword",keyword)

    const res = await fetch(`${API_URL}/api/trainers?${params}`)

    const data = await res.json()

    setTrainers(data.data)

  }

  return (

    <Box sx={{p:4}}>

      <Typography variant="h4" sx={{mb:3,fontWeight:"bold"}}>
        トレーナー検索
      </Typography>

      {/* 検索フォーム */}

      <Card sx={{mb:4,p:3}}>

        <Grid container spacing={2}>

          {/* 都道府県 */}

          <Grid size={{xs:12, md:2}}>

            <FormControl fullWidth>

              <InputLabel>都道府県</InputLabel>

              <Select
                value={prefecture}
                label="都道府県"
                onChange={(e)=>setPrefecture(e.target.value)}
              >

                {prefectures.map((p)=>(
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}

              </Select>

            </FormControl>

          </Grid>


          {/* 市区町村 */}

          <Grid size={{xs:12, md:2}}>

            <FormControl fullWidth>

              <InputLabel>市区町村</InputLabel>

              <Select
                value={city}
                label="市区町村"
                onChange={(e)=>setCity(e.target.value)}
              >

                {cities.map((c)=>(
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}

              </Select>

            </FormControl>

          </Grid>


          {/* エリア */}

          <Grid size={{xs:12, md:2}}>

            <FormControl fullWidth>

              <InputLabel>エリア</InputLabel>

              <Select
                value={area}
                label="エリア"
                onChange={(e)=>setArea(e.target.value)}
              >

                {areas.map((a)=>(
                  <MenuItem key={a.id} value={a.id}>
                    {a.name}
                  </MenuItem>
                ))}

              </Select>

            </FormControl>

          </Grid>


          {/* カテゴリー */}

          <Grid size={{xs:12, md:2}}>

            <FormControl fullWidth>

              <InputLabel>カテゴリー</InputLabel>

              <Select
                value={category}
                label="カテゴリー"
                onChange={(e)=>setCategory(e.target.value)}
              >

                {categories.map((c)=>(
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}

              </Select>

            </FormControl>

          </Grid>


          {/* 専門 */}

          <Grid size={{xs:12, md:2}}>

            <FormControl fullWidth>

              <InputLabel>専門</InputLabel>

              <Select
                value={speciality}
                label="専門"
                onChange={(e)=>setSpeciality(e.target.value)}
              >

                {specialities.map((s)=>(
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}

              </Select>

            </FormControl>

          </Grid>


          {/* キーワード */}

          <Grid size={{xs:12, md:2}}>

            <TextField
              label="名前・実績"
              value={keyword}
              onChange={(e)=>setKeyword(e.target.value)}
              fullWidth
            />

          </Grid>


          {/* 検索ボタン */}

          <Grid size={{xs:12}}>

            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
            >
              検索
            </Button>

          </Grid>

        </Grid>

      </Card>


      {/* 検索結果 */}

      <Grid container spacing={3}>

        {trainers.map((trainer)=>(
          
          <Grid key={trainer.id} size={{xs:12, md:4}}>

            <Card
              sx={{
                height:"100%",
                transition:"0.2s",
                "&:hover":{
                  transform:"translateY(-6px)",
                  boxShadow:6
                }
              }}
            >
                {/* プロフィール画像 */}
              <Box
                component="img"
                src={
                  trainer.profile_image
                    ? `${API_URL}/storage/${trainer.profile_image}`
                    : "/noimage.png"
                }
                sx={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  transition:"0.3s",
                  "&:hover":{
                    transform:"scale(1.05)"
                  }
                }}
              />
              <CardContent>

                {/* 名前 */}

                <Typography variant="h6"
                  sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                  onClick={() => router.push(`/trainers/${trainer.id}`)}
                >
                  {trainer.user.name}
                </Typography>

                {/* エリア */}

                <Typography sx={{fontSize:14,color:"gray"}}>

                  {trainer.areas.map(a=>a.name).join(" / ")}

                </Typography>

                {/* カテゴリ */}

                <Typography sx={{mt:1}}>

                  {trainer.categories.map(c=>c.name).join(", ")}

                </Typography>

                {/* 専門 */}

                <Typography sx={{fontSize:14}}>

                  得意: {trainer.specialities.map(s=>s.name).join(", ")}

                </Typography>

                {/* 実績 */}

                <Typography sx={{mt:1}}>
                  {trainer.record}
                </Typography>

                {/* 価格 */}

                <Typography sx={{mt:2,fontWeight:"bold"}}>
                  最安料金 {trainer.plans_min_price ?? "未設定"}円
                </Typography>

                {/* いいね */}

                <Typography sx={{mt:1}}>
                  ❤️ {trainer.likes_count}
                </Typography>

              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>

    </Box>

  )

}
