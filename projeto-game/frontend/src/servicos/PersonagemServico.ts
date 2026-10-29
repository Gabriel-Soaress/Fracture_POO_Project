import { clienteHttp } from "./clienteHttp";
import type {
  PersonagemDTO,
  CriarPersonagemDTO,
  DistribuirPontosDTO
} from "../tipos/api";

export class PersonagemServico {
  /**
   * Lista todos os heróis ativos associados à conta do jogador (Soft Delete aplicado no backend).
   */
  public static async listarAtivos(): Promise<PersonagemDTO[]> {
    const resposta = await clienteHttp.get<{ total: number; personagens: PersonagemDTO[] }>("/personagens");
    return resposta.personagens || [];
  }

  /**
   * Busca detalhes completos do herói, incluindo inventário de itens e lista de monstros derrotados.
   */
  public static async buscarPorId(id: number): Promise<PersonagemDTO> {
    const resposta = await clienteHttp.get<{ personagem: PersonagemDTO }>(`/personagens/${id}`);
    return resposta.personagem;
  }

  /**
   * Forja um novo herói validando estritamente a soma de 20 pontos de atributos no backend (RN01).
   */
  public static async criar(dados: CriarPersonagemDTO): Promise<PersonagemDTO> {
    const resposta = await clienteHttp.post<{ mensagem: string; personagem: PersonagemDTO }>("/personagens", dados);
    return resposta.personagem;
  }

  /**
   * Distribui pontos residuais obtidos ao subir de nível.
   */
  public static async distribuirPontos(id: number, pontos: DistribuirPontosDTO): Promise<PersonagemDTO> {
    const resposta = await clienteHttp.post<{ mensagem: string; personagem: PersonagemDTO }>(
      `/personagens/${id}/distribuir-pontos`,
      pontos
    );
    return resposta.personagem;
  }

  /**
   * Executa o Soft Delete no personagem (ativo: false), mantendo o histórico de caçadas no banco relacional.
   */
  public static async inativar(id: number): Promise<string> {
    const resposta = await clienteHttp.delete<{ mensagem: string }>(`/personagens/${id}`);
    return resposta.mensagem;
  }
}
