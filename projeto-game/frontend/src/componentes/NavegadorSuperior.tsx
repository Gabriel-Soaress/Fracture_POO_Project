import type { FC } from "react";
import { useAuth } from "../contextos/AuthContext";
import { useJogo } from "../contextos/JogoContext";
import { IconeEspada } from "./IconesPixelArt";

interface PropsNavegadorSuperior {
  aoNavegarParaLobby?: () => void;
  aoNavegarParaHub?: () => void;
}

export const NavegadorSuperior: FC<PropsNavegadorSuperior> = ({
  aoNavegarParaLobby,
  aoNavegarParaHub
}) => {
  const { usuario, logout } = useAuth();
  const { heroiAtivo, setModalCodiceAberto, efeitoCrt, setEfeitoCrt } = useJogo();

  return (
    <header className="w-full max-w-6xl mb-6 pixel-box p-3 md:p-4 bg-[var(--bg-panel)] shadow-pixel border-2 border-[var(--border-card)]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Lado Esquerdo: Logo e Navegação */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={aoNavegarParaLobby}>
            <span className="w-3.5 h-3.5 bg-[var(--accent-gold)] inline-block shadow-pixel-sm"></span>
            <span className="font-pixel text-xs md:text-sm text-[var(--accent-gold)] tracking-wider">
              FRACTURE: VASLEN
            </span>
          </div>

          {heroiAtivo && (
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l-2 border-[var(--border-card)]">
              <button
                onClick={aoNavegarParaHub}
                className="font-silkscreen text-xs text-[var(--accent-gold-light)] hover:text-white flex items-center gap-1.5 px-2 py-1 bg-black/40 border border-[var(--border-card)]"
              >
                <IconeEspada tamanho={14} />
                <span>{heroiAtivo.nome} (Nv. {heroiAtivo.nivel} {heroiAtivo.classeHeroi})</span>
              </button>
            </div>
          )}
        </div>

        {/* Lado Direito: Ações Globais */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Botão Códice */}
          <button
            onClick={() => setModalCodiceAberto(true)}
            className="pixel-btn text-[10px] py-1.5 px-2.5 flex items-center gap-1"
          >
            <span>📜</span> Códice
          </button>

          {/* Toggle CRT */}
          <button
            onClick={() => setEfeitoCrt(!efeitoCrt)}
            className={`pixel-btn text-[10px] py-1.5 px-2.5 ${efeitoCrt ? "pixel-btn-ouro" : ""}`}
            title="Alternar efeito retrô de Scanlines CRT"
          >
            CRT: {efeitoCrt ? "ON" : "OFF"}
          </button>

          {/* Dados do Usuário & Logout */}
          {usuario && (
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-card)]">
              <span className="font-silkscreen text-[11px] text-[var(--text-muted)] hidden md:inline">
                {usuario.nome}
              </span>
              <button
                onClick={logout}
                className="pixel-btn pixel-btn-sangue text-[10px] py-1.5 px-2.5"
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
