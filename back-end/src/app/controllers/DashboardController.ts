import { Request, Response } from "express";
import { DashboardRepository } from "../repository/DashboardRepository";

const repository = new DashboardRepository();

export class DashboardController {
  async getResumo(req: Request, res: Response) {
    try {
      const kpis = await repository.getKpis();
      const produtosMaisVendidos = await repository.getProdutosMaisVendidos(5);
      const produtosMenosVendidos =
        await repository.getProdutosMenosVendidos(5);

      const dataLimite = new Date();
      dataLimite.setMonth(dataLimite.getMonth() - 5);
      dataLimite.setDate(1);
      dataLimite.setHours(0, 0, 0, 0);

      const pedidosRecentes = await repository.getPedidosAposData(dataLimite);

      const mesesNome = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];

      const ultimos6Meses: Array<{
        nome: string;
        vendas: number;
        lucro: number;
        volume: number;
      }> = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        ultimos6Meses.push({
          nome: mesesNome[d.getMonth()],
          vendas: 0,
          lucro: 0,
          volume: 0,
        });
      }

      pedidosRecentes.forEach((pedido) => {
        const mesNome = mesesNome[pedido.criadoEm.getMonth()];
        const mesIndex = ultimos6Meses.findIndex((m) => m.nome === mesNome);

        if (mesIndex !== -1) {
          ultimos6Meses[mesIndex].vendas += pedido.total;
          ultimos6Meses[mesIndex].lucro += pedido.total * 0.3;

          const qtdItens = pedido.itens.reduce(
            (acc, item) => acc + item.quantidade,
            0,
          );
          ultimos6Meses[mesIndex].volume += qtdItens;
        }
      });

      return res.json({
        kpis: {
          vendasTotais: kpis.vendasTotais,
          lucroEstimado: kpis.vendasTotais * 0.3,
          produtosEmEstoque: kpis.produtosEmEstoque,
          itensEmAlerta: kpis.itensEmAlerta,
        },
        produtosMaisVendidos,
        produtosMenosVendidos,
        dadosVendasMes: ultimos6Meses,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao gerar dados do Dashboard" });
    }
  }
}
