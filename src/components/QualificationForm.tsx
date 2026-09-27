import React, { useState, useEffect } from "react";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  AlertCircle,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import {
  CRMLeadPayload,
  DECISION_TIMELINE_OPTIONS,
  INSURANCE_CONCERNS_BY_TYPE,
  INVESTMENT_RANGES,
  PROFILE_DISPLAY_LABELS,
  PROFILE_OPTIONS,
  SOLUTION_OPTIONS,
  buildQualifiedWhatsAppLink,
  getWhatsAppLink,
  registerQualifiedLead,
} from "../config/contact";

interface QualificationFormProps {
  initialProfile?: string;
  initialSolution?: string;
  theme?: "light" | "dark";
}

type FormStage = 1 | 2 | 3 | "review" | "submitted";

/**
 * Formata telefone para o padrão brasileiro: (DD) 9XXXX-XXXX ou (DD) XXXX-XXXX
 */
function formatBrazilianPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function isValidEmail(email: string): boolean {
  if (!email.trim()) return true; // Opcional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidBrazilianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export const QualificationForm: React.FC<QualificationFormProps> = ({
  initialProfile = "",
  initialSolution = "",
  theme = "light",
}) => {
  const [stage, setStage] = useState<FormStage>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Etapa 1 — Sobre você
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState<string>(initialProfile);

  // Etapa 2 — O que você procura?
  const [interesses, setInteresses] = useState<string[]>(
    initialSolution ? [initialSolution] : []
  );

  // Etapa 3 — Cenário Plano de Saúde
  const [possuiPlano, setPossuiPlano] = useState("");
  const [satisfacao, setSatisfacao] = useState("");
  const [motivoMudanca, setMotivoMudanca] = useState("");
  const [quantidadePessoas, setQuantidadePessoas] = useState("");
  const [cidade, setCidade] = useState("");

  // Etapa 3 — Cenário Empresa
  const [tamanhoEmpresa, setTamanhoEmpresa] = useState("");
  const [possuiBeneficios, setPossuiBeneficios] = useState("");
  const [revisarBeneficiosAtuais, setRevisarBeneficiosAtuais] = useState("");
  const [desafioEmpresa, setDesafioEmpresa] = useState("");

  // Etapa 3 — Cenário Seguro
  const [possuiSeguro, setPossuiSeguro] = useState("");
  const [preocupacao, setPreocupacao] = useState("");

  // Etapa 3 — Momento de Compra & Orçamento
  const [prazoDecisao, setPrazoDecisao] = useState("");
  const [faixaInvestimento, setFaixaInvestimento] = useState("");

  // Sincroniza quando o usuário clica em um card específico da página
  useEffect(() => {
    if (initialProfile) {
      setPerfil(initialProfile);
    }
  }, [initialProfile]);

  useEffect(() => {
    if (initialSolution) {
      setInteresses((prev) =>
        prev.includes(initialSolution) ? prev : [initialSolution, ...prev]
      );
    }
  }, [initialSolution]);

  // Determina quais blocos dinâmicos exibir na Etapa 3
  const isHealthSelected =
    interesses.includes("Plano de Saúde") ||
    interesses.includes("Revisão do meu plano atual") ||
    interesses.includes("Plano Odontológico") ||
    (interesses.includes("Ainda não sei / Quero orientação") &&
      perfil !== "Minha empresa");

  const isCompanyScenario =
    perfil === "Minha empresa" ||
    perfil === "Eu/minha família via CNPJ" ||
    interesses.includes("Seguro Empresarial");

  const insuranceTypesSelected = interesses.filter((item) =>
    [
      "Seguro de Vida",
      "Seguro Auto",
      "Seguro Residencial",
      "Seguro Viagem",
      "Seguro Empresarial",
      "Revisão dos meus seguros",
    ].includes(item)
  );

  const isInsuranceSelected =
    insuranceTypesSelected.length > 0 ||
    perfil === "Minha proteção pessoal" ||
    perfil === "Meu patrimônio";

  // Determina a lista de preocupações de seguro adaptável ao tipo escolhido
  const primaryInsuranceType =
    insuranceTypesSelected.find(
      (t) => t === "Seguro de Vida" || t === "Seguro Empresarial"
    ) ||
    insuranceTypesSelected[0] ||
    (perfil === "Minha empresa" ? "Seguro Empresarial" : "Seguro de Vida");

  const dynamicInsuranceConcerns =
    INSURANCE_CONCERNS_BY_TYPE[primaryInsuranceType] ||
    INSURANCE_CONCERNS_BY_TYPE.default;

  const toggleInteresse = (option: string) => {
    setInteresses((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
    if (errors.interesses) {
      setErrors((prev) => ({ ...prev, interesses: "" }));
    }
  };

  // Validação da Etapa 1
  const handleNextFromStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!nome.trim() || nome.trim().length < 2) {
      newErrors.nome = "Por favor, informe seu nome completo.";
    }
    if (!isValidBrazilianPhone(whatsapp)) {
      newErrors.whatsapp = "Informe um WhatsApp válido com DDD. Ex: (21) 99555-3350.";
    }
    if (!isValidEmail(email)) {
      newErrors.email = "Informe um endereço de e-mail válido ou deixe em branco.";
    }
    if (!perfil) {
      newErrors.perfil = "Selecione para quem você busca a solução.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStage(2);
    }
  };

  // Validação da Etapa 2
  const handleNextFromStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (interesses.length === 0) {
      newErrors.interesses = "Selecione pelo menos uma solução para continuarmos.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStage(3);
    }
  };

  // Validação da Etapa 3
  const handleNextFromStep3 = () => {
    const newErrors: Record<string, string> = {};

    if (isHealthSelected && !possuiPlano) {
      newErrors.possuiPlano = "Informe se você já possui plano de saúde.";
    }
    if (isCompanyScenario && !tamanhoEmpresa) {
      newErrors.tamanhoEmpresa = "Informe o tamanho da sua empresa.";
    }
    if (isInsuranceSelected && !possuiSeguro) {
      newErrors.possuiSeguro = "Informe se você já possui esse seguro.";
    }
    if (!prazoDecisao) {
      newErrors.prazoDecisao = "Selecione quando pretende tomar uma decisão.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStage("review");
    }
  };

  // Monta o objeto estruturado interno (Seção 44)
  const buildLeadPayload = (): CRMLeadPayload => ({
    nome: nome.trim(),
    whatsapp: whatsapp.trim(),
    email: email.trim(),
    perfil,
    interesse: interesses,
    possui_plano: possuiPlano,
    satisfacao,
    motivo_mudanca: motivoMudanca,
    quantidade_pessoas: quantidadePessoas,
    cidade: cidade.trim(),
    tamanho_empresa: tamanhoEmpresa,
    possui_beneficios: possuiBeneficios,
    revisar_beneficios_atuais: revisarBeneficiosAtuais,
    desafio_empresa: desafioEmpresa,
    tipo_seguro: insuranceTypesSelected.join(", "),
    possui_seguro: possuiSeguro,
    preocupacao,
    prazo_decisao: prazoDecisao,
    faixa_investimento: faixaInvestimento,
  });

  const handleSubmitForm = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const payload = buildLeadPayload();
      await registerQualifiedLead(payload);
      setStage("submitted");
    } catch (err: any) {
      setSubmitError(
        err.message ||
          "Não foi possível enviar sua solicitação agora. Tente novamente ou chame pelo WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStage(1);
    setErrors({});
    setSubmitError("");
  };

  const isDark = theme === "dark";
  const currentStepNumber =
    stage === 1 ? 1 : stage === 2 ? 2 : stage === 3 ? 3 : 3;
  const progressPercentage =
    stage === 1
      ? 33
      : stage === 2
      ? 66
      : stage === 3
      ? 92
      : 100;

  const leadPayload = buildLeadPayload();
  const personalizedWhatsAppUrl = buildQualifiedWhatsAppLink(leadPayload);

  // Resumo da Situação para a tela "Confira suas informações" (Seção 40)
  const getSituacaoResumo = (): string => {
    const parts: string[] = [];
    if (possuiPlano) {
      parts.push(
        possuiPlano === "Sim"
          ? "Já possui plano"
          : possuiPlano === "Não"
          ? "Ainda não possui plano"
          : possuiPlano
      );
    }
    if (possuiBeneficios) {
      parts.push(
        possuiBeneficios === "Sim"
          ? "Empresa já oferece benefícios"
          : possuiBeneficios === "Não"
          ? "Empresa ainda sem benefícios"
          : possuiBeneficios
      );
    }
    if (possuiSeguro) {
      parts.push(
        possuiSeguro === "Sim"
          ? "Já possui seguro"
          : possuiSeguro === "Não"
          ? "Ainda não possui seguro"
          : "Pesquisando seguro"
      );
    }
    return parts.join(" · ") || "Em análise inicial";
  };

  const getMotivoResumo = (): string => {
    const parts: string[] = [];
    if (motivoMudanca) parts.push(motivoMudanca);
    if (desafioEmpresa) parts.push(`Desafio: ${desafioEmpresa}`);
    if (preocupacao) parts.push(`Foco: ${preocupacao}`);
    return parts.join(" · ") || "Avaliação consultiva";
  };

  return (
    <div
      className={`rounded-2xl border transition-colors duration-200 ${
        isDark
          ? "bg-[#072854] border-white/15 text-white"
          : "bg-white border-slate-200/90 text-[#4A4A4A] shadow-sm"
      }`}
    >
      {/* Top Header Bar with Progress Indicator (Seção 32) */}
      {stage !== "submitted" && (
        <div
          className={`px-6 pt-6 pb-5 border-b ${
            isDark ? "border-white/10" : "border-slate-100"
          }`}
        >
          <div className="flex items-center justify-between gap-4 mb-3">
            <span
              className={`text-xs font-semibold tracking-wide ${
                isDark ? "text-emerald-300" : "text-[#0B3C7A]"
              }`}
            >
              {stage === "review"
                ? "Revisão final · Etapa 3 de 3 concluída"
                : `Etapa ${currentStepNumber} de 3`}
            </span>
            <span
              className={`text-xs tabular-nums ${
                isDark ? "text-slate-300" : "text-slate-500"
              }`}
            >
              Diagnóstico Consultivo Árakon
            </span>
          </div>

          {/* Barra de progresso discreta */}
          <div
            className={`w-full h-1.5 rounded-full overflow-hidden ${
              isDark ? "bg-white/10" : "bg-slate-100"
            }`}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-[#00A859] transition-transform duration-200 origin-left"
              style={{ transform: `scaleX(${progressPercentage / 100})` }}
            />
          </div>
        </div>
      )}

      {/* Body Container */}
      <div className="p-6 sm:p-8 lg:p-10">
        {/* ==================================================
            33. ETAPA 1 — SOBRE VOCÊ
           ================================================== */}
        {stage === 1 && (
          <div className="space-y-6">
            <div>
              <h3
                className={`font-display text-2xl sm:text-3xl font-semibold tracking-tight ${
                  isDark ? "text-white" : "text-[#0B3C7A]"
                }`}
              >
                Vamos entender o que você precisa.
              </h3>
              <p
                className={`mt-1.5 text-sm ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Preencha seus dados básicos para prepararmos um direcionamento sob medida.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* 1. Nome completo */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="arakon-nome"
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-100" : "text-slate-800"
                  }`}
                >
                  Nome completo <span className="text-[#00A859]">*</span>
                </label>
                <input
                  id="arakon-nome"
                  type="text"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    if (errors.nome) setErrors({ ...errors, nome: "" });
                  }}
                  placeholder="Ex: Thiago Lima"
                  className={`w-full px-4 py-3.5 rounded-xl border text-base transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A859] ${
                    isDark
                      ? "bg-[#0B3C7A]/60 border-white/20 text-white placeholder:text-slate-400"
                      : "bg-[#F5F5F5]/70 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white"
                  }`}
                />
                {errors.nome && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.nome}
                  </p>
                )}
              </div>

              {/* 2. WhatsApp */}
              <div>
                <label
                  htmlFor="arakon-whatsapp"
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-100" : "text-slate-800"
                  }`}
                >
                  WhatsApp <span className="text-[#00A859]">*</span>
                </label>
                <input
                  id="arakon-whatsapp"
                  type="tel"
                  inputMode="numeric"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(formatBrazilianPhone(e.target.value));
                    if (errors.whatsapp) setErrors({ ...errors, whatsapp: "" });
                  }}
                  placeholder="(21) 99555-3350"
                  className={`w-full px-4 py-3.5 rounded-xl border text-base tabular-nums transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A859] ${
                    isDark
                      ? "bg-[#0B3C7A]/60 border-white/20 text-white placeholder:text-slate-400"
                      : "bg-[#F5F5F5]/70 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white"
                  }`}
                />
                {errors.whatsapp && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.whatsapp}
                  </p>
                )}
              </div>

              {/* 3. E-mail (Opcional) */}
              <div>
                <label
                  htmlFor="arakon-email"
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-100" : "text-slate-800"
                  }`}
                >
                  E-mail{" "}
                  <span
                    className={`text-xs font-normal ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    (opcional)
                  </span>
                </label>
                <input
                  id="arakon-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  placeholder="seuemail@exemplo.com.br"
                  className={`w-full px-4 py-3.5 rounded-xl border text-base transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A859] ${
                    isDark
                      ? "bg-[#0B3C7A]/60 border-white/20 text-white placeholder:text-slate-400"
                      : "bg-[#F5F5F5]/70 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* 4. Você está buscando uma solução para: */}
            <div>
              <label
                className={`block text-sm font-medium mb-3 ${
                  isDark ? "text-slate-100" : "text-slate-800"
                }`}
              >
                Você está buscando uma solução para:{" "}
                <span className="text-[#00A859]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROFILE_OPTIONS.map((option) => {
                  const selected = perfil === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setPerfil(option);
                        if (errors.perfil) setErrors({ ...errors, perfil: "" });
                      }}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-left text-sm font-medium transition-colors cursor-pointer ${
                        selected
                          ? "bg-[#0B3C7A] border-[#0B3C7A] text-white"
                          : isDark
                          ? "bg-[#0B3C7A]/40 border-white/15 text-slate-200 hover:border-white/40"
                          : "bg-[#F5F5F5]/60 border-slate-200 text-slate-800 hover:border-[#0B3C7A]/50 hover:bg-white"
                      }`}
                    >
                      <span className="truncate pr-2">{option}</span>
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                          selected
                            ? "bg-[#00A859] border-[#00A859] text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.perfil && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.perfil}
                </p>
              )}
            </div>

            {/* Botão Avançar */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p
                className={`text-xs ${
                  isDark ? "text-slate-300" : "text-slate-500"
                }`}
              >
                Campos com <span className="text-[#00A859] font-semibold">*</span> são obrigatórios.
              </p>
              <button
                type="button"
                onClick={handleNextFromStep1}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00A859] hover:bg-[#008A47] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Continuar para Etapa 2</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            34. ETAPA 2 — O QUE VOCÊ PROCURA?
           ================================================== */}
        {stage === 2 && (
          <div className="space-y-6">
            <div>
              <h3
                className={`font-display text-2xl sm:text-3xl font-semibold tracking-tight ${
                  isDark ? "text-white" : "text-[#0B3C7A]"
                }`}
              >
                Qual solução você está procurando?
              </h3>
              <p
                className={`mt-1.5 text-sm ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Você pode selecionar uma ou mais opções que façam sentido para o seu momento.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SOLUTION_OPTIONS.map((option) => {
                const selected = interesses.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleInteresse(option)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-left text-sm font-medium transition-colors cursor-pointer ${
                      selected
                        ? "bg-[#0B3C7A] border-[#0B3C7A] text-white"
                        : isDark
                        ? "bg-[#0B3C7A]/40 border-white/15 text-slate-200 hover:border-white/40"
                        : "bg-[#F5F5F5]/60 border-slate-200 text-slate-800 hover:border-[#0B3C7A]/50 hover:bg-white"
                    }`}
                  >
                    <span className="truncate pr-2">{option}</span>
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                        selected
                          ? "bg-[#00A859] border-[#00A859] text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {errors.interesses && (
              <p className="text-xs text-red-500 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.interesses}
              </p>
            )}

            <div className="pt-3 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStage(1)}
                className={`inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isDark
                    ? "text-slate-200 hover:bg-white/10"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={handleNextFromStep2}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00A859] hover:bg-[#008A47] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Continuar para Etapa 3</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            35–39. ETAPA 3 — ENTENDER O CENÁRIO (DINÂMICA)
           ================================================== */}
        {stage === 3 && (
          <div className="space-y-8">
            <div>
              <h3
                className={`font-display text-2xl sm:text-3xl font-semibold tracking-tight ${
                  isDark ? "text-white" : "text-[#0B3C7A]"
                }`}
              >
                Conte um pouco sobre o seu cenário atual.
              </h3>
              <p
                className={`mt-1.5 text-sm ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Essas perguntas rápidas ajudam nosso especialista a preparar alternativas reais para você.
              </p>
            </div>

            {/* 35. SE PLANO DE SAÚDE */}
            {isHealthSelected && (
              <div
                className={`p-5 rounded-xl border space-y-5 ${
                  isDark
                    ? "bg-[#0B3C7A]/35 border-white/15"
                    : "bg-[#F5F5F5]/70 border-slate-200/80"
                }`}
              >
                <div className="text-xs font-semibold tracking-wide text-[#00A859]">
                  Cenário · Plano de Saúde
                </div>

                {/* Você já possui plano de saúde? */}
                <div>
                  <label className="block text-sm font-medium mb-2.5">
                    Você já possui plano de saúde?{" "}
                    <span className="text-[#00A859]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {["Sim", "Não", "Estou pesquisando para contratar"].map(
                      (opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setPossuiPlano(opt);
                            if (errors.possuiPlano)
                              setErrors({ ...errors, possuiPlano: "" });
                          }}
                          className={`px-3.5 py-3 rounded-xl border text-sm font-medium text-left transition-colors cursor-pointer ${
                            possuiPlano === opt
                              ? "bg-[#0B3C7A] border-[#0B3C7A] text-white"
                              : "bg-white border-slate-200 text-slate-800 hover:border-[#0B3C7A]/50"
                          }`}
                        >
                          {opt}
                        </button>
                      )
                    )}
                  </div>
                  {errors.possuiPlano && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.possuiPlano}
                    </p>
                  )}
                </div>

                {/* Se SIM: Satisfação e Motivo de mudança */}
                {(possuiPlano === "Sim" ||
                  interesses.includes("Revisão do meu plano atual")) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2.5">
                        Você está satisfeito com seu plano atual?
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {["Sim", "Mais ou menos", "Não"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSatisfacao(opt)}
                            className={`px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                              satisfacao === opt
                                ? "bg-[#0B3C7A] border-[#0B3C7A] text-white"
                                : "bg-white border-slate-200 text-slate-800 hover:border-[#0B3C7A]/50"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2.5">
                        Qual é o principal motivo para avaliar uma mudança?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          "Mensalidade alta",
                          "Reajuste",
                          "Rede credenciada",
                          "Atendimento",
                          "Cobertura",
                          "Mudança de cidade/região",
                          "Quero apenas comparar",
                          "Outro",
                        ].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setMotivoMudanca(opt)}
                            className={`px-3.5 py-2.5 rounded-xl border text-sm font-medium text-left transition-colors cursor-pointer ${
                              motivoMudanca === opt
                                ? "bg-[#0B3C7A] border-[#0B3C7A] text-white"
                                : "bg-white border-slate-200 text-slate-800 hover:border-[#0B3C7A]/50"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Quantas pessoas precisam do plano? */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2.5">
                      Quantas pessoas precisam do plano?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["1", "2", "3 a 4", "5 ou mais"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setQuantidadePessoas(opt)}
                          className={`px-3 py-2.5 rounded-xl border text-sm font-medium tabular-nums transition-colors cursor-pointer ${
                            quantidadePessoas === opt
                              ? "bg-[#0B3C7A] border-[#0B3C7A] text-white"
                              : "bg-white border-slate-200 text-slate-800 hover:border-[#0B3C7A]/50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cidade / região de atendimento */}
                  <div>
                    <label
                      htmlFor="arakon-cidade"
                      className="block text-sm font-medium mb-2.5"
                    >
                      Qual cidade/região de atendimento você precisa?
                    </label>
                    <input
                      id="arakon-cidade"
                      type="text"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      placeholder="Ex: Rio de Janeiro, Niterói, São Paulo..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A859]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 36. SE FOR EMPRESA */}
            {isCompanyScenario && (
              <div
                className={`p-5 rounded-xl border space-y-5 ${
                  isDark
                    ? "bg-[#0B3C7A]/35 border-white/15"
                    : "bg-[#F5F5F5]/70 border-slate-200/80"
                }`}
              >
                <div className="text-xs font-semibold tracking-wide text-[#00A859]">
                  Cenário · Benefícios e Soluções Corporativas
                </div>

                {/* Qual é o tamanho da sua empresa? */}
                <div>
                  <label className="block text-sm font-medium mb-2.5">
                    Qual é o tamanho da sua empresa?{" "}
                    <span className="text-[#00A859]">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      "1 a 4 colaboradores",
                      "5 a 9",
                      "10 a 29",
                      "30 a 49",
                      "50 a 99",
                      "100+",
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setTamanhoEmpresa(opt);
                          if (errors.tamanhoEmpresa)
                            setErrors({ ...errors, tamanhoEmpresa: "" });
                        }}
                        className={`px-3.5 py-2.5 rounded-xl border text-sm font-medium tabular-nums transition-colors cursor-pointer ${
                          tamanhoEmpresa === opt
                            ? "bg-[#0B3C7A] border-[#0B3C7A] text-white"
                            : "bg-white border-slate-200 text-slate-800 hover:border-[#0B3C7A]/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {errors.tamanhoEmpresa && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.tamanhoEmpresa}
                    </p>
                  )}
                </div>

                {/* Hoje sua empresa já oferece plano de saúde ou benefícios? */}
                <div>
                  <label className="block text-sm font-medium mb-2.5">
                    Hoje sua empresa já oferece plano de saúde ou benefícios?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      "Sim",
                      "Não",
                      "Estamos avaliando pela primeira vez",
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setPossuiBeneficios(opt)}
                        className={`px-3.5 py-2.5 rounded-xl border text-sm font-medium text-left transition-colors cursor-pointer ${
                          possuiBeneficios === opt
                            ? "bg-[#0B3C7A] border-[#0B3C7A] text-white"
                            : "bg-white border-slate-200 text-slate-800 hover:border-[#0B3C7A]/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Se SIM: Você pretende revisar a solução atual? */}
                {possuiBeneficios === "Sim" && (
                  <div>
                    <label className="block text-sm font-medium mb-2.5">
                      Você pretende revisar a solução atual?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        "Sim",
                        "Talvez",
                        "Não, apenas quero conhecer alternativas",
                      ].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setRevisarBeneficiosAtuais(opt)}
                          className={`px-3.5 py-2.5 rounded-xl border text-sm font-medium text-left transition-colors cursor-pointer ${
                            revisarBeneficiosAtuais === opt
                              ? "bg-[#0B3C7A] border-[#0B3C7A] text-white"
                              : "bg-white border-slate-200 text-slate-800 hover:border-[#0B3C7A]/50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Qual é o principal desafio hoje? */}
                <div>
                  <label className="block text-sm font-medium mb-2.5">
                    Qual é o principal desafio hoje?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      "Custo",
                      "Reajuste",
                      "Rede credenciada",
                      "Adesão dos colaboradores",
                      "Retenção de talentos",
                      "Implantação",
                      "Atendimento",
                      "Outro",
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setDesafioEmpresa(opt)}
                        className={`px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-colors cursor-pointer ${
                          desafioEmpresa === opt
                            ? "bg-[#0B3C7A] border-[#0B3C7A] text-white"
                            : "bg-white border-slate-200 text-slate-800 hover:border-[#0B3C7A]/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 37. SE FOR SEGURO */}
            {isInsuranceSelected && (
              <div
                className={`p-5 rounded-xl border space-y-5 ${
                  isDark
                    ? "bg-[#0B3C7A]/35 border-white/15"
                    : "bg-[#F5F5F5]/70 border-slate-200/80"
                }`}
              >
                <div className="text-xs font-semibold tracking-wide text-[#00A859]">
                  Cenário · Proteção e Seguros ({primaryInsuranceType})
                </div>

                {/* Você já possui esse seguro? */}
                <div>
                  <label className="block text-sm font-medium mb-2.5">
                    Você já possui esse seguro?{" "}
                    <span className="text-[#00A859]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {["Sim", "Não", "Estou pesquisando"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setPossuiSeguro(opt);
                          if (errors.possuiSeguro)
                            setErrors({ ...errors, possuiSeguro: "" });
                        }}
                        className={`px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                          possuiSeguro === opt
                            ? "bg-[#0B3C7A] border-[#0B3C7A] text-white"
                            : "bg-white border-slate-200 text-slate-800 hover:border-[#0B3C7A]/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {errors.possuiSeguro && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.possuiSeguro}
                    </p>
                  )}
                </div>

                {/* Qual é sua principal preocupação? */}
                <div>
                  <label className="block text-sm font-medium mb-2.5">
                    Qual é sua principal preocupação?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {dynamicInsuranceConcerns.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setPreocupacao(opt)}
                        className={`px-3.5 py-2.5 rounded-xl border text-sm font-medium text-left transition-colors cursor-pointer ${
                          preocupacao === opt
                            ? "bg-[#0B3C7A] border-[#0B3C7A] text-white"
                            : "bg-white border-slate-200 text-slate-800 hover:border-[#0B3C7A]/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 38. MOMENTO DE COMPRA */}
            <div>
              <label className="block text-sm font-medium mb-2.5">
                Quando você pretende tomar uma decisão?{" "}
                <span className="text-[#00A859]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {DECISION_TIMELINE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setPrazoDecisao(opt);
                      if (errors.prazoDecisao)
                        setErrors({ ...errors, prazoDecisao: "" });
                    }}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-colors cursor-pointer ${
                      prazoDecisao === opt
                        ? "bg-[#0B3C7A] border-[#0B3C7A] text-white"
                        : "bg-[#F5F5F5]/60 border-slate-200 text-slate-800 hover:border-[#0B3C7A]/50 hover:bg-white"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {errors.prazoDecisao && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.prazoDecisao}
                </p>
              )}
            </div>

            {/* 39. ORÇAMENTO / FAIXA DE INVESTIMENTO (NÃO OBRIGATÓRIA) */}
            <div>
              <label className="block text-sm font-medium mb-2.5">
                Você já possui uma faixa de investimento definida?{" "}
                <span className="text-xs font-normal text-slate-500">
                  (opcional)
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {INVESTMENT_RANGES.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() =>
                      setFaixaInvestimento(
                        faixaInvestimento === range ? "" : range
                      )
                    }
                    className={`px-4 py-3 rounded-xl border text-sm font-medium tabular-nums text-left transition-colors cursor-pointer ${
                      faixaInvestimento === range
                        ? "bg-[#0B3C7A] border-[#0B3C7A] text-white"
                        : "bg-[#F5F5F5]/60 border-slate-200 text-slate-800 hover:border-[#0B3C7A]/50 hover:bg-white"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Navegação Etapa 3 */}
            <div className="pt-3 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStage(2)}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={handleNextFromStep3}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00A859] hover:bg-[#008A47] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Conferir minhas informações</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            40. ÚLTIMA ETAPA — RESUMO ("Confira suas informações")
           ================================================== */}
        {stage === "review" && (
          <div className="space-y-6">
            <div>
              <h3
                className={`font-display text-2xl sm:text-3xl font-semibold tracking-tight ${
                  isDark ? "text-white" : "text-[#0B3C7A]"
                }`}
              >
                Confira suas informações
              </h3>
              <p className="mt-1.5 text-sm text-slate-600">
                Revise rapidamente o resumo do seu cenário antes de enviar sua solicitação para a Árakon.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#F5F5F5]/70 p-5 sm:p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">Nome:</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">
                    {nome}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-slate-500">WhatsApp:</dt>
                  <dd className="font-semibold text-slate-900 tabular-nums mt-0.5">
                    {whatsapp}
                  </dd>
                </div>

                {email && (
                  <div>
                    <dt className="text-xs text-slate-500">E-mail:</dt>
                    <dd className="font-semibold text-slate-900 mt-0.5">
                      {email}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-xs text-slate-500">Interesse:</dt>
                  <dd className="font-semibold text-[#0B3C7A] mt-0.5">
                    {interesses.join(", ")}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-slate-500">Perfil:</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">
                    {PROFILE_DISPLAY_LABELS[perfil] || perfil}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-slate-500">Situação:</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">
                    {getSituacaoResumo()}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-slate-500">Motivo:</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">
                    {getMotivoResumo()}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-slate-500">Prazo:</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">
                    {prazoDecisao}
                  </dd>
                </div>

                {(quantidadePessoas || tamanhoEmpresa || cidade) && (
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200/80 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
                    {quantidadePessoas && (
                      <span>
                        Vidas/Pessoas:{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {quantidadePessoas}
                        </strong>
                      </span>
                    )}
                    {tamanhoEmpresa && (
                      <span>
                        Porte da empresa:{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {tamanhoEmpresa}
                        </strong>
                      </span>
                    )}
                    {cidade && (
                      <span>
                        Região de atendimento:{" "}
                        <strong className="text-slate-900">{cidade}</strong>
                      </span>
                    )}
                    {faixaInvestimento && (
                      <span>
                        Faixa de investimento:{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {faixaInvestimento}
                        </strong>
                      </span>
                    )}
                  </div>
                )}
              </dl>
            </div>

            {submitError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStage(3)}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Editar respostas</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitForm}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#00A859] hover:bg-[#008A47] text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? "Enviando solicitação..."
                    : "Enviar minha solicitação"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            41. APÓS ENVIO — TELA DE CONFIRMAÇÃO ELEGANTE
           ================================================== */}
        {stage === "submitted" && (
          <div className="py-6 sm:py-8 text-center max-w-xl mx-auto space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#00A859]/15 text-[#00A859] flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div className="space-y-2.5">
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0B3C7A]">
                Recebemos suas informações.
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Agora a Árakon já conhece um pouco melhor o seu cenário. Um especialista poderá entrar em contato para entender os próximos passos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F5F5] border border-slate-200/80 text-left text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-[#0B3C7A]">
                Mensagem preparada para agilizar seu atendimento:
              </div>
              <p className="italic text-slate-700">
                "Olá, Árakon! Sou {nome.trim()}. Acabei de preencher a análise pelo site e tenho interesse em {interesses.join(", ")}. Gostaria de conversar sobre meu cenário."
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={personalizedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#00A859] hover:bg-[#008A47] text-white font-semibold text-sm shadow-sm transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Continuar pelo WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Realizar nova análise</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé do Formulário: Caminho Direto para quem não quer preencher perguntas (Seção 42 & 46) */}
      {stage !== "submitted" && (
        <div
          className={`px-6 py-4 rounded-b-2xl border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs ${
            isDark
              ? "bg-[#061F42] border-white/10 text-slate-300"
              : "bg-[#F5F5F5]/80 border-slate-200/70 text-slate-600"
          }`}
        >
          <span>Prefere falar agora sem preencher as etapas?</span>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-[#00A859] hover:underline whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Falar diretamente pelo WhatsApp</span>
          </a>
        </div>
      )}
    </div>
  );
};
