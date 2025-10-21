"use client";

import { useState } from "react";
import {
  CheckCircle,
  MessageCircle,
  X,
  Loader2,
  User,
  Phone
} from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminServiceItem } from "@/components/lists/adminServiceList";

interface CompleteServiceModalProps {
  appointment: AdminServiceItem;
  onClose: () => void;
  onComplete: () => void;
}

export function CompleteServiceModal({
  appointment,
  onClose,
  onComplete
}: CompleteServiceModalProps) {
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [notes, setNotes] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const WHATSAPP_SERVICE_URL = process.env.NEXT_PUBLIC_SERVICES_API_URL;

  // Log das variáveis de ambiente ao carregar o componente
  console.log('🌐 ENVIRONMENT - API_URL:', API_URL);
  console.log('🌐 ENVIRONMENT - WHATSAPP_SERVICE_URL:', WHATSAPP_SERVICE_URL);

  // Verificar se o WhatsApp está disponível
  const isWhatsAppAvailable = !!WHATSAPP_SERVICE_URL;

  const handleComplete = async () => {
    setCompleting(true);
    let toastId: string;

    console.log('🔍 DEBUG - handleComplete iniciado');
    console.log('🔍 DEBUG - sendWhatsApp:', sendWhatsApp);
    console.log('🔍 DEBUG - isWhatsAppAvailable:', isWhatsAppAvailable);
    console.log('🔍 DEBUG - WHATSAPP_SERVICE_URL:', WHATSAPP_SERVICE_URL);
    console.log('🔍 DEBUG - appointment:', appointment);

    // Toast inicial
    if (sendWhatsApp && isWhatsAppAvailable) {
      console.log('✅ Vai enviar WhatsApp - mostrando toast de loading');
      toastId = toast.loading('Finalizando serviço e enviando WhatsApp...');
    } else {
      console.log('ℹ️ NÃO vai enviar WhatsApp - sendWhatsApp:', sendWhatsApp, 'isWhatsAppAvailable:', isWhatsAppAvailable);
      toastId = toast.loading('Finalizando serviço...');
    }

    try {
      const token = localStorage.getItem('token');
      const bodyData = {
        status: 'finalizado',
        notes: notes.trim(),
        sendWhatsApp: sendWhatsApp && isWhatsAppAvailable
      };

      console.log('📤 Enviando requisição com body:', bodyData);

      const url = `${API_URL}/api/agendamentos/${appointment.id}/complete`;
      console.log('🔗 URL da requisição:', url);
      console.log('🔑 Token:', token ? 'Presente' : 'Ausente');

      const completeResponse = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      console.log('📡 Status da resposta:', completeResponse.status, completeResponse.statusText);

      if (!completeResponse.ok) {
        throw new Error('Erro ao finalizar serviço');
      }

      const responseData = await completeResponse.json();
      console.log('📥 Resposta do servidor:', responseData);

      // Verificar se WhatsApp foi enviado
      if (sendWhatsApp && isWhatsAppAvailable) {
        if (responseData.whatsappSent === true) {
          toast.success('✅ Serviço finalizado e WhatsApp enviado com sucesso!', {
            id: toastId,
            duration: 5000
          });
        } else if (responseData.whatsappSent === false) {
          const errorMsg = responseData.whatsappError || 'Erro desconhecido';
          toast.error(`⚠️ Serviço finalizado, mas WhatsApp falhou: ${errorMsg}`, {
            id: toastId,
            duration: 7000
          });
          console.error('❌ Erro WhatsApp:', errorMsg);
        } else {
          toast.success('Serviço finalizado com sucesso!', { id: toastId });
        }
      } else {
        toast.success('Serviço finalizado com sucesso!', { id: toastId });
      }

      onComplete();
      onClose();

    } catch (error) {
      console.error('Erro ao completar serviço:', error);
      toast.error('❌ Erro ao finalizar serviço', { id: toastId });
    } finally {
      setCompleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Finalizar Serviço</h2>
              <p className="text-sm text-gray-500">Marcar como concluído</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={completing}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informações do serviço */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Detalhes do Serviço</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Serviço:</span>
                <span className="font-medium">{appointment.servico}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Data:</span>
                <span className="font-medium">{formatDate(appointment.data!)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Horário:</span>
                <span className="font-medium">{appointment.horario}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Valor:</span>
                <span className="font-medium text-green-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(appointment.valor || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Informações do cliente */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Cliente</span>
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nome:</span>
                <span className="font-medium">{appointment.cliente.nome}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{appointment.cliente.email}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Telefone:</span>
                <span className="font-medium flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{appointment.cliente.telefone || 'Não informado'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Notas opcionais */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre a conclusão do serviço..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              disabled={completing}
            />
          </div>

          {/* Opção WhatsApp - só aparece se disponível */}
          {isWhatsAppAvailable && (
            <div className="bg-green-50 rounded-lg p-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendWhatsApp}
                  onChange={(e) => setSendWhatsApp(e.target.checked)}
                  disabled={completing}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-900">Enviar notificação por WhatsApp</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    O cliente receberá uma mensagem confirmando a conclusão do serviço
                  </p>
                  {!appointment.cliente.telefone && (
                    <p className="text-sm text-red-600 mt-1 font-medium">
                      ⚠️ Cliente não possui telefone cadastrado
                    </p>
                  )}
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex space-x-3 justify-end">
            <button
              onClick={onClose}
              disabled={completing}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              onClick={handleComplete}
              disabled={completing}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {completing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>{completing ? 'Finalizando...' : 'Finalizar Serviço'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}