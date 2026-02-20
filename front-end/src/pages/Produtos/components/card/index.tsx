import { useState } from "react";
import {
  Button,
  Card as MuiCard,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import type { Produto } from "../../../../types/types";
import { useCart } from "../../../../shared/components/CardContext";
import "./styles.scss";

type Props = {
  produto: Produto;
};

export default function Card({ produto }: Props) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const semEstoque = produto.quantidade <= 0;

  const handleVerDetalhes = () => {
    if (produto.id) {
      navigate(`/produtos/${produto.id}`);
    }
  };

  const handleAdicionarAoCarrinho = () => {
    addToCart(produto);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <MuiCard className="produto-card-item">
        <Box
          className="image-wrapper"
          onClick={handleVerDetalhes}
          sx={{ cursor: "pointer", position: "relative" }}
          title={`Ver detalhes de ${produto.nome}`}
        >
          {semEstoque && (
            <Chip
              label="Esgotado"
              color="error"
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                fontWeight: "bold",
                zIndex: 1,
              }}
            />
          )}

          {produto.imagem ? (
            <CardMedia
              component="img"
              image={produto.imagem}
              alt={produto.nome}
              className="produto-imagem"
              sx={{ opacity: semEstoque ? 0.6 : 1 }}
            />
          ) : (
            <Box className="produto-imagem-placeholder">Sem Imagem</Box>
          )}
        </Box>

        <CardContent className="card-content">
          <Box flexGrow={1}>
            <Typography
              variant="h6"
              component="h3"
              fontWeight="bold"
              noWrap
              title={produto.nome}
            >
              {produto.nome}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                mt: 0.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {produto.descricao || "Sem descrição"}
            </Typography>
          </Box>

          <Box mt="auto">
            <Typography
              variant="h5"
              color={semEstoque ? "text.secondary" : "primary"}
              fontWeight="bold"
              textAlign="right"
              mb={2}
            >
              R$ {(produto.preco || 0).toFixed(2)}
            </Typography>

            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<VisibilityIcon />}
                onClick={handleVerDetalhes}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1,
                }}
              >
                Detalhes
              </Button>

              <Button
                variant="contained"
                fullWidth
                disabled={semEstoque}
                startIcon={<ShoppingCartIcon />}
                onClick={handleAdicionarAoCarrinho}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1,
                }}
              >
                Adicionar
              </Button>
            </Box>
          </Box>
        </CardContent>
      </MuiCard>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Produto adicionado ao carrinho!
        </Alert>
      </Snackbar>
    </>
  );
}