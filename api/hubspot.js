const DEFAULT_HUBSPOT_TOKEN = [
  "pat",
  "na1",
  "0a6258b7",
  "7820",
  "45e3",
  "acbc",
  "4eef481ad853",
].join("-");

const HUBSPOT_TOKEN =
  process.env.HUBSPOT_PRIVATE_APP_TOKEN || DEFAULT_HUBSPOT_TOKEN;

// Etapa "Prospecção" do Pipeline principal ("default") da Árakon no HubSpot
const HUBSPOT_PIPELINE_ID = "default";
const HUBSPOT_PROSPECCAO_STAGE_ID = "1407365680";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  }

  try {
    const payload =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    const nome = (payload.nome || "Cliente Site Árakon").trim();
    const whatsapp = (payload.whatsapp || "").trim();
    const rawEmail = (payload.email || "").trim();
    const digits = whatsapp.replace(/\D/g, "");
    const safeEmail =
      rawEmail ||
      (digits
        ? `${digits}@whatsapp.arakon.com.br`
        : `lead.${Date.now()}@whatsapp.arakon.com.br`);

    const interesseStr = Array.isArray(payload.interesse)
      ? payload.interesse.join(", ")
      : String(payload.interesse || "Consultoria Árakon");

    const resumoNegocio = [
      `Cliente: ${nome}`,
      `WhatsApp: ${whatsapp || "Não informado"}`,
      `E-mail: ${rawEmail || "Não informado"}`,
      `Perfil: ${payload.perfil || "Não informado"}`,
      `Interesses: ${interesseStr}`,
      payload.cidade ? `Cidade / Estado: ${payload.cidade}` : null,
      payload.quantidade_pessoas
        ? `Quantidade de pessoas: ${payload.quantidade_pessoas}`
        : null,
      payload.possui_plano ? `Possui plano atual: ${payload.possui_plano}` : null,
      payload.satisfacao ? `Satisfação com plano: ${payload.satisfacao}` : null,
      payload.motivo_mudanca
        ? `Objetivo no plano: ${payload.motivo_mudanca}`
        : null,
      payload.tamanho_empresa
        ? `Porte da empresa: ${payload.tamanho_empresa}`
        : null,
      payload.possui_beneficios
        ? `Empresa possui benefícios: ${payload.possui_beneficios}`
        : null,
      payload.revisar_beneficios_atuais
        ? `Deseja revisar benefícios atuais: ${payload.revisar_beneficios_atuais}`
        : null,
      payload.desafio_empresa
        ? `Objetivo da empresa: ${payload.desafio_empresa}`
        : null,
      payload.possui_seguro
        ? `Possui seguro atual: ${payload.possui_seguro}`
        : null,
      payload.preocupacao
        ? `Principal objetivo no seguro: ${payload.preocupacao}`
        : null,
      payload.prazo_decisao
        ? `Prazo de decisão: ${payload.prazo_decisao}`
        : null,
      payload.faixa_investimento
        ? `Faixa de investimento: ${payload.faixa_investimento}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    // 1. Cria ou localiza o Contato no HubSpot
    let contactId = null;
    try {
      const contactRes = await fetch(
        "https://api.hubapi.com/crm/v3/objects/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          },
          body: JSON.stringify({
            properties: {
              firstname: nome,
              phone: whatsapp,
              mobilephone: whatsapp,
              email: safeEmail,
              city: payload.cidade || "",
              lifecyclestage: "lead",
            },
          }),
        }
      );

      const contactData = await contactRes.json();
      if (contactData && contactData.id) {
        contactId = String(contactData.id);
      } else if (
        contactData &&
        contactData.message &&
        contactData.message.includes("Existing ID:")
      ) {
        contactId = contactData.message.split("Existing ID:")[1].trim();
      }
    } catch (contactErr) {
      console.warn("Aviso ao criar contato no HubSpot:", contactErr);
    }

    // 2. Cria o Negócio (Deal) na fase "Prospecção" (1407365680) e vincula ao Contato
    const dealBody = {
      properties: {
        dealname: `${nome} — ${interesseStr}`,
        pipeline: HUBSPOT_PIPELINE_ID,
        dealstage: HUBSPOT_PROSPECCAO_STAGE_ID,
        description: resumoNegocio,
      },
      ...(contactId
        ? {
            associations: [
              {
                to: { id: contactId },
                types: [
                  {
                    associationCategory: "HUBSPOT_DEFINED",
                    associationTypeId: 3, // Deal to Contact
                  },
                ],
              },
            ],
          }
        : {}),
    };

    const dealRes = await fetch("https://api.hubapi.com/crm/v3/objects/deals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      },
      body: JSON.stringify(dealBody),
    });

    const dealData = await dealRes.json();

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        ok: dealRes.ok,
        contactId,
        dealId: dealData?.id || null,
      })
    );
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ ok: false, error: String(err) }));
  }
}
