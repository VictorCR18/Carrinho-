import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Produto } from "../../../../types/types";
import "./styles.scss";

interface Props {
  ofertas: Produto[];
}

export default function Ofertas({ ofertas }: Props) {
  const navigate = useNavigate();

  return (
    <Box px={10} py={4} className="ofertas-section">
      <Typography variant="h4" mb={3}>
        Ofertas da Semana
      </Typography>
      <div className="ofertas-grid">
        {ofertas.map((item) => (
          <Card key={item.id} className="oferta-card">
            {item.imagem && (
              <CardMedia
                component="img"
                height="180"
                image={item.imagem}
                alt={item.nome}
                sx={{
                  objectFit: "contain",
                  width: "100%",
                  height: 180,
                }}
              />
            )}
            <CardContent>
              <Typography variant="h6">{item.nome}</Typography>
              <Typography color="#1976d2" fontWeight="bold">
                R$ {item.preco.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate(`/produtos/${item.id}`)}
              >
                Comprar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Box>
  );
}
