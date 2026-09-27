import React from "react";

interface ArakonLogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Símbolo Vetorial Oficial da Árakon Corretora
 * Escudo institucional (#0B3C7A) integrado à letra 'A' e seta ascendente (#00A859).
 */
export const ArakonShieldIcon: React.FC<{ className?: string }> = ({
  className = "w-9 h-9",
}) => (
  <svg
    viewBox="0 0 120 130"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="arakonShieldBlue" x1="15" y1="10" x2="105" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0B3C7A" />
        <stop offset="100%" stopColor="#082B59" />
      </linearGradient>
      <linearGradient id="arakonAscendArrow" x1="28" y1="88" x2="108" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0B3C7A" />
        <stop offset="45%" stopColor="#057568" />
        <stop offset="100%" stopColor="#00A859" />
      </linearGradient>
    </defs>

    {/* Moldura esquerda do escudo */}
    <path
      d="M52 10L14 23C14 52 16 74 26 91L33 76C27 63 26 47 26 31L47 24L52 10Z"
      fill="url(#arakonShieldBlue)"
    />
    {/* Moldura superior direita do escudo */}
    <path
      d="M68 10L104 22L92 27L73 21L68 10Z"
      fill="url(#arakonShieldBlue)"
    />
    {/* Moldura lateral direita do escudo */}
    <path
      d="M104 56C102 70 98 81 92 91L85 76C89 68 92 59 93 49L104 56Z"
      fill="url(#arakonShieldBlue)"
    />
    {/* Base inferior em V do escudo */}
    <path
      d="M36 96L60 113L84 96L89 107L60 126L31 107L36 96Z"
      fill="url(#arakonShieldBlue)"
    />
    {/* Estrutura principal da letra A */}
    <path
      d="M57 8H63L79 44L68 52L60 32L32 98H18L57 8Z"
      fill="url(#arakonShieldBlue)"
    />
    {/* Perna direita da letra A */}
    <path
      d="M83 61L102 104H88L73 70L83 61Z"
      fill="#0B3C7A"
    />
    {/* Triângulo interno verde de crescimento */}
    <path
      d="M60 44L67 60C61 64 55 67 48 70L60 44Z"
      fill="#00A859"
    />
    {/* Seta curva ascendente (Verde Ascendente #00A859) */}
    <path
      d="M32 82C54 78 74 65 89 43L79 36L108 26L108 56L99 49C81 74 58 89 27 93L32 82Z"
      fill="url(#arakonAscendArrow)"
    />
  </svg>
);

export const ArakonLogo: React.FC<ArakonLogoProps> = ({
  variant = "dark",
  size = "md",
  className = "",
}) => {
  const textColor = variant === "light" ? "text-white" : "text-[#0B3C7A]";
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }[size];

  const titleSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }[size];

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <ArakonShieldIcon className={`${iconSizes} shrink-0`} />
      <span className={`font-display font-bold tracking-tight leading-none ${titleSizes} ${textColor}`}>
        Árakon <span className="font-normal">Corretora</span>
      </span>
    </span>
  );
};
