import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import type { Produto } from "../../types/types";
import { ProdutoService } from "../../shared/api/services/ProdutoService";
import "./styles.scss";
import Card from "./components/card";

const produtoService = new ProdutoService();

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    string | null
  >(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoria = params.get("categoria");
    setCategoriaSelecionada(categoria);
  }, [location.search]);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await produtoService.list();
        setProdutos(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProdutos();
  }, []);

  const categorias = Array.from(new Set(produtos.map((p) => p.categoria)));

  const produtosFiltrados = categoriaSelecionada
    ? produtos.filter((p) => p.categoria === categoriaSelecionada)
    : produtos;

  return (
    <Box className="produtos-cards-page" py={4} px={28}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        className="header"
      >
        <Typography variant="h4">Produtos</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/produtos/cadastrar")}
        >
          Cadastrar Produto
        </Button>
      </Box>

      {categoriaSelecionada ? (
        <Box mb={6}>
          <Typography variant="h5" mb={2}>
            {categoriaSelecionada}
          </Typography>
          <div className="grid-container">
            {produtosFiltrados.map((p) => (
              <Card key={p.id} produto={p} />
            ))}
          </div>
        </Box>
      ) : (
        categorias.map((categoria) => (
          <Box key={categoria} mb={6}>
            <Typography variant="h5" mb={2}>
              {categoria}
            </Typography>
            <div className="grid-container">
              {produtos
                .filter((p) => p.categoria === categoria)
                .map((p) => (
                  <Card key={p.id} produto={p} />
                ))}
            </div>
          </Box>
        ))
      )}
    </Box>
  );
}
