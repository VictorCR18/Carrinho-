import { Box, Container, CircularProgress } from "@mui/material";
import Banner from "./components/Banner";
import Categorias from "./components/Categorias";
import Ofertas from "./components/Ofertas";
import { useEffect, useState } from "react";
import { ProdutoService } from "../../shared/api/services/ProdutoService";
import type { Produto } from "../../types/types";
import "./styles.scss";

const produtoService = new ProdutoService();

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await produtoService.list();
        setProdutos(data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProdutos();
  }, []);

  const categoriasComProduto = Array.from(
    new Map(produtos.map((p) => [p.categoria, p])).values(),
  );

  const ofertas = produtos.slice(0, 4);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box width="100%" className="home-container">
      <Banner />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Categorias categorias={categoriasComProduto} />
        <Box my={6} />
        <Ofertas ofertas={ofertas} />
      </Container>
    </Box>
  );
}
