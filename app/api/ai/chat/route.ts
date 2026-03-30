import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, UIMessage } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rl = checkRateLimit(getClientIp(req));
    if (!rl.allowed) {
      return NextResponse.json({ error: rl.reason }, {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfter) },
      });
    }

    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      system: `You are Jo, a warm and friendly onboarding assistant for Joyn — a matchmaking and virtual fitness platform for retired adults in Arizona.

Your goal is to collect the following information through natural conversation (3-4 exchanges total):
1. Their name and which Arizona city they live in
2. Their fitness level (Beginner / Moderate / Active) and what kind of activities they enjoy (chair yoga, walking, stretching, light resistance, gardening, cooking, reading, music, painting, etc.)
3. Their age and whether they want to connect with: people their own age, younger volunteers (like ASU students), or both
4. Their preferred time for exercise (morning/afternoon/evening) and any health goals

Be warm, encouraging, and use simple language. Elderly users are your audience. Keep responses short (2-3 sentences max). Use occasional gentle emojis 🌻. Do not ask multiple questions at once. When you have collected all information, say "Perfect! I have everything I need to find your ideal workout partner. Let me match you now! 🌻" and output a JSON block wrapped in <profile> tags with all the collected data.`,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[/api/ai/chat] Error:", err);
    return NextResponse.json(
      { error: "AI service unavailable. Please try again in a moment." },
      { status: 503 }
    );
  }
}
