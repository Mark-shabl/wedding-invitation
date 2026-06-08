"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Calendar,
  HelpCircle,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { clearToken } from "@/lib/auth";

const links = [
  { href: "/", label: "Дашборд", icon: LayoutDashboard },
  { href: "/settings", label: "Настройки", icon: Settings },
  { href: "/program", label: "Программа", icon: Calendar },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/guests", label: "Гости", icon: Users },
  { href: "/rsvps", label: "Отклики", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = () => {
    clearToken();
    router.push("/login");
  };

  const nav = (
    <>
      <div className="p-6 border-b border-zinc-200">
        <p className="font-semibold text-zinc-900">Свадьба</p>
        <p className="text-xs text-zinc-500">Админ-панель</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors min-h-[44px]",
              pathname === href ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-200">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100 min-h-[44px]"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-zinc-200 shadow-sm"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-zinc-200 bg-white">
        {nav}
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white flex flex-col shadow-xl">{nav}</aside>
        </div>
      )}
    </>
  );
}
