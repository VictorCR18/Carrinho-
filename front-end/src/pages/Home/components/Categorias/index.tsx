import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Produto } from "../../../../types/types";
import "./styles.scss";

interface Props {
  categorias: Produto[];
}

export default function Categorias({ categorias }: Props) {
  const navigate = useNavigate();

  return (
    <Box className="categorias-section">
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={5}>
        Explore por Categorias
      </Typography>
      <div className="categorias-grid">
        {categorias.map((prod, index) => (
          <Card
            key={prod.categoria}
            className="categoria-card"
            style={{ animationDelay: `${index * 0.1}s` }} 
            onClick={() => navigate(`/produtos?categoria=${prod.categoria}`)}
          >
            <Box overflow="hidden">
              {prod.imagem ? (
                <CardMedia
                  className="categoria-img"
                  component="img"
                  image={prod.imagem}
                  alt={prod.categoria}
                />
              ) : (
                <Box height={180} bgcolor="#f5f5f5" />
              )}
            </Box>
            <CardContent>
              <Typography
                align="center"
                variant="h6"
                fontWeight="600"
                color="text.secondary"
              >
                {prod.categoria}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </Box>
  );
}
