import React, { useState } from 'react';
import { Plus, Minus, Flame, Clock, Check } from 'lucide-react';
import { Product } from '../types';
import { formatBRL } from '../utils/formatters';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.min(prev + 1, 99));
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.available) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
    setQuantity(1);
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className={`group relative flex flex-col justify-between bg-neutral-900/90 rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
        product.available
          ? 'border-neutral-800 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-950/20 hover:-translate-y-0.5'
          : 'border-neutral-800/60 opacity-60'
      }`}
    >
      <div>
        {/* Product Image Area */}
        <div className="relative aspect-[4/3] w-full bg-neutral-950 overflow-hidden">
          {product.imageUrl && !imgError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-neutral-600">
              <span className="text-4xl mb-1">🍢</span>
              <span className="text-xs text-neutral-400 font-medium text-center">Espetinho Artesanal</span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
            {product.isPopular && product.available && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-600 text-white shadow-sm">
                <Flame className="w-3 h-3" />
                Mais Pedido
              </span>
            )}
            {!product.available && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
                Esgotado
              </span>
            )}
          </div>

          {product.prepTime && (
            <div className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[11px] text-neutral-300 tabular-nums">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{product.prepTime}</span>
            </div>
          )}
        </div>

        {/* Product Details Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-white text-base group-hover:text-amber-400 transition-colors line-clamp-1 font-display">
              {product.name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>
      </div>

      {/* Bottom Bar: Price & Quantity / Add Controls */}
      <div className="p-4 sm:p-5 pt-0 mt-auto">
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          {/* Price */}
          <div>
            <span className="text-[10px] uppercase font-semibold text-neutral-400 block tracking-wider">
              Preço
            </span>
            <span className="text-lg sm:text-xl font-bold text-amber-400 tabular-nums font-display">
              {formatBRL(product.price)}
            </span>
          </div>

          {/* Actions */}
          {product.available ? (
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {/* Stepper */}
              <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-7 h-7 flex items-center justify-center text-neutral-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-semibold text-white tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-7 h-7 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={handleAdd}
                className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 hover:bg-red-500 text-white active:scale-95 shadow-sm shadow-red-950'
                }`}
                aria-label={`Adicionar ${quantity} ${product.name} ao pedido`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Adicionado</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Pedir</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <span className="text-xs text-neutral-400 italic">Indisponível</span>
          )}
        </div>
      </div>
    </div>
  );
};
