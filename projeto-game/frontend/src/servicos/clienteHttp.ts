/**
 * Cliente HTTP Base para o Frontend de Fracture: The Vaslen Echoes
 * Centraliza requisições Fetch, injeção de Bearer Token JWT e tratamento tipado de erros.
 */

export class ErroHttp extends Error {
  public status: number;
  public dados: any;

  constructor(mensagem: string, status: number, dados?: any) {
    super(mensagem);
    this.name = "ErroHttp";
    this.status = status;
    this.dados = dados;
  }
}

class ClienteHttp {
  private baseUrl: string;

  constructor() {
    this.baseUrl = (import.meta.env.VITE_API_URL as string) || "/api";
  }

  private obterToken(): string | null {
    try {
      return localStorage.getItem("vaslen_token");
    } catch {
      return null;
    }
  }

  private async requisitar<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${caminho}`;
    const token = this.obterToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(opcoes.headers as Record<string, string> || {})
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const resposta = await fetch(url, {
        ...opcoes,
        headers
      });

      const contentType = resposta.headers.get("content-type");
      const dados = contentType && contentType.includes("application/json")
        ? await resposta.json()
        : null;

      if (!resposta.ok) {
        const mensagem = dados?.erro || dados?.mensagem || `Erro na requisição HTTP: ${resposta.statusText} (${resposta.status})`;
        throw new ErroHttp(mensagem, resposta.status, dados);
      }

      return dados as T;
    } catch (erro: any) {
      if (erro instanceof ErroHttp) {
        throw erro;
      }
      throw new ErroHttp(erro.message || "Falha de conexão com os portões de Vaslen.", 0);
    }
  }

  public get<T>(caminho: string): Promise<T> {
    return this.requisitar<T>(caminho, { method: "GET" });
  }

  public post<T>(caminho: string, corpo?: any): Promise<T> {
    return this.requisitar<T>(caminho, {
      method: "POST",
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined
    });
  }

  public put<T>(caminho: string, corpo?: any): Promise<T> {
    return this.requisitar<T>(caminho, {
      method: "PUT",
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined
    });
  }

  public delete<T>(caminho: string): Promise<T> {
    return this.requisitar<T>(caminho, { method: "DELETE" });
  }
}

export const clienteHttp = new ClienteHttp();
