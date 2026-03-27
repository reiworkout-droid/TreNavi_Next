import { Trainer } from "./trainer";

// APIから取得するユーザー型（Header 用）
export type ApiUser = {
  id: number;
  name: string;
  email: string;
  trainer?: Pick<Trainer, "id"> | null;
};

// ユーザーロールの型定義
export type UserRole = "trainer" | "client" | "admin";

// 登録フォームの型定義
export type Register ={
    id: number;
    name: string;
    email: string;
    password: string;
    roles: UserRole[];
    sex: string | null;
    birth: string | null;
    tel: string | null;
};

// ログインフォームの型定義
export type Login ={
    email: string;
    password: string;
};

