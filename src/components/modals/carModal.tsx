// components/modals/carModal.tsx
"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Car as CarIcon } from "lucide-react";
import { Car, CreateCarData, UpdateCarData } from "@/hooks/useCars";

interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCarData | UpdateCarData) => Promise<void>;
  car?: Car | null;
  title: string;
}

export function CarModal({ isOpen, onClose, onSubmit, car, title }: CarModalProps) {
  const [formData, setFormData] = useState<CreateCarData>({
    modelo_veiculo: '',
    cor: '',
    placa: '',
    ano: '',
    marca: '',
    observacoes: '',
    is_default: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Resetar form quando o modal abrir/fechar ou o carro mudar
  useEffect(() => {
    if (isOpen) {
      if (car) {
        setFormData({
          modelo_veiculo: car.modelo_veiculo || '',
          cor: car.cor || '',
          placa: car.placa || '',
          ano: car.ano || '',
          marca: car.marca || '',
          observacoes: car.observacoes || '',
          is_default: car.is_default || false,
        });
      } else {
        setFormData({
          modelo_veiculo: '',
          cor: '',
          placa: '',
          ano: '',
          marca: '',
          observacoes: '',
          is_default: false,
        });
      }
      setErrors({});
    }
  }, [isOpen, car]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.modelo_veiculo.trim()) {
      newErrors.modelo_veiculo = 'Modelo do veículo é obrigatório';
    }

    if (!formData.placa.trim()) {
      newErrors.placa = 'Placa é obrigatória';
    } else {
      // Validação básica de placa
      const plateRegex = /^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/;
      const cleanPlate = formData.placa.replace(/[^A-Z0-9]/g, '').toUpperCase();
      if (!plateRegex.test(cleanPlate)) {
        newErrors.placa = 'Formato de placa inválido (ex: ABC1234 ou ABC1D23)';
      }
    }

    if (formData.ano && (formData.ano.length !== 4 || isNaN(Number(formData.ano)))) {
      newErrors.ano = 'Ano deve ter 4 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Limpar e formatar a placa
      const cleanData = {
        ...formData,
        placa: formData.placa.replace(/[^A-Z0-9]/g, '').toUpperCase(),
        cor: formData.cor?.trim() || null,
        ano: formData.ano?.trim() || null,
        marca: formData.marca?.trim() || null,
        observacoes: formData.observacoes?.trim() || null,
      };

      await onSubmit(cleanData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar carro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateCarData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatPlaca = (value: string): string => {
    // Remove caracteres inválidos e converte para maiúsculo automaticamente
    const clean = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    // Aplica a formatação ABC-1234 ou ABC-1D23
    if (clean.length <= 3) {
      return clean;
    } else if (clean.length <= 7) {
      return clean.slice(0, 3) + '-' + clean.slice(3);
    } else {
      return clean.slice(0, 3) + '-' + clean.slice(3, 7);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                {title}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Modelo do Veículo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo do Veículo *
              </label>
              <input
                type="text"
                value={formData.modelo_veiculo}
                onChange={(e) => handleInputChange('modelo_veiculo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.modelo_veiculo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Honda Civic, Toyota Corolla"
                disabled={loading}
              />
              {errors.modelo_veiculo && (
                <p className="text-red-500 text-sm mt-1">{errors.modelo_veiculo}</p>
              )}
            </div>

            {/* Placa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placa *
              </label>
              <input
                type="text"
                value={formatPlaca(formData.placa)}
                onChange={(e) => handleInputChange('placa', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.placa ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ABC-1234 ou ABC-1D23"
                maxLength={8}
                disabled={loading}
              />
              {errors.placa && (
                <p className="text-red-500 text-sm mt-1">{errors.placa}</p>
              )}
            </div>

            {/* Marca e Cor */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca
                </label>
                <input
                  type="text"
                  value={formData.marca || ''}
                  onChange={(e) => handleInputChange('marca', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Honda, Toyota"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <input
                  type="text"
                  value={formData.cor || ''}
                  onChange={(e) => handleInputChange('cor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Prata, Branco"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Ano */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano
              </label>
              <input
                type="text"
                value={formData.ano || ''}
                onChange={(e) => handleInputChange('ano', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.ano ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 2020"
                maxLength={4}
                disabled={loading}
              />
              {errors.ano && (
                <p className="text-red-500 text-sm mt-1">{errors.ano}</p>
              )}
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={formData.observacoes || ''}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Informações adicionais sobre o veículo"
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Carro Padrão */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => handleInputChange('is_default', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                disabled={loading}
              />
              <label htmlFor="is_default" className="text-sm text-gray-700">
                Definir como carro padrão para agendamentos
              </label>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Salvando...' : car ? 'Atualizar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}