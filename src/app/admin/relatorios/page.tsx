"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  ArrowLeft,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getToken, removeToken, apiGet } from "@/utils/api";
import { CarLogo } from "@/components/ui/carLogo";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface MonthlyData {
  mes: number;
  total_agendamentos: number;
  receita_total: number;
}

interface ServiceData {
  id: number;
  nome: string;
  total_agendamentos: number;
  receita_total: number;
}

interface ClientData {
  id: number;
  nome: string;
  email: string;
  total_agendamentos: number;
  total_gasto: number;
  ultima_visita: string;
}

interface GeneralStats {
  receita_total: number;
  total_agendamentos: number;
  agendamentos_finalizados: number;
  agendamentos_cancelados: number;
  agendamentos_pendentes: number;
  total_clientes: number;
  ticket_medio: number;
}

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
  "#84cc16",
];

export default function RelatoriosPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [topServices, setTopServices] = useState<ServiceData[]>([]);
  const [topClients, setTopClients] = useState<ClientData[]>([]);
  const [stats, setStats] = useState<GeneralStats | null>(null);

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
          router.replace("/login?next=/admin/relatorios");
        }
      }
    };

    checkAuth();
    return () => {
      cancel = true;
    };
  }, [router]);

  // Carregar dados dos relatórios
  useEffect(() => {
    if (!user) return;

    const loadReports = async () => {
      setLoading(true);
      try {
        const [monthly, services, clients, generalStats] = await Promise.all([
          apiGet(`/api/reports/monthly-revenue?year=${selectedYear}`),
          apiGet(`/api/reports/top-services?year=${selectedYear}`),
          apiGet(`/api/reports/top-clients?year=${selectedYear}&limit=10`),
          apiGet(`/api/reports/stats?year=${selectedYear}`),
        ]);

        setMonthlyData(monthly.data || []);
        setTopServices(services.data || []);
        setTopClients(clients.data || []);
        setStats(generalStats.data || null);
      } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
        toast.error("Erro ao carregar relatórios");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [user, selectedYear]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">Verificando permissões...</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Formatar dados para os gráficos
  const monthlyChartData = monthlyData.map((item) => ({
    mes: MONTHS[item.mes - 1],
    receita: item.receita_total,
    agendamentos: item.total_agendamentos,
  }));

  const servicesChartData = topServices.slice(0, 5).map((item) => ({
    nome: item.nome,
    receita: item.receita_total,
    agendamentos: item.total_agendamentos,
  }));

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <button
                onClick={() => router.push("/admin")}
                className="flex-shrink-0 p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="hidden sm:block flex-shrink-0">
                <CarLogo />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl font-semibold text-[var(--foreground)] truncate">
                  Relatórios e Estatísticas
                </h1>
                <p className="hidden sm:block text-sm text-[var(--muted-foreground)] truncate">
                  Análise de desempenho e faturamento
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex-shrink-0 flex items-center gap-2 rounded-lg px-2 sm:px-3 py-2 text-sm text-[var(--muted-foreground)]
                         hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Seletor de ano */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--foreground)]">
            Dashboard Financeiro
          </h2>

          <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
            <Calendar size={18} className="text-gray-500" />
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-transparent border-none outline-none text-base font-medium text-gray-700 cursor-pointer"
            >
              {Array.from(
                { length: 5 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-[var(--muted-foreground)]">
                Carregando relatórios...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Cards de Estatísticas Gerais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<DollarSign className="h-6 w-6" />}
                title="Receita Total"
                value={`R$ ${
                  stats?.receita_total.toFixed(2).replace(".", ",") || "0,00"
                }`}
                color="blue"
              />
              <StatCard
                icon={<Calendar className="h-6 w-6" />}
                title="Agendamentos"
                value={stats?.total_agendamentos.toString() || "0"}
                color="green"
              />
              <StatCard
                icon={<Users className="h-6 w-6" />}
                title="Clientes Únicos"
                value={stats?.total_clientes.toString() || "0"}
                color="purple"
              />
              <StatCard
                icon={<TrendingUp className="h-6 w-6" />}
                title="Ticket Médio"
                value={`R$ ${
                  stats?.ticket_medio.toFixed(2).replace(".", ",") || "0,00"
                }`}
                color="orange"
              />
            </div>

            {/* Gráfico de Receita Mensal */}
            <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-6 text-gray-900">
                Receita Mensal {selectedYear}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="mes"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "14px" }} />
                  <Line
                    type="monotone"
                    dataKey="receita"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Receita (R$)"
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Serviços Mais Rentáveis */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-6 text-gray-900">
                  Top 5 Serviços por Receita
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={servicesChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="nome"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="receita"
                      fill="#10b981"
                      name="Receita (R$)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Lista de Clientes Mais Assíduos */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-6 text-gray-900">
                  Top 10 Clientes Mais Assíduos
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {topClients.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Nenhum cliente encontrado
                    </p>
                  ) : (
                    topClients.map((client, index) => (
                      <div
                        key={client.id}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-lg hover:from-blue-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate text-sm">
                              {client.nome}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {client.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right ml-3">
                          <p className="text-sm font-semibold text-blue-600">
                            {client.total_agendamentos} visitas
                          </p>
                          <p className="text-xs text-gray-500">
                            R$ {client.total_gasto.toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  color: "blue" | "green" | "purple" | "orange";
}

function StatCard({ icon, title, value, subtitle, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  const bgClasses = {
    blue: "bg-gradient-to-br from-blue-50 to-blue-100/50",
    green: "bg-gradient-to-br from-green-50 to-green-100/50",
    purple: "bg-gradient-to-br from-purple-50 to-purple-100/50",
    orange: "bg-gradient-to-br from-orange-50 to-orange-100/50",
  };

  return (
    <div
      className={`rounded-xl p-4 shadow-sm border border-gray-100 ${bgClasses[color]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${colorClasses[color]} shadow-sm`}>
          {icon}
        </div>
      </div>
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-600 mt-1.5">{subtitle}</p>}
    </div>
  );
}
