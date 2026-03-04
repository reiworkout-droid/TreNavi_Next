"use client";

import { useRouter } from "next/navigation";

export default function SelectModePage() {
  const router = useRouter();

  return (
    <div>
      <h1>Select Mode</h1>
      <button onClick={() => router.push("/trainer")}>トレーナーとして入る</button>
      <button onClick={() => router.push("/client")}>クライアントとして入る</button>
    </div>
  );
}