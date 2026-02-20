import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import type { Produto } from "../../types/types";
import { ProdutoService } from "../../shared/api/services/ProdutoService";
import ProdutoCard from "./components/ProdutoCard";
import "./styles.scss";

const produtoService = new ProdutoService();

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    string | null
  >(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCategoriaSelecionada(params.get("categoria"));
  }, [location.search]);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await produtoService.list();
        setProdutos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProdutos();
  }, []);

  const categorias = Array.from(new Set(produtos.map((p) => p.categoria)));

  const produtosFiltrados = categoriaSelecionada
    ? produtos.filter((p) => p.categoria === categoriaSelecionada)
    : produtos;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="produtos-page" py={6}>
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={6}
        >
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            Nosso Catálogo
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/produtos/cadastrar")}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cadastrar Produto
          </Button>
        </Box>

        {categoriaSelecionada ? (
          <Box mb={6} className="fade-in">
            <Typography
              variant="h5"
              color="text.secondary"
              mb={3}
              fontWeight="600"
            >
              Categoria: {categoriaSelecionada}
            </Typography>
            <div className="produtos-grid">
              {produtosFiltrados.map((p) => (
                <ProdutoCard key={p.id} produto={p} />
              ))}
            </div>
          </Box>
        ) : (
          categorias.map((categoria) => (
            <Box key={categoria} mb={8} className="fade-in">
              <Typography
                variant="h5"
                color="text.secondary"
                mb={1}
                fontWeight="600"
              >
                {categoria}
              </Typography>
              <Divider sx={{ mb: 4 }} />
              <div className="produtos-grid">
                {produtos
                  .filter((p) => p.categoria === categoria)
                  .map((p) => (
                    <ProdutoCard key={p.id} produto={p} />
                  ))}
              </div>
            </Box>
          ))
        )}

        {produtos.length === 0 && (
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            mt={10}
          >
            Nenhum produto encontrado.
          </Typography>
        )}
      </Container>
    </Box>
  );
}
