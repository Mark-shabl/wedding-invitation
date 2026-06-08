"use client";

import { useState } from "react";
import { useFAQ, useCreateFAQ, useDeleteFAQ } from "@/lib/api";
import { QueryError } from "@/components/query-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export default function FAQPage() {
  const { data, isLoading, isError, error } = useFAQ();
  const create = useCreateFAQ();
  const del = useDeleteFAQ();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAdd = () => {
    if (!question || !answer) return;
    create.mutate({ question, answer, sort_order: (data?.length ?? 0) + 1 }, {
      onSuccess: () => { setQuestion(""); setAnswer(""); },
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">FAQ</h1>
      <Card className="mb-6 space-y-4">
        <div>
          <Label>Вопрос</Label>
          <Input value={question} onChange={(e) => setQuestion(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>Ответ</Label>
          <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} className="mt-1" />
        </div>
        <Button onClick={handleAdd} disabled={create.isPending}>Добавить</Button>
      </Card>
      {isLoading ? (
        <p className="text-zinc-500">Загрузка...</p>
      ) : isError ? (
        <QueryError message={error.message} />
      ) : (
        <div className="space-y-3">
          {data?.map((item) => (
            <div key={item.id} className="p-4 bg-white rounded-lg border border-zinc-200">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-medium">{item.question}</p>
                  <p className="text-sm text-zinc-500 mt-1">{item.answer}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => del.mutate(item.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
