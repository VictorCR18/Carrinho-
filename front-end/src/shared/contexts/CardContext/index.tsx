import { createContext, useContext, useState, type ReactNode } from "react";
import type { Produto, CartItem, CartContextType } from "../../../types/types";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (produto: Produto) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === produto.id);

      if (existing) {
        if (existing.quantidade >= existing.estoqueMax) {
          return prev;
        }
        return prev.map((p) =>
          p.id === produto.id ? { ...p, quantidade: p.quantidade + 1 } : p,
        );
      }

      return [
        ...prev,
        { ...produto, estoqueMax: produto.quantidade, quantidade: 1 },
      ];
    });
  };

  const removeFromCart = (produtoId: number) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === produtoId ? { ...p, quantidade: p.quantidade - 1 } : p,
        )
        .filter((p) => p.quantidade > 0),
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, p) => acc + p.preco * p.quantidade, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
