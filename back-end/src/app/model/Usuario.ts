export type Role = "USER" | "ADMIN";

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  role: Role;
  criadoEm?: string | Date;
  atualizadoEm?: string | Date;
}
