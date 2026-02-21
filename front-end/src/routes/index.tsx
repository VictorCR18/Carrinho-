import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import CadastroUsuario from "../pages/CadastroUsuario";
import GerenciaProdutos from "../pages/GerenciaProdutos";
import Carrinho from "../pages/Carrinho";
import Produtos from "../pages/Produtos";
import DetalhesProduto from "../pages/DetalhesProduto";
import Dashboard from "../pages/Dashboard";

import { ProtectedRoute } from "../shared/contexts/ProtectedRoute";

export default function Router() {
  return (
    <Routes>
      {/* --- ROTAS PÚBLICAS --- */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<Login />} />
      <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/produtos/:id" element={<DetalhesProduto />} />
      <Route path="/carrinho" element={<Carrinho />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute onlyAdmin>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/gerenciar-produtos"
        element={
          <ProtectedRoute onlyAdmin>
            <GerenciaProdutos />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
