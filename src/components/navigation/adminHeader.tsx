"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Users,
  BarChart3,
  Briefcase,
  Menu,
  X,
  Home,
  MessageCircle,
} from "lucide-react";
import { CarLogo } from "@/components/ui/carLogo";
import { removeToken } from "@/utils/api";

type CurrentPage = "dashboard" | "clientes" | "relatorios" | "servicos-site";

interface AdminHeaderProps {
  currentPage?: CurrentPage;
  userName?: string;
  title?: string;
  subtitle?: string;
}

export default function AdminHeader({
  currentPage = "dashboard",
  userName = "Admin",
  title,
  subtitle,
}: AdminHeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: Home,
      key: "dashboard" as CurrentPage,
    },
    {
      name: "Clientes",
      path: "/admin/clientes",
      icon: Users,
      key: "clientes" as CurrentPage,
    },
    {
      name: "Relatórios",
      path: "/admin/relatorios",
      icon: BarChart3,
      key: "relatorios" as CurrentPage,
    },
    {
      name: "Serviços",
      path: "/admin/servicos-site",
      icon: Briefcase,
      key: "servicos-site" as CurrentPage,
    },
  ];

  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <CarLogo />
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-[var(--foreground)]">
                {title || "Alpha Clean"}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                {subtitle || userName}
              </p>
            </div>
          </div>

          {/* Menu Desktop (hidden em mobile) */}
          <div className="hidden md:flex items-center space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => router.push(item.path)}
                  className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </button>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)]
                         hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </div>

          {/* Botão Hamburguer Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)]">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      router.push(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-[var(--primary)] text-white"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 rounded-lg px-3 py-3 text-sm text-red-600
                           hover:bg-red-50 transition-colors border-t border-[var(--border)] mt-2 pt-4"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
