// components/navigation/auth-layout.tsx
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] relative overflow-hidden bg-gradient-to-br from-[#0a1420] via-[#152640] to-[#022744]">
      {/* Elementos decorativos automotivos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Hexágonos flutuantes */}
        <div className="absolute top-20 left-10 w-16 h-16 border-2 border-[#9BD60C]/20 transform rotate-12 animate-pulse">
          <div
            className="w-full h-full border border-[#9BD60C]/30"
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            }}
          />
        </div>

        {/* Círculos concêntricos (rodas) */}
        <div className="absolute top-40 right-20 w-24 h-24 opacity-10">
          <div
            className="w-full h-full rounded-full border-4 border-[#9BD60C] animate-spin"
            style={{ animationDuration: "20s" }}
          />
          <div className="absolute inset-2 rounded-full border-2 border-[#9BD60C]/60" />
          <div className="absolute inset-4 rounded-full border border-[#9BD60C]/40" />
        </div>

        {/* Forma de para-brisa */}
        <div className="absolute bottom-32 left-1/4 w-32 h-20 opacity-5 bg-gradient-to-t from-[#9BD60C] to-transparent transform -skew-x-12" />

        {/* Linhas de velocidade */}
        <div className="absolute top-1/3 right-0 w-40 h-1 bg-gradient-to-l from-[#9BD60C]/30 to-transparent" />
        <div className="absolute top-1/3 right-0 w-32 h-1 bg-gradient-to-l from-[#9BD60C]/20 to-transparent mt-4" />
        <div className="absolute top-1/3 right-0 w-24 h-1 bg-gradient-to-l from-[#9BD60C]/10 to-transparent mt-8" />

        {/* Grade automotiva */}
        <div className="absolute bottom-20 right-10 grid grid-cols-6 gap-1 opacity-5">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-3 h-1 bg-[#9BD60C] rounded-full" />
          ))}
        </div>

        {/* Forma de farol */}
        <div className="absolute top-1/4 left-1/3 w-20 h-10 bg-gradient-to-r from-[#9BD60C]/20 to-transparent rounded-full opacity-30 blur-sm" />

        {/* Partículas fixas decorativas */}
        <div className="absolute top-16 left-1/4 w-1 h-1 bg-[#9BD60C]/40 rounded-full animate-pulse" />
        <div
          className="absolute top-32 right-1/3 w-1 h-1 bg-[#9BD60C]/30 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-1/5 w-1 h-1 bg-[#9BD60C]/35 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-1 h-1 bg-[#9BD60C]/25 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(#9BD60C 1px, transparent 1px),
            linear-gradient(90deg, #9BD60C 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Container principal */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header só com botão voltar animado */}
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 sm:gap-3 text-white/80 hover:text-white transition-all duration-300 group hover:scale-105"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#9BD60C]/20 group-hover:to-[#9BD60C]/10 group-hover:border-[#9BD60C]/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#9BD60C]/20">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-base sm:text-lg font-bold group-hover:text-[#9BD60C] transition-colors duration-300 group-hover:scale-110 transform leading-none">←</span>
              </div>
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
            </div>
            <span className="font-semibold text-sm sm:text-base hidden sm:block group-hover:text-[#9BD60C] transition-colors duration-300">Voltar ao site</span>
            <span className="font-semibold text-sm sm:hidden group-hover:text-[#9BD60C] transition-colors duration-300">Voltar</span>
          </Link>
        </div>

        {/* Forms bem próximos do topo */}
        <div className="px-4">
          <div className="w-full max-w-lg mx-auto">

            {/* Card principal com melhor proporção */}
            <div className="relative">
              {/* Glow effect mais sutil */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#9BD60C]/15 to-[#c4ff57]/15 rounded-3xl blur-xl opacity-60" />

              {/* Card principal */}
              <div className="relative rounded-3xl bg-white/98 backdrop-blur-xl shadow-2xl border border-white/30 overflow-hidden">
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Footer minimalista */}
        <div className="mt-auto pb-6 flex justify-center">
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <div className="w-1 h-1 bg-[#9BD60C]/50 rounded-full animate-pulse" />
            <span>Sistema seguro</span>
            <div
              className="w-1 h-1 bg-[#9BD60C]/50 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
