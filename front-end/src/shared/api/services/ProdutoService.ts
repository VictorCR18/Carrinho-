import { CrudService } from "../adapters/CrudService";
import type { Produto } from "../../../types/types";

import httpClient from "../adapters/HttpClient";

export class ProdutoService extends CrudService<Produto> {
  constructor() {
    super("/produtos");
  }

  async checkout(itens: { id: number; quantidade: number }[]) {
    const { data } = await httpClient.post("/checkout", { itens });
    console.log("Resposta do checkout:", data);
    return data;
  }
}
