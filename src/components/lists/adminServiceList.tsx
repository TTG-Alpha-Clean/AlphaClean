// src/components/lists/adminServiceList.tsx - VERSÃO CORRIGIDA

"use client";

import { useState } from "react";
import {
  StatusBadge,
  type StatusBadgeProps,
} from "@/components/ui/statusBadge";
import DeleteButton from "@/components/ui/deleteButton";
import { formatDatePtBr, formatHour } from "@/lib/date";
import { toast } from "react-hot-toast";
import { CompleteServiceModal } from "@/components/modals/completeServiceModal";
import { User, Car, Phone, CheckCircle, X } from "lucide-react";

export type AdminServiceItem = {
  id: string;
  datetime: string | Date;
  servico: string;
  veiculo: string;
  modelo_veiculo?: string;
  cor?: string;
  placa?: string;
  data?: string;
  horario?: string;
  observacoes?: string;
  status: StatusBadgeProps["status"];
  valor?: number; // Valor do serviço
  // Dados do cliente
  cliente: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
  };
  created_at?: string;
  updated_at?: string;
};

interface AdminServiceListProps {
  items: AdminServiceItem[];
  onRefresh?: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Função auxiliar para formatar data de forma segura
function formatDateSafe(dateInput: string | Date): string {
  try {
    if (!dateInput) return "Data inválida";

    let date: Date;

    if (typeof dateInput === "string") {
      if (dateInput.includes("T")) {
        let cleanDateString = dateInput;
        if (dateInput.includes("ZT")) {
          cleanDateString = dateInput.split("ZT")[0] + "Z";
        } else if (dateInput.includes(".000ZT")) {
          cleanDateString = dateInput.split(".000ZT")[0] + ".000Z";
        }
        date = new Date(cleanDateString);
      } else if (dateInput.includes("-")) {
        date = new Date(dateInput + "T12:00:00");
      } else {
        throw new Error("Formato não reconhecido");
      }
    } else {
      date = dateInput;
    }

    if (isNaN(date.getTime())) {
      throw new Error("Data inválida");
    }

    return formatDatePtBr(date);
  } catch (error) {
    console.error("Erro ao formatar data:", error, "Input:", dateInput);
    return "Data inválida";
  }
}

// Função auxiliar para formatar hora de forma segura
function formatHourSafe(dateInput: string | Date): string {
  try {
    if (!dateInput) return "Hora inválida";

    let date: Date;

    if (typeof dateInput === "string") {
      if (dateInput.includes("T")) {
        date = new Date(dateInput);
      } else {
        return "09:00";
      }
    } else {
      date = dateInput;
    }

    if (isNaN(date.getTime())) {
      throw new Error("Data inválida");
    }

    return formatHour(date);
  } catch (error) {
    console.error("Erro ao formatar hora:", error, dateInput);
    return "Hora inválida";
  }
}

export function AdminServiceList({ items, onRefresh }: AdminServiceListProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState<string | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState<AdminServiceItem | null>(null);

  const handleDeleteConfirm = async (id: string) => {
    const tid = toast.loading("Excluindo agendamento...");

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/agendamentos/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || "Erro ao excluir agendamento");
      }

      toast.success("Agendamento excluído com sucesso!", { id: tid });
      onRefresh?.();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message
          : "Erro ao excluir agendamento.";
      toast.error(errorMessage || "Erro ao excluir agendamento.", { id: tid });
    } finally {
      setShowDeleteDialog(null);
    }
  };

  const handleCancelConfirm = async (id: string) => {
    const tid = toast.loading("Cancelando agendamento...");

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/agendamentos/${id}/cancel`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || "Erro ao cancelar agendamento");
      }

      toast.success("Agendamento cancelado com sucesso!", { id: tid });
      onRefresh?.();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message
          : "Erro ao cancelar agendamento.";
      toast.error(errorMessage || "Erro ao cancelar agendamento.", { id: tid });
    } finally {
      setShowCancelDialog(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setShowDeleteDialog(id);
  };

  const handleCancelClick = (id: string) => {
    setShowCancelDialog(id);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (!items?.length) {
    return (
      <p className="text-base text-[#6b859c]">Nenhum agendamento encontrado.</p>
    );
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-[#e6edf3] bg-white p-3 sm:p-4 shadow-sm
                       lg:flex-row lg:items-start lg:justify-between hover:border-[#d7e6f3] transition-colors"
          >
            {/* Esquerda: infos */}
            <div className="flex-1 space-y-2 sm:space-y-3">
              {/* Linha 1: Serviço + Status + Valor */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <p className="text-base sm:text-lg font-semibold text-[#022744]">
                  {item.servico}
                </p>
                <StatusBadge status={item.status} />
                {item.valor && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-medium rounded-full">
                    {formatCurrency(item.valor)}
                  </span>
                )}
              </div>

              {/* Linha 2: Cliente - MOBILE: Vertical, DESKTOP: Horizontal */}
              <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-2 text-sm text-[#597891]">
                {/* Nome do cliente */}
                <div className="flex items-center gap-2">
                  <User size={18} className="text-[#597891] flex-shrink-0 sm:w-4 sm:h-4" />
                  <span className="font-medium text-[#022744]">{item.cliente.nome}</span>
                </div>

                {/* Email - Mobile: nova linha, Desktop: inline */}
                {item.cliente.email && (
                  <>
                    <span className="hidden sm:inline text-[#8a9ba8]">•</span>
                    <span className="text-[#597891] text-xs sm:text-sm pl-7 sm:pl-0 block sm:inline">
                      {item.cliente.email}
                    </span>
                  </>
                )}

                {/* Telefone - Mobile: nova linha com ícone, Desktop: inline */}
                {item.cliente.telefone && (
                  <>
                    <span className="hidden sm:inline text-[#8a9ba8]">•</span>
                    <div className="flex items-center gap-2 pl-7 sm:pl-0">
                      <Phone size={16} className="text-[#597891] sm:w-3.5 sm:h-3.5" />
                      <span className="text-xs sm:text-sm">{item.cliente.telefone}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Linha 3: Data + Hora + Veículo */}
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-[#597891]">
                <span className="font-medium">
                  {item.data
                    ? formatDateSafe(item.data)
                    : formatDateSafe(item.datetime)}
                </span>
                <span className="text-[#8a9ba8]">•</span>
                <span>{item.horario || formatHourSafe(item.datetime)}</span>
                <span className="text-[#8a9ba8]">•</span>
                <div className="flex items-center gap-1">
                  <Car size={16} className="text-[#597891] sm:w-3.5 sm:h-3.5" />
                  <span>
                    {item.modelo_veiculo || item.veiculo}
                    {item.placa && ` - ${item.placa}`}
                    {item.cor && ` (${item.cor})`}
                  </span>
                </div>
              </div>

              {/* Observações se houver */}
              {item.observacoes && (
                <div className="text-xs sm:text-sm text-[#8a9ba8] bg-[#f8fafc] p-2 rounded-lg">
                  <strong>Obs:</strong> {item.observacoes}
                </div>
              )}
            </div>

            {/* Direita: ações */}
            <div className="flex flex-row sm:flex-col gap-2 justify-center sm:justify-start lg:items-end w-full sm:w-auto">
              {/* Botão de finalizar serviço */}
              {(item.status === "agendado" || item.status === "em_andamento") && (
                <button
                  onClick={() => setShowCompleteModal(item)}
                  className="flex items-center justify-center space-x-1.5 px-4 py-2.5 sm:px-3 sm:py-2 bg-green-600 text-white text-sm sm:text-sm rounded-lg hover:bg-green-700 transition-colors flex-1 sm:flex-initial"
                >
                  <CheckCircle size={18} className="sm:w-4 sm:h-4" />
                  <span className="font-medium">Finalizar</span>
                </button>
              )}

              {/* Botão de cancelar serviço */}
              {(item.status === "agendado" || item.status === "em_andamento") && (
                <button
                  onClick={() => handleCancelClick(item.id)}
                  className="flex items-center justify-center space-x-1.5 px-4 py-2.5 sm:px-3 sm:py-2 bg-red-600 text-white text-sm sm:text-sm rounded-lg hover:bg-red-700 transition-colors flex-1 sm:flex-initial"
                >
                  <X size={18} className="sm:w-4 sm:h-4" />
                  <span className="font-medium">Cancelar</span>
                </button>
              )}

              {/* Botão de deletar - só para serviços finalizados/cancelados */}
              {(item.status === "finalizado" || item.status === "cancelado") && (
                <div className="flex justify-center sm:justify-start">
                  <DeleteButton onClick={() => handleDeleteClick(item.id)} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de finalizar serviço */}
      {showCompleteModal && (
        <CompleteServiceModal
          appointment={showCompleteModal}
          onClose={() => setShowCompleteModal(null)}
          onComplete={() => {
            onRefresh?.();
            setShowCompleteModal(null);
          }}
        />
      )}

      {/* Dialog de confirmação de exclusão */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Excluir Agendamento</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir este agendamento permanentemente?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteDialog(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteConfirm(showDeleteDialog)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de confirmação de cancelamento */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Cancelar Agendamento</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja cancelar este agendamento? O serviço será
              marcado como cancelado.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelDialog(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Não, manter
              </button>
              <button
                onClick={() => handleCancelConfirm(showCancelDialog)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sim, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
