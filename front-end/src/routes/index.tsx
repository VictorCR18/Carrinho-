import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CadastroProdutos from "../pages/CadastroProdutos";
import Carrinho from "../pages/Carrinho";
import Produtos from "../pages/Produtos";
import { CartProvider } from "../shared/components/CardContext";

export default function Router() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/produtos/cadastrar" element={<CadastroProdutos />} />
        <Route path="/carrinho" element={<Carrinho />} />
      </Routes>
    </CartProvider>
  );
}
