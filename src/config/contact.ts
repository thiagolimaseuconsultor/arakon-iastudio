export interface StoredLeadRecord extends CRMLeadPayload {
  id: number;
  status: string;
  createdAt: string;
}

const LOCAL_LEADS_STORAGE_KEY = "arakon_qualified_leads_list_v1";

/**
 * Configuracao Centralizada de Contato e Links de Conversao - Arakon Corretora
 */

export const WHATSAPP_NUMBER = "5521995553350";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá, Árakon! Gostaria de falar diretamente com um especialista sobre planos de saúde, benefícios ou seguros.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_DEFAULT_MESSAGE
)}`;

export function getWhatsAppLink(customMessage?: string): string {
  const text =
    customMessage && customMessage.trim().length > 0
      ? customMessage.trim()
      : WHATSAPP_DEFAULT_MESSAGE;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function buildQualifiedWhatsAppLink(
  leadOrName: CRMLeadPayload | string,
  interessesArg?: string[]
): string {
  const nome =
    typeof leadOrName === "string" ? leadOrName : leadOrName.nome || "";
  const interesses =
    typeof leadOrName === "string"
      ? interessesArg || []
      : leadOrName.interesse || [];
  const safeName = nome.trim() || "Visitante";
  const safeInterests =
    interesses.length > 0
      ? interesses.join(", ")
      : "soluções de proteção e saúde";
  const message = `Olá, Árakon! Sou ${safeName}. Acabei de preencher a análise pelo site e tenho interesse em ${safeInterests}. Gostaria de conversar sobre meu cenário.`;
  return getWhatsAppLink(message);
}

export const PROFILE_OPTIONS: string[] = [
  "Eu / minha família",
  "Eu / minha família (contratação via CNPJ)",
  "Minha empresa",
];

export const PROFILE_DISPLAY_LABELS: Record<string, string> = {
  pessoa_fisica: "Eu / minha família",
  familiar_cnpj: "Eu / minha família (contratação via CNPJ)",
  empresa: "Minha empresa",
  "Eu / minha família": "Eu / minha família",
  "Eu / minha família (contratação via CNPJ)":
    "Eu / minha família (contratação via CNPJ)",
  "Minha empresa": "Minha empresa",
};

export const SOLUTION_OPTIONS: string[] = [
  "Plano de Saúde",
  "Plano Odontológico",
  "Benefícios para Empresas",
  "Seguro de Vida",
  "Seguro Auto",
  "Seguro Residencial",
  "Seguro Empresarial / Patrimonial",
  "Seguro Viagem",
];

export const INSURANCE_CONCERNS_BY_TYPE: Record<string, string[]> = {
  "Seguro de Vida": [
    "Proteger a renda da minha família",
    "Cobertura em vida (doenças graves / invalidez)",
    "Planejamento sucessório / proteção de sócios",
    "Revisar apólice atual com melhor custo-benefício",
  ],
  "Seguro Auto": [
    "Reduzir o valor na renovação do seguro",
    "Segurar veículo novo ou recém-adquirido",
    "Melhorar coberturas (carro reserva, vidros, terceiros)",
    "Cotar seguro para mais de um veículo / frota",
  ],
  "Seguro Residencial": [
    "Proteger casa ou apartamento contra imprevistos e danos elétricos",
    "Contar com assistência residencial 24h",
    "Proteger bens de maior valor no imóvel",
    "Comparar custo-benefício de apólice residencial",
  ],
  "Seguro Empresarial / Patrimonial": [
    "Proteger ponto comercial, clínica ou escritório",
    "Cobertura para equipamentos e responsabilidade civil",
    "Atender exigências contratuais ou de locação",
    "Reduzir custos na renovação da apólice empresarial",
  ],
  "Seguro Viagem": [
    "Cobertura médica para viagem internacional",
    "Proteção para viagem em família",
    "Viagem corporativa ou intercâmbio",
    "Entender coberturas exigidas pelo destino",
  ],
  default: [
    "Proteger minha família e patrimônio com segurança",
    "Reduzir custos em relação à minha apólice atual",
    "Entender qual cobertura faz mais sentido para meu momento",
    "Contar com suporte consultivo em caso de sinistro",
  ],
};

export const DECISION_TIMELINE_OPTIONS = [
  "O quanto antes",
  "Ainda este mês",
  "Nos próximos meses",
  "Estou apenas pesquisando",
];

export const INVESTMENT_RANGES = [
  "Prefiro orientação do especialista",
  "Até R$ 600 / mês",
  "De R$ 600 a R$ 1.500 / mês",
  "De R$ 1.500 a R$ 3.500 / mês",
  "Acima de R$ 3.500 / mês",
];

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
  possui_seguro: string;
  preocupacao: string;
  prazo_decisao: string;
  faixa_investimento: string;
  submitted_at?: string;
}

export function getLocalStoredLeads(): StoredLeadRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_LEADS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function updateLocalLeadStatus(id: number, status: string): void {
  try {
    const current = getLocalStoredLeads();
    const updated = current.map((item) =>
      item.id === id ? { ...item, status } : item
    );
    localStorage.setItem(LOCAL_LEADS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignora falhas de storage
  }
}

export const SUPABASE_URL: string =
  (import.meta as any).env?.VITE_SUPABASE_URL?.trim() ||
  "https://xbhawcqnltglgdjppqnl.supabase.co";

export const SUPABASE_ANON_KEY: string =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY?.trim() ||
  [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiaGF3Y3FubHRnbGdkanBwcW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NTgzNjcsImV4cCI6MjEwNjAzNDM2N30",
    "J5ARnsO4OtB2jsvs3Lfwhx9FeWq65DoC4-padR1sewk",
  ].join(".");

/**
 * Registra o lead qualificado no Supabase e mantém cópia local segura para consulta imediata.
 */
export async function registerQualifiedLead(
  payload: CRMLeadPayload
): Promise<{ ok: boolean; id?: number }> {
  const nowIso = new Date().toISOString();
  const generatedId = Date.now();
  const normalizedPayload: CRMLeadPayload = {
    ...payload,
    submitted_at: nowIso,
  };

  try {
    sessionStorage.setItem(
      "arakon_last_qualified_lead",
      JSON.stringify(normalizedPayload)
    );
    const existing = getLocalStoredLeads();
    const newRecord: StoredLeadRecord = {
      ...normalizedPayload,
      id: generatedId,
      status: "novo",
      createdAt: nowIso,
    };
    localStorage.setItem(
      LOCAL_LEADS_STORAGE_KEY,
      JSON.stringify([newRecord, ...existing])
    );
  } catch {
    // Ignora falhas de storage em modo privado restrito
  }

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const endpoint = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/qualified_leads`;
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          nome: normalizedPayload.nome,
          whatsapp: normalizedPayload.whatsapp,
          email: normalizedPayload.email || "",
          perfil: normalizedPayload.perfil,
          interesse: Array.isArray(normalizedPayload.interesse)
            ? normalizedPayload.interesse.join(", ")
            : String(normalizedPayload.interesse || ""),
          possui_plano: normalizedPayload.possui_plano || "",
          satisfacao: normalizedPayload.satisfacao || "",
          motivo_mudanca: normalizedPayload.motivo_mudanca || "",
          quantidade_pessoas: normalizedPayload.quantidade_pessoas || "",
          cidade: normalizedPayload.cidade || "",
          tamanho_empresa: normalizedPayload.tamanho_empresa || "",
          possui_beneficios: normalizedPayload.possui_beneficios || "",
          revisar_beneficios_atuais:
            normalizedPayload.revisar_beneficios_atuais || "",
          desafio_empresa: normalizedPayload.desafio_empresa || "",
          tipo_seguro: normalizedPayload.tipo_seguro || "",
          possui_seguro: normalizedPayload.possui_seguro || "",
          preocupacao: normalizedPayload.preocupacao || "",
          prazo_decisao: normalizedPayload.prazo_decisao || "",
          faixa_investimento: normalizedPayload.faixa_investimento || "",
          status: "novo",
        }),
      });
    } catch (err) {
      console.warn("Aviso ao sincronizar com Supabase:", err);
    }
  }

  // Envia automaticamente para o HubSpot (cria o Contato + Negócio na fase "Prospecção")
  try {
    await fetch("/api/hubspot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(normalizedPayload),
    });
  } catch (err) {
    console.warn("Aviso ao sincronizar com HubSpot:", err);
  }

  return { ok: true, id: generatedId };
}
