"use client";

import { useState, useEffect } from "react";
import { Users, Search, Mail, Phone, Car } from "lucide-react";
import { toast } from "react-hot-toast";

interface CarData {
  _id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
}

interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  cars: CarData[];
  createdAt: string;
}

export function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar clientes");

      const result = await response.json();
      const clientsData = result.data || result;
      setClients(clientsData);
      setFilteredClients(clientsData);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.phone.includes(term) ||
        client.cars.some(
          (car) =>
            car.brand?.toLowerCase().includes(term) ||
            car.model?.toLowerCase().includes(term) ||
            car.licensePlate?.toLowerCase().includes(term)
        )
    );
    setFilteredClients(filtered);
  };

  const formatPhone = (phone: string) => {
    if (!phone) return "-";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 13) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4");
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Users className="w-5 h-5 text-orange-600 mr-2" />
            Clientes
          </h2>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Users className="w-5 h-5 text-orange-600 mr-2" />
          Clientes ({filteredClients.length})
        </h2>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto">
        {filteredClients.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
            </p>
          </div>
        ) : (
          filteredClients.map((client) => (
            <div
              key={client._id}
              className="border border-gray-200 rounded-lg p-3 hover:border-orange-300 hover:shadow-sm transition-all"
            >
              <h3 className="font-semibold text-gray-900 text-sm mb-2">
                {client.name}
              </h3>

              <div className="space-y-1.5">
                <div className="flex items-start text-xs text-gray-600">
                  <Mail className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>

                {client.phone && (
                  <div className="flex items-center text-xs text-gray-600">
                    <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                    <span>{formatPhone(client.phone)}</span>
                  </div>
                )}

                {client.cars && client.cars.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500 mb-1.5">
                      <Car className="w-3.5 h-3.5 mr-1 text-orange-500" />
                      <span className="font-medium">{client.cars.length} {client.cars.length === 1 ? 'veículo' : 'veículos'}</span>
                    </div>
                    {client.cars.slice(0, 2).map((car) => (
                      <div
                        key={car._id}
                        className="bg-gray-50 rounded px-2 py-1.5 mb-1 text-xs"
                      >
                        <div className="font-medium text-gray-900">
                          {car.brand} {car.model}
                        </div>
                        <div className="text-gray-600 flex items-center justify-between mt-0.5">
                          <span>{car.year}</span>
                          <span className="font-mono bg-gray-200 px-1.5 py-0.5 rounded">
                            {car.licensePlate}
                          </span>
                        </div>
                      </div>
                    ))}
                    {client.cars.length > 2 && (
                      <p className="text-xs text-gray-500 italic mt-1">
                        +{client.cars.length - 2} {client.cars.length - 2 === 1 ? 'outro' : 'outros'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
