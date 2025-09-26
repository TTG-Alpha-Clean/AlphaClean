"use client";

import { useState, useEffect } from "react";
import {
  Save,
  RefreshCw,
  Home,
  Settings,
  Edit3,
  Eye,
  Plus,
  Trash2,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";

// Tipos para o conteúdo editável
interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  servicesTitle: string;
  servicesDescription: string;
  contactTitle: string;
  contactDescription: string;
}

interface ServicesPageContent {
  title: string;
  subtitle: string;
  buttonText: string;
}

interface ContentManagementProps {
  onClose: () => void;
}

export function ContentManagement({ onClose }: ContentManagementProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'services'>('home');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados para o conteúdo
  const [homeContent, setHomeContent] = useState<HomeContent>({
    heroTitle: "Cuidado Profissional para seu Veículo",
    heroSubtitle: "Mais do que uma lavagem, oferecemos uma experiência completa de cuidado automotivo com produtos premium e técnicas especializadas.",
    aboutTitle: "Sobre a Alpha Clean",
    aboutDescription: "Mais do que um serviço, proporcionamos uma experiência: o cuidado de quem realmente entende e ama carros.",
    servicesTitle: "Nossos Serviços",
    servicesDescription: "Oferecemos uma gama completa de serviços para manter seu veículo sempre impecável. Escolha o serviço que melhor atende suas necessidades.",
    contactTitle: "Entre em Contato",
    contactDescription: "Estamos prontos pra atender você! Entre em contato conosco para agendar seu serviço ou esclarecer qualquer dúvida."
  });

  const [servicesContent, setServicesContent] = useState<ServicesPageContent>({
    title: "Nossos Serviços",
    subtitle: "Escolha o serviço ideal para seu veículo. Todos executados com produtos profissionais e técnicas especializadas.",
    buttonText: "Agendar Agora"
  });

  // Carregar conteúdo atual (mock - em produção viria da API)
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Simula carregamento da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Em produção, aqui faria as chamadas reais para a API
      // const homeResponse = await fetch('/api/content/home');
      // const servicesResponse = await fetch('/api/content/services');

      toast.success("Conteúdo carregado com sucesso");
    } catch (error) {
      console.error("Erro ao carregar conteúdo:", error);
      toast.error("Erro ao carregar conteúdo");
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      // Simula salvamento na API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Em produção, aqui faria as chamadas para salvar na API
      if (activeTab === 'home') {
        // await fetch('/api/content/home', { method: 'PUT', body: JSON.stringify(homeContent) });
        console.log('Salvando conteúdo da home:', homeContent);
      } else {
        // await fetch('/api/content/services', { method: 'PUT', body: JSON.stringify(servicesContent) });
        console.log('Salvando conteúdo dos serviços:', servicesContent);
      }

      toast.success("Conteúdo salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar conteúdo:", error);
      toast.error("Erro ao salvar conteúdo");
    } finally {
      setSaving(false);
    }
  };

  const resetContent = () => {
    if (activeTab === 'home') {
      setHomeContent({
        heroTitle: "Cuidado Profissional para seu Veículo",
        heroSubtitle: "Mais do que uma lavagem, oferecemos uma experiência completa de cuidado automotivo com produtos premium e técnicas especializadas.",
        aboutTitle: "Sobre a Alpha Clean",
        aboutDescription: "Mais do que um serviço, proporcionamos uma experiência: o cuidado de quem realmente entende e ama carros.",
        servicesTitle: "Nossos Serviços",
        servicesDescription: "Oferecemos uma gama completa de serviços para manter seu veículo sempre impecável. Escolha o serviço que melhor atende suas necessidades.",
        contactTitle: "Entre em Contato",
        contactDescription: "Estamos prontos pra atender você! Entre em contato conosco para agendar seu serviço ou esclarecer qualquer dúvida."
      });
    } else {
      setServicesContent({
        title: "Nossos Serviços",
        subtitle: "Escolha o serviço ideal para seu veículo. Todos executados com produtos profissionais e técnicas especializadas.",
        buttonText: "Agendar Agora"
      });
    }
    toast.success("Conteúdo resetado para os valores padrão");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Carregando gerenciador de conteúdo...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Gerenciador de Conteúdo</h2>
              <p className="text-sm text-gray-500">Edite os textos das páginas do site</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={resetContent}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Resetar para padrão"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Resetar</span>
            </button>

            <button
              onClick={saveContent}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Salvando..." : "Salvar"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'home'
                ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Página Inicial</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'services'
                ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Página de Serviços</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'home' ? (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conteúdo da Página Inicial</h3>

              {/* Seção Hero */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Seção Principal (Hero)</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={homeContent.heroTitle}
                      onChange={(e) => setHomeContent(prev => ({ ...prev, heroTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite o título principal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtítulo
                    </label>
                    <textarea
                      value={homeContent.heroSubtitle}
                      onChange={(e) => setHomeContent(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Digite o subtítulo"
                    />
                  </div>
                </div>
              </div>

              {/* Seção Sobre */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Seção Sobre</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título da Seção
                    </label>
                    <input
                      type="text"
                      value={homeContent.aboutTitle}
                      onChange={(e) => setHomeContent(prev => ({ ...prev, aboutTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite o título da seção sobre"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={homeContent.aboutDescription}
                      onChange={(e) => setHomeContent(prev => ({ ...prev, aboutDescription: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Digite a descrição da seção sobre"
                    />
                  </div>
                </div>
              </div>

              {/* Seção Serviços */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Seção Serviços</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título da Seção
                    </label>
                    <input
                      type="text"
                      value={homeContent.servicesTitle}
                      onChange={(e) => setHomeContent(prev => ({ ...prev, servicesTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite o título da seção de serviços"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={homeContent.servicesDescription}
                      onChange={(e) => setHomeContent(prev => ({ ...prev, servicesDescription: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Digite a descrição da seção de serviços"
                    />
                  </div>
                </div>
              </div>

              {/* Seção Contato */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Seção Contato</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título da Seção
                    </label>
                    <input
                      type="text"
                      value={homeContent.contactTitle}
                      onChange={(e) => setHomeContent(prev => ({ ...prev, contactTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite o título da seção de contato"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={homeContent.contactDescription}
                      onChange={(e) => setHomeContent(prev => ({ ...prev, contactDescription: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Digite a descrição da seção de contato"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conteúdo da Página de Serviços</h3>

              {/* Banner da página de serviços */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Banner Principal</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={servicesContent.title}
                      onChange={(e) => setServicesContent(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite o título da página de serviços"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtítulo
                    </label>
                    <textarea
                      value={servicesContent.subtitle}
                      onChange={(e) => setServicesContent(prev => ({ ...prev, subtitle: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Digite o subtítulo da página de serviços"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={servicesContent.buttonText}
                      onChange={(e) => setServicesContent(prev => ({ ...prev, buttonText: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite o texto do botão"
                    />
                  </div>
                </div>
              </div>

              {/* Nota informativa */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Eye className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Nota sobre os serviços</h4>
                    <p className="text-sm text-blue-700">
                      Os serviços exibidos na página são carregados dinamicamente do sistema de gerenciamento de serviços.
                      Para editar os serviços individuais (nome, preço, descrição), use a seção "Gerenciar Serviços" no painel admin.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer com botões */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              As alterações serão aplicadas imediatamente após salvar
            </p>

            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>

              <button
                onClick={saveContent}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Salvando..." : "Salvar Alterações"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}