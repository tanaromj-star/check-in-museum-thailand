import { NextResponse } from "next/server";
import { museums } from "@/data/museums";

/**
 * Image analysis API route.
 *
 * Receives a base64-encoded image from the client, sends it to the Qwen vision
 * model (OpenAI-compatible API) along with the list of known museums in our
 * dataset, and returns:
 *   - a text analysis of what's in the photo
 *   - the ID of the matched museum (if the AI can identify it from our list)
 *
 * The API key stays server-side — it is never exposed to the browser.
 */

const AI_BASE_URL = process.env.AI_BASE_URL;
const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL ?? "qwen-latest";

// Reasoning model with thinking disabled — needs room for JSON + analysis.
const MAX_TOKENS = 1500;

// Build a compact museum reference list for the AI prompt.
// Only include id + names + province so the prompt stays small.
const museumList = museums
  .map(
    (m) =>
      `- id: ${m.id} | EN: ${m.name_english} | TH: ${m.name_thai} | Province: ${m.province_english}`,
  )
  .join("\n");

export async function POST(request: Request) {
  if (!AI_BASE_URL || !AI_API_KEY) {
    return NextResponse.json(
      { error: "AI is not configured. Set AI_BASE_URL and AI_API_KEY in .env.local" },
      { status: 503 },
    );
  }

  let body: { image?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { image, locale } = body;
  if (!image || typeof image !== "string") {
    return NextResponse.json({ error: "Image (base64 data URI) is required" }, { status: 400 });
  }

  // Validate that it's a data URI to prevent SSRF via external URLs.
  if (!image.startsWith("data:image/")) {
    return NextResponse.json({ error: "Image must be a base64 data URI" }, { status: 400 });
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
    // Disable the Qwen reasoning/thinking mode for direct responses.
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

  try {
    const response = await fetch(`${AI_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("AI API error:", response.status, errorText);
      return NextResponse.json(
        { error: `AI service returned an error (${response.status})` },
        { status: 502 },
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "AI returned no content. Try again with a different photo." },
        { status: 502 },
      );
    }

    // Parse the JSON response from the AI.
    const parsed = parseAIResponse(content);

    // Validate that the museumId (if present) exists in our dataset.
    let museumId: string | null = null;
    if (parsed.museumId) {
      const found = museums.find((m) => m.id === parsed.museumId);
      museumId = found ? parsed.museumId : null;
    }

    return NextResponse.json({
      analysis: parsed.analysis,
      museumId,
      confidence: parsed.confidence ?? (museumId ? "medium" : "none"),
    });
  } catch (error) {
    console.error("AI request failed:", error);
    return NextResponse.json(
      { error: "Could not reach the AI service. Please try again." },
      { status: 502 },
    );
  }
}

/**
 * Parse the AI's JSON response. The AI may wrap JSON in markdown code fences
 * or add extra text, so we extract the JSON block defensively.
 */
function parseAIResponse(content: string): {
  analysis: string;
  museumId: string | null;
  confidence: string;
} {
  const trimmed = content.trim();

  // Try direct parse first.
  try {
    const json = JSON.parse(trimmed);
    return {
      analysis: String(json.analysis ?? "").trim(),
      museumId: json.museumId ?? null,
      confidence: String(json.confidence ?? "none"),
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
        museumId: json.museumId ?? null,
        confidence: String(json.confidence ?? "none"),
      };
    } catch {
      // Fall through to fallback.
    }
  }

  // Fallback: treat the whole response as analysis text with no museum match.
  return {
    analysis: trimmed,
    museumId: null,
    confidence: "none",
  };
}
