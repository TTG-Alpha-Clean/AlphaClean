// components/lists/carList.tsx
"use client";

import { Car } from "@/hooks/useCars";
import { Car as CarIcon, Star, StarOff } from "lucide-react";
import EditButton from "@/components/ui/editButton";
import DeleteButton from "@/components/ui/deleteButton";

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
    <div className="space-y-3 sm:space-y-4">
      {cars.map((car) => (
        <div
          key={car.id}
          className={`bg-white rounded-lg border ${
            car.is_default ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
          } p-3 sm:p-4 transition-colors hover:bg-gray-50`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                car.is_default ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                <CarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {car.modelo_veiculo}
                  </h3>
                  {car.is_default && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                      Padrão
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-gray-600 space-y-1 mt-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-medium">Placa: {car.placa}</span>
                    {car.cor && <span>Cor: {car.cor}</span>}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {car.marca && <span>Marca: {car.marca}</span>}
                    {car.ano && <span>Ano: {car.ano}</span>}
                  </div>

                  {car.observacoes && (
                    <div className="text-gray-500 text-xs sm:text-sm mt-2 line-clamp-2">
                      <strong>Observações:</strong> {car.observacoes}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-2 sm:ml-4 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => onSetDefault(car.id)}
                className={`p-2 sm:p-2 rounded-lg transition-colors ${
                  car.is_default
                    ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200'
                    : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-100'
                }`}
                title={car.is_default ? 'Remover como padrão' : 'Definir como padrão'}
              >
                {car.is_default ? (
                  <Star className="w-5 h-5 sm:w-5 sm:h-5 fill-current" />
                ) : (
                  <StarOff className="w-5 h-5 sm:w-5 sm:h-5" />
                )}
              </button>

              <EditButton
                onClick={() => onEditCar(car)}
                title="Editar carro"
                size="sm"
              />

              <DeleteButton
                onClick={() => onDeleteCar(car.id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}