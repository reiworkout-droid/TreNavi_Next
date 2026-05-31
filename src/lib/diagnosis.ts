type DiagnosisData = {
  title: string
  image: string
  description: string
  catch: string
}

export const diagnosisMap: Record<string, DiagnosisData> = {
  ストイック型: {
    title: "ストイックオオカミタイプ",
    image: "/img/halloween_chara4_ookamiotoko.png",
    catch: "目標に一直線、結果重視の努力家",
    description:
      "目標達成に向けて厳しく追い込むタイプ。結果重視で効率よく成長したい人向け。",
  },

  エンジョイ型: {
    title: "エンジョイゴリラタイプ",
    image: "/img/animal_gorilla_drumming.png",
    catch: "楽しく続けることが最優先",
    description:
      "楽しく継続することを重視。モチベーションを保ちながら運動したい人向け。",
  },

  バランス型: {
    title: "バランスネコタイプ",
    image: "/img/pet_cat_sit.png",
    catch: "無理せずちょうどよく続ける",
    description:
      "バランスよくトレーニングしたいタイプ。どんなスタイルにも適応可能。",
  },

  サポート重視型: {
    title: "サポートドッグタイプ",
    image: "/img/akubi_dog.png",
    catch: "支え合いながら成長したい",
    description:
      "優しく支えてくれる環境を好むタイプ。安心感を大事にしたい人向け。",
  },

  マイペース型: {
    title: "マイペースナマケモノタイプ",
    image: "/img/animal_namakemono.png",
    catch: "自分のリズムを大切にする",
    description:
      "自分のリズムで無理なく進めたいタイプ。静かに集中したい人向け。",
  },
}