import { Trainer } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL;


// CSRF cookie 取得
const fetchCsrf = async () => {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: "include" });
};

// いいね済みトレーナー取得
export const fetchLikedTrainers = async (): Promise<Trainer[]> => {
  await fetchCsrf();
  const res = await fetch(`${API_URL}/api/trainers/liked`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("liked取得失敗");
  return res.json();
};

// いいね
export const likeTrainer = async (trainerId: number) => {
  await fetchCsrf();
  const xsrfToken = document.cookie
    .split("; ")
    .find(row => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1] ?? "";

  const res = await fetch(`${API_URL}/api/trainers/${trainerId}/like`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("いいね失敗");
};

// いいね取り消し
export const unlikeTrainer = async (trainerId: number) => {
  await fetchCsrf();
  const xsrfToken = document.cookie
    .split("; ")
    .find(row => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1] ?? "";

  const res = await fetch(`${API_URL}/api/trainers/${trainerId}/like`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("いいね取り消し失敗");
};