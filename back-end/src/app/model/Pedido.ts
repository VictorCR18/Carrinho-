import { ItemPedido } from "./ItemPedido";

export interface Pedido {
  id?: number;
  usuarioId: number;
  total: number;
  criadoEm?: Date;
  itens?: ItemPedido[];
}
