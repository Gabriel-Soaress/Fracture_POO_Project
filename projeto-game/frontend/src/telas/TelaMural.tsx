import { useState, useEffect, type FC } from "react";
import { useJogo } from "../contextos/JogoContext";
import { CombateServico } from "../servicos/CombateServico";
import { ErroHttp } from "../servicos/clienteHttp";
import { FundoBiomaPixel } from "../componentes/FundoBiomaPixel";
import { SpriteAnimado } from "../componentes/SpriteAnimado";
import { SPRITES_MONSTROS, SPRITES_HEROIS } from "../dados/catalogoSprites";
import {
  IconeEspada,
  IconeItemPixel,
  BadgeAtributosItem,
  IconeCaveira
} from "../componentes/IconesPixelArt";
import type { BiomaVaslen, MonstroMuralDTO } from "../tipos/api";

interface PropsTelaMural {
  aoVoltarAoHub: () => void;
  aoIniciarCombate: () => void;
}

interface RegiaoCampanha {
  etapa: number;
  id: BiomaVaslen;
  nome: string;
  subtitulo: string;
  icone: string;
  nivelMinimo: number; // Nível do monstro mais fraco da região
  monsterIds: [number, number, number];
  monstroGuiaId: number;
  // Coordenadas em % no tabuleiro do Mapa Mundi (espaçadas em curva S ascendente)
  leftPct: number;
  topPct: number;
  // Coordenadas equivalentes no grid 320x200 do fundo pixel art
  px: number;
  py: number;
  corBorda: string;
  corRocha1: string;
  corRocha2: string;
  corCosta: string;
  loreCanonica: {
    resumo: string;
    detalhe: string;
    perigo: string;
  };
}

// 7 Regiões de Vaslen em progressão suave do Sudoeste (Nv. 1+) ao Topo Nordeste (Nv. 10+ Chefe)
const REGIOES_VASLEN: RegiaoCampanha[] = [
  {
    etapa: 1,
    id: "CRIPTAS",
    nome: "Criptas de Vaslen",
    subtitulo: "Catacumbas Ancestrais da Capital",
    icone: "🪦",
    nivelMinimo: 1,
    monsterIds: [1, 2, 3],
    monstroGuiaId: 1,
    leftPct: 16,
    topPct: 78,
    px: 51,
    py: 156,
    corBorda: "#64748b",
    corRocha1: "#334155",
    corRocha2: "#1e293b",
    corCosta: "#38bdf8",
    loreCanonica: {
      resumo: "Ponto de partida da jornada. As catacumbas sob a antiga capital onde a Névoa despertou ossadas milenares.",
      detalhe: "O antigo feudo imperial agora jaz submerso em túmulos. A infiltração contínua da Névoa reanima guerreiros, arqueiros e paladinos caídos que marcham em vigília sem fim.",
      perigo: "Guerreiros ósseos imunes ao medo armados com lanças e espadas enferrujadas."
    }
  },
  {
    etapa: 2,
    id: "BOSQUE_SOMBRIO",
    nome: "O Bosque Sombrio",
    subtitulo: "Clareiras Tribais e Raízes Negras",
    icone: "🌲",
    nivelMinimo: 3,
    monsterIds: [4, 5, 6],
    monstroGuiaId: 4,
    leftPct: 50,
    topPct: 76,
    px: 160,
    py: 152,
    corBorda: "#10b981",
    corRocha1: "#065f46",
    corRocha2: "#064e3b",
    corCosta: "#34d399",
    loreCanonica: {
      resumo: "Bosque outrora druídico, hoje tomado por espinheiros vorazes e clãs de sátiros cruéis.",
      detalhe: "Outrora refúgio sagrado, este bosque foi estrangulado por raízes carnívoras da Fratura. Clãs de sátiros emboscam viajantes utilizando lâminas venenosas e rituais xamânicos.",
      perigo: "Emboscadas velozes na folhagem densa e feitiços rústicos que drenam energia."
    }
  },
  {
    etapa: 3,
    id: "LABIRINTO_CINZAS",
    nome: "Labirinto de Cinzas",
    subtitulo: "Cânions Basálticos e Forjas de Lava",
    icone: "🔥",
    nivelMinimo: 5,
    monsterIds: [7, 8, 9],
    monstroGuiaId: 7,
    leftPct: 84,
    topPct: 72,
    px: 269,
    py: 144,
    corBorda: "#f97316",
    corRocha1: "#7c2d12",
    corRocha2: "#431407",
    corCosta: "#fb923c",
    loreCanonica: {
      resumo: "Desfiladeiros de rocha vulcânica cercados por rios de magma e governados por minotauros colossais.",
      detalhe: "Corredores ardentes esculpidos em pedra de basalto negro. Minotauros forjam armaduras pesadas no calor do magma e esmagam invasores com machados monumentais.",
      perigo: "Força física brutal capaz de pulverizar escudos pesados e abrir fissuras de cinzas."
    }
  },
  {
    etapa: 4,
    id: "PANTANO_PETRIFICANTE",
    nome: "Pântano Petrificante",
    subtitulo: "Manguezal Tóxico do Olhar de Pedra",
    icone: "🐍",
    nivelMinimo: 7,
    monsterIds: [10, 11, 12],
    monstroGuiaId: 10,
    leftPct: 67,
    topPct: 45,
    px: 214,
    py: 90,
    corBorda: "#84cc16",
    corRocha1: "#3f6212",
    corRocha2: "#1a2e05",
    corCosta: "#a3e635",
    loreCanonica: {
      resumo: "Águas lodosas pontilhadas de estátuas de guerreiros petrificados pelo olhar das górgones.",
      detalhe: "Manguezais venenosos alimentados por miasmas arcanos. Os guerreiros que adentram o lodo encontram companheiros transformados em calcário pelas Matriarcas Górgones.",
      perigo: "Veneno paralítico e magias petrificantes que reduzem drasticamente a mobilidade."
    }
  },
  {
    etapa: 5,
    id: "COLINAS_LUA_SANGUE",
    nome: "Colinas da Lua de Sangue",
    subtitulo: "Cordilheira Escarpada dos Licantropos",
    icone: "🌕",
    nivelMinimo: 8,
    monsterIds: [13, 14, 15],
    monstroGuiaId: 13,
    leftPct: 24,
    topPct: 44,
    px: 77,
    py: 88,
    corBorda: "#f43f5e",
    corRocha1: "#881337",
    corRocha2: "#4c0519",
    corCosta: "#fb7185",
    loreCanonica: {
      resumo: "Picos rochosos iluminados pelo brilho rubro da lua partida, lar das alcateias de lobisomens albinos.",
      detalhe: "As cristas montanhosas ficam sob o foco direto da lua fragmentada. Alcateias ferozes lideradas pelo Alfa Albino caçam sem cessar qualquer criatura de sangue quente.",
      perigo: "Feras com reflexos sobre-humanos, sangramentos profundos e ataques críticos letais."
    }
  },
  {
    etapa: 6,
    id: "LIMBO_ESPECTRAL",
    nome: "Limbo Espectral",
    subtitulo: "Fissuras Cósmicas e Fogos-Fátuos",
    icone: "👻",
    nivelMinimo: 9,
    monsterIds: [16, 17, 18],
    monstroGuiaId: 16,
    leftPct: 42,
    topPct: 16,
    px: 134,
    py: 32,
    corBorda: "#818cf8",
    corRocha1: "#312e81",
    corRocha2: "#1e1b4b",
    corCosta: "#6366f1",
    loreCanonica: {
      resumo: "Garganta etérea antes da fortaleza suprema, onde espíritos e aparições incorpóreas desafiam a gravidade.",
      detalhe: "Região onde o tecido da realidade colapsou. Labaredas azuis de fogo-fátuo flutuam no vácuo, e os lamentos dos que pereceram na Fratura ganham forma em entidades espectrais vingativas.",
      perigo: "Ataques psíquicos e chamas espirituais que ignoram defesas físicas de metal."
    }
  },
  {
    etapa: 7,
    id: "PINACULO_ECLIPSE",
    nome: "Pináculo do Eclipse",
    subtitulo: "Santuário Sagrado da Soberana Kitsune",
    icone: "⚡",
    nivelMinimo: 10,
    monsterIds: [19, 20, 21],
    monstroGuiaId: 21,
    leftPct: 82,
    topPct: 15,
    px: 262,
    py: 30,
    corBorda: "#facc15",
    corRocha1: "#581c87",
    corRocha2: "#3b0764",
    corCosta: "#fde047",
    loreCanonica: {
      resumo: "O zênite proibido de Vaslen. No topo da montanha sagrada, a Kitsune Soberana dos Nove Ecos aguarda sob o eclipse.",
      detalhe: "Santuário ancestral esculpido no topo inalcançável do mundo. Sob um eclipse solar permanente, demônios Tengu e a Kitsune Ancestral guardam a última centelha de Vaslen.",
      perigo: "Poder divino transcendental, ilusões devastadoras e dano arcano irresistível."
    }
  }
];

/**
 * Gera blocos pixelados (4x4 na malha 320x200) para construir pontes/trilhas de pedra
 * em pixel art autêntico entre duas ilhas consecutivas.
 */
function gerarBlocosTrilhaPixel(x1: number, y1: number, x2: number, y2: number) {
  const passos = 14;
  const blocos: { x: number; y: number; principal: boolean }[] = [];
  for (let i = 1; i < passos; i++) {
    const t = i / passos;
    // Snap na grade de 2px para visual 100% pixelado
    const bx = Math.round((x1 + (x2 - x1) * t) / 2) * 2;
    const by = Math.round((y1 + (y2 - y1) * t) / 2) * 2;
    blocos.push({ x: bx, y: by, principal: i % 2 === 0 });
  }
  return blocos;
}

export const TelaMural: FC<PropsTelaMural> = ({ aoVoltarAoHub, aoIniciarCombate }) => {
  const { heroiAtivo, biomaAtual, setBiomaAtual, setSessaoCombate } = useJogo();

  const [regiaoFocoId, setRegiaoFocoId] = useState<BiomaVaslen>(biomaAtual || "CRIPTAS");
  const [emExpedicao, setEmExpedicao] = useState<boolean>(false);

  const [monstros, setMonstros] = useState<MonstroMuralDTO[]>([]);
  const [carregandoMonstros, setCarregandoMonstros] = useState<boolean>(false);
  const [iniciandoDueloId, setIniciandoDueloId] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregarMonstrosRegiao = async (bioma: BiomaVaslen) => {
    setCarregandoMonstros(true);
    setErro(null);
    try {
      const resposta = await CombateServico.obterMural(bioma, heroiAtivo?.id);
      setMonstros(resposta.monstros);
    } catch (err: any) {
      setErro(err instanceof ErroHttp ? err.message : "Falha ao consultar criaturas da região.");
    } finally {
      setCarregandoMonstros(false);
    }
  };

  useEffect(() => {
    if (emExpedicao) {
      carregarMonstrosRegiao(regiaoFocoId);
    }
  }, [emExpedicao, regiaoFocoId, heroiAtivo?.id]);

  const entrarNaRegiao = (bioma: BiomaVaslen) => {
    setRegiaoFocoId(bioma);
    setBiomaAtual(bioma);
    setEmExpedicao(true);
  };

  const selecionarOuEntrar = (bioma: BiomaVaslen) => {
    if (regiaoFocoId === bioma) {
      entrarNaRegiao(bioma);
    } else {
      setRegiaoFocoId(bioma);
      setBiomaAtual(bioma);
    }
  };

  const retornarAoMapaCampanha = () => {
    setEmExpedicao(false);
  };

  const desafiarMonstro = async (monstroId: number) => {
    if (!heroiAtivo) return;
    setIniciandoDueloId(monstroId);
    setErro(null);

    try {
      const sessao = await CombateServico.iniciarCombate(heroiAtivo.id, monstroId);
      setSessaoCombate(sessao);
      aoIniciarCombate();
    } catch (err: any) {
      setErro(err instanceof ErroHttp ? err.message : "Não foi possível desafiar esta criatura.");
      setIniciandoDueloId(null);
    }
  };

  const regiaoFoco = REGIOES_VASLEN.find(r => r.id === regiaoFocoId) || REGIOES_VASLEN[0];
  const nivelHeroi = heroiAtivo?.nivel ?? 1;
  const monstrosDerrotadosGerais = heroiAtivo?.monstrosDerrotados ?? [];
  const totalGeralMortos = monstrosDerrotadosGerais.length;

  const obterProgressoRegiao = (regiao: RegiaoCampanha) => {
    const mortos = regiao.monsterIds.filter(id => monstrosDerrotadosGerais.includes(id)).length;
    return {
      mortos,
      total: 3,
      pacificada: mortos === 3
    };
  };

  const classeHeroi = heroiAtivo?.classeHeroi || "GUERREIRO";
  const animHeroiIdle = (SPRITES_HEROIS[classeHeroi] ?? SPRITES_HEROIS.GUERREIRO).idle;

  // =========================================================================
  // VISTA 2: EXPEDIÇÃO INTERNA NA REGIÃO (EXIBE OS 3 MONSTROS DO BIOMA)
  // =========================================================================
  if (emExpedicao) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Barra Superior da Expedição */}
        <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-3">
          <button
            onClick={retornarAoMapaCampanha}
            className="pixel-btn text-xs py-2 px-3.5 flex items-center gap-2"
          >
            <span>🗺️</span> VOLTAR AO MAPA MUNDI
          </button>

          <div className="flex items-center gap-2">
            <span className="font-pixel text-[10px] px-2 py-1 bg-amber-950/80 text-[var(--accent-gold)] border border-[var(--accent-gold)]">
              REGIÃO {regiaoFoco.etapa} DE 7
            </span>
            <span className="font-pixel text-xs text-[var(--accent-gold-light)]">
              {regiaoFoco.nome.toUpperCase()}
            </span>
            <span className="font-silkscreen text-[10px] px-2 py-0.5 bg-black/60 border border-[var(--border-card)] text-slate-300">
              NV. {regiaoFoco.nivelMinimo}+
            </span>
          </div>
        </div>

        {erro && (
          <div className="p-4 pixel-box bg-red-950/80 border-2 border-red-700 text-red-300 font-silkscreen text-xs">
            ⚠️ {erro}
          </div>
        )}

        {/* Banner Ilustrado do Bioma com Fundo Pixel Art e Lore Canônica */}
        <div className="relative border-4 border-[var(--border-card)] min-h-[200px] p-6 flex flex-col justify-between overflow-hidden shadow-pixel">
          <div className="absolute inset-0 pointer-events-none">
            <FundoBiomaPixel bioma={regiaoFoco.id} />
          </div>

          <div className="relative z-10 bg-black/85 p-4 border-2 border-[var(--border-card)] max-w-3xl">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-2xl">{regiaoFoco.icone}</span>
              <div>
                <h2 className="font-pixel text-sm md:text-base text-[var(--accent-gold-light)]">
                  {regiaoFoco.nome}
                </h2>
                <span className="font-silkscreen text-[11px] text-[var(--text-muted)]">
                  {regiaoFoco.subtitulo}
                </span>
              </div>
            </div>

            <p className="font-medieval text-sm md:text-base text-[var(--text-primary)] leading-relaxed mt-2">
              "{regiaoFoco.loreCanonica.detalhe}"
            </p>

            <div className="mt-3 pt-2 border-t border-[var(--border-card)] flex flex-wrap items-center justify-between gap-2 text-xs font-silkscreen">
              <span className="text-amber-400">
                ⚠️ Ameaça Local: {regiaoFoco.loreCanonica.perigo}
              </span>
              <span className="text-[var(--accent-gold)]">
                Nível da Região (Monstro mais fraco): Nv. {regiaoFoco.nivelMinimo}
              </span>
            </div>
          </div>
        </div>

        {/* Os 3 Monstros Únicos da Região */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-pixel text-xs md:text-sm text-[var(--accent-gold-light)] flex items-center gap-2">
              <IconeEspada tamanho={18} /> CRIATURAS DESTA REGIÃO
            </h3>
            <span className="font-silkscreen text-[11px] text-[var(--text-muted)]">
              Derrote todas as 3 criaturas para deixar esta região pacificada (cinza) no mapa
            </span>
          </div>

          {carregandoMonstros ? (
            <div className="p-12 pixel-box bg-[var(--bg-panel)] text-center">
              <p className="font-pixel text-xs text-[var(--accent-gold)] animate-pulse">
                Explorando {regiaoFoco.nome} e rastreando criaturas...
              </p>
            </div>
          ) : monstros.length === 0 ? (
            <div className="p-8 pixel-box bg-[var(--bg-panel)] text-center">
              <p className="font-medieval text-base text-[var(--text-muted)]">
                Nenhuma criatura avistada neste setor.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {monstros.map(monstro => {
                const derrotado = monstro.status === "ELIMINADO";
                const carregandoEste = iniciandoDueloId === monstro.id;

                return (
                  <div
                    key={monstro.id}
                    className={`pixel-box p-5 bg-[var(--bg-panel)] border-2 transition-all flex flex-col justify-between ${
                      derrotado
                        ? "grayscale opacity-60 border-slate-700 bg-slate-950/70"
                        : "border-[var(--border-card)] hover:border-[var(--accent-gold)] shadow-pixel"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-2 mb-3">
                        <div>
                          <h4 className="font-pixel text-xs text-[var(--accent-gold-light)] truncate max-w-[170px]">
                            {monstro.nome}
                          </h4>
                          <span className="font-silkscreen text-[10px] text-[var(--text-muted)]">
                            {monstro.tipoMonstro}
                          </span>
                        </div>
                        <span
                          className={`font-pixel text-[8.5px] px-2 py-0.5 border ${
                            derrotado
                              ? "bg-slate-900 text-slate-400 border-slate-700"
                              : "bg-red-950 text-red-300 border-red-700"
                          }`}
                        >
                          NV. {monstro.nivel}
                        </span>
                      </div>

                      <div className="h-32 bg-[var(--bg-subcard)] border border-[var(--border-card)] mb-4 flex items-center justify-center overflow-hidden relative">
                        <div className="transform scale-[1.5] origin-bottom mt-6">
                          <SpriteAnimado
                            anim={SPRITES_MONSTROS[monstro.id]?.idle ?? SPRITES_MONSTROS[1].idle}
                            loop
                          />
                        </div>
                        {derrotado && (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                            <span className="font-pixel text-xs px-2.5 py-1 bg-slate-900 border-2 border-slate-600 text-slate-300 rotate-[-8deg] shadow-pixel">
                              🛡️ EXPURGADO
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="font-medieval text-xs text-[var(--text-muted)] line-clamp-2 italic mb-3">
                        "{monstro.descricaoLore}"
                      </p>

                      <div className="grid grid-cols-3 gap-1.5 p-2 bg-[var(--bg-subcard)] border border-[var(--border-card)] text-center font-silkscreen text-[10px] mb-3">
                        <div>
                          <span className="text-rose-400 block font-bold">HP</span>
                          <span className="text-[var(--text-primary)]">{monstro.vidaMaxima}</span>
                        </div>
                        <div>
                          <span className="text-red-400 block font-bold">ATQ</span>
                          <span className="text-[var(--text-primary)]">~{monstro.forca * 2}</span>
                        </div>
                        <div>
                          <span className="text-blue-400 block font-bold">DEF</span>
                          <span className="text-[var(--text-primary)]">{monstro.defesa}</span>
                        </div>
                      </div>

                      {monstro.loot && (
                        <div className="p-2 bg-black/40 border border-[var(--border-card)] mb-4 flex items-start gap-2.5">
                          <div className="shrink-0 p-1 bg-black/50 border border-[var(--border-card)] mt-0.5">
                            <IconeItemPixel id={monstro.loot.id} tipo={monstro.loot.tipo} tamanho={22} />
                          </div>
                          <div className="overflow-hidden">
                            <span className="font-silkscreen text-[10px] text-[var(--accent-gold)] block truncate">
                              {monstro.loot.nome}
                            </span>
                            <span className="font-medieval text-[10px] text-[var(--text-muted)] block truncate">
                              {monstro.loot.descricao}
                            </span>
                            <BadgeAtributosItem item={monstro.loot} />
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => desafiarMonstro(monstro.id)}
                      disabled={derrotado || carregandoEste || !heroiAtivo}
                      className={`w-full pixel-btn text-xs py-2.5 px-3 flex items-center justify-center gap-2 ${
                        derrotado
                          ? "opacity-30 cursor-not-allowed bg-slate-900 border-slate-800"
                          : "pixel-btn-sangue font-bold shadow-pixel"
                      }`}
                    >
                      {carregandoEste ? (
                        <span className="animate-pulse">INICIANDO COMBATE...</span>
                      ) : derrotado ? (
                        <span>EXPURGADO DA REGIÃO</span>
                      ) : (
                        <span>⚔️ DESAFIAR BESTA</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VISTA 1: MAPA MUNDI DE VASLEN EM PIXEL ART 16-BIT (ILHAS DIORAMA + TRILHA)
  // =========================================================================
  const progressoFoco = obterProgressoRegiao(regiaoFoco);
  const nivelApto = nivelHeroi >= regiaoFoco.nivelMinimo;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Barra Superior */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--border-card)] pb-2.5">
        <button
          onClick={aoVoltarAoHub}
          className="pixel-btn text-xs py-2 px-3.5 flex items-center gap-2"
        >
          <span>⬅️</span> Voltar ao Feudo
        </button>

        <div className="flex items-center gap-4">
          <span className="font-pixel text-xs text-[var(--accent-gold)] flex items-center gap-1.5">
            🗺️ MAPA MUNDI DE VASLEN
          </span>
          <span className="font-silkscreen text-xs px-2.5 py-1 bg-black/60 border border-[var(--accent-gold)] text-[var(--accent-gold-light)] flex items-center gap-1.5">
            <IconeCaveira tamanho={14} /> {totalGeralMortos}/21 Expurgados
          </span>
        </div>
      </div>

      {erro && (
        <div className="p-3 pixel-box bg-red-950/80 border-2 border-red-700 text-red-300 font-silkscreen text-xs">
          ⚠️ {erro}
        </div>
      )}

      {/* TABULEIRO DO MAPA MUNDI EM PIXEL ART 16-BIT */}
      <div className="pixel-box p-3 md:p-4 bg-[#070d19] border-4 border-[var(--border-card)] shadow-pixel-ouro">
        {/* Legenda Superior do Mapa */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-3 border-b-2 border-slate-800">
          <div>
            <h2 className="font-pixel text-xs md:text-sm text-[var(--accent-gold-light)]">
              🌊 ARQUIPÉLAGO DA FRATURA — ROTA DE PROGRESSÃO (NV. 1 AO NV. 10+)
            </h2>
            <p className="font-medieval text-xs md:text-sm text-slate-400">
              Clique em uma região para inspecionar ou clique novamente em <strong>Explorar</strong> para ver seus 3 monstros. Regiões purgadas ficam cinzas.
            </p>
          </div>
          <div className="flex items-center gap-3 font-silkscreen text-[10px] shrink-0">
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2.5 h-2.5 bg-amber-400 inline-block border border-white"></span> Selecionada
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 bg-slate-600 inline-block border border-slate-400"></span> Pacificada (Cinza)
            </span>
          </div>
        </div>

        {/* CANVAS DO MAPA OVERWORLD (720px de altura, amplo e espaçado) */}
        <div className="relative w-full h-[680px] md:h-[720px] bg-[#061121] border-2 border-slate-800 overflow-hidden select-none">
          {/* 1. CAMADA DE FUNDO EM PIXEL ART PURO (Malha 320x200 crispEdges igual ao FundoBiomaPixel) */}
          <svg
            viewBox="0 0 320 200"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pixelated pointer-events-none"
            style={{ shapeRendering: "crispEdges" }}
          >
            {/* Oceano Abissal em faixas horizontais de profundidade */}
            <rect x="0" y="0" width="320" height="200" fill="#06101e" />
            <rect x="0" y="0" width="320" height="55" fill="#090d24" />
            <rect x="0" y="55" width="320" height="75" fill="#071326" />
            <rect x="0" y="130" width="320" height="70" fill="#08182e" />

            {/* Nuvens de horizonte e estrelas pixeladas no norte */}
            {Array.from({ length: 18 }).map((_, i) => (
              <rect
                key={`star-${i}`}
                x={(i * 19 + 7) % 310}
                y={(i * 11 + 3) % 48}
                width="2"
                height="2"
                fill={i % 3 === 0 ? "#fde047" : "#475569"}
                opacity="0.55"
              />
            ))}

            {/* Ondas Pixeladas do Mar */}
            {Array.from({ length: 36 }).map((_, i) => {
              const wx = (i * 29 + 11) % 300;
              const wy = 18 + ((i * 23) % 172);
              return (
                <g key={`wave-${i}`} opacity="0.45">
                  <rect x={wx} y={wy} width="8" height="2" fill="#0f294a" />
                  <rect x={wx + 2} y={wy - 2} width="4" height="2" fill="#1e40af" />
                </g>
              );
            })}

            {/* Bússola / Rosa dos Ventos em Pixel Art (Canto Superior Esquerdo) */}
            <g transform="translate(18, 18)">
              <rect x="-10" y="-10" width="20" height="20" fill="#0b172a" stroke="#1e293b" strokeWidth="2" />
              <rect x="-1" y="-8" width="2" height="16" fill="#475569" />
              <rect x="-8" y="-1" width="16" height="2" fill="#475569" />
              <rect x="-1" y="-8" width="2" height="5" fill="#facc15" />
              <rect x="-1" y="-1" width="2" height="2" fill="#f8fafc" />
            </g>

            {/* Bancos de Areia / Recifes Pixelados sob cada Ilha */}
            {REGIOES_VASLEN.map(regiao => {
              const prog = obterProgressoRegiao(regiao);
              return (
                <g key={`reef-${regiao.id}`} opacity={prog.pacificada ? 0.25 : 0.45}>
                  <rect x={regiao.px - 34} y={regiao.py - 16} width="68" height="36" fill="#0c2440" />
                  <rect x={regiao.px - 38} y={regiao.py - 12} width="76" height="28" fill="#0c2440" />
                  <rect
                    x={regiao.px - 32}
                    y={regiao.py - 14}
                    width="64"
                    height="32"
                    fill={prog.pacificada ? "#334155" : regiao.corCosta}
                    opacity="0.22"
                  />
                </g>
              );
            })}

            {/* TRILHA DE PONTES E PEDRAS PIXELADAS CONECTANDO 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 */}
            {REGIOES_VASLEN.slice(0, -1).map((atual, idx) => {
              const prox = REGIOES_VASLEN[idx + 1];
              const concluiuAtual = obterProgressoRegiao(atual).pacificada;
              const blocos = gerarBlocosTrilhaPixel(atual.px, atual.py, prox.px, prox.py);

              return (
                <g key={`path-${atual.id}-${prox.id}`}>
                  {blocos.map((b, bi) => (
                    <g key={bi}>
                      {/* Sombra da pedra no mar */}
                      <rect x={b.x - 2} y={b.y - 1} width="5" height="5" fill="#020617" />
                      {/* Pedra da trilha */}
                      <rect
                        x={b.x - 2}
                        y={b.y - 2}
                        width="4"
                        height="4"
                        fill={
                          concluiuAtual
                            ? b.principal
                              ? "#facc15"
                              : "#ca8a04"
                            : b.principal
                            ? "#cbd5e1"
                            : "#64748b"
                        }
                      />
                    </g>
                  ))}
                </g>
              );
            })}
          </svg>

          {/* Rótulo de Início e Destino Final em Pixel Art */}
          <div className="absolute left-3 bottom-3 z-10 pointer-events-none hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-black/80 border border-slate-700 font-pixel text-[9px] text-emerald-400">
            <span>⚓ INÍCIO DA JORNADA (SUDOESTE)</span>
          </div>
          <div className="absolute right-3 top-2.5 z-10 pointer-events-none hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-purple-950/90 border border-purple-500 font-pixel text-[9px] text-amber-300">
            <span>👑 ZÊNITE FINAL (NORDESTE)</span>
          </div>

          {/* 2. AS 7 ILHAS-DIORAMA EM PIXEL ART 16-BIT */}
          {REGIOES_VASLEN.map(regiao => {
            const selecionada = regiaoFocoId === regiao.id;
            const progresso = obterProgressoRegiao(regiao);
            const pacificada = progresso.pacificada;

            return (
              <div
                key={regiao.id}
                onClick={() => selecionarOuEntrar(regiao.id)}
                style={{ left: `${regiao.leftPct}%`, top: `${regiao.topPct}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform duration-150 group ${
                  selecionada ? "scale-105 z-30" : "hover:scale-[1.03]"
                }`}
              >
                {/* Marcador Flutuante do Herói na Ilha Selecionada */}
                {selecionada && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap pointer-events-none animate-bounce">
                    <span className="font-pixel text-[8px] px-2 py-0.5 bg-amber-500 text-slate-950 border-2 border-amber-200 font-bold shadow-pixel">
                      ▼ HERÓI EM FOCO
                    </span>
                  </div>
                )}

                {/* Estrutura da Ilha em Pixel Art */}
                <div
                  className={`w-[175px] sm:w-[198px] md:w-[214px] transition-all ${
                    pacificada ? "grayscale opacity-65 brightness-90" : ""
                  }`}
                >
                  {/* Cabeçalho da Ilha: Etapa + Nível do Monstro mais fraco */}
                  <div
                    className="flex items-center justify-between px-2 py-1 border-t-2 border-x-2 font-pixel text-[8.5px]"
                    style={{
                      backgroundColor: "#090d16",
                      borderColor: selecionada ? "#facc15" : pacificada ? "#475569" : regiao.corBorda
                    }}
                  >
                    <span className={selecionada ? "text-amber-300" : "text-slate-300"}>
                      {regiao.etapa === 7 ? "👑 BOSS #7" : `ETAPA #${regiao.etapa}`}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 border ${
                        pacificada
                          ? "bg-slate-800 text-slate-400 border-slate-600"
                          : "bg-red-950/90 text-amber-300 border-amber-500/70"
                      }`}
                    >
                      NV. {regiao.nivelMinimo}
                    </span>
                  </div>

                  {/* Palco Diorama Pixel Art do Bioma + Monstro Guia Animado */}
                  <div
                    className="relative h-[68px] md:h-[76px] w-full overflow-hidden border-2 bg-black"
                    style={{
                      borderColor: selecionada ? "#facc15" : pacificada ? "#475569" : regiao.corBorda,
                      boxShadow: selecionada ? "0 0 16px rgba(250, 204, 21, 0.55)" : "0 4px 0 #020617"
                    }}
                  >
                    {/* Cenário Pixel Art Nativo do Bioma */}
                    <div className="absolute inset-0 pointer-events-none">
                      <FundoBiomaPixel bioma={regiao.id} />
                    </div>

                    {/* Sprite do Herói na Ilha Selecionada (lado esquerdo) */}
                    {selecionada && (
                      <div className="absolute left-3 bottom-[-10px] z-20 pointer-events-none transform scale-[0.58] origin-bottom">
                        <SpriteAnimado anim={animHeroiIdle} loop />
                      </div>
                    )}

                    {/* Sprite do Monstro Guardião da Região (lado direito/centro) */}
                    <div
                      className={`absolute ${
                        selecionada ? "right-3" : "left-1/2 -translate-x-1/2"
                      } bottom-[-10px] z-10 pointer-events-none transform scale-[0.65] origin-bottom`}
                    >
                      <SpriteAnimado
                        anim={SPRITES_MONSTROS[regiao.monstroGuiaId]?.idle ?? SPRITES_MONSTROS[1].idle}
                        loop
                        espelhar={selecionada}
                      />
                    </div>

                    {/* Carimbo de Região Pacificada (Todos os 3 monstros mortos) */}
                    {pacificada && (
                      <div className="absolute inset-0 bg-slate-950/75 z-30 flex items-center justify-center">
                        <span className="font-pixel text-[9px] px-2 py-1 bg-slate-900 border-2 border-slate-400 text-slate-200 shadow-pixel">
                          🛡️ PACIFICADA
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Placa do Nome da Região e Contador de Monstros */}
                  <div
                    className="px-2.5 py-1.5 border-x-2 border-b-2 flex items-center justify-between gap-1"
                    style={{
                      backgroundColor: selecionada ? "#172554" : "#0f172a",
                      borderColor: selecionada ? "#facc15" : pacificada ? "#475569" : regiao.corBorda
                    }}
                  >
                    <span
                      className={`font-pixel text-[9px] truncate ${
                        pacificada ? "text-slate-400" : selecionada ? "text-amber-300" : "text-slate-100"
                      }`}
                    >
                      {regiao.icone} {regiao.nome}
                    </span>

                    <div className="flex items-center gap-0.5 shrink-0" title={`${progresso.mortos}/3 derrotados`}>
                      {[1, 2, 3].map(slot => (
                        <span
                          key={slot}
                          className={`w-3.5 h-3.5 flex items-center justify-center text-[8px] border ${
                            slot <= progresso.mortos
                              ? "bg-amber-950 border-amber-500 text-amber-300"
                              : "bg-black/70 border-slate-700 text-slate-600"
                          }`}
                        >
                          {slot <= progresso.mortos ? "💀" : "•"}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Base Escalonada de Rocha em Pixel Art (Falésia da Ilha) */}
                  <div className="flex flex-col items-center pointer-events-none">
                    <div
                      className="w-[88%] h-2 border-x-2 border-b-2"
                      style={{
                        backgroundColor: pacificada ? "#334155" : regiao.corRocha1,
                        borderColor: "#020617"
                      }}
                    ></div>
                    <div
                      className="w-[70%] h-1.5 border-x-2 border-b-2"
                      style={{
                        backgroundColor: pacificada ? "#1e293b" : regiao.corRocha2,
                        borderColor: "#020617"
                      }}
                    ></div>
                    <div
                      className="w-[46%] h-1 border-x-2 border-b-2"
                      style={{
                        backgroundColor: "#020617",
                        borderColor: "#020617"
                      }}
                    ></div>
                  </div>
                </div>

                {/* Botão Rápido de Explorar na Ilha Selecionada */}
                {selecionada && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      entrarNaRegiao(regiao.id);
                    }}
                    className="mt-1 w-full pixel-btn pixel-btn-ouro text-[9px] py-1 px-2 font-bold flex items-center justify-center gap-1 shadow-pixel-ouro"
                  >
                    <span>⚔️ EXPLORAR ({3 - progresso.mortos} VIVOS) ➔</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* PAINEL TÁTICO INFERIOR DA REGIÃO SELECIONADA */}
        <div className="mt-3 p-4 bg-[#0b1324] border-2 border-[var(--border-card)] flex flex-col md:flex-row items-center justify-between gap-4 shadow-pixel">
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <div className="w-16 h-16 bg-black border-2 border-[var(--accent-gold)] flex items-center justify-center shrink-0 overflow-hidden relative">
              <div className="absolute inset-0 opacity-60">
                <FundoBiomaPixel bioma={regiaoFoco.id} />
              </div>
              <div className="relative z-10 transform scale-[0.8] origin-bottom mt-5">
                <SpriteAnimado
                  anim={SPRITES_MONSTROS[regiaoFoco.monstroGuiaId]?.idle ?? SPRITES_MONSTROS[1].idle}
                  loop
                />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-pixel text-[9px] px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-500">
                  ETAPA {regiaoFoco.etapa} DE 7
                </span>
                <h3 className="font-pixel text-xs md:text-sm text-[var(--accent-gold-light)]">
                  {regiaoFoco.icone} {regiaoFoco.nome}
                </h3>
                <span className="font-pixel text-[9px] px-2 py-0.5 bg-red-950 text-red-200 border border-red-700">
                  NV. DA REGIÃO: {regiaoFoco.nivelMinimo}
                </span>
              </div>

              <p className="font-medieval text-xs md:text-sm text-slate-300 mt-1">
                {regiaoFoco.loreCanonica.resumo}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-1 font-silkscreen text-[11px]">
                {progressoFoco.pacificada ? (
                  <span className="text-slate-400 font-bold">
                    🛡️ Região 100% Pacificada (3/3 monstros derrotados)
                  </span>
                ) : nivelApto ? (
                  <span className="text-emerald-400 font-bold">
                    ✅ Seu Herói (Nv. {nivelHeroi}) possui nível recomendado para esta região
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold">
                    ⚠️ Perigo Elevado: Monstro mais fraco é Nv. {regiaoFoco.nivelMinimo} (Seu Herói: Nv. {nivelHeroi})
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => entrarNaRegiao(regiaoFoco.id)}
            className="w-full md:w-auto pixel-btn pixel-btn-ouro text-xs md:text-sm py-3 px-6 font-bold flex items-center justify-center gap-2 shadow-pixel-ouro shrink-0"
          >
            <span>⚔️</span>
            <span>ENTRAR NA REGIÃO (VER MONSTROS)</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
