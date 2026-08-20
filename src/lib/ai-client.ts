import { museums } from "@/data/museums";

/**
 * Client-side AI image analysis using the Qwen vision model.
 *
 * Calls the OpenAI-compatible ModelHarbor API directly from the browser.
 * The API key is exposed in the client bundle (NEXT_PUBLIC_), which is
 * acceptable for this demo project. For production, proxy through a
 * server-side API route instead.
 */

const AI_BASE_URL = process.env.NEXT_PUBLIC_AI_BASE_URL;
const AI_API_KEY = process.env.NEXT_PUBLIC_AI_API_KEY;
const AI_MODEL = process.env.NEXT_PUBLIC_AI_MODEL ?? "qwen-latest";

const MAX_TOKENS = 1500;

// Build a compact museum reference list for the AI prompt.
const museumList = museums
  .map(
    (m) =>
      `- id: ${m.id} | EN: ${m.name_english} | TH: ${m.name_thai} | Province: ${m.province_english}`,
  )
  .join("\n");

export type Confidence = "high" | "medium" | "low" | "none";

export interface AnalysisResult {
  analysis: string;
  museumId: string | null;
  confidence: Confidence;
}

export function isAIConfigured(): boolean {
  return !!AI_BASE_URL && !!AI_API_KEY;
}

export async function analyzeMuseumPhoto(
  image: string,
  locale: "th" | "en",
): Promise<AnalysisResult> {
  if (!AI_BASE_URL || !AI_API_KEY) {
    throw new Error("AI is not configured. Set NEXT_PUBLIC_AI_BASE_URL and NEXT_PUBLIC_AI_API_KEY in .env.local");
  }

  if (!image.startsWith("data:image/")) {
    throw new Error("Image must be a base64 data URI");
  }

  const languageName = locale === "th" ? "Thai" : "English";

  const systemPrompt = `You are a knowledgeable museum guide assistant for museums in Thailand. A visitor has taken a photo at a museum. Analyze the image and try to identify which museum from the list below the photo is from.

Respond in ${languageName}.

You MUST respond with valid JSON only — no markdown, no code fences, no commentary outside the JSON. Use this exact structure:

{
  "analysis": "Your analysis text in ${languageName}. Structure: 1) What you see — brief description. 2) Identification — name the museum/artifact if recognized. 3) Interesting fact — one short engaging fact. Keep it 3-5 sentences total.",
  "museumId": "the-museum-id-from-the-list-or-null",
  "confidence": "high | medium | low | none"
}

Here is the list of known museums in our database:

${museumList}

Rules for museumId:
- Set museumId to the exact id from the list above if you can confidently identify the museum from the photo.
- Set museumId to null if you cannot match the photo to any museum in the list.
- Set confidence to "none" when museumId is null.
- Set confidence to "high" when you are certain, "medium" when likely, "low" when uncertain but best guess.

If the image is not clearly museum-related, set museumId to null and confidence to "none", and describe what you see in the analysis instead.`;

  const userPrompt = "Please analyze this museum photo and identify which museum it is from.";

  const payload = {
    model: AI_MODEL,
    max_tokens: MAX_TOKENS,
    chat_template_kwargs: { enable_thinking: false },
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          { type: "image_url", image_url: { url: image } },
        ],
      },
    ],
  };

  const response = await fetch(`${AI_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`AI service returned an error (${response.status})`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI returned no content. Try again with a different photo.");
  }

  return parseAIResponse(content);
}

function parseAIResponse(content: string): AnalysisResult {
  const trimmed = content.trim();

  // Try direct parse first.
  try {
    const json = JSON.parse(trimmed);
    return {
      analysis: String(json.analysis ?? "").trim(),
      museumId: validateMuseumId(json.museumId),
      confidence: (json.confidence ?? "none") as Confidence,
    };
  } catch {
    // Fall through to extraction.
  }

  // Try extracting JSON from code fences or embedded JSON.
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const json = JSON.parse(jsonMatch[0]);
      return {
        analysis: String(json.analysis ?? "").trim(),
        museumId: validateMuseumId(json.museumId),
        confidence: (json.confidence ?? "none") as Confidence,
      };
    } catch {
      // Fall through to fallback.
    }
  }

  // Fallback: treat the whole response as analysis text with no museum match.
  return {
    analysis: trimmed,
    museumId: null,
    confidence: "none" as Confidence,
  };
}

function validateMuseumId(id: string | null): string | null {
  if (!id || typeof id !== "string") return null;
  return museums.find((m) => m.id === id) ? id : null;
}
