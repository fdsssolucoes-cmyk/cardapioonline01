import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatBRL } from '../utils/formatters';

export const MobileCartBar: React.FC = () => {
  const { cart, cartTotalCount, cartSubtotal, setIsCartOpen, isCartOpen, isCheckoutOpen, isAdminOpen } = useStore();

  if (cartTotalCount === 0 || isCartOpen || isCheckoutOpen || isAdminOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:hidden bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent backdrop-blur-md">
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-full h-12 px-4 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:opacity-95 text-white font-bold text-sm flex items-center justify-between shadow-xl shadow-red-950/40 active:scale-[0.98] transition-all cursor-pointer"
        aria-label="Abrir pedido com total"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-black/30 flex items-center justify-center text-xs tabular-nums">
            {cartTotalCount}
          </div>
          <span>Ver Pedido</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-extrabold text-amber-200 tabular-nums font-display">
            {formatBRL(cartSubtotal)}
          </span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};
