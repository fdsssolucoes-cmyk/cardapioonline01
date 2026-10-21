import { Category, EstablishmentInfo, Product } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_ESTABLISHMENT, DEFAULT_PRODUCTS } from '../config/establishment';

const STORAGE_KEYS = {
  ESTABLISHMENT: 'cardapio_espetinho_establishment_v1',
  CATEGORIES: 'cardapio_espetinho_categories_v1',
  PRODUCTS: 'cardapio_espetinho_products_v1',
  CART: 'cardapio_espetinho_cart_v1',
};

export const loadStoredEstablishment = (): EstablishmentInfo => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ESTABLISHMENT);
    if (raw) {
      return { ...DEFAULT_ESTABLISHMENT, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading establishment from storage:', e);
  }
  return DEFAULT_ESTABLISHMENT;
};

export const saveStoredEstablishment = (info: EstablishmentInfo): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ESTABLISHMENT, JSON.stringify(info));
  } catch (e) {
    console.error('Error saving establishment to storage:', e);
  }
};

export const loadStoredCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading categories from storage:', e);
  }
  return DEFAULT_CATEGORIES;
};

export const saveStoredCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Error saving categories to storage:', e);
  }
};

export const loadStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading products from storage:', e);
  }
  return DEFAULT_PRODUCTS;
};

export const saveStoredProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products to storage:', e);
  }
};

export const exportMenuConfiguration = (
  establishment: EstablishmentInfo,
  categories: Category[],
  products: Product[]
): void => {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    establishment,
    categories,
    products,
  };
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  const cleanName = establishment.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  downloadAnchor.setAttribute('download', `cardapio_${cleanName}_backup.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const resetAllToDefault = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ESTABLISHMENT);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CART);
  } catch (e) {
    console.error('Error resetting storage:', e);
  }
};
