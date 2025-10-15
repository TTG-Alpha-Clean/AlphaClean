// components/lists/carList.tsx
"use client";

import { Car } from "@/hooks/useCars";
import { Car as CarIcon, Edit2, Trash2, Star, StarOff } from "lucide-react";

interface CarListProps {
  cars: Car[];
  loading: boolean;
  onEditCar: (car: Car) => void;
  onDeleteCar: (carId: number) => void;
  onSetDefault: (carId: number) => void;
}

export function CarList({ cars, loading, onEditCar, onDeleteCar, onSetDefault }: CarListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-12">
        <CarIcon className="mx-auto w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum carro cadastrado</h3>
        <p className="text-gray-500 mb-4">
          Cadastre seu primeiro veículo para facilitar seus agendamentos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cars.map((car) => (
        <div
          key={car.id}
          className={`bg-white rounded-lg border ${
            car.is_default ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
          } p-4 transition-colors hover:bg-gray-50`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${
                car.is_default ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                <CarIcon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {car.modelo_veiculo}
                  </h3>
                  {car.is_default && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      Padrão
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">Placa: {car.placa}</span>
                    {car.cor && <span>Cor: {car.cor}</span>}
                  </div>

                  <div className="flex items-center space-x-4">
                    {car.marca && <span>Marca: {car.marca}</span>}
                    {car.ano && <span>Ano: {car.ano}</span>}
                  </div>

                  {car.observacoes && (
                    <div className="text-gray-500 text-sm mt-2">
                      <strong>Observações:</strong> {car.observacoes}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onSetDefault(car.id)}
                className={`p-2 rounded-lg transition-colors ${
                  car.is_default
                    ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200'
                    : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-100'
                }`}
                title={car.is_default ? 'Remover como padrão' : 'Definir como padrão'}
              >
                {car.is_default ? (
                  <Star className="w-5 h-5 fill-current" />
                ) : (
                  <StarOff className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => onEditCar(car)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                title="Editar carro"
              >
                <Edit2 className="w-5 h-5" />
              </button>

              <button
                onClick={() => onDeleteCar(car.id)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                title="Excluir carro"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}