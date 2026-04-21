"use client"

import { TrainerSearch } from "@/types"
import TrainerCard from "./TrainerCard"
import { Grid } from "@mui/material"

type Props = {
  trainers: TrainerSearch[]
  userType: string | null
}

export default function TrainerList({ trainers, userType }: Props) {

  return (
    <Grid container spacing={3}>
      {trainers.map((trainer) => (
        <Grid key={trainer.id} size={{ xs: 12, md: 4 }}>
          <TrainerCard trainer={trainer} userType={userType} />
        </Grid>
      ))}
    </Grid>
  )
}