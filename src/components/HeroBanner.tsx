import React from 'react';
import { Clock, MapPin, Phone, Bike, PackageCheck, Search, MessageSquare, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatBRL, formatPhoneDisplay } from '../utils/formatters';

export const HeroBanner: React.FC = () => {
  const { establishment, searchQuery, setSearchQuery } = useStore();

  const whatsappDirectUrl = `https://wa.me/${establishment.whatsapp}?text=${encodeURIComponent(
    `Olá! Gostaria de tirar uma dúvida sobre o cardápio do ${establishment.name}.`
  )}`;

  return (
    <div className="relative border-b border-neutral-800 bg-neutral-900 overflow-hidden">
      {/* Background with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={establishment.coverUrl || '/src/assets/images/hero_espetinho_bbq_1792499628124.jpg'}
          alt="Brasa de espetinhos"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Notice for Demo */}
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Cardápio Digital de Demonstração pronto para personalizar e publicar.</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-display">
              Espetos no Carvão, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-red-500">
                Sabor e Suculência na Brasa
              </span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
              Escolha seus espetinhos artesanais, combos e acompanhamentos favoritos. Monte seu pedido online e envie direto para o nosso WhatsApp!
            </p>

            {/* Quick Badges Strip */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-neutral-300 pt-1">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>{establishment.address}, {establishment.neighborhood}</span>
              </div>
              <span className="text-neutral-600 hidden sm:inline" aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{establishment.openingHours}</span>
              </div>
            </div>

            {/* Delivery / Pickup features */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Bike className="w-4 h-4 text-amber-400" />
                  <span>Entrega Delivery</span>
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  {establishment.deliveryTime}
                </div>
                <div className="text-[11px] text-amber-400/90 font-medium">
                  {establishment.deliveryFee === 0
                    ? 'Frete Grátis'
                    : `Taxa: ${formatBRL(establishment.deliveryFee)}`}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <PackageCheck className="w-4 h-4 text-emerald-400" />
                  <span>Retirada no Balcão</span>
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  {establishment.pickupTime}
                </div>
                <div className="text-[11px] text-emerald-400/90 font-medium">
                  Sem taxa adicional
                </div>
              </div>

              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800/90 border border-neutral-800 hover:border-emerald-700/50 transition-colors backdrop-blur-sm flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>Fale Conosco</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 group-hover:underline">Abrir</span>
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  {formatPhoneDisplay(establishment.whatsapp)}
                </div>
                <div className="text-[11px] text-neutral-400">
                  Atendimento WhatsApp
                </div>
              </a>
            </div>
          </div>

          {/* Search box */}
          <div className="lg:col-span-4 self-end">
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 backdrop-blur-md shadow-xl">
              <label htmlFor="search-input" className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Buscar no cardápio
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Ex: picanha, combo, queijo coalho, cerveja..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm text-white placeholder-neutral-500 outline-none transition-all"
                />
              </div>
              {searchQuery && (
                <div className="flex items-center justify-between mt-2 text-xs text-neutral-400">
                  <span>Filtrando por: &quot;{searchQuery}&quot;</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    Limpar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
