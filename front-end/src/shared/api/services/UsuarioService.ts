import { CrudService } from "../adapters/CrudService";
import type { Usuario } from "../../../types/types";
import httpClient from "../adapters/HttpClient";

export class UsuarioService extends CrudService<Usuario> {
  constructor() {
    super("/usuarios");
  }

  async registrar(dadosUsuario: Partial<Usuario>) {
    const { data } = await httpClient.post("/usuarios/registrar", dadosUsuario);
    return data;
  }

  async login(credenciais: { email: string; senha?: string }) {
    const { data } = await httpClient.post("/usuarios/login", credenciais);

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
    }

    return data;
  }

  async updateProfile(dados: Partial<Usuario>): Promise<Usuario> {
    const response = await httpClient.put<Usuario>("/usuarios/perfil", dados);
    
    if (response.data) {
        localStorage.setItem("usuario", JSON.stringify(response.data));
    }
    
    return response.data;
  }

  async mudarSenha(senhaAtual: string, novaSenha: string): Promise<void> {
    await httpClient.post("/usuarios/mudar-senha", { senhaAtual, novaSenha });
  }

  async excluirConta(): Promise<void> {
    await httpClient.delete("/usuarios/perfil");
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  }
}
