import { Trainer } from "./trainer";

// APIから返ってくるユーザー型
export type ApiUser = {
  id: number;
  name: string;
  email: string;
  trainer?: Trainer | null;
};

export type UserProfile = {
  id: number
  name: string
  sex: string | null
  birth: string | null
  tel: string | null
  trainer?: Trainer | null;
}
