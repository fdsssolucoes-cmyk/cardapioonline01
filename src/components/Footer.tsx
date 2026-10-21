import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Clock, MessageSquare, Settings, Heart } from 'lucide-react';
import { formatPhoneDisplay } from '../utils/formatters';

export const Footer: React.FC = () => {
  const { establishment, setIsAdminOpen } = useStore();

  const whatsappDirectUrl = `https://wa.me/${establishment.whatsapp}?text=${encodeURIComponent(
    `Olá! Gostaria de falar com o ${establishment.name}.`
  )}`;

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-xs py-10 pb-24 sm:pb-12 mt-12">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Col 1: Store branding */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-base font-display">
              <span className="text-xl">🍢</span>
              <span>{establishment.name}</span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              {establishment.tagline}. Espetinhos artesanais na brasa, porções crocantes e bebidas geladas entregues no conforto da sua casa ou prontos para retirada.
            </p>
          </div>

          {/* Col 2: Contact & Address */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Localização & Horário
            </h4>
            <div className="space-y-1.5 text-neutral-400">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>{establishment.address}, {establishment.neighborhood}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{establishment.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Atendimento
            </h4>
            <div className="space-y-2">
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-emerald-400 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>{formatPhoneDisplay(establishment.whatsapp)}</span>
              </a>

              <div>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Painel de Administração</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} {establishment.name} · Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-1">
            <span>Desenvolvido para alta conversão no WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
