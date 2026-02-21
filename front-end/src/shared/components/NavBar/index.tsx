import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Badge,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Typography,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";

import { useCart } from "../../contexts/CardContext";
import { useAuth } from "../../contexts/AuthContext";

import logo from "../../../assets/logo.png";
import "./styles.scss";

export default function NavBar() {
  const { cart } = useCart();
  const { usuario, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Estado para o loading de logout
  const [showLogoutAlert, setShowLogoutAlert] = useState(false); // Estado para o Toast

  const openUserMenu = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // DICA DE OURO: Função de Logout com Feedback
  const handleLogout = async () => {
    setIsLoggingOut(true); // Começa o loading

    // Pequeno delay para o usuário perceber a ação (UX)
    setTimeout(() => {
      logout();
      setIsLoggingOut(false);
      handleCloseMenu();
      setShowLogoutAlert(true); // Ativa o toast de "Até logo"

      // Redireciona após o toast ser disparado
      setTimeout(() => navigate("/"), 500);
    }, 800);
  };

  const rotasOcultas = [
    "/login",
    "/cadastro",
    "/admin-login",
    "/cadastro-usuario",
  ];
  if (rotasOcultas.includes(location.pathname)) {
    return null;
  }

  const isAdminRoute = location.pathname.startsWith("/admin");
  const totalItems = cart.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      className="navbar-container"
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters className="toolbar">
          <Link
            to={isAdminRoute ? "/admin/dashboard" : "/"}
            className="logo-link"
          >
            <img className="logo" src={logo} alt="Logo" />
          </Link>

          <Box className="nav-links">
            {/* ... Seus links de navegação permanecem iguais ... */}
            {isAdminRoute ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className={
                    location.pathname === "/admin/dashboard" ? "active" : ""
                  }
                >
                  Dashboard
                </Link>
                <Link to="/admin/gerenciar-produtos">Gerenciar Produtos</Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={location.pathname === "/" ? "active" : ""}
                >
                  Início
                </Link>
                <Link
                  to="/produtos"
                  className={
                    location.pathname.startsWith("/produtos") ? "active" : ""
                  }
                >
                  Produtos
                </Link>
              </>
            )}
          </Box>

          <Box
            className="cart-action"
            display="flex"
            alignItems="center"
            gap={1}
          >
            {isAdminRoute ? (
              <Button
                variant="outlined"
                color="error"
                size="small"
                disabled={isLoggingOut}
                startIcon={
                  isLoggingOut ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <LogoutIcon />
                  )
                }
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                {isLoggingOut ? "Saindo..." : "Sair do Painel"}
              </Button>
            ) : (
              <>
                <Link to="/carrinho">
                  <IconButton color="primary" size="large">
                    <Badge badgeContent={totalItems} color="error" max={99}>
                      <ShoppingCartOutlinedIcon fontSize="inherit" />
                    </Badge>
                  </IconButton>
                </Link>

                <IconButton
                  color="primary"
                  onClick={handleOpenMenu}
                  size="large"
                >
                  <AccountCircleOutlinedIcon fontSize="inherit" />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={openUserMenu}
                  onClose={handleCloseMenu}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {!isAuthenticated ? (
                    <MenuItem
                      onClick={() => {
                        handleCloseMenu();
                        navigate("/login");
                      }}
                    >
                      <LoginOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                      Entrar
                    </MenuItem>
                  ) : (
                    [
                      <Box key="greeting" sx={{ px: 2, py: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Olá,
                        </Typography>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {usuario?.nome}
                        </Typography>
                      </Box>,
                      <Divider key="divider" />,
                      <MenuItem
                        key="settings"
                        onClick={() => {
                          handleCloseMenu();
                          navigate("/configuracoes");
                        }}
                      >
                        <SettingsOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                        Configurações
                      </MenuItem>,
                      <MenuItem
                        key="logout"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? (
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                        ) : (
                          <LogoutIcon
                            color="error"
                            fontSize="small"
                            sx={{ mr: 1 }}
                          />
                        )}
                        {isLoggingOut ? "Saindo..." : "Sair"}
                      </MenuItem>,
                    ]
                  )}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Snackbar de Logout */}
      <Snackbar
        open={showLogoutAlert}
        autoHideDuration={3000}
        onClose={() => setShowLogoutAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          Sessão encerrada. Até logo!
        </Alert>
      </Snackbar>
    </AppBar>
  );
}
