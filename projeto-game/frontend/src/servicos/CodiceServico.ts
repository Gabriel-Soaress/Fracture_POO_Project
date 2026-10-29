import { clienteHttp } from "./clienteHttp";
import type { EntradaCodiceDTO } from "../tipos/api";

export class CodiceServico {
  /**
   * Lista todas as entradas da enciclopédia de Vaslen.
   */
  public static async listar(): Promise<EntradaCodiceDTO[]> {
    const resposta = await clienteHttp.get<{ total: number; entradas: EntradaCodiceDTO[] }>("/codice");
    return resposta.entradas || [];
  }

  /**
   * Lista todas as categorias registradas.
   */
  public static async listarCategorias(): Promise<string[]> {
    const resposta = await clienteHttp.get<{ categorias: string[] }>("/codice/categorias");
    return resposta.categorias || [];
  }

  /**
   * Busca uma entrada específica por ID.
   */
  public static async buscarPorId(id: number): Promise<EntradaCodiceDTO> {
    const resposta = await clienteHttp.get<{ entrada: EntradaCodiceDTO }>(`/codice/${id}`);
    return resposta.entrada;
  }
}
