import { useState, type FC } from "react";
import { ProvedorAuth, useAuth } from "./contextos/AuthContext";
import { ProvedorJogo, useJogo } from "./contextos/JogoContext";
import { NavegadorSuperior } from "./componentes/NavegadorSuperior";
import { ModalCodice } from "./componentes/ModalCodice";
import { TelaAuth } from "./telas/TelaAuth";
import { TelaLobby } from "./telas/TelaLobby";
import { TelaCriador } from "./telas/TelaCriador";
import { TelaHubHeroi } from "./telas/TelaHubHeroi";
import { TelaMural } from "./telas/TelaMural";
import { TelaArena } from "./telas/TelaArena";

type TelaAtiva = "LOBBY" | "CRIADOR" | "HUB" | "MURAL" | "ARENA";

const ConteudoApp: FC = () => {
  const { carregando, autenticado } = useAuth();
  const { biomaAtual, modalCodiceAberto, setModalCodiceAberto, efeitoCrt } = useJogo();
  const [telaAtiva, setTelaAtiva] = useState<TelaAtiva>("LOBBY");

  if (carregando) {
    return (
      <div
        data-theme="CRIPTAS"
        className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-page)] text-[var(--text-primary)]"
      >
        <div className="pixel-box p-8 bg-[var(--bg-panel)] border-4 border-[var(--accent-gold)] shadow-pixel-ouro text-center max-w-sm">
          <span className="text-3xl block mb-3 animate-spin">🗝️</span>
          <h2 className="font-pixel text-xs text-[var(--accent-gold-light)] mb-1">
            ABRINDO OS PORTÕES DE VASLEN
          </h2>
          <p className="font-medieval text-sm text-[var(--text-muted)] animate-pulse">
            Consultando os registros da fortaleza...
          </p>
        </div>
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div
        data-theme={biomaAtual}
        className="relative min-h-screen p-4 md:p-8 flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: "var(--bg-page)" }}
      >
        {efeitoCrt && <div className="fixed inset-0 scanlines pointer-events-none z-50 opacity-30"></div>}
        <TelaAuth />
      </div>
    );
  }

  return (
    <div
      data-theme={biomaAtual}
      className="relative min-h-screen text-[var(--text-primary)] p-3 md:p-6 flex flex-col items-center transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* Efeito CRT Retro Scanlines */}
      {efeitoCrt && <div className="fixed inset-0 scanlines pointer-events-none z-50 opacity-30"></div>}

      {/* Navegador Superior com dados do Herói e Logout */}
      <NavegadorSuperior
        aoNavegarParaLobby={() => setTelaAtiva("LOBBY")}
        aoNavegarParaHub={() => setTelaAtiva("HUB")}
      />

      {/* Roteamento das 5 Telas Principais da Aplicação */}
      <main className="w-full max-w-6xl flex-1 flex flex-col justify-start">
        {telaAtiva === "LOBBY" && (
          <TelaLobby
            aoCriarPersonagem={() => setTelaAtiva("CRIADOR")}
            aoSelecionarHeroi={() => setTelaAtiva("HUB")}
          />
        )}

        {telaAtiva === "CRIADOR" && (
          <TelaCriador
            aoVoltar={() => setTelaAtiva("LOBBY")}
            aoCriadoComSucesso={() => setTelaAtiva("LOBBY")}
          />
        )}

        {telaAtiva === "HUB" && (
          <TelaHubHeroi
            aoIrParaMural={() => setTelaAtiva("MURAL")}
            aoVoltarLobby={() => setTelaAtiva("LOBBY")}
          />
        )}

        {telaAtiva === "MURAL" && (
          <TelaMural
            aoVoltarAoHub={() => setTelaAtiva("HUB")}
            aoIniciarCombate={() => setTelaAtiva("ARENA")}
          />
        )}

        {telaAtiva === "ARENA" && (
          <TelaArena
            aoTerminarDuelo={(vitoria) => {
              setTelaAtiva(vitoria ? "HUB" : "LOBBY");
            }}
          />
        )}
      </main>

      {/* Modal Global do Códice de Vaslen */}
      <ModalCodice
        aberto={modalCodiceAberto}
        aoFechar={() => setModalCodiceAberto(false)}
      />

      {/* Rodapé Informativo para Banca Acadêmica */}
      <footer className="w-full max-w-6xl mt-8 pt-4 border-t border-[var(--border-card)] text-center text-[10px] font-silkscreen text-[var(--text-muted)] flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>FRACTURE: THE VASLEN ECHOES • SPRINT 5 (FRONTEND + POO REST)</span>
        <span className="text-[var(--accent-gold)]">
          Camada de Serviços Desacoplada: src/servicos/
        </span>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ProvedorAuth>
      <ProvedorJogo>
        <ConteudoApp />
      </ProvedorJogo>
    </ProvedorAuth>
  );
}
