import React, { useState } from 'react';
import { X, Plus, Minus, Clock, Flame, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { formatBRL } from '../utils/formatters';
import { useStore } from '../context/StoreContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity, notes.trim());
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 600);
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Fechar detalhes do produto"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto no-scrollbar">
          {/* Large Image Header */}
          <div className="relative aspect-[16/10] w-full bg-neutral-950 overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-600">
                <span className="text-5xl mb-2">🍢</span>
                <span className="text-sm text-neutral-400">Espetinho Artesanal</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

            <div className="absolute bottom-3 left-4 flex gap-2">
              {product.isPopular && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-red-600 text-white shadow-sm">
                  <Flame className="w-3.5 h-3.5" />
                  Mais Pedido
                </span>
              )}
              {product.prepTime && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black/75 text-xs text-neutral-200 tabular-nums backdrop-blur-sm">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {product.prepTime}
                </span>
              )}
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-5">
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-2xl font-bold text-white font-display">
                  {product.name}
                </h2>
                <span className="text-xl font-bold text-amber-400 tabular-nums shrink-0 font-display">
                  {formatBRL(product.price)}
                </span>
              </div>
              <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Notes input */}
            <div>
              <label htmlFor="item-notes" className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Alguma preferência ou observação?
              </label>
              <textarea
                id="item-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: ponto da carne, pouco sal, enviar farofa separada, sem cebola..."
                className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Bottom Pinned Action Bar */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-4 shrink-0">
          {/* Stepper */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-neutral-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-white tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              className="w-8 h-8 flex items-center justify-center text-neutral-300 hover:text-white cursor-pointer"
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.available}
            className={`flex-1 h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              !product.available
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-950/40 active:scale-[0.98]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Adicionado ao Pedido!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar · {formatBRL(totalPrice)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
