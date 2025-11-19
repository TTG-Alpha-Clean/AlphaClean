"use client";

import React from "react";
import Image from "next/image";
import axios from "axios";
import Button from "../ui/button";
import { Clock } from "lucide-react";

/* ==========================
 * Tipos
 * ========================== */
export type Information = {
  id: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Service = {
  id: number;
  type: string;
  title: string;
  subtitle?: string;
  price: number;
  time: number;
  description?: string;
  image_url?: string; // <- vem do backend em snake_case
  createdAt?: string;
  updatedAt?: string;
  informations?: Information[];
};

/* ==========================
 * Helpers
 * ========================== */
function formatPriceBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatMinutes(mins: number) {
  if (!Number.isFinite(mins)) return "—";
  if (mins < 60) return `${mins} minutos`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/* ==========================
 * Ícones de lava-jato (usa var(--accent))
 * Rotaciona entre 3 ícones baseado no ID do serviço
 * ========================== */
const TypeIcon: React.FC<{ serviceId?: number; className?: string }> = ({
  serviceId,
  className = "h-5 w-5 text-[var(--accent)]",
}) => {
  // Usa o ID do serviço para escolher o ícone (0, 1 ou 2)
  const iconIndex = serviceId ? serviceId % 3 : 0;

  // Ícone 1: Spray de água
  if (iconIndex === 0) {
    return (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
        <circle cx="7" cy="10" r="1" fill="currentColor" />
        <circle cx="9" cy="12" r="1" fill="currentColor" />
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="17" cy="14" r="1" fill="currentColor" />
        <circle cx="15" cy="16" r="1" fill="currentColor" />
        <circle cx="19" cy="16" r="1" fill="currentColor" />
      </svg>
    );
  }

  // Ícone 2: Carro sendo lavado
  if (iconIndex === 1) {
    return (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 17h2l.5-2.5h13l.5 2.5h2"
        />
        <ellipse cx="7" cy="17" rx="1.5" ry="1.5" fill="currentColor" />
        <ellipse cx="17" cy="17" rx="1.5" ry="1.5" fill="currentColor" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.5 14.5L7 10h10l1.5 4.5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 10V8.5C7 7.672 7.672 7 8.5 7h7c.828 0 1.5.672 1.5 1.5V10"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5L10 7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 4.5L14 7" />
      </svg>
    );
  }

  // Ícone 3: Esponja com bolhas
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <rect
        x="6"
        y="9"
        width="12"
        height="10"
        rx="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="13" r="1" fill="currentColor" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
      <circle cx="15" cy="13" r="1" fill="currentColor" />
      <circle cx="4" cy="6" r="1.5" fill="none" />
      <circle cx="8" cy="5" r="1" fill="none" />
      <circle cx="16" cy="5" r="1.5" fill="none" />
      <circle cx="20" cy="7" r="1" fill="none" />
    </svg>
  );
};

/* ==========================
 * Estados: Loading & Error
 * ========================== */
export const LoadingState: React.FC<{ variant: "compact" | "detailed" }> = ({
  variant,
}) => {
  const gridCols =
    variant === "compact"
      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2";
  return (
    <div className={`grid gap-6 ${gridCols}`}>
      {Array.from({ length: variant === "compact" ? 3 : 2 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-[16px] border p-5 shadow-sm"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div
            className="mb-4 h-5 w-24 rounded"
            style={{ background: "var(--muted)" }}
          />
          {variant === "detailed" && (
            <div
              className="mb-4 h-40 w-full rounded-lg"
              style={{ background: "var(--muted)" }}
            />
          )}
          <div
            className="mb-2 h-6 w-2/3 rounded"
            style={{ background: "var(--muted)" }}
          />
          <div
            className="mb-6 h-4 w-1/2 rounded"
            style={{ background: "var(--muted)" }}
          />
          <div
            className="h-10 w-full rounded-[16px]"
            style={{ background: "var(--muted)" }}
          />
        </div>
      ))}
    </div>
  );
};

export const ErrorState: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({ message = "Não foi possível carregar os serviços.", onRetry }) => (
  <div
    className="rounded-[16px] border p-4 text-red-600"
    style={{ background: "#fef2f2", borderColor: "#fecaca" }}
  >
    <p className="text-sm font-medium">{message}</p>
    {onRetry && (
      <div className="mt-3">
        <Button
          onClick={onRetry}
          variant="primary"
          className="w-auto px-3 py-1.5 text-sm"
        >
          Tentar novamente
        </Button>
      </div>
    )}
  </div>
);

/* ==========================
 * UI pequenos (Badge / List items)
 * ========================== */
const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium"
    style={{
      color: "var(--accent)",
      borderColor: "var(--accent)",
      background: "color-mix(in srgb, var(--accent) 12%, transparent)",
    }}
  >
    {children}
  </span>
);

/* ==========================
 * Cards
 * ========================== */

// Compact: 3 por linha no desktop
const ServiceCardCompact: React.FC<{ service: Service }> = ({ service }) => {
  const { id, title, subtitle, price, time, informations } = service;
  const visible = Array.isArray(informations) ? informations.slice(0, 3) : [];

  return (
    <article
      className="group flex flex-col justify-between rounded-[16px] border p-6 shadow-sm transition hover:shadow-md min-h-[500px] w-full max-w-[400px]"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
        color: "var(--foreground)",
      }}
      aria-label={`Serviço: ${title}`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        {/* Ícone dentro de círculo */}
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full transition-colors group-hover:bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] mb-2"
          style={{
            background: "color-mix(in srgb, var(--accent) 12%, transparent)",
            border:
              "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
          }}
        >
          <TypeIcon
            serviceId={id}
            className="h-6 w-6 text-[var(--accent)] transition-transform duration-200 group-hover:scale-110"
          />
        </div>

        {/* Título */}
        <h3 className="text-lg font-semibold text-[var(--primary)]">
          {title || "Serviço"}
        </h3>

        {/* Tempo + Preço */}
        <div className="flex items-center gap-3 mb-2">
          {Number.isFinite(time) && (
            <span className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
              <Clock className="h-4 w-4" />
              {formatMinutes(time)}
            </span>
          )}
          <span className="text-xl font-extrabold text-[var(--accent)]">
            {formatPriceBRL(price ?? 0)}
          </span>
        </div>

        {/* Subtítulo opcional */}
        {subtitle && (
          <p className="text-sm font-light text-[var(--primary)] mb-3">
            {subtitle}
          </p>
        )}

        {/* Lista de benefícios */}
        {visible.length > 0 && (
          <ul className="w-full space-y-2 text-left mt-2">
            {visible.map((info, i) => (
              <li
                key={info.id ?? `${title}-info-${i}`}
                className="flex items-start gap-2 text-sm text-[var(--primary)]/85"
              >
                <span className="mt-1.5 inline-block h-2 w-2 flex-none rounded-full bg-[var(--accent)]" />
                <span className="text-left">{info.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botão centralizado */}
      <Button
        className="mt-6 w-full rounded-full py-3 font-semibold
                   !bg-transparent !text-[var(--accent)] border border-[var(--accent)]
                   transition-colors duration-200 hover:bg-[var(--accent)] hover:text-white
                   focus-visible:ring-2 focus-visible:ring-[var(--accent)]
                   active:scale-[.99]"
      >
        Agendar Serviço
      </Button>
    </article>
  );
};

// Detailed: 2 por linha no desktop (imagem acompanha o card)
const ServiceCardDetailed: React.FC<{
  service: Service;
  highlightLabel?: string;
}> = ({ service, highlightLabel }) => {
  const {
    id,
    type,
    title,
    subtitle,
    price,
    time,
    description,
    image_url,
    informations,
  } = service;

  // suporta preço riscado vindo junto no objeto
  const originalPrice = (service as Service & { originalPrice?: number })
    ?.originalPrice;

  const MAX_VISIBLE_ITEMS = 4;
  const visible = Array.isArray(informations)
    ? informations.slice(0, MAX_VISIBLE_ITEMS)
    : [];
  const hiddenCount = Array.isArray(informations)
    ? Math.max(informations.length - MAX_VISIBLE_ITEMS, 0)
    : 0;

  return (
    <article
      className="relative grid grid-cols-1 gap-0 rounded-2xl border shadow-lg transition hover:shadow-xl overflow-hidden
                 sm:grid-cols-[280px_1fr] 2xl:grid-cols-[240px_1fr] 2xl:max-w-[560px]"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
        color: "var(--foreground)",
      }}
      aria-label={`Serviço: ${title || "Serviço"}`}
    >
      {/* Selo de destaque opcional */}
      {highlightLabel && (
        <div
          className="absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {highlightLabel}
        </div>
      )}

      {/* Coluna da imagem - comprida vertical */}
      <div className="relative h-[220px] sm:h-[280px] sm:max-h-[280px]">
        {image_url ? (
          <Image
            src={image_url}
            alt={
              title ? `Imagem ilustrativa para ${title}` : "Imagem do serviço"
            }
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 280px"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: "var(--muted)",
              color: "var(--muted-foreground)",
            }}
          >
            <svg
              className="h-10 w-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 19.5h18a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 21 4.5H3A1.5 1.5 0 0 0 1.5 6v12A1.5 1.5 0 0 0 3 19.5Z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Coluna do conteúdo */}
      <div className="flex flex-col justify-between p-6">
        <div className="flex flex-col gap-4">
          {/* Ícone + badge do tipo */}
          <div className="flex items-center gap-2">
            <TypeIcon serviceId={id} className="h-8 w-8 text-[var(--accent)]" />
            {type && <Badge>{type}</Badge>}
          </div>

          {/* Título */}
          <h3 className="text-2xl font-bold leading-tight text-[#0A2540]">
            {title || "Serviço"}
          </h3>

          {/* Subtítulo verde */}
          {subtitle && (
            <p className="text-sm font-medium text-[var(--accent)]">
              {subtitle}
            </p>
          )}

          {/* Preço + tempo */}
          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-3xl font-extrabold text-[#0A2540]">
              {formatPriceBRL(price ?? 0)}
            </p>
            {Number.isFinite(originalPrice as number) &&
              originalPrice! > (price ?? 0) && (
                <span className="text-base line-through opacity-50 text-[#0A2540]">
                  {formatPriceBRL(originalPrice!)}
                </span>
              )}
          </div>

          {Number.isFinite(time) && (
            <span className="inline-flex items-center gap-1.5 text-sm text-[#0A2540]">
              <Clock className="h-4 w-4 text-blue-600" />
              {formatMinutes(time)}
            </span>
          )}

          {/* Descrição */}
          {description && (
            <p className="text-sm leading-relaxed text-[#0A2540]/80">
              {description}
            </p>
          )}

          {/* Lista de itens com checks verdes */}
          {visible.length > 0 && (
            <ul className="space-y-2.5">
              {visible.map((info, i) => (
                <li
                  key={info.id ?? `${title}-info-${i}`}
                  className="flex items-start gap-2.5 text-sm text-[#0A2540]"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 flex-none text-[var(--accent)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{info.description}</span>
                </li>
              ))}
            </ul>
          )}

          {hiddenCount > 0 && (
            <span className="inline-block text-sm font-semibold text-[var(--accent)]">
              + {hiddenCount} itens adicionais
            </span>
          )}
        </div>

        {/* Botão Agendar Serviço */}
        <div className="mt-6">
          <Button
            variant="primary"
            className="w-full rounded-xl py-3.5 font-semibold text-base bg-[#0A2540] hover:bg-[#0A2540]/90 text-white"
          >
            Agendar Serviço
          </Button>
        </div>
      </div>
    </article>
  );
};

/* ==========================
 * Grid
 * ========================== */
/* ==========================
 * Grid
 * ========================== */
const ServiceGrid: React.FC<{
  services: Service[];
  variant: "compact" | "detailed";
}> = ({ services, variant }) => {
  const gridTemplate =
    variant === "compact"
      ? // compacto → até 3 colunas, cada card entre 360–460px
        "[grid-template-columns:repeat(auto-fit,minmax(360px,1fr))] \
         sm:[grid-template-columns:repeat(auto-fit,minmax(380px,1fr))] \
         lg:[grid-template-columns:repeat(3,minmax(420px,1fr))]"
      : // detalhado → 2 colunas em telas grandes, 1 em mobile
        "grid-cols-1 lg:grid-cols-2";

  const Card = variant === "compact" ? ServiceCardCompact : ServiceCardDetailed;

  return (
    <div className={`grid gap-6 ${gridTemplate}`}>
      {services.map((svc, idx) => (
        <Card key={svc.id ?? `${svc.title}-${idx}`} service={svc} />
      ))}
    </div>
  );
};

/* ==========================
 * ServicesSection
 * ========================== */
export type ServicesSectionProps = {
  variant?: "compact" | "detailed";
  className?: string;
  endpoint?: string;
  limit?: number;
};

const ServicesSection: React.FC<ServicesSectionProps> = ({
  variant = "compact",
  className = "",
  endpoint = "/api/services",
  limit,
}) => {
  const [services, setServices] = React.useState<Service[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      interface ApiResponse {
        data?: unknown[];
      }
      const res = await axios.get<ApiResponse>(endpoint, { timeout: 15000 });
      // Backend retorna { data: services }
      const rawData = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      // Mapear dados do backend para o formato esperado
      let data: Service[] = (rawData as Record<string, unknown>[]).map((item) => ({
        id: Number(item.service_id || item.id || 0),
        type: String(item.type || ""),
        title: String(item.title || ""),
        subtitle: String(item.subtitle || ""),
        price: Number(item.price || item.valor || 0),
        time: Number(item.time || item.time_minutes || 0),
        description: String(item.description || item.service_description || ""),
        image_url: String(item.image_url || ""),
        informations: Array.isArray(item.informations) ? item.informations as Information[] : [],
      }));

      // Se tiver limit, pegar os últimos N serviços (ordenados por ID decrescente)
      if (limit && limit > 0) {
        data = data
          .sort((a, b) => (b.id || 0) - (a.id || 0)) // Ordenar do mais recente para o mais antigo
          .slice(0, limit); // Pegar apenas os N primeiros
      }

      setServices(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao carregar serviços");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, limit]);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <section className={`w-full ${className}`} aria-live="polite">
      {loading && <LoadingState variant={variant} />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && services && services.length === 0 && (
        <p
          className="rounded-[16px] border p-4 text-sm"
          style={{
            background: "var(--muted)",
            borderColor: "var(--card-border)",
            color: "var(--muted-foreground)",
          }}
        >
          Nenhum serviço encontrado.
        </p>
      )}
      {!loading && !error && services && services.length > 0 && (
        <ServiceGrid services={services} variant={variant} />
      )}
    </section>
  );
};

export default ServicesSection;
