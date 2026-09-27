import React, { useState } from "react";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Building2,
  HeartPulse,
  Scale,
  Briefcase,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { ArakonLogo, ArakonShieldIcon } from "./components/ArakonLogo";
import { QualificationForm } from "./components/QualificationForm";
import { LeadsAdminModal } from "./components/LeadsAdminModal";
import { getWhatsAppLink } from "./config/contact";

import heroEditorialImg from "./assets/images/arakon_hero_editorial_1790468514229.jpg";
import specialistThiagoImg from "./assets/images/thiago_frente_portrait_1790469845519.jpg";
import corporateBenefitsImg from "./assets/images/arakon_corporate_office_signage_1790469836829.jpg";

export function App() {
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [selectedSolution, setSelectedSolution] = useState<string>("");
  const [formTheme, setFormTheme] = useState<"light" | "dark">("light");
  const [isCrmOpen, setIsCrmOpen] = useState(false);

  // Visível SOMENTE dentro do editor privado do AI Studio (ais-dev-...) até a foto oficial ser gravada no código.
  // No link público compartilhado (ais-pre-...) e na Vercel, isso é sempre FALSE.
  const isPrivateEditor =
    typeof window !== "undefined" &&
    (window.location.hostname.startsWith("ais-dev-") ||
      window.location.hostname === "localhost");

  const [photoSavedInCode, setPhotoSavedInCode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("arakon_real_photo_locked_v1") === "true";
    } catch {
      return false;
    }
  });
  const [livePhotoPreview, setLivePhotoPreview] = useState<string | null>(null);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);

  const handleSaveOfficialPhotoToCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSavingPhoto(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) {
        setIsSavingPhoto(false);
        return;
      }
      setLivePhotoPreview(dataUrl);
      try {
        const res = await fetch("/__admin_save_photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl }),
        });
        if (res.ok) {
          localStorage.setItem("arakon_real_photo_locked_v1", "true");
          setPhotoSavedInCode(true);
        }
      } catch {
        // Ignora erro silenciosamente
      } finally {
        setIsSavingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const startConfiguredAnalysis = (profile?: string, solution?: string) => {
    if (profile) setSelectedProfile(profile);
    if (solution) setSelectedSolution(solution);
    const element = document.getElementById("analise");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#4A4A4A] pb-14 md:pb-0">
      {/* BARRA EXCLUSIVA DO EDITOR PRIVADO PARA GRAVAR A FOTO REAL NO CÓDIGO */}
      {isPrivateEditor && !photoSavedInCode && (
        <div className="bg-[#0B3C7A] text-white px-4 py-3 border-b border-white/15 z-50">
          <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm">
              <strong className="font-semibold text-[#00A859] mr-1.5">
                [Exclusivo do seu Editor — Invisível para visitantes]:
              </strong>
              Clique no botão ao lado e selecione o arquivo{" "}
              <code className="bg-white/10 px-1.5 py-0.5 rounded">Thiago Frente.jpeg</code>{" "}
              para gravar sua foto real definitivamente no código do site e travá-la.
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00A859] hover:bg-[#008A47] text-white font-semibold text-xs sm:text-sm cursor-pointer shrink-0 transition-colors">
              <Upload className="w-4 h-4" />
              <span>
                {isSavingPhoto
                  ? "Gravando foto no código..."
                  : "Selecionar minha foto e Travar no Site"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleSaveOfficialPhotoToCode}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
      {/* ==================================================
          HEADER — TOP BAR CONTRACT (3 ZONES)
         ================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#0B3C7A] whitespace-nowrap shrink-0"
          >
            Árakon Corretora
          </a>

          {/* Zone 2: 5 clean text navigation links */}
          <nav
            aria-label="Navegação principal"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A4A4A]"
          >
            <a
              href="#solucoes"
              className="hover:text-[#0B3C7A] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Soluções
            </a>
            <a
              href="#empresas"
              className="hover:text-[#0B3C7A] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Empresas
            </a>
            <a
              href="#metodologia"
              className="hover:text-[#0B3C7A] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Metodologia
            </a>
            <a
              href="#especialista"
              className="hover:text-[#0B3C7A] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Especialista
            </a>
            <a
              href="#analise"
              className="hover:text-[#0B3C7A] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Diagnóstico
            </a>
          </nav>

          {/* Zone 3: 1–2 primary actions (Seção 42) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#0B3C7A]/25 text-[#0B3C7A] hover:bg-[#0B3C7A]/5 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-[#00A859]" />
              <span>Falar diretamente pelo WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => startConfiguredAnalysis()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B3C7A] hover:bg-[#072854] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Quero minha análise</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00A859]" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ==================================================
            HERO SECTION — PROPOSITION & DUAL CONVERSION PATH
           ================================================== */}
        <section className="relative bg-[#0B3C7A] text-white overflow-hidden border-b border-white/10">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Narrative Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-emerald-300 font-medium tracking-wide">
                  <ArakonShieldIcon className="w-6 h-6" />
                  <span>Consultoria em Planos de Saúde</span>
                  <span aria-hidden="true">·</span>
                  <span>Benefícios</span>
                  <span aria-hidden="true">·</span>
                  <span>Seguros</span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl lg:text-[52px] font-bold tracking-tight leading-[1.12] text-white">
                  Decisões de saúde e proteção patrimonial com critério técnico.
                </h1>

                <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
                  A Árakon Corretora analisa o seu cenário familiar ou corporativo para estruturar planos de saúde, benefícios e seguros com equilíbrio real entre rede credenciada, coberturas e investimento mensal.
                </p>

                {/* Dual Conversion CTAs (Seção 42, 43 e 46) */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => startConfiguredAnalysis()}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#00A859] hover:bg-[#008A47] text-white font-semibold text-sm sm:text-base transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    <span>Quero analisar meu cenário</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 text-[#00A859]" />
                    <span>Falar diretamente pelo WhatsApp</span>
                  </a>
                </div>

                {/* Unboxed metadata trust markers */}
                <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-300">
                  <span>Atendimento consultivo PF e PME</span>
                  <span aria-hidden="true">·</span>
                  <span>Estudo comparativo de rede e reajuste</span>
                  <span aria-hidden="true">·</span>
                  <span>Suporte contínuo pós-contratação</span>
                </div>
              </div>

              {/* Right Visual Focal Carrier */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#072854] to-[#0B3C7A] aspect-[16/11] sm:aspect-[16/10] lg:aspect-[4/3]">
                  <img
                    src={heroEditorialImg}
                    alt="Ambiente executivo de consultoria patrimonial e saúde da Árakon Corretora"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#072854]/90 via-[#072854]/25 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white">
                    <p className="text-xs text-emerald-300 font-medium">
                      Planejamento Patrimonial e Saúde Suplementar
                    </p>
                    <p className="font-display text-base sm:text-lg font-semibold mt-1">
                      Segurança e orientação técnica para cada fase da sua família ou empresa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SOLUÇÕES CONSULTIVAS — BENTO GRID ASSIMÉTRICO (#solucoes)
           ================================================== */}
        <section id="solucoes" className="py-16 sm:py-24 bg-[#F5F5F5]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#00A859]">
                  Portfólio Consultivo Árakon
                </p>
                <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0B3C7A] tracking-tight">
                  Soluções desenhadas para a realidade do seu momento.
                </h2>
                <p className="text-base text-[#4A4A4A]">
                  Em vez de cotações genéricas, avaliamos hospitais de referência, regras de carência, reembolso e custo total antes de recomendar qualquer operadora ou seguradora.
                </p>
              </div>

              {/* Botão direto de WhatsApp na seção de soluções (Seção 42) */}
              <div className="shrink-0">
                <a
                  href={getWhatsAppLink(
                    "Olá, Árakon! Estou vendo as soluções no site e gostaria de falar com um especialista."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 hover:border-[#0B3C7A] text-[#0B3C7A] font-semibold text-sm transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#00A859]" />
                  <span>Falar diretamente pelo WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Asymmetric Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 01. Planos de Saúde (Span 2) */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-[#00A859] tabular-nums">
                      01 · Saúde Individual, Familiar e Adesão/CNPJ
                    </span>
                    <HeartPulse className="w-5 h-5 text-[#0B3C7A]" />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0B3C7A]">
                    01. Planos de Saúde e Odontológicos sob Medida
                  </h3>
                  <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed">
                    Mapeamento completo das principais operadoras do país para quem busca contratar o primeiro plano ou utilizar o CNPJ para estruturar uma contratação familiar com melhor relação entre rede hospitalar e mensalidade.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    <span>Hospitais de referência</span>
                    <span aria-hidden="true"> · </span>
                    <span>Análise de reembolso</span>
                    <span aria-hidden="true"> · </span>
                    <span>Aproveitamento de carência</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      startConfiguredAnalysis("Eu/minha família", "Plano de Saúde")
                    }
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B3C7A] hover:text-[#00A859] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Quero entender minhas opções</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 02. Revisão de Plano Atual (Span 1) */}
              <div className="bg-[#0B3C7A] text-white rounded-2xl border border-[#0B3C7A] p-7 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-emerald-300 tabular-nums">
                      02 · Otimização de Custo e Rede
                    </span>
                    <Scale className="w-5 h-5 text-emerald-300" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">
                    02. Revisão Técnica do Seu Plano Atual
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Sofreu reajuste elevado ou perdeu atendimento na rede credenciada? Avaliamos migração técnica mantendo padrão hospitalar com redução real de custo.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/15">
                  <button
                    type="button"
                    onClick={() =>
                      startConfiguredAnalysis(
                        "Eu/minha família",
                        "Revisão do meu plano atual"
                      )
                    }
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Quero revisar meu plano</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 03. Seguro de Vida e Proteção Familiar (Span 1) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-[#00A859] tabular-nums">
                      03 · Proteção de Renda e Sucessão
                    </span>
                    <ShieldCheck className="w-5 h-5 text-[#0B3C7A]" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#0B3C7A]">
                    03. Seguro de Vida e Planejamento Sucessório
                  </h3>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">
                    Blindagem financeira em vida para doenças graves, invalidez, proteção da renda familiar e liquidez imediata em sucessão patrimonial.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() =>
                      startConfiguredAnalysis(
                        "Minha proteção pessoal",
                        "Seguro de Vida"
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B3C7A] hover:text-[#00A859] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Quero analisar meu cenário</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 04. Seguros Patrimoniais, Auto, Residencial e Viagem (Span 2) */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-[#00A859] tabular-nums">
                      04 · Patrimônio, Mobilidade e Continuidade
                    </span>
                    <Briefcase className="w-5 h-5 text-[#0B3C7A]" />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0B3C7A]">
                    04. Seguros Patrimoniais: Empresarial, Auto, Residencial e Viagem
                  </h3>
                  <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed">
                    Gestão unificada das suas apólices com comparativo entre as principais seguradoras do mercado. Revisamos coberturas, franquias e assistência 24h para garantir que seu patrimônio pessoal ou empresarial nunca fique descoberto.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    <span>Seguro Auto</span>
                    <span aria-hidden="true"> · </span>
                    <span>Seguro Residencial</span>
                    <span aria-hidden="true"> · </span>
                    <span>Seguro Viagem</span>
                    <span aria-hidden="true"> · </span>
                    <span>Seguro Empresarial</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      startConfiguredAnalysis(
                        "Meu patrimônio",
                        "Revisão dos meus seguros"
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B3C7A] hover:text-[#00A859] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Quero revisar meus seguros</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            BENEFÍCIOS CORPORATIVOS & EMPRESAS (#empresas)
           ================================================== */}
        <section
          id="empresas"
          className="py-16 sm:py-24 bg-white border-y border-slate-200/80"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Image Showcase */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-[#0B3C7A] aspect-[4/3]">
                  <img
                    src={corporateBenefitsImg}
                    alt="Consultoria corporativa de benefícios e saúde empresarial Árakon"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#072854]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                    <p className="text-xs text-emerald-300 font-medium tabular-nums">
                      De 2 a 100+ vidas · PME e Corporativo
                    </p>
                    <p className="font-display text-sm sm:text-base font-semibold mt-0.5">
                      Estruturação de saúde, odonto e seguro de vida em grupo com gestão ativa de reajuste.
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                <div className="text-xs sm:text-sm font-semibold text-[#00A859]">
                  Soluções para Empresas e RH
                </div>

                <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0B3C7A] tracking-tight">
                  Benefícios corporativos que retêm talentos sem descontrolar o caixa da empresa.
                </h2>

                <p className="text-base text-[#4A4A4A] leading-relaxed">
                  Seja para implantar o primeiro benefício da sua equipe ou renegociar uma apólice com reajuste elevado, a Árakon atua como braço técnico do empresário e do RH na comparação de operadoras, coparticipação e cobertura regional.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#F5F5F5] border border-slate-200/70">
                    <h3 className="font-display text-sm font-semibold text-[#0B3C7A]">
                      Auditoria de Custo e Reajuste
                    </h3>
                    <p className="text-xs text-[#4A4A4A] mt-1 leading-relaxed">
                      Estudo comparativo para reduzir o impacto da renovação anual mantendo hospitais e laboratórios estratégicos.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F5F5F5] border border-slate-200/70">
                    <h3 className="font-display text-sm font-semibold text-[#0B3C7A]">
                      Implantação e Movimentação Assistida
                    </h3>
                    <p className="text-xs text-[#4A4A4A] mt-1 leading-relaxed">
                      Apoio direto na inclusão de colaboradores, análise de redução de carências e orientação de uso consciente.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() =>
                      startConfiguredAnalysis("Minha empresa", "Plano de Saúde")
                    }
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B3C7A] hover:bg-[#072854] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Building2 className="w-4 h-4 text-[#00A859]" />
                    <span>Quero estruturar benefícios</span>
                  </button>

                  <a
                    href={getWhatsAppLink(
                      "Olá, Árakon! Gostaria de falar sobre planos de saúde e benefícios para minha empresa."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 hover:border-[#0B3C7A] text-[#0B3C7A] font-semibold text-sm transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 text-[#00A859]" />
                    <span>Falar sobre minha empresa</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            ESPECIALISTA & METODOLOGIA ÁRAKON (#especialista / #metodologia)
           ================================================== */}
        <section id="especialista" className="py-16 sm:py-24 bg-[#F5F5F5]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="text-xs sm:text-sm font-semibold text-[#00A859]">
                  Atendimento Consultivo e Próximo
                </div>

                <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0B3C7A] tracking-tight">
                  Orientação transparente de quem conhece as regras do mercado por dentro.
                </h2>

                <p className="text-base text-[#4A4A4A] leading-relaxed">
                  À frente da Árakon Corretora, <strong>Thiago Lima</strong> conduz cada diagnóstico com visão técnica e foco no longo prazo. Nosso papel não é empurrar uma tabela de preços, mas traduzir cláusulas de carência, abrangência geográfica, regras de reembolso e histórico de reajuste em uma decisão clara e segura.
                </p>

                {/* Metodologia em 3 etapas editoriais (#metodologia) */}
                <div
                  id="metodologia"
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2"
                >
                  <div className="bg-white p-5 rounded-xl border border-slate-200/80">
                    <span className="text-xs font-bold text-[#00A859] tabular-nums">
                      Etapa 01
                    </span>
                    <h3 className="font-display text-sm font-semibold text-[#0B3C7A] mt-1">
                      Diagnóstico de Perfil
                    </h3>
                    <p className="text-xs text-[#4A4A4A] mt-1.5 leading-relaxed">
                      Entendemos sua rotina médica, hospitais preferenciais, faixa etária e formato de contratação (PF ou CNPJ).
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200/80">
                    <span className="text-xs font-bold text-[#00A859] tabular-nums">
                      Etapa 02
                    </span>
                    <h3 className="font-display text-sm font-semibold text-[#0B3C7A] mt-1">
                      Comparativo Técnico
                    </h3>
                    <p className="text-xs text-[#4A4A4A] mt-1.5 leading-relaxed">
                      Apresentamos lado a lado as operadoras e seguradoras mais sólidas, destacando prós, contras e prazos de carência.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200/80">
                    <span className="text-xs font-bold text-[#00A859] tabular-nums">
                      Etapa 03
                    </span>
                    <h3 className="font-display text-sm font-semibold text-[#0B3C7A] mt-1">
                      Implantação e Gestão
                    </h3>
                    <p className="text-xs text-[#4A4A4A] mt-1.5 leading-relaxed">
                      Cuidamos de toda a tramitação contratual e permanecemos ao seu lado em renovações e suporte de utilização.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href={getWhatsAppLink(
                      "Olá, Thiago! Vim pelo site da Árakon Corretora e gostaria de falar com um especialista."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#00A859] hover:bg-[#008A47] text-white font-semibold text-sm transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Quero falar com um especialista</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => startConfiguredAnalysis()}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-[#0B3C7A] text-[#0B3C7A] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Preencher diagnóstico rápido</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Specialist Portrait Card */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden max-w-sm mx-auto lg:max-w-md shadow-xs">
                  <div className="relative aspect-[3/4] bg-[#2B2B2B] overflow-hidden">
                    <img
                      src={livePhotoPreview || specialistThiagoImg}
                      alt="Thiago Lima — Especialista da Árakon Corretora"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="p-6 bg-white space-y-3">
                    <div>
                      <p className="font-display text-xl font-bold text-[#0B3C7A]">
                        Thiago Lima
                      </p>
                      <p className="text-xs font-medium text-[#00A859] mt-0.5">
                        Especialista em Saúde Suplementar, Benefícios e Seguros · Árakon Corretora
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4 text-xs text-[#4A4A4A]">
                      <span>Atendimento no Rio de Janeiro e Nacional</span>
                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#0B3C7A] hover:text-[#00A859] transition-colors whitespace-nowrap"
                      >
                        Falar com a Árakon →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            32–46. SEÇÃO DE QUALIFICAÇÃO COMERCIAL INTELIGENTE (#analise)
           ================================================== */}
        <section
          id="analise"
          className="py-16 sm:py-24 bg-white border-t border-slate-200/80 scroll-mt-16"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column: Explicação dos 2 Caminhos de Conversão (Seção 46) */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm font-semibold text-[#00A859]">
                    Análise Personalizada Árakon
                  </p>
                  <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0B3C7A] tracking-tight">
                    Escolha como prefere iniciar seu atendimento.
                  </h2>
                  <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed">
                    Estruturamos dois caminhos para respeitar o seu tempo: responda 3 etapas rápidas para uma análise prévia ou chame nosso especialista diretamente no WhatsApp.
                  </p>
                </div>

                {/* Caminho 2 (Qualificado) vs Caminho 1 (Mais Rápido) */}
                <div className="space-y-3.5">
                  <div className="p-5 rounded-xl bg-[#F5F5F5] border border-slate-200/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#0B3C7A]">
                        Caminho Qualificado · Ao lado
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-[#00A859]" />
                    </div>
                    <h3 className="font-display text-base font-bold text-[#0B3C7A]">
                      Análise de Cenário em 3 Etapas
                    </h3>
                    <p className="text-xs text-[#4A4A4A] leading-relaxed">
                      Ideal para quem quer explicar se busca pessoa física ou empresa, avaliar redução de custo ou comparar redes antes da conversa.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0B3C7A] text-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-300">
                        Caminho Mais Rápido · Atendimento Direto
                      </span>
                      <MessageCircle className="w-4 h-4 text-emerald-300" />
                    </div>
                    <h3 className="font-display text-base font-bold text-white">
                      Prefere conversar agora sem preencher perguntas?
                    </h3>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Inicie uma conversa imediata no WhatsApp oficial da Árakon e tire suas dúvidas diretamente com nosso especialista.
                    </p>
                    <div className="pt-1">
                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00A859] hover:bg-[#008A47] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Falar diretamente pelo WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Alternador discreto de acabamento visual do formulário (Seção 45: fundo branco ou azul muito escuro) */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/70">
                  <span>Visual do formulário:</span>
                  <div className="inline-flex p-1 rounded-lg bg-[#F5F5F5] border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setFormTheme("light")}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        formTheme === "light"
                          ? "bg-white text-[#0B3C7A] shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Fundo Claro
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormTheme("dark")}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        formTheme === "dark"
                          ? "bg-[#0B3C7A] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Azul Institucional
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Multi-Step Qualification Form */}
              <div className="lg:col-span-7">
                <QualificationForm
                  initialProfile={selectedProfile}
                  initialSolution={selectedSolution}
                  theme={formTheme}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            47. CTA FINAL ATUALIZADO
           ================================================== */}
        <section className="py-16 sm:py-24 bg-[#0B3C7A] text-white relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center space-y-7">
            <div className="inline-flex items-center justify-center">
              <ArakonShieldIcon className="w-12 h-12" />
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Sua proteção merece uma decisão bem orientada.
              </h2>
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                Conte para a Árakon o que você precisa. Nós ajudamos você a entender os próximos passos.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 max-w-xl mx-auto">
              {/* PRIMÁRIO: Quero minha análise */}
              <button
                type="button"
                onClick={() => startConfiguredAnalysis()}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#00A859] hover:bg-[#008A47] text-white font-semibold text-sm sm:text-base transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              >
                <span>Quero minha análise</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* SECUNDÁRIO: Falar diretamente pelo WhatsApp */}
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/25 text-white font-semibold text-sm sm:text-base transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-[#00A859]" />
                <span>Falar diretamente pelo WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ==================================================
          FOOTER INSTITUCIONAL
         ================================================== */}
      <footer className="bg-[#072854] text-slate-300 border-t border-white/10 py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="space-y-2">
            <ArakonLogo variant="light" size="md" />
            <p className="text-xs text-slate-400 max-w-sm">
              Consultoria especializada em Planos de Saúde, Benefícios Corporativos, Seguro de Vida e Proteção Patrimonial.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
            <a href="#solucoes" className="hover:text-white transition-colors">
              Soluções
            </a>
            <a href="#empresas" className="hover:text-white transition-colors">
              Empresas
            </a>
            <a
              href="#especialista"
              className="hover:text-white transition-colors"
            >
              Especialista
            </a>
            <a href="#analise" className="hover:text-white transition-colors">
              Análise de Cenário
            </a>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:text-white font-semibold transition-colors"
            >
              WhatsApp Oficial
            </a>
            <button
              type="button"
              onClick={() => setIsCrmOpen(true)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Painel do Especialista
            </button>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Árakon Corretora. Todos os direitos reservados.
          </p>
          <p className="tabular-nums">
            Atendimento Consultivo · WhatsApp: (21) 99555-3350
          </p>
        </div>
      </footer>

      <LeadsAdminModal
        isOpen={isCrmOpen}
        onClose={() => setIsCrmOpen(false)}
      />

      {/* ==================================================
          42. BOTÃO FIXO NO MOBILE (Respeitando o limite <= 15% de altura)
         ================================================== */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center gap-2">
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#00A859] text-white font-semibold text-xs whitespace-nowrap"
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Falar diretamente pelo WhatsApp</span>
        </a>
        <button
          type="button"
          onClick={() => startConfiguredAnalysis()}
          className="inline-flex items-center justify-center py-2.5 px-3.5 rounded-lg bg-[#0B3C7A] text-white font-semibold text-xs whitespace-nowrap cursor-pointer"
        >
          <span>Quero análise</span>
        </button>
      </div>
    </div>
  );
}

export default App;
