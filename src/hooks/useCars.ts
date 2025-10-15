// hooks/useCars.ts
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { getToken } from '@/utils/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export interface Car {
  id: number;
  usuario_id: number;
  modelo_veiculo: string;
  cor?: string | null;
  placa: string;
  ano?: string | null;
  marca?: string | null;
  observacoes?: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCarData {
  modelo_veiculo: string;
  cor?: string | null;
  placa: string;
  ano?: string | null;
  marca?: string | null;
  observacoes?: string | null;
  is_default?: boolean;
}

export interface UpdateCarData extends Partial<CreateCarData> {
}

interface CarsResponse {
  data: Car[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_URL}/api/cars`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar carros');
      }

      const data: CarsResponse = await response.json();
      setCars(data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCar = useCallback(async (carData: CreateCarData): Promise<Car | null> => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_URL}/api/cars`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar carro');
      }

      const newCar: Car = await response.json();
      setCars(prev => [newCar, ...prev]);
      toast.success('Carro cadastrado com sucesso!');
      return newCar;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar carro';
      toast.error(errorMessage);
      return null;
    }
  }, []);

  const updateCar = useCallback(async (carId: number, carData: UpdateCarData): Promise<Car | null> => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_URL}/api/cars/${carId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar carro');
      }

      const updatedCar: Car = await response.json();
      setCars(prev => prev.map(car => car.id === carId ? updatedCar : car));
      toast.success('Carro atualizado com sucesso!');
      return updatedCar;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar carro';
      toast.error(errorMessage);
      return null;
    }
  }, []);

  const deleteCar = useCallback(async (carId: number): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_URL}/api/cars/${carId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir carro');
      }

      setCars(prev => prev.filter(car => car.id !== carId));
      toast.success('Carro excluído com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir carro';
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const setDefaultCar = useCallback(async (carId: number): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_URL}/api/cars/${carId}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao definir carro padrão');
      }

      const updatedCar: Car = await response.json();
      setCars(prev => prev.map(car => ({
        ...car,
        is_default: car.id === carId
      })));
      toast.success('Carro padrão definido com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao definir carro padrão';
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const getDefaultCar = useCallback(async (): Promise<Car | null> => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_URL}/api/cars/default`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Nenhum carro padrão configurado
        }
        throw new Error('Erro ao buscar carro padrão');
      }

      const defaultCar: Car = await response.json();
      return defaultCar;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar carro padrão';
      console.error(errorMessage);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return {
    cars,
    loading,
    error,
    fetchCars,
    createCar,
    updateCar,
    deleteCar,
    setDefaultCar,
    getDefaultCar,
  };
}