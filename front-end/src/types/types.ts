export interface Produto {
  quantidade: number;
  id?: number;
  nome: string;
  categoria: string;
  preco: number;
  descricao?: string;
  imagem?: string | null;
}

export interface CartContextType {
  cart: Produto[];
  addToCart: (produto: Produto) => void;
  removeFromCart: (produtoId: number) => void;
  clearCart: () => void;
  total: number;
}
