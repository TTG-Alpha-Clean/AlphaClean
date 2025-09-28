"use client";

import AuthLayout from "@/components/navigation/auth-layout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toggle } from "../../components/ui/toggle";
import Link from "next/link";
import { User, Mail, Lock, Phone, Check } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type PhoneInput = { ddd: string; numero: string; is_whatsapp?: boolean };

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


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (senha.length < 6)
      return toast.error("Senha deve ter pelo menos 6 caracteres.");
    if (senha !== confirm) return toast.error("As senhas não coincidem.");

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
          telefones: ddd && numero ? [{ ddd, numero, is_whatsapp: whats }] : []
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
    <AuthLayout>
      {/* Card Header */}
      <div className="px-8 pt-6 pb-4 border-b border-gray-100/50">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9BD60C]/10 to-[#9BD60C]/5 border border-[#9BD60C]/20">
              <User className="w-8 h-8 text-[#9BD60C]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#022744] mb-3">Alpha Clean</div>
          <h1 className="text-xl font-semibold text-[#022744] mb-2">Criar sua conta</h1>
          <p className="text-[#022744]/60 text-sm">Cadastre-se para agendar seus serviços</p>
        </div>
      </div>

      {/* Form Section - Mais compacto */}
      <div className="px-8 py-3 max-h-[65vh] overflow-y-auto">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Informações pessoais - Compactas */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-[#022744] mb-1 block">Nome completo</Label>
              <Input
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="h-10 border-[#022744]/15 rounded-lg focus:ring-2 focus:ring-[#9BD60C] focus:border-[#9BD60C] transition-all duration-200"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-[#022744] mb-1 block">Email</Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 border-[#022744]/15 rounded-lg focus:ring-2 focus:ring-[#9BD60C] focus:border-[#9BD60C] transition-all duration-200"
                required
              />
            </div>

            {/* Senhas em uma linha */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-[#022744] mb-1 block">Senha</Label>
                <Input
                  type="password"
                  placeholder="Min. 6 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="h-10 border-[#022744]/15 rounded-lg focus:ring-2 focus:ring-[#9BD60C] focus:border-[#9BD60C] transition-all duration-200"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-[#022744] mb-1 block">Confirmar</Label>
                <Input
                  type="password"
                  placeholder="Repita a senha"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="h-10 border-[#022744]/15 rounded-lg focus:ring-2 focus:ring-[#9BD60C] focus:border-[#9BD60C] transition-all duration-200"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>

          {/* Telefones - Seção compacta */}
          <div className="border-t border-gray-100/50 pt-3">
            <Label className="text-xs font-medium text-[#022744] mb-2 block">
              Telefone <span className="text-[#022744]/50 font-normal">(opcional)</span>
            </Label>

            <div className="space-y-2">
              {/* Input de telefone simples */}
              <div className="flex gap-2 items-end">
                <div className="w-16">
                  <Input
                    value={ddd}
                    onChange={(e) => setDDD(e.target.value)}
                    placeholder="71"
                    maxLength={2}
                    className="h-9 border-[#022744]/15 rounded focus:ring-1 focus:ring-[#9BD60C] text-center text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="999661709"
                    maxLength={9}
                    className="h-9 border-[#022744]/15 rounded focus:ring-1 focus:ring-[#9BD60C] text-sm"
                  />
                </div>
                <div className="flex items-center gap-1 h-9">
                  <Toggle checked={whats} onChange={setWhats} label="" />
                  <span className="text-xs text-[#022744]/60 whitespace-nowrap">WhatsApp</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botão de cadastro */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#9BD60C] to-[#7fa00a] text-[#022744] font-semibold hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 transition-all duration-200 shadow-md"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-[#022744]/30 border-t-[#022744] rounded-full animate-spin"></div>
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
      <div className="px-8 pb-8 pt-4 border-t border-gray-100/50">
        <div className="text-center">
          <p className="text-[#022744]/60 text-sm mb-3">
            Já possui uma conta?
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full h-11 rounded-xl border-2 border-[#022744]/20 text-[#022744] font-semibold hover:bg-[#022744]/5 hover:border-[#022744]/40 transition-all duration-200"
          >
            Fazer login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
