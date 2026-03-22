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
    <Card>
      <CardContent>
        <Typography mb={2} fontWeight="bold">
          {label}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {left} ← → {right}
        </Typography>

        <Slider
          value={value}
          min={1}
          max={5}
          step={1}
          marks={marks}
          onChange={(_, newValue) => onChange(newValue as number)}
        />
      </CardContent>
    </Card>
  )
}