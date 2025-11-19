"use client";

import {
  BookOpen,
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  FileText,
  MessageSquare,
  Server,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/navigation/adminHeader";
import { getToken, removeToken } from "@/utils/api";

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
}

function Section({ title, icon, children, defaultOpen = false, id }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Observa mudanças no hash da URL para abrir a seção correspondente
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove o #
      if (id === hash) {
        setIsOpen(true);
        // Pequeno delay para garantir que a seção esteja renderizada antes do scroll
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };

    // Verifica hash inicial
    handleHashChange();

    // Escuta mudanças no hash
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [id]);

  return (
    <div id={id} className="bg-white rounded-lg border border-gray-200 overflow-hidden scroll-mt-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">{icon}</div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {title}
          </h2>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6 pt-0 sm:pt-0 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ManualAdmin() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader currentPage="manual" userName={user.nome} />

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 sm:p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-2xl sm:text-3xl font-bold">
              Manual do Administrador
            </h1>
          </div>
          <p className="text-blue-100 text-sm sm:text-base">
            Guia completo para gerenciar e utilizar todas as funcionalidades do
            AlphaClean
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Índice
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <a href="#credenciais" className="text-blue-600 hover:underline">
              1. Credenciais do Sistema
            </a>
            <a href="#dashboard" className="text-blue-600 hover:underline">
              2. Dashboard e Visão Geral
            </a>
            <a href="#agendamentos" className="text-blue-600 hover:underline">
              3. Gestão de Agendamentos
            </a>
            <a href="#clientes" className="text-blue-600 hover:underline">
              4. Gestão de Clientes
            </a>
            <a href="#servicos" className="text-blue-600 hover:underline">
              5. Gestão de Serviços
            </a>
            <a href="#relatorios" className="text-blue-600 hover:underline">
              6. Relatórios e Análises
            </a>
            <a href="#whatsapp" className="text-blue-600 hover:underline">
              7. WhatsApp - Configuração VM
            </a>
            <a href="#backend" className="text-blue-600 hover:underline">
              8. Backend e Banco de Dados
            </a>
            <a href="#cliente-manual" className="text-blue-600 hover:underline">
              9. Funcionamento do Cliente
            </a>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {/* Credenciais */}
          <Section
            title="1. Credenciais do Sistema"
            icon={<Settings className="w-5 h-5" />}
            defaultOpen={true}
            id="credenciais"
          >
            <div className="space-y-4 text-gray-700">
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-800 mb-2">
                  🔒 CONFIDENCIAL - Mantenha estas informações em segurança
                </p>
                <p className="text-xs text-red-600">
                  Não compartilhe estas credenciais com terceiros. São de uso
                  exclusivo do administrador do sistema.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Gmail</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 font-mono text-sm">
                  <div>
                    <span className="text-gray-600">Email:</span>{" "}
                    <span className="text-gray-900">alphaclean335@gmail.com</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Senha:</span>{" "}
                    <span className="text-gray-900">Alpha@1234</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Conta principal utilizada para notificações e serviços
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Supabase</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 font-mono text-sm">
                  <div>
                    <span className="text-gray-600">Email:</span>{" "}
                    <span className="text-gray-900">alphaclean335@gmail.com</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Senha:</span>{" "}
                    <span className="text-gray-900">Alphasup@1234</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Senha do BD:</span>{" "}
                    <span className="text-gray-900">@Alpha#1234%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Plataforma de banco de dados PostgreSQL e autenticação
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Cloudflare</h3>
                <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                  <div>
                    <span className="text-gray-600">Login:</span>{" "}
                    <span className="text-gray-900">Via conta Google (Gmail)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Utilizado para Cloudflare Tunnel (conexão VM com backend)
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Cloudinary</h3>
                <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                  <div>
                    <span className="text-gray-600">Login:</span>{" "}
                    <span className="text-gray-900">Via conta Google (Gmail)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Plataforma de armazenamento e otimização de imagens
                </p>
              </div>
            </div>
          </Section>

          {/* Dashboard */}
          <Section
            title="2. Dashboard e Visão Geral"
            icon={<LayoutDashboard className="w-5 h-5" />}
            id="dashboard"
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Cartões de Estatísticas
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong>Total de Agendamentos:</strong> Mostra todos os
                    agendamentos registrados no sistema
                  </li>
                  <li>
                    <strong>Agendados:</strong> Serviços pendentes aguardando
                    execução
                  </li>
                  <li>
                    <strong>Concluídos:</strong> Serviços finalizados com
                    sucesso
                  </li>
                  <li>
                    <strong>Cancelados:</strong> Agendamentos cancelados pelo
                    cliente ou admin
                  </li>
                  <li>
                    <strong>Receita Hoje:</strong> Faturamento do dia atual
                  </li>
                  <li>
                    <strong>Receita Mês:</strong> Faturamento acumulado do mês
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Lista de Agendamentos
                </h3>
                <p>
                  Visualize todos os agendamentos com informações completas:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                  <li>Dados do cliente (nome, email, telefone)</li>
                  <li>Informações do veículo (marca, modelo, placa)</li>
                  <li>Data e horário do serviço</li>
                  <li>Status atual (Agendado, Concluído, Cancelado)</li>
                  <li>Ações rápidas: Editar, Concluir, Cancelar, Excluir</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Agendamentos */}
          <Section
            title="3. Gestão de Agendamentos"
            icon={<Calendar className="w-5 h-5" />}
            id="agendamentos"
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Status dos Agendamentos
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong className="text-yellow-600">Agendado:</strong>{" "}
                    Serviço confirmado, aguardando execução
                  </li>
                  <li>
                    <strong className="text-green-600">Concluído:</strong>{" "}
                    Serviço realizado e finalizado
                  </li>
                  <li>
                    <strong className="text-red-600">Cancelado:</strong> Serviço
                    cancelado (não gera receita)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Ações Disponíveis
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong>Editar:</strong> Modifique data, horário, serviço ou
                    cliente
                  </li>
                  <li>
                    <strong>Concluir:</strong> Marque como concluído quando o
                    serviço for realizado
                  </li>
                  <li>
                    <strong>Cancelar:</strong> Cancele o agendamento (cliente
                    será notificado via WhatsApp)
                  </li>
                  <li>
                    <strong>Excluir:</strong> Remove permanentemente do sistema
                    (use com cuidado)
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>💡 Dica:</strong> Ao concluir um agendamento, o
                  cliente recebe automaticamente uma notificação via WhatsApp
                  agradecendo pelo serviço.
                </p>
              </div>
            </div>
          </Section>

          {/* Clientes */}
          <Section
            title="4. Gestão de Clientes"
            icon={<Users className="w-5 h-5" />}
            id="clientes"
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Visualização de Clientes
                </h3>
                <p>Acesse a lista completa de clientes cadastrados com:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                  <li>Nome completo e informações de contato</li>
                  <li>Email e telefone para comunicação</li>
                  <li>Histórico de agendamentos</li>
                  <li>Veículos cadastrados</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Informações Importantes
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Os clientes se cadastram automaticamente ao fazer o primeiro
                    agendamento
                  </li>
                  <li>Cada cliente pode ter múltiplos veículos cadastrados</li>
                  <li>É possível editar informações de contato do cliente</li>
                  <li>
                    Visualize o histórico completo de serviços de cada cliente
                  </li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Serviços */}
          <Section
            title="5. Gestão de Serviços do Site"
            icon={<Settings className="w-5 h-5" />}
            id="servicos"
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Adicionar/Editar Serviços
                </h3>
                <p>Gerencie os serviços oferecidos aos clientes:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                  <li>
                    <strong>Nome do Serviço:</strong> Título que aparece para o
                    cliente
                  </li>
                  <li>
                    <strong>Descrição:</strong> Detalhes sobre o que está
                    incluso
                  </li>
                  <li>
                    <strong>Preço:</strong> Valor cobrado pelo serviço
                  </li>
                  <li>
                    <strong>Duração:</strong> Tempo estimado de execução
                  </li>
                  <li>
                    <strong>Status:</strong> Ativo (visível) ou Inativo (oculto
                    para clientes)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Ações Disponíveis
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong>Adicionar Novo:</strong> Crie novos serviços para
                    oferecer
                  </li>
                  <li>
                    <strong>Editar:</strong> Modifique preços, descrições ou
                    duração
                  </li>
                  <li>
                    <strong>Excluir:</strong> Remova serviços descontinuados
                  </li>
                  <li>
                    <strong>Ativar/Desativar:</strong> Controle a
                    disponibilidade sem excluir
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>⚠️ Atenção:</strong> Serviços inativos não aparecem
                  para os clientes ao fazer agendamentos, mas agendamentos
                  existentes não são afetados.
                </p>
              </div>
            </div>
          </Section>

          {/* Relatórios */}
          <Section
            title="6. Relatórios e Análises"
            icon={<FileText className="w-5 h-5" />}
            id="relatorios"
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Tipos de Relatórios
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong>Relatório Financeiro:</strong> Receitas por período,
                    serviços mais lucrativos
                  </li>
                  <li>
                    <strong>Relatório de Agendamentos:</strong> Volume de
                    serviços, horários de pico
                  </li>
                  <li>
                    <strong>Relatório de Clientes:</strong> Clientes mais
                    frequentes, novos cadastros
                  </li>
                  <li>
                    <strong>Relatório de Serviços:</strong> Serviços mais
                    solicitados, performance
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Filtros Disponíveis
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Período personalizado (data início e fim)</li>
                  <li>Por tipo de serviço</li>
                  <li>Por status do agendamento</li>
                  <li>Por cliente específico</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* WhatsApp */}
          <Section
            title="7. WhatsApp - Configuração e VM"
            icon={<MessageSquare className="w-5 h-5" />}
            id="whatsapp"
          >
            <div className="space-y-4 text-gray-700">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>🔴 IMPORTANTE:</strong> O serviço de WhatsApp requer
                  uma VM (Máquina Virtual) rodando 24/7 para funcionar
                  corretamente.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Passo a Passo - Configuração Inicial
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    <strong>Ligar a VM:</strong> Certifique-se de que a máquina
                    virtual está ligada e online
                  </li>
                  <li>
                    <strong>Acessar a VM:</strong> Conecte-se via SSH ou console
                    remoto
                  </li>
                  <li>
                    <strong>Iniciar o Serviço:</strong> Execute o comando para
                    iniciar o serviço WhatsApp
                    <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-x-auto">
                      npm run whatsapp:start
                    </pre>
                  </li>
                  <li>
                    <strong>Autenticar WhatsApp:</strong> Na primeira execução,
                    um QR Code será exibido
                  </li>
                  <li>
                    <strong>Escanear QR Code:</strong> Use o WhatsApp do celular
                    (Configurações → Aparelhos Conectados)
                  </li>
                  <li>
                    <strong>Aguardar Conexão:</strong> O sistema confirmará
                    quando estiver conectado
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Como Funciona
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong>Notificações Automáticas:</strong> Clientes recebem
                    confirmação ao agendar
                  </li>
                  <li>
                    <strong>Lembretes:</strong> Mensagens automáticas 24h antes
                    do serviço
                  </li>
                  <li>
                    <strong>Confirmação de Conclusão:</strong> Notificação
                    quando o serviço é marcado como concluído
                  </li>
                  <li>
                    <strong>Avisos de Cancelamento:</strong> Cliente é informado
                    imediatamente se houver cancelamento
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Comandos Úteis
                </h3>
                <div className="space-y-2">
                  <div>
                    <strong>Iniciar Serviço:</strong>
                    <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                      npm run whatsapp:start
                    </pre>
                  </div>
                  <div>
                    <strong>Parar Serviço:</strong>
                    <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                      npm run whatsapp:stop
                    </pre>
                  </div>
                  <div>
                    <strong>Ver Status:</strong>
                    <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                      npm run whatsapp:status
                    </pre>
                  </div>
                  <div>
                    <strong>Ver Logs:</strong>
                    <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                      npm run whatsapp:logs
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Cloudflare Tunnel
                </h3>
                <p>
                  O sistema usa Cloudflare Tunnel para conectar a VM ao backend:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                  <li>
                    O túnel expõe o serviço WhatsApp da VM de forma segura
                  </li>
                  <li>Não é necessário abrir portas no firewall</li>
                  <li>Conexão criptografada entre VM e servidor</li>
                  <li>
                    O túnel deve estar ativo 24/7 junto com o serviço WhatsApp
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>⚠️ Requisitos:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2 text-sm">
                  <li>VM deve ter pelo menos 2GB RAM e 2 CPU cores</li>
                  <li>Node.js versão 18 ou superior instalado</li>
                  <li>Cloudflare Tunnel configurado e rodando</li>
                  <li>WhatsApp Business ou pessoal para autenticação</li>
                  <li>Conexão de internet estável na VM</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Backend */}
          <Section
            title="8. Backend e Banco de Dados"
            icon={<Server className="w-5 h-5" />}
            id="backend"
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Arquitetura do Sistema
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong>Frontend:</strong> Next.js 15 com App Router e React
                    Server Components
                  </li>
                  <li>
                    <strong>Backend:</strong> API Routes do Next.js (/api)
                  </li>
                  <li>
                    <strong>Banco de Dados:</strong> PostgreSQL (Supabase)
                  </li>
                  <li>
                    <strong>Autenticação:</strong> Supabase Auth com JWT
                  </li>
                  <li>
                    <strong>Storage:</strong> Supabase Storage para arquivos
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Estrutura do Banco de Dados
                </h3>
                <div className="space-y-2">
                  <div>
                    <strong>Tabelas Principais:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>
                        <code className="bg-gray-100 px-1 rounded">
                          clientes
                        </code>{" "}
                        - Dados dos clientes
                      </li>
                      <li>
                        <code className="bg-gray-100 px-1 rounded">
                          veiculos
                        </code>{" "}
                        - Veículos cadastrados
                      </li>
                      <li>
                        <code className="bg-gray-100 px-1 rounded">
                          servicos
                        </code>{" "}
                        - Serviços oferecidos
                      </li>
                      <li>
                        <code className="bg-gray-100 px-1 rounded">
                          agendamentos
                        </code>{" "}
                        - Agendamentos de serviços
                      </li>
                      <li>
                        <code className="bg-gray-100 px-1 rounded">
                          usuarios
                        </code>{" "}
                        - Usuários admin
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  APIs Principais
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Agendamentos:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>GET /api/agendamentos - Listar todos</li>
                      <li>POST /api/agendamentos - Criar novo</li>
                      <li>PUT /api/agendamentos/:id - Atualizar</li>
                      <li>DELETE /api/agendamentos/:id - Excluir</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Clientes:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>GET /api/clientes - Listar todos</li>
                      <li>GET /api/clientes/:id - Buscar por ID</li>
                      <li>PUT /api/clientes/:id - Atualizar dados</li>
                    </ul>
                  </div>
                  <div>
                    <strong>WhatsApp:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>POST /api/whatsapp/send - Enviar mensagem</li>
                      <li>GET /api/whatsapp/status - Verificar status</li>
                      <li>
                        POST /api/whatsapp/notify - Notificações automáticas
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>🔒 Segurança:</strong> Todas as rotas de API são
                  protegidas com autenticação JWT. Apenas usuários autenticados
                  podem acessar dados sensíveis.
                </p>
              </div>
            </div>
          </Section>

          {/* Cliente Manual */}
          <Section
            title="9. Como o Cliente Utiliza o Sistema"
            icon={<UserCheck className="w-5 h-5" />}
            id="cliente-manual"
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Cadastro e Login
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    <strong>Acessar o Site:</strong> Cliente acessa
                    alphaclean.com.br
                  </li>
                  <li>
                    <strong>Criar Conta:</strong> Clica em Criar conta e
                    preenche dados básicos
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Nome completo</li>
                      <li>Email (usado como login)</li>
                      <li>Telefone (para notificações WhatsApp)</li>
                      <li>Senha segura</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Confirmação:</strong> Recebe email de confirmação de
                    cadastro
                  </li>
                  <li>
                    <strong>Login:</strong> Acessa com email e senha
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Cadastro de Veículos
                </h3>
                <p>Após o login, o cliente deve cadastrar seus veículos:</p>
                <ol className="list-decimal list-inside space-y-2 ml-2 mt-2">
                  <li>Acessa Meus Carros no menu</li>
                  <li>Clica em Adicionar Carro</li>
                  <li>
                    Preenche informações:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Marca e Modelo</li>
                      <li>Placa do veículo</li>
                      <li>Cor e Ano</li>
                      <li>Observações (opcional)</li>
                    </ul>
                  </li>
                  <li>
                    Pode definir um veículo como padrão (pré-selecionado nos
                    agendamentos)
                  </li>
                  <li>Cadastra quantos veículos desejar</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Fazer um Agendamento
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    <strong>Escolher Serviço:</strong> Visualiza os serviços
                    disponíveis com preços e descrições
                  </li>
                  <li>
                    <strong>Selecionar Veículo:</strong> Escolhe qual carro será
                    lavado
                  </li>
                  <li>
                    <strong>Escolher Data:</strong> Seleciona dia disponível no
                    calendário
                  </li>
                  <li>
                    <strong>Escolher Horário:</strong> Vê horários disponíveis e
                    seleciona o preferido
                  </li>
                  <li>
                    <strong>Confirmar:</strong> Revisa os dados e confirma o
                    agendamento
                  </li>
                  <li>
                    <strong>Notificação WhatsApp:</strong> Recebe confirmação
                    automática via WhatsApp
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Gerenciar Agendamentos
                </h3>
                <p>Na área Meus Agendamentos, o cliente pode:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                  <li>
                    <strong>Ver Agendamentos:</strong> Lista todos os serviços
                    (passados e futuros)
                  </li>
                  <li>
                    <strong>Editar:</strong> Modificar data/horário (se ainda
                    não realizado)
                  </li>
                  <li>
                    <strong>Cancelar:</strong> Cancelar agendamento com
                    antecedência
                  </li>
                  <li>
                    <strong>Histórico:</strong> Ver todos os serviços já
                    realizados
                  </li>
                  <li>
                    <strong>Avaliar:</strong> Deixar feedback sobre o serviço
                    (em breve)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Notificações Recebidas
                </h3>
                <p>O cliente recebe mensagens WhatsApp automáticas em:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                  <li>✅ Confirmação ao criar agendamento</li>
                  <li>🔔 Lembrete 24 horas antes do serviço</li>
                  <li>✨ Confirmação quando o serviço é concluído</li>
                  <li>❌ Notificação em caso de cancelamento</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>💚 Experiência do Cliente:</strong> Todo o processo é
                  simples e intuitivo. O cliente não precisa entender nada sobre
                  VM, backend ou configurações técnicas - tudo funciona
                  automaticamente!
                </p>
              </div>
            </div>
          </Section>

          {/* Troubleshooting */}
          <Section
            title="Solução de Problemas Comuns"
            icon={<Settings className="w-5 h-5" />}
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  WhatsApp não está enviando mensagens
                </h3>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Verifique se a VM está ligada e online</li>
                  <li>
                    Confirme se o serviço WhatsApp está rodando (
                    <code className="bg-gray-100 px-1 rounded">
                      npm run whatsapp:status
                    </code>
                    )
                  </li>
                  <li>
                    Verifique os logs para erros (
                    <code className="bg-gray-100 px-1 rounded">
                      npm run whatsapp:logs
                    </code>
                    )
                  </li>
                  <li>
                    Confirme se o WhatsApp está conectado (QR Code escaneado)
                  </li>
                  <li>Verifique se o Cloudflare Tunnel está ativo</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Agendamentos não aparecem
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Verifique a conexão com o banco de dados</li>
                  <li>Confirme se há filtros ativos na visualização</li>
                  <li>Limpe o cache do navegador (Ctrl + Shift + R)</li>
                  <li>Verifique se o usuário tem permissões corretas</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Erro ao criar agendamento
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Verifique se todos os campos obrigatórios estão preenchidos
                  </li>
                  <li>
                    Confirme se o horário selecionado ainda está disponível
                  </li>
                  <li>Verifique se o serviço está ativo</li>
                  <li>Confira se o veículo está cadastrado corretamente</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>📞 Suporte:</strong> Se o problema persistir, entre em
                  contato com o suporte técnico com a descrição detalhada do
                  erro e os logs do sistema.
                </p>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>AlphaClean © 2024 - Manual do Administrador v1.0</p>
          <p className="mt-1">Última atualização: Outubro 2024</p>
        </div>
      </div>
    </div>
  );
}
