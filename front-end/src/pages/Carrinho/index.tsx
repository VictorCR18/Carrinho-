import { Box, Typography, Button, Divider } from "@mui/material";
import { useCart } from "../../shared/components/CardContext";

export default function Carrinho() {
  const { cart, total, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <Box p={16} display="flex" justifyContent="center" alignContent="center">
        <Typography variant="h5">Seu carrinho está vazio.</Typography>
      </Box>
    );
  }

  return (
    <Box width="100%" p={4} display="flex" justifyContent="center">
      <Box width="500px">
        <Typography variant="h4" mb={3}>
          Carrinho
        </Typography>

        {cart.map((produto) => (
          <Box
            key={produto.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography flex={2}>
              {produto.nome} x {produto.quantidade}
            </Typography>
            <Typography flex={1} mx={2}>
              R$ {(produto.preco * produto.quantidade).toFixed(2)}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => produto.id !== undefined && removeFromCart(produto.id)}
            >
              Remover
            </Button>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">R$ {total.toFixed(2)}</Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            alert("Compra realizada!");
            clearCart();
          }}
        >
          Comprar
        </Button>
      </Box>
    </Box>
  );
}
