# JOYN — Move Together. Age with Joy.

> Arizona's senior connection platform — pairing retired adults with compatible workout partners and building real friendships through consistent movement.

---

## The Problem

**1 in 3 seniors aged 50–80 feel isolated from others.**  
*(University of Michigan National Poll on Healthy Aging, 2023)*

Social isolation among older adults is a public health crisis. Research shows:
- Regular physical activity reduces dementia risk by **41–45%**
- Strong social connections improve survival odds by **50%**
- Yet most existing fitness apps are built for younger, tech-savvy users and ignore the social dimension entirely

Seniors in Arizona don't need another app that tracks steps — they need a **workout buddy and a friend**.

---

## The Solution

Joyn is a matchmaking platform built specifically for retired adults. We use AI to pair seniors with a compatible workout partner based on fitness level, shared interests, location, and preferred schedule — then give them the tools to move and connect consistently.

```
Tell us about yourself → Get matched → Move together → Build real friendship
```

---

## Features

| Feature | Description |
|---|---|
| 🤖 **AI Onboarding (Jo)** | A warm 3-minute conversational onboarding with Jo, Joyn's AI guide. No forms — just a friendly chat. |
| 🤝 **Smart Matching** | AI-powered semantic matching using embeddings. Paired by fitness level, interests, schedule, and connection preference. |
| 📹 **Virtual Sessions** | Chair yoga, stretching, walking, and light resistance — together on video call. No gym required. |
| 📅 **Streak Scheduler** | Built-in calendar with streaks, reminders, and milestone celebrations. |
| 📍 **Arizona Events** | Curated local events — walking groups, community classes, social gatherings — surfaced by AI. |
| 💬 **Jo Companion** | An always-available, empathetic AI companion for users who just want to chat. Safety-aware. |
| 🔐 **Secure Auth** | Email/password and magic link auth via Supabase. Session-aware routing. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + Vanilla CSS |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Auth** | Supabase Auth (SSR) |
| **AI / LLM** | [Vercel AI SDK](https://sdk.vercel.ai/) + Google Gemini API |
| **AI Model** | `gemini-2.0-flash` (free tier via Google AI Studio) |
| **Embeddings** | Semantic vector embeddings for profile matching |
| **Testing** | Vitest + Testing Library |
| **Fonts** | Epilogue (headings), Lexend (body) |

---

## Project Structure

```
joyn/
├── app/
│   ├── (app)/               # Authenticated app routes
│   │   ├── dashboard/       # Main user dashboard
│   │   ├── onboard/         # AI-guided onboarding chat (Jo)
│   │   ├── match/           # Match viewing & acceptance
│   │   ├── messages/        # Direct messaging
│   │   ├── sessions/        # Workout session scheduler
│   │   ├── events/          # Arizona events feed
│   │   └── profile/         # User profile editor
│   ├── (auth)/              # Sign-in / Sign-up pages
│   ├── api/
│   │   └── ai/
│   │       ├── chat/        # Onboarding AI route (Jo as guide)
│   │       ├── companion/   # Companion AI route (Jo as friend)
│   │       └── match/       # Matching & embedding API
│   ├── layout.tsx
│   └── page.tsx             # Public landing page
├── components/
│   ├── companion/           # CompanionWidget (floating chat)
│   ├── dashboard/           # Dashboard UI components
│   └── ui/                  # Shared UI primitives
├── lib/
│   ├── supabase/            # Supabase client (server + client)
│   └── utils.ts
├── supabase/                # DB migrations & schema
└── __tests__/               # Vitest unit tests
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com/) project
- A [Hugging Face](https://huggingface.co/) account with API token

### 1. Clone & Install

```bash
git clone https://github.com/your-username/joyn.git
cd joyn
npm install
```

### 2. Set Up Environment Variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini (free — get key at https://aistudio.google.com/apikey)
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
```

### 3. Run Database Migrations

Apply the Supabase migrations to set up your schema:

```bash
npx supabase db push
```

### 4. Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How the AI Matching Works

1. **Onboarding** — Jo (the AI) collects the user's name, city, fitness level, interests, age, connection preference, preferred exercise time, and health goals via conversation.
2. **Profile Save** — The collected data is saved to the `profiles` and `user_interests` tables in Supabase.
3. **Embedding** — A semantic vector embedding is generated from the user's profile and stored for similarity search.
4. **Matching** — When a user visits `/match`, the embedding is used to find the most compatible other users via cosine similarity — factoring in fitness level, interests, location, and schedule alignment.

---

## AI Safety — Jo Companion

The Jo Companion widget is designed with elderly user safety in mind:

- Responds at a Grade 6 reading level
- Limits responses to 2–3 sentences
- **Never** diagnoses medical conditions
- **Never** provides crisis counseling — instead gently redirects to 988 (Suicide & Crisis Lifeline) and trusted family if a user expresses serious distress
- Capped at 30-second response time to prevent hanging

---

## Running Tests

```bash
npm test
```

---

## Roadmap

- [ ] SMS reminders for scheduled sessions
- [ ] Volunteer matching with ASU students (intergenerational)
- [ ] Voice-based onboarding for low-vision users
- [ ] In-app video calling via Daily.co
- [ ] iOS/Android mobile apps

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

<p align="center">
  Built with 🌻 for Arizona's seniors.<br/>
  <em>Move Together. Age with Joy.</em>
</p>
