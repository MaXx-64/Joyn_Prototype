# Joyn — Connect. Belong. Age with Joy.

> AI-powered connection platform pairing retired adults with compatible companions and workout partners.

**Live Demo**: [https://joyn-two.vercel.app](https://joyn-two.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15+ (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + Vanilla CSS |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Email & Google OAuth) |
| **AI / LLM** | Vercel AI SDK + Groq (`llama-3.1-8b-instant`) |
| **Embeddings** | Hugging Face (`sentence-transformers/all-MiniLM-L6-v2`) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- [Supabase](https://supabase.com/) project
- [Groq](https://console.groq.com/) API key
- [Hugging Face](https://huggingface.co/) API token

### Setup

```bash
git clone https://github.com/Rudheer127/Joyn.git
cd joyn
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GROQ_API_KEY=your-groq-api-key
HUGGINGFACE_API_KEY=your-hf-api-key
```

```bash
npx supabase db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

MIT License
