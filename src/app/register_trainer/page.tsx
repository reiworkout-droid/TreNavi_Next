"use client"
import { Box, Button, Card, CardContent, Chip, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterTrainerForm() {

  const router = useRouter();

  const [tel, setTel] = useState("");
  const [birth, setBirth] = useState("1995-01-01");
  const [record, setRecord] = useState("");
  const [bio, setBio] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSpecialities, setSelectedSpecialities] = useState<number[]>([]);

  // 仮の選択肢データ（実際はAPIから取得）
  const areaOptions = [
    { id: 4, name: "天神・大名・今泉" },
    { id: 5, name: "六本松" },
    { id: 6, name: "赤坂" },
  ];
  const categoryOptions = [
    { id: 1, name: "筋トレ" },
    { id: 2, name: "ヨガ" },
    { id: 3, name: "ピラティス" },
  ];
  const specialityOptions = [
    { id: 1, name: "ダイエット" },
    { id: 2, name: "筋力向上" },
    { id: 3, name: "柔軟性向上" },
  ];

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  console.log("API_URL:", API_URL);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // プレビュー用
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!tel || !birth || !record || !bio) {
      alert("必須項目を入力してください");
      return;
    }

    // ① CSRF Cookie取得
    await fetch(`${API_URL}/sanctum/csrf-cookie`, {
      credentials: "include"
    });

    // ② XSRFトークン取得
    const xsrfToken = decodeURIComponent(
      document.cookie
        .split("; ")
        .find(row => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1] || ""
    );

    const formData = new FormData();
    formData.append("tel", tel);
    formData.append("birth", birth);
    formData.append("record", record);
    formData.append("bio", bio);

    // 画像のキーをprofile_imageに変更
    if(imageFile) {
      formData.append("profile_image", imageFile);
    }

    selectedAreas.forEach(id => formData.append("areas_ids[]", id.toString()));
    selectedCategories.forEach(id => formData.append("categories_ids[]", id.toString()));
    selectedSpecialities.forEach(id => formData.append("specialities_ids[]", id.toString()));

    try {

      // CSRF取得はログイン済み前提
      await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: "include" });
      const xsrfToken = decodeURIComponent(
        document.cookie.split("; ").find(row => row.startsWith("XSRF-TOKEN="))?.split("=")[1] || ""
      );
    
      // const res = await fetch(`${API_URL}/api/trainers`, {
      const res = await fetch(`${API_URL}/api/trainers`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "X-XSRF-TOKEN": xsrfToken
        },
        body: formData,
      });
      const data = await res.json();
      console.log("登録成功:", data);

      router.push("/home"); // 登録後ホームへ
    } catch (err) {
      console.error("登録失敗:", err);
    }
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      {/* カード */}
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">

        <CardContent className="space-y-6">

          <Typography variant="h5" className="text-center font-bold">
            トレーナー登録
          </Typography>

          {/* 電話番号 */}
          <div>
            <Typography className="mb-1 text-sm font-medium">
              電話番号
            </Typography>
            <TextField
              fullWidth
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              placeholder="09012345678"
            />
          </div>

          {/* 生年月日 */}
          <div>
            <Typography className="mb-1 text-sm font-medium">
              生年月日
            </Typography>
            <TextField
              type="date"
              fullWidth
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
            />
          </div>

          {/* 実績 */}
          <div>
            <Typography className="mb-1 text-sm font-medium">
              実績
            </Typography>
            <TextField
              fullWidth
              value={record}
              onChange={(e) => setRecord(e.target.value)}
              placeholder="例：大会優勝 / 指導歴5年"
            />
          </div>

          {/* 自己紹介 */}
          <div>
            <Typography className="mb-1 text-sm font-medium">
              自己紹介
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="トレーニング指導の経験や強みを書いてください"
            />
          </div>

          {/* Material UI マルチセレクト */}
          <Box>
            <Typography className="mb-1 font-medium">エリア</Typography>
            <Select
              multiple
              value={selectedAreas}
              onChange={(e) => setSelectedAreas(e.target.value as number[])}
              input={<OutlinedInput label="エリア" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const area = areaOptions.find(a => a.id === id);
                    return <Chip key={id} label={area?.name} />;
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
              fullWidth
            >
              {areaOptions.map((a) => (
                <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <Typography className="mb-1 font-medium">カテゴリー</Typography>
            <Select
              multiple
              value={selectedCategories}
              onChange={(e) => setSelectedCategories(e.target.value as number[])}
              input={<OutlinedInput label="カテゴリー" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const cat = categoryOptions.find(c => c.id === id);
                    return <Chip key={id} label={cat?.name} />;
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
              fullWidth
            >
              {categoryOptions.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <Typography className="mb-1 font-medium">専門分野</Typography>
            <Select
              multiple
              value={selectedSpecialities}
              onChange={(e) => setSelectedSpecialities(e.target.value as number[])}
              input={<OutlinedInput label="専門分野" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const spec = specialityOptions.find(s => s.id === id);
                    return <Chip key={id} label={spec?.name} />;
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
              fullWidth
            >
              {specialityOptions.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </Select>
          </Box>

          {/* 画像 */}
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="preview" className="w-32 h-32 mt-2 object-cover rounded" />}

          <Button variant="contained" fullWidth size="large" onClick={handleSubmit}>登録</Button>
        </CardContent>
      </Card>
    </main>
  );
}