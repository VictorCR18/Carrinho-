import { useEffect, useState } from "react";
import { PedidoService } from "../../shared/api/services/PedidoService";
import type { Pedido } from "../../types/types";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";

const HistoricoCompras = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  const pedidoService = new PedidoService();

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const dados = await pedidoService.getMeusPedidos();
        setPedidos(dados);
      } catch (error) {
        console.error("Erro ao carregar pedidos", error);
      } finally {
        setLoading(false);
      }
    };

    carregarHistorico();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Meu Histórico de Compras
      </Typography>

      {pedidos.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Você ainda não realizou nenhuma compra.
        </Typography>
      ) : (
        pedidos.map((pedido) => (
          <Card key={pedido.id} sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Pedido #{pedido.id}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {new Date(pedido.criadoEm).toLocaleDateString("pt-BR")}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {pedido.itens.map((item) => (
                <Box
                  key={item.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <img
                      src={item.produto.imagem}
                      alt={item.produto.nome}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                    <Box>
                      <Typography variant="body1">
                        {item.produto.nome}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Qtd: {item.quantidade} x R${" "}
                        {item.precoUnitario.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" fontWeight="medium">
                    R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ mt: 2, mb: 1 }} />

              <Box display="flex" justifyContent="flex-end">
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Total: R$ {pedido.total.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default HistoricoCompras;
