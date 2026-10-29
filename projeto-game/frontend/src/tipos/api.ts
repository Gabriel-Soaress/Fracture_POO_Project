/**
 * Tipos e Interfaces da API de Fracture: The Vaslen Echoes
 * Espelham rigorosamente os DTOs e entidades do Backend (POO)
 */

export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: "JOGADOR" | "ADMIN";
}

export interface RespostaLoginDTO {
  mensagem: string;
  token: string;
  usuario: UsuarioDTO;
}

export type ClasseHeroi = "GUERREIRO" | "MAGO" | "ARQUEIRO";

export interface ItemInventarioDTO {
  id: number;
  nome: string;
  tipo: "POCAO_VIDA" | "ELIXIR_ENERGIA" | "OLEO_DANO" | "ORBE_RELIQUIA";
  valorEfeito: number;
  descricao: string;
}

export interface PersonagemDTO {
  id: number;
  nome: string;
  classeHeroi: ClasseHeroi;
  nivel: number;
  vidaAtual: number;
  vidaMaxima: number;
  energiaAtual: number;
  energiaMaxima: number;
  forca: number;
  defesa: number;
  agilidade: number;
  experienciaAtual: number;
  experienciaNecessaria: number;
  pontosLivres: number;
  ativo: boolean;
  monstrosDerrotados: number[];
  inventario?: ItemInventarioDTO[];
}

export interface CriarPersonagemDTO {
  nome: string;
  classe: ClasseHeroi;
  forca: number;
  defesa: number;
  agilidade: number;
}

export interface DistribuirPontosDTO {
  forcaAdd?: number;
  defesaAdd?: number;
  agilidadeAdd?: number;
}

export type BiomaVaslen =
  | "CRIPTAS"
  | "BOSQUE_SOMBRIO"
  | "LABIRINTO_CINZAS"
  | "PANTANO_PETRIFICANTE"
  | "COLINAS_LUA_SANGUE"
  | "LIMBO_ESPECTRAL"
  | "PINACULO_ECLIPSE";

export interface MonstroMuralDTO {
  id: number;
  nome: string;
  bioma: BiomaVaslen;
  tipoMonstro: string;
  nivel: number;
  vidaMaxima: number;
  energiaMaxima: number;
  forca: number;
  defesa: number;
  agilidade: number;
  experienciaConcedida: number;
  descricaoLore: string;
  status: "DISPONIVEL" | "ELIMINADO";
  loot: {
    id: number;
    nome: string;
    tipo: string;
    descricao: string;
  } | null;
}

export interface MuralBiomaDTO {
  bioma: BiomaVaslen;
  total: number;
  monstros: MonstroMuralDTO[];
}

export interface SessaoCombateInicioDTO {
  sessaoId: string;
  primeiroAJogar: "JOGADOR" | "MONSTRO";
  mensagem: string;
  heroi: {
    id: number;
    nome: string;
    classe: ClasseHeroi;
    nivel: number;
    vidaAtual: number;
    vidaMaxima: number;
    energiaAtual: number;
    energiaMaxima: number;
  };
  monstro: {
    id: number;
    nome: string;
    bioma: BiomaVaslen;
    tipoMonstro: string;
    nivel: number;
    vidaAtual: number;
    vidaMaxima: number;
    energiaAtual: number;
    energiaMaxima: number;
  };
}

export type TipoAcaoCombate = "ATACAR" | "DEFENDER" | "HABILIDADE_ESPECIAL" | "USAR_ITEM";
export type TipoAtaque = "RAPIDO" | "PESADO" | "BRUTAL";

export interface RequisicaoTurnoDTO {
  sessaoId: string;
  acao: {
    tipo: TipoAcaoCombate;
    tipoAtaque?: TipoAtaque;
    indiceItem?: number;
  };
}

export interface ResultadoTurnoDTO {
  rodada: number;
  estado: "EM_ANDAMENTO" | "VITORIA_JOGADOR" | "DERROTA_JOGADOR";
  vidaHeroiAtual: number;
  vidaHeroiMaxima: number;
  energiaHeroiAtual: number;
  energiaHeroiMaxima: number;
  vidaMonstroAtual: number;
  vidaMonstroMaxima: number;
  energiaMonstroAtual: number;
  energiaMonstroMaxima: number;
  logsRodada: string[];
  recompensas?: {
    xpGanho: number;
    subiuNivel: boolean;
    nivelAtual: number;
    itemLoot?: {
      id: number;
      nome: string;
      tipo: string;
      descricao: string;
    };
  };
}

export interface EntradaCodiceDTO {
  id: number;
  titulo: string;
  categoria: "LORE" | "BIOMA" | "MONSTRO" | "ITEM" | "RELIQUIA";
  conteudo: string;
  tags: string[];
}
