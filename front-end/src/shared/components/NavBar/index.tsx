import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Container, Box, Badge, IconButton } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useCart } from "../CardContext";
import logo from "../../../assets/logo.png";
import "./styles.scss";

export default function NavBar() {
  const { cart } = useCart();
  const location = useLocation(); // Usado para saber em qual página estamos

  // Calcula a quantidade total de itens físicos no carrinho (soma as quantidades)
  const totalItems = cart.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <AppBar position="sticky" color="inherit" elevation={0} className="navbar-container">
      <Container maxWidth="lg">
        <Toolbar disableGutters className="toolbar">
          {/* Logo */}
          <Link to="/" className="logo-link">
            <img className="logo" src={logo} alt="Logo" />
          </Link>

          {/* Links de Navegação Centralizados */}
          <Box className="nav-links">
            <Link 
              to="/" 
              className={location.pathname === "/" ? "active" : ""}
            >
              Início
            </Link>
            <Link 
              to="/produtos" 
              className={location.pathname.startsWith("/produtos") ? "active" : ""}
            >
              Produtos
            </Link>
          </Box>

          {/* Ícone do Carrinho com Badge */}
          <Box className="cart-action">
            <Link to="/carrinho">
              <IconButton color="primary" aria-label="carrinho" size="large">
                <Badge badgeContent={totalItems} color="error" max={99}>
                  <ShoppingCartOutlinedIcon fontSize="inherit" />
                </Badge>
              </IconButton>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}