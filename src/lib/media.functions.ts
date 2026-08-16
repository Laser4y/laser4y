import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BRAND_PROMPT = [
  "Recorta o produto principal desta fotografia e coloca-o sobre um fundo de estúdio da marca Laser4y.",
  "O fundo deve ser preto profundo (#0D0D0D a #1A1A1A) com um leve gradiente radial dourado (#D4AF37 / #B8860B),",
  "uma subtil textura tecnológica e uma discreta luz dourada de contorno, mantendo um aspeto premium e minimalista.",
  "REGRAS OBRIGATÓRIAS: não alteres o produto de forma nenhuma — mantém exatamente a mesma forma, proporções, textura,",
  "materiais, gravações, texto e cores originais. Não recortes nem escondas qualquer parte do produto: tem de aparecer",
  "inteiro, centrado, nítido e em destaque, ocupando a maior parte do enquadramento. Não adiciones novos objetos,",
  "logótipos, marcas de água nem texto. Apenas o fundo é substituído; iluminação suave e sombra realista por baixo do produto.",
].join(" ");

export const processProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { dataUrl: string; fileName: string }) => {
    if (!input?.dataUrl?.startsWith("data:image/")) throw new Error("Imagem inválida");
    return input;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Sem permissões de administrador");

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Serviço de imagem indisponível");

    let finalDataUrl = data.dataUrl;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.1-flash-image",
          modalities: ["image", "text"],
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: BRAND_PROMPT },
                { type: "image_url", image_url: { url: data.dataUrl } },
              ],
            },
          ],
        }),
      });

      if (res.ok) {
        const json = (await res.json()) as {
          choices?: Array<{ message?: { images?: Array<{ image_url?: { url?: string } }> } }>;
        };
        const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        if (url?.startsWith("data:image/")) finalDataUrl = url;
      } else {
        console.error("AI image gateway error", res.status, await res.text());
      }
    } catch (err) {
      console.error("AI image gateway failure", err);
    }

    const [meta, base64] = finalDataUrl.split(",");
    const contentType = meta?.slice(5).split(";")[0] ?? "image/png";
    const ext = contentType.includes("jpeg") ? "jpg" : contentType.includes("webp") ? "webp" : "png";
    const bytes = Uint8Array.from(atob(base64 ?? ""), (c) => c.charCodeAt(0));

    const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 40);
    const path = `${Date.now()}-${safeName.replace(/\.[^.]+$/, "")}.${ext}`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage
      .from("produtos")
      .upload(path, bytes, { contentType, upsert: false });
    if (error) throw new Error(error.message);

    return { path, branded: finalDataUrl !== data.dataUrl };
  });
