import { useState, useEffect, type FC } from "react";
import { CodiceServico } from "../servicos/CodiceServico";
import type { EntradaCodiceDTO } from "../tipos/api";

interface PropsModalCodice {
  aberto: boolean;
  aoFechar: () => void;
}

export const ModalCodice: FC<PropsModalCodice> = ({ aberto, aoFechar }) => {
  const [entradas, setEntradas] = useState<EntradaCodiceDTO[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("TODOS");
  const [buscaTexto, setBuscaTexto] = useState<string>("");
  const [entradaSelecionada, setEntradaSelecionada] = useState<EntradaCodiceDTO | null>(null);

  useEffect(() => {
    if (!aberto) return;

    const carregarCodice = async () => {
      setCarregando(true);
      try {
        const dados = await CodiceServico.listar();
        setEntradas(dados);
        if (dados.length > 0 && !entradaSelecionada) {
          setEntradaSelecionada(dados[0]);
        }
      } catch (erro) {
        console.error("Falha ao carregar Códice de Vaslen:", erro);
      } finally {
        setCarregando(false);
      }
    };

    carregarCodice();
  }, [aberto]);

  if (!aberto) return null;

  const categorias = ["TODOS", "LORE", "BIOMA", "MONSTRO", "ITEM", "RELIQUIA"];

  const entradasFiltradas = entradas.filter(e => {
    const correspondeCategoria = filtroCategoria === "TODOS" || e.categoria === filtroCategoria;
    const correspondeTexto =
      e.titulo.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      e.conteudo.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      e.tags.some(t => t.toLowerCase().includes(buscaTexto.toLowerCase()));

    return correspondeCategoria && correspondeTexto;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[90vh] max-h-[720px] pixel-box p-4 md:p-6 bg-[var(--bg-card)] border-4 border-[var(--accent-gold)] shadow-pixel-ouro flex flex-col">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📜</span>
            <div>
              <h2 className="font-pixel text-xs md:text-sm text-[var(--accent-gold-light)]">
                O CÓDICE SECULAR DE VASLEN
              </h2>
              <span className="font-silkscreen text-[10px] text-[var(--text-muted)]">
                Enciclopédia Arcana, Lendas de Biomas e Relíquias do Eclipse
              </span>
            </div>
          </div>
          <button
            onClick={aoFechar}
            className="font-pixel text-xs text-[var(--text-muted)] hover:text-white px-2 py-1 pixel-btn"
          >
            [X]
          </button>
        </div>

        {/* Barra de Filtro e Busca */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-4 shrink-0">
          <input
            type="text"
            value={buscaTexto}
            onChange={e => setBuscaTexto(e.target.value)}
            placeholder="Pesquisar por nome, bioma ou relíquia..."
            className="flex-1 bg-[var(--bg-subcard)] border-2 border-[var(--border-card)] px-3 py-2 font-silkscreen text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] outline-none"
          />

          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`font-pixel text-[9px] px-2.5 py-1.5 pixel-box transition-colors whitespace-nowrap ${
                  filtroCategoria === cat
                    ? "bg-[var(--accent-gold-dark)] text-[var(--accent-gold-light)] border-2 border-[var(--accent-gold)]"
                    : "bg-[var(--bg-panel)] text-[var(--text-muted)] hover:text-white border border-[var(--border-card)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Corpo: Lista à Esquerda + Conteúdo à Direita */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-hidden min-h-0">
          
          {/* Coluna Esquerda: Lista de Entradas */}
          <div className="md:col-span-5 border-2 border-[var(--border-card)] bg-[var(--bg-panel)] p-2 overflow-y-auto space-y-1.5">
            {carregando ? (
              <div className="font-pixel text-[10px] text-[var(--text-muted)] p-4 text-center animate-pulse">
                Consultando pergaminhos...
              </div>
            ) : entradasFiltradas.length === 0 ? (
              <div className="font-silkscreen text-xs text-[var(--text-muted)] p-4 text-center">
                Nenhum registro encontrado.
              </div>
            ) : (
              entradasFiltradas.map(e => {
                const selecionada = entradaSelecionada?.id === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => setEntradaSelecionada(e)}
                    className={`w-full text-left p-2.5 pixel-box transition-all flex flex-col gap-1 ${
                      selecionada
                        ? "bg-[var(--bg-subcard)] border-2 border-[var(--accent-gold)] shadow-pixel-ouro"
                        : "bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-light)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-silkscreen text-xs font-bold text-[var(--text-primary)] truncate">
                        {e.titulo}
                      </span>
                      <span className="font-pixel text-[7.5px] px-1.5 py-0.5 bg-black/50 text-[var(--accent-gold)] border border-[var(--border-card)]">
                        {e.categoria}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {e.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="font-silkscreen text-[8px] text-[var(--text-muted)]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Coluna Direita: Leitura do Registro Selecionado */}
          <div className="md:col-span-7 border-2 border-[var(--border-card)] bg-[var(--bg-panel)] p-4 md:p-6 overflow-y-auto flex flex-col justify-between">
            {entradaSelecionada ? (
              <div className="space-y-4">
                <div className="border-b-2 border-[var(--border-card)] pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-pixel text-[8px] px-2 py-0.5 bg-[var(--accent-gold-dark)] text-[var(--accent-gold-light)] border border-[var(--accent-gold)]">
                      CATEGORIA: {entradaSelecionada.categoria}
                    </span>
                    <span className="font-silkscreen text-[10px] text-[var(--text-muted)]">
                      Registro #{entradaSelecionada.id}
                    </span>
                  </div>
                  <h3 className="font-pixel text-sm md:text-base text-[var(--accent-gold-light)]">
                    {entradaSelecionada.titulo}
                  </h3>
                </div>

                <div className="font-medieval text-base md:text-lg text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                  {entradaSelecionada.conteudo}
                </div>

                <div className="pt-4 border-t border-[var(--border-card)]">
                  <span className="font-silkscreen text-[10px] text-[var(--accent-gold)] block mb-1">
                    TAGS RELACIONADAS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {entradaSelecionada.tags.map(tag => (
                      <span
                        key={tag}
                        className="font-pixel text-[8px] px-2 py-1 bg-black/60 text-[var(--text-muted)] border border-[var(--border-card)]"
                      >
                        🏷️ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center font-medieval text-base text-[var(--text-muted)]">
                Selecione uma entrada ao lado para decifrar seu conteúdo.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
