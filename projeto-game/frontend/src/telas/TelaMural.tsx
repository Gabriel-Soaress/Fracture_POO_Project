import { useState, useEffect, type FC } from "react";
import { useJogo } from "../contextos/JogoContext";
import { CombateServico } from "../servicos/CombateServico";
import { ErroHttp } from "../servicos/clienteHttp";
import {
  IconeEspada,
  IconeCaveira,
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

interface BiomaItem {
  id: BiomaVaslen;
  nome: string;
  subtitulo: string;
  icone: string;
}

const BIOMAS_VASLEN: BiomaItem[] = [
  { id: "CRIPTAS", nome: "Criptas de Vaslen", subtitulo: "Mausoléu dos Reis Antigos", icone: "🪦" },
  { id: "BOSQUE_SOMBRIO", nome: "Bosque Sombrio", subtitulo: "Raízes Vorazes do Ocaso", icone: "🌲" },
  { id: "LABIRINTO_CINZAS", nome: "Labirinto de Cinzas", subtitulo: "Corredores de Fogo", icone: "🔥" },
  { id: "PANTANO_PETRIFICANTE", nome: "Pântano Petrificante", subtitulo: "Águas Venenosas", icone: "🐍" },
  { id: "COLINAS_LUA_SANGUE", nome: "Colinas Lua de Sangue", subtitulo: "Uivo sob o Luar", icone: "🌕" },
  { id: "LIMBO_ESPECTRAL", nome: "Limbo Espectral", subtitulo: "Véu das Almas Perdidas", icone: "👻" },
  { id: "PINACULO_ECLIPSE", nome: "Pináculo do Eclipse", subtitulo: "Trono dos Deuses Caídos", icone: "⚡" }
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

  const trocarBioma = (novoBioma: BiomaVaslen) => {
    setBiomaAtual(novoBioma);
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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Barra Superior */}
      <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-3">
        <button
          onClick={aoVoltarAoHub}
          className="pixel-btn text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <span>⬅️</span> Voltar ao Hub
        </button>
        <span className="font-pixel text-xs text-[var(--accent-gold)] flex items-center gap-1.5">
          <IconeCaveira tamanho={16} /> MURAL DE CAÇADAS ÚNICAS (ANTI-FARM)
        </span>
      </div>

      {/* Seletor de Biomas dos 7 Biomas */}
      <section className="pixel-box p-4 bg-[var(--bg-panel)] shadow-pixel border-2 border-[var(--border-card)]">
        <span className="font-silkscreen text-xs text-[var(--accent-gold)] block mb-3">
          🗺️ SELECIONE O BIOMA DE DESTINO:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {BIOMAS_VASLEN.map(b => {
            const estaAtivo = biomaAtual === b.id;
            return (
              <button
                key={b.id}
                onClick={() => trocarBioma(b.id)}
                className={`p-2.5 pixel-box text-left transition-all flex flex-col justify-between ${
                  estaAtivo
                    ? "border-2 border-[var(--accent-gold)] scale-[1.03] shadow-pixel-ouro bg-[var(--accent-gold-dark)]"
                    : "border border-[var(--border-card)] bg-[var(--bg-subcard)] hover:border-[var(--border-light)] opacity-80 hover:opacity-100"
                }`}
              >
                <span className="text-xl mb-1">{b.icone}</span>
                <span className="font-silkscreen text-[11px] font-bold text-[var(--text-primary)] leading-tight">
                  {b.nome}
                </span>
                <span className="font-medieval text-[10px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
                  {b.subtitulo}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {erro && (
        <div className="p-4 pixel-box bg-red-950/80 border-2 border-red-700 text-red-300 font-silkscreen text-xs">
          ⚠️ {erro}
        </div>
      )}

      {/* Lista dos Monstros Canônicos do Bioma */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-pixel text-xs md:text-sm text-[var(--accent-gold-light)] flex items-center gap-2">
            <IconeEspada tamanho={18} /> CRIATURAS ENCONTRADAS EM {biomaAtual}
          </h3>
          <span className="font-silkscreen text-[11px] text-[var(--text-muted)]">
            Cada criatura expurgada fortalece o legado do herói
          </span>
        </div>

        {carregando ? (
          <div className="text-center p-12 pixel-box bg-[var(--bg-panel)]">
            <p className="font-pixel text-xs text-[var(--accent-gold)] animate-pulse">
              Rastreando rastros de feras no bioma...
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
                      ? "opacity-60 border-[var(--border-card)] bg-[var(--bg-card)]/50"
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
                            ? "bg-red-950 text-red-400 border-red-700"
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
                          <span className="animate-pulse">ENTRANDO NA ARENA...</span>
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
