"use client";

import AuthLayout from "@/components/navigation/auth-layout";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { setToken } from "@/utils/api";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type LoginResponse = {
  token: string;
  user: {
    id: string;
    nome: string;
    email: string;
    role: "user" | "admin";
    active: boolean;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tid = toast.loading("Entrando...");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, senha: senha }),
      });

      const data: LoginResponse & { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Erro ao entrar.");

      // Salvar token no localStorage e cookies espelho
      if (data.token) {
        setToken(data.token, data.user.role);
      }

      toast.success("Bem-vindo!", { id: tid });

      const role = data.user.role;

      // Verifica se há uma página para redirecionar
      const nextUrl = searchParams.get("next");

      if (
        nextUrl &&
        (nextUrl.startsWith("/cliente") || nextUrl.startsWith("/admin"))
      ) {
        router.push(nextUrl);
      } else {
        // Redireciona baseado no role
        router.push(role === "admin" ? "/admin" : "/cliente");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao entrar.";
      toast.error(errorMessage, { id: tid });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <h1 className="text-center text-xl font-semibold">Fazer Login</h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label className="mb-1 block">Email</Label>
            <Input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 border-[#022744]/15 focus:ring-2 focus:ring-[#9BD60C]"
              required
            />
          </div>

          <div>
            <Label className="mb-1 block">Senha</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="h-10 border-[#022744]/15 focus:ring-2 focus:ring-[#9BD60C] pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#022744]/60 hover:text-[#022744] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-[#022744] text-white font-medium hover:opacity-90 disabled:opacity-60 transition-colors"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/register" className="text-[#9BD60C] hover:underline">
            Não tem conta? Cadastre-se
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
