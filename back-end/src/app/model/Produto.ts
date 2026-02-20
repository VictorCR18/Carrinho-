export interface Produto {
  id?: number;
  nome: string;
  categoria: string;
  preco: number;
  descricao?: string;
  quantidade: number;
  imagem?: string | null;
}
