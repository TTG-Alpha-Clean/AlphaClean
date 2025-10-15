"use client";

import { Modal } from "@/components/ui/modal";
import { AdminServiceItem } from "@/components/lists/adminServiceList";
import { StatusBadge } from "@/components/ui/statusBadge";
import { User, Car, Phone, Clock, DollarSign, FileText } from "lucide-react";

interface DayAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  appointments: AdminServiceItem[];
}

export function DayAppointmentsModal({
  isOpen,
  onClose,
  date,
  appointments,
}: DayAppointmentsModalProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Calcular estatísticas do dia
  const stats = {
    total: appointments.length,
    agendados: appointments.filter((a) => a.status === "agendado").length,
    finalizados: appointments.filter((a) => a.status === "finalizado").length,
    cancelados: appointments.filter((a) => a.status === "cancelado").length,
    receita: appointments
      .filter((a) => a.status === "finalizado")
      .reduce((sum, a) => sum + Number(a.valor || 0), 0),
  };

  // Ordenar agendamentos por horário
  const sortedAppointments = [...appointments].sort((a, b) => {
    const timeA = a.horario || "00:00";
    const timeB = b.horario || "00:00";
    return timeA.localeCompare(timeB);
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Agendamentos - ${formatDate(date)}`}
      size="xl"
    >
      {/* Estatísticas do dia */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-600 font-medium">Total</div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.agendados}
          </div>
          <div className="text-sm text-yellow-600 font-medium">Agendados</div>
        </div>

        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="text-2xl font-bold text-green-600">
            {stats.finalizados}
          </div>
          <div className="text-sm text-green-600 font-medium">Finalizados</div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <div className="text-lg font-bold text-emerald-600">
            {formatCurrency(stats.receita)}
          </div>
          <div className="text-sm text-emerald-600 font-medium">Receita</div>
        </div>
      </div>

      {/* Lista de agendamentos */}
      {sortedAppointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Clock className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">Nenhum agendamento neste dia</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors bg-white"
            >
              {/* Cabeçalho: Horário + Serviço + Status */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                  <Clock size={16} className="text-blue-600" />
                  <span className="font-semibold text-blue-600">
                    {appointment.horario || "09:00"}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {appointment.servico}
                </h3>
                <StatusBadge status={appointment.status} />
                {appointment.valor && (
                  <div className="flex items-center space-x-1 bg-green-50 px-3 py-1.5 rounded-lg">
                    <DollarSign size={16} className="text-green-600" />
                    <span className="font-semibold text-green-600">
                      {formatCurrency(appointment.valor)}
                    </span>
                  </div>
                )}
              </div>

              {/* Informações do cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="flex items-start space-x-2">
                  <User size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Cliente</div>
                    <div className="font-medium text-gray-900">
                      {appointment.cliente.nome}
                    </div>
                    {appointment.cliente.email && (
                      <div className="text-sm text-gray-500">
                        {appointment.cliente.email}
                      </div>
                    )}
                  </div>
                </div>

                {appointment.cliente.telefone && (
                  <div className="flex items-start space-x-2">
                    <Phone size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Telefone</div>
                      <div className="font-medium text-gray-900">
                        {appointment.cliente.telefone}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Informações do veículo */}
              <div className="flex items-start space-x-2 mb-3">
                <Car size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Veículo</div>
                  <div className="font-medium text-gray-900">
                    {appointment.modelo_veiculo || appointment.veiculo}
                    {appointment.cor && (
                      <span className="text-gray-500"> • {appointment.cor}</span>
                    )}
                    {appointment.placa && (
                      <span className="text-gray-500">
                        {" "}
                        • Placa: {appointment.placa}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Observações */}
              {appointment.observacoes && (
                <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg">
                  <FileText size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Observações</div>
                    <div className="text-sm text-gray-700">
                      {appointment.observacoes}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
