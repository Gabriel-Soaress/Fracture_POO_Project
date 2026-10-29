import { createContext, useContext, useState, useEffect, ReactNode, FC } from "react";
import { AutenticacaoServico } from "../servicos/AutenticacaoServico";
import type { UsuarioDTO } from "../tipos/api";

interface ContextoAuthValor {
  usuario: UsuarioDTO | null;
  carregando: boolean;
  autenticado: boolean;
  login: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<ContextoAuthValor | undefined>(undefined);

export const ProvedorAuth: FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    const verificarSessao = async () => {
      if (AutenticacaoServico.estaAutenticado()) {
        try {
          const resposta = await AutenticacaoServico.obterPerfil();
          setUsuario(resposta.usuario);
        } catch {
          AutenticacaoServico.deslogar();
          setUsuario(null);
        }
      }
      setCarregando(false);
    };

    verificarSessao();
  }, []);

  const login = async (email: string, senha: string) => {
    const resposta = await AutenticacaoServico.login(email, senha);
    setUsuario(resposta.usuario);
  };

  const cadastrar = async (nome: string, email: string, senha: string) => {
    await AutenticacaoServico.cadastrar(nome, email, senha);
    // Realiza o login imediatamente após cadastrar
    await login(email, senha);
  };

  const logout = () => {
    AutenticacaoServico.deslogar();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        autenticado: !!usuario,
        login,
        cadastrar,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): ContextoAuthValor => {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth deve ser utilizado dentro de um ProvedorAuth");
  }
  return contexto;
};
