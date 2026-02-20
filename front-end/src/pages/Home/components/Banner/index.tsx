import { Box, Typography, Button } from "@mui/material";
import "./styles.scss";

export default function Banner() {
  return (
    <Box className="banner-container">
      <Box className="banner-overlay" />
      <Box className="banner-content">
        <Typography variant="h2" className="banner-title">
          Descubra o Melhor
        </Typography>
        <Typography variant="h6" className="banner-subtitle">
          Ofertas exclusivas e qualidade que você merece.
        </Typography>
        <Button
          variant="contained"
          size="large"
          className="banner-button"
          href="#ofertas"
        >
          Ver Ofertas
        </Button>
      </Box>
    </Box>
  );
}
