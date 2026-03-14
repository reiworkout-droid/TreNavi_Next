"use client"

import { useEffect, useState } from "react"
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from "@mui/material"

const API = process.env.NEXT_PUBLIC_API_URL

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

type Props = {
  areasIds: number[]
  setAreasIds: React.Dispatch<React.SetStateAction<number[]>>
}

export default function AreaSelector({ areasIds, setAreasIds }: Props) {

  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [areas, setAreas] = useState<Area[]>([])

  const [prefecture, setPrefecture] = useState<number>(0)
  const [city, setCity] = useState<number>(0)

  // 都道府県取得
  useEffect(() => {
    fetch(`${API}/api/prefectures`)
      .then(res => res.json())
      .then((data: Prefecture[]) => setPrefectures(data))
  }, [])

  // 市区町村取得
  useEffect(() => {
    if (!prefecture) return

    fetch(`${API}/api/cities?prefecture_id=${prefecture}`)
      .then(res => res.json())
      .then((data: City[]) => {
        setCities(data)
        setCity(0)       // 都道府県変更時に市区町村リセット
        setAreas([])     // エリアもリセット
        setAreasIds([])
      })

  }, [prefecture])

  // エリア取得
  useEffect(() => {
    if (!city) return

    fetch(`${API}/api/areas?city_id=${city}`)
      .then(res => res.json())
      .then((data: Area[]) => {
        setAreas(data)
        setAreasIds([])  // 市区町村変更時にエリアリセット
      })

  }, [city])

  return (
    <>
    
    {/* 都道府県 */}
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel>都道府県</InputLabel>
      <Select<number>
        value={prefecture}
        label="都道府県"
        onChange={(e: SelectChangeEvent<number>) =>
          setPrefecture(Number(e.target.value))
        }
      >
        {prefectures.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* 市区町村 */}
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel>市区町村</InputLabel>
      <Select<number>
        value={city}
        label="市区町村"
        onChange={(e: SelectChangeEvent<number>) =>
          setCity(Number(e.target.value))
        }
      >
        {cities.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

        {/* エリア */}
    <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>エリア</InputLabel>

        <Select
            multiple
            value={areasIds.map(String)}
            label="エリア"
            onChange={(e) =>
            setAreasIds((e.target.value as string[]).map(Number))
            }
        >
            {areas.map((a) => (
            <MenuItem key={a.id} value={String(a.id)}>
                {a.name}
            </MenuItem>
            ))}
        </Select>

    </FormControl>
    </>
  )
}