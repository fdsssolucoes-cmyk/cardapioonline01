import { CartItem, EstablishmentInfo, OrderCustomerData, PaymentMethod } from '../types';

/**
 * Currency formatter for Brazilian Real (BRL)
 */
export const formatBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Cleans phone number keeping only digits and ensuring country code 55
 */
export const sanitizeWhatsApp = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('55')) {
    return digits;
  }
  return `55${digits}`;
};

/**
 * Formats Brazilian phone number for display: (11) 98765-4321
 */
export const formatPhoneDisplay = (phone: string): string => {
  const clean = phone.replace(/\D/g, '');
  // strip 55 if present for cleaner national view
  const national = clean.startsWith('55') && clean.length > 10 ? clean.slice(2) : clean;
  if (national.length === 11) {
    return `(${national.slice(0, 2)}) ${national.slice(2, 7)}-${national.slice(7)}`;
  }
  if (national.length === 10) {
    return `(${national.slice(0, 2)}) ${national.slice(2, 6)}-${national.slice(6)}`;
  }
  return phone;
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: 'PIX (Chave rápida)',
  cartao_credito: 'Cartão de Crédito (Levar maquininha)',
  cartao_debito: 'Cartão de Débito (Levar maquininha)',
  dinheiro: 'Dinheiro em espécie',
};

/**
 * Builds a structured, organized WhatsApp order message
 */
export const buildWhatsAppMessage = (
  establishment: EstablishmentInfo,
  customerData: OrderCustomerData,
  items: CartItem[],
  subtotal: number,
  deliveryFee: number,
  total: number
): string => {
  const isDelivery = customerData.orderType === 'entrega';
  const orderNum = Math.floor(1000 + Math.random() * 9000);

  const lines: string[] = [];

  lines.push(`🔥 *NOVO PEDIDO #${orderNum}*`);
  lines.push(`🏠 *${establishment.name.toUpperCase()}*`);
  lines.push(`📅 Data: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`);
  lines.push('');
  lines.push('────────────────────────');
  lines.push('👤 *DADOS DO CLIENTE*');
  lines.push(`• *Nome:* ${customerData.customerName.trim()}`);
  if (customerData.customerPhone) {
    lines.push(`• *Telefone:* ${customerData.customerPhone.trim()}`);
  }
  lines.push(`• *Modalidade:* ${isDelivery ? '🛵 Entrega (Delivery)' : '🥡 Retirada no Balcão'}`);

  if (isDelivery) {
    lines.push('');
    lines.push('📍 *ENDEREÇO DE ENTREGA*');
    lines.push(`• ${customerData.street.trim()}, nº ${customerData.number.trim()}`);
    lines.push(`• Bairro: ${customerData.neighborhood.trim()}`);
    if (customerData.complement?.trim()) {
      lines.push(`• Compl: ${customerData.complement.trim()}`);
    }
    if (customerData.reference?.trim()) {
      lines.push(`• Ponto de Ref: ${customerData.reference.trim()}`);
    }
  }

  lines.push('');
  lines.push('────────────────────────');
  lines.push('🍢 *ITENS DO PEDIDO*');

  items.forEach((item, index) => {
    const itemTotal = item.product.price * item.quantity;
    lines.push(`${index + 1}. *${item.quantity}x ${item.product.name}*`);
    lines.push(`   (${formatBRL(item.product.price)} un) = *${formatBRL(itemTotal)}*`);
    if (item.notes?.trim()) {
      lines.push(`   _Obs: ${item.notes.trim()}_`);
    }
  });

  lines.push('');
  lines.push('────────────────────────');
  lines.push('💰 *RESUMO DE VALORES*');
  lines.push(`• Subtotal: ${formatBRL(subtotal)}`);

  if (isDelivery) {
    if (deliveryFee === 0) {
      lines.push('• Taxa de entrega: *GRÁTIS* 🎉');
    } else {
      lines.push(`• Taxa de entrega: ${formatBRL(deliveryFee)}`);
    }
  } else {
    lines.push('• Taxa de entrega: *Não aplicável (Retirada)*');
  }

  lines.push(`• *TOTAL DO PEDIDO: ${formatBRL(total)}*`);

  lines.push('');
  lines.push('💳 *FORMA DE PAGAMENTO*');
  lines.push(`• ${PAYMENT_LABELS[customerData.paymentMethod]}`);

  if (customerData.paymentMethod === 'dinheiro' && customerData.cashChangeFor?.trim()) {
    lines.push(`• Levar troco para: ${formatBRL(parseFloat(customerData.cashChangeFor.replace(',', '.')) || 0)}`);
  }

  if (customerData.orderNotes?.trim()) {
    lines.push('');
    lines.push('📝 *OBSERVAÇÕES DO PEDIDO*');
    lines.push(`"${customerData.orderNotes.trim()}"`);
  }

  lines.push('');
  lines.push('────────────────────────');
  lines.push('⚠️ *Aguardando confirmação do estabelecimento pelo WhatsApp.*');
  lines.push('Muito obrigado pela preferência!');

  return lines.join('\n');
};

/**
 * Creates the wa.me link with the URL-encoded message
 */
export const createWhatsAppUrl = (whatsapp: string, message: string): string => {
  const cleanPhone = sanitizeWhatsApp(whatsapp);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};
