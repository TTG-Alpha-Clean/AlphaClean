import { Clock, Mail, Phone, Pin, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="max-w-6xl mx-auto mb-8">
      <div>
        <h3 className="text-xl font-bold text-[var(--primary)] mb-8">
          Nossos Dados
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Endereço */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--primary)]/90 rounded-full flex items-center justify-center">
                <Pin size={20} color="#9bd60c" />
              </div>
              <h4 className="font-semibold text-[var(--primary)]">Endereço</h4>
            </div>
            <div className="text-[var(--muted-foreground)] space-y-1">
              <p>Estrada do coco, Posto Br, Alphaville Litoral Norte 2</p>
              <p>BA-099 - Abrantes, Camaçari</p>
              <p>CEP: 42840-000</p>
            </div>
          </div>

          {/* Telefone */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--primary)]/90 rounded-full flex items-center justify-center">
                <Phone size={20} color="#9bd60c" />
              </div>
              <h4 className="font-semibold text-[var(--primary)]">Telefone</h4>
            </div>
            <div className="text-[var(--muted-foreground)] space-y-1">
              <p className="text-[var(--accent)] font-medium">
                (71) 98358-4393
              </p>
              <p className="text-sm">WhatsApp disponível</p>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--primary)]/90 rounded-full flex items-center justify-center">
                <Mail size={20} color="#9bd60c" />
              </div>
              <h4 className="font-semibold text-[var(--primary)]">Email</h4>
            </div>
            <div className="text-[var(--muted-foreground)] space-y-1 ">
              <p className="font-medium">alphaclean335@gmail.com</p>
            </div>
          </div>

          {/* Horários */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--primary)]/90 rounded-full flex items-center justify-center">
                <Clock size={20} color="#9bd60c" />
              </div>
              <h4 className="font-semibold text-[var(--primary)]">Horários</h4>
            </div>
            <div className="text-[var(--muted-foreground)] space-y-1">
              <p>Segunda a Sábado: 08:00 - 17:00</p>
              <p>Domingo: 08:00 - 12:00</p>
            </div>
          </div>

          {/* Localização - Card que ocupa 2 colunas */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--primary)]/90 rounded-full flex items-center justify-center">
                <MapPin size={20} color="#9bd60c" />
              </div>
              <h4 className="font-semibold text-[var(--primary)]">
                Nossa Localização
              </h4>
            </div>
            <div className="w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.21320032589!2d-38.2744404236078!3d-12.829495324642114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7163f0009da5b41%3A0xf63cc231d7571166!2sAlpha%20Clean%20%7C%20Est%C3%A9tica%20automotiva!5e0!3m2!1spt-BR!2sbr!4v1760460347305!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Alpha Clean"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-[var(--muted-foreground)] text-sm mb-3">
                Encontre-nos facilmente em Abrantes
              </p>

              <a
                href="https://www.google.com/maps/place/Alpha+Clean+%7C+Estética+automotiva/@-12.8294953,-38.2744404,17z/data=!3m1!4b1!4m6!3m5!1s0x7163f0009da5b41:0xf63cc231d7571166!8m2!3d-12.8295006!4d-38.2695695!16s%2Fg%2F11w1x10frr?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--primary)] rounded-lg font-medium hover:bg-[var(--accent)]/90 transition-colors"
              >
                <MapPin size={16} />
                Abrir no Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
