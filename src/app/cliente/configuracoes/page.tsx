"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Phone, Save, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { getToken, removeToken } from "@/utils/api";
import Header from "@/components/navigation/header";
import Footer from "@/components/navigation/footer";
import Button from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  role: string;
}

export default function ClienteConfiguracoesPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [telefone, setTelefone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Verificação de autenticação
  useEffect(() => {
    let cancel = false;

    const checkAuth = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error("No token found");
        }

        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("unauthorized");
        }

        const userData = await res.json();

        if (!cancel) {
          setUser(userData.user);
          setTelefone(userData.user.telefone || "");
          setChecking(false);
        }
      } catch {
        if (!cancel) {
          removeToken();
          router.replace("/login?next=/cliente/configuracoes");
        }
      }
    };

    checkAuth();
    return () => {
      cancel = true;
    };
  }, [router]);

  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!telefone.trim()) {
      toast.error("Telefone não pode estar vazio");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Atualizando telefone...");

    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ telefone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao atualizar telefone");
      }

      const data = await res.json();
      setUser(data.user);
      toast.success("Telefone atualizado com sucesso!", { id: toastId });
    } catch (error) {
      console.error("Erro ao atualizar telefone:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar telefone",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Preencha todos os campos de senha");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("A nova senha e a confirmação não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Atualizando senha...");

    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/users/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao atualizar senha");
      }

      toast.success("Senha atualizada com sucesso!", { id: toastId });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar senha",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header currentPage="configuracoes" />

      <section className="container mx-auto max-w-4xl px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Configurações
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Gerencie suas informações pessoais e segurança
          </p>
        </div>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] p-6">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              Informações da Conta
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-[var(--muted-foreground)]">
                  Nome
                </label>
                <p className="text-[var(--foreground)]">{user.nome}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--muted-foreground)]">
                  Email
                </label>
                <p className="text-[var(--foreground)]">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Atualizar Telefone */}
          <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-[var(--accent)]" />
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Telefone
              </h2>
            </div>
            <form onSubmit={handleUpdatePhone} className="space-y-4">
              <div>
                <label
                  htmlFor="telefone"
                  className="block text-sm font-medium text-[var(--foreground)] mb-2"
                >
                  Número de Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-2 border border-[var(--card-border)] rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
                           bg-[var(--background)] text-[var(--foreground)]"
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Salvar Telefone
              </Button>
            </form>
          </div>

          {/* Atualizar Senha */}
          <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-[var(--accent)]" />
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Alterar Senha
              </h2>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-[var(--foreground)] mb-2"
                >
                  Senha Atual
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--card-border)] rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
                           bg-[var(--background)] text-[var(--foreground)]"
                  disabled={loading}
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-[var(--foreground)] mb-2"
                >
                  Nova Senha
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--card-border)] rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
                           bg-[var(--background)] text-[var(--foreground)]"
                  disabled={loading}
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[var(--foreground)] mb-2"
                >
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--card-border)] rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
                           bg-[var(--background)] text-[var(--foreground)]"
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Alterar Senha
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
