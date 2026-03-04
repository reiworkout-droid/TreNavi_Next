"use client";

import { useRouter } from "next/navigation";

export default function Trainer() {
  const router = useRouter();

  return (
    <div>
      <h1>Trainer</h1>
        <button onClick={() => router.push("/select-mode")}>ログイン（仮）</button>
    </div>
  );
}