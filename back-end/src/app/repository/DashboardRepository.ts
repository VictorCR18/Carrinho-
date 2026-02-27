import prisma from "../../config/database/connection";

export class DashboardRepository {
  async getKpis() {
    const totalVendas = await prisma.pedido.aggregate({
      _sum: { total: true },
    });
    const totalPedidos = await prisma.pedido.count();
    const estoqueAgregado = await prisma.produto.aggregate({
      _sum: { quantidade: true },
    });
    const itensEmAlerta = await prisma.produto.count({
      where: { quantidade: { lte: 5 } },
    });

    return {
      vendasTotais: totalVendas._sum.total || 0,
      totalPedidos,
      produtosEmEstoque: estoqueAgregado._sum.quantidade || 0,
      itensEmAlerta,
    };
  }

  async getProdutosMaisVendidos(take: number = 5) {
    const rankingVendas = await prisma.itemPedido.groupBy({
      by: ["produtoId"],
      _sum: { quantidade: true },
      orderBy: { _sum: { quantidade: "desc" } },
      take,
    });

    const produtos = await Promise.all(
      rankingVendas.map(async (item) => {
        const produto = await prisma.produto.findUnique({
          where: { id: item.produtoId },
        });
        return {
          id: produto?.id,
          nome: produto?.nome,
          preco: produto?.preco,
          vendas: item._sum.quantidade || 0,
        };
      }),
    );

    return produtos;
  }

  async getProdutosMenosVendidos(take: number = 5) {
    const produtosMenosVendidos = await prisma.produto.findMany({
      where: { quantidade: { gt: 0 } },
      orderBy: { itens: { _count: "asc" } },
      take,
    });

    const encalhadosFormatados = await Promise.all(
      produtosMenosVendidos.map(async (p) => {
        const somaItens = await prisma.itemPedido.aggregate({
          where: { produtoId: p.id },
          _sum: { quantidade: true },
        });
        return {
          id: p.id,
          nome: p.nome,
          estoque: p.quantidade,
          vendas: somaItens._sum.quantidade || 0,
        };
      }),
    );

    return encalhadosFormatados;
  }

  async getPedidosAposData(dataLimite: Date) {
    return await prisma.pedido.findMany({
      where: { criadoEm: { gte: dataLimite } },
      select: {
        total: true,
        criadoEm: true,
        itens: { select: { quantidade: true } },
      },
    });
  }
}
