"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Car,
  Mail,
  Phone,
  Search,
  Calendar,
  Package,
  ArrowLeft
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Car {
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
  cars: Car[];
  createdAt: string;
  totalAppointments?: number;
}

export default function ClientsPage() {
  const router = useRouter();
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
      const clientsData = result.data || result; // Suporta tanto paginado quanto array direto
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
            car.brand.toLowerCase().includes(term) ||
            car.model.toLowerCase().includes(term) ||
            car.licensePlate.toLowerCase().includes(term)
        )
    );
    setFilteredClients(filtered);
  };

  const formatPhone = (phone: string) => {
    // Remove tudo que não é número
    const cleaned = phone.replace(/\D/g, "");
    // Formata: (XX) XXXXX-XXXX
    if (cleaned.length === 13) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4");
    }
    return phone;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar para Admin</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Users className="w-8 h-8 text-orange-600 mr-3" />
                Clientes Cadastrados
              </h1>
              <p className="mt-2 text-gray-600">
                Total: {filteredClients.length} {filteredClients.length === 1 ? "cliente" : "clientes"}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, email, telefone ou carro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Clients List */}
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum cliente encontrado
            </h3>
            <p className="text-gray-500">
              {searchTerm ? "Tente buscar com outros termos" : "Ainda não há clientes cadastrados"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <div
                key={client._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                {/* Client Info */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {client.name}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span>{formatPhone(client.phone)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span>Cliente desde {formatDate(client.createdAt)}</span>
                    </div>

                    {client.totalAppointments !== undefined && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span>
                          {client.totalAppointments}{" "}
                          {client.totalAppointments === 1 ? "agendamento" : "agendamentos"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cars */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Car className="w-4 h-4 mr-1 text-orange-600" />
                    Veículos ({client.cars.length})
                  </h4>

                  {client.cars.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Nenhum veículo cadastrado</p>
                  ) : (
                    <div className="space-y-2">
                      {client.cars.map((car) => (
                        <div
                          key={car._id}
                          className="bg-gray-50 rounded-lg p-3 text-sm"
                        >
                          <div className="font-medium text-gray-900">
                            {car.brand} {car.model}
                          </div>
                          <div className="text-gray-600 mt-1 flex items-center justify-between">
                            <span>Ano: {car.year}</span>
                            <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">
                              {car.licensePlate}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
