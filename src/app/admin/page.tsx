// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  List,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getToken, removeToken } from "@/utils/api";

import {
  AdminServiceList,
  type AdminServiceItem,
} from "@/components/lists/adminServiceList";
import { AdminCalendar } from "@/components/adminCalendar";
import { ContentManagement } from "@/components/contentManagement";
import { WhatsAppManagement } from "@/components/whatsappManagement";
import AdminHeader from "@/components/navigation/adminHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface Servico {
  id: string;
  nome: string;
  title?: string;
  valor: number;
  price?: number;
  ativo: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Estados principais
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [agendamentos, setAgendamentos] = useState<AdminServiceItem[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Função para forçar refresh da lista
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Verificação de autenticação
  useEffect(() => {
    let cancel = false;

    const checkAuth = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error("No token found");
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("unauthorized");
        }

        const userData = await res.json();

        if (!userData.user?.role || userData.user.role !== "admin") {
          if (!cancel) {
            toast.error(
              "Acesso negado. Apenas administradores podem acessar esta área."
            );
            router.replace("/cliente");
          }
          return;
        }

        if (!cancel) {
          setUser(userData.user);
          setChecking(false);
        }
      } catch {
        if (!cancel) {
          removeToken();
          router.replace("/login?next=/admin");
        }
      }
    };

    checkAuth();
    return () => {
      cancel = true;
    };
  }, [router]);

  // Buscar serviços disponíveis
  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const token = getToken();
        const headers: Record<string, string> = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}/api/services`, {
          headers,
        });

        if (res.ok) {
          const data = await res.json();

          // Mapear dados de services para o formato esperado
          const servicosMapeados = (data.data || []).map(
            (service: Record<string, unknown>) => ({
              id: service.id || service.service_id,
              nome: service.title || service.nome,
              title: service.title,
              valor: Number(service.price || service.valor || 0),
              price: service.price || service.valor,
              ativo: true, // services são sempre ativos
            })
          );

          setServicos(servicosMapeados);
        }
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      }
    };

    if (user?.role === "admin") {
      fetchServicos();
    }
  }, [user, refreshKey]);

  // Buscar TODOS os agendamentos (admin vê tudo)
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchAgendamentos = async () => {
      try {
        setLoading(true);

        const token = getToken();
        const headers: Record<string, string> = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(
          `${API_URL}/api/agendamentos?page=1&page_size=100`,
          {
            headers,
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            router.replace("/login");
            return;
          }
          throw new Error(`HTTP ${res.status}: Erro ao buscar agendamentos`);
        }

        const data = await res.json();

        // Interface para o item retornado pela API
        interface AgendamentoApiItem {
          id: string;
          data: string;
          horario: string;
          servico: string;
          servico_nome?: string;
          servico_valor?: number;
          modelo_veiculo: string;
          cor: string;
          placa: string;
          observacoes: string;
          status: string;
          valor?: number;
          usuario_id: string;
          usuario_nome?: string;
          usuario_email?: string;
          usuario_telefone?: string;
          created_at: string;
          updated_at: string;
        }

        // Converte os dados da API para o formato do AdminServiceList
        const agendamentosFormatados: AdminServiceItem[] =
          data.data?.map((item: AgendamentoApiItem) => {
            // Extrai data limpa (sem hora)
            let dataLimpa = "";
            if (item.data) {
              dataLimpa = item.data.split("T")[0];
            }

            // Busca o valor do serviço na lista de serviços
            const servicoInfo = servicos.find(
              (s) =>
                s.nome === item.servico ||
                s.nome === item.servico_nome ||
                s.title === item.servico ||
                s.title === item.servico_nome
            );
            // Usa o valor do backend se disponível, senão busca na lista de serviços, senão usa valor padrão
            const valor =
              Number(item.servico_valor) ||
              Number(servicoInfo?.valor) ||
              Number(servicoInfo?.price) ||
              50;

            return {
              id: item.id,
              datetime: `${dataLimpa}T${item.horario || "09:00"}`,
              servico: item.servico_nome || item.servico, // Nome do serviço
              veiculo: item.modelo_veiculo,
              modelo_veiculo: item.modelo_veiculo,
              cor: item.cor,
              placa: item.placa,
              data: dataLimpa,
              horario: item.horario,
              observacoes: item.observacoes,
              status: item.status,
              valor: valor,
              // Dados do cliente CORRETOS (do JOIN)
              cliente: {
                id: item.usuario_id,
                nome: item.usuario_nome || "Cliente não encontrado",
                email: item.usuario_email || "",
                telefone: item.usuario_telefone || "",
              },
              created_at: item.created_at,
              updated_at: item.updated_at,
            };
          }) || [];

        setAgendamentos(agendamentosFormatados);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        toast.error("Erro ao carregar agendamentos");
        setAgendamentos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamentos();
  }, [user, refreshKey, router, servicos]);

  // Loading inicial
  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">
            Verificando permissões...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Cálculos de estatísticas
  const stats = {
    total: agendamentos.length,
    agendados: agendamentos.filter((a) => a.status === "agendado").length,
    em_andamento: agendamentos.filter((a) => a.status === "em_andamento")
      .length,
    concluidos: agendamentos.filter((a) => a.status === "finalizado").length,
    cancelados: agendamentos.filter((a) => a.status === "cancelado").length,
  };

  // Receita do dia atual
  const hoje = new Date().toISOString().split("T")[0];
  // No arquivo admin/page.tsx
  const receitaHoje = agendamentos
    .filter((a) => a.status === "finalizado" && a.data === hoje) // Mudança aqui
    .reduce((sum, a) => sum + Number(a.valor || 0), 0);

  // Receita do mês atual
  const mesAtual = new Date().toISOString().substring(0, 7); // YYYY-MM
  const receitaMes = agendamentos
    .filter((a) => a.status === "finalizado" && a.data?.startsWith(mesAtual)) // Mudança aqui
    .reduce((sum, a) => sum + Number(a.valor || 0), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <AdminHeader
        currentPage="dashboard"
        userName={user.nome}
        onWhatsAppClick={() => setShowWhatsApp(!showWhatsApp)}
      />

      {/* Conteúdo Principal */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {showWhatsApp ? (
          <WhatsAppManagement onClose={() => setShowWhatsApp(false)} />
        ) : showContent ? (
          <ContentManagement onClose={() => setShowContent(false)} />
        ) : (
          <>
            {/* ✅ ESTATÍSTICAS - LAYOUT 2 LINHAS: 4 + 3 CARDS */}
            <div className="space-y-4 mb-8">
              {/* Primeira linha - 4 cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                <div className="bg-[var(--card-bg)] rounded-xl p-3 sm:p-4 shadow-sm border border-[var(--card-border)]">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                        Total
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-[var(--foreground)]">
                        {stats.total}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] rounded-xl p-3 sm:p-4 shadow-sm border border-[var(--card-border)]">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                        Agendados
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-[var(--foreground)]">
                        {stats.agendados}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] rounded-xl p-3 sm:p-4 shadow-sm border border-[var(--card-border)]">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                        Andamento
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-[var(--foreground)]">
                        {stats.em_andamento}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] rounded-xl p-3 sm:p-4 shadow-sm border border-[var(--card-border)]">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                        Concluídos
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-[var(--foreground)]">
                        {stats.concluidos}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Segunda linha - 3 cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-[var(--card-bg)] rounded-xl p-3 sm:p-4 shadow-sm border border-[var(--card-border)]">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                        Cancelados
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-[var(--foreground)]">
                        {stats.cancelados}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] rounded-xl p-3 sm:p-4 shadow-sm border border-[var(--card-border)]">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                        Receita Hoje
                      </p>
                      <p className="text-base sm:text-xl font-bold text-[var(--foreground)]">
                        {formatCurrency(receitaHoje)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] rounded-xl p-3 sm:p-4 shadow-sm border border-[var(--card-border)]">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                        Receita Mês
                      </p>
                      <p className="text-base sm:text-xl font-bold text-[var(--foreground)]">
                        {formatCurrency(receitaMes)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Todos os Agendamentos ({agendamentos.length})
              </h2>

              <div className="flex items-center space-x-3">
                {/* Toggle de visualização */}
                <div className="flex items-center bg-[var(--muted)] rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-xs sm:text-sm transition-colors ${
                      viewMode === "list"
                        ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <List size={16} />
                    <span className="hidden sm:inline">Lista</span>
                  </button>
                  <button
                    onClick={() => setViewMode("calendar")}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-xs sm:text-sm transition-colors ${
                      viewMode === "calendar"
                        ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Calendar size={16} />
                    <span className="hidden sm:inline">Calendário</span>
                  </button>
                </div>

                <button
                  onClick={handleRefresh}
                  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Carregando..." : "Atualizar"}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
                  <p className="text-[var(--muted-foreground)]">
                    Carregando agendamentos...
                  </p>
                </div>
              </div>
            ) : viewMode === "calendar" ? (
              <AdminCalendar
                agendamentos={agendamentos}
                currentDate={calendarDate}
                onDateChange={setCalendarDate}
                onDayClick={(date, dayAgendamentos) => {
                  // Opcional: mostrar detalhes dos agendamentos do dia
                  console.log("Day clicked:", date, dayAgendamentos);
                }}
              />
            ) : (
              <AdminServiceList
                items={agendamentos}
                onRefresh={handleRefresh}
              />
            )}
          </>
        )}
      </section>
    </main>
  );
}
