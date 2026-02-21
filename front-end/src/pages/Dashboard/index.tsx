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

const dadosVendasMes = [
  { nome: "Jan", vendas: 4000, lucro: 2400 },
  { nome: "Fev", vendas: 3000, lucro: 1398 },
  { nome: "Mar", vendas: 2000, lucro: 9800 },
  { nome: "Abr", vendas: 2780, lucro: 3908 },
  { nome: "Mai", vendas: 1890, lucro: 4800 },
  { nome: "Jun", vendas: 2390, lucro: 3800 },
  { nome: "Jul", vendas: 3490, lucro: 4300 },
];

const produtosMaisVendidos = [
  { id: 1, nome: "Smartphone X", vendas: 124, preco: 2999 },
  { id: 2, nome: "Fritadeira AirFryer", vendas: 98, preco: 450 },
  { id: 3, nome: "Fone Bluetooth", vendas: 85, preco: 150 },
];

const produtosMenosVendidos = [
  { id: 4, nome: "Capa de Chuva", vendas: 2, estoque: 50 },
  { id: 5, nome: "Acessório Obsoleto", vendas: 1, estoque: 15 },
  { id: 6, nome: "Produto Teste", vendas: 0, estoque: 5 },
];

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
                valor: "R$ 45.231",
                icone: <TrendingUp />,
                cor: theme.palette.primary.main,
              },
              {
                titulo: "Lucro Estimado",
                valor: "R$ 12.450",
                icone: <AttachMoney />,
                cor: theme.palette.success.main,
              },
              {
                titulo: "Produtos em Estoque",
                valor: "1.204",
                icone: <Inventory />,
                cor: theme.palette.info.main,
              },
              {
                titulo: "Itens em Alerta",
                valor: "12",
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
            {/* Gráfico de Vendas (Linha) */}
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
                        data={dadosVendasMes}
                        // 1. Aumentamos a margem 'left' para 20
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
                        data={dadosVendasMes}
                        margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="nome"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          width={50} // 2. ADICIONADO: Garante que os números puros caibam
                        />
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
                    {produtosMaisVendidos.map((prod, index) => (
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
                            secondary={`Preço: R$ ${prod.preco.toFixed(2)}`}
                          />
                          <Typography
                            variant="h6"
                            color="success.main"
                            fontWeight="bold"
                          >
                            {prod.vendas} un
                          </Typography>
                        </ListItem>
                        {index < produtosMaisVendidos.length - 1 && <Divider />}
                      </div>
                    ))}
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
                    {produtosMenosVendidos.map((prod, index) => (
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
                            {prod.vendas} un
                          </Typography>
                        </ListItem>
                        {index < produtosMenosVendidos.length - 1 && (
                          <Divider />
                        )}
                      </div>
                    ))}
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
