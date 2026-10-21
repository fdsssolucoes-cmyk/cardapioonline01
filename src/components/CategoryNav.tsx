import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CategoryNav: React.FC = () => {
  const { categories, products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -240 : 240;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const getItemCount = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId && p.available).length;
  };

  const totalAvailableCount = products.filter((p) => p.available).length;

  return (
    <div className="sticky top-16 sm:top-20 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 py-2.5">
      <div className="max-w-6xl mx-auto px-4 relative flex items-center">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 shrink-0 mr-2 cursor-pointer transition-colors"
          aria-label="Rolar categorias para a esquerda"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full"
        >
          {/* All Items Button */}
          <button
            onClick={() => {
              setSelectedCategory('all');
              if (searchQuery) setSearchQuery('');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-950/30'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-800'
            }`}
          >
            <span>Todos os Itens</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${
                selectedCategory === 'all' ? 'bg-black/30 text-white' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {totalAvailableCount}
            </span>
          </button>

          {/* Category Tabs */}
          {categories.map((category) => {
            const count = getItemCount(category.id);
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  if (searchQuery) setSearchQuery('');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-950/30'
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-800'
                }`}
              >
                <span>{category.name}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 shrink-0 ml-2 cursor-pointer transition-colors"
          aria-label="Rolar categorias para a direita"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
