import type { CSSProperties, FC } from "react";
import type { AnimacaoSprite } from "../dados/catalogoSprites";

interface PropsSpriteAnimado {
  anim: AnimacaoSprite;
  /** true = repete (idle); false = toca uma única vez inteira e congela no último frame */
  loop?: boolean;
  /** Vira o sprite horizontalmente (monstro olhando para a esquerda) */
  espelhar?: boolean;
  /** Multiplicador de duração (>1 = mais lento) */
  velocidade?: number;
  className?: string;
}

/**
 * Renderiza uma folha de sprite horizontal (frames de 128x128).
 * Para reiniciar a animação, o componente pai deve trocar a `key`.
 */
export const SpriteAnimado: FC<PropsSpriteAnimado> = ({
  anim,
  loop = false,
  espelhar = false,
  velocidade = 1,
  className = ""
}) => {
  const inicioFrame = anim.frameInicial ?? 0;
  const qtdFrames = Math.max(1, anim.frames);
  const ultimoFrame = inicioFrame + Math.max(0, qtdFrames - 1);
  const posInicial = `-${inicioFrame * 128}px`;
  const posFinal = `-${ultimoFrame * 128}px`;

  const estilo: CSSProperties & { [key: `--${string}`]: string | number } = {
    width: "128px",
    height: "128px",
    backgroundImage: `url("${anim.src}")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: `${posInicial} 0px`,
    imageRendering: "pixelated",
    transform: espelhar ? "scaleX(-1)" : undefined,
    "--sprite-inicio": posInicial,
    "--sprite-fim": posFinal,
    animation:
      qtdFrames > 1
        ? `sprite-play ${Math.round(anim.ms * velocidade)}ms steps(${qtdFrames}, jump-none) ${loop ? "infinite" : "1 forwards"}`
        : "none"
  };

  return <div className={className} style={estilo} />;
};
