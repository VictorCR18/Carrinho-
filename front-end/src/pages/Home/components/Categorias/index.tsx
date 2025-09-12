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
    <Box px={10} py={4} className="categorias-section">
      <Typography variant="h4" mb={3}>
        Categorias
      </Typography>
      <div className="categorias-grid">
        {categorias.map((prod) => (
          <Card
            key={prod.categoria}
            className="categoria-card"
            onClick={() => navigate(`/produtos?categoria=${prod.categoria}`)}
          >
            {prod.imagem && (
              <CardMedia
                component="img"
                height="200"
                image={prod.imagem}
                alt={prod.categoria}
                sx={{
                  objectFit: "contain",
                  width: "100%",
                  height: 180,
                }}
              />
            )}
            <CardContent>
              <Typography align="center" fontWeight="bold">
                {prod.categoria}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </Box>
  );
}
