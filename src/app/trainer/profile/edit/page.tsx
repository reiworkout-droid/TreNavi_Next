"use client"

import { useEffect, useState } from "react"
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
  MenuItem,
  Chip,
  OutlinedInput
} from "@mui/material"

import { Area, City, Prefecture, Category, Speciality, Plan } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

export default function TrainerProfileEditPage() {

  const router = useRouter()

  // 🔑 トークン
  const getToken = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      throw new Error("No token")
    }
    return token
  }

  // =============================
  // state
  // =============================
  const [name,setName] = useState("")
  const [tel,setTel] = useState("")
  const [birth,setBirth] = useState("")
  const [record,setRecord] = useState("")
  const [bio,setBio] = useState("")
  const [loading,setLoading] = useState(true)

  const [prefectures,setPrefectures] = useState<Prefecture[]>([])
  const [cities,setCities] = useState<City[]>([])
  const [areas,setAreas] = useState<Area[]>([])

  const [selectedPrefecture,setSelectedPrefecture] = useState<number | null>(null)
  const [selectedCity,setSelectedCity] = useState<number | null>(null)
  const [selectedAreas,setSelectedAreas] = useState<number[]>([])

  const [categories,setCategories] = useState<Category[]>([])
  const [specialities,setSpecialities] = useState<Speciality[]>([])
  const [selectedCategories,setSelectedCategories] = useState<number[]>([])
  const [selectedSpecialities,setSelectedSpecialities] = useState<number[]>([])

  const [plans,setPlans] = useState<Plan[]>([])

  const [image,setImage] = useState<File | null>(null)
  const [imagePreview,setImagePreview] = useState<string | null>(null)

  // =============================
  // 初期化
  // =============================
  useEffect(()=>{

    const init = async()=>{

      try{

        const token = getToken()

        // マスター
        const [prefsRes,catsRes,specsRes] = await Promise.all([
          fetch(`${API_URL}/api/prefectures`),
          fetch(`${API_URL}/api/categories`),
          fetch(`${API_URL}/api/specialities`)
        ])

        setPrefectures(await prefsRes.json())
        setCategories(await catsRes.json())
        setSpecialities(await specsRes.json())

        // プロフィール
        const res = await fetch(`${API_URL}/api/trainers/profile`,{
          headers:{
            Authorization:`Bearer ${token}`,
            Accept:"application/json"
          }
        })

        const data = await res.json()

        setName(data.user.name)
        setTel(data.tel ?? "")
        setBirth(data.birth ?? "")
        setRecord(data.record ?? "")
        setBio(data.bio ?? "")

        setSelectedCategories(data.categories.map((c:Category)=>c.id))
        setSelectedSpecialities(data.specialities.map((s:Speciality)=>s.id))

        setPlans(data.plans ?? [])

        // エリア復元
        if(data.areas?.length){

          const first = data.areas[0]

          const prefId = first.city.prefecture.id
          const cityId = first.city.id

          setSelectedPrefecture(prefId)

          const citiesData = await (await fetch(`${API_URL}/api/cities?prefecture_id=${prefId}`)).json()
          setCities(citiesData)

          setSelectedCity(cityId)

          const areasData = await (await fetch(`${API_URL}/api/areas?city_id=${cityId}`)).json()
          setAreas(areasData)

          setSelectedAreas(data.areas.map((a:Area)=>a.id))
        }

      }catch(err){
        console.error(err)
      }finally{
        setLoading(false)
      }

    }

    init()

  },[])

  // =============================
  // エリア操作
  // =============================
  const handlePrefectureChange = async(prefId:number)=>{
    setSelectedPrefecture(prefId)
    setSelectedCity(null)
    setSelectedAreas([])

    const data = await (await fetch(`${API_URL}/api/cities?prefecture_id=${prefId}`)).json()
    setCities(data)
  }

  const handleCityChange = async(cityId:number)=>{
    setSelectedCity(cityId)
    setSelectedAreas([])

    const data = await (await fetch(`${API_URL}/api/areas?city_id=${cityId}`)).json()
    setAreas(data)
  }

  // =============================
  // 画像
  // =============================
  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]
    if(file){
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // =============================
  // プラン削除
  // =============================
  const handleDeletePlan = async(id:number)=>{

    if(!confirm("このプランを削除しますか？")) return

    const token = getToken()

    const res = await fetch(`${API_URL}/api/plans/${id}`,{
      method:"DELETE",
      headers:{
        Authorization:`Bearer ${token}`
      }
    })

    if(res.ok){
      setPlans(prev => prev.filter(p => p.id !== id))
    }
  }

  // =============================
  // 更新
  // =============================
  const handleSubmit = async(e:React.FormEvent)=>{

    e.preventDefault()

    try{

      const token = getToken()

      const formData = new FormData()

      formData.append("name",name)
      formData.append("tel",tel)
      formData.append("birth",birth)
      formData.append("record",record)
      formData.append("bio",bio)

      selectedAreas.forEach(id=>formData.append("areas_ids[]",String(id)))
      selectedCategories.forEach(id=>formData.append("categories_ids[]",String(id)))
      selectedSpecialities.forEach(id=>formData.append("specialities_ids[]",String(id)))

      if(image){
        formData.append("profile_image",image)
      }

      formData.append("_method","PUT")

      const res = await fetch(`${API_URL}/api/trainers/profile`,{
        method:"POST",
        headers:{
          Authorization:`Bearer ${token}`
        },
        body:formData
      })

      if(res.ok){
        router.push("/trainer/profile")
      }else{
        alert("更新失敗")
      }

    }catch(err){
      console.error(err)
      alert("通信エラー")
    }
  }

  if(loading) return <div>Loading...</div>

  return (
    <Box sx={{p:4}}>

      <Typography variant="h4" sx={{mb:3}}>
        プロフィール編集
      </Typography>

      <Card sx={{maxWidth:600}}>
        <CardContent>

          <Stack spacing={3} component="form" onSubmit={handleSubmit}>

            <TextField label="名前" value={name} onChange={e=>setName(e.target.value)} fullWidth />
            <TextField label="電話番号" value={tel} onChange={e=>setTel(e.target.value)} fullWidth />
            <TextField label="生年月日" type="date" value={birth} onChange={e=>setBirth(e.target.value)} InputLabelProps={{shrink:true}} fullWidth />
            <TextField label="実績" value={record} onChange={e=>setRecord(e.target.value)} fullWidth />
            <TextField label="自己紹介" value={bio} onChange={e=>setBio(e.target.value)} multiline rows={4} fullWidth />

            {/* プラン */}
            <Typography variant="h6">プラン</Typography>

            {plans.length === 0 && (
              <Typography>プランがまだありません</Typography>
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
              onClick={()=>router.push("/trainer/plan/create")}
            >
              プラン追加
            </Button>

            <input type="file" onChange={handleImageChange}/>
            {imagePreview && <img src={imagePreview} width={120}/>}

            <Button type="submit" variant="contained">
              更新
            </Button>

          </Stack>

        </CardContent>
      </Card>

    </Box>
  )
}