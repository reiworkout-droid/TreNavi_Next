import { Trainer } from "./trainer"
export * from "./auth"
export * from "./trainer"

export type Plan = {
  id: number
  trainer_id: number
  name: string
  description: string | null
  price: number
  plan_type: string
  duration_minutes: number
  is_active: boolean
  session_count: number | null
}

export type Reservation = {
  id: number
  reserver_at: string
  status: "pending" | "confirmed" | "canceled"
  price_snapshot: number
  plan: Plan
  trainer: Trainer
}

export type TrainerReservation = {
  id: number
  reserver_at: string
  status: "pending" | "confirmed" | "canceled"
  user: { id: number; name: string }
  plan: { id: number; name: string }
}

