import { useState, type FC, type FormEvent } from "react";
import { useAuth } from "../contextos/AuthContext";
import { ErroHttp } from "../servicos/clienteHttp";
import { IconeEspada, IconeCaveira } from "../componentes/IconesPixelArt";

export const TelaAuth: FC = () => {
  const { login, cadastrar } = useAuth();
  const [modoCadastro, setModoCadastro] = useState<boolean>(false);
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [submetendo, setSubmetendo] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (modoCadastro) {
      if (!nome.trim() || !email.trim() || !senha) {
        setErro("Todos os campos do juramento são obrigatórios.");
        return;
      }
      if (senha.length < 6) {
        setErro("A senha deve conter no mínimo 6 caracteres arcanos.");
        return;
      }
      if (senha !== confirmarSenha) {
        setErro("A confirmação da senha não corresponde.");
        return;
      }

      setSubmetendo(true);
      try {
        await cadastrar(nome.trim(), email.trim(), senha);
        setSucesso("Juramento selado com sucesso! Entrando no feudo...");
      } catch (err: any) {
        setErro(err instanceof ErroHttp ? err.message : "Falha ao selar juramento.");
      } finally {
        setSubmetendo(false);
      }
    } else {
      if (!email.trim() || !senha) {
        setErro("Informe o e-mail e a senha de seu juramento.");
        return;
      }

      setSubmetendo(true);
      try {
        await login(email.trim(), senha);
      } catch (err: any) {
        setErro(err instanceof ErroHttp ? err.message : "Credenciais inválidas ou portões inacessíveis.");
      } finally {
        setSubmetendo(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center">
      {/* Brasão Superior Retrô */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2">
          <IconeEspada tamanho={24} />
          <span className="w-3 h-3 bg-[var(--accent-gold)] inline-block shadow-pixel-sm"></span>
          <IconeCaveira tamanho={24} />
        </div>
        <h1 className="font-pixel text-sm md:text-lg text-[var(--accent-gold)] tracking-wider drop-shadow-[0_2px_0_#000]">
          FRACTURE: VASLEN
        </h1>
        <p className="font-medieval text-base text-[var(--text-muted)] mt-1">
          O Despertar dos Heróis nos Biomas Esquecidos
        </p>
      </div>

      {/* Caixa do Formulário */}
      <div className="w-full pixel-box p-6 bg-[var(--bg-panel)] shadow-pixel border-4 border-[var(--border-card)]">
        
        {/* Abas Alternadoras */}
        <div className="grid grid-cols-2 gap-2 mb-6 border-b-2 border-[var(--border-card)] pb-3">
          <button
            type="button"
            onClick={() => {
              setModoCadastro(false);
              setErro(null);
            }}
            className={`font-pixel text-[10px] md:text-xs py-2.5 px-3 pixel-box transition-all ${
              !modoCadastro
                ? "bg-[var(--accent-gold-dark)] text-[var(--accent-gold-light)] border-2 border-[var(--accent-gold)] shadow-pixel-ouro"
                : "bg-[var(--bg-subcard)] text-[var(--text-muted)] hover:text-white border border-[var(--border-card)]"
            }`}
          >
            ENTRAR
          </button>
          <button
            type="button"
            onClick={() => {
              setModoCadastro(true);
              setErro(null);
            }}
            className={`font-pixel text-[10px] md:text-xs py-2.5 px-3 pixel-box transition-all ${
              modoCadastro
                ? "bg-[var(--accent-gold-dark)] text-[var(--accent-gold-light)] border-2 border-[var(--accent-gold)] shadow-pixel-ouro"
                : "bg-[var(--bg-subcard)] text-[var(--text-muted)] hover:text-white border border-[var(--border-card)]"
            }`}
          >
            CADASTRAR
          </button>
        </div>

        {/* Mensagens de Feedback */}
        {erro && (
          <div className="mb-4 p-3 pixel-box bg-red-950/80 border-2 border-red-700 text-red-300 font-silkscreen text-xs">
            ⚠️ {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-4 p-3 pixel-box bg-emerald-950/80 border-2 border-emerald-600 text-emerald-300 font-silkscreen text-xs">
            ✨ {sucesso}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {modoCadastro && (
            <div>
              <label className="block font-silkscreen text-xs text-[var(--accent-gold)] mb-1.5">
                NOME DO JOGADOR
              </label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: Gabriel o Valente"
                maxLength={40}
                required
                className="w-full bg-[var(--bg-subcard)] border-2 border-[var(--border-card)] px-3 py-2 font-silkscreen text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] outline-none"
              />
            </div>
          )}

          <div>
            <label className="block font-silkscreen text-xs text-[var(--accent-gold)] mb-1.5">
              E-MAIL DO FEUDO
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="aventureiro@vaslen.com"
              required
              className="w-full bg-[var(--bg-subcard)] border-2 border-[var(--border-card)] px-3 py-2 font-silkscreen text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] outline-none"
            />
          </div>

          <div>
            <label className="block font-silkscreen text-xs text-[var(--accent-gold)] mb-1.5">
              PALAVRA DE PASSO (SENHA)
            </label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
              className="w-full bg-[var(--bg-subcard)] border-2 border-[var(--border-card)] px-3 py-2 font-silkscreen text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] outline-none"
            />
          </div>

          {modoCadastro && (
            <div>
              <label className="block font-silkscreen text-xs text-[var(--accent-gold)] mb-1.5">
                CONFIRME A PALAVRA DE PASSO
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
                className="w-full bg-[var(--bg-subcard)] border-2 border-[var(--border-card)] px-3 py-2 font-silkscreen text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submetendo}
            className={`w-full pixel-btn text-xs md:text-sm py-3 px-4 mt-6 ${
              modoCadastro ? "pixel-btn-ouro" : "pixel-btn-sangue"
            }`}
          >
            {submetendo ? (
              <span className="animate-pulse">PROCESSANDO JURAMENTO...</span>
            ) : modoCadastro ? (
              "FORJAR CONTA E JURAR"
            ) : (
              "TRANSPOR OS PORTÕES"
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
