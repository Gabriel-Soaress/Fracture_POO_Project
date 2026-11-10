import { useState, useEffect, type FC } from "react";
import { PersonagemServico } from "../servicos/PersonagemServico";
import { useJogo } from "../contextos/JogoContext";
import { ModalConfirmacao } from "../componentes/ModalConfirmacao";
import { formatarNomeClasse } from "../componentes/NavegadorSuperior";
import { IconeEspada, IconeCaveira } from "../componentes/IconesPixelArt";
import type { PersonagemDTO } from "../tipos/api";

interface PropsTelaLobby {
  aoCriarPersonagem: () => void;
  aoSelecionarHeroi: () => void;
}

export const TelaLobby: FC<PropsTelaLobby> = ({ aoCriarPersonagem, aoSelecionarHeroi }) => {
  const { setHeroiAtivo } = useJogo();
  const [herois, setHerois] = useState<PersonagemDTO[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [heroiParaInativar, setHeroiParaInativar] = useState<PersonagemDTO | null>(null);
  const [inativando, setInativando] = useState<boolean>(false);

  const carregarHerois = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const lista = await PersonagemServico.listarAtivos();
      setHerois(lista);
    } catch (err: any) {
      setErro(err.message || "Falha ao carregar heróis da conta.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarHerois();
  }, []);

  const handleMarchar = async (heroi: PersonagemDTO) => {
    try {
      const completo = await PersonagemServico.buscarPorId(heroi.id);
      setHeroiAtivo(completo);
    } catch {
      setHeroiAtivo(heroi);
    }
    aoSelecionarHeroi();
  };

  const handleConfirmarInativacao = async () => {
    if (!heroiParaInativar) return;
    setInativando(true);
    try {
      await PersonagemServico.inativar(heroiParaInativar.id);
      setHeroiParaInativar(null);
      await carregarHerois();
    } catch (err: any) {
      alert("Erro ao inativar herói: " + (err.message || "Tente novamente"));
    } finally {
      setInativando(false);
    }
  };

  const obterClasseCssSprite = (classe: string) => {
    switch (classe) {
      case "GUERREIRO":
        return "sprite-heroi-idle";
      case "MAGO":
        return "sprite-mago-idle";
      case "SAMURAI":
      case "ARQUEIRO":
        return "sprite-arqueiro-idle";
      default:
        return "sprite-heroi-idle";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Cabeçalho do Lobby */}
      <div className="pixel-box p-4 md:p-6 bg-[var(--bg-panel)] shadow-pixel border-2 border-[var(--border-card)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-pixel text-xs md:text-sm text-[var(--accent-gold-light)] flex items-center gap-2">
            <IconeEspada tamanho={20} /> O SALÃO DE HERÓIS ATIVOS
          </h2>
          <p className="font-medieval text-sm md:text-base text-[var(--text-muted)] mt-1">
            Selecione um campeão para marchar contra os biomas ou forje um novo aventureiro.
          </p>
        </div>

        <button
          onClick={aoCriarPersonagem}
          className="pixel-btn pixel-btn-ouro text-xs py-2.5 px-4 flex items-center gap-2"
        >
          <span>⚔️</span> FORJAR NOVO HERÓI
        </button>
      </div>

      {erro && (
        <div className="p-4 pixel-box bg-red-950/80 border-2 border-red-700 text-red-300 font-silkscreen text-xs">
          ⚠️ {erro}
        </div>
      )}

      {/* Grid de Personagens */}
      {carregando ? (
        <div className="text-center p-12 pixel-box bg-[var(--bg-panel)]">
          <p className="font-pixel text-xs text-[var(--accent-gold)] animate-pulse">
            Invocando espíritos do feudo...
          </p>
        </div>
      ) : herois.length === 0 ? (
        <div className="text-center p-12 pixel-box bg-[var(--bg-panel)] border-2 border-[var(--border-card)]">
          <p className="font-medieval text-xl text-[var(--text-muted)] mb-4">
            Nenhum herói ativo encontrado neste feudo.
          </p>
          <button
            onClick={aoCriarPersonagem}
            className="pixel-btn pixel-btn-ouro text-xs py-3 px-6"
          >
            FORJAR SEU PRIMEIRO CAMPEÃO
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {herois.map(heroi => (
            <div
              key={heroi.id}
              className="pixel-box p-5 bg-[var(--bg-card)] border-2 border-[var(--border-card)] hover:border-[var(--accent-gold)] transition-all shadow-pixel flex flex-col justify-between"
            >
              <div>
                {/* Cabeçalho do Card */}
                <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-2 mb-3">
                  <div>
                    <h3 className="font-pixel text-xs text-[var(--accent-gold-light)] truncate max-w-[170px]">
                      {heroi.nome}
                    </h3>
                    <span className="font-silkscreen text-[10px] text-[var(--accent-gold)]">
                      {formatarNomeClasse(heroi.classeHeroi)} • Nv. {heroi.nivel}
                    </span>
                  </div>
                  <span className="font-pixel text-[8px] px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-600">
                    ATIVO
                  </span>
                </div>

                {/* Área Visual do Sprite */}
                <div className="h-28 bg-[var(--bg-subcard)] border border-[var(--border-card)] mb-4 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-radial from-transparent to-black/60 pointer-events-none"></div>
                  <div className="transform scale-[1.3] origin-bottom mt-4">
                    <div className={`w-[128px] h-[128px] pixelated ${obterClasseCssSprite(heroi.classeHeroi)}`}></div>
                  </div>
                </div>

                {/* Barras de Status do Herói */}
                <div className="space-y-2 mb-4 font-silkscreen text-[10px]">
                  {/* HP */}
                  <div>
                    <div className="flex justify-between text-[var(--text-muted)] mb-0.5">
                      <span>VIDA (HP)</span>
                      <span>{heroi.vidaAtual} / {heroi.vidaMaxima}</span>
                    </div>
                    <div className="pixel-bar-bg h-3 w-full">
                      <div
                        className="h-full bg-gradient-to-r from-rose-950 to-rose-600"
                        style={{ width: `${(heroi.vidaAtual / heroi.vidaMaxima) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Energia */}
                  <div>
                    <div className="flex justify-between text-[var(--text-muted)] mb-0.5">
                      <span>ENERGIA (EN)</span>
                      <span>{heroi.energiaAtual} / {heroi.energiaMaxima}</span>
                    </div>
                    <div className="pixel-bar-bg h-3 w-full">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-950 to-cyan-500"
                        style={{ width: `${(heroi.energiaAtual / heroi.energiaMaxima) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Atributos Resumidos */}
                <div className="grid grid-cols-3 gap-1.5 p-2 bg-[var(--bg-subcard)] border border-[var(--border-card)] text-center font-silkscreen text-[10px] mb-4">
                  <div>
                    <span className="text-red-400 block font-bold">FOR</span>
                    <span className="text-[var(--text-primary)]">{heroi.forca}</span>
                  </div>
                  <div>
                    <span className="text-blue-400 block font-bold">DEF</span>
                    <span className="text-[var(--text-primary)]">{heroi.defesa}</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 block font-bold">AGI</span>
                    <span className="text-[var(--text-primary)]">{heroi.agilidade}</span>
                  </div>
                </div>

                {/* Caçadas Vencidas */}
                <div className="flex items-center justify-between text-[11px] font-medieval text-[var(--text-muted)] mb-4">
                  <span className="flex items-center gap-1">
                    <IconeCaveira tamanho={14} /> Monstros Expurgados:
                  </span>
                  <strong className="text-[var(--accent-gold)]">{heroi.monstrosDerrotados.length}</strong>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 pt-2 border-t border-[var(--border-card)]">
                <button
                  onClick={() => handleMarchar(heroi)}
                  className="flex-1 pixel-btn pixel-btn-ouro text-xs py-2 px-3"
                >
                  ⚔️ MARCHAR
                </button>
                <button
                  onClick={() => setHeroiParaInativar(heroi)}
                  className="pixel-btn pixel-btn-sangue text-xs py-2 px-2.5"
                  title="Inativar este herói (Soft Delete)"
                >
                  💀
                </button>
              </div>
            </div>
          ))}

          {/* Card Slot para Forjar Novo */}
          <button
            onClick={aoCriarPersonagem}
            className="p-8 pixel-box bg-[var(--bg-subcard)]/50 border-2 border-dashed border-[var(--border-card)] hover:border-[var(--accent-gold)] transition-all flex flex-col items-center justify-center text-center group min-h-[350px]"
          >
            <span className="text-4xl mb-3 text-[var(--text-muted)] group-hover:text-[var(--accent-gold)] group-hover:scale-110 transition-transform">
              ➕
            </span>
            <span className="font-pixel text-xs text-[var(--text-muted)] group-hover:text-[var(--accent-gold-light)]">
              FORJAR NOVO HERÓI
            </span>
            <span className="font-medieval text-xs text-[var(--text-muted)] mt-1">
              Distribua 20 pontos e consagre um novo campeão
            </span>
          </button>
        </div>
      )}

      {/* Modal de Confirmação de Soft Delete */}
      <ModalConfirmacao
        aberto={!!heroiParaInativar}
        titulo="ABANDONAR HERÓI (SOFT DELETE)"
        mensagem={
          heroiParaInativar
            ? `Tem certeza que deseja inativar ${heroiParaInativar.nome}? Ele deixará o salão ativo, mas seu histórico permanecerá sepultado no banco relacional de Vaslen.`
            : ""
        }
        textoConfirmar={inativando ? "INATIVANDO..." : "SIM, INATIVAR"}
        textoCancelar="MANTER HERÓI"
        perigoso={true}
        aoConfirmar={handleConfirmarInativacao}
        aoCancelar={() => setHeroiParaInativar(null)}
      />

    </div>
  );
};
