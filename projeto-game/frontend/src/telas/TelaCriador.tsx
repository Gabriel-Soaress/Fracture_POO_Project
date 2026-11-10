import { useState, type FC, type FormEvent } from "react";
import { PersonagemServico } from "../servicos/PersonagemServico";
import { ErroHttp } from "../servicos/clienteHttp";
import type { ClasseHeroi } from "../tipos/api";

interface PropsTelaCriador {
  aoVoltar: () => void;
  aoCriadoComSucesso: () => void;
}

interface InfoClasse {
  id: ClasseHeroi;
  nome: string;
  subtitulo: string;
  icone: string;
  hpBase: number;
  energiaBase: number;
  descricao: string;
  classeSprite: string;
  itemInicial: {
    nome: string;
    efeito: string;
    tipoBadge: string;
    descricao: string;
  };
}

const CLASSES_DISPONIVEIS: InfoClasse[] = [
  {
    id: "GUERREIRO",
    nome: "CAVALEIRO DE FERRO",
    subtitulo: "Mestre em Armaduras Pesadas",
    icone: "🛡️",
    hpBase: 100,
    energiaBase: 70,
    descricao: "Especialista em absorção de dano e golpes devastadores. Possui alta resistência contra monstros brutais.",
    classeSprite: "sprite-heroi-idle",
    itemInicial: {
      nome: "Tônico da Guarda Real",
      efeito: "+35 HP",
      tipoBadge: "CURA DE VIDA",
      descricao: "Frasco consagrado da infantaria de Vaslen que restaura 35 de vida na linha de frente."
    }
  },
  {
    id: "MAGO",
    nome: "MAGO DO ECLIPSE",
    subtitulo: "Canalizador de Chamas Arcanas",
    icone: "🔮",
    hpBase: 100,
    energiaBase: 90,
    descricao: "Manipula os éteres sombrios para infligir grande dano mágico à distância. Reserva de energia superior.",
    classeSprite: "sprite-mago-idle",
    itemInicial: {
      nome: "Éter Condensado do Eclipse",
      efeito: "+40 EN",
      tipoBadge: "ENERGIA ARCANA",
      descricao: "Cristal líquido arcano que restaura 40 de energia mental do conjurador."
    }
  },
  {
    id: "SAMURAI",
    nome: "SAMURAI DAS SOMBRAS",
    subtitulo: "Mestre da Katana e do Arco",
    icone: "⛩️",
    hpBase: 100,
    energiaBase: 80,
    descricao: "Guerreiro oriental ágil e letal. Domina cortes rápidos de katana e disparos precisos à distância para explorar pontos vitais.",
    classeSprite: "sprite-arqueiro-idle",
    itemInicial: {
      nome: "Pílula de Foco Oriental",
      efeito: "+25 HP & +25 EN",
      tipoBadge: "ITEM COMPOSTO (POLIMÓRFICO)",
      descricao: "Composto ancestral dos samurais que restaura 25 de vida e 25 de energia simultaneamente."
    }
  }
];

export const TelaCriador: FC<PropsTelaCriador> = ({ aoVoltar, aoCriadoComSucesso }) => {
  const [nome, setNome] = useState<string>("");
  const [classeSelecionada, setClasseSelecionada] = useState<ClasseHeroi>("GUERREIRO");
  const [forca, setForca] = useState<number>(8);
  const [defesa, setDefesa] = useState<number>(7);
  const [agilidade, setAgilidade] = useState<number>(5);
  const [submetendo, setSubmetendo] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const totalPontosUsados = forca + defesa + agilidade;
  const pontosRestantes = 20 - totalPontosUsados;
  const distribuicaoValida = totalPontosUsados === 20;

  const selecionarClasseComPresets = (novaClasse: ClasseHeroi) => {
    setClasseSelecionada(novaClasse);
    if (novaClasse === "GUERREIRO") {
      setForca(9);
      setDefesa(7);
      setAgilidade(4);
    } else if (novaClasse === "MAGO") {
      setForca(4);
      setDefesa(5);
      setAgilidade(11);
    } else if (novaClasse === "SAMURAI" || novaClasse === "ARQUEIRO") {
      setForca(6);
      setDefesa(4);
      setAgilidade(10);
    }
  };

  const alterarAtributo = (tipo: "FOR" | "DEF" | "AGI", delta: number) => {
    setErro(null);
    if (delta > 0 && pontosRestantes <= 0) return;

    if (tipo === "FOR") {
      const novo = forca + delta;
      if (novo >= 1) setForca(novo);
    } else if (tipo === "DEF") {
      const novo = defesa + delta;
      if (novo >= 1) setDefesa(novo);
    } else if (tipo === "AGI") {
      const novo = agilidade + delta;
      if (novo >= 1) setAgilidade(novo);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!nome.trim()) {
      setErro("Dê um nome ao seu campeão.");
      return;
    }

    if (!distribuicaoValida) {
      setErro(`A soma dos atributos deve ser exatamente 20 pontos (RN01). Soma atual: ${totalPontosUsados}.`);
      return;
    }

    setSubmetendo(true);
    try {
      await PersonagemServico.criar({
        nome: nome.trim(),
        classe: classeSelecionada,
        forca,
        defesa,
        agilidade
      });
      aoCriadoComSucesso();
    } catch (err: any) {
      setErro(err instanceof ErroHttp ? err.message : "Falha ao forjar o herói.");
    } finally {
      setSubmetendo(false);
    }
  };

  const classeAtualInfo = CLASSES_DISPONIVEIS.find(c => c.id === classeSelecionada)!;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Barra Superior */}
      <div className="flex items-center justify-between border-b-2 border-[var(--border-card)] pb-3">
        <button
          onClick={aoVoltar}
          className="pixel-btn text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <span>⬅️</span> Voltar ao Salão
        </button>
        <span className="font-pixel text-xs text-[var(--accent-gold)]">
          FORJA DE CAMPEÕES (REGRA RN01: 20 PONTOS)
        </span>
      </div>

      {erro && (
        <div className="p-4 pixel-box bg-red-950/80 border-2 border-red-700 text-red-300 font-silkscreen text-xs">
          ⚠️ {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Coluna Esquerda: Nome e Seletor de Classe (7 cols) */}
        <div className="md:col-span-7 space-y-5">
          
          {/* Nome */}
          <div className="pixel-box p-4 bg-[var(--bg-panel)] border-2 border-[var(--border-card)]">
            <label className="block font-silkscreen text-xs text-[var(--accent-gold)] mb-2">
              NOME DO HERÓI
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Ex: Aldor de Vaslen"
              maxLength={25}
              required
              className="w-full bg-[var(--bg-subcard)] border-2 border-[var(--border-card)] px-3 py-2.5 font-silkscreen text-sm text-[var(--text-primary)] focus:border-[var(--accent-gold)] outline-none"
            />
          </div>

          {/* Seleção de Classe */}
          <div className="pixel-box p-4 bg-[var(--bg-panel)] border-2 border-[var(--border-card)]">
            <label className="block font-silkscreen text-xs text-[var(--accent-gold)] mb-3">
              ESCOLHA O ARQUÉTIPO MARCIAL
            </label>
            <div className="grid grid-cols-3 gap-3">
              {CLASSES_DISPONIVEIS.map(c => {
                const ativo = c.id === classeSelecionada;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selecionarClasseComPresets(c.id)}
                    className={`p-3 pixel-box text-center transition-all flex flex-col items-center justify-between min-h-[100px] ${
                      ativo
                        ? "bg-[var(--accent-gold-dark)] border-2 border-[var(--accent-gold)] shadow-pixel-ouro scale-[1.02]"
                        : "bg-[var(--bg-subcard)] border border-[var(--border-card)] hover:border-[var(--border-light)] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <span className="text-2xl mb-1">{c.icone}</span>
                    <span className="font-silkscreen text-xs font-bold text-[var(--text-primary)]">
                      {c.nome.split(" ")[0]}
                    </span>
                    <span className="font-pixel text-[7px] text-[var(--text-muted)] mt-0.5">
                      {c.id}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Descrição da Classe Selecionada */}
            <div className="mt-4 p-3 bg-[var(--bg-subcard)] border border-[var(--border-card)]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-silkscreen text-xs text-[var(--accent-gold)] font-bold">
                  {classeAtualInfo.nome}
                </span>
                <span className="font-silkscreen text-[10px] text-[var(--text-muted)]">
                  HP {classeAtualInfo.hpBase} | EN {classeAtualInfo.energiaBase}
                </span>
              </div>
              <p className="font-medieval text-sm text-[var(--text-secondary)] leading-relaxed">
                {classeAtualInfo.descricao}
              </p>
            </div>
          </div>

          {/* Controlador Interativo dos 20 Pontos */}
          <div className="pixel-box p-4 bg-[var(--bg-panel)] border-2 border-[var(--border-card)]">
            <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2 mb-4">
              <span className="font-silkscreen text-xs text-[var(--accent-gold)]">
                DISTRIBUIÇÃO DE PONTOS DE ATRIBUTO
              </span>
              <span
                className={`font-pixel text-xs px-2.5 py-1 pixel-box ${
                  distribuicaoValida
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500"
                    : "bg-amber-950 text-amber-300 border border-amber-500 animate-pulse"
                }`}
              >
                RESTANTES: {pontosRestantes} / 20
              </span>
            </div>

            {/* Linha FORÇA */}
            <div className="space-y-3 font-silkscreen text-xs">
              <div className="flex items-center justify-between p-2 bg-[var(--bg-subcard)] border border-[var(--border-card)]">
                <div className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">⚔️ FORÇA:</span>
                  <span className="font-pixel text-sm text-[var(--text-primary)]">{forca}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => alterarAtributo("FOR", -1)}
                    disabled={forca <= 1}
                    className="pixel-btn text-xs w-8 h-8 flex items-center justify-center disabled:opacity-30"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => alterarAtributo("FOR", 1)}
                    disabled={pontosRestantes <= 0}
                    className="pixel-btn pixel-btn-ouro text-xs w-8 h-8 flex items-center justify-center disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Linha DEFESA */}
              <div className="flex items-center justify-between p-2 bg-[var(--bg-subcard)] border border-[var(--border-card)]">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">🛡️ DEFESA:</span>
                  <span className="font-pixel text-sm text-[var(--text-primary)]">{defesa}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => alterarAtributo("DEF", -1)}
                    disabled={defesa <= 1}
                    className="pixel-btn text-xs w-8 h-8 flex items-center justify-center disabled:opacity-30"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => alterarAtributo("DEF", 1)}
                    disabled={pontosRestantes <= 0}
                    className="pixel-btn pixel-btn-ouro text-xs w-8 h-8 flex items-center justify-center disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Linha AGILIDADE */}
              <div className="flex items-center justify-between p-2 bg-[var(--bg-subcard)] border border-[var(--border-card)]">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">⚡ AGILIDADE:</span>
                  <span className="font-pixel text-sm text-[var(--text-primary)]">{agilidade}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => alterarAtributo("AGI", -1)}
                    disabled={agilidade <= 1}
                    className="pixel-btn text-xs w-8 h-8 flex items-center justify-center disabled:opacity-30"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => alterarAtributo("AGI", 1)}
                    disabled={pontosRestantes <= 0}
                    className="pixel-btn pixel-btn-ouro text-xs w-8 h-8 flex items-center justify-center disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Coluna Direita: Preview do Campeão e Botão Consagrar (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          
          <div className="pixel-box p-6 bg-[var(--bg-panel)] border-2 border-[var(--border-card)] flex flex-col items-center text-center">
            <span className="font-pixel text-[10px] text-[var(--accent-gold)] mb-3">
              PREVIEW VISUAL DO CAMPEÃO
            </span>

            {/* Plataforma e Sprite */}
            <div className="h-44 w-full bg-[var(--bg-subcard)] border-2 border-[var(--border-card)] flex flex-col items-center justify-center relative overflow-hidden mb-4">
              <div className="transform scale-[1.8] origin-bottom mt-10">
                <div className={`w-[128px] h-[128px] pixelated ${classeAtualInfo.classeSprite}`}></div>
              </div>
            </div>

            <h3 className="font-pixel text-sm text-[var(--accent-gold-light)] mb-1">
              {nome.trim() || "Herói Sem Nome"}
            </h3>
            <span className="font-silkscreen text-xs text-[var(--text-muted)]">
              {classeAtualInfo.nome} • Nível 1
            </span>

            <div className="w-full mt-4 p-3 bg-black/40 border border-[var(--border-card)] text-left font-silkscreen text-[11px] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Vida Inicial:</span>
                <span className="text-rose-400 font-bold">{classeAtualInfo.hpBase} HP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Energia Inicial:</span>
                <span className="text-cyan-400 font-bold">{classeAtualInfo.energiaBase} EN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Poder de Ataque Estimado:</span>
                <span className="text-red-400 font-bold">~{forca * 2.5} Dano</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Chance Crítico Estimada:</span>
                <span className="text-emerald-400 font-bold">~{agilidade * 1.5}%</span>
              </div>
            </div>

            {/* Item Inicial Exclusivo da Classe */}
            <div className="w-full mt-3 p-3 bg-[var(--bg-subcard)] border-2 border-[var(--accent-gold)]/70 text-left">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-pixel text-[8px] text-[var(--accent-gold)]">
                  🎒 ITEM INICIAL NA MOCHILA
                </span>
                <span className="font-pixel text-[7.5px] px-1.5 py-0.5 bg-black/60 text-emerald-300 border border-emerald-500/60">
                  {classeAtualInfo.itemInicial.efeito}
                </span>
              </div>
              <div className="font-silkscreen text-xs font-bold text-[var(--accent-gold-light)]">
                {classeAtualInfo.itemInicial.nome}
              </div>
              <div className="font-pixel text-[7px] text-amber-300/80 mb-1">
                [{classeAtualInfo.itemInicial.tipoBadge}]
              </div>
              <p className="font-medieval text-xs text-[var(--text-secondary)] leading-snug">
                {classeAtualInfo.itemInicial.descricao}
              </p>
            </div>
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={!distribuicaoValida || !nome.trim() || submetendo}
            className={`w-full pixel-btn text-xs md:text-sm py-3.5 px-4 ${
              distribuicaoValida && nome.trim()
                ? "pixel-btn-ouro"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            {submetendo ? (
              <span className="animate-pulse">CONSAGRANDO CAMPEÃO...</span>
            ) : !distribuicaoValida ? (
              `DISTRIBUA OS 20 PONTOS (${pontosRestantes} RESTANTES)`
            ) : (
              "CONSAGRAR HERÓI EM VASLEN"
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
