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
    const produtosNoEstoque = await prisma.produto.findMany({
      where: { quantidade: { gt: 0 } },
      select: {
        id: true,
        nome: true,
        quantidade: true,
        itens: {
          select: { quantidade: true },
        },
      },
    });

    const produtosComVendas = produtosNoEstoque.map((p) => {
      const totalVendido = p.itens.reduce(
        (soma, item) => soma + item.quantidade,
        0,
      );

      return {
        id: p.id,
        nome: p.nome,
        estoque: p.quantidade,
        vendas: totalVendido,
      };
    });

    produtosComVendas.sort((a, b) => a.vendas - b.vendas);

    return produtosComVendas.slice(0, take);
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
