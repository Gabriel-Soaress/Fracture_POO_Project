import { useState, useEffect, type FC } from "react";
import { CodiceServico } from "../servicos/CodiceServico";
import { SpriteAnimado } from "./SpriteAnimado";
import { SPRITES_MONSTROS } from "../dados/catalogoSprites";
import { IconeItemPixel, BadgeAtributosItem } from "./IconesPixelArt";
import type { EntradaCodiceDTO } from "../tipos/api";

interface PropsModalCodice {
  aberto: boolean;
  aoFechar: () => void;
}

export const ModalCodice: FC<PropsModalCodice> = ({ aberto, aoFechar }) => {
  const [entradas, setEntradas] = useState<EntradaCodiceDTO[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("TODOS");
  const [buscaTexto, setBuscaTexto] = useState<string>("");
  const [entradaSelecionada, setEntradaSelecionada] = useState<EntradaCodiceDTO | null>(null);

  useEffect(() => {
    if (!aberto) return;

    const carregarCodice = async () => {
      setCarregando(true);
      try {
        const dados = await CodiceServico.listar();
        setEntradas(dados);
        if (dados.length > 0 && !entradaSelecionada) {
          setEntradaSelecionada(dados[0]);
        }
      } catch (erro) {
        console.error("Falha ao carregar Códice de Vaslen:", erro);
      } finally {
        setCarregando(false);
      }
    };

    carregarCodice();
  }, [aberto]);

  if (!aberto) return null;

  const categorias = ["TODOS", "HISTORIA", "REGIAO", "MONSTRO", "RELÍQUIA"];

  // Dicionário canônico: ID da entrada de MONSTRO no Códice -> Dados do Monstro para exibir sprite e status
  const MAPA_MONSTROS_CODICE: Record<number, { monstroId: number; bioma: string; tipo: string; hp: number; forca: number; defesa: number }> = {
    12: { monstroId: 1, bioma: "Criptas de Vaslen", tipo: "Comum", hp: 95, forca: 8, defesa: 6 },
    13: { monstroId: 2, bioma: "Criptas de Vaslen", tipo: "Comum", hp: 110, forca: 10, defesa: 7 },
    14: { monstroId: 3, bioma: "Criptas de Vaslen", tipo: "Elite", hp: 135, forca: 12, defesa: 9 },
    15: { monstroId: 4, bioma: "Bosque Sombrio", tipo: "Comum", hp: 130, forca: 12, defesa: 8 },
    16: { monstroId: 5, bioma: "Bosque Sombrio", tipo: "Elite", hp: 155, forca: 14, defesa: 10 },
    17: { monstroId: 6, bioma: "Bosque Sombrio", tipo: "Chefe de Setor", hp: 180, forca: 17, defesa: 12 },
    18: { monstroId: 7, bioma: "Labirinto de Cinzas", tipo: "Comum", hp: 175, forca: 16, defesa: 13 },
    19: { monstroId: 8, bioma: "Labirinto de Cinzas", tipo: "Elite", hp: 205, forca: 19, defesa: 16 },
    20: { monstroId: 9, bioma: "Labirinto de Cinzas", tipo: "Chefe Táurico", hp: 235, forca: 22, defesa: 17 },
    21: { monstroId: 10, bioma: "Pântano Petrificante", tipo: "Comum", hp: 190, forca: 19, defesa: 12 },
    22: { monstroId: 11, bioma: "Pântano Petrificante", tipo: "Elite", hp: 220, forca: 21, defesa: 15 },
    23: { monstroId: 12, bioma: "Pântano Petrificante", tipo: "Rainha do Pântano", hp: 295, forca: 26, defesa: 19 },
    24: { monstroId: 13, bioma: "Colinas da Lua de Sangue", tipo: "Comum", hp: 205, forca: 21, defesa: 13 },
    25: { monstroId: 14, bioma: "Colinas da Lua de Sangue", tipo: "Elite", hp: 245, forca: 25, defesa: 16 },
    26: { monstroId: 15, bioma: "Colinas da Lua de Sangue", tipo: "Chefe das Colinas", hp: 335, forca: 30, defesa: 20 },
    27: { monstroId: 16, bioma: "Limbo Espectral", tipo: "Comum", hp: 220, forca: 23, defesa: 14 },
    28: { monstroId: 17, bioma: "Limbo Espectral", tipo: "Elite", hp: 260, forca: 27, defesa: 17 },
    29: { monstroId: 18, bioma: "Limbo Espectral", tipo: "Chefe do Limbo", hp: 365, forca: 33, defesa: 22 },
    30: { monstroId: 19, bioma: "Pináculo do Eclipse", tipo: "Elite Alada", hp: 280, forca: 29, defesa: 19 },
    31: { monstroId: 20, bioma: "Pináculo do Eclipse", tipo: "Mestre Asceta", hp: 315, forca: 32, defesa: 22 },
    32: { monstroId: 21, bioma: "Pináculo do Eclipse", tipo: "Soberana de Vaslen", hp: 430, forca: 37, defesa: 26 }
  };

  // Dicionário canônico: ID da entrada de RELÍQUIA no Códice -> Ícones Pixel Art e Atributos
  const MAPA_RELIQUIAS_CODICE: Record<number, { itens: Array<{ id: number; nome: string; tipo: string }> }> = {
    33: {
      itens: [
        { id: 101, nome: "Poções de Cura", tipo: "CURA_VIDA" },
        { id: 201, nome: "Elixires de Fôlego", tipo: "RECUPERA_ENERGIA" },
        { id: 303, nome: "Óleos de Lâmina", tipo: "REFORCO_DANO" },
        { id: 404, nome: "Relíquias Compostas", tipo: "COMPOSTO" }
      ]
    },
    34: {
      itens: [
        { id: 101, nome: "Medula de Esqueleto Antigo", tipo: "CURA_VIDA" },
        { id: 102, nome: "Pó de Ossos Reanimados", tipo: "CURA_VIDA" },
        { id: 201, nome: "Cinzas de Foco Espectral", tipo: "RECUPERA_ENERGIA" }
      ]
    },
    35: {
      itens: [
        { id: 103, nome: "Seiva Negra do Bosque", tipo: "CURA_VIDA" },
        { id: 202, nome: "Orvalho de Miasma Tribal", tipo: "RECUPERA_ENERGIA" },
        { id: 301, nome: "Unguento de Fúria Carniceira", tipo: "REFORCO_DANO" }
      ]
    },
    36: {
      itens: [
        { id: 104, nome: "Carne Seca Táurica", tipo: "CURA_VIDA" },
        { id: 303, nome: "Óleo da Forja Vulcânica", tipo: "REFORCO_DANO" },
        { id: 401, nome: "Bálsamo do Coração de Touro", tipo: "COMPOSTO" }
      ]
    },
    37: {
      itens: [
        { id: 302, nome: "Veneno de Presa Serpentina", tipo: "REFORCO_DANO" },
        { id: 203, nome: "Lágrima de Medusa", tipo: "RECUPERA_ENERGIA" },
        { id: 106, nome: "Escama Petrificada da Rainha", tipo: "CURA_VIDA" }
      ]
    },
    38: {
      itens: [
        { id: 204, nome: "Presa do Caçador Noturno", tipo: "RECUPERA_ENERGIA" },
        { id: 304, nome: "Óleo de Garra de Fera", tipo: "REFORCO_DANO" },
        { id: 402, nome: "Coração Gélido do Alfa", tipo: "COMPOSTO" }
      ]
    },
    39: {
      itens: [
        { id: 205, nome: "Centelha de Fogo-Fátuo", tipo: "RECUPERA_ENERGIA" },
        { id: 105, nome: "Lamento Ectoplasmático", tipo: "CURA_VIDA" },
        { id: 403, nome: "Essência do Rancor Primordial", tipo: "COMPOSTO" }
      ]
    },
    40: {
      itens: [
        { id: 305, nome: "Pena Cortante de Tengu", tipo: "REFORCO_DANO" },
        { id: 107, nome: "Incenso do Asceta Caído", tipo: "CURA_VIDA" },
        { id: 404, nome: "Orbe dos Nove Ecos da Kitsune", tipo: "COMPOSTO" }
      ]
    }
  };

  const obterIconeCategoria = (cat: string) => {
    switch (cat.toUpperCase()) {
      case "HISTORIA": return "📜";
      case "REGIAO": return "🗺️";
      case "MONSTRO": return "💀";
      case "RELÍQUIA": return "🧪";
      default: return "📖";
    }
  };

  const selecionarEntrada = async (entrada: EntradaCodiceDTO) => {
    setEntradaSelecionada(entrada);
    try {
      const detalhada = await CodiceServico.buscarPorId(entrada.id);
      if (detalhada) {
        setEntradaSelecionada(detalhada);
      }
    } catch (err) {
      console.warn("Usando resumo do verbete:", err);
    }
  };

  const entradasFiltradas = entradas.filter(e => {
    const catUpper = (e.categoria || "").toUpperCase();
    const filtroUpper = filtroCategoria.toUpperCase();
    const correspondeCategoria = filtroCategoria === "TODOS" || catUpper === filtroUpper;
    const termo = buscaTexto.toLowerCase();
    const correspondeTexto =
      (e.titulo || "").toLowerCase().includes(termo) ||
      (e.resumo || "").toLowerCase().includes(termo) ||
      (e.conteudoCompleto || "").toLowerCase().includes(termo) ||
      (e.tags || []).some(t => (t || "").toLowerCase().includes(termo));

    return correspondeCategoria && correspondeTexto;
  });

  const monstroInfo = entradaSelecionada && entradaSelecionada.categoria === "MONSTRO" 
    ? MAPA_MONSTROS_CODICE[entradaSelecionada.id] 
    : null;

  const reliquiaInfo = entradaSelecionada && entradaSelecionada.categoria === "RELÍQUIA" 
    ? MAPA_RELIQUIAS_CODICE[entradaSelecionada.id] 
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[90vh] max-h-[720px] pixel-box p-4 md:p-6 bg-[var(--bg-card)] border-4 border-[var(--accent-gold)] shadow-pixel-ouro flex flex-col">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📜</span>
            <div>
              <h2 className="font-pixel text-xs md:text-sm text-[var(--accent-gold-light)]">
                O CÓDICE SECULAR DE VASLEN
              </h2>
              <span className="font-silkscreen text-[10px] text-[var(--text-muted)]">
                Enciclopédia Arcana, Lendas de Biomas, Bestiário e Relíquias do Eclipse
              </span>
            </div>
          </div>
          <button
            onClick={aoFechar}
            className="font-pixel text-xs text-[var(--text-muted)] hover:text-white px-2 py-1 pixel-btn"
          >
            [X]
          </button>
        </div>

        {/* Barra de Filtro e Busca */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-4 shrink-0">
          <input
            type="text"
            value={buscaTexto}
            onChange={e => setBuscaTexto(e.target.value)}
            placeholder="Pesquisar por nome, monstro, bioma ou relíquia..."
            className="flex-1 bg-[var(--bg-subcard)] border-2 border-[var(--border-card)] px-3 py-2 font-silkscreen text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] outline-none"
          />

          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`font-pixel text-[9px] px-2.5 py-1.5 pixel-box transition-colors whitespace-nowrap ${
                  filtroCategoria === cat
                    ? "bg-[var(--accent-gold-dark)] text-[var(--accent-gold-light)] border-2 border-[var(--accent-gold)]"
                    : "bg-[var(--bg-panel)] text-[var(--text-muted)] hover:text-white border border-[var(--border-card)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Corpo: Lista à Esquerda + Conteúdo à Direita */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-hidden min-h-0">
          
          {/* Coluna Esquerda: Lista de Entradas */}
          <div className="md:col-span-5 border-2 border-[var(--border-card)] bg-[var(--bg-panel)] p-2 overflow-y-auto space-y-1.5">
            {carregando ? (
              <div className="font-pixel text-[10px] text-[var(--text-muted)] p-4 text-center animate-pulse">
                Consultando pergaminhos...
              </div>
            ) : entradasFiltradas.length === 0 ? (
              <div className="font-silkscreen text-xs text-[var(--text-muted)] p-4 text-center">
                Nenhum registro encontrado.
              </div>
            ) : (
              entradasFiltradas.map(e => {
                const selecionada = entradaSelecionada?.id === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => selecionarEntrada(e)}
                    className={`w-full text-left p-2.5 pixel-box transition-all flex flex-col gap-1 ${
                      selecionada
                        ? "bg-[var(--bg-subcard)] border-2 border-[var(--accent-gold)] shadow-pixel-ouro"
                        : "bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-light)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-silkscreen text-xs font-bold text-[var(--text-primary)] truncate">
                        {obterIconeCategoria(e.categoria)} {e.titulo}
                      </span>
                      <span className="font-pixel text-[7.5px] px-1.5 py-0.5 bg-black/50 text-[var(--accent-gold)] border border-[var(--border-card)]">
                        {e.categoria}
                      </span>
                    </div>
                    <p className="font-medieval text-xs text-[var(--text-muted)] line-clamp-1">
                      {e.resumo}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {e.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="font-silkscreen text-[8px] text-[var(--text-muted)]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Coluna Direita: Leitura do Registro Selecionado */}
          <div className="md:col-span-7 border-2 border-[var(--border-card)] bg-[var(--bg-panel)] p-4 md:p-6 overflow-y-auto flex flex-col justify-between">
            {entradaSelecionada ? (
              <div className="space-y-4">
                <div className="border-b-2 border-[var(--border-card)] pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-pixel text-[8px] px-2 py-0.5 bg-[var(--accent-gold-dark)] text-[var(--accent-gold-light)] border border-[var(--accent-gold)]">
                      {obterIconeCategoria(entradaSelecionada.categoria)} {entradaSelecionada.categoria}
                    </span>
                    <span className="font-silkscreen text-[10px] text-[var(--text-muted)]">
                      Registro #{entradaSelecionada.id}
                    </span>
                  </div>
                  <h3 className="font-pixel text-sm md:text-base text-[var(--accent-gold-light)]">
                    {entradaSelecionada.titulo}
                  </h3>
                  <p className="font-medieval text-xs text-[var(--accent-gold)] italic mt-1">
                    "{entradaSelecionada.resumo}"
                  </p>
                </div>

                {/* 1. SE FOR MONSTRO: Exibe o Sprite Animado do Bicho + Atributos */}
                {monstroInfo && (
                  <div className="p-3 bg-[var(--bg-subcard)] border-2 border-[var(--border-card)] flex items-center justify-between gap-4">
                    <div className="h-28 w-28 bg-black/70 border-2 border-[var(--border-card)] flex items-center justify-center overflow-hidden relative shrink-0">
                      <div className="transform scale-[1.35] origin-bottom mt-7">
                        <SpriteAnimado
                          anim={SPRITES_MONSTROS[monstroInfo.monstroId]?.idle ?? SPRITES_MONSTROS[1].idle}
                          loop
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1 font-silkscreen text-[11px]">
                      <div className="flex justify-between border-b border-[var(--border-card)] pb-1">
                        <span className="text-[var(--text-muted)]">BIOMA NATIVO:</span>
                        <span className="text-amber-300 font-bold">{monstroInfo.bioma}</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--border-card)] pb-1">
                        <span className="text-[var(--text-muted)]">CLASSIFICAÇÃO:</span>
                        <span className="text-rose-400 font-bold">{monstroInfo.tipo}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 pt-1 text-center font-pixel text-[8px]">
                        <div className="p-1 bg-black/40 border border-rose-900/60 text-rose-300">
                          HP {monstroInfo.hp}
                        </div>
                        <div className="p-1 bg-black/40 border border-amber-900/60 text-amber-300">
                          ATQ ~{monstroInfo.forca * 2}
                        </div>
                        <div className="p-1 bg-black/40 border border-blue-900/60 text-blue-300">
                          DEF {monstroInfo.defesa}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SE FOR RELÍQUIA / ITEM: Exibe os Ícones Pixel Art dos Itens */}
                {reliquiaInfo && (
                  <div className="p-3 bg-[var(--bg-subcard)] border-2 border-[var(--border-card)] space-y-2">
                    <span className="font-pixel text-[8.5px] text-[var(--accent-gold)] block">
                      🧪 ÍCONES E ATRIBUTOS DOS ESPÓLIOS DESTE REGISTRO:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {reliquiaInfo.itens.map((it, idx) => (
                        <div
                          key={`${it.id}-${idx}`}
                          className="p-2 bg-black/50 border border-[var(--border-card)] flex items-center gap-2.5"
                        >
                          <div className="p-1 bg-black/80 border border-[var(--border-card)] shrink-0">
                            <IconeItemPixel id={it.id} tipo={it.tipo} tamanho={28} />
                          </div>
                          <div className="overflow-hidden">
                            <span className="font-silkscreen text-[10.5px] font-bold text-[var(--text-primary)] block truncate">
                              {it.nome}
                            </span>
                            <BadgeAtributosItem item={{ id: it.id, tipo: it.tipo }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="font-medieval text-base md:text-lg text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                  {entradaSelecionada.conteudoCompleto || entradaSelecionada.resumo}
                </div>

                <div className="pt-4 border-t border-[var(--border-card)]">
                  <span className="font-silkscreen text-[10px] text-[var(--accent-gold)] block mb-1">
                    TAGS RELACIONADAS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {entradaSelecionada.tags.map(tag => (
                      <span
                        key={tag}
                        className="font-pixel text-[8px] px-2 py-1 bg-black/60 text-[var(--text-muted)] border border-[var(--border-card)]"
                      >
                        🏷️ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center font-medieval text-base text-[var(--text-muted)]">
                Selecione uma entrada ao lado para decifrar seu conteúdo.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
