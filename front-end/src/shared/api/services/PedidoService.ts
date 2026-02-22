import { CrudService } from "../adapters/CrudService";
import type { Pedido } from "../../../types/types";

import httpClient from "../adapters/HttpClient";

export class PedidoService extends CrudService<Pedido> {
  constructor() {
    super("/pedidos");
  }

  async getMeusPedidos(): Promise<Pedido[]> {
    const response = await httpClient.get<Pedido[]>("/pedidos/meus-pedidos");
    return response.data;
  }

  async getDetalhesPedido(id: number): Promise<Pedido> {
    const response = await httpClient.get<Pedido>(`/pedidos/${id}`);
    return response.data;
  }
}

