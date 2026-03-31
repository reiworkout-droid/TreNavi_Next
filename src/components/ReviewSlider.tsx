"use client"

import {
  Card,
  CardContent,
  Typography,
  Slider
} from "@mui/material"

type Props = {
  label: string
  left: string
  right: string
  value: number
  onChange: (value: number) => void
  marks: { value: number; label: string }[]
}

export default function ReviewSlider({
  label,
  left,
  right,
  value,
  onChange,
  marks
}: Props) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent sx={{ px: 3, py: 2.5 }}>
        <Typography
          mb={2}
          fontWeight="bold"
          sx={{ fontSize: "1rem", color: "text.primary" }}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.8rem" }}
          className="mb-3"
        >
          {left} ← → {right}
        </Typography>

        <Slider
          value={value}
          min={1}
          max={5}
          step={1}
          marks={marks}
          onChange={(_, newValue) => onChange(newValue as number)}
          sx={{
            color: "primary.main", // ← ここがテーマの色になる
            height: 8,

            "& .MuiSlider-thumb": {
              width: 22,
              height: 22,
              bgcolor: "primary.main", // ← 明示的にテーマ使用
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            },

            "& .MuiSlider-track": {
              bgcolor: "primary.main", // ← トラックも統一
            },

            "& .MuiSlider-rail": {
              bgcolor: "rgba(90,158,124,0.2)", // ← primaryの薄い版（背景）
            },

            "& .MuiSlider-markLabel": {
              fontSize: "0.75rem",
              color: "text.secondary",
            },
          }}
        />
      </CardContent>
    </Card>
  )
}