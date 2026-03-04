"use client";// クライアントサイドで動作するコンポーネントであることを示す

import { useRouter } from "next/navigation";

export default function ClientPage() {
  const router = useRouter();

  return (
    <div>
      <h1>Welcome to the App</h1>
      <button onClick={() => router.push("/search")}>Go to Search</button>
    </div>
  );
}