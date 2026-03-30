/**
 * AI Matching Utilities
 *
 * Embedding model: Google text-embedding-004 (768 dims)
 *   — free tier via Google AI Studio, 1,500 requests/day.
 *
 * Match reason model: Gemini 2.0 Flash
 *   — warm, conversational model for "why you'd connect" blurbs.
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
// Embedding generation via Hugging Face Inference API
// Model: sentence-transformers/all-MiniLM-L6-v2 (384-dimensional vectors)
// Uses the /models/ endpoint which is still available on the free tier.
// ---------------------------------------------------------------------------

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GROQ_API_KEY;

  // If no API key available, fall back to a simple bag-of-words hash vector
  if (!apiKey) {
    console.warn("[matching] No GROQ_API_KEY — using fallback hash embedding");
    return hashEmbedding(text, 384);
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
      {
        method: "POST",
        headers: {
          // Use HuggingFace key if present, otherwise skip auth (anonymous rate is lower)
          ...(process.env.HUGGINGFACE_API_KEY
            ? { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` }
            : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
      }
    );

    if (response.ok) {
      const data: number[] | number[][] = await response.json();
      return Array.isArray(data[0]) ? (data[0] as number[]) : (data as number[]);
    }
  } catch {
    // fall through to hash embedding
  }

  // Fallback: deterministic hash embedding so matching still works without API
  console.warn("[matching] Embedding API unavailable — using fallback hash embedding");
  return hashEmbedding(text, 384);
}

/** Simple deterministic hash-based embedding fallback (no API required). */
function hashEmbedding(text: string, dims: number): number[] {
  const vec = new Float64Array(dims);
  const words = text.toLowerCase().split(/\W+/);
  for (const word of words) {
    for (let i = 0; i < word.length; i++) {
      vec[(word.charCodeAt(i) * 31 + i * 17) % dims] += 1;
    }
  }
  // L2-normalise
  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return Array.from(vec).map((v) => v / mag);
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
