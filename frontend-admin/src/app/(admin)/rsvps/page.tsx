"use client";

import { useState } from "react";
import { useRSVPs } from "@/lib/api";
import { QueryError } from "@/components/query-error";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const filters = [
  { value: "", label: "Все ответы" },
  { value: "confirmed", label: "Придут" },
  { value: "declined", label: "Не придут" },
];

export default function RSVPsPage() {
  const [filter, setFilter] = useState("");
  const { data, isLoading, isError, error } = useRSVPs(filter || undefined);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Отклики</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>
      {isLoading ? (
        <p className="text-zinc-500">Загрузка...</p>
      ) : isError ? (
        <QueryError message={error.message} />
      ) : data?.length === 0 ? (
        <p className="text-zinc-500">Нет откликов</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-lg border border-zinc-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b">
                <tr>
                  <th className="text-left p-3">Гость</th>
                  <th className="text-left p-3">Ответ</th>
                  <th className="text-left p-3">Кол-во</th>
                  <th className="text-left p-3">Комментарий</th>
                  <th className="text-left p-3">Дата</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="p-3">{r.guest_name}</td>
                    <td className="p-3">{r.attending ? "Придёт" : "Не придёт"}</td>
                    <td className="p-3">{r.guests_count}</td>
                    <td className="p-3 text-zinc-500">{r.comment || "—"}</td>
                    <td className="p-3 text-zinc-500">
                      {new Date(r.submitted_at).toLocaleString("ru-RU")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {data?.map((r) => (
              <Card key={r.id} className="p-4">
                <p className="font-medium">{r.guest_name}</p>
                <p className="text-sm mt-1">{r.attending ? "✓ Придёт" : "✗ Не придёт"} · {r.guests_count} чел.</p>
                {r.comment && <p className="text-sm text-zinc-500 mt-2">{r.comment}</p>}
                <p className="text-xs text-zinc-400 mt-2">{new Date(r.submitted_at).toLocaleString("ru-RU")}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
