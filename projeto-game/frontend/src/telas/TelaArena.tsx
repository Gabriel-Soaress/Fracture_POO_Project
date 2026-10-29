import { useState, type FC } from "react";
import { useJogo } from "../contextos/JogoContext";
import { CombateServico } from "../servicos/CombateServico";
import { ErroHttp } from "../servicos/clienteHttp";
import { FundoBiomaPixel } from "../componentes/FundoBiomaPixel";
import { ModalFimBatalha } from "../componentes/ModalFimBatalha";
import { ModalConfirmacao } from "../componentes/ModalConfirmacao";
import {
  IconeCaveira,
  IconePocaoVida,
  IconeElixirEnergia,
  IconeOleoDano,
  IconeOrbeReliquia
} from "../componentes/IconesPixelArt";
import type {
  ResultadoTurnoDTO,
  TipoAcaoCombate,
  TipoAtaque,
  ItemInventarioDTO
} from "../tipos/api";

interface PropsTelaArena {
  aoTerminarDuelo: (vitoria: boolean) => void;
}

export const TelaArena: FC<PropsTelaArena> = ({ aoTerminarDuelo }) => {
  const { sessaoCombate, recarregarHeroiAtivo, heroiAtivo } = useJogo();

  if (!sessaoCombate) {
    return (
      <div className="w-full max-w-md mx-auto text-center p-8 pixel-box bg-[var(--bg-panel)]">
        <p className="font-medieval text-lg text-[var(--text-muted)] mb-4">
          Nenhuma batalha ativa no momento.
        </p>
        <button onClick={() => aoTerminarDuelo(false)} className="pixel-btn pixel-btn-ouro text-xs py-2 px-4">
          Voltar ao Feudo
        </button>
      </div>
    );
  }

  // Estado dinâmico do combate sincronizado com o Backend
  const [vidaHeroi, setVidaHeroi] = useState<number>(sessaoCombate.heroi.vidaAtual);
  const [energiaHeroi, setEnergiaHeroi] = useState<number>(sessaoCombate.heroi.energiaAtual);
  const [vidaMonstro, setVidaMonstro] = useState<number>(sessaoCombate.monstro.vidaAtual);
  const [energiaMonstro, setEnergiaMonstro] = useState<number>(sessaoCombate.monstro.energiaAtual);

  const [logsBatalha, setLogsBatalha] = useState<string[]>([sessaoCombate.mensagem]);
  const [rodada, setRodada] = useState<number>(1);
  const [processandoTurno, setProcessandoTurno] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  // Animações visuais dos sprites
  const [animHeroi, setAnimHeroi] = useState<"idle" | "attack" | "defend" | "hurt">("idle");
  const [animMonstro, setAnimMonstro] = useState<"idle" | "attack" | "hurt">("idle");
  const [efeitoVisualHeroi, setEfeitoVisualHeroi] = useState<{ texto: string; tipo: "CURA" | "ENERGIA" | "DANO" } | null>(null);

  // Modais de Mochila e Desfecho
  const [modalMochilaAberta, setModalMochilaAberta] = useState<boolean>(false);
  const [modalFimBatalha, setModalFimBatalha] = useState<{
    aberto: boolean;
    tipo: "VITORIA" | "DERROTA";
    xpGanho?: number;
    subiuNivel?: boolean;
    novoNivel?: number;
    loot?: any;
  }>({
    aberto: false,
    tipo: "VITORIA"
  });
  const [modalFugaAberto, setModalFugaAberto] = useState<boolean>(false);

  // Executa turno no backend
  const executarTurno = async (acao: { tipo: TipoAcaoCombate; tipoAtaque?: TipoAtaque; indiceItem?: number }) => {
    if (processandoTurno || modalFimBatalha.aberto) return;
    setProcessandoTurno(true);
    setErro(null);

    // Animação de ataque do herói
    if (acao.tipo === "ATACAR") {
      setAnimHeroi("attack");
      setTimeout(() => setAnimHeroi("idle"), 500);
    } else if (acao.tipo === "DEFENDER") {
      setAnimHeroi("defend");
      setTimeout(() => setAnimHeroi("idle"), 700);
    }

    try {
      const resposta = await CombateServico.enviarTurno({
        sessaoId: sessaoCombate.sessaoId,
        acao
      });

      const res: ResultadoTurnoDTO = resposta.resultado;
      setRodada(res.rodada);
      setVidaHeroi(res.vidaHeroiAtual);
      setEnergiaHeroi(res.energiaHeroiAtual);
      setVidaMonstro(res.vidaMonstroAtual);
      setEnergiaMonstro(res.energiaMonstroAtual);

      // Reage a animação de contra-ataque do monstro
      setTimeout(() => {
        setAnimMonstro("attack");
        setAnimHeroi("hurt");
        setTimeout(() => {
          setAnimMonstro("idle");
          setAnimHeroi("idle");
        }, 500);
      }, 400);

      // Adiciona novos logs ao topo
      if (res.logsRodada && res.logsRodada.length > 0) {
        setLogsBatalha(prev => [...res.logsRodada, ...prev]);
      }

      // Verifica fim do combate
      if (res.estado === "VITORIA_JOGADOR") {
        await recarregarHeroiAtivo();
        setTimeout(() => {
          setModalFimBatalha({
            aberto: true,
            tipo: "VITORIA",
            xpGanho: res.recompensas?.xpGanho,
            subiuNivel: res.recompensas?.subiuNivel,
            novoNivel: res.recompensas?.nivelAtual,
            loot: res.recompensas?.itemLoot
          });
        }, 800);
      } else if (res.estado === "DERROTA_JOGADOR") {
        setTimeout(() => {
          setModalFimBatalha({
            aberto: true,
            tipo: "DERROTA"
          });
        }, 800);
      }
    } catch (err: any) {
      setErro(err instanceof ErroHttp ? err.message : "Falha ao processar turno.");
    } finally {
      setProcessandoTurno(false);
    }
  };

  const usarItemMochila = async (indiceItem: number, item: ItemInventarioDTO) => {
    setModalMochilaAberta(false);

    // Efeito visual imediato
    if (item.tipo === "POCAO_VIDA") {
      setEfeitoVisualHeroi({ texto: `+${item.valorEfeito} HP`, tipo: "CURA" });
    } else if (item.tipo === "ELIXIR_ENERGIA") {
      setEfeitoVisualHeroi({ texto: `+${item.valorEfeito} EN`, tipo: "ENERGIA" });
    } else {
      setEfeitoVisualHeroi({ texto: `+${item.valorEfeito} BUFF`, tipo: "DANO" });
    }
    setTimeout(() => setEfeitoVisualHeroi(null), 1200);

    await executarTurno({
      tipo: "USAR_ITEM",
      indiceItem
    });
  };

  const obterClasseSpriteMonstro = () => {
    // Escolhe sprite sheet conforme o bioma ou classe
    if (sessaoCombate.monstro.bioma === "CRIPTAS") {
      return animMonstro === "idle" ? "sprite-esqueleto-idle" :
             animMonstro === "attack" ? "sprite-esqueleto-attack" : "sprite-esqueleto-hurt";
    }
    if (sessaoCombate.monstro.bioma === "BOSQUE_SOMBRIO") {
      return "sprite-satiro-idle";
    }
    if (sessaoCombate.monstro.bioma === "LABIRINTO_CINZAS") {
      return "sprite-minotauro-idle";
    }
    if (sessaoCombate.monstro.bioma === "COLINAS_LUA_SANGUE") {
      return "sprite-lobisomem-idle";
    }
    return "sprite-esqueleto-idle";
  };

  const renderizarIconeItem = (tipo: string) => {
    switch (tipo) {
      case "POCAO_VIDA":
        return <IconePocaoVida tamanho={24} />;
      case "ELIXIR_ENERGIA":
        return <IconeElixirEnergia tamanho={24} />;
      case "OLEO_DANO":
        return <IconeOleoDano tamanho={24} />;
      case "ORBE_RELIQUIA":
      default:
        return <IconeOrbeReliquia tamanho={24} />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      
      {/* Barra de Status Superior do Duelo */}
      <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-xs text-[var(--accent-gold)]">
            RODADA {rodada}
          </span>
          <span className="font-silkscreen text-[11px] text-[var(--text-muted)]">
            • Bioma: {sessaoCombate.monstro.bioma}
          </span>
        </div>

        <button
          onClick={() => setModalFugaAberto(true)}
          className="pixel-btn text-[10px] py-1 px-2.5 text-red-400 hover:text-red-300"
        >
          🏳️ Fugir
        </button>
      </div>

      {erro && (
        <div className="p-3 pixel-box bg-red-950/90 border-2 border-red-700 text-red-300 font-silkscreen text-xs">
          ⚠️ {erro}
        </div>
      )}

      {/* ============================================================== */}
      {/* CENÁRIO ISOMÉTRICO RETRÔ DE DUELO 2D (LAYOUT VALIDADO)          */}
      {/* ============================================================== */}
      <div className="relative border-4 border-[var(--border-card)] min-h-[520px] md:min-h-[580px] flex flex-col justify-between overflow-hidden shadow-pixel">
        
        {/* 1. FUNDO PIXEL ART DO BIOMA ESCOLHIDO */}
        <div className="absolute inset-0 pointer-events-none">
          <FundoBiomaPixel bioma={sessaoCombate.monstro.bioma} />
        </div>

        {/* ============================================================ */}
        {/* 2. LADO DO MONSTRO: HUD E PLATAFORMA (SUPERIOR-DIREITO)      */}
        {/* ============================================================ */}

        {/* HUD DO MONSTRO (TOP-RIGHT) */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 pointer-events-none">
          <div className="w-[260px] md:w-[300px] pixel-box p-3 shadow-pixel bg-[var(--bg-panel)]/95 border-2 border-[var(--border-light)] pointer-events-auto">
            <div className="flex justify-between items-center mb-1 font-silkscreen text-xs">
              <span className="text-red-400 font-bold flex items-center gap-1.5 truncate">
                <IconeCaveira tamanho={16} /> {sessaoCombate.monstro.nome}
              </span>
              <span className="text-slate-400 text-[10px]">Nv. {sessaoCombate.monstro.nivel}</span>
            </div>
            {/* HP */}
            <div className="pixel-bar-bg h-4 w-full relative overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-red-900 to-red-600 transition-all duration-300"
                style={{ width: `${Math.max(0, (vidaMonstro / sessaoCombate.monstro.vidaMaxima) * 100)}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center font-pixel text-[8px] text-white drop-shadow-[0_1px_1px_#000]">
                HP {Math.max(0, vidaMonstro)} / {sessaoCombate.monstro.vidaMaxima}
              </span>
            </div>
            {/* Energia */}
            <div className="pixel-bar-bg h-3.5 w-full relative overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-amber-950 to-amber-500 transition-all duration-300"
                style={{ width: `${Math.max(0, (energiaMonstro / sessaoCombate.monstro.energiaMaxima) * 100)}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center font-pixel text-[7.5px] text-white drop-shadow-[0_1px_1px_#000]">
                EN {Math.max(0, energiaMonstro)} / {sessaoCombate.monstro.energiaMaxima}
              </span>
            </div>
            <div className="flex justify-between text-[10px] font-silkscreen text-[var(--text-muted)]">
              <span>{sessaoCombate.monstro.tipoMonstro}</span>
              <span className="text-red-400">INIMIGO</span>
            </div>
          </div>
        </div>

        {/* PLATAFORMA & SPRITE DO MONSTRO (FINCADO NO CHÃO) */}
        <div className="absolute top-[32%] md:top-[34%] right-[10%] md:right-[16%] z-10 flex flex-col items-center">
          <div className="relative -mb-10 z-10">
            <div
              className={`w-[128px] h-[128px] pixelated origin-bottom transition-transform transform scale-150 md:scale-[2.1] -scale-x-150 md:-scale-x-[2.1] ${obterClasseSpriteMonstro()}`}
            ></div>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="plataforma-combate w-48 h-16 md:w-56 md:h-20"></div>
            <div className="w-40 h-3 bg-black/70 border-b border-[var(--plataforma-borda)] blur-[1px] -mt-1"></div>
          </div>
        </div>


        {/* ============================================================ */}
        {/* 3. LADO DO HERÓI: SPRITE EM CIMA, VIDA EM BAIXO             */}
        {/* ============================================================ */}

        {/* PLATAFORMA & SPRITE DO HERÓI (POSICIONADO ACIMA DA SUA VIDA) */}
        <div className="absolute bottom-[28%] md:bottom-[26%] left-[8%] md:left-[14%] z-10 flex flex-col items-center">
          
          {/* Efeito Visual Flutuante de Cura/Energia */}
          {efeitoVisualHeroi && (
            <div className="absolute -top-16 z-30 anim-cura-subir pointer-events-none flex flex-col items-center">
              <div
                className={`px-2.5 py-1 pixel-box font-pixel text-xs drop-shadow-[0_2px_4px_#000] ${
                  efeitoVisualHeroi.tipo === "CURA"
                    ? "text-emerald-300 border-emerald-500 bg-emerald-950/90"
                    : efeitoVisualHeroi.tipo === "ENERGIA"
                    ? "text-cyan-300 border-cyan-500 bg-cyan-950/90"
                    : "text-amber-300 border-amber-500 bg-amber-950/90"
                }`}
              >
                {efeitoVisualHeroi.texto}
              </div>
            </div>
          )}

          {/* Sprite do Herói */}
          <div className="relative -mb-12 z-10">
            <div
              className={`w-[128px] h-[128px] pixelated origin-bottom transition-all transform scale-[2.0] md:scale-[2.6] ${
                efeitoVisualHeroi?.tipo === "CURA"
                  ? "anim-aura-cura"
                  : efeitoVisualHeroi?.tipo === "ENERGIA"
                  ? "anim-aura-energia"
                  : ""
              } ${
                animHeroi === "idle"
                  ? "sprite-heroi-idle"
                  : animHeroi === "attack"
                  ? "sprite-heroi-attack"
                  : animHeroi === "defend"
                  ? "sprite-heroi-defend"
                  : "sprite-heroi-hurt"
              }`}
            ></div>
          </div>

          {/* Plataforma Isométrica do Herói */}
          <div className="relative flex flex-col items-center">
            <div className="plataforma-combate w-56 h-20 md:w-64 md:h-24"></div>
            <div className="w-48 h-3.5 bg-black/70 blur-[1px] -mt-1"></div>
          </div>
        </div>

        {/* HUD DO HERÓI: POSICIONADO ESTREITAMENTE EM BAIXO DO HERÓI */}
        <div className="absolute bottom-12 md:bottom-14 left-4 md:left-8 z-20 pointer-events-none">
          <div className="w-[260px] md:w-[300px] pixel-box p-3 shadow-pixel bg-[var(--bg-panel)]/95 border-2 border-[var(--border-light)] pointer-events-auto">
            <div className="flex justify-between items-center mb-1 font-silkscreen text-xs">
              <span className="text-[var(--accent-gold)] font-bold truncate max-w-[170px]">
                {sessaoCombate.heroi.nome}
              </span>
              <span className="text-slate-400 text-[10px]">
                Nv. {sessaoCombate.heroi.nivel} {sessaoCombate.heroi.classe}
              </span>
            </div>
            {/* HP */}
            <div className="pixel-bar-bg h-4 w-full relative overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-rose-950 to-rose-600 transition-all duration-300"
                style={{ width: `${Math.max(0, (vidaHeroi / sessaoCombate.heroi.vidaMaxima) * 100)}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center font-pixel text-[8px] text-white drop-shadow-[0_1px_1px_#000]">
                HP {Math.max(0, vidaHeroi)} / {sessaoCombate.heroi.vidaMaxima}
              </span>
            </div>
            {/* Energia */}
            <div className="pixel-bar-bg h-3.5 w-full relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-950 to-cyan-500 transition-all duration-300"
                style={{ width: `${Math.max(0, (energiaHeroi / sessaoCombate.heroi.energiaMaxima) * 100)}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center font-pixel text-[7.5px] text-white drop-shadow-[0_1px_1px_#000]">
                EN {Math.max(0, energiaHeroi)} / {sessaoCombate.heroi.energiaMaxima}
              </span>
            </div>
          </div>
        </div>

        {/* 4. LOG NARRATIVO RETRÔ NA BASE DA ARENA */}
        <div className="mt-auto relative z-20 border-t-2 border-[var(--border-card)] p-2.5 px-4 bg-[var(--bg-page)]/90 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-silkscreen text-xs text-[var(--accent-gold)] shrink-0">📜 LOG:</span>
            <span className="font-medieval text-sm md:text-base text-[var(--accent-gold-light)] truncate">
              {logsBatalha[0]}
            </span>
          </div>
          <span className="font-silkscreen text-[10px] text-[var(--text-muted)] shrink-0 ml-2">
            Rodada {rodada}
          </span>
        </div>

      </div>

      {/* ============================================================== */}
      {/* BOTOEIRA TÁTICA DE COMBATE (AÇÕES DO JOGADOR)                   */}
      {/* ============================================================== */}
      <div className="pixel-box p-4 bg-[var(--bg-panel)] border-2 border-[var(--border-card)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap gap-2">
            {/* Ataque Rápido */}
            <button
              onClick={() => executarTurno({ tipo: "ATACAR", tipoAtaque: "RAPIDO" })}
              disabled={processandoTurno || energiaHeroi < 10}
              className="pixel-btn pixel-btn-sangue text-xs py-2 px-3.5 disabled:opacity-40"
              title="Ataque veloz com baixo consumo de energia"
            >
              ⚔️ Rápido (-10 EN)
            </button>

            {/* Golpe Pesado */}
            <button
              onClick={() => executarTurno({ tipo: "ATACAR", tipoAtaque: "PESADO" })}
              disabled={processandoTurno || energiaHeroi < 20}
              className="pixel-btn pixel-btn-sangue text-xs py-2 px-3.5 disabled:opacity-40"
              title="Golpe pesado com dano e impacto aumentados"
            >
              💥 Pesado (-20 EN)
            </button>

            {/* Ataque Brutal */}
            <button
              onClick={() => executarTurno({ tipo: "ATACAR", tipoAtaque: "BRUTAL" })}
              disabled={processandoTurno || energiaHeroi < 35}
              className="pixel-btn pixel-btn-sangue text-xs py-2 px-3.5 disabled:opacity-40"
              title="Ataque devastador de alto dano e chance crítica"
            >
              ⚡ Brutal (-35 EN)
            </button>

            {/* Postura Defensiva */}
            <button
              onClick={() => executarTurno({ tipo: "DEFENDER" })}
              disabled={processandoTurno}
              className="pixel-btn text-xs py-2 px-3.5"
              title="Assume guarda firme, mitiga dano e recupera +15 de energia"
            >
              🛡️ Defender (+15 EN)
            </button>

            {/* Mochila de Itens */}
            <button
              onClick={() => setModalMochilaAberta(true)}
              disabled={processandoTurno}
              className="pixel-btn pixel-btn-ouro text-xs py-2 px-3.5 flex items-center gap-1.5"
            >
              🧪 Usar Item
            </button>
          </div>

          <div className="text-[11px] font-silkscreen text-[var(--text-muted)]">
            {processandoTurno ? (
              <span className="text-[var(--accent-gold)] animate-pulse">ORQUESTRANDO TURNO...</span>
            ) : (
              <span>Seu turno de comando</span>
            )}
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* POPUP RETRÔ DA MOCHILA DE CONSUMÍVEIS (ITENS DO HERÓI)         */}
      {/* ============================================================== */}
      {modalMochilaAberta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg pixel-box p-6 bg-[var(--bg-card)] border-4 border-[var(--accent-gold)] shadow-pixel-ouro">
            <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎒</span>
                <h3 className="font-pixel text-xs md:text-sm text-[var(--accent-gold-light)]">
                  MOCHILA DO CAMPEÃO
                </h3>
              </div>
              <button
                onClick={() => setModalMochilaAberta(false)}
                className="font-pixel text-xs text-[var(--text-muted)] hover:text-white px-2 py-1"
              >
                [X]
              </button>
            </div>

            {(!heroiAtivo?.inventario || heroiAtivo.inventario.length === 0) ? (
              <div className="p-6 text-center bg-[var(--bg-subcard)] border border-[var(--border-card)] my-4">
                <p className="font-medieval text-base text-[var(--text-muted)]">
                  Você não possui consumíveis na mochila para usar nesta batalha.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 my-3">
                {heroiAtivo.inventario.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="pixel-box p-3 bg-[var(--bg-subcard)] border border-[var(--border-card)] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 bg-black/50 border border-[var(--border-card)] shrink-0">
                        {renderizarIconeItem(item.tipo)}
                      </div>
                      <div>
                        <span className="font-silkscreen text-xs font-bold text-[var(--text-primary)] block">
                          {item.nome}
                        </span>
                        <span className="font-medieval text-xs text-[var(--text-muted)]">
                          {item.descricao}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => usarItemMochila(idx, item)}
                      className="pixel-btn pixel-btn-ouro text-[10px] py-1.5 px-3 shrink-0"
                    >
                      CONSUMIR
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-[var(--border-card)]">
              <button
                onClick={() => setModalMochilaAberta(false)}
                className="pixel-btn text-xs py-1.5 px-4"
              >
                Fechar Mochila
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Fim de Batalha (Vitória ou Morte Definitiva) */}
      {modalFimBatalha.aberto && (
        <ModalFimBatalha
          tipo={modalFimBatalha.tipo}
          nomeMonstro={sessaoCombate.monstro.nome}
          xpGanho={modalFimBatalha.xpGanho}
          subiuNivel={modalFimBatalha.subiuNivel}
          novoNivel={modalFimBatalha.novoNivel}
          loot={modalFimBatalha.loot}
          aoFechar={() => aoTerminarDuelo(modalFimBatalha.tipo === "VITORIA")}
        />
      )}

      {/* Confirmação de Fuga */}
      <ModalConfirmacao
        aberto={modalFugaAberto}
        titulo="FUGIR DO DUELO"
        mensagem="Deseja abandonar a batalha e recuar aos portões do Feudo? O monstro continuará à espreita no bioma."
        textoConfirmar="SIM, RECUAR"
        textoCancelar="CONTINUAR LUTANDO"
        perigoso={false}
        aoConfirmar={() => {
          setModalFugaAberto(false);
          aoTerminarDuelo(false);
        }}
        aoCancelar={() => setModalFugaAberto(false)}
      />

    </div>
  );
};
