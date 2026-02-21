import type { ReactNode } from "react";

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

export type Role = "USER" | "ADMIN";

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  role: Role;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface AuthContextData {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (usuarioData: Usuario, token: string) => void;
  logout: () => void;
}

export interface ProtectedRouteProps {
  children: ReactNode;
  onlyAdmin?: boolean;
}
