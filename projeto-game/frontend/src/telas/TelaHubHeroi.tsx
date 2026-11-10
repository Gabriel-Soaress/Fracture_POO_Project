import { useState, useEffect, type FC } from "react";
import { useJogo } from "../contextos/JogoContext";
import { PersonagemServico } from "../servicos/PersonagemServico";
import { formatarNomeClasse } from "../componentes/NavegadorSuperior";
import {
  IconeCaveira,
  IconeItemPixel,
  BadgeAtributosItem
} from "../componentes/IconesPixelArt";
import type { ItemInventarioDTO } from "../tipos/api";

interface PropsTelaHubHeroi {
  aoIrParaMural: () => void;
  aoVoltarLobby: () => void;
}

export const TelaHubHeroi: FC<PropsTelaHubHeroi> = ({ aoIrParaMural, aoVoltarLobby }) => {
  const { heroiAtivo, recarregarHeroiAtivo, setModalCodiceAberto } = useJogo();
  const [salvandoPontos, setSalvandoPontos] = useState<boolean>(false);
  const [pontosAdicionais, setPontosAdicionais] = useState<{ forca: number; defesa: number; agilidade: number }>({
    forca: 0,
    defesa: 0,
    agilidade: 0
  });

  // Garante sincronização imediata dos itens da mochila e atributos ao abrir o Hub
  useEffect(() => {
    recarregarHeroiAtivo();
  }, []);

  if (!heroiAtivo) {
    return (
      <div className="w-full max-w-md mx-auto text-center p-8 pixel-box bg-[var(--bg-panel)]">
        <p className="font-medieval text-lg text-[var(--text-muted)] mb-4">
          Nenhum herói selecionado para esta jornada.
        </p>
        <button onClick={aoVoltarLobby} className="pixel-btn pixel-btn-ouro text-xs py-2 px-4">
          Voltar ao Salão de Heróis
        </button>
      </div>
    );
  }

  const totalAdicionados = pontosAdicionais.forca + pontosAdicionais.defesa + pontosAdicionais.agilidade;
  const pontosDisponiveis = heroiAtivo.pontosLivres - totalAdicionados;

  const alterarAdicional = (tipo: "forca" | "defesa" | "agilidade", delta: number) => {
    if (delta > 0 && pontosDisponiveis <= 0) return;
    if (delta < 0 && pontosAdicionais[tipo] <= 0) return;

    setPontosAdicionais(prev => ({
      ...prev,
      [tipo]: prev[tipo] + delta
    }));
  };

  const salvarDistribuicaoPontos = async () => {
    if (totalAdicionados === 0) return;
    setSalvandoPontos(true);
    try {
      await PersonagemServico.distribuirPontos(heroiAtivo.id, {
        forcaAdd: pontosAdicionais.forca,
        defesaAdd: pontosAdicionais.defesa,
        agilidadeAdd: pontosAdicionais.agilidade
      });
      setPontosAdicionais({ forca: 0, defesa: 0, agilidade: 0 });
      await recarregarHeroiAtivo();
    } catch (err: any) {
      alert("Falha ao distribuir pontos: " + (err.message || "Tente novamente"));
    } finally {
      setSalvandoPontos(false);
    }
  };

  const obterSpriteHeroi = (classe: string) => {
    if (classe === "MAGO") return "sprite-mago-idle";
    if (classe === "SAMURAI" || classe === "ARQUEIRO") return "sprite-arqueiro-idle";
    return "sprite-heroi-idle";
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Barra de Ações Superiores */}
      <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-3">
        <button
          onClick={aoVoltarLobby}
          className="pixel-btn text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <span>⬅️</span> Trocar Herói
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalCodiceAberto(true)}
            className="pixel-btn text-xs py-2 px-3 flex items-center gap-1"
          >
            <span>📜</span> Códice Lore
          </button>
          <button
            onClick={aoIrParaMural}
            className="pixel-btn pixel-btn-ouro text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <span>🗺️</span> MARCHAR AO MURAL DE CAÇADAS
          </button>
        </div>
      </div>

      {/* Grid Principal do Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Coluna Esquerda: Cartão do Herói e Atributos (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="pixel-box p-6 bg-[var(--bg-panel)] border-2 border-[var(--border-card)] shadow-pixel flex flex-col items-center text-center">
            
            {/* Tag de Nível */}
            <div className="flex items-center justify-between w-full border-b border-[var(--border-card)] pb-2 mb-4">
              <span className="font-pixel text-xs text-[var(--accent-gold)]">
                {formatarNomeClasse(heroiAtivo.classeHeroi)}
              </span>
              <span className="font-pixel text-[9px] px-2 py-0.5 bg-[var(--accent-gold-dark)] text-[var(--accent-gold-light)] border border-[var(--accent-gold)]">
                NÍVEL {heroiAtivo.nivel}
              </span>
            </div>

            {/* Plataforma e Sprite */}
            <div className="h-44 w-full bg-[var(--bg-subcard)] border-2 border-[var(--border-card)] flex flex-col items-center justify-center relative overflow-hidden mb-4">
              <div className="transform scale-[2.0] origin-bottom mt-10">
                <div className={`w-[128px] h-[128px] pixelated ${obterSpriteHeroi(heroiAtivo.classeHeroi)}`}></div>
              </div>
            </div>

            <h2 className="font-pixel text-sm md:text-base text-[var(--accent-gold-light)] mb-1">
              {heroiAtivo.nome}
            </h2>
            <span className="font-medieval text-sm text-[var(--text-muted)]">
              Veterano de {heroiAtivo.monstrosDerrotados.length} Caçadas em Vaslen
            </span>

            {/* Barras Vitais */}
            <div className="w-full space-y-2 mt-5 text-left font-silkscreen text-[11px]">
              {/* Vida */}
              <div>
                <div className="flex justify-between text-[var(--text-muted)] mb-1">
                  <span>PONTOS DE VIDA</span>
                  <span className="text-rose-400 font-bold">{heroiAtivo.vidaAtual} / {heroiAtivo.vidaMaxima}</span>
                </div>
                <div className="pixel-bar-bg h-4 w-full">
                  <div
                    className="h-full bg-gradient-to-r from-rose-950 to-rose-600"
                    style={{ width: `${(heroiAtivo.vidaAtual / heroiAtivo.vidaMaxima) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Energia */}
              <div>
                <div className="flex justify-between text-[var(--text-muted)] mb-1">
                  <span>RESERVA DE ENERGIA</span>
                  <span className="text-cyan-400 font-bold">{heroiAtivo.energiaAtual} / {heroiAtivo.energiaMaxima}</span>
                </div>
                <div className="pixel-bar-bg h-4 w-full">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-950 to-cyan-500"
                    style={{ width: `${(heroiAtivo.energiaAtual / heroiAtivo.energiaMaxima) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Experiência (XP) */}
              <div>
                <div className="flex justify-between text-[var(--text-muted)] mb-1">
                  <span>PROGRESSO DE XP</span>
                  <span className="text-[var(--accent-gold)]">{heroiAtivo.experienciaAtual} / {heroiAtivo.experienciaNecessaria}</span>
                </div>
                <div className="pixel-bar-bg h-3.5 w-full">
                  <div
                    className="h-full bg-gradient-to-r from-amber-950 to-amber-500"
                    style={{ width: `${(heroiAtivo.experienciaAtual / heroiAtivo.experienciaNecessaria) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

          </div>

          {/* Painel de Atributos e Distribuição */}
          <div className="pixel-box p-4 bg-[var(--bg-panel)] border-2 border-[var(--border-card)]">
            <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2 mb-3">
              <span className="font-silkscreen text-xs text-[var(--accent-gold)]">
                ATRIBUTOS BÁSICOS
              </span>
              {heroiAtivo.pontosLivres > 0 && (
                <span className="font-pixel text-[8px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500 animate-pulse">
                  PONTOS LIVRES: {pontosDisponiveis}
                </span>
              )}
            </div>

            <div className="space-y-2 font-silkscreen text-xs">
              {/* Força */}
              <div className="flex items-center justify-between p-2 bg-[var(--bg-subcard)] border border-[var(--border-card)]">
                <span className="text-red-400">⚔️ FORÇA</span>
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-sm">{heroiAtivo.forca + pontosAdicionais.forca}</span>
                  {heroiAtivo.pontosLivres > 0 && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => alterarAdicional("forca", -1)}
                        disabled={pontosAdicionais.forca === 0}
                        className="pixel-btn text-[10px] w-6 h-6 flex items-center justify-center disabled:opacity-20"
                      >
                        -
                      </button>
                      <button
                        onClick={() => alterarAdicional("forca", 1)}
                        disabled={pontosDisponiveis <= 0}
                        className="pixel-btn pixel-btn-ouro text-[10px] w-6 h-6 flex items-center justify-center disabled:opacity-20"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Defesa */}
              <div className="flex items-center justify-between p-2 bg-[var(--bg-subcard)] border border-[var(--border-card)]">
                <span className="text-blue-400">🛡️ DEFESA</span>
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-sm">{heroiAtivo.defesa + pontosAdicionais.defesa}</span>
                  {heroiAtivo.pontosLivres > 0 && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => alterarAdicional("defesa", -1)}
                        disabled={pontosAdicionais.defesa === 0}
                        className="pixel-btn text-[10px] w-6 h-6 flex items-center justify-center disabled:opacity-20"
                      >
                        -
                      </button>
                      <button
                        onClick={() => alterarAdicional("defesa", 1)}
                        disabled={pontosDisponiveis <= 0}
                        className="pixel-btn pixel-btn-ouro text-[10px] w-6 h-6 flex items-center justify-center disabled:opacity-20"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Agilidade */}
              <div className="flex items-center justify-between p-2 bg-[var(--bg-subcard)] border border-[var(--border-card)]">
                <span className="text-emerald-400">⚡ AGILIDADE</span>
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-sm">{heroiAtivo.agilidade + pontosAdicionais.agilidade}</span>
                  {heroiAtivo.pontosLivres > 0 && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => alterarAdicional("agilidade", -1)}
                        disabled={pontosAdicionais.agilidade === 0}
                        className="pixel-btn text-[10px] w-6 h-6 flex items-center justify-center disabled:opacity-20"
                      >
                        -
                      </button>
                      <button
                        onClick={() => alterarAdicional("agilidade", 1)}
                        disabled={pontosDisponiveis <= 0}
                        className="pixel-btn pixel-btn-ouro text-[10px] w-6 h-6 flex items-center justify-center disabled:opacity-20"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {totalAdicionados > 0 && (
              <button
                onClick={salvarDistribuicaoPontos}
                disabled={salvandoPontos}
                className="w-full mt-3 pixel-btn pixel-btn-ouro text-xs py-2 px-3"
              >
                {salvandoPontos ? "SALVANDO..." : `CONFIRMAR +${totalAdicionados} PONTOS ALOCADOS`}
              </button>
            )}
          </div>

        </div>

        {/* Coluna Direita: Mochila de Inventário e Histórico de Caçadas (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Mochila de Inventário */}
          <div className="pixel-box p-6 bg-[var(--bg-panel)] border-2 border-[var(--border-card)] shadow-pixel">
            <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎒</span>
                <h3 className="font-pixel text-xs md:text-sm text-[var(--accent-gold-light)]">
                  MOCHILA DE CONSUMÍVEIS COLETADOS
                </h3>
              </div>
              <span className="font-silkscreen text-[11px] text-[var(--text-muted)]">
                {heroiAtivo.inventario ? heroiAtivo.inventario.length : 0} itens guardados
              </span>
            </div>

            {(!heroiAtivo.inventario || heroiAtivo.inventario.length === 0) ? (
              <div className="p-8 text-center bg-[var(--bg-subcard)] border border-[var(--border-card)]">
                <span className="text-3xl block mb-2 opacity-50">🧪</span>
                <p className="font-medieval text-base text-[var(--text-muted)]">
                  Sua mochila de batalha está vazia. Derrote monstros nos biomas para saquear poções, elixires e óleos lendários!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {heroiAtivo.inventario.map((item: ItemInventarioDTO, idx: number) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="p-3 pixel-box bg-[var(--bg-subcard)] border border-[var(--border-card)] flex items-start gap-3"
                  >
                    <div className="p-1.5 bg-black/50 border border-[var(--border-card)] shrink-0 mt-0.5">
                      <IconeItemPixel id={item.id} tipo={item.tipo} tamanho={28} />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-silkscreen text-xs font-bold text-[var(--accent-gold)] block truncate">
                        {item.nome}
                      </span>
                      <p className="font-medieval text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">
                        {item.descricao}
                      </p>
                      <BadgeAtributosItem item={item} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mural de Caçadas Únicas (Banner de Ação) */}
          <div className="pixel-box p-6 bg-gradient-to-br from-[var(--bg-panel)] to-[var(--bg-subcard)] border-2 border-[var(--accent-gold)] shadow-pixel-ouro">
            <div className="flex items-center justify-between mb-3">
              <span className="font-pixel text-xs text-[var(--accent-gold)] flex items-center gap-2">
                <IconeCaveira tamanho={16} /> MURAL DE CAÇADAS DE VASLEN
              </span>
              <span className="font-pixel text-[8px] px-2 py-0.5 bg-[var(--accent-gold-dark)] text-[var(--accent-gold-light)] border border-[var(--accent-gold)]">
                ANTI-FARM ATIVO
              </span>
            </div>

            <p className="font-medieval text-base text-[var(--text-secondary)] mb-4 leading-relaxed">
              O mundo de Vaslen é composto por 7 biomas amaldiçoados e 21 monstros colossais. Cada fera só pode ser expurgada uma única vez pelo seu herói!
            </p>

            <button
              onClick={aoIrParaMural}
              className="w-full pixel-btn pixel-btn-ouro text-xs md:text-sm py-3 px-4 flex items-center justify-center gap-2"
            >
              <span>⚔️</span> ABRIR MURAL DOS 7 BIOMAS E INICIAR CAÇADA
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
