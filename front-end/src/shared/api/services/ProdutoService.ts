import { CrudService } from "../adapters/CrudService";
import type { Produto } from "../../../types/types";

export class ProdutoService extends CrudService<Produto> {
  constructor() {
    super("/produtos");
  }
}
