"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { X, Upload, Plus, Trash2, Briefcase } from "lucide-react";
import { toast } from "react-hot-toast";
import { getToken } from "@/utils/api";
import Image from "next/image";

// Usa NEXT_PUBLIC_API_URL para os serviços do site (backend principal)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ServiceInformation {
  id?: number;
  description: string;
}

interface Service {
  service_id: number;
  type: string;
  title: string;
  subtitle?: string;
  price: number | string;
  time: number | string;
  service_description?: string;
  image_url?: string;
  informations?: ServiceInformation[];
}

interface ServiceFormModalProps {
  service?: Service | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ServiceFormModal({ service, onClose, onSuccess }: ServiceFormModalProps) {
  const [formData, setFormData] = useState({
    title: service?.title || "",
    subtitle: service?.subtitle || "",
    price: service?.price?.toString() || "",
    time: service?.time?.toString() || "",
    description: service?.service_description || "",
  });

  const [informations, setInformations] = useState<string[]>(
    service?.informations?.map((info) => info.description) || []
  );
  const [newInformation, setNewInformation] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    service?.image_url || null
  );
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addInformation = () => {
    if (newInformation.trim()) {
      setInformations([...informations, newInformation.trim()]);
      setNewInformation("");
    }
  };

  const removeInformation = (index: number) => {
    setInformations(informations.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.time) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!formData.description || formData.description.trim() === "") {
      toast.error("Descrição é obrigatória");
      return;
    }

    if (informations.length === 0) {
      toast.error("Adicione pelo menos um item incluso no serviço");
      return;
    }

    const price = Number(formData.price);
    const time = Number(formData.time);

    if (isNaN(price) || price <= 0) {
      toast.error("Preço inválido");
      return;
    }

    if (isNaN(time) || time <= 0) {
      toast.error("Tempo inválido");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(
      service ? "Atualizando serviço..." : "Criando serviço..."
    );

    try {
      const token = getToken();
      const formDataToSend = new FormData();

      // Usar o título como tipo também (já que foi removido o campo tipo separado)
      formDataToSend.append("type", formData.title);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle);
      formDataToSend.append("valor", price.toString());
      formDataToSend.append("time_minutes", time.toString());
      formDataToSend.append("description", formData.description);

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const url = service
        ? `${API_URL}/api/services/${service.service_id}`
        : `${API_URL}/api/services`;

      const method = service ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao salvar serviço");
      }

      const savedService = await res.json();

      // Salvar informações separadamente se houver
      if (informations.length > 0) {
        await saveInformations(savedService.id || service?.service_id, informations);
      }

      toast.success(
        service ? "Serviço atualizado com sucesso!" : "Serviço criado com sucesso!",
        { id: toastId }
      );

      onSuccess();
    } catch (error: any) {
      console.error("Erro ao salvar serviço:", error);
      toast.error(error.message || "Erro ao salvar serviço", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const saveInformations = async (serviceId: number, infos: string[]) => {
    const token = getToken();

    try {
      await fetch(`${API_URL}/api/services/${serviceId}/informations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ informations: infos }),
      });
    } catch (error) {
      console.error("Erro ao salvar informações:", error);
      // Não vamos bloquear o fluxo se falhar ao salvar as informações
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {service ? "Editar Serviço" : "Novo Serviço"}
              </h2>
              <p className="text-sm text-gray-500">
                {service ? "Atualizar informações do serviço" : "Criar um novo serviço"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Lavagem Completa Premium"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subtítulo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtítulo
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Ex: Ideal para manutenção semanal"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Preço e Tempo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempo (minutos) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="time"
                min="1"
                value={formData.time}
                onChange={handleChange}
                placeholder="30"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o serviço..."
              rows={3}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagem do Serviço
            </label>
            <div className="mt-2 space-y-3">
              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed
                           border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
              >
                <Upload size={20} />
                <span>
                  {imagePreview ? "Alterar imagem" : "Carregar imagem"}
                </span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Informações (Itens inclusos) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Itens Inclusos <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 space-y-3">
              {/* Lista de informações */}
              {informations.length > 0 && (
                <ul className="space-y-2">
                  {informations.map((info, index) => (
                    <li
                      key={index}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-900 flex-1">
                        {info}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeInformation(index)}
                        className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Input para nova informação */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newInformation}
                  onChange={(e) => setNewInformation(e.target.value)}
                  placeholder="Ex: Pré-lavagem com água pressurizada"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addInformation();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addInformation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting
                ? "Salvando..."
                : service
                ? "Atualizar"
                : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
