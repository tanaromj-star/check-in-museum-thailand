import { NextResponse } from "next/server";

/**
 * Image analysis API route.
 *
 * Receives a base64-encoded image from the client, sends it to the Qwen vision
 * model (OpenAI-compatible API) with a museum-guide prompt, and returns the
 * AI's analysis. The API key stays server-side — it is never exposed to the
 * browser.
 */

const AI_BASE_URL = process.env.AI_BASE_URL;
const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL ?? "qwen-latest";

// The Qwen model is a reasoning model. We disable thinking mode so it responds
// directly — faster, cheaper, and avoids spending the entire token budget on
// internal reasoning before producing content.
const MAX_TOKENS = 1000;

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

  const systemPrompt = `You are a knowledgeable museum guide assistant for museums in Thailand. A visitor has taken a photo at a museum. Analyze the image and tell them what you see.

Respond in ${languageName}.

Structure your response as:
1. **What you see** — a brief description of the main subject of the photo (artifact, exhibit, building, signage, etc.)
2. **Identification** — if you can identify the specific museum, artifact, or exhibit, name it. If not, describe the type (e.g. "a Buddhist sculpture", "a historical painting", "a museum interior").
3. **Interesting fact** — one short, engaging fact or piece of context about what's shown.

Keep the response concise (3-5 sentences total). If the image is not clearly museum-related, say so politely and describe what you see instead.`;

  const userPrompt = "Please analyze this museum photo.";

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

    return NextResponse.json({ analysis: content.trim() });
  } catch (error) {
    console.error("AI request failed:", error);
    return NextResponse.json(
      { error: "Could not reach the AI service. Please try again." },
      { status: 502 },
    );
  }
}
