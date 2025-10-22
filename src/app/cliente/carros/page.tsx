// app/cliente/carros/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Car as CarIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { getToken } from "@/utils/api";

import { useCars, Car, CreateCarData, UpdateCarData } from "@/hooks/useCars";
import { CarList } from "@/components/lists/carList";
import { CarModal } from "@/components/modals/carModal";

export default function CarrosPage() {
  const router = useRouter();
  const { cars, loading, createCar, updateCar, deleteCar, setDefaultCar } = useCars();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [checking, setChecking] = useState(true);

  // Verificar autenticação
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    setChecking(false);
  }, [router]);

  const handleCreateCar = () => {
    setEditingCar(null);
    setModalOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setModalOpen(true);
  };

  const handleSubmitCar = async (data: CreateCarData | UpdateCarData) => {
    if (editingCar) {
      await updateCar(editingCar.id, data as UpdateCarData);
    } else {
      await createCar(data as CreateCarData);
    }
  };

  const handleDeleteCar = async (carId: number) => {
    const carToDelete = cars.find(car => car.id === carId);
    if (!carToDelete) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o carro ${carToDelete.modelo_veiculo} (${carToDelete.placa})?`
    );

    if (confirmed) {
      await deleteCar(carId);
    }
  };

  const handleSetDefault = async (carId: number) => {
    await setDefaultCar(carId);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push("/cliente")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Voltar ao Dashboard</span>
              <span className="sm:hidden">Voltar</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <CarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Meus Carros</h1>
                <p className="text-sm sm:text-base text-gray-600">Gerencie seus veículos cadastrados</p>
              </div>
            </div>

            <button
              onClick={handleCreateCar}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar Carro</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total de Carros</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{cars.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <CarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Carros Cadastrados</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {cars.length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <CarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Carro Padrão</p>
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                  {cars.find(car => car.is_default)?.modelo_veiculo || 'Nenhum definido'}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg flex-shrink-0">
                <CarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Carros */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Veículos Cadastrados</h2>
            {cars.length > 0 && (
              <span className="text-sm text-gray-500">
                {cars.length} {cars.length === 1 ? 'carro' : 'carros'}
              </span>
            )}
          </div>

          <CarList
            cars={cars}
            loading={loading}
            onEditCar={handleEditCar}
            onDeleteCar={handleDeleteCar}
            onSetDefault={handleSetDefault}
          />
        </div>

        {/* Modal de Criar/Editar Carro */}
        <CarModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitCar}
          car={editingCar}
          title={editingCar ? 'Editar Carro' : 'Adicionar Carro'}
        />
      </div>
    </div>
  );
}