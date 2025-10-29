"use client";

import AuthLayout from "@/components/navigation/auth-layout";
import { useState, Suspense } from "react";
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

function LoginForm() {
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

      const data: LoginResponse & { error?: string } = await res
        .json()
        .catch(() => ({}));
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
      {/* Card Header com melhor visual */}
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-gray-100/50">
        <div className="text-center">
          <div className="mb-3 sm:mb-4"></div>
          <div className="text-xl sm:text-2xl font-bold text-[#022744] mb-2 sm:mb-3">
            Alpha Clean
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-[#022744] mb-1 sm:mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-[#022744]/60 text-xs sm:text-sm">
            Entre em sua conta para acessar seus agendamentos
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="px-4 sm:px-8 py-4 sm:py-6">
        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label className="text-xs sm:text-sm font-medium text-[#022744] mb-1.5 sm:mb-2 block">
                Email
              </Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 sm:h-12 border-[#022744]/15 rounded-xl focus:ring-2 focus:ring-[#9BD60C] focus:border-[#9BD60C] transition-all duration-200 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <Label className="text-xs sm:text-sm font-medium text-[#022744]">
                  Senha
                </Label>
                <Link
                  href="/esqueci-senha"
                  className="text-[10px] sm:text-xs text-[#9BD60C] hover:text-[#8BC34A] font-medium transition-colors"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="h-11 sm:h-12 border-[#022744]/15 rounded-xl focus:ring-2 focus:ring-[#9BD60C] focus:border-[#9BD60C] pr-10 sm:pr-12 transition-all duration-200 text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-[#022744]/50 hover:text-[#022744] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-1 sm:pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-[#022744] to-[#033a5c] text-white text-sm sm:text-base font-semibold hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 transition-all duration-200 shadow-md"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                "Entrar na minha conta"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer Section */}
      <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-3 sm:pt-4 border-t border-gray-100/50">
        <div className="text-center">
          <p className="text-[#022744]/60 text-xs sm:text-sm mb-2 sm:mb-3">
            Ainda não tem uma conta?
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center w-full h-10 sm:h-11 rounded-xl border-2 border-[#9BD60C]/20 text-[#9BD60C] text-sm sm:text-base font-semibold hover:bg-[#9BD60C]/5 hover:border-[#9BD60C]/40 transition-all duration-200"
          >
            Criar nova conta
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout>
          <div className="px-8 py-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9BD60C]"></div>
            </div>
          </div>
        </AuthLayout>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
