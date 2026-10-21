import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanel } from './components/AdminPanel';
import { MobileCartBar } from './components/MobileCartBar';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { Product } from './types';
import { Flame, Sparkles, SearchX } from 'lucide-react';

const MainMenu: React.FC = () => {
  const { categories, products, selectedCategory, searchQuery, setSearchQuery } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products by search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Header />
      <HeroBanner />
      <CategoryNav />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-12">
        {/* If filtering or searching */}
        {searchQuery.trim() !== '' || selectedCategory !== 'all' ? (
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  {searchQuery ? `Resultados para "${searchQuery}"` : categories.find((c) => c.id === selectedCategory)?.name || 'Itens'}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                </p>
              </div>

              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  Limpar Filtros
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-neutral-900/40 rounded-3xl border border-neutral-800/80">
                <SearchX className="w-10 h-10 text-neutral-500 mx-auto" />
                <h3 className="text-base font-semibold text-white">Nenhum produto encontrado</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Não encontramos nenhum item com esse nome. Tente pesquisar por outros termos como picanha, queijo, refrigerante ou combo.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Grouped by categories view */
          categories.map((category) => {
            const categoryProducts = products.filter(
              (p) => p.categoryId === category.id && (p.available || true)
            );

            if (categoryProducts.length === 0) return null;

            return (
              <section key={category.id} id={category.id} className="scroll-mt-32">
                <div className="mb-5 pb-2 border-b border-neutral-800/80 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="text-xs text-neutral-400 mt-1">{category.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-neutral-500 tabular-nums">
                    {categoryProducts.length} {categoryProducts.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenDetails={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* Modals, Drawers and Overlays */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CartDrawer />
      <CheckoutModal />
      <AdminPanel />
      <MobileCartBar />
      <Toast />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainMenu />
    </StoreProvider>
  );
}
