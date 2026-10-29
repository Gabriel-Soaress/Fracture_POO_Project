import { createContext, useContext, useState, ReactNode, FC } from "react";
import { PersonagemServico } from "../servicos/PersonagemServico";
import type { PersonagemDTO, BiomaVaslen, SessaoCombateInicioDTO } from "../tipos/api";

interface ContextoJogoValor {
  heroiAtivo: PersonagemDTO | null;
  setHeroiAtivo: (heroi: PersonagemDTO | null) => void;
  recarregarHeroiAtivo: () => Promise<void>;
  biomaAtual: BiomaVaslen;
  setBiomaAtual: (bioma: BiomaVaslen) => void;
  sessaoCombate: SessaoCombateInicioDTO | null;
  setSessaoCombate: (sessao: SessaoCombateInicioDTO | null) => void;
  modalCodiceAberto: boolean;
  setModalCodiceAberto: (aberto: boolean) => void;
  efeitoCrt: boolean;
  setEfeitoCrt: (ativo: boolean) => void;
}

const JogoContext = createContext<ContextoJogoValor | undefined>(undefined);

export const ProvedorJogo: FC<{ children: ReactNode }> = ({ children }) => {
  const [heroiAtivo, setHeroiAtivo] = useState<PersonagemDTO | null>(null);
  const [biomaAtual, setBiomaAtual] = useState<BiomaVaslen>("CRIPTAS");
  const [sessaoCombate, setSessaoCombate] = useState<SessaoCombateInicioDTO | null>(null);
  const [modalCodiceAberto, setModalCodiceAberto] = useState<boolean>(false);
  const [efeitoCrt, setEfeitoCrt] = useState<boolean>(false);

  const recarregarHeroiAtivo = async () => {
    if (!heroiAtivo) return;
    try {
      const atualizado = await PersonagemServico.buscarPorId(heroiAtivo.id);
      setHeroiAtivo(atualizado);
    } catch (erro) {
      console.error("Falha ao recarregar dados do herói ativo:", erro);
    }
  };

  return (
    <JogoContext.Provider
      value={{
        heroiAtivo,
        setHeroiAtivo,
        recarregarHeroiAtivo,
        biomaAtual,
        setBiomaAtual,
        sessaoCombate,
        setSessaoCombate,
        modalCodiceAberto,
        setModalCodiceAberto,
        efeitoCrt,
        setEfeitoCrt
      }}
    >
      {children}
    </JogoContext.Provider>
  );
};

export const useJogo = (): ContextoJogoValor => {
  const contexto = useContext(JogoContext);
  if (!contexto) {
    throw new Error("useJogo deve ser utilizado dentro de um ProvedorJogo");
  }
  return contexto;
};
