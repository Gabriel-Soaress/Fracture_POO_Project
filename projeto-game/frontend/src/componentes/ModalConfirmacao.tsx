import type { FC } from "react";

interface PropsModalConfirmacao {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  perigoso?: boolean;
  aoConfirmar: () => void;
  aoCancelar: () => void;
}

export const ModalConfirmacao: FC<PropsModalConfirmacao> = ({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = "CONFIRMAR",
  textoCancelar = "CANCELAR",
  perigoso = false,
  aoConfirmar,
  aoCancelar
}) => {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`w-full max-w-md pixel-box p-6 bg-[var(--bg-card)] shadow-pixel ${
        perigoso ? "border-4 border-red-700 shadow-pixel-sangue" : "border-4 border-[var(--accent-gold)] shadow-pixel-ouro"
      }`}>
        <div className="flex items-center gap-3 border-b-2 border-[var(--border-card)] pb-3 mb-4">
          <span className="text-2xl">{perigoso ? "💀" : "📜"}</span>
          <h3 className={`font-pixel text-xs md:text-sm ${
            perigoso ? "text-red-400" : "text-[var(--accent-gold-light)]"
          }`}>
            {titulo}
          </h3>
        </div>

        <p className="font-medieval text-base text-[var(--text-secondary)] mb-6 leading-relaxed">
          {mensagem}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={aoCancelar}
            className="pixel-btn text-xs py-2 px-4"
          >
            {textoCancelar}
          </button>
          <button
            onClick={aoConfirmar}
            className={`pixel-btn text-xs py-2 px-4 ${perigoso ? "pixel-btn-sangue" : "pixel-btn-ouro"}`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};
