"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function EsqueciSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Digite seu email");
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Digite um email válido");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Enviando link de recuperação...");

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao solicitar recuperação");
      }

      toast.success(
        "Se o email estiver cadastrado, você receberá as instruções!",
        { id: toastId, duration: 6000 }
      );
      setEmailEnviado(true);
    } catch (error) {
      console.error("Erro:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao solicitar recuperação",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  if (emailEnviado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022744] via-[#034a7a] to-[#022744] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Email Enviado!
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Se o email <strong>{email}</strong> estiver cadastrado em nossa
            plataforma, você receberá um link para redefinir sua senha.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-900 mb-2">
              <strong>Próximos passos:</strong>
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Verifique sua caixa de entrada</li>
              <li>Verifique também a pasta de spam</li>
              <li>O link expira em 1 hora</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full px-6 py-3 bg-[#022744] text-white rounded-lg font-medium hover:bg-[#034a7a] transition-colors flex items-center justify-center gap-2"
            >
              Voltar para Login
            </Link>

            <button
              onClick={() => {
                setEmailEnviado(false);
                setEmail("");
              }}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Enviar para outro email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022744] via-[#034a7a] to-[#022744] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#022744] to-[#034a7a] p-8 text-center">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Esqueceu sua senha?
          </h1>
          <p className="text-white/80 text-sm">
            Não se preocupe! Vamos te ajudar a recuperá-la
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <p className="text-gray-600 mb-6 text-center">
            Digite seu email cadastrado e enviaremos um link para redefinir sua
            senha
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#034a7a] focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar Link de Recuperação"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-[#034a7a] hover:text-[#022744] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o login
            </Link>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Dica:</strong> Caso não receba o email em alguns minutos,
              verifique sua pasta de spam ou lixo eletrônico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
