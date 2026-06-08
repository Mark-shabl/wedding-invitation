"use client";

import { useState } from "react";
import { useProgram, useCreateProgram, useDeleteProgram } from "@/lib/api";
import { QueryError } from "@/components/query-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export default function ProgramPage() {
  const { data, isLoading, isError, error } = useProgram();
  const create = useCreateProgram();
  const del = useDeleteProgram();
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!time || !title) return;
    create.mutate({ time, title, sort_order: (data?.length ?? 0) + 1 }, {
      onSuccess: () => { setTime(""); setTitle(""); },
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Программа</h1>
      <Card className="mb-6 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label>Время</Label>
            <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="12:00" className="mt-1" />
          </div>
          <div className="sm:col-span-2">
            <Label>Название</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Церемония" className="mt-1" />
          </div>
        </div>
        <Button onClick={handleAdd} disabled={create.isPending}>Добавить</Button>
      </Card>
      {isLoading ? (
        <p className="text-zinc-500">Загрузка...</p>
      ) : isError ? (
        <QueryError message={error.message} />
      ) : (
        <div className="space-y-2">
          {data?.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-zinc-200">
              <div>
                <span className="font-medium text-zinc-900">{item.time}</span>
                <span className="mx-2 text-zinc-400">—</span>
                <span>{item.title}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => del.mutate(item.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
