import { TrainerSearch } from "@/types"

export const calculateMatchScore = (
  userType: string,
  trainer: TrainerSearch
): number => {

  const style_avg = Number(trainer.style_avg ?? 3)
  const talk_avg = Number(trainer.talk_avg ?? 3)
  const logic_avg = Number(trainer.logic_avg ?? 3)
  const pace_avg = Number(trainer.pace_avg ?? 3)
  const distance_avg = Number(trainer.distance_avg ?? 3)

  let score = 0

  switch (userType) {
    case "ストイック型":
      score =
        style_avg * 0.3 +
        logic_avg * 0.3 +
        pace_avg * 0.2 +
        talk_avg * 0.1 +
        distance_avg * 0.1
      break

    case "エンジョイ型":
      score =
        talk_avg * 0.3 +
        pace_avg * 0.3 +
        distance_avg * 0.2 +
        style_avg * 0.1 +
        logic_avg * 0.1
      break

    case "サポート重視型":
      score =
        talk_avg * 0.3 +
        distance_avg * 0.3 +
        pace_avg * 0.2 +
        logic_avg * 0.1 +
        style_avg * 0.1
      break

    case "マイペース型":
      score =
        pace_avg * 0.3 +
        distance_avg * 0.3 +
        logic_avg * 0.2 +
        talk_avg * 0.1 +
        style_avg * 0.1
      break

    default:
      score =
        (style_avg +
          talk_avg +
          logic_avg +
          pace_avg +
          distance_avg) / 5
  }

  return Math.round(score * 10) / 10
}