import type { FC } from "react";
import { useAuth } from "../contextos/AuthContext";
import { useJogo } from "../contextos/JogoContext";
import { IconeEspada } from "./IconesPixelArt";

export type TelaAtiva = "LOBBY" | "CRIADOR" | "HUB" | "MURAL" | "ARENA";

interface PropsNavegadorSuperior {
  telaAtiva?: TelaAtiva;
  aoNavegarParaLobby?: () => void;
  aoNavegarParaHub?: () => void;
  aoNavegarParaMural?: () => void;
}

export const formatarNomeClasse = (classe?: string): string => {
  if (!classe) return "GUERREIRO";
  if (classe.toUpperCase() === "ARQUEIRO" || classe.toUpperCase() === "SAMURAI") {
    return "SAMURAI";
  }
  return classe.toUpperCase();
};

export const NavegadorSuperior: FC<PropsNavegadorSuperior> = ({
  telaAtiva = "LOBBY",
  aoNavegarParaLobby,
  aoNavegarParaHub,
  aoNavegarParaMural
}) => {
  const { usuario, logout } = useAuth();
  const {
    heroiAtivo,
    setHeroiAtivo,
    setSessaoCombate,
    setBiomaAtual,
    setModalCodiceAberto,
    efeitoCrt,
    setEfeitoCrt
  } = useJogo();

  const emCombate = telaAtiva === "ARENA";
  const exibirBarraHeroi = Boolean(heroiAtivo && telaAtiva !== "LOBBY" && telaAtiva !== "CRIADOR");

  const handleLogout = () => {
    setModalCodiceAberto(false);
    setSessaoCombate(null);
    setHeroiAtivo(null);
    setBiomaAtual("CRIPTAS");
    logout();
  };

  return (
    <header className="relative z-30 w-full max-w-6xl mb-6 pixel-box px-3 py-2.5 md:px-4 md:py-3 bg-[var(--bg-panel)] shadow-pixel border-2 border-[var(--border-card)]">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Lado Esquerdo: Logo e Navegação Contextual */}
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => {
              if (!emCombate && aoNavegarParaLobby) aoNavegarParaLobby();
            }}
            disabled={emCombate}
            className={`flex items-center gap-2 text-left shrink-0 ${
              emCombate ? "cursor-default" : "cursor-pointer hover:brightness-125"
            }`}
            title={emCombate ? "Finalize ou fuja do combate para retornar ao Salão" : "Voltar ao Salão de Heróis"}
          >
            <span className="w-3.5 h-3.5 bg-[var(--accent-gold)] inline-block shadow-pixel-sm shrink-0"></span>
            <span className="font-pixel text-xs md:text-sm text-[var(--accent-gold)] tracking-wider">
              FRACTURE: VASLEN
            </span>
          </button>

          {exibirBarraHeroi && heroiAtivo && (
            <div className="flex flex-wrap items-center gap-1.5 pl-2.5 border-l-2 border-[var(--border-card)]">
              {emCombate ? (
                <div className="font-silkscreen text-[11px] text-amber-200 flex items-center gap-1.5 px-2.5 py-1 bg-red-950/70 border border-red-600/80">
                  <span>⚔️ EM DUELO:</span>
                  <span className="font-bold text-white truncate max-w-[160px]">{heroiAtivo.nome}</span>
                  <span className="text-[10px] text-amber-300">
                    (Nv. {heroiAtivo.nivel} {formatarNomeClasse(heroiAtivo.classeHeroi)})
                  </span>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={aoNavegarParaHub}
                    className={`font-silkscreen text-[11px] flex items-center gap-1.5 px-2.5 py-1 border transition-colors shrink-0 ${
                      telaAtiva === "HUB"
                        ? "bg-[var(--accent-gold-dark)] text-[var(--accent-gold-light)] border-[var(--accent-gold)]"
                        : "bg-black/50 text-[var(--text-secondary)] hover:text-white border-[var(--border-card)]"
                    }`}
                    title="Ir para o Hub deste Herói"
                  >
                    <IconeEspada tamanho={14} />
                    <span className="truncate max-w-[140px] font-bold">{heroiAtivo.nome}</span>
                    <span className="text-[10px] opacity-90">
                      (Nv. {heroiAtivo.nivel} {formatarNomeClasse(heroiAtivo.classeHeroi)})
                    </span>
                  </button>

                  {aoNavegarParaMural && (
                    <button
                      type="button"
                      onClick={aoNavegarParaMural}
                      className={`pixel-btn text-[10px] py-1 px-2.5 shrink-0 ${
                        telaAtiva === "MURAL" ? "pixel-btn-ouro" : ""
                      }`}
                      title="Abrir Mapa-Múndi de Vaslen"
                    >
                      🗺️ Mapa
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={aoNavegarParaLobby}
                    className="pixel-btn text-[10px] py-1 px-2.5 text-[var(--accent-gold)] shrink-0"
                    title="Escolher outro Herói da sua conta"
                  >
                    🔄 Trocar Herói
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Lado Direito: Ações Globais */}
        <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
          {/* Botão Códice */}
          <button
            type="button"
            onClick={() => setModalCodiceAberto(true)}
            className="pixel-btn text-[10px] py-1.5 px-2.5 flex items-center gap-1 shrink-0"
            title="Abrir o Códice Secular de Vaslen"
          >
            <span>📜</span> Códice
          </button>

          {/* Toggle CRT */}
          <button
            type="button"
            onClick={() => setEfeitoCrt(!efeitoCrt)}
            className={`pixel-btn text-[10px] py-1.5 px-2.5 shrink-0 ${efeitoCrt ? "pixel-btn-ouro" : ""}`}
            title="Alternar efeito retrô de Scanlines CRT"
          >
            CRT: {efeitoCrt ? "ON" : "OFF"}
          </button>

          {/* Dados do Usuário & Logout */}
          {usuario && (
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-card)] shrink-0">
              <span className="font-silkscreen text-[11px] text-[var(--text-muted)] hidden lg:inline truncate max-w-[130px]">
                {usuario.nome}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="pixel-btn pixel-btn-sangue text-[10px] py-1.5 px-2.5 shrink-0"
                title="Desconectar do Feudo"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
