import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  TrendingUp,
  AttachMoney,
  Inventory,
  WarningAmber,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 1. Importando o Service que criamos
import { DashboardService } from "../../shared/api/services/DashboardService";
import type { DashboardData } from "../../types/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Dashboard() {
  const theme = useTheme();

  // 2. Criando os estados para guardar os dados da API
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<DashboardData>({
    kpis: {
      vendasTotais: 0,
      lucroEstimado: 0,
      produtosEmEstoque: 0,
      itensEmAlerta: 0,
    },
    produtosMaisVendidos: [],
    produtosMenosVendidos: [],
    dadosVendasMes: [],
  });

  const dashboardService = new DashboardService();

  // 3. Buscando os dados quando a tela carrega
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resposta = await dashboardService.getDados();
        setDados(resposta);
      } catch (error) {
        console.error("Erro ao carregar os dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // 4. Tela de loading enquanto espera o banco responder
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        py: 6,
        px: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Typography
              variant="h4"
              fontWeight="800"
              color="text.primary"
              mb={1}
            >
              Visão Geral
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Acompanhe as métricas e o desempenho da sua loja.
            </Typography>
          </motion.div>

          <Grid container spacing={3} mb={6}>
            {[
              {
                titulo: "Vendas Totais",
                // Formatando para Moeda Brasileira (BRL)
                valor: dados.kpis.vendasTotais.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }),
                icone: <TrendingUp />,
                cor: theme.palette.primary.main,
              },
              {
                titulo: "Lucro Estimado",
                valor: dados.kpis.lucroEstimado.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }),
                icone: <AttachMoney />,
                cor: theme.palette.success.main,
              },
              {
                titulo: "Produtos em Estoque",
                valor: dados.kpis.produtosEmEstoque.toString(),
                icone: <Inventory />,
                cor: theme.palette.info.main,
              },
              {
                titulo: "Itens em Alerta",
                valor: dados.kpis.itensEmAlerta.toString(),
                icone: <WarningAmber />,
                cor: theme.palette.warning.main,
              },
            ].map((kpi, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    elevation={0}
                    sx={{ borderRadius: 3, border: "1px solid #e2e8f0" }}
                  >
                    <CardContent
                      sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: `${kpi.cor}20`,
                          color: kpi.cor,
                          width: 56,
                          height: 56,
                        }}
                      >
                        {kpi.icone}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="bold"
                        >
                          {kpi.titulo}
                        </Typography>
                        <Typography
                          variant="h5"
                          fontWeight="800"
                          color="text.primary"
                        >
                          {kpi.valor}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* 2. ÁREA DOS GRÁFICOS */}
          <Grid container spacing={3} mb={6}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <motion.div variants={itemVariants} style={{ height: "100%" }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                    height: "100%",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Receita e Lucro (Últimos Meses)
                  </Typography>
                  <Box sx={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart
                        data={dados.dadosVendasMes} // DADOS REAIS
                        margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e0e0e0"
                        />
                        <XAxis
                          dataKey="nome"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `R$${value}`}
                          width={80}
                        />
                        <Tooltip cursor={{ fill: "transparent" }} />
                        <Line
                          type="monotone"
                          dataKey="vendas"
                          name="Vendas"
                          stroke={theme.palette.primary.main}
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="lucro"
                          name="Lucro"
                          stroke={theme.palette.success.main}
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <motion.div variants={itemVariants} style={{ height: "100%" }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                    height: "100%",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Volume de Vendas
                  </Typography>
                  <Box sx={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={dados.dadosVendasMes} // DADOS REAIS
                        margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="nome"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} width={50} />
                        <Tooltip cursor={{ fill: "#f5f5f5" }} />
                        <Bar
                          dataKey="vendas"
                          name="Qtd. Vendida"
                          fill={theme.palette.primary.light}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                  }}
                >
                  <Box p={2} bgcolor={`${theme.palette.success.main}15`}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="success.dark"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <ArrowUpward fontSize="small" /> Produtos Mais Vendidos
                    </Typography>
                  </Box>
                  <List disablePadding>
                    {dados.produtosMaisVendidos.map((prod, index) => (
                      <div key={prod.id}>
                        <ListItem sx={{ py: 2 }}>
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor: "primary.main",
                                fontWeight: "bold",
                              }}
                            >
                              {index + 1}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography fontWeight="bold">
                                {prod.nome}
                              </Typography>
                            }
                            secondary={`Preço: R$ ${Number(prod.preco).toFixed(2)}`}
                          />
                          <Typography
                            variant="h6"
                            color="success.main"
                            fontWeight="bold"
                          >
                            {prod.vendas} un
                          </Typography>
                        </ListItem>
                        {index < dados.produtosMaisVendidos.length - 1 && (
                          <Divider />
                        )}
                      </div>
                    ))}
                    {dados.produtosMaisVendidos.length === 0 && (
                      <Typography
                        textAlign="center"
                        p={3}
                        color="text.secondary"
                      >
                        Nenhuma venda registrada.
                      </Typography>
                    )}
                  </List>
                </Paper>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                  }}
                >
                  <Box p={2} bgcolor={`${theme.palette.error.main}15`}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="error.dark"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <ArrowDownward fontSize="small" /> Produtos Encalhados
                    </Typography>
                  </Box>
                  <List disablePadding>
                    {dados.produtosMenosVendidos.map((prod, index) => (
                      <div key={prod.id}>
                        <ListItem sx={{ py: 2 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "error.main" }}>
                              <WarningAmber fontSize="small" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography fontWeight="bold">
                                {prod.nome}
                              </Typography>
                            }
                            secondary={`Estoque parado: ${prod.estoque} unidades`}
                          />
                          <Typography
                            variant="h6"
                            color="error.main"
                            fontWeight="bold"
                          >
                            {prod.vendas} un vendidas
                          </Typography>
                        </ListItem>
                        {index < dados.produtosMenosVendidos.length - 1 && (
                          <Divider />
                        )}
                      </div>
                    ))}
                    {dados.produtosMenosVendidos.length === 0 && (
                      <Typography
                        textAlign="center"
                        p={3}
                        color="text.secondary"
                      >
                        Nenhum produto encalhado!
                      </Typography>
                    )}
                  </List>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
