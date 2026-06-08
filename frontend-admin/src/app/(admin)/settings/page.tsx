"use client";

import { useEffect, useState } from "react";
import { useSettings, useUpdateSettings, uploadFile } from "@/lib/api";
import { QueryError } from "@/components/query-error";
import type { WeddingSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { photoUrl } from "@/lib/utils";

export default function SettingsPage() {
  const { data, isLoading, isError, error } = useSettings();
  const update = useUpdateSettings();
  const [form, setForm] = useState<WeddingSettings | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading) return <p className="text-zinc-500">Загрузка...</p>;
  if (isError) return <QueryError message={error.message} />;
  if (!form) return null;

  const set = (key: keyof WeddingSettings, value: string) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    set("hero_photo_url", url);
  };

  const handleSave = () => {
    if (form) update.mutate(form);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Настройки приглашения</h1>
      <Card className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Имя жениха</Label>
            <Input value={form.groom_name} onChange={(e) => set("groom_name", e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Имя невесты</Label>
            <Input value={form.bride_name} onChange={(e) => set("bride_name", e.target.value)} className="mt-1" />
          </div>
        </div>
        <div>
          <Label>Дата и время свадьбы</Label>
          <Input
            type="datetime-local"
            value={form.wedding_date?.slice(0, 16)}
            onChange={(e) => set("wedding_date", new Date(e.target.value).toISOString())}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Фото (hero)</Label>
          <Input type="file" accept="image/*" onChange={handleUpload} className="mt-1" />
          {form.hero_photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl(form.hero_photo_url)} alt="Hero" className="mt-2 h-32 rounded-lg object-cover" />
          )}
        </div>
        <div>
          <Label>Текст приветствия</Label>
          <Textarea value={form.welcome_text} onChange={(e) => set("welcome_text", e.target.value)} className="mt-1" rows={4} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Место</Label>
            <Input value={form.venue_name} onChange={(e) => set("venue_name", e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Адрес</Label>
            <Input value={form.venue_address} onChange={(e) => set("venue_address", e.target.value)} className="mt-1" />
          </div>
        </div>
        <div>
          <Label>Яндекс.Карты URL</Label>
          <Input value={form.yandex_map_url} onChange={(e) => set("yandex_map_url", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>Дресс-код</Label>
          <Textarea value={form.dress_code_text} onChange={(e) => set("dress_code_text", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>Текст в footer</Label>
          <Input value={form.footer_text} onChange={(e) => set("footer_text", e.target.value)} className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Accent color</Label>
            <Input type="color" value={form.accent_color} onChange={(e) => set("accent_color", e.target.value)} className="mt-1 h-10" />
          </div>
          <div>
            <Label>Secondary color</Label>
            <Input type="color" value={form.secondary_color} onChange={(e) => set("secondary_color", e.target.value)} className="mt-1 h-10" />
          </div>
        </div>
        {update.isSuccess && <p className="text-sm text-green-600">Сохранено!</p>}
        <Button onClick={handleSave} disabled={update.isPending}>
          {update.isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      </Card>
    </div>
  );
}
