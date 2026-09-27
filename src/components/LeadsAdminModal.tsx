import React, { useEffect, useState, useCallback } from "react";
import {
  X,
  LogIn,
  LogOut,
  MessageCircle,
  RefreshCw,
  AlertCircle,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { WHATSAPP_URL, PROFILE_DISPLAY_LABELS } from "../config/contact";

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
  const { user, signInWithGoogle, signOut, getFreshToken } = useAuth();
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchLeads = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const token = await getFreshToken();
      const response = await fetch("/api/leads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Não foi possível carregar as análises.");
      }
      setLeads(Array.isArray(data.leads) ? data.leads : []);
    } catch (err: any) {
      setError(err.message || "Falha ao carregar registros.");
    } finally {
      setLoading(false);
    }
  }, [user, getFreshToken]);

  useEffect(() => {
    if (isOpen && user) {
      fetchLeads();
    }
  }, [isOpen, user, fetchLeads]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const token = await getFreshToken();
      const response = await fetch(`/api/leads/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setLeads((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch {
      setError("Não foi possível atualizar o status.");
    }
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
        {/* Header */}
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

          <div className="flex items-center gap-3">
            {user && (
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
              aria-label="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!user ? (
            <div className="py-12 max-w-md mx-auto text-center space-y-5">
              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-[#0B3C7A]">
                  Acesso restrito ao Especialista
                </h3>
                <p className="text-sm text-slate-600">
                  Autentique-se com sua conta Google para consultar e gerenciar todas as análises enviadas pelos visitantes do site.
                </p>
              </div>

              {error && (
                <p className="text-xs text-red-600 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </p>
              )}

              <button
                type="button"
                onClick={async () => {
                  try {
                    setError("");
                    await signInWithGoogle();
                  } catch {
                    setError("Não foi possível concluir o login com o Google.");
                  }
                }}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0B3C7A] hover:bg-[#072854] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <LogIn className="w-4 h-4 text-[#00A859]" />
                <span>Entrar com Google</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-600">
                  Conectado como <strong className="text-slate-900">{user.email}</strong> ·{" "}
                  <span className="tabular-nums font-semibold text-[#0B3C7A]">
                    {leads.length}
                  </span>{" "}
                  {leads.length === 1 ? "análise registrada" : "análises registradas"}
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
                    Assim que um visitante enviar o formulário de qualificação no site, os dados aparecerão aqui.
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
                            {PROFILE_DISPLAY_LABELS[lead.perfil] || lead.perfil} · Prazo:{" "}
                            {lead.prazoDecisao || "Não informado"} ·{" "}
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
                            {Object.entries(STATUS_LABELS).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              )
                            )}
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
                                lead.possuiPlano &&
                                  `Possui: ${lead.possuiPlano}`,
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
                                lead.preocupacao &&
                                  `Foco: ${lead.preocupacao}`,
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
          )}
        </div>
      </div>
    </div>
  );
};
