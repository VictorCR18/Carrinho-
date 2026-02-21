import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import "./styles.scss";

export default function Footer() {
  const anoAtual = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  const rotasOcultas = ["/login", "/admin-login", "/cadastro-usuario"];
  if (rotasOcultas.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="footer footer-container">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={1}
        sx={{ py: 3 }}
      >
        <Typography variant="body2" color="text.secondary">
          © {anoAtual} - Todos os direitos reservados
        </Typography>

        <Button
          size="small"
          variant="text"
          color="inherit"
          startIcon={<LockOutlinedIcon fontSize="small" />}
          onClick={() => navigate("/admin-login")}
          sx={{
            opacity: 0.5,
            textTransform: "none",
            fontSize: "0.8rem",
            "&:hover": { opacity: 1 },
          }}
        >
          Acesso Restrito
        </Button>
      </Box>
    </footer>
  );
}
