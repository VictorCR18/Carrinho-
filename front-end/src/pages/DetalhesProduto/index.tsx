import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Container,
  CircularProgress,
  Divider,
  IconButton,
  Chip,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Remove, ShoppingCart, ArrowBack } from "@mui/icons-material";
import { ProdutoService } from "../../shared/api/services/ProdutoService";
import { useCart } from "../../shared/contexts/CardContext";
import type { Produto } from "../../types/types";
import "./styles.scss";

const produtoService = new ProdutoService();

export default function DetalhesProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantidadeDesejada, setQuantidadeDesejada] = useState(1);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    async function fetchProduto() {
      try {
        const data = await produtoService.list();
        const prod = data.find((p) => p.id === Number(id));
        if (prod) {
          setProduto(prod);
          setQuantidadeDesejada(prod.quantidade > 0 ? 1 : 0);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduto();
  }, [id]);

  const handleAumentar = () => {
    if (produto && quantidadeDesejada < produto.quantidade) {
      setQuantidadeDesejada((q) => q + 1);
    }
  };

  const handleDiminuir = () => {
    if (quantidadeDesejada > 1) {
      setQuantidadeDesejada((q) => q - 1);
    }
  };

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleAdicionarAoCarrinho = () => {
    if (produto) {
      for (let i = 0; i < quantidadeDesejada; i++) {
        addToCart(produto);
      }

      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/carrinho");
      }, 1500);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!produto) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" color="text.secondary" mb={4}>
          Produto não encontrado.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Voltar para a Loja
        </Button>
      </Container>
    );
  }

  const semEstoque = produto.quantidade === 0;

  return (
    <>
      <Box className="detalhes-page">
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              mb: 4,
              color: "text.secondary",
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Voltar
          </Button>

          <Paper elevation={0} className="produto-container fade-in-up">
            <Box className="imagem-wrapper">
              {produto.imagem ? (
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="produto-img"
                  style={{ opacity: semEstoque ? 0.6 : 1 }}
                />
              ) : (
                <Box className="img-placeholder">Sem Imagem</Box>
              )}
            </Box>

            <Box className="info-wrapper">
              <Chip
                label={produto.categoria}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: "bold", mb: 2, width: "fit-content" }}
              />

              <Typography
                variant="h3"
                component="h1"
                fontWeight="800"
                color="text.primary"
                mb={1}
              >
                {produto.nome}
              </Typography>

              <Typography variant="h4" color="primary" fontWeight="bold" mb={3}>
                R$ {(produto.preco || 0).toFixed(2)}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.8 }}
              >
                {produto.descricao ||
                  "Nenhuma descrição detalhada disponível para este produto."}
              </Typography>

              <Typography
                variant="subtitle2"
                color={semEstoque ? "error" : "text.secondary"}
                mb={2}
              >
                {semEstoque
                  ? "Produto Esgotado"
                  : `Estoque disponível: ${produto.quantidade} unidades`}
              </Typography>

              <Box className="actions-wrapper">
                <Box className="quantidade-selector">
                  <IconButton
                    onClick={handleDiminuir}
                    disabled={quantidadeDesejada <= 1 || semEstoque}
                    color="primary"
                  >
                    <Remove />
                  </IconButton>
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{ px: 2, fontWeight: "bold" }}
                  >
                    {quantidadeDesejada}
                  </Typography>
                  <IconButton
                    onClick={handleAumentar}
                    disabled={
                      quantidadeDesejada >= produto.quantidade || semEstoque
                    }
                    color="primary"
                  >
                    <Add />
                  </IconButton>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  disabled={semEstoque}
                  onClick={handleAdicionarAoCarrinho}
                  className="btn-adicionar"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  {semEstoque ? "Indisponível" : "Comprar Agora"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%", fontWeight: "bold" }}
        >
          {quantidadeDesejada}x {produto?.nome} adicionado ao carrinho!
        </Alert>
      </Snackbar>
    </>
  );
}
