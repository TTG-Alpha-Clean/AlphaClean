"use client";

import {
  BookOpen,
  UserPlus,
  Car,
  Calendar,
  Clock,
  MessageSquare,
  Star,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Smartphone,
  CreditCard,
  Bell,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, icon, children, defaultOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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

export default function ManualCliente() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 sm:p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-2xl sm:text-3xl font-bold">
              Manual do Cliente
            </h1>
          </div>
          <p className="text-blue-100 text-sm sm:text-base">
            Aprenda a usar todas as funcionalidades do AlphaClean para agendar e
            gerenciar seus serviços de lavagem
          </p>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Início Rápido
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="font-semibold text-blue-600 mb-1">
                1. Cadastre-se
              </div>
              <p className="text-gray-600 text-xs">
                Crie sua conta gratuitamente
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="font-semibold text-blue-600 mb-1">
                2. Adicione Carros
              </div>
              <p className="text-gray-600 text-xs">Cadastre seus veículos</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="font-semibold text-blue-600 mb-1">3. Agende</div>
              <p className="text-gray-600 text-xs">Escolha serviço e horário</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="font-semibold text-blue-600 mb-1">
                4. Confirme
              </div>
              <p className="text-gray-600 text-xs">
                Receba notificação WhatsApp
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {/* Cadastro */}
          <Section
            title="1. Como Criar sua Conta"
            icon={<UserPlus className="w-5 h-5" />}
            defaultOpen={true}
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Passo a Passo do Cadastro
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    <strong>Acesse a página inicial</strong> do AlphaClean
                  </li>
                  <li>
                    <strong>Clique em Criar Conta</strong> no canto superior
                    direito
                  </li>
                  <li>
                    <strong>Preencha seus dados:</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>
                        <strong>Nome Completo:</strong> Seu nome para
                        identificação
                      </li>
                      <li>
                        <strong>Email:</strong> Será usado como seu login
                        (escolha um email válido)
                      </li>
                      <li>
                        <strong>Telefone:</strong> Com DDD para receber
                        notificações WhatsApp (ex: 11999999999)
                      </li>
                      <li>
                        <strong>Senha:</strong> Mínimo 6 caracteres, crie uma
                        senha segura
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Confirme sua senha</strong> digitando novamente
                  </li>
                  <li>
                    <strong>Clique em Cadastrar</strong>
                  </li>
                  <li>
                    <strong>Verifique seu email</strong> - você receberá um
                    email de confirmação
                  </li>
                  <li>
                    <strong>Faça login</strong> com seu email e senha
                  </li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm flex items-start gap-2">
                  <Smartphone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Dica:</strong> Use um número de WhatsApp válido no
                    cadastro para receber notificações automáticas sobre seus
                    agendamentos!
                  </span>
                </p>
              </div>
            </div>
          </Section>

          {/* Login */}
          <Section
            title="2. Como Fazer Login"
            icon={<CheckCircle className="w-5 h-5" />}
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Acessando sua Conta
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Acesse a página inicial do AlphaClean</li>
                  <li>Clique em Entrar no menu superior</li>
                  <li>
                    Digite seu <strong>email</strong> cadastrado
                  </li>
                  <li>
                    Digite sua <strong>senha</strong>
                  </li>
                  <li>Clique em Entrar</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Esqueci minha Senha
                </h3>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Na tela de login, clique em Esqueci minha senha</li>
                  <li>Digite seu email cadastrado</li>
                  <li>
                    Você receberá um email com instruções para redefinir a senha
                  </li>
                  <li>Clique no link do email e crie uma nova senha</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>⚠️ Importante:</strong> Por segurança, nunca
                  compartilhe sua senha com ninguém. O AlphaClean nunca pedirá
                  sua senha por email ou WhatsApp.
                </p>
              </div>
            </div>
          </Section>

          {/* Carros */}
          <Section
            title="3. Cadastrar e Gerenciar seus Carros"
            icon={<Car className="w-5 h-5" />}
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Adicionar um Novo Carro
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    Após fazer login, acesse <strong>Meus Carros</strong> no
                    menu
                  </li>
                  <li>
                    Clique no botão <strong>+ Adicionar Carro</strong>
                  </li>
                  <li>
                    Preencha as informações do veículo:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>
                        <strong>Marca:</strong> Ex: Toyota, Honda, Volkswagen
                      </li>
                      <li>
                        <strong>Modelo:</strong> Ex: Corolla, Civic, Gol
                      </li>
                      <li>
                        <strong>Placa:</strong> Ex: ABC1D23
                      </li>
                      <li>
                        <strong>Cor:</strong> Ex: Preto, Branco, Prata
                      </li>
                      <li>
                        <strong>Ano:</strong> Ex: 2020
                      </li>
                      <li>
                        <strong>Observações:</strong> Opcional - informações
                        extras sobre o veículo
                      </li>
                    </ul>
                  </li>
                  <li>
                    Clique em <strong>Salvar</strong>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Carro Padrão
                </h3>
                <p>
                  Você pode definir um carro como <strong>padrão</strong>{" "}
                  (favorito):
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                  <li>
                    O carro padrão será pré-selecionado automaticamente ao fazer
                    novos agendamentos
                  </li>
                  <li>
                    Identificado com uma{" "}
                    <Star className="w-4 h-4 inline text-yellow-500" /> estrela
                    dourada
                  </li>
                  <li>
                    Para definir, clique na estrela ao lado do carro desejado
                  </li>
                  <li>Você pode ter apenas 1 carro padrão por vez</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Editar ou Excluir Carros
                </h3>
                <p>Na lista de carros, você tem as seguintes opções:</p>
                <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                  <li className="flex items-start gap-2">
                    <Edit className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600" />
                    <span>
                      <strong>Editar:</strong> Clique no ícone de lápis para
                      modificar informações do carro
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Trash2 className="w-4 h-4 mt-1 flex-shrink-0 text-red-600" />
                    <span>
                      <strong>Excluir:</strong> Clique no ícone de lixeira para
                      remover o carro (cuidado: não pode ser desfeito!)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 mt-1 flex-shrink-0 text-yellow-500" />
                    <span>
                      <strong>Favoritar:</strong> Clique na estrela para definir
                      como padrão
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>💡 Dica:</strong> Cadastre todos os seus veículos para
                  agendar serviços mais rapidamente no futuro!
                </p>
              </div>
            </div>
          </Section>

          {/* Agendamento */}
          <Section
            title="4. Como Fazer um Agendamento"
            icon={<Calendar className="w-5 h-5" />}
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Passo a Passo para Agendar
                </h3>
                <ol className="list-decimal list-inside space-y-3 ml-2">
                  <li>
                    <strong>Escolha o Serviço</strong>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                      <li>Navegue pelos serviços disponíveis</li>
                      <li>Veja preços, descrição e duração de cada serviço</li>
                      <li>Clique em Agendar no serviço desejado</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Selecione o Veículo</strong>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                      <li>Escolha qual carro será lavado</li>
                      <li>
                        Se tiver um carro padrão, ele já estará selecionado
                      </li>
                      <li>
                        Se não tiver carros cadastrados, você será direcionado
                        para cadastrar
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Escolha a Data</strong>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                      <li>Clique no calendário para ver dias disponíveis</li>
                      <li>Dias desabilitados não têm horários livres</li>
                      <li>Selecione a data desejada</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Escolha o Horário</strong>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                      <li>
                        Veja os horários disponíveis para a data escolhida
                      </li>
                      <li>Horários ocupados não aparecem na lista</li>
                      <li>Selecione o horário que preferir</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Confirme o Agendamento</strong>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                      <li>
                        Revise todas as informações (serviço, carro, data,
                        horário)
                      </li>
                      <li>Adicione observações se necessário</li>
                      <li>Clique em Confirmar Agendamento</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Confirmação e Notificações
                </h3>
                <p>Após confirmar o agendamento:</p>
                <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                  <li className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0 text-green-600" />
                    <span>
                      <strong>Confirmação Imediata:</strong> Você receberá uma
                      mensagem no WhatsApp confirmando o agendamento com todos
                      os detalhes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Bell className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600" />
                    <span>
                      <strong>Lembrete:</strong> 24 horas antes do serviço, você
                      receberá um lembrete automático no WhatsApp
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-green-600" />
                    <span>
                      <strong>Conclusão:</strong> Quando o serviço for
                      concluído, você receberá uma mensagem de agradecimento
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>📱 Notificações WhatsApp:</strong> Certifique-se de
                  que seu número está correto no cadastro para receber todas as
                  notificações automáticas!
                </p>
              </div>
            </div>
          </Section>

          {/* Gerenciar Agendamentos */}
          <Section
            title="5. Gerenciar Meus Agendamentos"
            icon={<Clock className="w-5 h-5" />}
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Visualizar Agendamentos
                </h3>
                <p>
                  Acesse <strong>Meus Agendamentos</strong> no menu para ver:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                  <li>
                    <strong>Agendamentos Futuros:</strong> Serviços que ainda
                    vão acontecer
                  </li>
                  <li>
                    <strong>Histórico:</strong> Serviços já realizados ou
                    cancelados
                  </li>
                  <li>
                    <strong>Status:</strong> Agendado, Concluído ou Cancelado
                  </li>
                  <li>
                    <strong>Detalhes:</strong> Data, horário, serviço, veículo e
                    valor
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Status dos Agendamentos
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>
                      <strong>Agendado:</strong> Serviço confirmado, aguardando
                      a data
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>
                      <strong>Concluído:</strong> Serviço foi realizado com
                      sucesso
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>
                      <strong>Cancelado:</strong> Agendamento foi cancelado
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Editar um Agendamento
                </h3>
                <p>Para alterar data/horário de um agendamento:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 mt-2">
                  <li>Acesse Meus Agendamentos</li>
                  <li>Encontre o agendamento que deseja alterar</li>
                  <li>
                    Clique no botão{" "}
                    <Edit className="w-4 h-4 inline text-blue-600" /> Editar
                  </li>
                  <li>Escolha a nova data e horário disponíveis</li>
                  <li>Confirme a alteração</li>
                  <li>
                    Você receberá uma confirmação no WhatsApp com os novos dados
                  </li>
                </ol>
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Nota:</strong> Só é possível editar agendamentos que
                  ainda não foram concluídos ou cancelados.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Cancelar um Agendamento
                </h3>
                <p>Se precisar cancelar:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 mt-2">
                  <li>Acesse Meus Agendamentos</li>
                  <li>Encontre o agendamento que deseja cancelar</li>
                  <li>
                    Clique no botão{" "}
                    <XCircle className="w-4 h-4 inline text-red-600" /> Cancelar
                  </li>
                  <li>Confirme o cancelamento</li>
                  <li>O status mudará para Cancelado</li>
                  <li>Você receberá uma confirmação no WhatsApp</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>⚠️ Política de Cancelamento:</strong> Recomendamos
                  cancelar com pelo menos 24 horas de antecedência para que
                  outros clientes possam utilizar o horário.
                </p>
              </div>
            </div>
          </Section>

          {/* Notificações */}
          <Section
            title="6. Notificações WhatsApp"
            icon={<MessageSquare className="w-5 h-5" />}
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Tipos de Notificações
                </h3>
                <p>
                  Você receberá mensagens automáticas no WhatsApp em diversas
                  situações:
                </p>

                <div className="space-y-3 mt-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <strong className="text-green-900">
                        Confirmação de Agendamento
                      </strong>
                    </div>
                    <p className="text-sm text-gray-700">
                      Enviada imediatamente após você criar um novo agendamento,
                      contendo todos os detalhes: serviço, data, horário e
                      veículo.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <strong className="text-blue-900">
                        Lembrete Automático
                      </strong>
                    </div>
                    <p className="text-sm text-gray-700">
                      Enviada 24 horas antes do seu agendamento para lembrá-lo
                      do serviço marcado.
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                      <strong className="text-purple-900">
                        Confirmação de Conclusão
                      </strong>
                    </div>
                    <p className="text-sm text-gray-700">
                      Enviada quando o serviço é marcado como concluído,
                      agradecendo pela preferência.
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <strong className="text-red-900">
                        Aviso de Cancelamento
                      </strong>
                    </div>
                    <p className="text-sm text-gray-700">
                      Enviada se você ou o estabelecimento cancelar o
                      agendamento, informando o cancelamento.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Número WhatsApp Incorreto
                </h3>
                <p>Se você não está recebendo as notificações:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 mt-2">
                  <li>Verifique se o número cadastrado está correto</li>
                  <li>Acesse Meu Perfil ou Configurações</li>
                  <li>Atualize seu número de telefone se necessário</li>
                  <li>Certifique-se de incluir o DDD (ex: 11999999999)</li>
                  <li>Salve as alterações</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>📱 Importante:</strong> As notificações são enviadas
                  automaticamente pelo sistema. Não responda às mensagens, pois
                  elas são apenas informativas. Para qualquer dúvida, entre em
                  contato diretamente com o AlphaClean.
                </p>
              </div>
            </div>
          </Section>

          {/* Dúvidas Frequentes */}
          <Section
            title="7. Perguntas Frequentes"
            icon={<HelpCircle className="w-5 h-5" />}
          >
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Posso cadastrar mais de um carro?
                </h3>
                <p>
                  Sim! Você pode cadastrar quantos veículos desejar na seção
                  Meus Carros. Isso facilita agendar serviços para diferentes
                  carros sem precisar recadastrar informações.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Como funciona o pagamento?
                </h3>
                <p>
                  O pagamento é realizado diretamente no local, após o serviço
                  ser concluído. Aceitamos dinheiro, cartão de débito, crédito e
                  PIX.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Posso cancelar um agendamento?
                </h3>
                <p>
                  Sim, você pode cancelar a qualquer momento através da área
                  Meus Agendamentos. Recomendamos cancelar com pelo menos 24
                  horas de antecedência.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  O que acontece se eu atrasar?
                </h3>
                <p>
                  Se você não puder comparecer no horário agendado, entre em
                  contato o quanto antes. Tentaremos reagendar, mas dependendo
                  da disponibilidade, pode ser necessário escolher outro
                  horário.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Posso alterar a data/horário do agendamento?
                </h3>
                <p>
                  Sim! Acesse Meus Agendamentos, clique em Editar no agendamento
                  desejado e escolha uma nova data e horário disponíveis.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Não recebi a notificação WhatsApp, e agora?
                </h3>
                <p>Verifique se:</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Seu número está correto no cadastro (com DDD)</li>
                  <li>Você tem o WhatsApp instalado e ativo neste número</li>
                  <li>Não bloqueou nosso número</li>
                  <li>Seu agendamento foi confirmado com sucesso no sistema</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Posso agendar para o mesmo dia?
                </h3>
                <p>
                  Depende da disponibilidade. O sistema mostra apenas horários
                  disponíveis. Se houver vagas para o mesmo dia, você poderá
                  agendar. Caso contrário, escolha outra data.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Como alterar meus dados cadastrais?
                </h3>
                <p>
                  Acesse Meu Perfil ou Configurações no menu. Lá você pode
                  atualizar nome, email, telefone e senha.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Esqueci minha senha, o que faço?
                </h3>
                <p>
                  Na tela de login, clique em Esqueci minha senha, digite seu
                  email e siga as instruções enviadas por email para redefinir.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>💬 Ainda tem dúvidas?</strong> Entre em contato
                  conosco através do WhatsApp, email ou telefone. Estamos sempre
                  prontos para ajudar!
                </p>
              </div>
            </div>
          </Section>

          {/* Dicas */}
          <Section
            title="8. Dicas para Melhor Experiência"
            icon={<Star className="w-5 h-5" />}
          >
            <div className="space-y-4 text-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Cadastre todos os carros
                  </h4>
                  <p className="text-sm text-gray-700">
                    Cadastre todos os seus veículos de uma vez. Isso torna os
                    próximos agendamentos muito mais rápidos!
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Defina um carro padrão
                  </h4>
                  <p className="text-sm text-gray-700">
                    Marque seu carro mais usado como padrão. Ele será
                    pré-selecionado automaticamente em novos agendamentos.
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Ative notificações
                  </h4>
                  <p className="text-sm text-gray-700">
                    Mantenha seu WhatsApp ativo para receber lembretes e
                    confirmações automáticas.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Agende com antecedência
                  </h4>
                  <p className="text-sm text-gray-700">
                    Agende seus serviços com antecedência para garantir o melhor
                    horário para você!
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Chegue no horário
                  </h4>
                  <p className="text-sm text-gray-700">
                    Chegue alguns minutos antes do horário agendado para
                    garantir que seu serviço comece pontualmente.
                  </p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Salve nosso contato
                  </h4>
                  <p className="text-sm text-gray-700">
                    Salve o número do AlphaClean nos seus contatos para
                    identificar facilmente nossas mensagens.
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>AlphaClean © 2024 - Manual do Cliente v1.0</p>
          <p className="mt-1">Última atualização: Outubro 2024</p>
        </div>
      </div>
    </div>
  );
}
