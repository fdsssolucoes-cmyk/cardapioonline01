import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Category, EstablishmentInfo, Product } from '../types';
import {
  loadStoredCategories,
  loadStoredEstablishment,
  loadStoredProducts,
  saveStoredCategories,
  saveStoredEstablishment,
  saveStoredProducts,
  resetAllToDefault,
} from '../utils/storage';
import { DEFAULT_CATEGORIES, DEFAULT_ESTABLISHMENT, DEFAULT_PRODUCTS } from '../config/establishment';

interface StoreContextType {
  establishment: EstablishmentInfo;
  updateEstablishment: (info: EstablishmentInfo) => void;
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, notes?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemNotes: (productId: string, notes: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  resetMenuToDefaults: () => void;
  importConfiguration: (data: { establishment?: EstablishmentInfo; categories?: Category[]; products?: Product[] }) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [establishment, setEstablishmentState] = useState<EstablishmentInfo>(loadStoredEstablishment);
  const [categories, setCategoriesState] = useState<Category[]>(loadStoredCategories);
  const [products, setProductsState] = useState<Product[]>(loadStoredProducts);

  // Cart state stored in session/localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cardapio_espetinho_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('cardapio_espetinho_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2800);
  };

  const updateEstablishment = (info: EstablishmentInfo) => {
    setEstablishmentState(info);
    saveStoredEstablishment(info);
    showToast('Dados do estabelecimento atualizados!');
  };

  const addToCart = (product: Product, quantity = 1, notes = '') => {
    if (!product.available) {
      showToast('Este item está indisponível no momento.');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                notes: notes ? (item.notes ? `${item.notes} | ${notes}` : notes) : item.notes,
              }
            : item
        );
      }
      return [...prev, { product, quantity, notes }];
    });
    showToast(`${quantity}x ${product.name} adicionado ao pedido!`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removido do carrinho.');
  };

  const updateCartItemNotes = (productId: string, notes: string) => {
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, notes } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTotalCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Product management
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    const updated = [newProduct, ...products];
    setProductsState(updated);
    saveStoredProducts(updated);
    showToast(`Produto "${newProduct.name}" cadastrado!`);
  };

  const updateProduct = (updatedProduct: Product) => {
    const updated = products.map(p => (p.id === updatedProduct.id ? updatedProduct : p));
    setProductsState(updated);
    saveStoredProducts(updated);

    // Update cart if item is there
    setCart(prev =>
      prev.map(item =>
        item.product.id === updatedProduct.id ? { ...item, product: updatedProduct } : item
      )
    );
    showToast(`Produto "${updatedProduct.name}" atualizado!`);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProductsState(updated);
    saveStoredProducts(updated);
    removeFromCart(id);
    showToast('Produto excluído com sucesso.');
  };

  const toggleProductAvailability = (id: string) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const nextState = !p.available;
        showToast(`Item ${p.name} agora está ${nextState ? 'Disponível' : 'Indisponível'}.`);
        return { ...p, available: nextState };
      }
      return p;
    });
    setProductsState(updated);
    saveStoredProducts(updated);
  };

  // Category management
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    };
    const updated = [...categories, newCategory];
    setCategoriesState(updated);
    saveStoredCategories(updated);
    showToast(`Categoria "${newCategory.name}" adicionada!`);
  };

  const updateCategory = (updatedCategory: Category) => {
    const updated = categories.map(c => (c.id === updatedCategory.id ? updatedCategory : c));
    setCategoriesState(updated);
    saveStoredCategories(updated);
    showToast(`Categoria "${updatedCategory.name}" atualizada!`);
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategoriesState(updated);
    saveStoredCategories(updated);
    showToast('Categoria removida.');
  };

  const resetMenuToDefaults = () => {
    resetAllToDefault();
    setEstablishmentState(DEFAULT_ESTABLISHMENT);
    setCategoriesState(DEFAULT_CATEGORIES);
    setProductsState(DEFAULT_PRODUCTS);
    setCart([]);
    showToast('Cardápio restaurado para as configurações padrão!');
  };

  const importConfiguration = (data: {
    establishment?: EstablishmentInfo;
    categories?: Category[];
    products?: Product[];
  }) => {
    if (data.establishment) {
      setEstablishmentState(data.establishment);
      saveStoredEstablishment(data.establishment);
    }
    if (data.categories && Array.isArray(data.categories)) {
      setCategoriesState(data.categories);
      saveStoredCategories(data.categories);
    }
    if (data.products && Array.isArray(data.products)) {
      setProductsState(data.products);
      saveStoredProducts(data.products);
    }
    showToast('Configuração importada com sucesso!');
  };

  return (
    <StoreContext.Provider
      value={{
        establishment,
        updateEstablishment,
        categories,
        products,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        updateCartItemNotes,
        clearCart,
        cartSubtotal,
        cartTotalCount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminOpen,
        setIsAdminOpen,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        addCategory,
        updateCategory,
        deleteCategory,
        resetMenuToDefaults,
        importConfiguration,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
