import prisma from "./../../config/database/connection";
import { Produto } from "../model/Produto";

export class ProdutoRepository {
  async findAll() {
    return prisma.produto.findMany();
  }

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
      include: { itens: true },
    });
  }

  async create(data: Produto) {
    return prisma.produto.create({ data });
  }

  async update(id: number, data: Produto) {
    return prisma.produto.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.produto.delete({ where: { id } });
  }
}
