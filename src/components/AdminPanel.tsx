import React, { useState } from 'react';
import {
  X,
  Store,
  UtensilsCrossed,
  Tags,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Check,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  HelpCircle,
  FileCode,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category, EstablishmentInfo, Product } from '../types';
import { exportMenuConfiguration } from '../utils/storage';
import { formatBRL } from '../utils/formatters';

export const AdminPanel: React.FC = () => {
  const {
    establishment,
    updateEstablishment,
    categories,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    addCategory,
    updateCategory,
    deleteCategory,
    resetMenuToDefaults,
    importConfiguration,
    isAdminOpen,
    setIsAdminOpen,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'info' | 'products' | 'categories' | 'backup'>('info');

  // Establishment state
  const [formData, setFormData] = useState<EstablishmentInfo>(establishment);

  // Product editing modal/form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 10.0,
    categoryId: categories[0]?.id || 'espetinhos-tradicionais',
    imageUrl: '',
    available: true,
    isPopular: false,
    prepTime: '10 min',
  });

  // Category editing state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  if (!isAdminOpen) return null;

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateEstablishment(formData);
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      categoryId: prod.categoryId,
      imageUrl: prod.imageUrl,
      available: prod.available,
      isPopular: prod.isPopular || false,
      prepTime: prod.prepTime || '10 min',
    });
    setIsCreatingProduct(false);
  };

  const handleStartNewProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: 12.0,
      categoryId: categories[0]?.id || 'espetinhos-tradicionais',
      imageUrl: '',
      available: true,
      isPopular: false,
      prepTime: '10 min',
    });
    setIsCreatingProduct(true);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    if (isCreatingProduct) {
      addProduct(productForm);
      setIsCreatingProduct(false);
    } else if (editingProduct) {
      updateProduct({
        ...productForm,
        id: editingProduct.id,
      });
      setEditingProduct(null);
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim() || undefined,
      order: categories.length + 1,
    });
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.establishment || json.products || json.categories) {
          importConfiguration(json);
          setFormData(json.establishment || formData);
        } else {
          alert('Arquivo JSON inválido para o cardápio.');
        }
      } catch (err) {
        alert('Erro ao ler o arquivo JSON: formato inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ⚙️
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                Painel do Lojista · Configurações
              </h2>
              <p className="text-[11px] text-neutral-400">
                Gerencie dados do estabelecimento, produtos, preços e categorias
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar painel do lojista"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clear Notice about LocalStorage & Security */}
        <div className="px-4 py-2.5 bg-neutral-950/70 border-b border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span>
              Armazenamento local neste dispositivo (LocalStorage). Para novos clientes, use a aba <strong>&quot;Backup & Clientes&quot;</strong> ou edite o arquivo <code>src/config/establishment.ts</code>.
            </span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-4 overflow-x-auto no-scrollbar gap-2 py-2">
          {[
            { id: 'info', label: 'Estabelecimento', icon: Store },
            { id: 'products', label: `Produtos (${products.length})`, icon: UtensilsCrossed },
            { id: 'categories', label: `Categorias (${categories.length})`, icon: Tags },
            { id: 'backup', label: 'Backup & Novos Clientes', icon: FileCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
          {/* TAB 1: ESTABLISHMENT INFO */}
          {activeTab === 'info' && (
            <form onSubmit={handleSaveInfo} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Nome do Estabelecimento *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Slogan / Frase de Destaque
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* WhatsApp Config */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Número do WhatsApp para Pedidos
                  </span>
                  <span className="text-[11px] text-neutral-400">DDI + DDD + Telefone</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">
                      WhatsApp Completo (apenas dígitos)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 5511999999999"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '') })}
                      required
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:border-amber-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">
                      Telefone Formatado para Exibição
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: (11) 99999-9999"
                      value={formData.phoneFormatted}
                      onChange={(e) => setFormData({ ...formData, phoneFormatted: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Address & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Bairro / Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Horário de Funcionamento
                </label>
                <input
                  type="text"
                  placeholder="Ex: Terça a Domingo das 18h às 23h30"
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>

              {/* Delivery Settings */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    Tempo de Entrega
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    Tempo de Retirada
                  </label>
                  <input
                    type="text"
                    value={formData.pickupTime}
                    onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    Taxa de Entrega (R$)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    Frete Grátis acima de (R$)
                  </label>
                  <input
                    type="number"
                    step="1.00"
                    value={formData.freeDeliveryThreshold || ''}
                    onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: parseFloat(e.target.value) || undefined })}
                    placeholder="Ex: 80.00"
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              {/* Status toggles */}
              <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-300">Status do Estabelecimento:</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isOpen: !formData.isOpen })}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      formData.isOpen
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {formData.isOpen ? 'Aberto Agora' : 'Fechado no Momento'}
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-neutral-400">
                  Gerencie o estoque, preços e disponibilidade de cada produto do espetinho.
                </p>
                <button
                  onClick={handleStartNewProduct}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Produto</span>
                </button>
              </div>

              {/* Inline Create/Edit Form */}
              {(isCreatingProduct || editingProduct) && (
                <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <h3 className="text-sm font-bold text-amber-400">
                      {isCreatingProduct ? 'Cadastrar Novo Produto' : `Editar: ${editingProduct?.name}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingProduct(false);
                        setEditingProduct(null);
                      }}
                      className="text-xs text-neutral-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                  </div>

                  <form onSubmit={handleSaveProductForm} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          Nome do Produto *
                        </label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="Ex: Espetinho de Picanha Especial"
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:border-amber-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          Preço em Reais (R$) *
                        </label>
                        <input
                          type="number"
                          step="0.50"
                          min="0"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:border-amber-500 outline-none tabular-nums"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">
                        Descrição e Ingredientes
                      </label>
                      <textarea
                        rows={2}
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Ex: Picanha maturada, sal de parrilla e farofa da casa."
                        className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:border-amber-500 outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          Categoria
                        </label>
                        <select
                          value={productForm.categoryId}
                          onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:border-amber-500 outline-none"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          URL da Foto (opcional)
                        </label>
                        <input
                          type="text"
                          value={productForm.imageUrl}
                          onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                          placeholder="/src/assets/... ou link"
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:border-amber-500 outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          Tempo Médio de Preparo
                        </label>
                        <input
                          type="text"
                          value={productForm.prepTime}
                          onChange={(e) => setProductForm({ ...productForm, prepTime: e.target.value })}
                          placeholder="Ex: 10 min"
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productForm.available}
                            onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                            className="rounded bg-neutral-900 border-neutral-700 text-amber-500"
                          />
                          <span>Disponível para Pedido</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productForm.isPopular}
                            onChange={(e) => setProductForm({ ...productForm, isPopular: e.target.checked })}
                            className="rounded bg-neutral-900 border-neutral-700 text-amber-500"
                          />
                          <span>Destaque (Mais Vendido)</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                      >
                        Salvar Produto
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products Table / List */}
              <div className="border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-800">
                {products.map((p) => {
                  const cat = categories.find((c) => c.id === p.categoryId);
                  return (
                    <div
                      key={p.id}
                      className="p-3 sm:p-4 bg-neutral-950/60 hover:bg-neutral-950 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-neutral-800 overflow-hidden shrink-0 flex items-center justify-center text-xs">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>🍢</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                              {p.name}
                            </h4>
                            <span className="text-[10px] text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 shrink-0">
                              {cat?.name || 'Geral'}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 line-clamp-1">{p.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <span className="text-xs sm:text-sm font-bold text-amber-400 tabular-nums">
                          {formatBRL(p.price)}
                        </span>

                        {/* Availability Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleProductAvailability(p.id)}
                          className={`p-1 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                            p.available
                              ? 'text-emerald-400 hover:bg-emerald-950/40'
                              : 'text-neutral-500 hover:bg-neutral-800'
                          }`}
                          title={p.available ? 'Clique para marcar como esgotado' : 'Clique para marcar como disponível'}
                        >
                          {p.available ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-neutral-500" />}
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleStartEditProduct(p)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="Editar produto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Deseja realmente excluir o produto "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="Excluir produto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="space-y-4 max-w-2xl">
              <p className="text-xs text-neutral-400">
                Organize e renomeie as seções do cardápio como preferir.
              </p>

              {/* Add Category Form */}
              <form onSubmit={handleCreateCategory} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Nome da nova categoria (ex: Sobremesas)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:border-amber-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!newCatName.trim()}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs disabled:opacity-40 cursor-pointer"
                >
                  Adicionar
                </button>
              </form>

              {/* Categories List */}
              <div className="border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-800">
                {categories.map((c) => (
                  <div key={c.id} className="p-3.5 bg-neutral-950/60 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">{c.name}</h4>
                      {c.description && <p className="text-[11px] text-neutral-400">{c.description}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const newName = prompt('Novo nome para a categoria:', c.name);
                          if (newName && newName.trim()) {
                            updateCategory({ ...c, name: newName.trim() });
                          }
                        }}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Renomear categoria"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remover categoria "${c.name}"? Os produtos vinculados a ela não serão apagados.`)) {
                            deleteCategory(c.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Remover categoria"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & NOVOS CLIENTES */}
          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-2xl">
              {/* How to customize for other clients */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <HelpCircle className="w-4 h-4" />
                  <span>Como Reutilizar para Outros Clientes / Restaurantes</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Para entregar este cardápio a um novo estabelecimento, você tem <strong>duas maneiras muito fáceis</strong>:
                </p>
                <ol className="text-xs text-neutral-300 list-decimal list-inside space-y-1.5 pl-1">
                  <li>
                    <strong>Pela Interface:</strong> Altere os dados e produtos neste painel, clique em <strong>&quot;Exportar Backup (JSON)&quot;</strong> e guarde o arquivo do cliente.
                  </li>
                  <li>
                    <strong>Pelo Código Fonte:</strong> Abra o arquivo <code>src/config/establishment.ts</code> e altere os dados na constante <code>DEFAULT_ESTABLISHMENT</code> e <code>DEFAULT_PRODUCTS</code>. Todos os campos estão centralizados e comentados.
                  </li>
                </ol>
              </div>

              {/* Export & Import JSON */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Exportar Configuração</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Baixe um arquivo JSON com todas as configurações, produtos cadastrados e categorias atuais.
                  </p>
                  <button
                    type="button"
                    onClick={() => exportMenuConfiguration(establishment, categories, products)}
                    className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Backup JSON</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Importar Configuração</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Carregue um arquivo JSON salvo anteriormente para aplicar imediatamente todo o cardápio.
                  </p>
                  <label className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Selecionar Arquivo JSON</span>
                    <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Reset to defaults */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Restaurar Cardápio Padrão</h4>
                  <p className="text-[11px] text-neutral-400">
                    Volta aos itens e informações de demonstração iniciais.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Tem certeza de que deseja restaurar o cardápio para o modelo padrão?')) {
                      resetMenuToDefaults();
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800/80 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
