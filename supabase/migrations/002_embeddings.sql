-- Add semantic embedding storage to profiles
-- Uses FLOAT8[] (native Postgres array) — no pgvector extension required.
-- Embeddings are 768-dimensional vectors from Google text-embedding-004.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS embedding FLOAT8[];

-- Track when the embedding was last generated so we can re-generate on profile updates.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS embedding_updated_at TIMESTAMPTZ;

-- Add AI-generated match reason to the matches table.
ALTER TABLE matches ADD COLUMN IF NOT EXISTS match_reason TEXT;

-- Allow authenticated users to update their own embedding.
CREATE POLICY IF NOT EXISTS "Users can update own embedding" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
