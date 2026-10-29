import { useState, useEffect, type FC } from "react";
import { useJogo } from "../contextos/JogoContext";
import { CombateServico } from "../servicos/CombateServico";
import { ErroHttp } from "../servicos/clienteHttp";
import {
  IconeEspada,
  IconePocaoVida,
  IconeElixirEnergia,
  IconeOleoDano,
  IconeOrbeReliquia
} from "../componentes/IconesPixelArt";
import type { BiomaVaslen, MonstroMuralDTO } from "../tipos/api";

interface PropsTelaMural {
  aoVoltarAoHub: () => void;
  aoIniciarCombate: () => void;
}

interface InfoRegiaoMapa {
  id: BiomaVaslen;
  nome: string;
  subtitulo: string;
  icone: string;
  nivelMinimo: number; // Nível do monstro mais fraco da região
  monsterIds: number[];
  posicaoGrid: string; // Posicionamento geográfico no mapa
  descricaoGeografica: string;
}

const REGIOES_MAPA: InfoRegiaoMapa[] = [
  {
    id: "LIMBO_ESPECTRAL",
    nome: "Limbo Espectral",
    subtitulo: "Véu das Almas Perdidas",
    icone: "👻",
    nivelMinimo: 9,
    monsterIds: [16, 17, 18],
    posicaoGrid: "col-span-1 md:col-start-1 md:row-start-1",
    descricaoGeografica: "Noroeste Abissal: Fendas entre as dimensões onde ecos sussurram."
  },
  {
    id: "COLINAS_LUA_SANGUE",
    nome: "Colinas Lua de Sangue",
    subtitulo: "Uivo sob o Luar Carmesim",
    icone: "🌕",
    nivelMinimo: 8,
    monsterIds: [13, 14, 15],
    posicaoGrid: "col-span-1 md:col-start-2 md:row-start-1",
    descricaoGeografica: "Norte Montanhoso: Terras gélidas dominadas por matilhas lupinas."
  },
  {
    id: "PINACULO_ECLIPSE",
    nome: "Pináculo do Eclipse",
    subtitulo: "Trono dos Deuses Caídos",
    icone: "⚡",
    nivelMinimo: 10,
    monsterIds: [19, 20, 21],
    posicaoGrid: "col-span-1 md:col-start-3 md:row-start-1",
    descricaoGeografica: "Cume Central: O zênite sagrado onde a Fratura original se abriu."
  },
  {
    id: "PANTANO_PETRIFICANTE",
    nome: "Pântano Petrificante",
    subtitulo: "Águas e Lodo Venenoso",
    icone: "🐍",
    nivelMinimo: 7,
    monsterIds: [10, 11, 12],
    posicaoGrid: "col-span-1 md:col-start-1 md:row-start-2",
    descricaoGeografica: "Oeste Pantanoso: Ruínas submersas e o olhar petrificante das Górgones."
  },
  {
    id: "CRIPTAS",
    nome: "Criptas de Vaslen",
    subtitulo: "Mausoléu dos Reis Antigos",
    icone: "🪦",
    nivelMinimo: 1,
    monsterIds: [1, 2, 3],
    posicaoGrid: "col-span-1 md:col-start-2 md:row-start-2",
    descricaoGeografica: "Centro Subterrâneo: Catacumbas ancestrais reanimadas pela névoa."
  },
  {
    id: "BOSQUE_SOMBRIO",
    nome: "Bosque Sombrio",
    subtitulo: "Raízes Vorazes do Ocaso",
    icone: "🌲",
    nivelMinimo: 3,
    monsterIds: [4, 5, 6],
    posicaoGrid: "col-span-1 md:col-start-3 md:row-start-2",
    descricaoGeografica: "Leste Selvagem: Floresta primordial dominada por tribos de sátiros."
  },
  {
    id: "LABIRINTO_CINZAS",
    nome: "Labirinto de Cinzas",
    subtitulo: "Corredores Vulcânicos",
    icone: "🔥",
    nivelMinimo: 5,
    monsterIds: [7, 8, 9],
    posicaoGrid: "col-span-1 md:col-start-2 md:row-start-3",
    descricaoGeografica: "Sul Profundo: Labirinto de basalto e lava habitado pela horda taurina."
  }
];

export const TelaMural: FC<PropsTelaMural> = ({ aoVoltarAoHub, aoIniciarCombate }) => {
  const { heroiAtivo, biomaAtual, setBiomaAtual, setSessaoCombate } = useJogo();
  const [monstros, setMonstros] = useState<MonstroMuralDTO[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [iniciandoDueloId, setIniciandoDueloId] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregarMural = async (bioma: BiomaVaslen) => {
    setCarregando(true);
    setErro(null);
    try {
      const resposta = await CombateServico.obterMural(bioma, heroiAtivo?.id);
      setMonstros(resposta.monstros);
    } catch (err: any) {
      setErro(err instanceof ErroHttp ? err.message : "Falha ao consultar mural do bioma.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarMural(biomaAtual);
  }, [biomaAtual, heroiAtivo?.id]);

  const trocarRegiao = (novaRegiao: BiomaVaslen) => {
    setBiomaAtual(novaRegiao);
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
      setErro(err instanceof ErroHttp ? err.message : "Não foi possível desafiar este monstro.");
      setIniciandoDueloId(null);
    }
  };

  const renderizarIconeLoot = (tipoItem: string) => {
    switch (tipoItem) {
      case "POCAO_VIDA":
        return <IconePocaoVida tamanho={20} />;
      case "ELIXIR_ENERGIA":
        return <IconeElixirEnergia tamanho={20} />;
      case "OLEO_DANO":
        return <IconeOleoDano tamanho={20} />;
      case "ORBE_RELIQUIA":
      default:
        return <IconeOrbeReliquia tamanho={20} />;
    }
  };

  const regiaoAtualInfo = REGIOES_MAPA.find(r => r.id === biomaAtual)!;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Barra Superior de Navegação */}
      <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-3">
        <button
          onClick={aoVoltarAoHub}
          className="pixel-btn text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <span>⬅️</span> Voltar ao Hub do Herói
        </button>
        <div className="flex items-center gap-2">
          <span className="font-pixel text-xs text-[var(--accent-gold)] flex items-center gap-1.5">
            🗺️ MAPA MUNDIAL DE VASLEN
          </span>
          <span className="font-silkscreen text-[10px] text-[var(--text-muted)] hidden sm:inline">
            (Clique em um território para explorar)
          </span>
        </div>
      </div>

      {erro && (
        <div className="p-4 pixel-box bg-red-950/80 border-2 border-red-700 text-red-300 font-silkscreen text-xs">
          ⚠️ {erro}
        </div>
      )}

      {/* ============================================================== */}
      {/* MAPA MUNDIAL INTERATIVO DE VASLEN COM TODAS AS 7 REGIÕES       */}
      {/* ============================================================== */}
      <section className="pixel-box p-4 md:p-6 bg-[var(--bg-panel)] shadow-pixel border-4 border-[var(--border-card)]">
        
        {/* Cabeçalho do Mapa */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-[var(--border-card)] pb-3 mb-4">
          <div>
            <h3 className="font-pixel text-xs md:text-sm text-[var(--accent-gold-light)] flex items-center gap-2">
              🧭 TERRITÓRIOS E BIOMAS CONHECIDOS
            </h3>
            <p className="font-medieval text-xs md:text-sm text-[var(--text-muted)] mt-0.5">
              Regiões 100% expurgadas tornam-se cinzentas. O nível indicado reflete o perigo mínimo inicial.
            </p>
          </div>
          <div className="flex items-center gap-2 font-silkscreen text-[10px]">
            <span className="flex items-center gap-1 text-[var(--accent-gold)]">
              <span className="w-2.5 h-2.5 bg-[var(--accent-gold)] inline-block"></span> Ativo
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2.5 h-2.5 bg-slate-600 inline-block"></span> Pacificado
            </span>
          </div>
        </div>

        {/* Grade Cartográfica do Mapa Mundi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 p-3 bg-black/40 border-2 border-[var(--border-card)] relative">
          
          {REGIOES_MAPA.map(regiao => {
            const estaAtiva = biomaAtual === regiao.id;
            
            // Verifica quantos monstros da região foram eliminados
            const monstrosDerrotadosNaRegiao = heroiAtivo
              ? regiao.monsterIds.filter(id => heroiAtivo.monstrosDerrotados.includes(id)).length
              : 0;

            const todosDerrotados = monstrosDerrotadosNaRegiao === regiao.monsterIds.length;

            return (
              <button
                key={regiao.id}
                onClick={() => trocarRegiao(regiao.id)}
                className={`relative text-left p-3.5 pixel-box transition-all duration-200 flex flex-col justify-between min-h-[120px] ${
                  todosDerrotados
                    ? "grayscale opacity-50 bg-slate-900 border-2 border-slate-700 hover:opacity-80"
                    : estaAtiva
                    ? "border-4 border-[var(--accent-gold)] shadow-pixel-ouro scale-[1.02] bg-[var(--bg-subcard)] z-10"
                    : "border-2 border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[var(--border-light)] opacity-90 hover:opacity-100"
                }`}
              >
                {/* Indicador de Marcador Ativo */}
                {estaAtiva && (
                  <div className="absolute -top-3 -right-2 font-pixel text-[8px] px-2 py-0.5 bg-[var(--accent-gold)] text-black border border-white font-bold shadow-pixel-sm animate-bounce">
                    📍 VOCÊ ESTÁ AQUI
                  </div>
                )}

                <div>
                  {/* Topo do Card de Território: Ícone e Nível Mínimo */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{regiao.icone}</span>
                    
                    {/* Badge de Nível da Região (Baseado no Monstro Mais Fraco!) */}
                    <span
                      className={`font-pixel text-[8.5px] px-2 py-0.5 border ${
                        todosDerrotados
                          ? "bg-slate-800 text-slate-400 border-slate-600"
                          : estaAtiva
                          ? "bg-[var(--accent-gold-dark)] text-[var(--accent-gold-light)] border-[var(--accent-gold)]"
                          : "bg-black/60 text-[var(--text-muted)] border-[var(--border-card)]"
                      }`}
                    >
                      REGIÃO NV. {regiao.nivelMinimo}+
                    </span>
                  </div>

                  {/* Nome da Região */}
                  <h4 className="font-silkscreen text-xs font-bold text-[var(--text-primary)] leading-tight mb-0.5">
                    {regiao.nome}
                  </h4>
                  <span className="font-medieval text-[11px] text-[var(--text-muted)] line-clamp-1">
                    {regiao.subtitulo}
                  </span>
                </div>

                {/* Rodapé do Território: Progresso de Monstros (X/3) */}
                <div className="mt-3 pt-2 border-t border-[var(--border-card)] flex items-center justify-between font-silkscreen text-[9.5px]">
                  <span className={todosDerrotados ? "text-slate-400 font-bold" : "text-[var(--text-secondary)]"}>
                    {todosDerrotados ? "🛡️ PACIFICADA" : "MONSTROS:"}
                  </span>
                  <span
                    className={`font-pixel text-[8px] px-1.5 py-0.5 ${
                      todosDerrotados
                        ? "bg-slate-800 text-slate-400"
                        : monstrosDerrotadosNaRegiao > 0
                        ? "text-[var(--accent-gold)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {monstrosDerrotadosNaRegiao} / {regiao.monsterIds.length} EXPURGADOS
                  </span>
                </div>
              </button>
            );
          })}

        </div>

        {/* Resumo da Região Selecionada */}
        <div className="mt-3 p-2.5 bg-[var(--bg-subcard)] border border-[var(--border-card)] flex items-center justify-between text-xs">
          <span className="font-silkscreen text-[var(--accent-gold)]">
            📍 REGIÃO SELECIONADA: <strong>{regiaoAtualInfo.nome}</strong> (Nível Mínimo: {regiaoAtualInfo.nivelMinimo}+)
          </span>
          <span className="font-medieval text-[var(--text-muted)] hidden md:inline">
            {regiaoAtualInfo.descricaoGeografica}
          </span>
        </div>
      </section>

      {/* ============================================================== */}
      {/* LISTA DOS MONSTROS CANÔNICOS DA REGIÃO SELECIONADA             */}
      {/* ============================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-pixel text-xs md:text-sm text-[var(--accent-gold-light)] flex items-center gap-2">
            <IconeEspada tamanho={18} /> BESTAS E GUARDIÕES DE {regiaoAtualInfo.nome.toUpperCase()}
          </h3>
          <span className="font-silkscreen text-[11px] text-[var(--text-muted)]">
            Derrote todos os 3 monstros para pacificar o território
          </span>
        </div>

        {carregando ? (
          <div className="text-center p-12 pixel-box bg-[var(--bg-panel)]">
            <p className="font-pixel text-xs text-[var(--accent-gold)] animate-pulse">
              Consultando rastros de bestas nesta região...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {monstros.map(monstro => {
              const estaEliminado = monstro.status === "ELIMINADO";
              const duelando = iniciandoDueloId === monstro.id;

              return (
                <div
                  key={monstro.id}
                  className={`pixel-box p-5 bg-[var(--bg-card)] border-2 transition-all shadow-pixel flex flex-col justify-between ${
                    estaEliminado
                      ? "opacity-60 grayscale border-slate-700 bg-slate-900/50"
                      : "border-[var(--border-card)] hover:border-[var(--accent-gold)]"
                  }`}
                >
                  <div>
                    {/* Cabeçalho do Card */}
                    <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-2 mb-3">
                      <div>
                        <h4 className="font-pixel text-xs text-[var(--accent-gold-light)] truncate max-w-[180px]">
                          {monstro.nome}
                        </h4>
                        <span className="font-silkscreen text-[10px] text-[var(--text-muted)]">
                          {monstro.tipoMonstro} • Nv. {monstro.nivel}
                        </span>
                      </div>
                      <span
                        className={`font-pixel text-[8px] px-2 py-0.5 border ${
                          estaEliminado
                            ? "bg-slate-800 text-slate-400 border-slate-600"
                            : "bg-emerald-950 text-emerald-300 border-emerald-500"
                        }`}
                      >
                        {estaEliminado ? "EXPURGADO" : "DISPONÍVEL"}
                      </span>
                    </div>

                    {/* Descrição de Lore */}
                    <p className="font-medieval text-xs md:text-sm text-[var(--text-secondary)] mb-4 leading-relaxed line-clamp-3">
                      {monstro.descricaoLore}
                    </p>

                    {/* Ficha Rápida de Atributos */}
                    <div className="p-3 bg-[var(--bg-subcard)] border border-[var(--border-card)] space-y-1.5 font-silkscreen text-[10px] mb-4">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Vida Máxima:</span>
                        <span className="text-rose-400 font-bold">{monstro.vidaMaxima} HP</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Energia:</span>
                        <span className="text-cyan-400 font-bold">{monstro.energiaMaxima} EN</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Recompensa XP:</span>
                        <span className="text-[var(--accent-gold)] font-bold">+{monstro.experienciaConcedida} XP</span>
                      </div>
                    </div>

                    {/* Loot Dropável */}
                    {monstro.loot && (
                      <div className="p-2.5 bg-black/40 border border-[var(--border-card)] flex items-center gap-2.5 mb-4">
                        <div className="p-1 bg-black/60 border border-[var(--border-card)] shrink-0">
                          {renderizarIconeLoot(monstro.loot.tipo)}
                        </div>
                        <div className="overflow-hidden">
                          <span className="font-silkscreen text-[10px] font-bold text-[var(--accent-gold)] block truncate">
                            Loot: {monstro.loot.nome}
                          </span>
                          <span className="font-medieval text-[10px] text-[var(--text-muted)] truncate block">
                            {monstro.loot.descricao}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botão de Duelo */}
                  <div className="pt-2 border-t border-[var(--border-card)]">
                    {estaEliminado ? (
                      <button
                        disabled
                        className="w-full pixel-btn opacity-40 cursor-not-allowed text-xs py-2.5 px-3"
                      >
                        💀 JÁ EXPURGADO (ANTI-FARM)
                      </button>
                    ) : (
                      <button
                        onClick={() => desafiarMonstro(monstro.id)}
                        disabled={duelando}
                        className="w-full pixel-btn pixel-btn-sangue text-xs py-2.5 px-3 flex items-center justify-center gap-2"
                      >
                        {duelando ? (
                          <span className="animate-pulse">MARCHANDO AO COMBATE...</span>
                        ) : (
                          <>
                            <span>⚔️</span> DESAFIAR MONSTRO
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
