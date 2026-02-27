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
      dataLimite.setMonth(dataLimite.getMonth() - 6);
      const pedidosRecentes = await repository.getPedidosAposData(dataLimite);

      const meses = [
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
      const mapaMeses: Record<string, { vendas: number; lucro: number }> = {};

      pedidosRecentes.forEach((pedido) => {
        const mesNome = meses[pedido.criadoEm.getMonth()];
        if (!mapaMeses[mesNome]) mapaMeses[mesNome] = { vendas: 0, lucro: 0 };

        mapaMeses[mesNome].vendas += pedido.total;
        mapaMeses[mesNome].lucro += pedido.total * 0.3;
      });

      const dadosVendasMes = Object.keys(mapaMeses).map((mes) => ({
        nome: mes,
        vendas: mapaMeses[mes].vendas,
        lucro: mapaMeses[mes].lucro,
      }));

      return res.json({
        kpis: {
          vendasTotais: kpis.vendasTotais,
          lucroEstimado: kpis.vendasTotais * 0.3,
          produtosEmEstoque: kpis.produtosEmEstoque,
          itensEmAlerta: kpis.itensEmAlerta,
        },
        produtosMaisVendidos,
        produtosMenosVendidos,
        dadosVendasMes,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao gerar dados do Dashboard" });
    }
  }
}
