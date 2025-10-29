"use client";

import AuthLayout from "@/components/navigation/auth-layout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toggle } from "../../components/ui/toggle";
import Link from "next/link";
import { User, Eye, EyeOff } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Regex para validar senha: mínimo 6 caracteres, pelo menos 1 maiúscula e 1 número
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

export default function RegisterPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirm, setConfirm] = useState("");
  // Todas as contas criadas via formulário são usuários comuns
  const role = "user";

  const [ddd, setDDD] = useState("");
  const [numero, setNumero] = useState("");
  const [whats, setWhats] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validação de senha com regex
    if (senha.length < 6) {
      return toast.error("Senha deve ter pelo menos 6 caracteres.");
    }

    if (!PASSWORD_REGEX.test(senha)) {
      return toast.error("Senha deve conter pelo menos 1 letra maiúscula e 1 número.");
    }

    if (senha !== confirm) {
      return toast.error("As senhas não coincidem.");
    }

    const tid = toast.loading("Cadastrando...");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senha,
          role,
          telefones: ddd && numero ? [{ ddd, numero, is_whatsapp: whats }] : [],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Erro ao cadastrar.");

      toast.success("Conta criada! Faça login.", { id: tid });
      router.push("/login");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao cadastrar.";
      toast.error(errorMessage, { id: tid });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout maxWidth="max-w-2xl">
      {/* Card Header */}
      <div className="px-4 sm:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-100/50">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-[#022744] mb-2 sm:mb-3">
            Alpha Clean
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-[#022744] mb-1 sm:mb-2">
            Criar sua conta
          </h1>
          <p className="text-[#022744]/60 text-xs sm:text-sm">
            Cadastre-se para agendar seus serviços
          </p>
        </div>
      </div>

      {/* Form Section - Mais compacto e com scroll em mobile */}
      <div className="px-4 sm:px-8 py-3 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto">
        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
          {/* Informações pessoais - Compactas */}
          <div className="space-y-2.5 sm:space-y-3">
            {/* Nome e Email lado a lado no desktop, empilhados no mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <Label className="text-[11px] sm:text-xs font-medium text-[#022744] mb-1 block">
                  Nome completo
                </Label>
                <Input
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="h-9 sm:h-10 text-sm border-[#022744]/15 rounded-lg focus:ring-2 focus:ring-[#9BD60C] focus:border-[#9BD60C] transition-all duration-200"
                  required
                />
              </div>

              <div>
                <Label className="text-[11px] sm:text-xs font-medium text-[#022744] mb-1 block">
                  Email
                </Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 sm:h-10 text-sm border-[#022744]/15 rounded-lg focus:ring-2 focus:ring-[#9BD60C] focus:border-[#9BD60C] transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Senhas em uma linha no desktop, empilhadas no mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <Label className="text-[11px] sm:text-xs font-medium text-[#022744] mb-1 block">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="h-9 sm:h-10 text-sm border-[#022744]/15 rounded-lg focus:ring-2 focus:ring-[#9BD60C] focus:border-[#9BD60C] transition-all duration-200 pr-9 sm:pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-[#022744]/40 hover:text-[#022744]/70 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff size={14} className="sm:w-4 sm:h-4" />
                    ) : (
                      <Eye size={14} className="sm:w-4 sm:h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[9px] sm:text-[10px] text-[#022744]/50 mt-0.5 sm:mt-1">
                  1 maiúscula e 1 número
                </p>
              </div>
              <div>
                <Label className="text-[11px] sm:text-xs font-medium text-[#022744] mb-1 block">
                  Confirmar
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repita a senha"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="h-9 sm:h-10 text-sm border-[#022744]/15 rounded-lg focus:ring-2 focus:ring-[#9BD60C] focus:border-[#9BD60C] transition-all duration-200 pr-9 sm:pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-[#022744]/40 hover:text-[#022744]/70 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={14} className="sm:w-4 sm:h-4" />
                    ) : (
                      <Eye size={14} className="sm:w-4 sm:h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Telefones - Seção compacta */}
          <div className="border-t border-gray-100/50 pt-2.5 sm:pt-3">
            <Label className="text-[11px] sm:text-xs font-medium text-[#022744] mb-1.5 sm:mb-2 block">
              Telefone{" "}
              <span className="text-[#022744]/50 font-normal">(opcional)</span>
            </Label>

            <div className="space-y-2">
              {/* Input de telefone simples */}
              <div className="flex gap-2 items-end">
                <div className="w-14 sm:w-16">
                  <Input
                    value={ddd}
                    onChange={(e) => setDDD(e.target.value)}
                    placeholder="71"
                    maxLength={2}
                    className="h-8 sm:h-9 border-[#022744]/15 rounded focus:ring-1 focus:ring-[#9BD60C] text-center text-xs sm:text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="999661709"
                    maxLength={9}
                    className="h-8 sm:h-9 border-[#022744]/15 rounded focus:ring-1 focus:ring-[#9BD60C] text-xs sm:text-sm"
                  />
                </div>
                <div className="flex items-center gap-1 h-8 sm:h-9">
                  <Toggle checked={whats} onChange={setWhats} label="" />
                  <span className="text-[10px] sm:text-xs text-[#022744]/60 whitespace-nowrap">
                    WhatsApp
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botão de cadastro */}
          <div className="pt-2 sm:pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 sm:h-11 rounded-xl bg-gradient-to-r from-[#9BD60C] to-[#7fa00a] text-[#022744] text-sm sm:text-base font-semibold hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 transition-all duration-200 shadow-md"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-[#022744]/30 border-t-[#022744] rounded-full animate-spin"></div>
                  <span>Criando conta...</span>
                </div>
              ) : (
                "Criar minha conta"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer Section */}
      <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-3 sm:pt-4 border-t border-gray-100/50">
        <div className="text-center">
          <p className="text-[#022744]/60 text-xs sm:text-sm mb-2 sm:mb-3">Já possui uma conta?</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full h-10 sm:h-11 rounded-xl border-2 border-[#022744]/20 text-[#022744] text-sm sm:text-base font-semibold hover:bg-[#022744]/5 hover:border-[#022744]/40 transition-all duration-200"
          >
            Fazer login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
