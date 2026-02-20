import {
  Box,
  Typography,
  Button,
  Divider,
  Container,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add,
  Remove,
  ShoppingCartCheckout,
  ProductionQuantityLimits,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../shared/components/CardContext";
import { ProdutoService } from "../../shared/api/services/ProdutoService";
import "./styles.scss";

const produtoService = new ProdutoService();

export default function Carrinho() {
  const { cart, total, addToCart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleFinalizarCompra = async () => {
    setLoading(true);
    try {
      const itensCheckout = cart.map((produto) => ({
        id: produto.id!,
        quantidade: produto.quantidade,
      }));
      await produtoService.checkout(itensCheckout);

      setSnackbar({
        open: true,
        message: "Compra realizada com sucesso!",
        severity: "success",
      });

      clearCart();

      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.error ||
          "Erro ao finalizar a compra. Tente novamente mais tarde.",
        severity: "error",
      });
      setLoading(false);
    }
  };

  return (
    <>
      {cart.length === 0 ? (
        <Container
          maxWidth="md"
          sx={{ py: 12, textAlign: "center" }}
          className="fade-in"
        >
          <ProductionQuantityLimits
            sx={{ fontSize: 100, color: "text.secondary", opacity: 0.3, mb: 3 }}
          />
          <Typography
            variant="h4"
            color="text.primary"
            fontWeight="bold"
            mb={2}
          >
            Seu carrinho está vazio
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Parece que você ainda não adicionou nenhum produto. Que tal explorar
            nossas ofertas?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: "bold" }}
          >
            Continuar Comprando
          </Button>
        </Container>
      ) : (
        <Container
          maxWidth="lg"
          sx={{ py: 6 }}
          className="carrinho-page fade-in"
        >
          <Typography variant="h4" fontWeight="800" mb={4} color="text.primary">
            Meu Carrinho
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box display="flex" flexDirection="column" gap={2}>
                {cart.map((produto) => {
                  const maxEstoqueAtingido =
                    produto.quantidade >= produto.estoqueMax;

                  return (
                    <Paper key={produto.id} elevation={0} className="cart-item">
                      <Box className="item-image">
                        {produto.imagem ? (
                          <img src={produto.imagem} alt={produto.nome} />
                        ) : (
                          <Box className="placeholder">Sem img</Box>
                        )}
                      </Box>

                      <Box className="item-details" flex={1}>
                        <Typography variant="h6" fontWeight="bold" noWrap>
                          {produto.nome}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                        >
                          Categoria: {produto.categoria}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="primary"
                          fontWeight="bold"
                        >
                          R$ {produto.preco.toFixed(2)}{" "}
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            /un
                          </Typography>
                        </Typography>
                      </Box>

                      <Box className="item-actions">
                        <Box className="qtd-controls">
                          <IconButton
                            size="small"
                            onClick={() =>
                              produto.id && removeFromCart(produto.id)
                            }
                            color="primary"
                            disabled={loading}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography
                            fontWeight="bold"
                            sx={{
                              px: 2,
                              minWidth: "20px",
                              textAlign: "center",
                            }}
                          >
                            {produto.quantidade}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => addToCart(produto)}
                            color="primary"
                            disabled={loading || maxEstoqueAtingido}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>

                        <Box textAlign="right" sx={{ minWidth: "90px" }}>
                          <Typography variant="caption" color="text.secondary">
                            Total item
                          </Typography>
                          <Typography fontWeight="bold" color="text.primary">
                            R$ {(produto.preco * produto.quantidade).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} className="summary-box">
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Resumo do Pedido
                </Typography>

                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography color="text.secondary">
                    Subtotal dos produtos
                  </Typography>
                  <Typography fontWeight="bold">
                    R$ {total.toFixed(2)}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography color="text.secondary">Frete</Typography>
                  <Typography color="success.main" fontWeight="bold">
                    Grátis
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  mb={4}
                  alignItems="center"
                >
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    R$ {total.toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <ShoppingCartCheckout />
                    )
                  }
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                  onClick={handleFinalizarCompra}
                >
                  {loading ? "Processando..." : "Finalizar Compra"}
                </Button>

                <Button
                  variant="text"
                  color="inherit"
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 2, textTransform: "none", color: "text.secondary" }}
                  onClick={() => navigate(-1)}
                >
                  Continuar comprando
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", fontWeight: "bold" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
