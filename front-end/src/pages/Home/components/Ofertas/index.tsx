import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import type { Produto } from "../../../../types/types";
import "./styles.scss";

interface Props {
  ofertas: Produto[];
}

export default function Ofertas({ ofertas }: Props) {
  const navigate = useNavigate();

  return (
    <Box className="ofertas-section">
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={5}
        display="flex"
        alignItems="center"
        gap={1}
      >
        <LocalOfferIcon fontSize="large" color="primary" /> Ofertas da Semana
      </Typography>

      <div className="ofertas-grid">
        {ofertas.map((item, index) => (
          <Card
            key={item.id}
            className="oferta-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Box position="relative">
              <Chip
                label="HOT"
                color="error"
                size="small"
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  zIndex: 1,
                  fontWeight: "bold",
                }}
              />
              {item.imagem && (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imagem}
                  alt={item.nome}
                  sx={{ objectFit: "contain", p: 2, transition: "0.3s" }}
                  className="oferta-img"
                />
              )}
            </Box>

            <CardContent sx={{ pt: 0 }}>
              <Typography
                variant="subtitle1"
                fontWeight="600"
                noWrap
                title={item.nome}
              >
                {item.nome}
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold" mt={1}>
                R$ {item.preco.toFixed(2)}
              </Typography>

              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  borderWidth: 2,
                  "&:hover": { borderWidth: 2 },
                }}
                onClick={() => navigate(`/produtos/${item.id}`)}
              >
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Box>
  );
}
