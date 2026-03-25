export type Prefecture = {
  id: number
  name: string
}

export type City = {
  id: number
  prefecture_id: number
  name: string
}

export type Area = {
  id: number
  city_id: number
  name: string
}

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


// 一覧・カード用
export type SimplePlan = {
  id: number
  name: string
  price: number
  duration_minutes: number
}



export type Props = {
  areasIds: number[]
  setAreasIds: React.Dispatch<React.SetStateAction<number[]>>
}

export type Category = {
  id: number
  name: string
}

export type Speciality = {
  id: number
  name: string
}

export type User = {
  id: number
  name: string
}

export type Trainer = {
  id: number
  record: string
  bio: string
  profile_image: string | null
  user: User
  areas: Area[]
  categories: Category[]
  specialities: Speciality[]
  plans: Plan[]
  likes_count: number
  is_liked?: boolean
  // レビュー平均
  style_avg?: number
  talk_avg?: number
  logic_avg?: number
  pace_avg?: number
  distance_avg?: number
}

export type TrainerSearch = Trainer & {
  plans_min_price: number | null
}

export type TrainerDetail = Trainer & {
  plans: Plan[]
}