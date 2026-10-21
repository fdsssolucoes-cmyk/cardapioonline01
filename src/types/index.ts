/**
 * Type definitions for Cardápio do Espetinho
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in BRL, e.g. 14.50
  categoryId: string;
  imageUrl: string;
  available: boolean;
  isPopular?: boolean;
  prepTime?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface EstablishmentInfo {
  name: string;
  tagline: string;
  whatsapp: string; // Clean numbers with DDI and DDD, e.g. "5511999999999"
  phoneFormatted: string; // Human readable, e.g. "(11) 99999-9999"
  address: string;
  neighborhood: string;
  city: string;
  openingHours: string;
  isOpen: boolean;
  deliveryTime: string; // e.g. "35 - 50 min"
  pickupTime: string; // e.g. "15 - 25 min"
  deliveryFee: number; // e.g. 6.00
  freeDeliveryThreshold?: number; // e.g. 80.00
  allowsDelivery: boolean;
  allowsPickup: boolean;
  minOrderValue: number;
  logoUrl?: string;
  coverUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export type OrderType = 'entrega' | 'retirada';

export type PaymentMethod = 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro';

export interface OrderCustomerData {
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  reference?: string;
  paymentMethod: PaymentMethod;
  cashChangeFor?: string;
  orderNotes?: string;
}
