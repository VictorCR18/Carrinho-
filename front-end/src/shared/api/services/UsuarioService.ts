import { CrudService } from "../adapters/CrudService";
import type { Usuario } from "../../../types/types";
import httpClient from "../adapters/HttpClient";

export class UsuarioService extends CrudService<Usuario> {
  constructor() {
    super("/usuarios");
  }

  async registrar(dadosUsuario: Partial<Usuario>) {
    const { data } = await httpClient.post("/usuarios/registrar", dadosUsuario);
    console.log("Resposta do registro:", data);
    return data;
  }

  async login(credenciais: { email: string; senha?: string }) {
    const { data } = await httpClient.post("/usuarios/login", credenciais);
    console.log("Resposta do login:", data);

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
    }

    return data;
  }
}
