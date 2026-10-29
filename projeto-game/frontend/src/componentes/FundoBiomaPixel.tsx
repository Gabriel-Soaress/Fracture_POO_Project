import type { FC } from "react";

export type BiomaId = 
  | "CRIPTAS" 
  | "BOSQUE_SOMBRIO" 
  | "LABIRINTO_CINZAS" 
  | "PANTANO_PETRIFICANTE"
  | "COLINAS_LUA_SANGUE" 
  | "LIMBO_ESPECTRAL"
  | "PINACULO_ECLIPSE";

interface FundoBiomaProps {
  bioma: BiomaId;
}

/**
 * Renderizador de Planos de Fundo em Pixel Art para cada Bioma de Vaslen.
 * Projetado com perspectiva isométrica de batalha profunda: o chão começa na metade da tela (y=90)
 * para que o monstro no topo-direito e o herói na base fiquem 100% fincados no piso sólido!
 */
export const FundoBiomaPixel: FC<FundoBiomaProps> = ({ bioma }) => {
  switch (bioma) {
    case "CRIPTAS":
      return (
        <svg
          viewBox="0 0 320 180"
          preserveAspectRatio="none"
          className="w-full h-full pixelated select-none"
          style={{ shapeRendering: "crispEdges" }}
        >
          {/* Teto e parede das catacumbas */}
          <rect width="320" height="180" fill="#080a0f" />
          
          {/* Parede de pedra ao fundo (até y=85) */}
          {Array.from({ length: 6 }).map((_, row) => (
            <g key={row} opacity="0.35">
              {Array.from({ length: 11 }).map((_, col) => (
                <rect
                  key={col}
                  x={col * 30 + (row % 2 === 0 ? 0 : 15)}
                  y={row * 14}
                  width="28"
                  height="12"
                  fill="#151b27"
                  stroke="#0f131c"
                  strokeWidth="1"
                />
              ))}
            </g>
          ))}

          {/* Arcos góticos ao fundo */}
          <path d="M 30 85 L 30 20 Q 65 5 100 20 L 100 85 Z" fill="#0c1017" opacity="0.9" />
          <path d="M 210 85 L 210 20 Q 245 5 280 20 L 280 85 Z" fill="#0c1017" opacity="0.9" />

          {/* Pilares com tochas azuis */}
          <rect x="25" y="10" width="10" height="75" fill="#1b2434" />
          <rect x="27" y="10" width="3" height="75" fill="#2d3a52" />
          <rect x="280" y="10" width="10" height="75" fill="#1b2434" />
          <rect x="282" y="10" width="3" height="75" fill="#2d3a52" />

          <rect x="29" y="42" width="3" height="6" fill="#78350f" />
          <rect x="29" y="37" width="3" height="4" fill="#0284c7" />
          <rect x="30" y="35" width="1" height="2" fill="#e0f2fe" />
          <circle cx="30" cy="38" r="14" fill="#0ea5e9" opacity="0.12" />

          <rect x="284" y="42" width="3" height="6" fill="#78350f" />
          <rect x="284" y="37" width="3" height="4" fill="#0284c7" />
          <rect x="285" y="35" width="1" height="2" fill="#e0f2fe" />
          <circle cx="285" cy="38" r="14" fill="#0ea5e9" opacity="0.12" />

          {/* CHÃO PROFUNDO DAS CRIPTAS (começa em y=85, cobrindo toda a arena de duelo) */}
          <rect x="0" y="85" width="320" height="95" fill="#101520" />
          <rect x="0" y="85" width="320" height="3" fill="#263349" />

          {/* Lajotas e linhas de perspectiva do chão */}
          <line x1="0" y1="180" x2="80" y2="85" stroke="#182030" strokeWidth="2" />
          <line x1="80" y1="180" x2="130" y2="85" stroke="#182030" strokeWidth="2" />
          <line x1="160" y1="180" x2="180" y2="85" stroke="#182030" strokeWidth="2" />
          <line x1="240" y1="180" x2="220" y2="85" stroke="#182030" strokeWidth="2" />
          <line x1="320" y1="180" x2="260" y2="85" stroke="#182030" strokeWidth="2" />
          
          <line x1="0" y1="110" x2="320" y2="110" stroke="#161e2e" strokeWidth="2" />
          <line x1="0" y1="135" x2="320" y2="135" stroke="#161e2e" strokeWidth="2" />
          <line x1="0" y1="160" x2="320" y2="160" stroke="#161e2e" strokeWidth="2" />

          {/* Destaque de lajotas quebradas e ossadas cravadas */}
          <rect x="60" y="145" width="14" height="6" fill="#1d273a" />
          <rect x="200" y="105" width="18" height="8" fill="#1d273a" />
          <rect x="210" y="107" width="4" height="2" fill="#cbd5e1" opacity="0.5" />
        </svg>
      );

    case "BOSQUE_SOMBRIO":
      return (
        <svg
          viewBox="0 0 320 180"
          preserveAspectRatio="none"
          className="w-full h-full pixelated select-none"
          style={{ shapeRendering: "crispEdges" }}
        >
          {/* Céu noturno escuro */}
          <rect width="320" height="180" fill="#040b06" />

          {/* Lua pálida */}
          <circle cx="230" cy="30" r="15" fill="#ecfccb" opacity="0.8" />
          <circle cx="233" cy="28" r="14" fill="#040b06" opacity="0.3" />

          {/* Silhueta distante de árvores (y=0 até y=85) */}
          <path d="M 0 88 L 15 35 L 35 88 L 60 25 L 85 88 L 115 40 L 140 88 L 175 20 L 210 88 L 245 40 L 275 88 L 305 35 L 320 88 Z" fill="#08180d" />
          <path d="M 0 88 L 25 50 L 50 88 L 80 45 L 110 88 L 150 55 L 180 88 L 220 50 L 260 88 L 295 55 L 320 88 Z" fill="#0f2918" />

          {/* Troncos em primeiro plano nas laterais */}
          <rect x="10" y="10" width="12" height="80" fill="#163821" />
          <path d="M 18 35 Q 2 20 0 15" stroke="#163821" strokeWidth="5" fill="none" />
          <rect x="290" y="5" width="14" height="85" fill="#163821" />

          {/* Névoa tóxica rasteira sobre a linha do horizonte */}
          <rect x="0" y="80" width="320" height="15" fill="#10b981" opacity="0.15" />
          <rect x="0" y="85" width="320" height="8" fill="#34d399" opacity="0.2" />

          {/* CHÃO DE TERRA BATIDA E MUSGO (y=88 em diante) */}
          <rect x="0" y="88" width="320" height="92" fill="#0c1e12" />
          <rect x="0" y="88" width="320" height="3" fill="#1b4528" />

          {/* Perspectiva do chão florestal */}
          <line x1="0" y1="180" x2="70" y2="88" stroke="#122d1b" strokeWidth="2" />
          <line x1="90" y1="180" x2="130" y2="88" stroke="#122d1b" strokeWidth="2" />
          <line x1="210" y1="180" x2="190" y2="88" stroke="#122d1b" strokeWidth="2" />
          <line x1="320" y1="180" x2="250" y2="88" stroke="#122d1b" strokeWidth="2" />

          {/* Tufos de musgo */}
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={i * 22 + 6} y={100 + (i % 3) * 20} width="4" height="3" fill="#22c55e" opacity="0.4" />
          ))}
        </svg>
      );

    case "LABIRINTO_CINZAS":
      return (
        <svg
          viewBox="0 0 320 180"
          preserveAspectRatio="none"
          className="w-full h-full pixelated select-none"
          style={{ shapeRendering: "crispEdges" }}
        >
          {/* Céu de fumaça e calor vulcânico */}
          <rect width="320" height="180" fill="#140707" />

          {/* Silhueta de picos basálticos */}
          <polygon points="0,88 25,25 55,88 95,35 135,88 185,15 235,88 275,30 320,88" fill="#241010" />
          <polygon points="0,88 40,45 80,88 120,50 160,88 210,40 250,88 300,55 320,88" fill="#351717" />

          {/* Pilares quebrados nas laterais */}
          <rect x="18" y="20" width="14" height="70" fill="#4d2222" />
          <rect x="16" y="17" width="18" height="5" fill="#662f2f" />
          <rect x="280" y="10" width="16" height="80" fill="#4d2222" />
          <rect x="278" y="7" width="20" height="5" fill="#662f2f" />

          {/* Brilho da forja */}
          <rect x="0" y="80" width="320" height="12" fill="#ea580c" opacity="0.2" />

          {/* CHÃO DE BASALTO E BRASAS (y=88 em diante) */}
          <rect x="0" y="88" width="320" height="92" fill="#1d0d0d" />
          <rect x="0" y="88" width="320" height="3" fill="#4a2222" />

          {/* Rachaduras de lava líquida */}
          <path d="M 40 105 L 80 110 L 110 130 L 170 135" stroke="#f97316" strokeWidth="2" fill="none" opacity="0.8" />
          <path d="M 78 109 L 108 129 L 168 134" stroke="#fef08a" strokeWidth="1" fill="none" opacity="0.9" />
          <path d="M 190 98 L 220 115 L 260 120" stroke="#f97316" strokeWidth="2" fill="none" opacity="0.8" />
          <path d="M 191 99 L 219 114 L 259 119" stroke="#fef08a" strokeWidth="1" fill="none" opacity="0.9" />

          <line x1="0" y1="180" x2="70" y2="88" stroke="#2b1414" strokeWidth="2" />
          <line x1="320" y1="180" x2="250" y2="88" stroke="#2b1414" strokeWidth="2" />
        </svg>
      );

    case "COLINAS_LUA_SANGUE":
      return (
        <svg
          viewBox="0 0 320 180"
          preserveAspectRatio="none"
          className="w-full h-full pixelated select-none"
          style={{ shapeRendering: "crispEdges" }}
        >
          {/* Céu noturno escarlate */}
          <rect width="320" height="180" fill="#120509" />

          {/* A LUA DE SANGUE CENTRAL */}
          <circle cx="160" cy="40" r="26" fill="#e11d48" />
          <circle cx="154" cy="34" r="4" fill="#9f1239" opacity="0.8" />
          <circle cx="166" cy="38" r="6" fill="#9f1239" opacity="0.8" />
          <circle cx="160" cy="40" r="38" fill="#e11d48" opacity="0.12" />

          {/* Nuvens rasgadas */}
          <rect x="100" y="32" width="50" height="3" fill="#120509" opacity="0.8" />
          <rect x="130" y="36" width="70" height="4" fill="#120509" opacity="0.8" />

          {/* Colinas ao longe */}
          <path d="M 0 88 Q 80 50 160 70 Q 240 85 320 60 L 320 180 L 0 180 Z" fill="#220b13" />

          {/* CHÃO CARMESIM DAS COLINAS (y=88 em diante) */}
          <rect x="0" y="88" width="320" height="92" fill="#1a080f" />
          <rect x="0" y="88" width="320" height="3" fill="#4d162a" />

          <line x1="0" y1="180" x2="70" y2="88" stroke="#2a0f19" strokeWidth="2" />
          <line x1="160" y1="180" x2="160" y2="88" stroke="#2a0f19" strokeWidth="2" />
          <line x1="320" y1="180" x2="250" y2="88" stroke="#2a0f19" strokeWidth="2" />
        </svg>
      );

    case "PINACULO_ECLIPSE":
      return (
        <svg
          viewBox="0 0 320 180"
          preserveAspectRatio="none"
          className="w-full h-full pixelated select-none"
          style={{ shapeRendering: "crispEdges" }}
        >
          {/* Céu cósmico violeta */}
          <rect width="320" height="180" fill="#080413" />

          {/* Eclipse Solar Negro */}
          <circle cx="160" cy="35" r="22" fill="#c084fc" opacity="0.3" />
          <circle cx="160" cy="35" r="18" fill="#fde047" opacity="0.75" />
          <circle cx="160" cy="35" r="15" fill="#080413" />

          {/* Mar de nuvens abaixo do pico */}
          <path d="M 0 88 Q 50 75 100 82 Q 160 72 220 84 Q 280 75 320 82 L 320 180 L 0 180 Z" fill="#201140" opacity="0.7" />

          {/* CHÃO DE MÁRMORE SAGRADO DO PINÁCULO (y=88 em diante) */}
          <rect x="0" y="88" width="320" height="92" fill="#190f33" />
          <rect x="0" y="88" width="320" height="3" fill="#582fa1" />
          <rect x="0" y="91" width="320" height="1" fill="#fde047" opacity="0.7" />

          {/* Runa dourada celestial central */}
          <circle cx="160" cy="130" r="16" stroke="#ca8a04" strokeWidth="1" fill="none" opacity="0.7" />
          <polygon points="160,116 173,138 147,138" stroke="#fde047" strokeWidth="1" fill="none" opacity="0.6" />
          <polygon points="160,144 173,122 147,122" stroke="#fde047" strokeWidth="1" fill="none" opacity="0.6" />

          <line x1="0" y1="180" x2="80" y2="88" stroke="#2d1b5a" strokeWidth="2" />
          <line x1="320" y1="180" x2="240" y2="88" stroke="#2d1b5a" strokeWidth="2" />
        </svg>
      );

    case "PANTANO_PETRIFICANTE":
      return (
        <svg
          viewBox="0 0 320 180"
          preserveAspectRatio="none"
          className="w-full h-full pixelated select-none"
          style={{ shapeRendering: "crispEdges" }}
        >
          {/* Névoa tóxica e água escura */}
          <rect width="320" height="180" fill="#050e09" />
          <rect x="0" y="0" width="320" height="88" fill="#08170f" />
          <circle cx="240" cy="30" r="14" fill="#2dd4bf" opacity="0.35" />

          {/* Cipós e galhos pantanosos */}
          <path d="M 0 0 L 25 45 L 35 15 L 70 55 L 90 0 Z" fill="#0a2618" />
          <path d="M 230 0 L 255 50 L 275 25 L 320 60 L 320 0 Z" fill="#0a2618" />

          {/* CHÃO PANTANOSO DE LAMA E PEDRAS COBERTAS DE MUSGO */}
          <rect x="0" y="88" width="320" height="92" fill="#0e2419" />
          <rect x="0" y="88" width="320" height="3" fill="#144d32" />

          {/* Poças de lodo brilhante */}
          <ellipse cx="90" cy="120" rx="35" ry="12" fill="#133d28" />
          <ellipse cx="230" cy="140" rx="45" ry="14" fill="#133d28" />
          <circle cx="235" cy="138" r="4" fill="#2dd4bf" opacity="0.6" />
          <circle cx="95" cy="118" r="3" fill="#2dd4bf" opacity="0.5" />
        </svg>
      );

    case "LIMBO_ESPECTRAL":
    default:
      return (
        <svg
          viewBox="0 0 320 180"
          preserveAspectRatio="none"
          className="w-full h-full pixelated select-none"
          style={{ shapeRendering: "crispEdges" }}
        >
          {/* Éteres azuis e névoa espectral */}
          <rect width="320" height="180" fill="#040913" />
          <rect x="0" y="0" width="320" height="88" fill="#061224" />

          {/* Fragmentos flutuantes de templos antigos */}
          <polygon points="40,25 65,20 75,35 50,40" fill="#0b2244" opacity="0.6" />
          <polygon points="260,30 290,22 295,42 270,45" fill="#0b2244" opacity="0.6" />
          <circle cx="160" cy="40" r="16" fill="#38bdf8" opacity="0.25" />

          {/* CHÃO ESPECTRAL DE CRISTAL E GELO ABISSAL */}
          <rect x="0" y="88" width="320" height="92" fill="#091b36" />
          <rect x="0" y="88" width="320" height="3" fill="#1d4885" />
          <line x1="0" y1="180" x2="80" y2="88" stroke="#163968" strokeWidth="2" />
          <line x1="320" y1="180" x2="240" y2="88" stroke="#163968" strokeWidth="2" />
        </svg>
      );
  }
};
