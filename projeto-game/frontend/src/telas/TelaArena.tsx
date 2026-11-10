import { useEffect, useRef, useState, type FC } from "react";
import { useJogo } from "../contextos/JogoContext";
import { CombateServico } from "../servicos/CombateServico";
import { ErroHttp } from "../servicos/clienteHttp";
import { FundoBiomaPixel } from "../componentes/FundoBiomaPixel";
import { ModalFimBatalha } from "../componentes/ModalFimBatalha";
import { ModalConfirmacao } from "../componentes/ModalConfirmacao";
import { formatarNomeClasse } from "../componentes/NavegadorSuperior";
import { SpriteAnimado } from "../componentes/SpriteAnimado";
import { SPRITES_HEROIS, SPRITES_MONSTROS, type SpritesCombatente } from "../dados/catalogoSprites";
import {
  IconeCaveira,
  IconeItemPixel,
  BadgeAtributosItem
} from "../componentes/IconesPixelArt";
import type { TipoAcaoCombate, TipoAtaque, ItemInventarioDTO } from "../tipos/api";

interface PropsTelaArena {
  aoTerminarDuelo: (vitoria: boolean) => void;
}

type ChaveAnim = "idle" | "a1" | "a2" | "a3" | "esp" | "def" | "hurt" | "dead";

interface EstadoAnim {
  chave: ChaveAnim;
  seq: number; // muda a cada troca para reiniciar o sprite (key do React)
}

// Fator global de cadência: >1 deixa todas as animações de combate mais lentas
const LENTIDAO = 1.6;

// Custos fixos e táticos de energia, idênticos ao backend (Personagem.ataque)
const CUSTO_ATAQUE: Record<TipoAtaque, number> = { RAPIDO: 10, PESADO: 18, BRUTAL: 26 };
const MULT_ATAQUE: Record<TipoAtaque, number> = { RAPIDO: 1.0, PESADO: 1.8, BRUTAL: 2.5 };
const NOME_GOLPE: Record<"a1" | "a2" | "a3" | "esp", string> = {
  a1: "GOLPE RÁPIDO!",
  a2: "GOLPE PESADO!",
  a3: "ATAQUE BRUTAL (QUEBRA-GUARDA)!",
  esp: "HABILIDADE SUPREMA!"
};

const esperar = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** Lê a mensagem real da IA do monstro (MotorCombate) e descobre qual ação ela executou. */
function interpretarAcaoMonstro(msg: string | undefined, danoNoHeroi: number): ChaveAnim | "falha" {
  if (!msg) return danoNoHeroi > 0 ? "a1" : "falha";
  if (/postura defensiva|guarda defensiva|recompor f.lego/i.test(msg)) return "def";
  if (/Golpe R.pido/i.test(msg)) return "a1";
  if (/Golpe Pesado/i.test(msg)) return "a2";
  if (/Ataque Brutal/i.test(msg)) return "a3";
  if (/GOLPE DEVASTADOR|ATAQUE DE ELITE|F.RIA SELVAGEM|bote|investida|canalizou/i.test(msg)) return "esp";
  return danoNoHeroi > 0 ? "esp" : "falha";
}

export const TelaArena: FC<PropsTelaArena> = ({ aoTerminarDuelo }) => {
  const { sessaoCombate, recarregarHeroiAtivo, heroiAtivo } = useJogo();

  if (!sessaoCombate) {
    return (
      <div className="w-full max-w-md mx-auto text-center p-8 pixel-box bg-[var(--bg-panel)]">
        <p className="font-medieval text-lg text-[var(--text-muted)] mb-4">Nenhuma batalha ativa no momento.</p>
        <button onClick={() => aoTerminarDuelo(false)} className="pixel-btn pixel-btn-ouro text-xs py-2 px-4">
          Voltar ao Feudo
        </button>
      </div>
    );
  }

  const classeHeroi =
    (sessaoCombate.heroi as any).classe || (sessaoCombate.heroi as any).classeHeroi || heroiAtivo?.classeHeroi || "GUERREIRO";
  const spritesHeroi: SpritesCombatente = SPRITES_HEROIS[classeHeroi] ?? SPRITES_HEROIS.GUERREIRO;
  const spritesMonstro: SpritesCombatente = SPRITES_MONSTROS[sessaoCombate.monstro.id] ?? SPRITES_MONSTROS[1];
  const energiaMaxHeroi = sessaoCombate.heroi.energiaMaxima;
  const custoDe = (t: TipoAtaque) => CUSTO_ATAQUE[t];
  const recargaDefesaHeroi = Math.max(25, Math.round(energiaMaxHeroi * 0.30));

  // Estado vital sincronizado com o backend (se o monstro venceu o sorteio, começamos com a vida/energia ANTES do golpe de abertura para animá-lo ao vivo!)
  const acaoAbertura = sessaoCombate.acaoInicialMonstro;
  const [vidaHeroi, setVidaHeroi] = useState<number>(
    acaoAbertura ? acaoAbertura.vidaHeroiAntes : sessaoCombate.heroi.vidaAtual
  );
  const [energiaHeroi, setEnergiaHeroi] = useState<number>(sessaoCombate.heroi.energiaAtual);
  const [vidaMonstro, setVidaMonstro] = useState<number>(sessaoCombate.monstro.vidaAtual);
  const [energiaMonstro, setEnergiaMonstro] = useState<number>(
    acaoAbertura ? acaoAbertura.energiaMonstroAntes : sessaoCombate.monstro.energiaAtual
  );
  const [itensMochila, setItensMochila] = useState<ItemInventarioDTO[]>(() => heroiAtivo?.inventario ?? []);
  const [buffDanoAtivo, setBuffDanoAtivo] = useState<number>(0);

  useEffect(() => {
    if (heroiAtivo?.inventario) {
      setItensMochila(heroiAtivo.inventario);
    }
  }, [heroiAtivo?.inventario]);

  const [logsBatalha, setLogsBatalha] = useState<string[]>([sessaoCombate.mensagem]);
  const [rodada, setRodada] = useState<number>(1);
  const [processandoTurno, setProcessandoTurno] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // Animações
  const [animHeroi, setAnimHeroiRaw] = useState<EstadoAnim>({ chave: "idle", seq: 0 });
  const [animMonstro, setAnimMonstroRaw] = useState<EstadoAnim>({ chave: "idle", seq: 0 });
  const setAnimHeroi = (chave: ChaveAnim) => setAnimHeroiRaw(a => ({ chave, seq: a.seq + 1 }));
  const setAnimMonstro = (chave: ChaveAnim) => setAnimMonstroRaw(a => ({ chave, seq: a.seq + 1 }));

  const [lungeHeroi, setLungeHeroi] = useState<number>(0); // duração do avanço em ms (0 = parado)
  const [lungeMonstro, setLungeMonstro] = useState<number>(0);
  const [tremerHeroi, setTremerHeroi] = useState<boolean>(false);
  const [tremerMonstro, setTremerMonstro] = useState<boolean>(false);

  const [efeitoVisualHeroi, setEfeitoVisualHeroi] = useState<{ texto: string; tipo: "CURA" | "ENERGIA" | "DANO" } | null>(null);
  const [efeitoVisualMonstro, setEfeitoVisualMonstro] = useState<{ texto: string; tipo: "CURA" | "ENERGIA" | "DANO" } | null>(null);
  const [rotuloHeroi, setRotuloHeroi] = useState<{ texto: string; seq: number } | null>(null);
  const [rotuloMonstro, setRotuloMonstro] = useState<{ texto: string; seq: number } | null>(null);

  // Inicia como null para NUNCA sobrepor o sorteio de iniciativa!
  const [bannerTurno, setBannerTurno] = useState<{ titulo: string; subtitulo: string; tipo: "HEROI" | "MONSTRO" } | null>(null);
  const timerBannerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modais de Mochila, Fuga e Fim
  const [modalMochilaAberta, setModalMochilaAberta] = useState<boolean>(false);
  const [modalFimBatalha, setModalFimBatalha] = useState<{
    aberto: boolean;
    tipo: "VITORIA" | "DERROTA";
    xpGanho?: number;
    subiuNivel?: boolean;
    novoNivel?: number;
    loot?: any;
  }>({ aberto: false, tipo: "VITORIA" });
  const [modalFugaAberto, setModalFugaAberto] = useState<boolean>(false);

  // Máquina de estados sequencial do Sorteio de Iniciativa (sem sobreposição com banners de turno)
  const [faseSorteio, setFaseSorteio] = useState<"SORTEANDO" | "RESULTADO" | null>("SORTEANDO");
  const [vencedorSorteio] = useState<"HEROI" | "MONSTRO">(() => {
    const ehHeroi = (sessaoCombate.primeiroAJogar as string) === "HEROI" || sessaoCombate.primeiroAJogar === "JOGADOR";
    return ehHeroi ? "HEROI" : "MONSTRO";
  });

  useEffect(() => {
    let cancelado = false;

    const conduzirAberturaCombate = async () => {
      // Etapa 1 (0ms -> 2000ms): "Sorteando quem começa o combate..."
      await esperar(2000);
      if (cancelado) return;
      setFaseSorteio("RESULTADO");

      // Etapa 2 (2000ms -> 4500ms): "[Nome] foi mais ágil e mais sortudo, [Nome] começa!"
      await esperar(2500);
      if (cancelado) return;
      setFaseSorteio(null);

      // Se o MONSTRO venceu o sorteio, ele realmente executa o primeiro ataque ANTES de liberar a vez do jogador!
      if (vencedorSorteio === "MONSTRO") {
        setBannerTurno({
          titulo: "💀 VEZ DO MONSTRO!",
          subtitulo: `${sessaoCombate.monstro.nome} venceu o sorteio e ataca primeiro!`,
          tipo: "MONSTRO"
        });
        await esperar(2000);
        if (cancelado) return;
        setBannerTurno(null);
        await esperar(300);
        if (cancelado) return;

        const msgAbertura =
          acaoAbertura?.mensagem ||
          `${sessaoCombate.monstro.nome} avançou primeiro e desferiu um golpe de abertura!`;
        const danoAbertura = acaoAbertura?.danoCausado ?? 0;
        const vidaHeroiPosAbertura = acaoAbertura?.vidaHeroiDepois ?? sessaoCombate.heroi.vidaAtual;
        const energiaMonstroPosAbertura = acaoAbertura?.energiaMonstroDepois ?? sessaoCombate.monstro.energiaAtual;

        setLogsBatalha(prev => [msgAbertura, ...prev]);
        const chaveAbertura = interpretarAcaoMonstro(msgAbertura, danoAbertura);

        if (chaveAbertura === "def") {
          setAnimMonstro(spritesMonstro.def ? "def" : "idle");
          setRotuloMonstro({ texto: "POSTURA DEFENSIVA!", seq: Date.now() });
          setEfeitoVisualMonstro({ texto: "+30% EN", tipo: "ENERGIA" });
          setEnergiaMonstro(energiaMonstroPosAbertura);
          await esperar(1500);
          if (cancelado) return;
          setAnimMonstro("idle");
          setEfeitoVisualMonstro(null);
          setRotuloMonstro(null);
        } else {
          const golpeAbertura: "a1" | "a2" | "a3" | "esp" =
            chaveAbertura === "falha" ? "a1" : (chaveAbertura as "a1" | "a2" | "a3" | "esp");
          setEnergiaMonstro(energiaMonstroPosAbertura);
          await coreografarGolpe("MONSTRO", golpeAbertura, danoAbertura, () => {
            setVidaHeroi(Math.max(1, vidaHeroiPosAbertura));
          });
          if (cancelado) return;
        }

        await esperar(500);
        if (cancelado) return;
      }

      // Agora sim: anuncia a vez do jogador e destrava os botões!
      setBannerTurno({
        titulo: "⚔️ SUA VEZ DE JOGAR!",
        subtitulo:
          vencedorSorteio === "HEROI"
            ? "Sua iniciativa prevaleceu! Escolha sua manobra de combate!"
            : "Sobreviveu à investida inicial! Contra-ataque agora!",
        tipo: "HEROI"
      });
      setProcessandoTurno(false);

      timerBannerRef.current = setTimeout(() => {
        if (!cancelado) setBannerTurno(null);
      }, 1600);
    };

    conduzirAberturaCombate();

    return () => {
      cancelado = true;
      if (timerBannerRef.current) clearTimeout(timerBannerRef.current);
    };
  }, [vencedorSorteio]);

  const forcaHeroi = heroiAtivo?.forca ?? 8;
  const danoEstimado = (mult: number) => Math.round(forcaHeroi * mult) + (buffDanoAtivo > 3 ? buffDanoAtivo : 0);

  const duracao = (s: SpritesCombatente, chave: ChaveAnim) => {
    const a = (s as any)[chave] ?? s.idle;
    return Math.round(a.ms * LENTIDAO);
  };

  /** Coreografia completa de um golpe: avanço + sprite do golpe inteiro + impacto no meio + reação do alvo. */
  const coreografarGolpe = async (
    atacante: "HEROI" | "MONSTRO",
    golpe: "a1" | "a2" | "a3" | "esp",
    dano: number,
    aplicarImpacto: () => void
  ) => {
    const sprites = atacante === "HEROI" ? spritesHeroi : spritesMonstro;
    const spritesAlvo = atacante === "HEROI" ? spritesMonstro : spritesHeroi;
    const chaveReal: ChaveAnim = (sprites as any)[golpe] ? golpe : "a1";
    const dur = Math.max(900, duracao(sprites, chaveReal));
    const rotulo = { texto: NOME_GOLPE[golpe], seq: Date.now() };

    if (atacante === "HEROI") {
      setRotuloHeroi(rotulo);
      setAnimHeroi(chaveReal);
      setLungeHeroi(dur);
    } else {
      setRotuloMonstro(rotulo);
      setAnimMonstro(chaveReal);
      setLungeMonstro(dur);
    }

    // Impacto no ponto alto do golpe
    await esperar(Math.round(dur * 0.55));
    aplicarImpacto();
    const durHurt = Math.max(700, duracao(spritesAlvo, "hurt"));
    if (atacante === "HEROI") {
      setEfeitoVisualMonstro({ texto: dano > 0 ? `-${dano} HP` : "BLOQUEOU!", tipo: "DANO" });
      if (dano > 0) {
        setAnimMonstro("hurt");
        setTremerMonstro(true);
      }
    } else {
      setEfeitoVisualHeroi({ texto: dano > 0 ? `-${dano} HP` : "BLOQUEOU!", tipo: "DANO" });
      if (dano > 0) {
        setAnimHeroi("hurt");
        setTremerHeroi(true);
      }
    }

    // Termina o restante do golpe e a reação do alvo
    await esperar(Math.max(Math.round(dur * 0.45), durHurt));

    if (atacante === "HEROI") {
      setAnimHeroi("idle");
      setAnimMonstro("idle");
      setLungeHeroi(0);
      setTremerMonstro(false);
      setEfeitoVisualMonstro(null);
      setRotuloHeroi(null);
    } else {
      setAnimMonstro("idle");
      setAnimHeroi("idle");
      setLungeMonstro(0);
      setTremerHeroi(false);
      setEfeitoVisualHeroi(null);
      setRotuloMonstro(null);
    }
  };

  const executarTurno = async (acao: { tipo: TipoAcaoCombate; tipoAtaque?: TipoAtaque; indiceItem?: number }) => {
    if (processandoTurno || modalFimBatalha.aberto) return;
    if (timerBannerRef.current) {
      clearTimeout(timerBannerRef.current);
      timerBannerRef.current = null;
    }
    setFaseSorteio(null);
    setProcessandoTurno(true);
    setErro(null);
    setBannerTurno(null);
    setRotuloHeroi(null);
    setRotuloMonstro(null);

    try {
      const resposta = await CombateServico.enviarTurno({ sessaoId: sessaoCombate.sessaoId, acao });
      const res: any = resposta.resultado;

      const vHeroi = res.vidaHeroiAtual ?? res.heroiStatus?.vidaAtual ?? vidaHeroi;
      const eHeroi = res.energiaHeroiAtual ?? res.heroiStatus?.energiaAtual ?? energiaHeroi;
      const vMonstro = res.vidaMonstroAtual ?? res.monstroStatus?.vidaAtual ?? vidaMonstro;
      const eMonstro = res.energiaMonstroAtual ?? res.monstroStatus?.energiaAtual ?? energiaMonstro;
      const logsNovos: string[] = res.logsRodada ?? res.mensagensTurno ?? [];
      const [msgHeroi, msgMonstro] = logsNovos;

      if (Array.isArray(res.inventarioHeroi)) {
        setItensMochila(res.inventarioHeroi);
      }
      if (typeof res.modificadorDanoHeroi === "number") {
        setBuffDanoAtivo(res.modificadorDanoHeroi > 1 ? res.modificadorDanoHeroi : 0);
      }

      const danoNoMonstro = Math.max(0, vidaMonstro - vMonstro);
      const danoNoHeroi = Math.max(0, vidaHeroi - vHeroi);
      const vitoria = res.estado === "VITORIA_JOGADOR" || vMonstro <= 0;
      const derrota = res.estado === "DERROTA_JOGADOR" || vHeroi <= 0;

      // ================= 1. FASE DO HERÓI =================
      if (msgHeroi) setLogsBatalha(prev => [msgHeroi, ...prev]);

      if (acao.tipo === "ATACAR") {
        const golpe = acao.tipoAtaque === "BRUTAL" ? "a3" : acao.tipoAtaque === "PESADO" ? "a2" : "a1";
        // O custo de energia é pago NO MOMENTO do golpe do herói
        setEnergiaHeroi(eHeroi);
        setBuffDanoAtivo(0);
        await coreografarGolpe("HEROI", golpe, danoNoMonstro, () => setVidaMonstro(Math.max(0, vMonstro)));
      } else if (acao.tipo === "DEFENDER") {
        setAnimHeroi("def");
        setRotuloHeroi({ texto: "POSTURA DEFENSIVA!", seq: Date.now() });
        setEfeitoVisualHeroi({ texto: `+${recargaDefesaHeroi} EN`, tipo: "ENERGIA" });
        setEnergiaHeroi(eHeroi);
        await esperar(Math.max(1400, duracao(spritesHeroi, "def")));
        setAnimHeroi("idle");
        setEfeitoVisualHeroi(null);
        setRotuloHeroi(null);
      } else if (acao.tipo === "USAR_ITEM") {
        setAnimHeroi(spritesHeroi.def ? "def" : "idle");
        // HP/EN restaurados pelo item são aplicados antes do contra-ataque
        const hpAntesDoMonstro = vidaHeroi + Math.max(0, vHeroi + danoNoHeroi - vidaHeroi);
        setVidaHeroi(Math.min(sessaoCombate.heroi.vidaMaxima, hpAntesDoMonstro));
        setEnergiaHeroi(eHeroi);
        recarregarHeroiAtivo();
        await esperar(1500);
        setAnimHeroi("idle");
        setEfeitoVisualHeroi(null);
        setRotuloHeroi(null);
      }

      // ================= VITÓRIA =================
      if (vitoria) {
        setVidaMonstro(0);
        setAnimMonstro("dead");
        await esperar(Math.max(1500, duracao(spritesMonstro, "dead")) + 600);
        await recarregarHeroiAtivo();
        setModalFimBatalha({
          aberto: true,
          tipo: "VITORIA",
          xpGanho: res.recompensas?.xpGanho ?? res.experienciaGanha,
          subiuNivel: res.recompensas?.subiuNivel,
          novoNivel: res.recompensas?.nivelAtual,
          loot: res.recompensas?.itemLoot ?? res.lootConcedido
        });
        return;
      }

      await esperar(700);

      // ================= 2. ANÚNCIO: VEZ DO MONSTRO =================
      setBannerTurno({
        titulo: "💀 VEZ DO MONSTRO!",
        subtitulo: `${sessaoCombate.monstro.nome} observa você e prepara o próximo movimento...`,
        tipo: "MONSTRO"
      });
      await esperar(2200);
      setBannerTurno(null);
      await esperar(300);

      // ================= 3. AÇÃO DO MONSTRO (a que a IA realmente escolheu) =================
      if (msgMonstro) setLogsBatalha(prev => [msgMonstro, ...prev]);
      const acaoMonstro = interpretarAcaoMonstro(msgMonstro, danoNoHeroi);

      if (acaoMonstro === "def") {
        setAnimMonstro(spritesMonstro.def ? "def" : "idle");
        setRotuloMonstro({ texto: "POSTURA DEFENSIVA!", seq: Date.now() });
        setEfeitoVisualMonstro({ texto: "+30% EN", tipo: "ENERGIA" });
        setEnergiaMonstro(eMonstro);
        await esperar(1600);
        setAnimMonstro("idle");
        setEfeitoVisualMonstro(null);
        setRotuloMonstro(null);
      } else if (acaoMonstro === "falha") {
        setRotuloMonstro({ texto: "SEM FÔLEGO...", seq: Date.now() });
        setEnergiaMonstro(eMonstro);
        await esperar(1400);
        setRotuloMonstro(null);
      } else {
        setEnergiaMonstro(eMonstro);
        await coreografarGolpe("MONSTRO", acaoMonstro as "a1" | "a2" | "a3" | "esp", danoNoHeroi, () =>
          setVidaHeroi(Math.max(0, vHeroi))
        );
      }

      setVidaHeroi(Math.max(0, vHeroi));
      setEnergiaHeroi(eHeroi);
      setRodada(res.rodada || rodada + 1);

      // ================= DERROTA =================
      if (derrota) {
        setVidaHeroi(0);
        setAnimHeroi("dead");
        await esperar(Math.max(1500, duracao(spritesHeroi, "dead")) + 600);
        setModalFimBatalha({ aberto: true, tipo: "DERROTA" });
        return;
      }

      await esperar(600);

      // ================= 4. DE VOLTA AO JOGADOR =================
      setBannerTurno({ titulo: "⚔️ SUA VEZ DE JOGAR!", subtitulo: "Escolha sua manobra de combate", tipo: "HEROI" });
      await esperar(1700);
      setBannerTurno(null);
    } catch (err: any) {
      setErro(err instanceof ErroHttp ? err.message : "Falha ao processar turno.");
      setAnimHeroi("idle");
      setAnimMonstro("idle");
      setLungeHeroi(0);
      setLungeMonstro(0);
      setBannerTurno(null);
    } finally {
      setProcessandoTurno(false);
    }
  };

  const usarItemMochila = async (indiceItem: number, item: ItemInventarioDTO) => {
    setModalMochilaAberta(false);
    if (item.tipo === "COMPOSTO" || (item.valorEnergia && item.valorEnergia > 0)) {
      setEfeitoVisualHeroi({ texto: `+${item.valorEfeito} HP / +${item.valorEnergia} EN`, tipo: "CURA" });
    } else if (item.tipo === "POCAO_VIDA" || item.tipo === "CURA_VIDA") {
      setEfeitoVisualHeroi({ texto: `+${item.valorEfeito} HP`, tipo: "CURA" });
    } else if (item.tipo === "ELIXIR_ENERGIA" || item.tipo === "RECUPERA_ENERGIA") {
      setEfeitoVisualHeroi({ texto: `+${item.valorEfeito} EN`, tipo: "ENERGIA" });
    } else {
      setEfeitoVisualHeroi({ texto: `🗡️ +${item.valorEfeito} DANO PRÓX. GOLPE`, tipo: "DANO" });
      setBuffDanoAtivo(item.valorEfeito ?? 0);
    }
    setRotuloHeroi({ texto: item.nome.toUpperCase(), seq: Date.now() });
    await executarTurno({ tipo: "USAR_ITEM", indiceItem });
  };

  const animAtualHeroi = (spritesHeroi as any)[animHeroi.chave] ?? spritesHeroi.idle;
  const animAtualMonstro = (spritesMonstro as any)[animMonstro.chave] ?? spritesMonstro.idle;
  const heroiEmLoop = animHeroi.chave === "idle";
  const monstroEmLoop = animMonstro.chave === "idle";

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Barra de Status Superior do Duelo */}
      <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-xs text-[var(--accent-gold)]">RODADA {rodada}</span>
          <span className="font-silkscreen text-[11px] text-[var(--text-muted)]">• Bioma: {sessaoCombate.monstro.bioma}</span>
        </div>
        <button
          onClick={() => setModalFugaAberto(true)}
          disabled={processandoTurno}
          className="pixel-btn text-[10px] py-1 px-2.5 text-red-400 hover:text-red-300 disabled:opacity-40"
        >
          🏳️ Fugir
        </button>
      </div>

      {erro && (
        <div className="p-3 pixel-box bg-red-950/90 border-2 border-red-700 text-red-300 font-silkscreen text-xs">⚠️ {erro}</div>
      )}

      {/* ============================================================== */}
      {/* CENÁRIO DIAGONAL DE DUELO 2D (LAYOUT VALIDADO)                  */}
      {/* ============================================================== */}
      <div className="relative border-4 border-[var(--border-card)] min-h-[520px] md:min-h-[580px] flex flex-col justify-between overflow-hidden shadow-pixel">
        <div className="absolute inset-0 pointer-events-none">
          <FundoBiomaPixel bioma={sessaoCombate.monstro.bioma} />
        </div>

        {/* SORTEIO DE INICIATIVA NO CENTRO DO CAMPO DE BATALHA (SOLICITADO PELO USUÁRIO) */}
        {faseSorteio === "SORTEANDO" && (
          <div className="absolute inset-x-0 top-[40%] -translate-y-1/2 z-40 flex justify-center px-4">
            <div className="pixel-box p-4 md:p-5 bg-black/90 border-4 border-[var(--accent-gold)] shadow-pixel-ouro text-center max-w-md animate-pulse">
              <span className="text-3xl block mb-2 animate-bounce">🎲</span>
              <h3 className="font-pixel text-xs md:text-sm text-[var(--accent-gold-light)] mb-1">
                SORTEANDO QUEM COMEÇA O COMBATE...
              </h3>
              <p className="font-medieval text-xs text-slate-300">
                Rolando iniciativa de combate na arena...
              </p>
            </div>
          </div>
        )}

        {faseSorteio === "RESULTADO" && (
          <div className="absolute inset-x-0 top-[40%] -translate-y-1/2 z-40 flex justify-center px-4">
            <div className={`pixel-box p-4 md:p-5 border-4 text-center max-w-lg shadow-pixel-ouro ${
              vencedorSorteio === "HEROI"
                ? "bg-amber-950/95 border-[var(--accent-gold)] text-amber-200"
                : "bg-red-950/95 border-red-600 text-red-200"
            }`}>
              <span className="text-3xl block mb-2">
                {vencedorSorteio === "HEROI" ? "✨" : "💀"}
              </span>
              <h3 className="font-pixel text-xs md:text-sm tracking-wide mb-1">
                {vencedorSorteio === "HEROI"
                  ? `${sessaoCombate.heroi.nome} foi mais ágil e mais sortudo, ${sessaoCombate.heroi.nome} começa!`
                  : `${sessaoCombate.monstro.nome} foi mais ágil e mais sortudo, ${sessaoCombate.monstro.nome} começa!`}
              </h3>
              <p className="font-medieval text-xs text-slate-300">
                {vencedorSorteio === "HEROI"
                  ? "Assuma a iniciativa e escolha o seu primeiro ataque!"
                  : "A criatura abriu a iniciativa e prepara seu bote!"}
              </p>
            </div>
          </div>
        )}

        {/* BANNER DE TURNO (SÓ RENDERIZA QUANDO O SORTEIO JÁ TERMINOU) */}
        {!faseSorteio && bannerTurno && (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 z-40 flex justify-center pointer-events-none px-4">
            <div
              className={`anim-banner-turno p-4 md:p-5 pixel-box text-center max-w-md w-full ${
                bannerTurno.tipo === "HEROI"
                  ? "bg-amber-950/95 border-4 border-amber-400 text-amber-200 shadow-pixel-ouro"
                  : "bg-red-950/95 border-4 border-red-500 text-red-200 shadow-pixel-sangue"
              }`}
            >
              <h2 className="font-pixel text-sm md:text-base mb-1.5 tracking-wider drop-shadow-[0_2px_4px_#000]">{bannerTurno.titulo}</h2>
              <p className="font-medieval text-sm opacity-90">{bannerTurno.subtitulo}</p>
              {bannerTurno.tipo === "MONSTRO" && (
                <div className="mt-2 font-pixel text-[10px] text-red-300 animate-pulse">. . .</div>
              )}
            </div>
          </div>
        )}

        {/* HUD DO MONSTRO (TOP-RIGHT) */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 pointer-events-none">
          <div className="w-[260px] md:w-[300px] pixel-box p-3 shadow-pixel bg-[var(--bg-panel)]/95 border-2 border-[var(--border-light)]">
            <div className="flex justify-between items-center mb-1 font-silkscreen text-xs">
              <span className="text-red-400 font-bold flex items-center gap-1.5 truncate">
                <IconeCaveira tamanho={16} /> {sessaoCombate.monstro.nome}
              </span>
              <span className="text-slate-400 text-[10px]">Nv. {sessaoCombate.monstro.nivel}</span>
            </div>
            <div className="pixel-bar-bg h-4 w-full relative overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-red-900 to-red-600 transition-all duration-700"
                style={{ width: `${Math.max(0, (vidaMonstro / sessaoCombate.monstro.vidaMaxima) * 100)}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center font-pixel text-[8px] text-white drop-shadow-[0_1px_1px_#000]">
                HP {Math.max(0, vidaMonstro)} / {sessaoCombate.monstro.vidaMaxima}
              </span>
            </div>
            <div className="pixel-bar-bg h-3.5 w-full relative overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-amber-950 to-amber-500 transition-all duration-700"
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

        {/* PLATAFORMA & SPRITE DO MONSTRO */}
        <div className="absolute top-[32%] md:top-[34%] right-[10%] md:right-[16%] z-10 flex flex-col items-center">
          {rotuloMonstro && (
            <div key={rotuloMonstro.seq} className="absolute -top-24 z-30 anim-rotulo-golpe pointer-events-none whitespace-nowrap">
              <span className="font-pixel text-[11px] px-2 py-1 bg-black/85 border-2 border-red-500 text-red-300 drop-shadow-[0_2px_4px_#000]">
                {rotuloMonstro.texto}
              </span>
            </div>
          )}
          {efeitoVisualMonstro && (
            <div className="absolute -top-14 z-30 anim-cura-subir pointer-events-none flex flex-col items-center">
              <div
                className={`px-2.5 py-1 pixel-box font-pixel text-xs drop-shadow-[0_2px_4px_#000] font-bold border-2 ${
                  efeitoVisualMonstro.tipo === "ENERGIA"
                    ? "text-cyan-300 border-cyan-500 bg-cyan-950/90"
                    : "text-red-200 border-red-500 bg-red-950/95"
                }`}
              >
                {efeitoVisualMonstro.texto}
              </div>
            </div>
          )}

          <div
            className={`relative -mb-10 z-10 ${lungeMonstro ? "anim-avanco-monstro" : ""} ${tremerMonstro ? "anim-dano-tremer" : ""}`}
            style={lungeMonstro ? { animationDuration: `${lungeMonstro}ms` } : undefined}
          >
            <div className="origin-bottom scale-150 md:scale-[2.1]">
              <SpriteAnimado
                key={`m-${animMonstro.seq}`}
                anim={animAtualMonstro}
                loop={monstroEmLoop}
                velocidade={monstroEmLoop ? 1 : LENTIDAO}
                espelhar
              />
            </div>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="plataforma-combate w-48 h-16 md:w-56 md:h-20"></div>
            <div className="w-40 h-3 bg-black/70 border-b border-[var(--plataforma-borda)] blur-[1px] -mt-1"></div>
          </div>
        </div>

        {/* PLATAFORMA & SPRITE DO HERÓI */}
        <div className="absolute bottom-[28%] md:bottom-[26%] left-[8%] md:left-[14%] z-10 flex flex-col items-center">
          {rotuloHeroi && (
            <div key={rotuloHeroi.seq} className="absolute -top-28 z-30 anim-rotulo-golpe pointer-events-none whitespace-nowrap">
              <span className="font-pixel text-[11px] px-2 py-1 bg-black/85 border-2 border-amber-400 text-amber-200 drop-shadow-[0_2px_4px_#000]">
                {rotuloHeroi.texto}
              </span>
            </div>
          )}
          {efeitoVisualHeroi && (
            <div className="absolute -top-16 z-30 anim-cura-subir pointer-events-none flex flex-col items-center">
              <div
                className={`px-2.5 py-1 pixel-box font-pixel text-xs drop-shadow-[0_2px_4px_#000] font-bold border-2 ${
                  efeitoVisualHeroi.tipo === "CURA"
                    ? "text-emerald-300 border-emerald-500 bg-emerald-950/90"
                    : efeitoVisualHeroi.tipo === "ENERGIA"
                    ? "text-cyan-300 border-cyan-500 bg-cyan-950/90"
                    : "text-red-300 border-red-500 bg-red-950/90"
                }`}
              >
                {efeitoVisualHeroi.texto}
              </div>
            </div>
          )}

          <div
            className={`relative -mb-12 z-10 ${lungeHeroi ? "anim-avanco-heroi" : ""} ${tremerHeroi ? "anim-dano-tremer" : ""}`}
            style={lungeHeroi ? { animationDuration: `${lungeHeroi}ms` } : undefined}
          >
            <div
              className={`origin-bottom scale-[2.0] md:scale-[2.6] ${
                efeitoVisualHeroi?.tipo === "CURA" ? "anim-aura-cura" : efeitoVisualHeroi?.tipo === "ENERGIA" ? "anim-aura-energia" : ""
              }`}
            >
              <SpriteAnimado
                key={`h-${animHeroi.seq}`}
                anim={animAtualHeroi}
                loop={heroiEmLoop}
                velocidade={heroiEmLoop ? 1 : LENTIDAO}
              />
            </div>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="plataforma-combate w-56 h-20 md:w-64 md:h-24"></div>
            <div className="w-48 h-3.5 bg-black/70 blur-[1px] -mt-1"></div>
          </div>
        </div>

        {/* HUD DO HERÓI (EMBAIXO DO HERÓI) */}
        <div className="absolute bottom-12 md:bottom-14 left-4 md:left-8 z-20 pointer-events-none">
          <div className="w-[260px] md:w-[300px] pixel-box p-3 shadow-pixel bg-[var(--bg-panel)]/95 border-2 border-[var(--border-light)]">
            <div className="flex justify-between items-center mb-1 font-silkscreen text-xs">
              <span className="text-[var(--accent-gold)] font-bold truncate max-w-[170px]">{sessaoCombate.heroi.nome}</span>
              <span className="text-slate-400 text-[10px]">
                Nv. {sessaoCombate.heroi.nivel} {formatarNomeClasse(classeHeroi)}
              </span>
            </div>
            <div className="pixel-bar-bg h-4 w-full relative overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-rose-950 to-rose-600 transition-all duration-700"
                style={{ width: `${Math.max(0, (vidaHeroi / sessaoCombate.heroi.vidaMaxima) * 100)}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center font-pixel text-[8px] text-white drop-shadow-[0_1px_1px_#000]">
                HP {Math.max(0, vidaHeroi)} / {sessaoCombate.heroi.vidaMaxima}
              </span>
            </div>
            <div className="pixel-bar-bg h-3.5 w-full relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-950 to-cyan-500 transition-all duration-700"
                style={{ width: `${Math.max(0, (energiaHeroi / energiaMaxHeroi) * 100)}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center font-pixel text-[7.5px] text-white drop-shadow-[0_1px_1px_#000]">
                EN {Math.max(0, energiaHeroi)} / {energiaMaxHeroi}
              </span>
            </div>
            {buffDanoAtivo > 1 && (
              <div className="mt-1.5 px-2 py-0.5 bg-amber-950/90 border border-amber-500 font-pixel text-[8px] text-amber-300 flex items-center justify-between animate-pulse">
                <span>🗡️ LÂMINA IMBUÍDA</span>
                <span>+{buffDanoAtivo} DANO PRÓX. GOLPE</span>
              </div>
            )}
          </div>
        </div>

        {/* LOG NARRATIVO */}
        <div className="mt-auto relative z-20 border-t-2 border-[var(--border-card)] p-2.5 px-4 bg-[var(--bg-page)]/90 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-silkscreen text-xs text-[var(--accent-gold)] shrink-0">📜 LOG:</span>
            <span className="font-medieval text-sm md:text-base text-[var(--accent-gold-light)] truncate">{logsBatalha[0]}</span>
          </div>
          <span className="font-silkscreen text-[10px] text-[var(--text-muted)] shrink-0 ml-2">Rodada {rodada}</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BOTOEIRA TÁTICA (Custos fixos e multiplicadores recompensadores) */}
      {/* ============================================================== */}
      <div className="pixel-box p-4 bg-[var(--bg-panel)] border-2 border-[var(--border-card)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => executarTurno({ tipo: "ATACAR", tipoAtaque: "RAPIDO" })}
              disabled={processandoTurno || energiaHeroi < custoDe("RAPIDO")}
              className="pixel-btn pixel-btn-sangue text-xs py-2 px-3.5 disabled:opacity-40"
              title={`Golpe veloz (dano x${MULT_ATAQUE.RAPIDO}: ~${danoEstimado(MULT_ATAQUE.RAPIDO)}) — consome ${custoDe("RAPIDO")} EN`}
            >
              ⚔️ Rápido (-{custoDe("RAPIDO")} EN | ~{danoEstimado(MULT_ATAQUE.RAPIDO)} Dano)
            </button>
            <button
              onClick={() => executarTurno({ tipo: "ATACAR", tipoAtaque: "PESADO" })}
              disabled={processandoTurno || energiaHeroi < custoDe("PESADO")}
              className="pixel-btn pixel-btn-sangue text-xs py-2 px-3.5 disabled:opacity-40"
              title={`Golpe pesado e contundente (dano x${MULT_ATAQUE.PESADO}: ~${danoEstimado(MULT_ATAQUE.PESADO)}) — consome ${custoDe("PESADO")} EN`}
            >
              💥 Pesado (-{custoDe("PESADO")} EN | ~{danoEstimado(MULT_ATAQUE.PESADO)} Dano)
            </button>
            <button
              onClick={() => executarTurno({ tipo: "ATACAR", tipoAtaque: "BRUTAL" })}
              disabled={processandoTurno || energiaHeroi < custoDe("BRUTAL")}
              className="pixel-btn pixel-btn-sangue text-xs py-2 px-3.5 disabled:opacity-40"
              title={`Ataque brutal Quebra-Guarda: perfura defesas inimigas (dano x${MULT_ATAQUE.BRUTAL}: ~${danoEstimado(MULT_ATAQUE.BRUTAL)}) — consome ${custoDe("BRUTAL")} EN`}
            >
              ⚡ Brutal (-{custoDe("BRUTAL")} EN | ~{danoEstimado(MULT_ATAQUE.BRUTAL)} Dano)
            </button>
            <button
              onClick={() => executarTurno({ tipo: "DEFENDER" })}
              disabled={processandoTurno}
              className="pixel-btn text-xs py-2 px-3.5 disabled:opacity-40"
              title={`Assume guarda reforçada, reduz drasticamente o dano recebido neste turno e recupera +${recargaDefesaHeroi} de energia`}
            >
              🛡️ Defender (+{recargaDefesaHeroi} EN)
            </button>
            <button
              onClick={() => setModalMochilaAberta(true)}
              disabled={processandoTurno}
              className="pixel-btn pixel-btn-ouro text-xs py-2 px-3.5 flex items-center gap-1.5 disabled:opacity-40"
            >
              🧪 Usar Item ({itensMochila.length})
            </button>
          </div>

          <div className="text-[11px] font-silkscreen text-[var(--text-muted)]">
            {processandoTurno ? (
              <span className="text-[var(--accent-gold)] animate-pulse">AGUARDE O TURNO...</span>
            ) : (
              <span className="text-emerald-400">SUA VEZ — escolha uma ação</span>
            )}
          </div>
        </div>
      </div>

      {/* MOCHILA */}
      {modalMochilaAberta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg pixel-box p-6 bg-[var(--bg-card)] border-4 border-[var(--accent-gold)] shadow-pixel-ouro">
            <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎒</span>
                <h3 className="font-pixel text-xs md:text-sm text-[var(--accent-gold-light)]">MOCHILA DO CAMPEÃO</h3>
              </div>
              <button
                onClick={() => setModalMochilaAberta(false)}
                className="font-pixel text-xs text-[var(--text-muted)] hover:text-white px-2 py-1"
              >
                [X]
              </button>
            </div>

            {itensMochila.length === 0 ? (
              <div className="p-6 text-center bg-[var(--bg-subcard)] border border-[var(--border-card)] my-4">
                <p className="font-medieval text-base text-[var(--text-muted)]">
                  Você não possui consumíveis na mochila para usar nesta batalha.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 my-3">
                {itensMochila.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="pixel-box p-3 bg-[var(--bg-subcard)] border border-[var(--border-card)] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-black/60 border border-[var(--border-card)] shrink-0 mt-0.5">
                        <IconeItemPixel id={item.id} tipo={item.tipo} tamanho={28} />
                      </div>
                      <div>
                        <span className="font-silkscreen text-xs font-bold text-[var(--text-primary)] block">{item.nome}</span>
                        <span className="font-medieval text-xs text-[var(--text-muted)] block">{item.descricao}</span>
                        <BadgeAtributosItem item={item} />
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
              <button onClick={() => setModalMochilaAberta(false)} className="pixel-btn text-xs py-1.5 px-4">
                Fechar Mochila
              </button>
            </div>
          </div>
        </div>
      )}

      {modalFimBatalha.aberto && (
        <ModalFimBatalha
          tipo={modalFimBatalha.tipo}
          nomeMonstro={sessaoCombate.monstro.nome}
          xpGanho={modalFimBatalha.xpGanho}
          subiuNivel={modalFimBatalha.subiuNivel}
          novoNivel={modalFimBatalha.novoNivel}
          loot={modalFimBatalha.loot}
          aoFechar={async () => {
            await recarregarHeroiAtivo();
            aoTerminarDuelo(modalFimBatalha.tipo === "VITORIA");
          }}
        />
      )}

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
