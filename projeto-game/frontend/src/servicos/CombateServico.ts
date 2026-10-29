import { clienteHttp } from "./clienteHttp";
import type {
  MuralBiomaDTO,
  SessaoCombateInicioDTO,
  RequisicaoTurnoDTO,
  ResultadoTurnoDTO,
  BiomaVaslen
} from "../tipos/api";

export class CombateServico {
  /**
   * Consulta o mural de caçadas de um determinado bioma, indicando quais monstros já foram eliminados (Anti-Farm).
   */
  public static async obterMural(bioma: BiomaVaslen, personagemId?: number): Promise<MuralBiomaDTO> {
    const query = personagemId ? `?personagemId=${personagemId}` : "";
    return clienteHttp.get<MuralBiomaDTO>(`/combate/mural/${bioma}${query}`);
  }

  /**
   * Inicializa uma sessão de combate por turnos no backend.
   */
  public static async iniciarCombate(personagemId: number, monstroId: number): Promise<SessaoCombateInicioDTO> {
    return clienteHttp.post<SessaoCombateInicioDTO>("/combate/iniciar", {
      personagemId,
      monstroId
    });
  }

  /**
   * Envia a ação do jogador no turno para o MotorCombate e recebe o contra-ataque da IA.
   */
  public static async enviarTurno(requisicao: RequisicaoTurnoDTO): Promise<{ sessaoId: string; resultado: ResultadoTurnoDTO }> {
    return clienteHttp.post<{ sessaoId: string; resultado: ResultadoTurnoDTO }>("/combate/turno", requisicao);
  }

  /**
   * Consulta o estado atual da sessão de combate em andamento.
   */
  public static async obterEstadoSessao(sessaoId: string): Promise<any> {
    return clienteHttp.get<any>(`/combate/sessao/${sessaoId}`);
  }
}
