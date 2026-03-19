// app/page.tsx
import { redirect } from "next/navigation";

export default function Page() {
  // リダイレクトは関数内で呼ぶ
  redirect("/home");

  // return は必須（実際には表示されないが型安全のため）
  return null;
}