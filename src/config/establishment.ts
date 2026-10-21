import { Category, EstablishmentInfo, Product } from '../types';

/**
 * =======================================================================
 * ARQUIVO CENTRAL DE CONFIGURAÇÃO DO ESTABELECIMENTO
 * =======================================================================
 * Para personalizar este cardápio para um novo cliente ou restaurante,
 * você só precisa editar os dados abaixo!
 *
 * Também é possível editar tudo dinamicamente pelo "Painel do Lojista" na interface.
 */

export const DEFAULT_ESTABLISHMENT: EstablishmentInfo = {
  name: "Espetinho do Cliente",
  tagline: "Sabor inconfundível de brasa e tradição",
  whatsapp: "5511999999999", // Apenas números: DDI (55) + DDD (ex: 11) + Número
  phoneFormatted: "(11) 99999-9999",
  address: "Rua dos Espetos, 450",
  neighborhood: "Vila Mariana",
  city: "São Paulo - SP",
  openingHours: "Terça a Domingo das 18h00 às 23h30",
  isOpen: true,
  deliveryTime: "35 a 50 min",
  pickupTime: "15 a 25 min",
  deliveryFee: 6.00,
  freeDeliveryThreshold: 80.00,
  allowsDelivery: true,
  allowsPickup: true,
  minOrderValue: 20.00,
  coverUrl: "/src/assets/images/hero_espetinho_bbq_1792499628124.jpg",
  logoUrl: ""
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "espetinhos-tradicionais", name: "Espetinhos Tradicionais", order: 1, description: "Os clássicos mais pedidos na brasa incandescente" },
  { id: "espetinhos-especiais", name: "Espetinhos Especiais", order: 2, description: "Cortes nobres e receitas exclusivas da casa" },
  { id: "combos-individuais", name: "Combos Individuais", order: 3, description: "Refeição completa pronta para matar sua fome" },
  { id: "combos-duas-pessoas", name: "Combos para 2 Pessoas", order: 4, description: "Combinação perfeita para dividir a dois" },
  { id: "combos-familia", name: "Combos para Família", order: 5, description: "Banquete completo com espetos, farofa, vinagrete e pão de alho" },
  { id: "acompanhamentos", name: "Acompanhamentos", order: 6, description: "Farofa crocante, vinagrete fresco, pão de alho e molhos" },
  { id: "porcoes", name: "Porções", order: 7, description: "Petiscos e porções generosas para compartilhar" },
  { id: "bebidas", name: "Bebidas", order: 8, description: "Cervejas geladas, refrigerantes, sucos e águas" },
  { id: "sobremesas", name: "Sobremesas", order: 9, description: "O toque doce ideal para fechar com chave de ouro" },
];

export const DEFAULT_PRODUCTS: Product[] = [
  // Espetinhos Tradicionais
  {
    id: "esp-carne",
    name: "Espetinho de Carne Bovina (Demo)",
    description: "Alcatra macia temperada na medida certa e grelhada no carvão. Acompanha farofa da casa.",
    price: 12.00,
    categoryId: "espetinhos-tradicionais",
    imageUrl: "/images/espetinho_picanha_1792499629843.jpg",
    available: true,
    isPopular: true,
    prepTime: "10 min"
  },
  {
    id: "esp-frango",
    name: "Espetinho de Frango com Bacon (Demo)",
    description: "Cubos suculentos de peito de frango envolvidos em fatias crocantes de bacon defumado.",
    price: 13.00,
    categoryId: "espetinhos-tradicionais",
    imageUrl: "/images/hero_espetinho_bbq_1792499628124.jpg",
    available: true,
    isPopular: true,
    prepTime: "12 min"
  },
  {
    id: "esp-linguica",
    name: "Espetinho de Linguiça Campeira (Demo)",
    description: "Linguiça artesanal levemente apimentada, tostadinha por fora e muito suculenta.",
    price: 11.00,
    categoryId: "espetinhos-tradicionais",
    imageUrl: "/images/combo_familia_bbq_1792499631282.jpg",
    available: true,
    prepTime: "10 min"
  },
  {
    id: "esp-coracao",
    name: "Espetinho de Coração de Frango (Demo)",
    description: "Coraçõezinhos marinados em ervas finas e grelhados no ponto perfeito.",
    price: 12.50,
    categoryId: "espetinhos-tradicionais",
    imageUrl: "/images/hero_espetinho_bbq_1792499628124.jpg",
    available: true,
    prepTime: "12 min"
  },

  // Espetinhos Especiais
  {
    id: "esp-picanha",
    name: "Espetinho Nobre de Picanha (Demo)",
    description: "Cortes selecionados de picanha com capa de gordura dourada e sal grosso de parrilla.",
    price: 18.00,
    categoryId: "espetinhos-especiais",
    imageUrl: "/images/espetinho_picanha_1792499629843.jpg",
    available: true,
    isPopular: true,
    prepTime: "12 min"
  },
  {
    id: "esp-queijo",
    name: "Espetinho de Queijo Coalho com Melaço (Demo)",
    description: "Queijo coalho tostado com crostinha dourada, servido com melaço de cana e orégano.",
    price: 14.00,
    categoryId: "espetinhos-especiais",
    imageUrl: "/images/espetinho_queijo_1792499630224.jpg",
    available: true,
    isPopular: true,
    prepTime: "8 min"
  },
  {
    id: "esp-costela",
    name: "Espetinho de Costela Bovina Desfiada (Demo)",
    description: "Costela marinada por 12 horas, assada lentamente e finalizada no fogo alto.",
    price: 16.50,
    categoryId: "espetinhos-especiais",
    imageUrl: "/images/espetinho_picanha_1792499629843.jpg",
    available: true,
    prepTime: "10 min"
  },
  {
    id: "esp-pao-alho",
    name: "Espeto de Pão de Alho Especial (Demo)",
    description: "Baguete recheada com pasta cremosa de alho poró, queijo mussarela e parmesão gratinado.",
    price: 10.00,
    categoryId: "espetinhos-especiais",
    imageUrl: "/images/combo_familia_bbq_1792499631282.jpg",
    available: true,
    prepTime: "8 min"
  },

  // Combos Individuais
  {
    id: "combo-solo",
    name: "Combo Individual Raiz (Demo)",
    description: "2 espetinhos à sua escolha (carne ou frango) + porção individual de farofa especial + vinagrete fresco.",
    price: 28.00,
    categoryId: "combos-individuais",
    imageUrl: "/images/combo_familia_bbq_1792499631282.jpg",
    available: true,
    isPopular: true,
    prepTime: "15 min"
  },
  {
    id: "combo-especial-solo",
    name: "Combo Nobre Individual (Demo)",
    description: "1 espeto de picanha + 1 espeto de queijo coalho + 1 pão de alho + vinagrete.",
    price: 36.00,
    categoryId: "combos-individuais",
    imageUrl: "/images/espetinho_picanha_1792499629843.jpg",
    available: true,
    prepTime: "15 min"
  },

  // Combos para Duas Pessoas
  {
    id: "combo-casal",
    name: "Combo Brasa a Dois (Demo)",
    description: "4 espetinhos tradicionais à escolha + 1 pão de alho + mandioca frita + farofa e vinagrete.",
    price: 58.00,
    categoryId: "combos-duas-pessoas",
    imageUrl: "/images/combo_familia_bbq_1792499631282.jpg",
    available: true,
    isPopular: true,
    prepTime: "20 min"
  },

  // Combos para Família
  {
    id: "combo-familia-vip",
    name: "Banquete Família do Espeto (Demo)",
    description: "8 espetinhos variados + 2 pães de alho + porção grande de mandioca com bacon + farofa de cebola crocante + vinagrete.",
    price: 110.00,
    categoryId: "combos-familia",
    imageUrl: "/images/combo_familia_bbq_1792499631282.jpg",
    available: true,
    isPopular: true,
    prepTime: "25 min"
  },

  // Acompanhamentos
  {
    id: "acomp-farofa",
    name: "Farofa Artesanal com Bacon e Alho (Demo)",
    description: "Farinha de mandioca torradinha na manteiga de garrafa com pedacinhos crocantes de bacon.",
    price: 8.00,
    categoryId: "acompanhamentos",
    imageUrl: "/images/combo_familia_bbq_1792499631282.jpg",
    available: true,
    prepTime: "5 min"
  },
  {
    id: "acomp-vinagrete",
    name: "Vinagrete Especial da Casa (Demo)",
    description: "Tomate fresco em cubos, cebola roxa, cheiro verde e azeite extravirgem.",
    price: 7.00,
    categoryId: "acompanhamentos",
    imageUrl: "/images/combo_familia_bbq_1792499631282.jpg",
    available: true,
    prepTime: "5 min"
  },

  // Porções
  {
    id: "porcao-mandioca",
    name: "Mandioca Cremosa Frita com Bacon (Demo)",
    description: "Mandioca macia por dentro e ultra crocante por fora, coberta com bacon e cebolinha.",
    price: 26.00,
    categoryId: "porcoes",
    imageUrl: "/images/porcao_mandioca_1792499630291.jpg",
    available: true,
    isPopular: true,
    prepTime: "15 min"
  },
  {
    id: "porcao-batata",
    name: "Batata Rústica com Alecrim e Parmesão (Demo)",
    description: "Batatas cortadas em gomos rústicos, temperadas com sal grosso marinho, alecrim fresco e parmesão.",
    price: 24.00,
    categoryId: "porcoes",
    imageUrl: "/images/porcao_mandioca_1792499630291.jpg",
    available: true,
    prepTime: "15 min"
  },

  // Bebidas
  {
    id: "beb-refri-lata",
    name: "Refrigerante em Lata 350ml (Demo)",
    description: "Coca-Cola, Guaraná Antarctica ou Fanta Laranja estupidamente gelados.",
    price: 6.50,
    categoryId: "bebidas",
    imageUrl: "",
    available: true,
    prepTime: "Imediato"
  },
  {
    id: "beb-cerveja-longneck",
    name: "Cerveja Long Neck 330ml (Demo)",
    description: "Heineken, Stella Artois ou Corona geladíssima. Proibida a venda para menores de 18 anos.",
    price: 11.00,
    categoryId: "bebidas",
    imageUrl: "",
    available: true,
    prepTime: "Imediato"
  },
  {
    id: "beb-suco-natural",
    name: "Suco Natural 500ml (Demo)",
    description: "Feito da fruta na hora: Laranja, Maracujá ou Limão com hortelã.",
    price: 9.00,
    categoryId: "bebidas",
    imageUrl: "",
    available: true,
    prepTime: "5 min"
  },

  // Sobremesas
  {
    id: "sob-abacaxi-canela",
    name: "Espetinho de Abacaxi com Canela e Mel (Demo)",
    description: "Fatias de abacaxi grelhadas na brasa, caramelizadas com açúcar mascavo, canela e toque de mel.",
    price: 10.00,
    categoryId: "sobremesas",
    imageUrl: "/images/espetinho_queijo_1792499630224.jpg",
    available: true,
    prepTime: "8 min"
  },
  {
    id: "sob-pudim",
    name: "Pudim Tradicional de Leite Condensado (Demo)",
    description: "Fatia generosa, sem furinhos, com calda dourada de caramelo artesanal.",
    price: 12.00,
    categoryId: "sobremesas",
    imageUrl: "",
    available: true,
    prepTime: "Imediato"
  }
];
