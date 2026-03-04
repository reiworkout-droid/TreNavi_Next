import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div>
      <h1>Profile</h1>
      <button onClick={() => router.push("/index")}>Go to index</button>
    </div>
  );
}