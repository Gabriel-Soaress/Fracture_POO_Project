import { clienteHttp } from "./clienteHttp";
import type { RespostaLoginDTO, UsuarioDTO } from "../tipos/api";

export class AutenticacaoServico {
  public static async cadastrar(nome: string, email: string, senha: string): Promise<{ mensagem: string; usuario: UsuarioDTO }> {
    return clienteHttp.post<{ mensagem: string; usuario: UsuarioDTO }>("/auth/cadastro", {
      nome,
      email,
      senha
    });
  }

  public static async login(email: string, senha: string): Promise<RespostaLoginDTO> {
    const resposta = await clienteHttp.post<RespostaLoginDTO>("/auth/login", {
      email,
      senha
    });

    if (resposta.token) {
      localStorage.setItem("vaslen_token", resposta.token);
    }

    return resposta;
  }

  public static async obterPerfil(): Promise<{ usuario: UsuarioDTO }> {
    return clienteHttp.get<{ usuario: UsuarioDTO }>("/auth/me");
  }

  public static deslogar(): void {
    localStorage.removeItem("vaslen_token");
  }

  public static estaAutenticado(): boolean {
    return !!localStorage.getItem("vaslen_token");
  }
}
