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
    <Card
      sx={{
        mb: 4,
        p: 3,
        /* MUI sx: 角丸を大きくして柔らかい印象に */
        borderRadius: "16px",
        /* MUI sx: 影を控えめにして圧迫感を軽減 */
        boxShadow: "0 2px 12px -2px rgba(0,0,0,0.06)",
        border: "1px solid #f0f0f0",
        /* MUI sx: 温かみのある背景 */
        backgroundColor: "#fdfcfa",
      }}
      className="p-5" /* Tailwind: 内側余白を広めに */
    >
      <Grid container spacing={2} className="gap-y-1">

        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl
            fullWidth
            sx={{
              /* MUI sx: セレクトボックスの統一スタイル */
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#fff",
                fontSize: "0.875rem",
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#5a9e7c" },
                "&.Mui-focused fieldset": {
                  borderColor: "#5a9e7c",
                  borderWidth: "2px",
                },
              },
              "& .MuiInputLabel-root": {
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.85rem",
                "&.Mui-focused": { color: "#5a9e7c" },
              },
            }}
          >
            <InputLabel>都道府県</InputLabel>
            <Select
              value={props.prefecture}
              label="都道府県"
              onChange={(e) => props.setPrefecture(e.target.value)}
            >
              {props.prefectures.map(p => (
                <MenuItem key={p.id} value={p.id} sx={{ fontSize: "0.875rem" }}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#fff",
                fontSize: "0.875rem",
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#5a9e7c" },
                "&.Mui-focused fieldset": { borderColor: "#5a9e7c", borderWidth: "2px" },
              },
              "& .MuiInputLabel-root": {
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.85rem",
                "&.Mui-focused": { color: "#5a9e7c" },
              },
            }}
          >
            <InputLabel>市区町村</InputLabel>
            <Select
              value={props.city}
              label="市区町村"
              onChange={(e) => props.setCity(e.target.value)}
            >
              {props.cities.map(c => (
                <MenuItem key={c.id} value={c.id} sx={{ fontSize: "0.875rem" }}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#fff",
                fontSize: "0.875rem",
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#5a9e7c" },
                "&.Mui-focused fieldset": { borderColor: "#5a9e7c", borderWidth: "2px" },
              },
              "& .MuiInputLabel-root": {
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.85rem",
                "&.Mui-focused": { color: "#5a9e7c" },
              },
            }}
          >
            <InputLabel>エリア</InputLabel>
            <Select
              value={props.area}
              label="エリア"
              onChange={(e) => props.setArea(e.target.value)}
            >
              {props.areas.map(a => (
                <MenuItem key={a.id} value={a.id} sx={{ fontSize: "0.875rem" }}>
                  {a.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#fff",
                fontSize: "0.875rem",
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#5a9e7c" },
                "&.Mui-focused fieldset": { borderColor: "#5a9e7c", borderWidth: "2px" },
              },
              "& .MuiInputLabel-root": {
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.85rem",
                "&.Mui-focused": { color: "#5a9e7c" },
              },
            }}
          >
            <InputLabel>カテゴリー</InputLabel>
            <Select
              value={props.category}
              onChange={(e) => props.setCategory(e.target.value)}
            >
              {props.categories.map(c => (
                <MenuItem key={c.id} value={c.id} sx={{ fontSize: "0.875rem" }}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#fff",
                fontSize: "0.875rem",
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#5a9e7c" },
                "&.Mui-focused fieldset": { borderColor: "#5a9e7c", borderWidth: "2px" },
              },
              "& .MuiInputLabel-root": {
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.85rem",
                "&.Mui-focused": { color: "#5a9e7c" },
              },
            }}
          >
            <InputLabel>専門</InputLabel>
            <Select
              value={props.speciality}
              onChange={(e) => props.setSpeciality(e.target.value)}
            >
              {props.specialities.map(s => (
                <MenuItem key={s.id} value={s.id} sx={{ fontSize: "0.875rem" }}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          {/* MUI sx: テキストフィールドも同じ角丸・フォーカス色で統一 */}
          <TextField
            label="名前・実績"
            value={props.keyword}
            onChange={(e) => props.setKeyword(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#fff",
                fontSize: "0.875rem",
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#5a9e7c" },
                "&.Mui-focused fieldset": { borderColor: "#5a9e7c", borderWidth: "2px" },
              },
              "& .MuiInputLabel-root": {
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.85rem",
                "&.Mui-focused": { color: "#5a9e7c" },
              },
            }}
          />
        </Grid>

        {/* Tailwind: 検索ボタンを右寄せ or フル幅で目立たせる */}
        <Grid size={{ xs: 12 }} className="pt-2">
          {/* MUI sx: メインCTAをコーラルオレンジで強調 */}
          <Button
            variant="contained"
            onClick={props.onSearch}
            sx={{
              borderRadius: "999px",
              backgroundColor: "#e8734a",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.95rem",
              textTransform: "none",
              px: 5,
              py: 1.3,
              boxShadow: "0 4px 16px -2px rgba(232,115,74,0.35)",
              fontFamily: "'Noto Sans JP', sans-serif",
              "&:hover": {
                backgroundColor: "#d4623c",
                boxShadow: "0 6px 20px -2px rgba(232,115,74,0.45)",
              },
            }}
            className="w-full sm:w-auto" /* Tailwind: スマホではフル幅、PC では自動幅 */
          >
            検索
          </Button>
        </Grid>

      </Grid>
    </Card>
  )
}
