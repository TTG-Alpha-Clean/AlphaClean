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

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const WHATSAPP_SERVICE_URL = process.env.NEXT_PUBLIC_SERVICES_API_URL;

  // Verificar status ao carregar
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${WHATSAPP_SERVICE_URL}/whatsapp/status`);
      const data = await response.json();

      setStatus({
        connected: data.connected || false,
        message: data.message || "Status desconhecido"
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

  const fetchQRCode = async () => {
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
    setLoading(true);
    const toastId = toast.loading("Inicializando WhatsApp...");

    try {
      const response = await fetch(`${WHATSAPP_SERVICE_URL}/whatsapp/connect`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "WhatsApp inicializando! Escaneie o QR code abaixo.",
          { id: toastId }
        );

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
    setLoading(true);
    const toastId = toast.loading("Desconectando WhatsApp...");

    try {
      const response = await fetch(`${WHATSAPP_SERVICE_URL}/whatsapp/disconnect`, {
        method: "POST",
      });

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                WhatsApp Manager
              </h2>
              <p className="text-sm text-gray-500">
                Gerenciar conexão e envio de mensagens
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status atual */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Status da Conexão
              </h3>
              <button
                onClick={checkStatus}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>Atualizar</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {status.connected ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <Wifi className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">Conectado</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <WifiOff className="w-5 h-5 text-red-600" />
                  <span className="text-red-700 font-medium">Desconectado</span>
                </>
              )}
            </div>

            <p className="text-sm text-gray-600 mt-2">{status.message}</p>

            {/* QR Code Display */}
            {!status.connected && qrCode && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <div className="flex flex-col items-center space-y-3">
                  <QrCode className="w-6 h-6 text-green-600" />
                  <h4 className="font-medium text-gray-900">QR Code para Conexão</h4>
                  <canvas
                    ref={qrCanvasRef}
                    className="border border-gray-300 rounded-lg"
                  />
                  <p className="text-sm text-gray-600">
                    Escaneie este QR code com seu WhatsApp
                  </p>
                  <button
                    onClick={fetchQRCode}
                    disabled={loadingQR}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingQR ? "animate-spin" : ""}`} />
                    <span>Atualizar QR Code</span>
                  </button>
                </div>
              </div>
            )}

            {!status.connected && !qrCode && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Como conectar:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Clique em Conectar WhatsApp</li>
                      <li>Aguarde o QR code aparecer aqui</li>
                      <li>Escaneie o QR code com seu WhatsApp</li>
                      <li>Aguarde a confirmação de conexão</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controles de conexão */}
          <div className="flex flex-wrap gap-3">
            {!status.connected ? (
              <>
                <button
                  onClick={initializeWhatsApp}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <Power className="w-4 h-4" />
                  <span>{loading ? "Conectando..." : "Conectar WhatsApp"}</span>
                </button>

                <button
                  onClick={fetchQRCode}
                  disabled={loadingQR}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{loadingQR ? "Carregando..." : "Buscar QR Code"}</span>
                </button>
              </>
            ) : (
              <button
                onClick={disconnectWhatsApp}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <PowerOff className="w-4 h-4" />
                <span>{loading ? "Desconectando..." : "Desconectar"}</span>
              </button>
            )}
          </div>

          {/* Teste de envio */}
          {status.connected && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <TestTube className="w-5 h-5 text-blue-600" />
                <span>Teste de Envio</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de telefone (com DDD)
                  </label>
                  <input
                    type="text"
                    value={testPhone}
                    onChange={handlePhoneChange}
                    placeholder="Ex: +55 (11) 99999-9999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Digite apenas números. A formatação será aplicada
                    automaticamente.
                  </p>
                </div>

                <button
                  onClick={sendTestMessage}
                  disabled={sendingTest || !testPhone.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>{sendingTest ? "Enviando..." : "Enviar Teste"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Informações importantes */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ℹ️ Informações Importantes
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>
                  As notificações são enviadas automaticamente quando um serviço
                  é finalizado
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>
                  O WhatsApp deve permanecer conectado no servidor para
                  funcionar
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>
                  Use apenas para notificações relacionadas aos serviços
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>
                  Não envie spam ou mensagens não relacionadas ao negócio
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Sistema de notificações WhatsApp - Alpha Clean
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
