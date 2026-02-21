import { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Grid,
  CircularProgress,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  CheckCircleOutline,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.scss";

import { UsuarioService } from "../../shared/api/services/UsuarioService";
import { useAuth } from "../../shared/contexts/AuthContext";

const usuarioService = new UsuarioService();

const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 },
  },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { login } = useAuth();

  const isAdminFlow = location.pathname.includes("admin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await usuarioService.login({ email, senha: password });
      const usuarioLogado = response.usuario;

      if (isAdminFlow && usuarioLogado.role !== "ADMIN") {
        setError("Acesso negado. Credenciais de administrador exigidas.");
        setLoading(false);
        return;
      }

      login(usuarioLogado, response.token);

      setLoading(false);
      setSuccess(true); // Ativa a animação de sucesso

      // Delay para o usuário sentir o feedback antes de mudar de página
      setTimeout(() => {
        if (isAdminFlow || usuarioLogado.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }, 2000);
    } catch (err: any) {
      setLoading(false);
      const mensagemDeErro =
        err.response?.data?.error ||
        "Ocorreu um erro ao fazer login. Tente novamente.";
      setError(mensagemDeErro);
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{ height: "100vh", overflow: "hidden" }}
    >
      {/* LADO ESQUERDO: IMAGEM/BANNER */}
      <Grid
        size={{ xs: 0, sm: 4, md: 7 }}
        sx={{
          display: { xs: "none", sm: "block" },
          backgroundImage:
            "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark}cc 0%, ${theme.palette.primary.main}aa 100%)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: 8,
            color: "white",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" fontWeight="800" gutterBottom>
              {isAdminFlow
                ? "Painel de Controle"
                : "Sua próxima compra começa aqui."}
            </Typography>
            <Typography variant="h5" fontWeight="300">
              {isAdminFlow
                ? "Gestão simplificada para resultados extraordinários."
                : "Acesse sua conta e confira as ofertas exclusivas que separamos para você."}
            </Typography>
          </motion.div>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, sm: 8, md: 5 }}>
        <Paper
          elevation={0}
          square
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400, p: 4 }}>
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div
                  key="login-form"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 4,
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: isAdminFlow ? "error.main" : "primary.main",
                        borderRadius: "50%",
                        mb: 2,
                        boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                      }}
                    >
                      <LockOutlined sx={{ color: "white", fontSize: 32 }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold">
                      {isAdminFlow ? "Admin Login" : "Login"}
                    </Typography>
                  </Box>

                  <form onSubmit={handleLogin}>
                    <TextField
                      fullWidth
                      label="E-mail"
                      variant="outlined"
                      margin="normal"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Senha"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      margin="normal"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {error && (
                      <Typography
                        color="error"
                        variant="body2"
                        sx={{ mt: 2, textAlign: "center" }}
                      >
                        {error}
                      </Typography>
                    )}

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      color={isAdminFlow ? "error" : "primary"}
                      sx={{
                        mt: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </form>

                  {!isAdminFlow && (
                    <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                      Novo por aqui?{" "}
                      <RouterLink
                        to="/cadastro-usuario"
                        style={{
                          fontWeight: "bold",
                          textDecoration: "none",
                          color: theme.palette.primary.main,
                        }}
                      >
                        Crie uma conta
                      </RouterLink>
                    </Typography>
                  )}

                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => navigate("/")}
                    sx={{
                      mt: 2,
                      textTransform: "none",
                      color: "text.secondary",
                    }}
                  >
                    Voltar para a loja
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="success-animation"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center" }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <CheckCircleOutline
                      sx={{ fontSize: 100, color: "success.main", mb: 2 }}
                    />
                  </motion.div>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Bem-vindo!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Login realizado com sucesso. <br />
                    Estamos te redirecionando...
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <CircularProgress size={20} thickness={5} />
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Paper>
      </Grid>

      <Snackbar
        open={success}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
          Autenticado com sucesso!
        </Alert>
      </Snackbar>
    </Grid>
  );
}
