/**
 * ==================================================
 * 31. CONFIGURAÇÃO CENTRAL DE CONVERSÃO ÁRAKON
 * ==================================================
 * Centraliza o número oficial do WhatsApp, faixas de investimento
 * e estrutura de qualificação para CRM (HubSpot / Webhook / API).
 * Para alterar o contato oficial em todo o site, edite apenas WHATSAPP_URL.
 */

export const WHATSAPP_URL = "https://wa.me/5521995553350";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá, Árakon! Gostaria de falar com um especialista sobre planos de saúde e seguros.";

export const POST_FORM_DEFAULT_MESSAGE =
  "Olá, Árakon! Acabei de preencher a análise pelo site e gostaria de conversar sobre minha necessidade.";

/**
 * Gera a URL oficial do WhatsApp com mensagem pré-preenchida opcional.
 * Todos os CTAs do site utilizam esta função centralizada.
 */
export function getWhatsAppLink(customMessage?: string): string {
  const message = customMessage?.trim() || DEFAULT_WHATSAPP_MESSAGE;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

/**
 * ==================================================
 * 39. FAIXAS DE INVESTIMENTO (FACILMENTE ALTERÁVEIS)
 * ==================================================
 */
export const INVESTMENT_RANGES: readonly string[] = [
  "Ainda não",
  "Até R$ 500/mês",
  "R$ 500 a R$ 1.000/mês",
  "R$ 1.000 a R$ 2.500/mês",
  "Acima de R$ 2.500/mês",
  "Prefiro conversar primeiro",
];

/**
 * Opções da Etapa 1 — Perfil do Lead
 */
export const PROFILE_OPTIONS: readonly string[] = [
  "Eu/minha família",
  "Eu/minha família via CNPJ",
  "Minha empresa",
  "Minha proteção pessoal",
  "Meu patrimônio",
  "Outro",
];

/**
 * Rótulos amigáveis para exibição no Resumo quando aplicável
 */
export const PROFILE_DISPLAY_LABELS: Record<string, string> = {
  "Eu/minha família": "Eu/minha família (PF)",
  "Eu/minha família via CNPJ": "Eu/minha família via CNPJ",
  "Minha empresa": "Empresa / Corporativo",
  "Minha proteção pessoal": "Proteção Pessoal",
  "Meu patrimônio": "Proteção Patrimonial",
  "Outro": "Outro",
};

/**
 * Opções da Etapa 2 — Soluções de Interesse
 */
export const SOLUTION_OPTIONS: readonly string[] = [
  "Revisão do meu plano atual",
  "Plano de Saúde",
  "Plano Odontológico",
  "Seguro de Vida",
  "Seguro Auto",
  "Seguro Residencial",
  "Seguro Viagem",
  "Seguro Empresarial",
  "Revisão dos meus seguros",
  "Ainda não sei / Quero orientação",
];

/**
 * Opções da Etapa 3 — Momento de Compra
 */
export const DECISION_TIMELINE_OPTIONS: readonly string[] = [
  "Nos próximos 7 dias",
  "Nos próximos 30 dias",
  "Nos próximos 3 meses",
  "Ainda estou pesquisando",
  "Só quero entender as opções",
];

/**
 * Preocupações dinâmicas por tipo de seguro (Etapa 3 - Seguros)
 */
export const INSURANCE_CONCERNS_BY_TYPE: Record<string, readonly string[]> = {
  "Seguro de Vida": [
    "Proteção da família",
    "Sucessão",
    "Proteção de renda",
    "Planejamento financeiro",
    "Outro",
  ],
  "Seguro Empresarial": [
    "Proteção do patrimônio",
    "Responsabilidade",
    "Continuidade do negócio",
    "Funcionários",
    "Outro",
  ],
  "Seguro Auto": [
    "Proteção do patrimônio",
    "Redução de custo na renovação",
    "Cobertura completa e assistência 24h",
    "Responsabilidade contra terceiros",
    "Outro",
  ],
  "Seguro Residencial": [
    "Proteção do patrimônio",
    "Danos elétricos, incêndio e roubo",
    "Assistência residencial 24h",
    "Responsabilidade familiar",
    "Outro",
  ],
  "Seguro Viagem": [
    "Cobertura médica internacional",
    "Proteção da família em viagem",
    "Bagagem e cancelamento",
    "Viagens corporativas frequentes",
    "Outro",
  ],
  default: [
    "Proteção da família",
    "Proteção do patrimônio",
    "Sucessão",
    "Continuidade do negócio",
    "Planejamento financeiro",
    "Outro",
  ],
};

/**
 * ==================================================
 * 44. ESTRUTURA INTERNA PARA QUALIFICAÇÃO E CRM
 * ==================================================
 * Objeto padronizado para futura integração com HubSpot,
 * webhook, API própria, CRM ou automação de WhatsApp.
 */
export interface CRMLeadPayload {
  nome: string;
  whatsapp: string;
  email: string;
  perfil: string;
  interesse: string[];
  possui_plano: string;
  satisfacao: string;
  motivo_mudanca: string;
  quantidade_pessoas: string;
  cidade: string;
  tamanho_empresa: string;
  possui_beneficios: string;
  revisar_beneficios_atuais?: string;
  desafio_empresa: string;
  tipo_seguro: string;
  possui_seguro?: string;
  preocupacao: string;
  prazo_decisao: string;
  faixa_investimento: string;
  submitted_at?: string;
}

/**
 * Gera a URL do WhatsApp personalizada com os dados preenchidos na análise (Seção 41).
 */
export function buildQualifiedWhatsAppLink(lead: CRMLeadPayload): string {
  const nome = lead.nome.trim();
  const solucoes = lead.interesse.filter(Boolean).join(", ");

  if (nome && solucoes) {
    const msg = `Olá, Árakon! Sou ${nome}. Acabei de preencher a análise pelo site e tenho interesse em ${solucoes}. Gostaria de conversar sobre meu cenário.`;
    return `${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`;
  }

  return `${WHATSAPP_URL}?text=${encodeURIComponent(POST_FORM_DEFAULT_MESSAGE)}`;
}

/**
 * Camada de serviço integrada ao banco de dados (/api/leads e Supabase quando configurado).
 * Funciona tanto no servidor completo quanto em hospedagem estática via GitHub (Vercel/Netlify)
 * antes ou depois de configurar as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
 */
export async function registerQualifiedLead(
  payload: CRMLeadPayload,
  idToken?: string | null
): Promise<{ ok: boolean; id?: number }> {
  const normalizedPayload: CRMLeadPayload = {
    ...payload,
    submitted_at: new Date().toISOString(),
  };

  try {
    sessionStorage.setItem(
      "arakon_last_qualified_lead",
      JSON.stringify(normalizedPayload)
    );
  } catch {
    // Ignora falhas de storage em modo privado restrito
  }

  // 1. Se o Supabase externo estiver configurado via variáveis de ambiente (VITE_SUPABASE_URL)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (supabaseUrl && supabaseAnonKey) {
    try {
      await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/qualified_leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          nome: normalizedPayload.nome,
          whatsapp: normalizedPayload.whatsapp,
          email: normalizedPayload.email,
          perfil: normalizedPayload.perfil,
          interesse: normalizedPayload.interesse.join(", "),
          possui_plano: normalizedPayload.possui_plano,
          satisfacao: normalizedPayload.satisfacao,
          motivo_mudanca: normalizedPayload.motivo_mudanca,
          quantidade_pessoas: normalizedPayload.quantidade_pessoas,
          cidade: normalizedPayload.cidade,
          tamanho_empresa: normalizedPayload.tamanho_empresa,
          possui_beneficios: normalizedPayload.possui_beneficios,
          revisar_beneficios_atuais:
            normalizedPayload.revisar_beneficios_atuais || "",
          desafio_empresa: normalizedPayload.desafio_empresa,
          tipo_seguro: normalizedPayload.tipo_seguro,
          possui_seguro: normalizedPayload.possui_seguro || "",
          preocupacao: normalizedPayload.preocupacao,
          prazo_decisao: normalizedPayload.prazo_decisao,
          faixa_investimento: normalizedPayload.faixa_investimento,
        }),
      });
    } catch (err) {
      console.warn("Aviso ao sincronizar com Supabase externo:", err);
    }
  }

  // 2. Envia para a rota de backend (/api/leads) quando disponível
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (idToken) {
      headers.Authorization = `Bearer ${idToken}`;
    }

    const response = await fetch("/api/leads", {
      method: "POST",
      headers,
      body: JSON.stringify(normalizedPayload),
    });

    if (response.ok) {
      const data = await response.json();
      return { ok: true, id: data.id };
    }
  } catch {
    // Em publicação estática (ex: GitHub Pages / Vercel estático antes de configurar o Supabase),
    // mantém o fluxo de conversão para o WhatsApp funcionando sem bloquear o visitante.
  }

  return { ok: true };
}
