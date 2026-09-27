import { desc, eq } from "drizzle-orm";
import { db } from "./index.ts";
import { qualifiedLeads } from "./schema.ts";

export interface CreateLeadInput {
  userId?: number | null;
  nome: string;
  whatsapp: string;
  email?: string;
  perfil: string;
  interesse: string[];
  possui_plano?: string;
  satisfacao?: string;
  motivo_mudanca?: string;
  quantidade_pessoas?: string;
  cidade?: string;
  tamanho_empresa?: string;
  possui_beneficios?: string;
  revisar_beneficios_atuais?: string;
  desafio_empresa?: string;
  tipo_seguro?: string;
  possui_seguro?: string;
  preocupacao?: string;
  prazo_decisao?: string;
  faixa_investimento?: string;
}

export async function createQualifiedLeadRecord(input: CreateLeadInput) {
  try {
    const interesseText = Array.isArray(input.interesse)
      ? input.interesse.filter(Boolean).join(", ")
      : String(input.interesse || "");

    const result = await db
      .insert(qualifiedLeads)
      .values({
        userId: input.userId ?? null,
        nome: input.nome.trim(),
        whatsapp: input.whatsapp.trim(),
        email: (input.email || "").trim(),
        perfil: input.perfil.trim(),
        interesse: interesseText,
        possuiPlano: input.possui_plano || "",
        satisfacao: input.satisfacao || "",
        motivoMudanca: input.motivo_mudanca || "",
        quantidadePessoas: input.quantidade_pessoas || "",
        cidade: (input.cidade || "").trim(),
        tamanhoEmpresa: input.tamanho_empresa || "",
        possuiBeneficios: input.possui_beneficios || "",
        revisarBeneficiosAtuais: input.revisar_beneficios_atuais || "",
        desafioEmpresa: input.desafio_empresa || "",
        tipoSeguro: input.tipo_seguro || "",
        possuiSeguro: input.possui_seguro || "",
        preocupacao: input.preocupacao || "",
        prazoDecisao: input.prazo_decisao || "",
        faixaInvestimento: input.faixa_investimento || "",
        status: "novo",
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Failed to insert qualified lead:", error);
    throw new Error("Não foi possível registrar a solicitação no momento.", {
      cause: error,
    });
  }
}

export async function listQualifiedLeads() {
  try {
    return await db
      .select()
      .from(qualifiedLeads)
      .orderBy(desc(qualifiedLeads.createdAt));
  } catch (error) {
    console.error("Failed to fetch qualified leads:", error);
    throw new Error("Não foi possível carregar as análises recebidas.", {
      cause: error,
    });
  }
}

export async function updateQualifiedLeadStatus(id: number, status: string) {
  try {
    const result = await db
      .update(qualifiedLeads)
      .set({ status })
      .where(eq(qualifiedLeads.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error("Failed to update lead status:", error);
    throw new Error("Não foi possível atualizar o status do atendimento.", {
      cause: error,
    });
  }
}
