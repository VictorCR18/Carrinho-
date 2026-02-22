import { useState, useEffect, type SyntheticEvent } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { TabPanelProps, Usuario } from "../../types/types";
import { UsuarioService } from "../../shared/api/services/UsuarioService";
import { useAuth } from "../../shared/contexts/AuthContext";

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Configuracoes = () => {
  const { logout } = useAuth(); 
  const [tabValue, setTabValue] = useState(0);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [notificacoes, setNotificacoes] = useState(true);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mensagem, setMensagem] = useState({
    open: false,
    texto: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const userJson = localStorage.getItem("usuario");
    if (userJson) {
      const user: Usuario = JSON.parse(userJson);
      setNome(user.nome);
      setEmail(user.email);
    }
  }, []);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const usuarioService = new UsuarioService();

  // --- FUNÇÃO: EDITAR PERFIL ---
  const handleSaveProfile = async () => {
    try {
      await usuarioService.updateProfile({ nome, email });
      setMensagem({
        open: true,
        texto: "Perfil atualizado com sucesso!",
        severity: "success",
      });
    } catch (error: any) {
      setMensagem({
        open: true,
        texto: error.response?.data?.error || "Erro ao atualizar perfil.",
        severity: "error",
      });
    }
  };

  // --- FUNÇÃO: TROCAR SENHA ---
  const handleMudarSenha = async () => {
    if (novaSenha !== confirmarSenha) {
      setMensagem({
        open: true,
        texto: "As senhas não coincidem!",
        severity: "error",
      });
      return;
    }

    try {
      await usuarioService.mudarSenha(senhaAtual, novaSenha);
      setMensagem({
        open: true,
        texto: "Senha alterada com sucesso!",
        severity: "success",
      });
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error: any) {
      setMensagem({
        open: true,
        texto: error.response?.data?.error || "Erro ao alterar senha.",
        severity: "error",
      });
    }
  };

  // --- FUNÇÃO: EXCLUIR CONTA ---
  const handleDeleteAccount = async () => {
    // Usamos confirm apenas para a barreira de segurança, o feedback de erro será no Snackbar
    if (window.confirm("ATENÇÃO: Sua conta será apagada. Deseja continuar?")) {
      try {
        await usuarioService.excluirConta();
        logout(); // Chamando sua função do AuthContext
      } catch (error: any) {
        setMensagem({
          open: true,
          texto: "Não foi possível excluir a conta.",
          severity: "error",
        });
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Configurações
      </Typography>

      <Paper sx={{ width: "100%", boxShadow: 3, borderRadius: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab icon={<PersonOutlineIcon />} label="Perfil" />
          <Tab icon={<LockOutlinedIcon />} label="Segurança" />
          <Tab icon={<DeleteOutlineIcon />} label="Conta" />
        </Tabs>

        {/* ABA PERFIL */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Informações Pessoais
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificacoes}
                  onChange={(e) => setNotificacoes(e.target.checked)}
                />
              }
              label="Receber promoções"
            />
            <Box sx={{ mt: 4 }}>
              <Button variant="contained" onClick={handleSaveProfile}>
                Salvar Alterações
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* ABA SEGURANÇA */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Alterar Senha
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="Senha Atual"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Nova Senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirmar Nova Senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button variant="contained" onClick={handleMudarSenha}>
              Atualizar Senha
            </Button>
          </Box>
        </TabPanel>

        {/* ABA CONTA */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" color="error" gutterBottom>
            Zona de Perigo
          </Typography>
          <Alert severity="warning" sx={{ mb: 3 }}>
            A exclusão é permanente e apagará seu histórico de pedidos.
          </Alert>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteAccount}
          >
            Excluir Minha Conta
          </Button>
        </TabPanel>
      </Paper>

      <Snackbar
        open={mensagem.open}
        autoHideDuration={4000}
        onClose={() => setMensagem({ ...mensagem, open: false })}
      >
        <Alert
          severity={mensagem.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {mensagem.texto}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Configuracoes;
