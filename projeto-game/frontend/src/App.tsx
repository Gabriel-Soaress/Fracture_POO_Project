import { useState, type FC } from "react";
import { ProvedorAuth, useAuth } from "./contextos/AuthContext";
import { ProvedorJogo, useJogo } from "./contextos/JogoContext";
import { NavegadorSuperior, type TelaAtiva } from "./componentes/NavegadorSuperior";
import { ModalCodice } from "./componentes/ModalCodice";
import { TelaAuth } from "./telas/TelaAuth";
import { TelaLobby } from "./telas/TelaLobby";
import { TelaCriador } from "./telas/TelaCriador";
import { TelaHubHeroi } from "./telas/TelaHubHeroi";
import { TelaMural } from "./telas/TelaMural";
import { TelaArena } from "./telas/TelaArena";

const ConteudoApp: FC = () => {
  const { carregando, autenticado } = useAuth();
  const {
    biomaAtual,
    setBiomaAtual,
    setHeroiAtivo,
    setSessaoCombate,
    modalCodiceAberto,
    setModalCodiceAberto,
    efeitoCrt
  } = useJogo();
  const [telaAtiva, setTelaAtiva] = useState<TelaAtiva>("LOBBY");

  const irParaLobby = () => {
    setSessaoCombate(null);
    setHeroiAtivo(null);
    setBiomaAtual("CRIPTAS");
    setTelaAtiva("LOBBY");
  };

  const irParaHub = () => {
    setSessaoCombate(null);
    setBiomaAtual("CRIPTAS");
    setTelaAtiva("HUB");
  };

  const irParaMural = () => {
    setSessaoCombate(null);
    setTelaAtiva("MURAL");
  };

  // No Lobby, Criador e Hub usamos o tema padrão do Feudo (CRIPTAS) para o HUD nunca ficar com cores instáveis
  const temaAplicado = telaAtiva === "MURAL" || telaAtiva === "ARENA" ? biomaAtual : "CRIPTAS";

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
        data-theme="CRIPTAS"
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
      data-theme={temaAplicado}
      className="relative min-h-screen text-[var(--text-primary)] p-3 md:p-6 flex flex-col items-center transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* Efeito CRT Retro Scanlines */}
      {efeitoCrt && <div className="fixed inset-0 scanlines pointer-events-none z-50 opacity-30"></div>}

      {/* Navegador Superior com dados do Herói e Logout */}
      <NavegadorSuperior
        telaAtiva={telaAtiva}
        aoNavegarParaLobby={irParaLobby}
        aoNavegarParaHub={irParaHub}
        aoNavegarParaMural={irParaMural}
      />

      {/* Roteamento das 5 Telas Principais da Aplicação */}
      <main className="w-full max-w-6xl flex-1 flex flex-col justify-start">
        {telaAtiva === "LOBBY" && (
          <TelaLobby
            aoCriarPersonagem={() => {
              setHeroiAtivo(null);
              setTelaAtiva("CRIADOR");
            }}
            aoSelecionarHeroi={irParaHub}
          />
        )}

        {telaAtiva === "CRIADOR" && (
          <TelaCriador
            aoVoltar={irParaLobby}
            aoCriadoComSucesso={irParaLobby}
          />
        )}

        {telaAtiva === "HUB" && (
          <TelaHubHeroi
            aoIrParaMural={irParaMural}
            aoVoltarLobby={irParaLobby}
          />
        )}

        {telaAtiva === "MURAL" && (
          <TelaMural
            aoVoltarAoHub={irParaHub}
            aoIniciarCombate={() => setTelaAtiva("ARENA")}
          />
        )}

        {telaAtiva === "ARENA" && (
          <TelaArena
            aoTerminarDuelo={(vitoria) => {
              if (vitoria) {
                irParaHub();
              } else {
                irParaLobby();
              }
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
