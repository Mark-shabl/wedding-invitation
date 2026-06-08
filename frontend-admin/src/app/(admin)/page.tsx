"use client";

import { useDashboard } from "@/lib/api";
import { QueryError } from "@/components/query-error";
import { Card, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard();

  const stats = [
    { label: "Всего гостей", value: data?.total_guests, color: "text-zinc-900" },
    { label: "Подтвердили", value: data?.confirmed, color: "text-green-600" },
    { label: "Отказали", value: data?.declined, color: "text-red-600" },
    { label: "Без ответа", value: data?.no_response, color: "text-amber-600" },
    { label: "Придут (чел.)", value: data?.total_attendees, color: "text-blue-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Дашборд</h1>
      {isLoading ? (
        <p className="text-zinc-500">Загрузка...</p>
      ) : isError ? (
        <QueryError message={error.message} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <p className="text-sm text-zinc-500">{s.label}</p>
              <CardTitle>
                <span className={s.color}>{s.value ?? 0}</span>
              </CardTitle>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
