import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";
import {
  requireAuth,
  optionalAuth,
  AuthRequest,
} from "./src/middleware/auth.ts";
import {
  createQualifiedLeadRecord,
  listQualifiedLeads,
  updateQualifiedLeadStatus,
} from "./src/db/leads.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Registro de nova análise de qualificação comercial
  app.post("/api/leads", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const body = req.body || {};
      if (!body.nome || !body.whatsapp || !body.perfil) {
        return res.status(400).json({
          error: "Nome, WhatsApp e perfil são obrigatórios.",
        });
      }

      const created = await createQualifiedLeadRecord({
        userId: req.dbUserId ?? null,
        nome: String(body.nome),
        whatsapp: String(body.whatsapp),
        email: body.email ? String(body.email) : "",
        perfil: String(body.perfil),
        interesse: Array.isArray(body.interesse)
          ? body.interesse.map(String)
          : [String(body.interesse || "")],
        possui_plano: body.possui_plano ? String(body.possui_plano) : "",
        satisfacao: body.satisfacao ? String(body.satisfacao) : "",
        motivo_mudanca: body.motivo_mudanca ? String(body.motivo_mudanca) : "",
        quantidade_pessoas: body.quantidade_pessoas
          ? String(body.quantidade_pessoas)
          : "",
        cidade: body.cidade ? String(body.cidade) : "",
        tamanho_empresa: body.tamanho_empresa
          ? String(body.tamanho_empresa)
          : "",
        possui_beneficios: body.possui_beneficios
          ? String(body.possui_beneficios)
          : "",
        revisar_beneficios_atuais: body.revisar_beneficios_atuais
          ? String(body.revisar_beneficios_atuais)
          : "",
        desafio_empresa: body.desafio_empresa
          ? String(body.desafio_empresa)
          : "",
        tipo_seguro: body.tipo_seguro ? String(body.tipo_seguro) : "",
        possui_seguro: body.possui_seguro ? String(body.possui_seguro) : "",
        preocupacao: body.preocupacao ? String(body.preocupacao) : "",
        prazo_decisao: body.prazo_decisao ? String(body.prazo_decisao) : "",
        faixa_investimento: body.faixa_investimento
          ? String(body.faixa_investimento)
          : "",
      });

      res.status(201).json({ ok: true, id: created.id });
    } catch (error: any) {
      console.error("Failed to save lead:", error);
      res.status(500).json({
        error: error.message || "Não foi possível salvar sua análise.",
      });
    }
  });

  // Consulta de análises (protegida por autenticação Firebase)
  app.get("/api/leads", requireAuth, async (_req: AuthRequest, res) => {
    try {
      const leads = await listQualifiedLeads();
      res.json({ leads });
    } catch (error: any) {
      console.error("Failed to list leads:", error);
      res.status(500).json({
        error: error.message || "Não foi possível carregar os registros.",
      });
    }
  });

  // Atualização de status do lead pelo especialista
  app.patch(
    "/api/leads/:id/status",
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const { status } = req.body || {};
        const allowedStatuses = [
          "novo",
          "em_atendimento",
          "qualificado",
          "concluido",
        ];

        if (!id || !allowedStatuses.includes(status)) {
          return res.status(400).json({ error: "Dados de atualização inválidos." });
        }

        const updated = await updateQualifiedLeadStatus(id, status);
        res.json({ lead: updated });
      } catch (error: any) {
        console.error("Failed to update lead status:", error);
        res.status(500).json({
          error: error.message || "Erro ao atualizar status.",
        });
      }
    }
  );

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
