import prisma from "../../config/database/connection";
import { Usuario } from "../model/Usuario";

export class UsuarioRepository {
  async findAll() {
    return prisma.usuario.findMany();
  }

  async findByEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return prisma.usuario.findUnique({ where: { id } });
  }

  async create(data: Omit<Usuario, "id" | "criadoEm" | "atualizadoEm">) {
    return prisma.usuario.create({ data: data as any });
  }

  async update(id: number, data: Usuario) {
    return prisma.usuario.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.usuario.delete({ where: { id } });
  }
}
