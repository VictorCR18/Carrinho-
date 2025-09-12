import { Box } from "@mui/material";
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

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await produtoService.list();
        setProdutos(data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      }
    }
    fetchProdutos();
  }, []);

  const categoriasComProduto = Array.from(
    new Map(produtos.map((p) => [p.categoria, p])).values()
  );

  const ofertas = produtos.slice(0, 3);

  return (
    <Box width={"100%"}>
      <Banner />
      <Categorias categorias={categoriasComProduto} />
      <Ofertas ofertas={ofertas} />
    </Box>
  );
}
