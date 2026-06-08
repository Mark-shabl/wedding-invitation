"use client";

import { useState } from "react";
import { useGuests, useCreateGuest, useDeleteGuest } from "@/lib/api";
import { QueryError } from "@/components/query-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Copy, Trash2, Check } from "lucide-react";

export default function GuestsPage() {
  const { data, isLoading, isError, error } = useGuests();
  const create = useCreateGuest();
  const del = useDeleteGuest();
  const [name, setName] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const copyLink = async (url: string, id: number) => {
    await navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    create.mutate(name.trim(), { onSuccess: () => setName("") });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Гости</h1>
      <Card className="mb-6">
        <Label>Имя гостя</Label>
        <div className="flex gap-2 mt-1">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван Иванов" className="flex-1" />
          <Button onClick={handleAdd} disabled={create.isPending}>Добавить</Button>
        </div>
      </Card>
      {isLoading ? (
        <p className="text-zinc-500">Загрузка...</p>
      ) : isError ? (
        <QueryError message={error.message} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-zinc-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="text-left p-3 font-medium">Имя</th>
                  <th className="text-left p-3 font-medium">RSVP</th>
                  <th className="text-left p-3 font-medium">Ссылка</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {data?.map((g) => (
                  <tr key={g.id} className="border-b border-zinc-100 last:border-0">
                    <td className="p-3">{g.name}</td>
                    <td className="p-3">
                      {!g.rsvp ? (
                        <span className="text-amber-600">Нет ответа</span>
                      ) : g.rsvp.attending ? (
                        <span className="text-green-600">Придёт ({g.rsvp.guests_count})</span>
                      ) : (
                        <span className="text-red-600">Не придёт</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Button variant="outline" size="sm" onClick={() => copyLink(g.invite_url, g.id)}>
                        {copied === g.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span className="ml-2">Копировать</span>
                      </Button>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" onClick={() => del.mutate(g.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {data?.map((g) => (
              <Card key={g.id} className="p-4">
                <p className="font-medium">{g.name}</p>
                <p className="text-sm mt-1">
                  {!g.rsvp ? (
                    <span className="text-amber-600">Нет ответа</span>
                  ) : g.rsvp.attending ? (
                    <span className="text-green-600">Придёт ({g.rsvp.guests_count})</span>
                  ) : (
                    <span className="text-red-600">Не придёт</span>
                  )}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => copyLink(g.invite_url, g.id)}>
                    {copied === g.id ? "Скопировано!" : "Копировать ссылку"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => del.mutate(g.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
