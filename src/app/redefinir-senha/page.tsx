"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Regex para validar senha: mínimo 6 caracteres, pelo menos 1 maiúscula e 1 número
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

function RedefinirSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificandoToken, setVerificandoToken] = useState(true);
  const [tokenValido, setTokenValido] = useState(false);
  const [senhaRedefinida, setSenhaRedefinida] = useState(false);

  // Verifica se o token é válido ao carregar a página
  useEffect(() => {
    if (!token) {
      toast.error("Token não encontrado na URL");
      setVerificandoToken(false);
      return;
    }

    const verificarToken = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/verify-reset-token/${token}`);
        const data = await res.json();

        if (res.ok && data.valid) {
          setTokenValido(true);
        } else {
          toast.error(data.error || "Token inválido ou expirado");
          setTokenValido(false);
        }
      } catch (error) {
        console.error("Erro ao verificar token:", error);
        toast.error("Erro ao verificar token");
        setTokenValido(false);
      } finally {
        setVerificandoToken(false);
      }
    };

    verificarToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      toast.error("Senha deve conter pelo menos 1 letra maiúscula e 1 número");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Redefinindo senha...");

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao redefinir senha");
      }

      toast.success("Senha redefinida com sucesso!", { id: toastId });
      setSenhaRedefinida(true);

      // Redireciona para login após 3 segundos
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      console.error("Erro:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao redefinir senha",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (verificandoToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022744] via-[#034a7a] to-[#022744] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#034a7a] mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando link...</p>
        </div>
      </div>
    );
  }

  // Token inválido
  if (!tokenValido) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022744] via-[#034a7a] to-[#022744] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Link Inválido ou Expirado
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Este link de recuperação não é mais válido. Ele pode ter expirado ou
            já ter sido utilizado.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/esqueci-senha"
              className="w-full px-6 py-3 bg-[#022744] text-white rounded-lg font-medium hover:bg-[#034a7a] transition-colors"
            >
              Solicitar Novo Link
            </Link>

            <Link
              href="/login"
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Voltar para Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Senha redefinida com sucesso
  if (senhaRedefinida) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022744] via-[#034a7a] to-[#022744] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Senha Redefinida!
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Sua senha foi alterada com sucesso. Você já pode fazer login com sua
            nova senha.
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Redirecionando para o login em 3 segundos...
          </p>

          <Link
            href="/login"
            className="w-full inline-block px-6 py-3 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Ir para o Login
          </Link>
        </div>
      </div>
    );
  }

  // Formulário de redefinição
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022744] via-[#034a7a] to-[#022744] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#022744] to-[#034a7a] p-8 text-center">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Redefinir Senha
          </h1>
          <p className="text-white/80 text-sm">
            Escolha uma senha forte e segura
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nova Senha */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 caracteres, 1 maiúscula, 1 número"
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#034a7a] focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite a senha novamente"
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#034a7a] focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Indicador de força da senha */}
            {newPassword && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Força da senha:</p>
                <div className="flex gap-2">
                  <div
                    className={`h-2 flex-1 rounded ${
                      newPassword.length >= 6 ? "bg-yellow-400" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-2 flex-1 rounded ${
                      newPassword.length >= 8 ? "bg-yellow-400" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-2 flex-1 rounded ${
                      newPassword.length >= 10 &&
                      /[A-Z]/.test(newPassword) &&
                      /[0-9]/.test(newPassword)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  ></div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Redefinindo..." : "Redefinir Senha"}
            </button>
          </form>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 mb-2">
              <strong>Requisitos da Senha:</strong>
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Mínimo de 6 caracteres</li>
              <li>Pelo menos 1 letra maiúscula</li>
              <li>Pelo menos 1 número</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#022744] via-[#034a7a] to-[#022744] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    }>
      <RedefinirSenhaContent />
    </Suspense>
  );
}
