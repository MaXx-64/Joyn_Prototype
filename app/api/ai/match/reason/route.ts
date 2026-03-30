/**
 * POST /api/ai/match/reason
 *
 * Generates a warm, personalised "Why you'd connect" blurb for a match pair
 * using Mistral-7B-Instruct-v0.3.
 *
 * Body: { matchName, matchAge, matchCity, matchFitness, matchInterests, matchBio }
 *
 * The current user's profile is fetched server-side from Supabase so we
 * never trust client-supplied profile data.
 */

import { huggingface } from "@ai-sdk/huggingface";
import { generateText } from "ai";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

const REASON_MODEL = huggingface("mistralai/Mistral-7B-Instruct-v0.3");

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Fetch the current user's profile from Supabase
  const { data: me } = await supabase
    .from("profiles")
    .select("full_name, age, city, fitness_level, user_interests(interests(name))")
    .eq("id", user.id)
    .single();

  const myName = me?.full_name ?? "You";
  const myInterests =
    (me?.user_interests as Array<{ interests: { name: string } }>)?.map(
      (ui) => ui.interests.name
    ) ?? [];
  const myFitness = me?.fitness_level ?? "beginner";

  const {
    matchName,
    matchAge,
    matchCity,
    matchFitness,
    matchInterests,
    matchBio,
  }: {
    matchName: string;
    matchAge: number;
    matchCity: string;
    matchFitness: string;
    matchInterests: string[];
    matchBio: string;
  } = await req.json();

  // Find shared interests for a more specific, warm reason
  const shared = (matchInterests ?? []).filter((i: string) =>
    myInterests.map((m) => m.toLowerCase()).includes(i.toLowerCase())
  );

  const sharedNote =
    shared.length > 0
      ? `You both enjoy ${shared.join(" and ")}.`
      : `You have complementary interests that could open doors to new activities.`;

  const prompt = `Write exactly 2 warm, friendly sentences explaining why ${myName} (fitness level: ${myFitness}) and ${matchName}, age ${matchAge} from ${matchCity}, Arizona (fitness level: ${matchFitness}) would connect well on Joyn, a social fitness app for retired adults.

About ${matchName}: "${matchBio}"
${sharedNote}

Rules:
- Start with "You and ${matchName}"
- Use simple, plain language (Grade 6 level)
- Be specific about at least one shared interest or compatible trait
- Warm and encouraging — like a friend introducing two people
- Exactly 2 sentences, no more`;

  const { text } = await generateText({
    model: REASON_MODEL,
    prompt,
    maxTokens: 120,
  });

  // Clean up any markdown or extra whitespace the model may produce
  const reason = text
    .replace(/\*\*/g, "")
    .replace(/^["']|["']$/g, "")
    .trim();

  return Response.json({ reason });
}
