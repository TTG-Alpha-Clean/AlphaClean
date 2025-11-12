"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { getToken, removeToken } from "@/utils/api";
import Image from "next/image";
import Button from "@/components/ui/button";
import { ServiceFormModal } from "@/components/modals/serviceFormModal";
import AdminHeader from "@/components/navigation/adminHeader";
import EditButton from "@/components/ui/editButton";
import DeleteButton from "@/components/ui/deleteButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const SERVICES_API_URL = process.env.NEXT_PUBLIC_SERVICES_API_URL || 'http://localhost:3002';

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface ServiceInformation {
  id: number;
  description: string;
}

interface Service {
  service_id: number;
  type: string;
  title: string;
  subtitle?: string;
  price: number;
  time: number;
  service_description?: string;
  image_url?: string;
  informations?: ServiceInformation[];
}

export default function AdminServicesPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

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
          router.replace("/login?next=/admin/servicos-site");
        }
      }
    };

    checkAuth();
    return () => {
      cancel = true;
    };
  }, [router]);

  // Buscar serviços
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/services`);

      if (res.ok) {
        const data = await res.json();
        setServices(data.data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      toast.error("Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchServices();
    }
  }, [user]);

  // Deletar serviço
  const handleDelete = async (serviceId: number) => {
    const toastId = toast.loading("Excluindo serviço...");

    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/api/services/${serviceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // Tenta pegar a mensagem de erro do backend
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.error || errorData?.message || "Erro ao excluir serviço";
        throw new Error(errorMessage);
      }

      toast.success("Serviço excluído com sucesso!", { id: toastId });
      fetchServices();
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao excluir serviço";
      toast.error(errorMessage, { id: toastId });
    }
  };

  // Logout
  const handleLogout = async () => {
    const toastId = toast.loading("Fazendo logout...");

    try {
      const token = getToken();
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      removeToken();
      toast.success("Logout realizado com sucesso!", { id: toastId });
      router.push("/login");
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao fazer logout", { id: toastId });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatMinutes = (mins: number) => {
    if (!Number.isFinite(mins)) return "—";
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}min`;
  };

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

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <AdminHeader
        currentPage="servicos-site"
        userName={user.nome}
        title="Gerenciar Serviços do Site"
        subtitle="Configure os serviços exibidos no site"
      />

      {/* Conteúdo */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--foreground)]">
            Serviços ({services.length})
          </h2>

          <Button
            onClick={() => {
              setEditingService(null);
              setShowModal(true);
            }}
            variant="primary"
            className="flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            <span>Novo Serviço</span>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
              <p className="text-[var(--muted-foreground)]">
                Carregando serviços...
              </p>
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-[var(--card)] rounded-xl border border-[var(--border)]">
            <p className="text-[var(--muted-foreground)] mb-4">
              Nenhum serviço cadastrado
            </p>
            <Button
              onClick={() => {
                setEditingService(null);
                setShowModal(true);
              }}
              variant="primary"
            >
              Criar primeiro serviço
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <article
                key={service.service_id}
                className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Imagem */}
                <div className="relative h-48 bg-[var(--muted)]">
                  {service.image_url ? (
                    <Image
                      src={service.image_url}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">
                      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 19.5h18a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 21 4.5H3A1.5 1.5 0 0 0 1.5 6v12A1.5 1.5 0 0 0 3 19.5Z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                      style={{
                        color: "var(--accent)",
                        borderColor: "var(--accent)",
                        background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                      }}
                    >
                      {service.type}
                    </span>
                    <div className="flex items-center space-x-2 sm:space-x-1">
                      <EditButton
                        onClick={() => {
                          setEditingService(service);
                          setShowModal(true);
                        }}
                        title="Editar serviço"
                        size="md"
                      />
                      <DeleteButton
                        onClick={() => {
                          if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
                            handleDelete(service.service_id);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">
                    {service.title}
                  </h3>

                  {service.subtitle && (
                    <p className="text-sm text-[var(--accent)] mb-2">
                      {service.subtitle}
                    </p>
                  )}

                  <div className="flex items-baseline space-x-3 mb-3">
                    <span className="text-2xl font-bold text-[var(--primary)]">
                      {formatCurrency(service.price)}
                    </span>
                    <span className="text-sm text-[var(--muted-foreground)]">
                      {formatMinutes(service.time)}
                    </span>
                  </div>

                  {service.service_description && (
                    <p className="text-sm text-[var(--muted-foreground)] mb-3 line-clamp-2">
                      {service.service_description}
                    </p>
                  )}

                  {service.informations && service.informations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--border)]">
                      <p className="text-xs font-semibold text-[var(--muted-foreground)] mb-2">
                        Inclui:
                      </p>
                      <ul className="space-y-1">
                        {service.informations.slice(0, 3).map((info) => (
                          <li
                            key={info.id}
                            className="flex items-start gap-2 text-xs text-[var(--muted-foreground)]"
                          >
                            <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-[var(--accent)]" />
                            <span>{info.description}</span>
                          </li>
                        ))}
                        {service.informations.length > 3 && (
                          <li className="text-xs text-[var(--accent)] font-semibold">
                            +{service.informations.length - 3} itens
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Modal de Criação/Edição */}
      {showModal && (
        <ServiceFormModal
          service={editingService}
          onClose={() => {
            setShowModal(false);
            setEditingService(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingService(null);
            fetchServices();
          }}
        />
      )}
    </main>
  );
}
