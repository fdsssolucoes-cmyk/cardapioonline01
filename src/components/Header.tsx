import React from 'react';
import { ShoppingBag, Settings, Phone, Clock, MapPin, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPhoneDisplay } from '../utils/formatters';

export const Header: React.FC = () => {
  const { establishment, cartTotalCount, setIsCartOpen, setIsAdminOpen } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-600 via-amber-600 to-amber-500 p-0.5 shadow-md shadow-red-950/40 shrink-0">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center text-amber-400 font-bold text-lg sm:text-xl font-display">
              🍢
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-white truncate font-display">
                {establishment.name}
              </h1>
              {establishment.isOpen ? (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  Aberto agora
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-red-950/80 text-red-400 border border-red-800/60">
                  Fechado
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 truncate hidden xs:block">
              {establishment.tagline}
            </p>
          </div>
        </div>

        {/* Action Zone: Admin toggle & Cart trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="Abrir Painel do Lojista (Configurações do Estabelecimento)"
            aria-label="Configurações do estabelecimento"
          >
            <Settings className="w-4 h-4 text-amber-500" />
            <span className="hidden md:inline">Painel do Lojista</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md shadow-amber-500/10 active:scale-[0.98] transition-all cursor-pointer"
            aria-label={`Ver carrinho de compras com ${cartTotalCount} itens`}
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-950" />
            <span className="hidden sm:inline">Ver Pedido</span>
            {cartTotalCount > 0 ? (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-600 rounded-full tabular-nums">
                {cartTotalCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
};
