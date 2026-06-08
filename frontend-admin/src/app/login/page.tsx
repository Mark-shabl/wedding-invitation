"use client";

import { useState } from "react";
import { useLogin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const login = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ username, password });
      window.location.href = "/";
    } catch {
      // error shown below
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardTitle>Вход в админку</CardTitle>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="username">Логин</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1" required />
          </div>
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" required />
          </div>
          {login.isError && <p className="text-sm text-red-600">{login.error.message}</p>}
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? "Вход..." : "Войти"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
