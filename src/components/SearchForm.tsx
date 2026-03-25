"use client"

import {
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
  Card
} from "@mui/material"

import {
  Prefecture,
  City,
  Area,
  Category,
  Speciality
} from "@/types"

type Props = {
  prefectures: Prefecture[]
  cities: City[]
  areas: Area[]
  categories: Category[]
  specialities: Speciality[]

  prefecture: string
  city: string
  area: string
  category: string
  speciality: string
  keyword: string

  setPrefecture: (v: string) => void
  setCity: (v: string) => void
  setArea: (v: string) => void
  setCategory: (v: string) => void
  setSpeciality: (v: string) => void
  setKeyword: (v: string) => void

  onSearch: () => void
}

export default function SearchForm(props: Props) {

  return (
    <Card sx={{ mb: 4, p: 3 }}>
      <Grid container spacing={2}>

        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>都道府県</InputLabel>
            <Select
              value={props.prefecture}
              label="都道府県"
              onChange={(e) => props.setPrefecture(e.target.value)}
            >
              {props.prefectures.map(p => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>市区町村</InputLabel>
            <Select
              value={props.city}
              label="市区町村"
              onChange={(e) => props.setCity(e.target.value)}
            >
              {props.cities.map(c => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>エリア</InputLabel>
            <Select
              value={props.area}
              label="エリア"
              onChange={(e) => props.setArea(e.target.value)}
            >
              {props.areas.map(a => (
                <MenuItem key={a.id} value={a.id}>
                  {a.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>カテゴリー</InputLabel>
            <Select
              value={props.category}
              onChange={(e) => props.setCategory(e.target.value)}
            >
              {props.categories.map(c => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>専門</InputLabel>
            <Select
              value={props.speciality}
              onChange={(e) => props.setSpeciality(e.target.value)}
            >
              {props.specialities.map(s => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            label="名前・実績"
            value={props.keyword}
            onChange={(e) => props.setKeyword(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button variant="contained" onClick={props.onSearch}>
            検索
          </Button>
        </Grid>

      </Grid>
    </Card>
  )
}