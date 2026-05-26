import { GoogleGenAI } from "@google/genai";
import { KNOWLEDGE_BY_TOPIC } from "@/lib/chatbot-knowledge";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  messages: ChatMessage[];
  topicSlug: string;
  currentFilter?: string;
};

const TOPIC_NAMES: Record<string, string> = {
  history: "The Filtrona Story",
  "filter-types": "Filter Types & Performance",
};

const KNOWLEDGE_BASES: Record<string, string> = KNOWLEDGE_BY_TOPIC;

/* ── Models: prefer 2.5, fall back if not available ────────────── */
const PRIMARY_MODEL = "gemini-2.5-flash";
const FALLBACK_MODEL = "gemini-2.0-flash";

function buildSystemPrompt(topicSlug: string, currentFilter?: string): string {
  const topicName = TOPIC_NAMES[topicSlug] ?? topicSlug;
  const knowledge = KNOWLEDGE_BASES[topicSlug];

  let filterContext = "";
  if (currentFilter) {
    filterContext = `\n\nIMPORTANT CONTEXT: The learner is currently viewing the ${currentFilter} slide. Default to ${currentFilter}-specific answers unless they explicitly ask about another filter.`;
  }

  return `You are the Filtrona Academy Coach — an in-module learning assistant. You are currently helping a new employee learn about: ${topicName}.

Your knowledge for this topic:
${knowledge}
${filterContext}

How to respond:
- Be warm but concise. 2-4 sentences for most answers. Longer only when the question genuinely needs depth.
- Use specific facts from the knowledge base. If asked something the knowledge base doesn't cover, say so clearly and suggest what IS covered.
- When relevant, point to specific years or milestones the learner has seen in the module.
- Never invent facts. If unsure, say "I'm not sure — that's outside what I've been briefed on for this topic."
- You're talking to a NEW employee. Keep it accessible. Avoid jargon unless the learner uses it first.
- End answers naturally. No need to add follow-up questions every time.`;
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { messages, topicSlug, currentFilter } = body ?? {};

  if (!Array.isArray(messages) || typeof topicSlug !== "string") {
    return Response.json(
      { error: "Missing or invalid `messages` / `topicSlug`" },
      { status: 400 }
    );
  }

  if (!KNOWLEDGE_BASES[topicSlug]) {
    return Response.json({
      message:
        "For the prototype, I'm only briefed on **Filter Types & Performance** and **The Filtrona Story**. Once we expand the academy, I'll be able to coach across other topics too.",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "API key not configured" },
      { status: 503 }
    );
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = buildSystemPrompt(topicSlug, currentFilter);

  async function callModel(model: string) {
    return ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        maxOutputTokens: 600,
        temperature: 0.7,
      },
    });
  }

  try {
    let response;
    try {
      response = await callModel(PRIMARY_MODEL);
    } catch (primaryErr) {
      console.warn(
        `[chat] Primary model ${PRIMARY_MODEL} failed, falling back. Reason:`,
        primaryErr
      );
      response = await callModel(FALLBACK_MODEL);
    }

    const text = response.text?.trim();
    if (!text) {
      return Response.json(
        { error: "Empty response from model" },
        { status: 500 }
      );
    }

    return Response.json({ message: text });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown model error";
    console.error("[chat] Gemini call failed:", err);
    return Response.json({ error: message }, { status: 500 });
  }
}
