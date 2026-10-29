import type { FC } from "react";

interface IconeProps {
  className?: string;
  tamanho?: number;
}

/**
 * Ícone Pixel Art: Poção de Sangue / Vida Menor e Maior
 */
export const IconePocaoVida: FC<IconeProps> = ({ className = "", tamanho = 32 }) => (
  <svg
    width={tamanho}
    height={tamanho}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pixelated ${className}`}
    style={{ shapeRendering: "crispEdges" }}
  >
    {/* Tampa de rolha de madeira */}
    <rect x="6" y="1" width="4" height="2" fill="#854d0e" />
    <rect x="7" y="1" width="2" height="1" fill="#a16207" />
    
    {/* Gargalo de vidro */}
    <rect x="6" y="3" width="4" height="2" fill="#64748b" />
    <rect x="7" y="3" width="2" height="2" fill="#cbd5e1" opacity="0.6" />

    {/* Corpo do frasco */}
    <rect x="4" y="5" width="8" height="9" fill="#1e293b" />
    
    {/* Líquido vermelho rubi / sangue */}
    <rect x="5" y="7" width="6" height="6" fill="#be123c" />
    <rect x="5" y="9" width="6" height="4" fill="#e11d48" />
    <rect x="6" y="11" width="4" height="2" fill="#fb7185" />

    {/* Reflexo de luz no vidro */}
    <rect x="5" y="6" width="1" height="5" fill="#ffffff" opacity="0.7" />
    <rect x="6" y="5" width="2" height="1" fill="#ffffff" opacity="0.5" />
    <rect x="10" y="10" width="1" height="2" fill="#4c0519" />
  </svg>
);

/**
 * Ícone Pixel Art: Elixir de Energia / Miasma Espectral
 */
export const IconeElixirEnergia: FC<IconeProps> = ({ className = "", tamanho = 32 }) => (
  <svg
    width={tamanho}
    height={tamanho}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pixelated ${className}`}
    style={{ shapeRendering: "crispEdges" }}
  >
    {/* Rolha */}
    <rect x="6" y="1" width="4" height="2" fill="#a16207" />
    {/* Gargalo */}
    <rect x="6" y="3" width="4" height="2" fill="#475569" />
    {/* Frasco losangular */}
    <rect x="5" y="5" width="6" height="2" fill="#1e293b" />
    <rect x="4" y="7" width="8" height="4" fill="#1e293b" />
    <rect x="5" y="11" width="6" height="3" fill="#1e293b" />
    
    {/* Líquido ciano / energia cósmica */}
    <rect x="5" y="8" width="6" height="5" fill="#0891b2" />
    <rect x="6" y="9" width="4" height="3" fill="#06b6d4" />
    <rect x="7" y="10" width="2" height="2" fill="#67e8f9" />
    
    {/* Brilho */}
    <rect x="5" y="7" width="1" height="4" fill="#ffffff" opacity="0.8" />
  </svg>
);

/**
 * Ícone Pixel Art: Óleo de Forja / Reforço de Dano
 */
export const IconeOleoDano: FC<IconeProps> = ({ className = "", tamanho = 32 }) => (
  <svg
    width={tamanho}
    height={tamanho}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pixelated ${className}`}
    style={{ shapeRendering: "crispEdges" }}
  >
    {/* Frasco bojudo de barro/ferro */}
    <rect x="6" y="1" width="4" height="2" fill="#475569" />
    <rect x="5" y="3" width="6" height="2" fill="#334155" />
    <rect x="3" y="5" width="10" height="9" fill="#1e293b" />

    {/* Fogo interior âmbar */}
    <rect x="5" y="7" width="6" height="6" fill="#b45309" />
    <rect x="6" y="8" width="4" height="4" fill="#f59e0b" />
    <rect x="7" y="9" width="2" height="2" fill="#fef08a" />
    
    {/* Chama saindo */}
    <rect x="7" y="4" width="2" height="2" fill="#f97316" />
    <rect x="7" y="2" width="1" height="1" fill="#fde047" />
  </svg>
);

/**
 * Ícone Pixel Art: Orbe dos Nove Ecos / Relíquia Suprema
 */
export const IconeOrbeReliquia: FC<IconeProps> = ({ className = "", tamanho = 32 }) => (
  <svg
    width={tamanho}
    height={tamanho}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pixelated ${className}`}
    style={{ shapeRendering: "crispEdges" }}
  >
    {/* Suporte de ouro */}
    <rect x="5" y="13" width="6" height="2" fill="#a16207" />
    <rect x="6" y="11" width="4" height="2" fill="#ca8a04" />
    <rect x="3" y="8" width="2" height="4" fill="#ca8a04" />
    <rect x="11" y="8" width="2" height="4" fill="#ca8a04" />

    {/* Esfera mágica violeta e carmesim */}
    <rect x="5" y="4" width="6" height="7" fill="#6b21a8" />
    <rect x="4" y="5" width="8" height="5" fill="#7e22ce" />
    <rect x="6" y="5" width="4" height="5" fill="#a855f7" />
    <rect x="7" y="6" width="2" height="3" fill="#c084fc" />
    
    {/* Núcleo brilhante */}
    <rect x="7" y="7" width="1" height="1" fill="#ffffff" />
  </svg>
);

/**
 * Ícone Pixel Art: Espada de Ferro
 */
export const IconeEspada: FC<IconeProps> = ({ className = "", tamanho = 32 }) => (
  <svg
    width={tamanho}
    height={tamanho}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pixelated ${className}`}
    style={{ shapeRendering: "crispEdges" }}
  >
    {/* Lâmina */}
    <rect x="12" y="1" width="2" height="2" fill="#f8fafc" />
    <rect x="10" y="2" width="3" height="3" fill="#e2e8f0" />
    <rect x="8" y="4" width="3" height="3" fill="#cbd5e1" />
    <rect x="6" y="6" width="3" height="3" fill="#94a3b8" />
    <rect x="4" y="8" width="3" height="3" fill="#64748b" />
    
    {/* Guarda da espada */}
    <rect x="5" y="10" width="2" height="2" fill="#ca8a04" />
    <rect x="2" y="7" width="2" height="2" fill="#ca8a04" />
    <rect x="4" y="9" width="3" height="2" fill="#a16207" />

    {/* Cabo e Pomo */}
    <rect x="2" y="11" width="2" height="2" fill="#78350f" />
    <rect x="1" y="13" width="2" height="2" fill="#eab308" />
  </svg>
);

/**
 * Ícone Pixel Art: Escudo Fortificado
 */
export const IconeEscudo: FC<IconeProps> = ({ className = "", tamanho = 32 }) => (
  <svg
    width={tamanho}
    height={tamanho}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pixelated ${className}`}
    style={{ shapeRendering: "crispEdges" }}
  >
    {/* Borda do escudo */}
    <rect x="3" y="1" width="10" height="2" fill="#a16207" />
    <rect x="2" y="3" width="12" height="5" fill="#a16207" />
    <rect x="3" y="8" width="10" height="3" fill="#a16207" />
    <rect x="5" y="11" width="6" height="2" fill="#a16207" />
    <rect x="7" y="13" width="2" height="2" fill="#a16207" />

    {/* Centro de ferro */}
    <rect x="4" y="3" width="8" height="7" fill="#334155" />
    <rect x="6" y="10" width="4" height="2" fill="#334155" />
    <rect x="5" y="4" width="6" height="5" fill="#475569" />

    {/* Cruz medieval dourada */}
    <rect x="7" y="4" width="2" height="6" fill="#fde047" />
    <rect x="5" y="5" width="6" height="2" fill="#fde047" />
  </svg>
);

/**
 * Ícone Pixel Art: Caveira (Chefe / Dificuldade / Monstro Derrotado)
 */
export const IconeCaveira: FC<IconeProps> = ({ className = "", tamanho = 32 }) => (
  <svg
    width={tamanho}
    height={tamanho}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pixelated ${className}`}
    style={{ shapeRendering: "crispEdges" }}
  >
    {/* Topo do crânio */}
    <rect x="5" y="2" width="6" height="2" fill="#e2e8f0" />
    <rect x="3" y="4" width="10" height="5" fill="#e2e8f0" />
    
    {/* Olhos e nariz escuros */}
    <rect x="4" y="6" width="3" height="3" fill="#0f172a" />
    <rect x="9" y="6" width="3" height="3" fill="#0f172a" />
    <rect x="7" y="9" width="2" height="1" fill="#0f172a" />

    {/* Dentes */}
    <rect x="5" y="11" width="6" height="3" fill="#cbd5e1" />
    <rect x="6" y="12" width="1" height="2" fill="#0f172a" />
    <rect x="8" y="12" width="1" height="2" fill="#0f172a" />
    <rect x="10" y="12" width="1" height="2" fill="#0f172a" />
  </svg>
);

/**
 * Ícone Pixel Art: Moeda de Ouro
 */
export const IconeMoedaOuro: FC<IconeProps> = ({ className = "", tamanho = 32 }) => (
  <svg
    width={tamanho}
    height={tamanho}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pixelated ${className}`}
    style={{ shapeRendering: "crispEdges" }}
  >
    <rect x="5" y="2" width="6" height="1" fill="#ca8a04" />
    <rect x="3" y="3" width="10" height="2" fill="#eab308" />
    <rect x="2" y="5" width="12" height="6" fill="#facc15" />
    <rect x="3" y="11" width="10" height="2" fill="#eab308" />
    <rect x="5" y="13" width="6" height="1" fill="#ca8a04" />
    {/* Emblema central */}
    <rect x="6" y="5" width="4" height="6" fill="#a16207" />
    <rect x="7" y="6" width="2" height="4" fill="#fef08a" />
  </svg>
);
