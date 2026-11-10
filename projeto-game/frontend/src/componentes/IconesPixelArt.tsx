import type { FC } from "react";

interface IconeProps {
  className?: string;
  tamanho?: number;
}

/**
 * Catálogo Canônico de Metadados Visuais e Atributos por ID de Item (Fallback garantido em qualquer tela)
 */
export const METADADOS_ITENS_CANONICOS: Record<
  number,
  { tipo: "CURA_VIDA" | "RECUPERA_ENERGIA" | "REFORCO_DANO" | "COMPOSTO"; hp?: number; en?: number; dano?: number }
> = {
  1: { tipo: "CURA_VIDA", hp: 30 },
  2: { tipo: "CURA_VIDA", hp: 70 },
  3: { tipo: "RECUPERA_ENERGIA", en: 40 },
  4: { tipo: "REFORCO_DANO", dano: 8 },
  5: { tipo: "COMPOSTO", hp: 50, en: 30 },
  101: { tipo: "CURA_VIDA", hp: 25 },
  102: { tipo: "CURA_VIDA", hp: 35 },
  103: { tipo: "CURA_VIDA", hp: 40 },
  104: { tipo: "CURA_VIDA", hp: 55 },
  105: { tipo: "CURA_VIDA", hp: 70 },
  106: { tipo: "CURA_VIDA", hp: 80 },
  107: { tipo: "CURA_VIDA", hp: 95 },
  201: { tipo: "RECUPERA_ENERGIA", en: 35 },
  202: { tipo: "RECUPERA_ENERGIA", en: 45 },
  203: { tipo: "RECUPERA_ENERGIA", en: 50 },
  204: { tipo: "RECUPERA_ENERGIA", en: 50 },
  205: { tipo: "RECUPERA_ENERGIA", en: 60 },
  301: { tipo: "REFORCO_DANO", dano: 9 },
  302: { tipo: "REFORCO_DANO", dano: 10 },
  303: { tipo: "REFORCO_DANO", dano: 12 },
  304: { tipo: "REFORCO_DANO", dano: 14 },
  305: { tipo: "REFORCO_DANO", dano: 16 },
  401: { tipo: "COMPOSTO", hp: 60, en: 35 },
  402: { tipo: "COMPOSTO", hp: 90, en: 45 },
  403: { tipo: "COMPOSTO", hp: 100, en: 50 },
  404: { tipo: "COMPOSTO", hp: 130, en: 70 },
  501: { tipo: "CURA_VIDA", hp: 35 },
  502: { tipo: "RECUPERA_ENERGIA", en: 40 },
  503: { tipo: "COMPOSTO", hp: 25, en: 25 }
};

/**
 * Badge visual que mostra de forma clara o atributo/efeito numérico do item na legenda
 */
export const BadgeAtributosItem: FC<{
  item: { id?: number; tipo?: string; valorEfeito?: number; valorEnergia?: number };
  className?: string;
}> = ({ item, className = "" }) => {
  const meta = item.id ? METADADOS_ITENS_CANONICOS[item.id] : undefined;
  const tipo = (item.tipo || meta?.tipo || "CURA_VIDA").toUpperCase();
  const valPrincipal = item.valorEfeito ?? meta?.hp ?? meta?.en ?? meta?.dano ?? 0;
  const valEnergia = item.valorEnergia ?? meta?.en ?? 0;

  if (tipo === "COMPOSTO" || (valEnergia > 0 && (tipo === "CURA_VIDA" || tipo === "ORBE_RELIQUIA"))) {
    const hp = item.valorEfeito ?? meta?.hp ?? 50;
    const en = item.valorEnergia || meta?.en || 30;
    return (
      <span
        className={`inline-flex items-center gap-1 font-pixel text-[8px] px-2 py-0.5 bg-purple-950/90 text-purple-200 border border-purple-400/80 ${className}`}
      >
        ✨ +{hp} HP & +{en} EN
      </span>
    );
  }

  if (tipo === "RECUPERA_ENERGIA" || tipo === "ELIXIR_ENERGIA") {
    return (
      <span
        className={`inline-flex items-center gap-1 font-pixel text-[8px] px-2 py-0.5 bg-cyan-950/90 text-cyan-200 border border-cyan-400/80 ${className}`}
      >
        ⚡ +{valPrincipal} ENERGIA (EN)
      </span>
    );
  }

  if (tipo === "REFORCO_DANO" || tipo === "OLEO_DANO") {
    return (
      <span
        className={`inline-flex items-center gap-1 font-pixel text-[8px] px-2 py-0.5 bg-amber-950/90 text-amber-200 border border-amber-400/80 ${className}`}
      >
        🗡️ +{valPrincipal} DANO PRÓX. GOLPE
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-pixel text-[8px] px-2 py-0.5 bg-emerald-950/90 text-emerald-200 border border-emerald-400/80 ${className}`}
    >
      ❤️ +{valPrincipal} VIDA (HP)
    </span>
  );
};

/**
 * Ícone Pixel Art 16x16 Exclusivo para cada Item Canônico do Jogo
 */
export const IconeItemPixel: FC<{
  id?: number;
  tipo?: string;
  tamanho?: number;
  className?: string;
}> = ({ id = 0, tipo = "CURA_VIDA", tamanho = 28, className = "" }) => {
  const wrap = (children: React.ReactNode) => (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pixelated ${className}`}
      style={{ shapeRendering: "crispEdges" }}
    >
      {children}
    </svg>
  );

  switch (id) {
    // 101: Medula de Esqueleto Antigo (Osso com tutano rubi)
    case 101:
      return wrap(
        <>
          <rect x="2" y="2" width="3" height="3" fill="#e2e8f0" />
          <rect x="11" y="11" width="3" height="3" fill="#e2e8f0" />
          <rect x="4" y="4" width="8" height="8" fill="#cbd5e1" />
          <rect x="6" y="6" width="4" height="4" fill="#e11d48" />
          <rect x="7" y="7" width="2" height="2" fill="#fda4af" />
        </>
      );

    // 102: Pó de Ossos Reanimados (Urna/Pote de cinza necromântica)
    case 102:
      return wrap(
        <>
          <rect x="5" y="2" width="6" height="2" fill="#94a3b8" />
          <rect x="4" y="4" width="8" height="9" fill="#334155" />
          <rect x="5" y="7" width="6" height="5" fill="#cbd5e1" />
          <rect x="6" y="8" width="4" height="3" fill="#38bdf8" />
          <rect x="7" y="5" width="2" height="2" fill="#e0f2fe" />
        </>
      );

    // 103: Seiva Negra do Bosque (Folha retorcida + gota esmeralda)
    case 103:
      return wrap(
        <>
          <rect x="4" y="2" width="6" height="3" fill="#15803d" />
          <rect x="3" y="5" width="8" height="6" fill="#064e3b" />
          <rect x="5" y="6" width="5" height="5" fill="#22c55e" />
          <rect x="9" y="10" width="3" height="4" fill="#4ade80" />
          <rect x="10" y="11" width="1" height="2" fill="#dcfce7" />
        </>
      );

    // 104: Carne Seca de Besta Táurica (Pernil com osso)
    case 104:
      return wrap(
        <>
          <rect x="2" y="10" width="4" height="3" fill="#f1f5f9" />
          <rect x="4" y="3" width="9" height="8" fill="#7c2d12" />
          <rect x="5" y="4" width="7" height="6" fill="#b91c1c" />
          <rect x="6" y="5" width="4" height="3" fill="#f87171" />
        </>
      );

    // 105: Lamento Ectoplasmático (Fantasma/Ectoplasma leitoso)
    case 105:
      return wrap(
        <>
          <rect x="5" y="2" width="6" height="3" fill="#a5f3fc" />
          <rect x="3" y="5" width="10" height="7" fill="#67e8f9" />
          <rect x="5" y="6" width="2" height="2" fill="#0f172a" />
          <rect x="9" y="6" width="2" height="2" fill="#0f172a" />
          <rect x="3" y="12" width="2" height="2" fill="#22d3ee" />
          <rect x="7" y="12" width="2" height="2" fill="#22d3ee" />
          <rect x="11" y="12" width="2" height="2" fill="#22d3ee" />
        </>
      );

    // 106: Escama Petrificada da Rainha (Escama hexagonal verde/dourada)
    case 106:
      return wrap(
        <>
          <rect x="5" y="1" width="6" height="2" fill="#0d9488" />
          <rect x="3" y="3" width="10" height="8" fill="#115e59" />
          <rect x="5" y="4" width="6" height="6" fill="#2dd4bf" />
          <rect x="7" y="5" width="2" height="4" fill="#fde047" />
          <rect x="5" y="11" width="6" height="3" fill="#0f766e" />
        </>
      );

    // 107: Incenso do Asceta Caído (Turíbulo dourado com fumaça)
    case 107:
      return wrap(
        <>
          <rect x="7" y="1" width="2" height="2" fill="#e9d5ff" />
          <rect x="6" y="3" width="4" height="2" fill="#c084fc" />
          <rect x="4" y="6" width="8" height="6" fill="#ca8a04" />
          <rect x="5" y="7" width="6" height="4" fill="#facc15" />
          <rect x="6" y="12" width="4" height="2" fill="#854d0e" />
        </>
      );

    // 201: Cinzas de Foco Espectral (Ampulheta de energia azul)
    case 201:
      return wrap(
        <>
          <rect x="3" y="2" width="10" height="2" fill="#94a3b8" />
          <rect x="4" y="4" width="8" height="3" fill="#0284c7" />
          <rect x="7" y="7" width="2" height="2" fill="#e0f2fe" />
          <rect x="4" y="9" width="8" height="3" fill="#38bdf8" />
          <rect x="3" y="12" width="10" height="2" fill="#94a3b8" />
        </>
      );

    // 202: Orvalho de Miasma Tribal (Cabaça xamânica)
    case 202:
      return wrap(
        <>
          <rect x="7" y="1" width="2" height="2" fill="#a16207" />
          <rect x="5" y="3" width="6" height="4" fill="#365314" />
          <rect x="4" y="7" width="8" height="7" fill="#4d7c0f" />
          <rect x="6" y="8" width="4" height="4" fill="#a3e635" />
          <rect x="7" y="9" width="2" height="2" fill="#ecfccb" />
        </>
      );

    // 203: Lágrima Cristalizada de Medusa (Gota de cristal turquesa)
    case 203:
      return wrap(
        <>
          <rect x="7" y="1" width="2" height="3" fill="#99f6e4" />
          <rect x="5" y="4" width="6" height="4" fill="#2dd4bf" />
          <rect x="4" y="8" width="8" height="5" fill="#0d9488" />
          <rect x="6" y="6" width="2" height="4" fill="#ffffff" />
          <rect x="6" y="13" width="4" height="2" fill="#115e59" />
        </>
      );

    // 204: Presa do Caçador Noturno (Presa de lobo curvada)
    case 204:
      return wrap(
        <>
          <rect x="4" y="2" width="5" height="2" fill="#b91c1c" />
          <rect x="5" y="4" width="5" height="4" fill="#f8fafc" />
          <rect x="6" y="8" width="5" height="4" fill="#e2e8f0" />
          <rect x="8" y="12" width="3" height="2" fill="#cbd5e1" />
        </>
      );

    // 205: Centelha de Fogo Fátuo (Chama espiritual azul/ciano)
    case 205:
      return wrap(
        <>
          <rect x="7" y="1" width="2" height="3" fill="#67e8f9" />
          <rect x="5" y="4" width="6" height="4" fill="#06b6d4" />
          <rect x="3" y="8" width="10" height="5" fill="#0284c7" />
          <rect x="6" y="7" width="4" height="5" fill="#cffafe" />
        </>
      );

    // 301: Unguento de Fúria Carniceira (Pote de guerra vermelho/laranja)
    case 301:
      return wrap(
        <>
          <rect x="5" y="2" width="6" height="2" fill="#78350f" />
          <rect x="3" y="4" width="10" height="10" fill="#9a3412" />
          <rect x="5" y="6" width="6" height="6" fill="#ef4444" />
          <rect x="7" y="7" width="2" height="4" fill="#fef08a" />
        </>
      );

    // 302: Veneno de Presa Serpentina (Frasco de ácido verde-limão)
    case 302:
      return wrap(
        <>
          <rect x="6" y="1" width="4" height="2" fill="#3f6212" />
          <rect x="4" y="3" width="8" height="11" fill="#1a2e05" />
          <rect x="5" y="6" width="6" height="7" fill="#84cc16" />
          <rect x="6" y="4" width="2" height="2" fill="#bef264" />
          <rect x="8" y="9" width="2" height="2" fill="#ecfccb" />
        </>
      );

    // 303: Óleo da Forja Vulcânica (Frasco de lava incandescente)
    case 303:
      return wrap(
        <>
          <rect x="6" y="1" width="4" height="2" fill="#f97316" />
          <rect x="4" y="3" width="8" height="11" fill="#451a03" />
          <rect x="5" y="6" width="6" height="7" fill="#ea580c" />
          <rect x="6" y="8" width="4" height="4" fill="#facc15" />
        </>
      );

    // 304: Óleo de Garra de Fera (Três cortes de garras carmesins)
    case 304:
      return wrap(
        <>
          <rect x="2" y="2" width="12" height="12" fill="#1e1b4b" />
          <rect x="3" y="3" width="2" height="10" fill="#e11d48" />
          <rect x="7" y="2" width="2" height="12" fill="#f43f5e" />
          <rect x="11" y="4" width="2" height="9" fill="#fb7185" />
        </>
      );

    // 305: Pena Cortante de Tengu (Pena negra e prata afiada)
    case 305:
      return wrap(
        <>
          <rect x="11" y="2" width="3" height="3" fill="#38bdf8" />
          <rect x="7" y="4" width="5" height="5" fill="#1e293b" />
          <rect x="4" y="7" width="6" height="5" fill="#334155" />
          <rect x="2" y="11" width="4" height="3" fill="#f8fafc" />
        </>
      );

    // 401: Bálsamo do Coração de Touro (Coração rubi com aura dourada)
    case 401:
      return wrap(
        <>
          <rect x="3" y="3" width="4" height="4" fill="#e11d48" />
          <rect x="9" y="3" width="4" height="4" fill="#e11d48" />
          <rect x="2" y="5" width="12" height="5" fill="#be123c" />
          <rect x="4" y="10" width="8" height="3" fill="#9f1239" />
          <rect x="6" y="13" width="4" height="2" fill="#facc15" />
          <rect x="6" y="6" width="4" height="3" fill="#fde047" />
        </>
      );

    // 402: Coração Gélido do Alfa (Coração de gelo azul-celeste)
    case 402:
      return wrap(
        <>
          <rect x="3" y="3" width="4" height="4" fill="#38bdf8" />
          <rect x="9" y="3" width="4" height="4" fill="#38bdf8" />
          <rect x="2" y="5" width="12" height="5" fill="#0284c7" />
          <rect x="4" y="10" width="8" height="3" fill="#0369a1" />
          <rect x="6" y="6" width="4" height="3" fill="#e0f2fe" />
        </>
      );

    // 403: Essência do Rancor Primordial (Orbe sombrio púrpura/carmesim)
    case 403:
      return wrap(
        <>
          <rect x="4" y="2" width="8" height="12" fill="#3b0764" />
          <rect x="2" y="4" width="12" height="8" fill="#581c87" />
          <rect x="5" y="6" width="2" height="2" fill="#f43f5e" />
          <rect x="9" y="6" width="2" height="2" fill="#f43f5e" />
          <rect x="6" y="10" width="4" height="2" fill="#e9d5ff" />
        </>
      );

    // 404: Orbe dos Nove Ecos Celestes (Relíquia dourada/violeta suprema)
    case 404:
      return wrap(<IconeOrbeReliquia tamanho={tamanho} />);

    // 501: Tônico da Guarda Real (Cantil blindado dourado e rubi)
    case 501:
      return wrap(
        <>
          <rect x="6" y="1" width="4" height="2" fill="#eab308" />
          <rect x="3" y="3" width="10" height="11" fill="#991b1b" />
          <rect x="4" y="4" width="8" height="9" fill="#dc2626" />
          <rect x="7" y="5" width="2" height="6" fill="#fde047" />
          <rect x="5" y="7" width="6" height="2" fill="#fde047" />
        </>
      );

    // 502: Éter Condensado do Eclipse (Cristal arcano roxo/ciano)
    case 502:
      return wrap(
        <>
          <rect x="7" y="1" width="2" height="3" fill="#a855f7" />
          <rect x="5" y="4" width="6" height="8" fill="#6b21a8" />
          <rect x="6" y="5" width="4" height="6" fill="#22d3ee" />
          <rect x="7" y="12" width="2" height="3" fill="#a855f7" />
        </>
      );

    // 503: Pílula de Foco Oriental (Selo dourado oriental + pílula esmeralda/rubi)
    case 503:
      return wrap(
        <>
          <rect x="3" y="3" width="10" height="10" fill="#7f1d1d" />
          <rect x="4" y="4" width="8" height="8" fill="#eab308" />
          <rect x="5" y="5" width="3" height="6" fill="#ef4444" />
          <rect x="8" y="5" width="3" height="6" fill="#10b981" />
        </>
      );

    default: {
      const t = tipo.toUpperCase();
      if (t === "RECUPERA_ENERGIA" || t === "ELIXIR_ENERGIA") return <IconeElixirEnergia tamanho={tamanho} className={className} />;
      if (t === "REFORCO_DANO" || t === "OLEO_DANO") return <IconeOleoDano tamanho={tamanho} className={className} />;
      if (t === "COMPOSTO" || t === "ORBE_RELIQUIA") return <IconeOrbeReliquia tamanho={tamanho} className={className} />;
      return <IconePocaoVida tamanho={tamanho} className={className} />;
    }
  }
};

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
    <rect x="6" y="1" width="4" height="2" fill="#854d0e" />
    <rect x="7" y="1" width="2" height="1" fill="#a16207" />
    <rect x="6" y="3" width="4" height="2" fill="#64748b" />
    <rect x="7" y="3" width="2" height="2" fill="#cbd5e1" opacity="0.6" />
    <rect x="4" y="5" width="8" height="9" fill="#1e293b" />
    <rect x="5" y="7" width="6" height="6" fill="#be123c" />
    <rect x="5" y="9" width="6" height="4" fill="#e11d48" />
    <rect x="6" y="11" width="4" height="2" fill="#fb7185" />
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
    <rect x="6" y="1" width="4" height="2" fill="#a16207" />
    <rect x="6" y="3" width="4" height="2" fill="#475569" />
    <rect x="5" y="5" width="6" height="2" fill="#1e293b" />
    <rect x="4" y="7" width="8" height="4" fill="#1e293b" />
    <rect x="5" y="11" width="6" height="3" fill="#1e293b" />
    <rect x="5" y="8" width="6" height="5" fill="#0891b2" />
    <rect x="6" y="9" width="4" height="3" fill="#06b6d4" />
    <rect x="7" y="10" width="2" height="2" fill="#67e8f9" />
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
    <rect x="6" y="1" width="4" height="2" fill="#475569" />
    <rect x="5" y="3" width="6" height="2" fill="#334155" />
    <rect x="3" y="5" width="10" height="9" fill="#1e293b" />
    <rect x="5" y="7" width="6" height="6" fill="#b45309" />
    <rect x="6" y="8" width="4" height="4" fill="#f59e0b" />
    <rect x="7" y="9" width="2" height="2" fill="#fef08a" />
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
    <rect x="5" y="13" width="6" height="2" fill="#a16207" />
    <rect x="6" y="11" width="4" height="2" fill="#ca8a04" />
    <rect x="3" y="8" width="2" height="4" fill="#ca8a04" />
    <rect x="11" y="8" width="2" height="4" fill="#ca8a04" />
    <rect x="5" y="4" width="6" height="7" fill="#6b21a8" />
    <rect x="4" y="5" width="8" height="5" fill="#7e22ce" />
    <rect x="6" y="5" width="4" height="5" fill="#a855f7" />
    <rect x="7" y="6" width="2" height="3" fill="#c084fc" />
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
    <rect x="12" y="1" width="2" height="2" fill="#f8fafc" />
    <rect x="10" y="2" width="3" height="3" fill="#e2e8f0" />
    <rect x="8" y="4" width="3" height="3" fill="#cbd5e1" />
    <rect x="6" y="6" width="3" height="3" fill="#94a3b8" />
    <rect x="4" y="8" width="3" height="3" fill="#64748b" />
    <rect x="5" y="10" width="2" height="2" fill="#ca8a04" />
    <rect x="2" y="7" width="2" height="2" fill="#ca8a04" />
    <rect x="4" y="9" width="3" height="2" fill="#a16207" />
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
    <rect x="3" y="1" width="10" height="2" fill="#a16207" />
    <rect x="2" y="3" width="12" height="5" fill="#a16207" />
    <rect x="3" y="8" width="10" height="3" fill="#a16207" />
    <rect x="5" y="11" width="6" height="2" fill="#a16207" />
    <rect x="7" y="13" width="2" height="2" fill="#a16207" />
    <rect x="4" y="3" width="8" height="7" fill="#334155" />
    <rect x="6" y="10" width="4" height="2" fill="#334155" />
    <rect x="5" y="4" width="6" height="5" fill="#475569" />
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
    <rect x="5" y="2" width="6" height="2" fill="#e2e8f0" />
    <rect x="3" y="4" width="10" height="5" fill="#e2e8f0" />
    <rect x="4" y="6" width="3" height="3" fill="#0f172a" />
    <rect x="9" y="6" width="3" height="3" fill="#0f172a" />
    <rect x="7" y="9" width="2" height="1" fill="#0f172a" />
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
    <rect x="6" y="5" width="4" height="6" fill="#a16207" />
    <rect x="7" y="6" width="2" height="4" fill="#fef08a" />
  </svg>
);
