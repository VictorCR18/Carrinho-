import prisma from "../../config/database/connection";

export class PedidoRepository {
  async findByUsuario(usuarioId: number) {
    return prisma.pedido.findMany({
      where: { usuarioId },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: {
        criadoEm: "desc",
      },
    });
  }

  async findById(id: number) {
    return prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });
  }
}
