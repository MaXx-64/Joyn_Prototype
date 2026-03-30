/**
 * AI Matching Utilities
 *
 * Embedding model: sentence-transformers/all-MiniLM-L6-v2 (384 dims)
 *   — optimized for semantic similarity, fast, free on HuggingFace Inference API.
 *
 * Match reason model: mistralai/Mistral-7B-Instruct-v0.3
 *   — same warm, conversational model used for Jo companion.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProfileForEmbedding {
  full_name?: string | null;
  age?: number | null;
  city?: string | null;
  fitness_level?: string | null;
  health_goals?: string[] | null;
  bio?: string | null;
  interests?: string[];
}

export interface MatchCandidate {
  id: string;
  name: string;
  age: number;
  city: string;
  fitness: string;
  interests: string[];
  bio: string;
  initials: string;
  matchPct: number;
  phone?: string;
}

// ---------------------------------------------------------------------------
// Mock data — shown when no real Supabase profiles exist yet
// ---------------------------------------------------------------------------

export const MOCK_MATCHES: MatchCandidate[] = [
  {
    id: "1",
    name: "Margaret",
    age: 71,
    city: "Phoenix",
    fitness: "Beginner",
    interests: ["Chair Yoga", "Gardening", "Reading", "Walking"],
    bio: "Retired schoolteacher who loves being outdoors and staying active. I find chair yoga has really helped my flexibility and I'd love a partner to do morning sessions with.",
    initials: "MW",
    matchPct: 97,
    phone: "6025550101",
  },
  {
    id: "2",
    name: "Robert",
    age: 68,
    city: "Scottsdale",
    fitness: "Moderate",
    interests: ["Walking", "Music", "Cooking", "Photography"],
    bio: "Former engineer who retired three years ago. I walk 3 miles most mornings and play guitar in the evenings. Looking for a walking buddy to keep me accountable.",
    initials: "RJ",
    matchPct: 91,
    phone: "6025550202",
  },
  {
    id: "3",
    name: "Dorothy",
    age: 74,
    city: "Mesa",
    fitness: "Beginner",
    interests: ["Stretching", "Painting", "Birdwatching", "Gardening"],
    bio: "I moved to Mesa five years ago and am still building my social circle. I love watercolor painting and early morning birdwatching at Riparian Preserve.",
    initials: "DL",
    matchPct: 88,
    phone: "6025550303",
  },
];

export const MOCK_PROFILES: Record<string, MatchCandidate> = Object.fromEntries(
  MOCK_MATCHES.map((m) => [m.id, m])
);

// ---------------------------------------------------------------------------
// Profile text builder
// Converts structured profile data into a rich sentence for embedding.
// ---------------------------------------------------------------------------

export function buildProfileText(profile: ProfileForEmbedding): string {
  const parts: string[] = [];

  if (profile.full_name) parts.push(`${profile.full_name}`);
  if (profile.age) parts.push(`${profile.age} years old`);
  if (profile.city) parts.push(`from ${profile.city}, Arizona`);
  if (profile.fitness_level) parts.push(`fitness level: ${profile.fitness_level}`);
  if (profile.interests?.length) parts.push(`enjoys ${profile.interests.join(", ")}`);
  if (profile.health_goals?.length) parts.push(`health goals: ${profile.health_goals.join(", ")}`);
  if (profile.bio) parts.push(profile.bio);

  return parts.join(". ");
}

// ---------------------------------------------------------------------------
// Embedding generation via HuggingFace Inference API
// Model: sentence-transformers/all-MiniLM-L6-v2 (384-dimensional vectors)
// ---------------------------------------------------------------------------

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error("HUGGINGFACE_API_KEY is not set in environment variables.");

  const response = await fetch(
    "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        options: { wait_for_model: true },
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HuggingFace embedding API error ${response.status}: ${body}`);
  }

  const data: number[] | number[][] = await response.json();
  // Some HF models return [[...]] (batch), others return [...] (single)
  return Array.isArray(data[0]) ? (data[0] as number[]) : (data as number[]);
}

// ---------------------------------------------------------------------------
// Cosine similarity — range [0, 1], higher = more similar
// ---------------------------------------------------------------------------

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function profileInitials(fullName: string | null | undefined): string {
  if (!fullName) return "?";
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Scale a raw cosine similarity [0,1] to a display percentage clamped to [60,99] */
export function similarityToMatchPct(similarity: number): number {
  // Cosine similarity for real profiles is typically 0.6–0.95+.
  // We map it to a 60–99 range so the display is always encouraging.
  const scaled = Math.round(60 + similarity * 39);
  return Math.min(99, Math.max(60, scaled));
}
