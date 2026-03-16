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

  // 基本情報
  const [name,setName] = useState("")
  const [tel,setTel] = useState("")
  const [birth,setBirth] = useState("")
  const [record,setRecord] = useState("")
  const [bio,setBio] = useState("")
  const [loading,setLoading] = useState(true)

  // エリア
  const [prefectures,setPrefectures] = useState<Prefecture[]>([])
  const [cities,setCities] = useState<City[]>([])
  const [areas,setAreas] = useState<Area[]>([])

  const [selectedPrefecture,setSelectedPrefecture] = useState<number | null>(null)
  const [selectedCity,setSelectedCity] = useState<number | null>(null)
  const [selectedAreas,setSelectedAreas] = useState<number[]>([])

  // カテゴリ
  const [categories,setCategories] = useState<Category[]>([])
  const [specialities,setSpecialities] = useState<Speciality[]>([])
  const [selectedCategories,setSelectedCategories] = useState<number[]>([])
  const [selectedSpecialities,setSelectedSpecialities] = useState<number[]>([])

  // プラン
  const [plans,setPlans] = useState<Plan[]>([])

  // 画像
  const [image,setImage] = useState<File | null>(null)
  const [imagePreview,setImagePreview] = useState<string | null>(null)

  useEffect(()=>{

    const init = async()=>{

      console.log("===== INIT START =====")

      // マスター取得
      const [prefsRes,catsRes,specsRes] = await Promise.all([
        fetch(`${API_URL}/api/prefectures`),
        fetch(`${API_URL}/api/categories`),
        fetch(`${API_URL}/api/specialities`)
      ])

      const prefs:Prefecture[] = await prefsRes.json()
      const cats:Category[] = await catsRes.json()
      const specs:Speciality[] = await specsRes.json()

      console.log("PREFECTURES",prefs)
      console.log("CATEGORIES",cats)
      console.log("SPECIALITIES",specs)

      setPrefectures(prefs)
      setCategories(cats)
      setSpecialities(specs)

      // CSRF
      await fetch(`${API_URL}/sanctum/csrf-cookie`,{credentials:"include"})

      const xsrfToken = decodeURIComponent(
        document.cookie.split("; ")
        .find(row=>row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1] ?? ""
      )

      console.log("XSRF TOKEN",xsrfToken)

      // プロフィール取得
      const res = await fetch(`${API_URL}/api/trainers/profile`,{
        credentials:"include",
        headers:{
          Accept:"application/json",
          "X-XSRF-TOKEN":xsrfToken
        }
      })

      const data = await res.json()

      console.log("===== PROFILE DATA =====")
      console.log(data)

      // 基本情報
      setName(data.user.name)
      setTel(data.tel ?? "")
      setBirth(data.birth ?? "")
      setRecord(data.record ?? "")
      setBio(data.bio ?? "")

      console.log("BASIC INFO",{
        name:data.user.name,
        tel:data.tel,
        birth:data.birth,
        record:data.record
      })

      // カテゴリ
      const catIds = data.categories.map((c:Category)=>c.id)
      const specIds = data.specialities.map((s:Speciality)=>s.id)

      console.log("CATEGORY IDS",catIds)
      console.log("SPECIALITY IDS",specIds)

      setSelectedCategories(catIds)
      setSelectedSpecialities(specIds)

      setPlans(data.plans ?? [])

      // エリア復元
      if(data.areas && data.areas.length > 0){

        console.log("AREAS RAW",data.areas)

        const firstArea = data.areas[0]

        const prefId = firstArea.city.prefecture.id
        const cityId = firstArea.city.id
        const areaIds = data.areas.map((a:Area)=>a.id)

        console.log("RESTORE AREA",{
          prefId,
          cityId,
          areaIds
        })

        setSelectedPrefecture(prefId)

        const citiesRes = await fetch(`${API_URL}/api/cities?prefecture_id=${prefId}`)
        const citiesData:City[] = await citiesRes.json()

        console.log("CITIES",citiesData)

        setCities(citiesData)

        setSelectedCity(cityId)

        const areasRes = await fetch(`${API_URL}/api/areas?city_id=${cityId}`)
        const areasData:Area[] = await areasRes.json()

        console.log("AREAS",areasData)

        setAreas(areasData)
        setSelectedAreas(areaIds)
      }

      console.log("===== INIT END =====")

      setLoading(false)
    }

    init()

  },[])

  const fetchCities = async(prefId:number)=>{

    console.log("FETCH CITIES",prefId)

    const res = await fetch(`${API_URL}/api/cities?prefecture_id=${prefId}`)
    const data:City[] = await res.json()

    console.log("CITIES RESULT",data)

    setCities(data)
  }

  const fetchAreas = async(cityId:number)=>{

    console.log("FETCH AREAS",cityId)

    const res = await fetch(`${API_URL}/api/areas?city_id=${cityId}`)
    const data:Area[] = await res.json()

    console.log("AREAS RESULT",data)

    setAreas(data)
  }

  const handlePrefectureChange = async(prefId:number)=>{
    console.log("CHANGE PREF",prefId)

    setSelectedPrefecture(prefId)
    setSelectedCity(null)
    setSelectedAreas([])

    await fetchCities(prefId)
  }

  const handleCityChange = async(cityId:number)=>{
    console.log("CHANGE CITY",cityId)

    setSelectedCity(cityId)
    setSelectedAreas([])

    await fetchAreas(cityId)
  }

  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>)=>{

    const file = e.target.files?.[0]

    if(file){

      console.log("IMAGE SELECTED",file)

      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async(e:React.FormEvent)=>{

    e.preventDefault()

    console.log("===== SUBMIT START =====")

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

    console.log("SUBMIT DATA",{
      name,
      tel,
      birth,
      record,
      bio,
      selectedAreas,
      selectedCategories,
      selectedSpecialities
    })

    await fetch(`${API_URL}/sanctum/csrf-cookie`,{credentials:"include"})

    const xsrfToken = decodeURIComponent(
      document.cookie.split("; ")
      .find(row=>row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1] ?? ""
    )

    const res = await fetch(`${API_URL}/api/trainers/profile`,{
      method:"PUT",
      credentials:"include",
      headers:{
        Accept:"application/json",
        "X-XSRF-TOKEN":xsrfToken
      },
      body:formData
    })

    console.log("UPDATE RESULT",res)

    if(res.ok){

      console.log("PROFILE UPDATED SUCCESS")

      router.push("/trainer/profile")
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

            <TextField
              label="名前"
              value={name}
              onChange={e=>setName(e.target.value)}
              fullWidth
            />

            <TextField
              label="電話番号"
              value={tel}
              onChange={e=>setTel(e.target.value)}
              fullWidth
            />

            <TextField
              label="生年月日"
              type="date"
              value={birth}
              onChange={e=>setBirth(e.target.value)}
              InputLabelProps={{shrink:true}}
              fullWidth
            />

            <TextField
              label="実績"
              value={record}
              onChange={e=>setRecord(e.target.value)}
              fullWidth
            />

            <TextField
              label="自己紹介"
              value={bio}
              onChange={e=>setBio(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />

            <Typography variant="h6">
              カテゴリー
            </Typography>

            <Select
              multiple
              value={selectedCategories}
              onChange={(e)=>setSelectedCategories(e.target.value as number[])}
              input={<OutlinedInput />}
              renderValue={(selected)=>(
                <Box sx={{display:"flex",flexWrap:"wrap",gap:0.5}}>
                  {(selected as number[]).map(id=>{
                    const cat = categories.find(c=>c.id===id)
                    return <Chip key={id} label={cat?.name}/>
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
              fullWidth
            >
              {categories.map(cat=>(
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="h6">
              得意分野
            </Typography>

            <Select
              multiple
              value={selectedSpecialities}
              onChange={(e)=>setSelectedSpecialities(e.target.value as number[])}
              input={<OutlinedInput />}
              renderValue={(selected)=>(
                <Box sx={{display:"flex",flexWrap:"wrap",gap:0.5}}>
                  {(selected as number[]).map(id=>{
                    const sp = specialities.find(s=>s.id===id)
                    return <Chip key={id} label={sp?.name}/>
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
              fullWidth
            >
              {specialities.map(sp=>(
                <MenuItem key={sp.id} value={sp.id}>
                  {sp.name}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="h6">
              エリア
            </Typography>

            <Select
              value={selectedPrefecture ?? ""}
              onChange={e=>handlePrefectureChange(Number(e.target.value))}
              fullWidth
            >
              {prefectures.map(pref=>(
                <MenuItem key={pref.id} value={pref.id}>
                  {pref.name}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={selectedCity ?? ""}
              onChange={e=>handleCityChange(Number(e.target.value))}
              disabled={!selectedPrefecture}
              fullWidth
            >
              {cities.map(city=>(
                <MenuItem key={city.id} value={city.id}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>

            <Select
              multiple
              value={selectedAreas}
              onChange={e=>setSelectedAreas(e.target.value as number[])}
              disabled={!selectedCity}
              input={<OutlinedInput />}
              renderValue={(selected)=>(
                <Box sx={{display:"flex",flexWrap:"wrap",gap:0.5}}>
                  {(selected as number[]).map(id=>{
                    const area = areas.find(a=>a.id===id)
                    return <Chip key={id} label={area?.name}/>
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
              fullWidth
            >
              {areas.map(area=>(
                <MenuItem key={area.id} value={area.id}>
                  {area.name}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="h6">
              プラン
            </Typography>

            {plans.map((plan:Plan)=>(
              <Card key={plan.id} sx={{p:2}}>

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
                  <Typography>
                    {plan.description}
                  </Typography>
                )}

              </Card>
            ))}
            <input type="file" onChange={handleImageChange}/>

            {imagePreview && (
              <img src={imagePreview} width={120}/>
            )}

            <Button type="submit" variant="contained">
              更新
            </Button>

          </Stack>

        </CardContent>

      </Card>

    </Box>
  )
}