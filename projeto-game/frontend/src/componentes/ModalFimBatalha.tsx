import type { FC } from "react";
import {
  IconePocaoVida,
  IconeElixirEnergia,
  IconeOleoDano,
  IconeOrbeReliquia
} from "./IconesPixelArt";

interface PropsModalFimBatalha {
  tipo: "VITORIA" | "DERROTA";
  nomeMonstro: string;
  xpGanho?: number;
  subiuNivel?: boolean;
  novoNivel?: number;
  loot?: {
    id: number;
    nome: string;
    tipo: string;
    descricao: string;
  };
  aoFechar: () => void;
}

export const ModalFimBatalha: FC<PropsModalFimBatalha> = ({
  tipo,
  nomeMonstro,
  xpGanho = 0,
  subiuNivel = false,
  novoNivel,
  loot,
  aoFechar
}) => {
  const eitoria = tipo === "VITORIA";

  const renderizarIconeLoot = (tipoItem: string) => {
    switch (tipoItem) {
      case "POCAO_VIDA":
        return <IconePocaoVida tamanho={32} />;
      case "ELIXIR_ENERGIA":
        return <IconeElixirEnergia tamanho={32} />;
      case "OLEO_DANO":
        return <IconeOleoDano tamanho={32} />;
      case "ORBE_RELIQUIA":
      default:
        return <IconeOrbeReliquia tamanho={32} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div
        className={`w-full max-w-lg pixel-box p-6 md:p-8 bg-[var(--bg-card)] border-4 shadow-pixel text-center ${
          eitoria
            ? "border-[var(--accent-gold)] shadow-pixel-ouro"
            : "border-red-700 shadow-pixel-sangue"
        }`}
      >
        {/* Ícone Gigante do Desfecho */}
        <div className="text-5xl md:text-6xl mb-3">
          {eitoria ? "🏆" : "☠️"}
        </div>

        {/* Título */}
        <h2
          className={`font-pixel text-base md:text-xl tracking-wider mb-2 ${
            eitoria ? "text-[var(--accent-gold)]" : "text-red-500"
          }`}
        >
          {eitoria ? "TRIUNFO EM VASLEN!" : "HERÓI CAÍDO EM COMBATE"}
        </h2>

        {/* Subtítulo Narrativo */}
        <p className="font-medieval text-lg md:text-xl text-[var(--text-secondary)] mb-6">
          {eitoria
            ? `Você derrotou o lendário ${nomeMonstro} e expurgou sua ameaça do bioma!`
            : `As sombras de ${nomeMonstro} consumiram seu espírito. Seu herói foi inativado (Soft Delete aplicado no banco).`}
        </p>

        {/* Recompensas (em caso de vitória) */}
        {eitoria && (
          <div className="space-y-3 mb-6">
            <div className="p-3 pixel-box bg-[var(--bg-panel)] border-2 border-[var(--border-card)] flex items-center justify-around font-silkscreen text-xs">
              <span className="text-[var(--accent-gold)]">
                ⭐ +{xpGanho} XP Recebidos
              </span>
              {subiuNivel && (
                <span className="text-emerald-400 font-bold animate-pulse">
                  ⬆️ EVOLUIU PARA O NÍVEL {novoNivel}!
                </span>
              )}
            </div>

            {loot && (
              <div className="p-3 pixel-box bg-[var(--bg-subcard)] border-2 border-[var(--accent-gold)] flex items-center gap-3 text-left">
                <div className="p-1 bg-black/50 border border-[var(--border-card)] shrink-0">
                  {renderizarIconeLoot(loot.tipo)}
                </div>
                <div>
                  <span className="font-silkscreen text-xs font-bold text-[var(--accent-gold)] block">
                    🎁 LOOT CONQUISTADO: {loot.nome}
                  </span>
                  <p className="font-medieval text-xs text-[var(--text-muted)] mt-0.5">
                    {loot.descricao}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Botão de Ação */}
        <button
          onClick={aoFechar}
          className={`pixel-btn text-xs md:text-sm py-3 px-6 w-full ${
            eitoria ? "pixel-btn-ouro" : "pixel-btn-sangue"
          }`}
        >
          {eitoria ? "RETORNAR AO HUB DO HERÓI" : "RETORNAR AO LOBBY DE HERÓIS"}
        </button>
      </div>
    </div>
  );
};
