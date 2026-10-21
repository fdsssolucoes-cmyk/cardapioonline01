import React, { useState } from 'react';
import { X, Bike, PackageCheck, MessageSquare, AlertCircle, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderCustomerData, OrderType, PaymentMethod } from '../types';
import { buildWhatsAppMessage, createWhatsAppUrl, formatBRL } from '../utils/formatters';

export const CheckoutModal: React.FC = () => {
  const { cart, isCheckoutOpen, setIsCheckoutOpen, establishment, cartSubtotal, clearCart } = useStore();

  const [customerData, setCustomerData] = useState<OrderCustomerData>({
    customerName: '',
    customerPhone: '',
    orderType: 'entrega',
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
    reference: '',
    paymentMethod: 'pix',
    cashChangeFor: '',
    orderNotes: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  if (!isCheckoutOpen || cart.length === 0) return null;

  const isDelivery = customerData.orderType === 'entrega';

  // Delivery fee calculation
  const deliveryFee = !isDelivery
    ? 0
    : establishment.freeDeliveryThreshold && cartSubtotal >= establishment.freeDeliveryThreshold
    ? 0
    : establishment.deliveryFee;

  const total = cartSubtotal + deliveryFee;

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!customerData.customerName.trim()) {
      errors.customerName = 'Por favor, informe seu nome.';
    }

    if (isDelivery) {
      if (!customerData.street.trim()) {
        errors.street = 'Informe o nome da rua / avenida.';
      }
      if (!customerData.number.trim()) {
        errors.number = 'Informe o número da residência.';
      }
      if (!customerData.neighborhood.trim()) {
        errors.neighborhood = 'Informe o bairro.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const whatsappMessage = buildWhatsAppMessage(
    establishment,
    customerData,
    cart,
    cartSubtotal,
    deliveryFee,
    total
  );

  const whatsappUrl = createWhatsAppUrl(establishment.whatsapp, whatsappMessage);

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setShowPreview(true);
  };

  const handleFinishAndOpen = () => {
    setHasSent(true);
    // Open WhatsApp link in new tab safely
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleResetAfterOrder = () => {
    clearCart();
    setIsCheckoutOpen(false);
    setHasSent(false);
    setShowPreview(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍢</span>
            <h2 className="text-lg font-bold text-white font-display">
              {hasSent ? 'Pedido Enviado!' : showPreview ? 'Revisar & Enviar WhatsApp' : 'Finalizar Pedido'}
            </h2>
          </div>
          <button
            onClick={() => {
              if (hasSent) {
                handleResetAfterOrder();
              } else {
                setIsCheckoutOpen(false);
              }
            }}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar finalização de pedido"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 no-scrollbar">
          {hasSent ? (
            /* Post-Send Confirmation State */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display">
                  Mensagem gerada para o WhatsApp!
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-sm mx-auto mt-2 leading-relaxed">
                  A conversa foi iniciada com o estabelecimento. Se a janela não tiver aberto automaticamente, clique no botão abaixo.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 text-left space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Atenção: Confirmação Manual</span>
                </div>
                <p>
                  O pedido <strong>NÃO</strong> é confirmado de forma automática. O atendente irá responder no WhatsApp para confirmar o preparo e o tempo estimado.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Reabrir WhatsApp</span>
                </a>

                <button
                  onClick={handleResetAfterOrder}
                  className="w-full py-2.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Concluir e Iniciar Novo Pedido
                </button>
              </div>
            </div>
          ) : showPreview ? (
            /* Review & Preview Message Screen */
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar e editar dados</span>
              </button>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-2">
                <div className="font-semibold text-white flex justify-between">
                  <span>Resumo Financeiro</span>
                  <span className="text-amber-400 tabular-nums font-bold text-sm">{formatBRL(total)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal dos itens ({cart.length})</span>
                  <span>{formatBRL(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Taxa de {isDelivery ? 'Entrega' : 'Retirada'}</span>
                  <span>{deliveryFee === 0 ? 'Grátis' : formatBRL(deliveryFee)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Mensagem que será enviada ao restaurante:
                </label>
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed border-l-2 border-l-emerald-500">
                  {whatsappMessage}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                <p>
                  ⚠️ <strong>Aviso Importante:</strong> Ao clicar no botão abaixo, o aplicativo oficial do WhatsApp será aberto com o pedido já digitado. Você só precisará clicar em <strong>Enviar</strong> na conversa.
                </p>
              </div>

              <button
                type="button"
                onClick={handleFinishAndOpen}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Finalizar Pedido pelo WhatsApp</span>
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleDirectSubmit} className="space-y-4">
              {/* Delivery vs Pickup Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Como deseja receber seu pedido?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomerData((prev) => ({ ...prev, orderType: 'entrega' }))}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      customerData.orderType === 'entrega'
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <Bike className={`w-5 h-5 ${customerData.orderType === 'entrega' ? 'text-amber-400' : ''}`} />
                    <span className="text-xs font-semibold">Entrega (Delivery)</span>
                    <span className="text-[10px] text-neutral-400">
                      {establishment.deliveryFee === 0 ? 'Frete Grátis' : formatBRL(establishment.deliveryFee)}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomerData((prev) => ({ ...prev, orderType: 'retirada' }))}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      customerData.orderType === 'retirada'
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <PackageCheck className={`w-5 h-5 ${customerData.orderType === 'retirada' ? 'text-amber-400' : ''}`} />
                    <span className="text-xs font-semibold">Retirada no Balcão</span>
                    <span className="text-[10px] text-neutral-400">Sem taxa adicional</span>
                  </button>
                </div>
              </div>

              {/* Customer Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="customer-name" className="block text-xs font-medium text-neutral-300 mb-1">
                    Seu Nome *
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    placeholder="Ex: João da Silva"
                    value={customerData.customerName}
                    onChange={(e) => setCustomerData((prev) => ({ ...prev, customerName: e.target.value }))}
                    className={`w-full px-3 py-2 bg-neutral-950 border rounded-xl text-sm text-white placeholder-neutral-500 outline-none transition-all ${
                      validationErrors.customerName ? 'border-red-500' : 'border-neutral-800 focus:border-amber-500'
                    }`}
                  />
                  {validationErrors.customerName && (
                    <span className="text-[11px] text-red-400 mt-1 block">
                      {validationErrors.customerName}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="customer-phone" className="block text-xs font-medium text-neutral-300 mb-1">
                    WhatsApp para contato
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    placeholder="(11) 98765-4321"
                    value={customerData.customerPhone}
                    onChange={(e) => setCustomerData((prev) => ({ ...prev, customerPhone: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl text-sm text-white placeholder-neutral-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Delivery Address fields (if delivery) */}
              {isDelivery && (
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Bike className="w-3.5 h-3.5" />
                    <span>Endereço para Entrega</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label htmlFor="street" className="block text-[11px] text-neutral-400 mb-0.5">
                        Rua / Avenida *
                      </label>
                      <input
                        id="street"
                        type="text"
                        placeholder="Nome da sua rua"
                        value={customerData.street}
                        onChange={(e) => setCustomerData((prev) => ({ ...prev, street: e.target.value }))}
                        className={`w-full px-3 py-1.5 bg-neutral-900 border rounded-lg text-xs text-white placeholder-neutral-500 outline-none ${
                          validationErrors.street ? 'border-red-500' : 'border-neutral-700 focus:border-amber-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="number" className="block text-[11px] text-neutral-400 mb-0.5">
                        Número *
                      </label>
                      <input
                        id="number"
                        type="text"
                        placeholder="Nº"
                        value={customerData.number}
                        onChange={(e) => setCustomerData((prev) => ({ ...prev, number: e.target.value }))}
                        className={`w-full px-3 py-1.5 bg-neutral-900 border rounded-lg text-xs text-white placeholder-neutral-500 outline-none ${
                          validationErrors.number ? 'border-red-500' : 'border-neutral-700 focus:border-amber-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="neighborhood" className="block text-[11px] text-neutral-400 mb-0.5">
                        Bairro *
                      </label>
                      <input
                        id="neighborhood"
                        type="text"
                        placeholder="Bairro"
                        value={customerData.neighborhood}
                        onChange={(e) => setCustomerData((prev) => ({ ...prev, neighborhood: e.target.value }))}
                        className={`w-full px-3 py-1.5 bg-neutral-900 border rounded-lg text-xs text-white placeholder-neutral-500 outline-none ${
                          validationErrors.neighborhood ? 'border-red-500' : 'border-neutral-700 focus:border-amber-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="complement" className="block text-[11px] text-neutral-400 mb-0.5">
                        Complemento (Apto, Bloco)
                      </label>
                      <input
                        id="complement"
                        type="text"
                        placeholder="Opcional"
                        value={customerData.complement}
                        onChange={(e) => setCustomerData((prev) => ({ ...prev, complement: e.target.value }))}
                        className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-lg text-xs text-white placeholder-neutral-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reference" className="block text-[11px] text-neutral-400 mb-0.5">
                      Ponto de Referência
                    </label>
                    <input
                      id="reference"
                      type="text"
                      placeholder="Ex: Em frente à praça, portão preto..."
                      value={customerData.reference}
                      onChange={(e) => setCustomerData((prev) => ({ ...prev, reference: e.target.value }))}
                      className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-lg text-xs text-white placeholder-neutral-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Forma de Pagamento
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'pix', label: 'PIX (Chave rápida)' },
                    { id: 'cartao_credito', label: 'Cartão de Crédito' },
                    { id: 'cartao_debito', label: 'Cartão de Débito' },
                    { id: 'dinheiro', label: 'Dinheiro em Espécie' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setCustomerData((prev) => ({ ...prev, paymentMethod: method.id as PaymentMethod }))}
                      className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        customerData.paymentMethod === method.id
                          ? 'bg-amber-500/15 border-amber-500 text-white font-semibold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>

                {customerData.paymentMethod === 'dinheiro' && (
                  <div className="mt-2.5">
                    <label htmlFor="cash-change" className="block text-[11px] text-neutral-300 mb-1">
                      Precisa de troco para quanto? (Deixe em branco se não precisar)
                    </label>
                    <input
                      id="cash-change"
                      type="text"
                      placeholder="Ex: R$ 50,00 ou R$ 100,00"
                      value={customerData.cashChangeFor}
                      onChange={(e) => setCustomerData((prev) => ({ ...prev, cashChangeFor: e.target.value }))}
                      className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-xs text-white placeholder-neutral-500 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* General Order Notes */}
              <div>
                <label htmlFor="order-notes" className="block text-xs font-medium text-neutral-300 mb-1">
                  Observações para a cozinha ou entrega
                </label>
                <textarea
                  id="order-notes"
                  rows={2}
                  placeholder="Ex: tocar interfone, caprichar na farofa, sem molho..."
                  value={customerData.orderNotes}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, orderNotes: e.target.value }))}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-neutral-500 outline-none resize-none"
                />
              </div>

              {/* Pricing Breakdown & Proceed */}
              <div className="pt-2 border-t border-neutral-800 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-400">Total a pagar:</span>
                  <span className="text-xl font-bold text-amber-400 tabular-nums font-display">
                    {formatBRL(total)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Revisar Mensagem do WhatsApp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
