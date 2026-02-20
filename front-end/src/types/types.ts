export interface Produto {
  id?: number;
  nome: string;
  categoria: string;
  preco: number;
  descricao?: string;
  quantidade: number;
  imagem?: string | null;
}

export interface CartItem extends Produto {
  quantidade: number;
  estoqueMax: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (produto: Produto) => void;
  removeFromCart: (produtoId: number) => void;
  clearCart: () => void;
  total: number;
}
