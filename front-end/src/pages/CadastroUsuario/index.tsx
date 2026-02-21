import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
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
  PersonAddOutlined,
  PersonOutlined,
  CheckCircleOutline,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import "../Login/styles.scss";

import { UsuarioService } from "../../shared/api/services/UsuarioService";

const usuarioService = new UsuarioService();

// Configurações de animação consistentes com o Login
const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 } 
  },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};


export default function CadastroUsuario() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleCadastro = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await usuarioService.registrar({
        nome,
        email,
        senha: password,
        role: "USER",
      });

      setLoading(false);
      setSuccess(true); 

      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err: any) {
      setLoading(false);
      const mensagemDeErro =
        err.response?.data?.error || "Ocorreu um erro ao criar a conta.";
      setError(mensagemDeErro);
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh", overflow: "hidden" }}>
      
      <Grid
        size={{ xs: 0, sm: 4, md: 7 }}
        sx={{
          display: { xs: "none", sm: "block" },
          backgroundImage: "url(https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070)",
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
            background: `linear-gradient(135deg, ${theme.palette.secondary.dark}cc 0%, ${theme.palette.secondary.main}aa 100%)`,
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
              Junte-se a nós.
            </Typography>
            <Typography variant="h5" fontWeight="300">
              Crie sua conta agora e aproveite as melhores ofertas e novidades da nossa loja.
            </Typography>
          </motion.div>
        </Box>
      </Grid>

      {/* LADO DIREITO: FORMULÁRIO / SUCESSO */}
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
            overflowY: "auto"
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400, p: 4 }}>
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div
                  key="signup-form"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "secondary.main",
                        borderRadius: "50%",
                        mb: 2,
                        boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                      }}
                    >
                      <PersonAddOutlined sx={{ color: "white", fontSize: 32 }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold">Criar Conta</Typography>
                  </Box>

                  <form onSubmit={handleCadastro}>
                    <TextField
                      fullWidth
                      label="Nome Completo"
                      margin="dense"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlined color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="E-mail"
                      margin="dense"
                      required
                      type="email"
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
                      margin="dense"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start"><LockOutlined color="action" /></InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Confirmar Senha"
                      type={showPassword ? "text" : "password"}
                      margin="dense"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {error && (
                      <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                        {error}
                      </Typography>
                    )}

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      color="secondary"
                      sx={{ mt: 3, py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : "Finalizar Cadastro"}
                    </Button>
                  </form>

                  <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                    Já possui uma conta?{" "}
                    <RouterLink to="/login" style={{ fontWeight: "bold", textDecoration: "none", color: theme.palette.secondary.main }}>
                      Faça login
                    </RouterLink>
                  </Typography>
                </motion.div>
              ) : (
                <motion.div
                  key="success-signup"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center" }}
                >
                  <motion.div
                    initial={{ rotate: -45, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <CheckCircleOutline sx={{ fontSize: 100, color: "success.main", mb: 2 }} />
                  </motion.div>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Conta Criada!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Parabéns, <strong>{nome.split(' ')[0]}</strong>! <br />
                    Sua conta foi criada com sucesso. <br />
                    Redirecionando para o login...
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <CircularProgress color="secondary" size={30} />
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Paper>
      </Grid>

      <Snackbar open={success} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
          Cadastro concluído com sucesso!
        </Alert>
      </Snackbar>
    </Grid>
  );
}