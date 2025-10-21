"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Wifi,
  WifiOff,
  Send,
  Power,
  PowerOff,
  TestTube,
  X,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  QrCode,
} from "lucide-react";
import { toast } from "react-hot-toast";
import QRCode from "qrcode";

interface WhatsAppStatus {
  connected: boolean;
  message: string;
}

interface WhatsAppManagementProps {
  onClose: () => void;
}

export function WhatsAppManagement({ onClose }: WhatsAppManagementProps) {
  const [status, setStatus] = useState<WhatsAppStatus>({
    connected: false,
    message: "Verificando...",
  });
  const [loading, setLoading] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const WHATSAPP_SERVICE_URL = process.env.NEXT_PUBLIC_SERVICES_API_URL;

  // Verificar se o WhatsApp está disponível
  const isWhatsAppAvailable = !!WHATSAPP_SERVICE_URL;

  const checkStatus = async () => {
    if (!isWhatsAppAvailable) return;

    setLoading(true);
    try {
      const response = await fetch(`${WHATSAPP_SERVICE_URL}/whatsapp/status`);
      const data = await response.json();

      setStatus({
        connected: data.connected || false,
        message: data.message || "Status desconhecido",
      });
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      setStatus({
        connected: false,
        message: "WhatsApp Service indisponível",
      });
    } finally {
      setLoading(false);
    }
  };

  // Verificar status ao carregar
  useEffect(() => {
    if (isWhatsAppAvailable) {
      checkStatus();
    } else {
      setStatus({
        connected: false,
        message: "WhatsApp Service não configurado",
      });
    }
  }, [isWhatsAppAvailable]);

  const fetchQRCode = async () => {
    if (!isWhatsAppAvailable) return;
    setLoadingQR(true);
    try {
      const response = await fetch(`${WHATSAPP_SERVICE_URL}/whatsapp/qr`);
      const data = await response.json();

      if (data.success && data.qrCode) {
        setQrCode(data.qrCode);
        renderQRCode(data.qrCode);
      } else {
        setQrCode(null);
        toast.error(data.message || "QR Code não disponível");
      }
    } catch (error) {
      console.error("Erro ao buscar QR code:", error);
      toast.error("Erro ao carregar QR Code");
      setQrCode(null);
    } finally {
      setLoadingQR(false);
    }
  };

  const renderQRCode = async (qrData: string) => {
    if (!qrCanvasRef.current) return;

    try {
      const canvas = qrCanvasRef.current;
      canvas.width = 256;
      canvas.height = 256;

      await QRCode.toCanvas(canvas, qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
    } catch (error) {
      console.error("Erro ao renderizar QR code:", error);
      toast.error("Erro ao gerar QR Code");
    }
  };

  const initializeWhatsApp = async () => {
    if (!isWhatsAppAvailable) return;
    setLoading(true);
    const toastId = toast.loading("Inicializando WhatsApp...");

    try {
      const response = await fetch(`${WHATSAPP_SERVICE_URL}/whatsapp/connect`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("WhatsApp inicializando! Escaneie o QR code abaixo.", {
          id: toastId,
        });

        // Aguardar um pouco e buscar QR code
        setTimeout(() => {
          fetchQRCode();
          checkStatus();
        }, 3000);
      } else {
        toast.error(data.message || "Erro ao inicializar WhatsApp", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Erro ao inicializar WhatsApp:", error);
      toast.error("Erro de conexão", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const disconnectWhatsApp = async () => {
    if (!isWhatsAppAvailable) return;
    setLoading(true);
    const toastId = toast.loading("Desconectando WhatsApp...");

    try {
      const response = await fetch(
        `${WHATSAPP_SERVICE_URL}/whatsapp/disconnect`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast.success("WhatsApp desconectado com sucesso!", { id: toastId });
        setStatus({ connected: false, message: "WhatsApp desconectado" });
      } else {
        const data = await response.json();
        toast.error(data.message || "Erro ao desconectar WhatsApp", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Erro ao desconectar WhatsApp:", error);
      toast.error("Erro de conexão", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const sendTestMessage = async () => {
    if (!isWhatsAppAvailable) return;
    if (!testPhone.trim()) {
      toast.error("Digite um número de telefone para teste");
      return;
    }

    setSendingTest(true);
    const toastId = toast.loading("Enviando mensagem de teste...");

    try {
      const response = await fetch(`${WHATSAPP_SERVICE_URL}/whatsapp/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: testPhone.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Mensagem de teste enviada com sucesso!", {
          id: toastId,
        });
        setTestPhone("");
      } else {
        toast.error(data.message || "Erro ao enviar mensagem de teste", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Erro ao enviar teste:", error);
      toast.error("Erro de conexão", { id: toastId });
    } finally {
      setSendingTest(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove tudo que não é número
    let cleaned = value.replace(/\D/g, "");

    // Limita a 13 dígitos (55 + 11 + 9 dígitos)
    cleaned = cleaned.substring(0, 13);

    // Formatar: (XX) XXXXX-XXXX
    if (cleaned.length >= 11) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4");
    } else if (cleaned.length >= 7) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{4,5})/, "+$1 ($2) $3");
    } else if (cleaned.length >= 4) {
      return cleaned.replace(/(\d{2})(\d{2})/, "+$1 ($2)");
    } else if (cleaned.length >= 2) {
      return cleaned.replace(/(\d{2})/, "+$1");
    }

    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setTestPhone(formatted);
  };

  // Se WhatsApp não estiver disponível, mostrar tela de demonstração
  if (!isWhatsAppAvailable) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  WhatsApp Integration
                </h2>
                <p className="text-sm text-gray-500">Funcionalidade Premium</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Integração WhatsApp - Funcionalidade Premium
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Esta funcionalidade permite envio automático de notificações via
                WhatsApp quando serviços são concluídos.
              </p>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Funcionalidades incluídas:
                </h4>
                <ul className="text-left space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Notificações automáticas de conclusão de serviços
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Lembretes de agendamentos personalizados
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Mensagens de confirmação para clientes
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Interface de gerenciamento completa
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">
                  💡 Esta funcionalidade está disponível para demonstração em
                  ambiente local
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Entre em contato para incluir no plano premium
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col">
        {/* Header Simplificado */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                WhatsApp
              </h2>
              <p className="text-sm text-gray-500">
                Notificações Automáticas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Simplificado */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Status Visual Maior */}
          <div className="text-center py-4">
            {status.connected ? (
              <div className="space-y-3">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Wifi className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-700">Conectado</h3>
                  <p className="text-sm text-gray-600 mt-1">WhatsApp pronto para enviar notificações</p>
                </div>
                <button
                  onClick={disconnectWhatsApp}
                  disabled={loading}
                  className="mx-auto flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-base font-medium"
                >
                  <PowerOff className="w-5 h-5" />
                  <span>{loading ? "Desconectando..." : "Desconectar"}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <WifiOff className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-700">Desconectado</h3>
                  <p className="text-sm text-gray-600 mt-1">Conecte seu WhatsApp para começar</p>
                </div>
              </div>
            )}
          </div>

          {/* Área do QR Code - Simplificada */}
          {!status.connected && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-600 font-bold">
                    1
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    Clique no botão abaixo
                  </p>
                </div>

                <button
                  onClick={initializeWhatsApp}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors text-lg font-bold shadow-lg"
                >
                  <Power className="w-6 h-6" />
                  <span>{loading ? "Conectando..." : "Conectar WhatsApp"}</span>
                </button>

                {qrCode ? (
                  <div className="bg-white rounded-xl p-4 shadow-inner">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <p className="text-base font-semibold text-gray-900">
                        Escaneie o código abaixo
                      </p>
                    </div>
                    <canvas
                      ref={qrCanvasRef}
                      className="mx-auto border-4 border-gray-200 rounded-xl"
                    />
                    <button
                      onClick={fetchQRCode}
                      disabled={loadingQR}
                      className="mt-3 mx-auto flex items-center space-x-2 px-4 py-2 text-sm text-green-700 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors font-medium"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingQR ? "animate-spin" : ""}`} />
                      <span>Gerar novo código</span>
                    </button>
                    <div className="mt-4 bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800 font-medium flex items-start space-x-2">
                        <span className="text-lg">💡</span>
                        <span>No seu celular, abra WhatsApp → Configurações → Aparelhos conectados → Conectar aparelho</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-4">
                    <div className="flex items-start space-x-3 text-left">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-lg">ℹ️</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold mb-2">Como conectar:</p>
                        <ol className="list-decimal list-inside space-y-1.5 text-gray-600">
                          <li>Clique em "Conectar WhatsApp"</li>
                          <li>Aguarde o código QR aparecer (3-5 segundos)</li>
                          <li>Abra WhatsApp no seu celular</li>
                          <li>Vá em: Menu → Aparelhos conectados</li>
                          <li>Escaneie o código QR que aparecer aqui</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Teste de Mensagem - Só se conectado */}
          {status.connected && (
            <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
              <div className="flex items-center space-x-2 mb-4">
                <TestTube className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Testar Envio</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número de telefone
                  </label>
                  <input
                    type="text"
                    value={testPhone}
                    onChange={handlePhoneChange}
                    placeholder="Ex: +55 (11) 99999-9999"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                </div>

                <button
                  onClick={sendTestMessage}
                  disabled={sendingTest || !testPhone.trim()}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
                >
                  <Send className="w-5 h-5" />
                  <span>{sendingTest ? "Enviando..." : "Enviar Mensagem de Teste"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Informações Simplificadas */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              <CheckCircle className="w-4 h-4 text-green-500 inline mr-1" />
              Notificações automáticas são enviadas quando você finalizar um serviço
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
