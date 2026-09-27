import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const qualifiedLeads = pgTable("qualified_leads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  nome: text("nome").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull().default(""),
  perfil: text("perfil").notNull(),
  interesse: text("interesse").notNull(),
  possuiPlano: text("possui_plano").notNull().default(""),
  satisfacao: text("satisfacao").notNull().default(""),
  motivoMudanca: text("motivo_mudanca").notNull().default(""),
  quantidadePessoas: text("quantidade_pessoas").notNull().default(""),
  cidade: text("cidade").notNull().default(""),
  tamanhoEmpresa: text("tamanho_empresa").notNull().default(""),
  possuiBeneficios: text("possui_beneficios").notNull().default(""),
  revisarBeneficiosAtuais: text("revisar_beneficios_atuais").notNull().default(""),
  desafioEmpresa: text("desafio_empresa").notNull().default(""),
  tipoSeguro: text("tipo_seguro").notNull().default(""),
  possuiSeguro: text("possui_seguro").notNull().default(""),
  preocupacao: text("preocupacao").notNull().default(""),
  prazoDecisao: text("prazo_decisao").notNull().default(""),
  faixaInvestimento: text("faixa_investimento").notNull().default(""),
  status: text("status").notNull().default("novo"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  leads: many(qualifiedLeads),
}));

export const qualifiedLeadsRelations = relations(qualifiedLeads, ({ one }) => ({
  user: one(users, {
    fields: [qualifiedLeads.userId],
    references: [users.id],
  }),
}));
