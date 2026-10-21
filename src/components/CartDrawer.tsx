import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Bike, PackageCheck, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatBRL } from '../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotalCount,
    establishment,
    setIsCheckoutOpen,
  } = useStore();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const isBelowMin = cartSubtotal < establishment.minOrderValue && cart.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white font-display">
                Seu Pedido ({cartTotalCount})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-neutral-400 hover:text-red-400 transition-colors px-2 py-1 rounded cursor-pointer"
                  title="Esvaziar carrinho"
                >
                  Limpar
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Fechar carrinho"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-neutral-800/60 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <div className="w-16 h-16 rounded-2xl bg-neutral-800/80 flex items-center justify-center text-3xl mb-3">
                  🍢
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  Seu carrinho está vazio
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs mb-4">
                  Adicione deliciosos espetinhos e acompanhamentos para montar seu pedido.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  Ver Cardápio
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemTotal = item.product.price * item.quantity;

                return (
                  <div key={item.product.id} className="pt-3 first:pt-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-xs text-neutral-400 mt-0.5">
                          {formatBRL(item.product.price)} cada
                        </div>
                        {item.notes && (
                          <div className="text-[11px] text-amber-300/80 bg-neutral-950/60 px-2 py-0.5 rounded border border-neutral-800 mt-1 inline-block">
                            Obs: {item.notes}
                          </div>
                        )}
                      </div>

                      {/* Item Total */}
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-amber-400 tabular-nums">
                          {formatBRL(itemTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Stepper & Delete */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-neutral-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        title="Remover item"
                        aria-label="Remover item do pedido"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Breakdown & CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-950 space-y-3">
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-200 tabular-nums">
                    {formatBRL(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Opções de entrega:</span>
                  <span className="text-amber-400">Delivery ou Retirada</span>
                </div>
                {establishment.freeDeliveryThreshold && cartSubtotal >= establishment.freeDeliveryThreshold && (
                  <div className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2 py-1 rounded">
                    🎉 Parabéns! Seu pedido atingiu o valor de Frete Grátis!
                  </div>
                )}
              </div>

              {isBelowMin && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    Pedido mínimo: {formatBRL(establishment.minOrderValue)}. Adicione mais {formatBRL(establishment.minOrderValue - cartSubtotal)}.
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleProceedToCheckout}
                disabled={isBelowMin}
                className={`w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isBelowMin
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-950/40 active:scale-[0.98]'
                }`}
              >
                <span>Avançar para o WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
