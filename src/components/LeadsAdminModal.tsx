import React, { useEffect, useState, useCallback } from "react";
import {
  X,
  MessageCircle,
  RefreshCw,
  AlertCircle,
  Users,
} from "lucide-react";
import {
  WHATSAPP_URL,
  PROFILE_DISPLAY_LABELS,
  getLocalStoredLeads,
  updateLocalLeadStatus,
} from "../config/contact";

interface LeadRow {
  id: number;
  nome: string;
  whatsapp: string;
  email: string;
  perfil: string;
  interesse: string;
  possuiPlano: string;
  satisfacao: string;
  motivoMudanca: string;
  quantidadePessoas: string;
  cidade: string;
  tamanhoEmpresa: string;
  possuiBeneficios: string;
  revisarBeneficiosAtuais: string;
  desafioEmpresa: string;
  tipoSeguro: string;
  possuiSeguro: string;
  preocupacao: string;
  prazoDecisao: string;
  faixaInvestimento: string;
  status: string;
  createdAt: string;
}

interface LeadsAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  qualificado: "Qualificado",
  concluido: "Concluído",
};

export const LeadsAdminModal: React.FC<LeadsAdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL?.trim();
      const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY?.trim();

      if (supabaseUrl && supabaseAnonKey) {
        const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/qualified_leads?select=*&order=created_at.desc`;
        const response = await fetch(endpoint, {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        });
        if (response.ok) {
          const rows = await response.json();
          if (Array.isArray(rows) && rows.length > 0) {
            setLeads(
              rows.map((r: any) => ({
                id: r.id,
                nome: r.nome || "",
                whatsapp: r.whatsapp || "",
                email: r.email || "",
                perfil: r.perfil || "",
                interesse: r.interesse || "",
                possuiPlano: r.possui_plano || "",
                satisfacao: r.satisfacao || "",
                motivoMudanca: r.motivo_mudanca || "",
                quantidadePessoas: r.quantidade_pessoas || "",
                cidade: r.cidade || "",
                tamanhoEmpresa: r.tamanho_empresa || "",
                possuiBeneficios: r.possui_beneficios || "",
                revisarBeneficiosAtuais: r.revisar_beneficios_atuais || "",
                desafioEmpresa: r.desafio_empresa || "",
                tipoSeguro: r.tipo_seguro || "",
                possuiSeguro: r.possui_seguro || "",
                preocupacao: r.preocupacao || "",
                prazoDecisao: r.prazo_decisao || "",
                faixaInvestimento: r.faixa_investimento || "",
                status: r.status || "novo",
                createdAt: r.created_at || "",
              }))
            );
            setLoading(false);
            return;
          }
        }
      }

      // Fallback para análises salvas localmente no navegador
      const localItems = getLocalStoredLeads().map((r) => ({
        id: r.id,
        nome: r.nome,
        whatsapp: r.whatsapp,
        email: r.email,
        perfil: r.perfil,
        interesse: Array.isArray(r.interesse)
          ? r.interesse.join(", ")
          : String(r.interesse || ""),
        possuiPlano: r.possui_plano,
        satisfacao: r.satisfacao,
        motivoMudanca: r.motivo_mudanca,
        quantidadePessoas: r.quantidade_pessoas,
        cidade: r.cidade,
        tamanhoEmpresa: r.tamanho_empresa,
        possuiBeneficios: r.possui_beneficios,
        revisarBeneficiosAtuais: r.revisar_beneficios_atuais || "",
        desafioEmpresa: r.desafio_empresa,
        tipoSeguro: r.tipo_seguro,
        possuiSeguro: r.possui_seguro,
        preocupacao: r.preocupacao,
        prazoDecisao: r.prazo_decisao,
        faixaInvestimento: r.faixa_investimento,
        status: r.status || "novo",
        createdAt: r.createdAt,
      }));
      setLeads(localItems);
    } catch {
      setError("Não foi possível carregar os registros.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchLeads();
    }
  }, [isOpen, fetchLeads]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    updateLocalLeadStatus(id, newStatus);
    setLeads((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  if (!isOpen) return null;

  const buildDirectLeadWhatsApp = (lead: LeadRow) => {
    const digits = lead.whatsapp.replace(/\D/g, "");
    const phoneWithCountry = digits.startsWith("55") ? digits : `55${digits}`;
    const msg = `Olá, ${lead.nome}! Aqui é da Árakon Corretora. Recebemos sua análise sobre ${lead.interesse} pelo site e gostaria de conversar sobre seu cenário.`;
    if (digits.length >= 10) {
      return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`;
    }
    return WHATSAPP_URL;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="arakon-crm-title"
    >
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden shadow-lg">
        <div className="px-6 py-4 bg-[#0B3C7A] text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#00A859]" />
            <h2
              id="arakon-crm-title"
              className="font-display text-lg font-semibold"
            >
              Painel de Qualificação Comercial · Árakon Corretora
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Fechar painel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              <span className="tabular-nums font-semibold text-[#0B3C7A]">
                {leads.length}
              </span>{" "}
              {leads.length === 1
                ? "análise registrada"
                : "análises registradas"}
            </div>

            <button
              type="button"
              onClick={fetchLeads}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 hover:border-[#0B3C7A] text-xs font-semibold text-[#0B3C7A] transition-colors cursor-pointer whitespace-nowrap"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
              <span>Atualizar lista</span>
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading && leads.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Carregando análises...
            </div>
          ) : leads.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl space-y-1">
              <p className="font-display text-sm font-semibold text-[#0B3C7A]">
                Nenhuma análise registrada até o momento.
              </p>
              <p className="text-xs text-slate-500">
                Assim que um visitante enviar o formulário de qualificação no site, os dados aparecerão aqui e no seu Supabase.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-5 rounded-xl border border-slate-200 bg-[#F5F5F5]/60 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-[#0B3C7A]">
                        <span>{lead.nome}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums font-medium text-slate-700">
                          {lead.whatsapp}
                        </span>
                        {lead.email && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-normal text-xs text-slate-500">
                              {lead.email}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                        {PROFILE_DISPLAY_LABELS[lead.perfil] || lead.perfil} ·
                        Prazo: {lead.prazoDecisao || "Não informado"} ·{" "}
                        {lead.createdAt
                          ? new Date(lead.createdAt).toLocaleString("pt-BR")
                          : ""}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <select
                        aria-label={`Status de ${lead.nome}`}
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead.id, e.target.value)
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-[#0B3C7A] focus:outline-none focus:ring-2 focus:ring-[#00A859]"
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>

                      <a
                        href={buildDirectLeadWhatsApp(lead)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00A859] hover:bg-[#008A47] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chamar no WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-500">Soluções: </span>
                      <strong className="text-[#0B3C7A]">
                        {lead.interesse}
                      </strong>
                    </div>
                    {(lead.possuiPlano ||
                      lead.motivoMudanca ||
                      lead.quantidadePessoas ||
                      lead.cidade) && (
                      <div>
                        <span className="text-slate-500">Saúde: </span>
                        <span>
                          {[
                            lead.possuiPlano && `Possui: ${lead.possuiPlano}`,
                            lead.motivoMudanca &&
                              `Motivo: ${lead.motivoMudanca}`,
                            lead.quantidadePessoas &&
                              `Vidas: ${lead.quantidadePessoas}`,
                            lead.cidade && `Cidade: ${lead.cidade}`,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </div>
                    )}
                    {(lead.tamanhoEmpresa ||
                      lead.desafioEmpresa ||
                      lead.preocupacao ||
                      lead.faixaInvestimento) && (
                      <div>
                        <span className="text-slate-500">Detalhes: </span>
                        <span>
                          {[
                            lead.tamanhoEmpresa &&
                              `Porte: ${lead.tamanhoEmpresa}`,
                            lead.desafioEmpresa &&
                              `Desafio: ${lead.desafioEmpresa}`,
                            lead.preocupacao && `Foco: ${lead.preocupacao}`,
                            lead.faixaInvestimento &&
                              `Investimento: ${lead.faixaInvestimento}`,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
