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
  review?: Review | null
}

export type TrainerReservation = {
  id: number
  reserver_at: string
  status: "pending" | "confirmed" | "canceled"
  user: { id: number; name: string }
  plan: { id: number; name: string }
}

export type Like = {
  id: number
  trainer_id: number
  user_id: number
}

export type Review = {
  id: number
  reservation_id: number
  trainer_id: number
  style: number
  talk: number
  logic: number
  pace: number
  distance: number
  created_at?: string
  updated_at?: string

  trainer?: {
    id: number
    user: {
      name: string
    }
  }
}

export type ReviewSummary = {
  style: number | null
  talk: number | null
  logic: number | null
  pace: number | null
  distance: number | null
}