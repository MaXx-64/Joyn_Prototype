# Joyn — Product Requirements Document

**Tagline**: Move Together. Age with Joy.
**Version**: 1.0 (MVP)
**Status**: Draft
**Last Updated**: 2026-03-28
**Submission Deadline**: March 31, 2026
**Competition**: ASU Principled Innovation Academy — Pitch Day, April 3, 2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Target Users / Personas](#3-target-users--personas)
4. [User Stories](#4-user-stories)
5. [Feature Requirements](#5-feature-requirements)
6. [User Flows](#6-user-flows)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Out of Scope (MVP)](#8-out-of-scope-mvp)
9. [Future Considerations](#9-future-considerations)
10. [Constraints](#10-constraints)

> **New in this version:** Section 5.9 (Virtual Workout Sessions) added for the Fitness Feature. Section 5.10 is the former 5.9 Safety Features, renumbered.

---

## 1. Overview

### Problem

Elderly loneliness is a public health crisis in Arizona. Approximately 1 in 5 Arizona residents is 65 or older, and this population is growing faster than available support infrastructure can accommodate. A significant and growing subset are "solo agers" — individuals who have outlived spouses, have no nearby family, and whose social circles have naturally contracted through retirement, mobility decline, and attrition.

Existing solutions fail this population in two key ways:

- **Institutional options** (nursing homes, senior centers, organized camps) carry real or perceived cost barriers, require transportation, and often feel clinical rather than social.
- **Digital platforms** (Facebook, Meetup, dating apps) are designed for different demographics, assume high digital literacy, and provide no guided experience for someone who has never used social software.

The result: lower-income, elderly Arizona residents have no accessible, friendly, and safe platform to find meaningful human connection.

### HMW Statement

> "How might we help lower-income retired senior citizens in Arizona feel less lonely and make more meaningful connections so they can have a greater quality of life?"

### Solution

**Joyn** is a matchmaking and virtual fitness platform that matches elderly Arizona residents with peers their own age and/or younger volunteers (primarily college-age) for both in-person social activities and guided virtual workout sessions. The core differentiators are:

1. **Conversational AI onboarding** — replaces intimidating forms with a friendly chatbot that collects interests, fitness ability, health goals, language, time zone, location, and preferences through natural dialogue.
2. **Smart matching** — surfaces compatible connections based on shared interests, fitness level, language, time zone, and stated preferences rather than keyword search.
3. **Virtual workout sessions** — guided on-screen video-call exercise sessions (chair yoga, stretching, light resistance, walking) that matched partners schedule and join together.
4. **Session scheduler & streak tracking** — built-in calendar for recurring sessions, reminders, and consecutive-week activity streaks to build healthy habits.
5. **AI event discovery** — automatically surfaces local Arizona events and resources relevant to each user's interests, eliminating the need to search.
6. **Radical accessibility** — large text, high contrast, minimal navigation, and a design philosophy optimized for users who may be using a smartphone or tablet for the first time.
7. **Zero cost barrier** — the platform is free to use.

### Scope

MVP covers authenticated user accounts, AI conversational onboarding (including fitness ability, health goals, language, and time zone collection), profile creation, smart match discovery, virtual workout sessions via embedded video call, session scheduling, streak tracking, AI-curated local event surfacing, and direct contact initiation (SMS/phone/video). The platform is geographically restricted to Arizona for the MVP.

---

## 2. Goals & Success Metrics

### Primary Goal

Demonstrate that an accessible, AI-assisted matchmaking and virtual fitness platform can meaningfully reduce social isolation for elderly Arizonans by facilitating real connections — both virtual workout sessions and in-person activities.

### Goals by Stakeholder

| Stakeholder | Goal |
|---|---|
| Elder users | Find at least one meaningful social connection within 1 week of joining |
| Young volunteers | Discover and connect with elderly individuals to spend time with easily and safely |
| Joyn (competition) | Ship a working, demonstrable MVP by March 31, 2026; win or place at ASU Pitch Day |
| Society | Measurably reduce reported loneliness in the user base |

### Success Metrics (MVP / Pitch Window)

| Metric | Target | Measurement Method |
|---|---|---|
| Onboarding completion rate | > 80% of users who start onboarding finish it | Supabase event log |
| Time to first match displayed | < 60 seconds after onboarding completes | Client-side performance trace |
| Match contact initiation rate | > 40% of users tap a contact button within first session | Supabase event log |
| Reported connection rate (survey) | > 30% of matched pairs report an in-person meeting | Post-match survey (future) |
| Accessibility audit score | WCAG 2.1 AA pass on all core pages | Automated + manual audit |
| Platform uptime | 99.9% during pitch demo window | Vercel uptime monitor |

---

## 3. Target Users / Personas

### Persona 1 — Margaret, 72 ("Maggie")

| Field | Detail |
|---|---|
| Age | 72 |
| Location | Mesa, Arizona |
| Income | Fixed Social Security income (~$1,400/mo) |
| Living situation | Lives alone in a 1-bedroom apartment; her husband passed two years ago |
| Tech literacy | Low. Has a Samsung Android tablet she uses for Facebook and YouTube. Never used a "sign-up" form before. |
| Transportation | Does not drive; relies on the local bus or rides from neighbors |
| Health | Arthritis in both hands; wears reading glasses; hard of hearing in one ear |

**Pain Points**
- Feels invisible and forgotten since retiring and losing her husband.
- Intimidated by apps that require her to fill out long forms or remember passwords.
- Afraid of scams — deeply distrustful of giving personal information online.
- Most of her friends have either moved away or are in assisted living.

**Goals**
- Find someone to take a walk with or play cards with once or twice a week.
- Feel like a person with a personality and interests, not just an elderly person.
- Have a way to meet people that feels safe and human.

**How Joyn Helps**
- The AI onboarding chatbot removes forms entirely — she just types (or speaks) as if talking to someone.
- Large text and minimal interface reduce friction.
- Email verification and emergency contact field address her safety concerns.
- Match cards show real shared interests (e.g., "You both love gardening and old westerns").

---

### Persona 2 — Derek, 21 ("ASU Junior")

| Field | Detail |
|---|---|
| Age | 21 |
| Location | Tempe, Arizona |
| Student | Junior at Arizona State University, majoring in Social Work |
| Income | Part-time barista; lives with two roommates |
| Tech literacy | High. Uses Instagram, Snapchat, Discord daily. |
| Motivation | Wants genuine volunteer experience; genuinely enjoys talking to older generations; feels current apps don't cater to this type of connection |

**Pain Points**
- Can't find a structured, trustworthy way to connect with elderly individuals outside institutional volunteering.
- Doesn't want to go through weeks of orientation for a volunteer program just to spend an afternoon with someone.
- Concerned about safety of meeting strangers — wants some form of verification.

**Goals**
- Quickly find a nearby elderly person who shares his interests (hiking, cooking, chess) to hang out with.
- Feel confident the other person is real and verified.
- Make a recurring social connection that is lightweight and flexible.

**How Joyn Helps**
- AI matching shows him compatible elder users near Tempe.
- Email verification confirms both parties are real.
- Match profile shows shared interests prominently, making conversations easy to start.
- Contact options (SMS / phone / video call) let him initiate on his terms.

---

### Persona 3 — Eleanor, 68 ("Ellie")

| Field | Detail |
|---|---|
| Age | 68 |
| Location | Phoenix, Arizona |
| Background | Recently retired nurse; active, independent, no children |
| Tech literacy | Moderate. Uses email and Google, occasionally shops online. |
| Income | Modest pension; no financial hardship but not wealthy |

**Pain Points**
- Retired colleagues scattered across the country; professional identity is gone.
- Doesn't want to join a senior center — "I'm not there yet."
- Wants connections with both peers AND younger people who can introduce her to new things.

**Goals**
- Find people to explore Phoenix art galleries and farmers markets with.
- Connect with younger volunteers who bring energy and new perspectives.
- Be treated as a full person with opinions and interests.

**How Joyn Helps**
- Her age preference ("both same age and younger") is respected in matching.
- AI event discovery surfaces Phoenix gallery openings and farmer markets automatically.
- Profile and interests are front and center, not her age.

---

## 4. User Stories

### Elder User Stories

| # | Story | Acceptance Criteria |
|---|---|---|
| US-01 | As an elder user, I want to be onboarded through a conversation rather than a form, so that I don't feel overwhelmed or confused by technology. | Onboarding collects all required profile fields via chatbot; no traditional form fields are required. |
| US-02 | As an elder user, I want to see a list of people who share my interests, so that I can choose who I want to meet. | Dashboard shows at least 3 AI-matched profiles with shared interests highlighted. |
| US-03 | As an elder user, I want to contact a match via SMS or phone call, so that I can reach them in the way I'm most comfortable. | Match profile page shows SMS and phone call buttons that initiate contact with one tap. |
| US-04 | As an elder user, I want to see local events happening near me in Arizona, so that I have ideas for activities to do with my matches. | Events page shows at least 5 locally relevant events; events are filtered to the user's Arizona location. |
| US-05 | As an elder user, I want to add an emergency contact to my profile, so that my family or caregiver is aware I'm using the platform. | Profile page includes an optional emergency contact name and phone number field, stored securely. |
| US-06 | As an elder user, I want to block or report a match I feel uncomfortable with, so that I can use the platform without fear. | Match profile includes a visible "Report / Block" option; blocked users do not appear in future matches. |

### Young Volunteer Stories

| # | Story | Acceptance Criteria |
|---|---|---|
| US-07 | As a young volunteer, I want to browse AI-matched elder users near me, so that I can find someone compatible to spend time with. | Dashboard shows matched elder profiles with distance (city/area) and shared interests. |
| US-08 | As a young volunteer, I want to view a match's full profile before contacting them, so that I can prepare a good first conversation. | Match profile page shows name, age, interests, preferred activities, and connection preferences. |
| US-09 | As a young volunteer, I want to sign up and get verified quickly, so that I can start connecting without a long approval process. | Email verification flow completes in under 5 minutes; user can access dashboard immediately after verification. |
| US-10 | As a young volunteer, I want to indicate my preferred age group for connections, so that my matches reflect my actual preferences. | Onboarding and profile allow selection of "same age," "older," or "both"; matching algorithm respects this. |

### Both User Types

| # | Story | Acceptance Criteria |
|---|---|---|
| US-11 | As any user, I want my profile photo to appear on my profile, so that potential matches can recognize me before meeting in person. | Profile supports photo upload; photo appears on both own profile page and match cards. |
| US-12 | As any user, I want to edit my profile after onboarding, so that I can update my interests and preferences as they change. | `/profile` page allows editing of all fields; changes are reflected in future match results. |

---

## 5. Feature Requirements

### MoSCoW Key

| Label | Definition |
|---|---|
| **Must** | Required for MVP; platform does not function without it |
| **Should** | High value; include if time allows before deadline |
| **Could** | Nice to have; include only if scope is clearly under budget |
| **Won't** | Explicitly out of scope for MVP |

---

### 5.1 Landing Page (`/`)

| Requirement | Priority | Notes |
|---|---|---|
| Hero section with tagline and single primary CTA ("Get Started" → `/sign-up`) | Must | |
| Brief, plain-language explanation of what Joyn does | Must | Target reading level: Grade 6 |
| Minimum font size 18px throughout; 24px+ for body copy | Must | Accessibility requirement |
| High contrast color palette meeting WCAG AA (4.5:1 ratio minimum) | Must | |
| Responsive layout for mobile, tablet, and desktop | Must | Primary device for elder users expected to be tablet |
| Secondary CTA for volunteers (differentiate elder vs. volunteer paths) | Should | |
| Testimonials or social proof section | Could | Placeholder for demo |
| Video explainer | Won't | Out of scope for MVP |

---

### 5.2 Authentication (`/sign-up`, `/sign-in`)

| Requirement | Priority | Notes |
|---|---|---|
| Email + password sign-up via Supabase Auth | Must | |
| Email verification link sent on sign-up; account inactive until verified | Must | Safety layer; prevents anonymous/throwaway accounts |
| Password reset via email | Must | |
| "Forgot password" link visible on sign-in page | Must | |
| Error messages in plain language (avoid "422 Unprocessable Entity") | Must | |
| Redirect to `/onboard` on first login after verification | Must | |
| Redirect to `/dashboard` on subsequent logins | Must | |
| OAuth (Google/Apple) sign-in | Won't | Reduces friction but adds complexity; deprioritized |
| Phone/SMS OTP sign-in | Won't | Future safety improvement |

---

### 5.3 AI Onboarding Chatbot (`/onboard`)

| Requirement | Priority | Notes |
|---|---|---|
| Conversational UI powered by Vercel AI SDK v6 + AI Gateway | Must | Uses AI Elements chatbot component |
| Collects: full name, age, location (Arizona city/region), interests (min 3), connection preference (same age / younger / both) | Must | Stored to Supabase `profiles` table |
| Collects: fitness ability (beginner / moderate / active), health goals, preferred language, time zone | Must | Stored to `profiles` table; used for smart matching |
| Collects: emergency contact name and phone (optional) | Should | Can be set later on `/profile` |
| Natural language parsing — user does not see a form | Must | AI extracts structured data from conversational input |
| Confirmation step — bot summarizes collected info before saving | Must | User must confirm before profile is written |
| Graceful fallback — if AI fails to parse, asks clarifying question rather than showing an error | Must | |
| Chatbot persona is warm, patient, and explicitly unhurried | Must | Tone is defined in system prompt |
| Supports multi-turn correction ("actually, I meant Phoenix not Tucson") | Must | |
| Onboarding skippable / resumable | Should | Save partial state; allow user to complete later |
| Voice input support | Won't | Considered for post-MVP |

---

### 5.4 Profile (`/profile`)

| Requirement | Priority | Notes |
|---|---|---|
| Displays and allows editing of: name, age, interests, connection preference, location, fitness level, health goals, language, time zone | Must | |
| Profile photo upload (stored in Supabase Storage) | Should | Fallback to generated initials avatar if no photo |
| Emergency contact name + phone field | Should | |
| Account deletion option | Must | Privacy/legal requirement; GDPR-aligned best practice |
| Profile visibility toggle (pause matching) | Could | |
| Two-factor authentication setup | Won't | Post-MVP |

---

### 5.5 AI Matching

| Requirement | Priority | Notes |
|---|---|---|
| Match algorithm considers: shared interests, connection preference (age group), geographic proximity (same AZ region), fitness level, language, and time zone | Must | Implemented server-side via Vercel AI SDK |
| Matches are generated server-side and stored/cached; not computed on every page load | Must | Performance and cost requirement |
| Match results refreshed when profile is updated | Must | |
| Each match card displays: photo/avatar, name, age, shared interests (highlighted), city/region | Must | |
| Minimum 3 match results shown; "No matches yet" state handled gracefully | Must | |
| Matching respects connection preference bidirectionally (elder wants younger + volunteer wants older) | Must | |
| Match scoring explanation visible to user ("You both love hiking and cooking") | Should | Builds trust in recommendations |
| Manual "not interested" / dismiss on match card | Should | Dismissed matches don't re-appear |
| Re-run matching on demand ("Find more matches" button) | Could | Throttled to prevent API abuse |

---

### 5.6 AI Event Discovery (`/events`)

| Requirement | Priority | Notes |
|---|---|---|
| Surfaces Arizona-local events relevant to user's interests | Must | Scraped/fetched via AI-assisted search or third-party API |
| Events displayed with: title, date, location, brief description, link | Must | |
| Filtered to user's Arizona city/region by default | Must | |
| "Browse all Arizona events" option | Should | |
| Events refreshed periodically (at minimum daily) | Should | Cron job or on-demand fetch |
| User can save/bookmark events | Could | |
| Integration with Eventbrite, Meetup, or AZ government event APIs | Could | Fallback to AI-assisted web search if no API access |
| In-app RSVP or ticketing | Won't | External link is sufficient |

---

### 5.7 Match Dashboard (`/dashboard`)

| Requirement | Priority | Notes |
|---|---|---|
| Two-section layout: "Your Matches" + "Events Near You" | Must | Primary hub after login |
| Match cards are tappable → navigate to `/match/[id]` | Must | |
| Event cards are tappable → navigate to `/events` or external link | Must | |
| Empty state for new users with prompt to complete profile | Must | |
| Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop) | Must | |
| Loading skeleton states while data fetches | Should | Prevents layout shift |
| Notification badge for new matches | Could | |

---

### 5.8 Match Profile View (`/match/[id]`)

| Requirement | Priority | Notes |
|---|---|---|
| Displays full match profile: photo/avatar, name, age, location, interests | Must | |
| Shared interests with current user highlighted | Must | |
| SMS contact button (opens native SMS with pre-filled opener) | Must | Uses `sms:` URI scheme |
| Phone call button (opens native dialer) | Must | Uses `tel:` URI scheme |
| Video call option (link to Zoom/FaceTime/Google Meet — user-configured or suggested) | Should | External link; no in-app video for MVP |
| Report / Block button visible at all times | Must | |
| "Back to Dashboard" navigation | Must | |
| Match's emergency contact is NOT visible to other users | Must | Privacy requirement |

---

### 5.9 Virtual Workout Sessions (`/sessions`, `/workout/[sessionId]`)

| Requirement | Priority | Notes |
|---|---|---|
| `/sessions` page: lists upcoming scheduled workout sessions; allows scheduling new ones | Must | Authenticated users only |
| `/workout/[sessionId]` page: displays the active workout routine card + embedded video call | Must | Daily.co embedded or simple Jitsi iframe for prototype |
| Guided routine cards displayed during sessions (chair yoga, stretching, light resistance, walking) | Must | Static data from `routines` table for prototype |
| Partners schedule recurring sessions; get reminders | Should | Built-in session scheduler with notification prompts |
| Streak tracking: consecutive weeks of activity displayed on profile and dashboard | Must | `streak_count` field on `profiles` table; updated server-side after session completion |
| Session status transitions: scheduled → completed / cancelled | Must | Stored in `sessions` table |
| Group classes (3–6 person sessions) | Won't | Out of scope for MVP; noted as future feature |

---

### 5.10 Safety Features

| Requirement | Priority | Notes |
|---|---|---|
| Email verification required before accessing any authenticated route | Must | |
| Report functionality: user submits report → stored in Supabase for admin review | Must | |
| Block functionality: blocked user disappears from matches and cannot contact blocker | Must | |
| Emergency contact field on profile (private; visible only to account owner) | Should | |
| Row Level Security (RLS) on all Supabase tables | Must | No user can read another user's private data |
| Rate limiting on AI endpoints | Must | Prevent abuse and cost overruns |
| No phone numbers or personal contact info exposed until user actively taps contact button | Must | |

---

## 6. User Flows

### 6.1 New User Onboarding Flow

```
Landing Page (/)
  └─► Sign Up (/sign-up)
        Enter email + password
        └─► Email Verification Sent
              Check email → click verification link
              └─► Redirect to /onboard
                    AI Chatbot conversation begins
                    Bot collects: name, age, location, interests, connection preference
                    Bot summarizes → user confirms
                    └─► Profile saved to Supabase
                          Redirect to /dashboard
                          First-time matches + events displayed
```

**Edge Cases**
- User closes browser before onboarding completes: session is preserved; user is redirected back to `/onboard` on next login.
- AI fails to parse a response: bot asks a follow-up clarifying question (max 2 retries before offering a simplified input prompt).
- User skips optional emergency contact: field is left null; user is reminded once on `/profile`.

---

### 6.2 Returning User — Finding and Contacting a Match

```
Sign In (/sign-in)
  └─► Dashboard (/dashboard)
        Browse match cards (AI-matched)
        └─► Tap a match card
              Match Profile View (/match/[id])
              View shared interests, photo, location
              └─► Tap "Send SMS"
                    Native SMS app opens with pre-filled message
                    User sends message
                    └─► Out-of-band communication begins (SMS/phone)
                          Arrange in-person meeting
```

**Edge Cases**
- No matches yet: empty state with message "We're finding people for you — check back soon" + link to complete/update profile.
- Match has been blocked by current user: does not appear in match list.

---

### 6.3 Browsing Events

```
Dashboard (/dashboard)
  └─► "See All Events" link
        Events Page (/events)
        Events filtered to user's Arizona city
        └─► Tap event card
              External link opens in new tab
              User explores event details / registers externally
```

---

### 6.4 Blocking or Reporting a User

```
Match Profile View (/match/[id])
  └─► Tap "Report / Block"
        Modal appears with two options:
        [Report this person] — submits report to admin queue
        [Block this person] — removes from matches immediately
        └─► Confirmation shown
              Blocked: user removed from matches, cannot contact you
              Reported: "Thank you — our team will review within 24 hours"
```

---

### 6.5 Scheduling and Joining a Virtual Workout Session

```
Dashboard (/dashboard)
  └─► "Sessions" link → Sessions Page (/sessions)
        View upcoming sessions or schedule a new one
        └─► "Schedule Session" button
              Select partner, routine, date/time
              └─► Session saved to Supabase `sessions` table
                    Both users receive reminder
                    └─► At session time: "Join Workout" button
                          Workout Page (/workout/[sessionId])
                          Routine card displayed (exercise instructions)
                          Video call embed (Daily.co / Jitsi) loads
                          └─► Session marked "completed" on exit
                                Streak count updated for both users
```

**Edge Cases**
- Partner cancels: session status set to 'cancelled'; remaining user notified.
- Video call fails to load: show fallback message with external video call link.

---

### 6.6 Editing Your Profile

```
Dashboard or any page
  └─► Navigate to /profile
        Edit fields: name, age, interests, location, connection preference,
                     fitness level, health goals, language, time zone, emergency contact
        Upload/change profile photo
        └─► Save Changes
              Profile updated in Supabase
              Matching re-runs with updated preferences
              User returned to /dashboard with refreshed matches
```

---

## 7. Non-Functional Requirements

### 7.1 Accessibility (WCAG 2.1 AA)

| Requirement | Standard | Implementation Notes |
|---|---|---|
| Minimum color contrast ratio | 4.5:1 (normal text), 3:1 (large text) | Enforced via Tailwind config + design tokens |
| Minimum body font size | 18px (desktop), 16px (mobile minimum) | Override Tailwind defaults |
| All interactive elements keyboard-navigable | WCAG 2.1 SC 2.1.1 | Tab order audited on all pages |
| All images have descriptive alt text | WCAG 2.1 SC 1.1.1 | Enforced in code review |
| Form fields have visible labels (not just placeholder text) | WCAG 2.1 SC 1.3.1 | Labels never removed post-onboarding |
| Error messages are programmatically associated with fields | WCAG 2.1 SC 3.3.1 | `aria-describedby` on all form errors |
| Focus indicators are always visible | WCAG 2.1 SC 2.4.7 | Never `outline: none` without replacement |
| Touch targets minimum 44x44px | WCAG 2.5.5 | Especially contact buttons on match profile |
| Page structure uses semantic HTML landmarks | WCAG 2.1 SC 1.3.1 | `<main>`, `<nav>`, `<header>`, `<footer>` |

### 7.2 Performance

| Requirement | Target | Notes |
|---|---|---|
| Largest Contentful Paint (LCP) | < 2.5s on 4G mobile | Core Web Vital |
| First Input Delay (FID) / INP | < 200ms | Core Web Vital |
| Cumulative Layout Shift (CLS) | < 0.1 | Skeleton loaders required on async content |
| Time to Interactive (TTI) | < 3.5s | |
| AI chatbot first token | < 1s | Streaming response required; no full-response wait |
| Bundle size (JS) | < 250KB initial (gzipped) | Next.js code splitting + lazy loading |

### 7.3 Security

| Requirement | Implementation |
|---|---|
| All authenticated routes protected by middleware | Next.js middleware checks Supabase session; redirects to `/sign-in` |
| Row Level Security on all Supabase tables | RLS policies: users can only read/write their own rows except public profile fields |
| Supabase keys never exposed client-side (service role key) | Service role key server-only; anon key used client-side |
| AI prompts validated and sanitized | System prompt injection prevention; user input passed as user turn only |
| Rate limiting on `/api/*` routes | Vercel Edge Config or upstash/ratelimit |
| Personal contact information (phone numbers) not stored in match-readable fields | Phone stored server-side; only revealed via client-side `tel:` link after tap |
| HTTPS enforced | Vercel default; no HTTP fallback |
| Dependency audit | `npm audit` run before deployment |

### 7.4 Privacy

| Requirement | Notes |
|---|---|
| Emergency contact data is private; never returned in match queries | RLS policy + API response filtering |
| Users can delete their account and all associated data | Implemented via Supabase RPC with cascade delete |
| No personal data sold or shared with third parties | Terms of Service to reflect this |
| AI conversation data: user messages may be sent to LLM provider | Disclosed in onboarding; no PII in system prompt |
| Profile photos stored in private Supabase Storage bucket with signed URLs | Photos not publicly guessable by URL |

### 7.5 Reliability & Availability

| Requirement | Target |
|---|---|
| Uptime (Vercel-hosted) | 99.9% |
| Supabase free-tier limits respected | Monitor DB connections; connection pooling via Supabase pooler |
| AI API fallback | If AI Gateway fails, graceful error message; no silent failure |
| Graceful degradation on event scraping failure | Show cached events or "events unavailable" message |

---

## 8. Out of Scope (MVP)

The following items are explicitly not being built for the March 31 MVP:

| Feature | Reason |
|---|---|
| In-app messaging / chat | Adds moderation complexity; SMS/phone is simpler and more accessible to elder users |
| In-app video calling (general) | Embedded video for workout sessions is in scope via Daily.co/Jitsi; general video chat outside sessions is out of scope |
| Group fitness classes (3–6 person) | High scheduling complexity; noted as future feature post-MVP |
| Native iOS / Android app | Web-first is sufficient for demo; app store deployment is weeks of additional work |
| Push notifications | Requires native app or PWA service worker; out of time scope |
| Admin moderation dashboard | Report queue exists in DB; manual review acceptable for MVP scale |
| Paid tiers / monetization | Platform must be free; business model is post-competition scope |
| Multi-state support (beyond Arizona) | Geographic focus is core to the problem statement |
| OAuth / social sign-in (Google, Apple) | Reduces friction but not required for MVP; adds auth complexity |
| Voice input in chatbot | Technically feasible but time-prohibitive for March 31 deadline |
| Multilingual support | Spanish-language support is important long-term but not MVP |
| Background checks for volunteers | Logistically complex; out of platform scope; handled via safety features |
| In-app event RSVP | External links are sufficient |
| User reviews / ratings of matches | Privacy and safety concerns require careful design; post-MVP |

---

## 9. Future Considerations

These are validated ideas to explore post-MVP and/or post-competition:

### 9.1 Short-Term (0–3 months post-MVP)

- **Admin moderation dashboard** — Review reported users, manage blocks, monitor platform health.
- **Push notifications (PWA)** — Notify users of new matches or event reminders.
- **Spanish language support** — Significant portion of Arizona's elderly population is Spanish-speaking.
- **Onboarding voice input** — Allow elder users to speak responses to the chatbot rather than type.
- **Improved event sourcing** — Integrate Eventbrite, AZ Commission on the Arts, city parks and rec APIs for richer event data.

### 9.2 Medium-Term (3–9 months)

- **Native mobile apps (iOS + Android)** — Enable push notifications, camera access, and better accessibility integration with OS-level settings.
- **Group fitness classes (3–6 persons)** — Optional small-group virtual workout sessions for compatible matched users.
- **Activity group matching** — Match groups of 3–5 people for shared outings (e.g., "Tuesday Hikers" group).
- **Expanded fitness routines library** — Dynamic routines library with video demonstrations, difficulty progression, and user-requested categories.
- **Volunteer recognition** — Non-monetary recognition for young volunteers (e.g., volunteer hours log, shareable badge for LinkedIn).
- **Family portal** — Allow a family member or caregiver to co-manage an elder's profile, add emergency contacts, and review matches with consent.
- **Post-meeting check-in** — Simple "Did you meet up?" or "Did you work out?" survey that feeds into match quality scoring.

### 9.3 Long-Term (9+ months)

- **Expansion beyond Arizona** — Partner with senior advocacy organizations in other states to scale the platform.
- **Partnerships with healthcare systems** — Social connection as a preventive health metric; potential integration with care plans.
- **Multi-language support** — Spanish, Mandarin, and other languages relevant to Arizona's elderly demographic.
- **AI-generated activity suggestions** — Not just events, but specific activity ideas personalized to a matched pair's shared interests.
- **Subsidized transportation integration** — Partner with AZ transit or rideshare providers to remove the final barrier to in-person connection.

---

## 10. Constraints

### 10.1 Timeline

| Milestone | Date |
|---|---|
| MVP code complete | March 31, 2026 |
| Final submission to ASU Principled Innovation Academy | March 31, 2026 |
| Pitch Day demo | April 3, 2026 |
| Available development time from today | ~3 days |

This is an extremely compressed timeline. All "Must" requirements are scoped to be achievable in 3 days by a small team. "Should" requirements are stretch goals. Any "Could" items require explicit team agreement before starting.

### 10.2 Geographic Scope

- The platform is **Arizona-only** for MVP.
- Location collection during onboarding is restricted to Arizona cities and regions.
- Event discovery surfaces only Arizona-based events.
- This constraint is intentional and tied to the competition's problem statement focus.

### 10.3 Budget

- All infrastructure must operate within free or low-cost tiers:
  - Vercel: Hobby/free tier
  - Supabase: Free tier (500MB DB, 1GB storage, 50K MAU)
  - Vercel AI Gateway: within free usage limits
- No paid third-party APIs unless explicitly approved by the team.

### 10.4 Team

- Small team (competition context); exact headcount not specified in this document.
- All technical decisions must be reversible or low-risk given time constraints — no exotic dependencies.

### 10.5 Competition Context

- The platform must be **demoable live** on April 3, 2026.
- Demo path must work end-to-end: landing → sign-up → onboarding → dashboard → match view → contact button.
- The platform will be evaluated on **principled innovation** — ethical design, accessibility, and meaningful social impact are judged criteria, not just technical execution.
- Platform must clearly address the HMW statement in both product design and pitch narrative.

### 10.6 Technology

- Tech stack is fixed: Next.js 16 App Router, Supabase, Vercel AI SDK v6, AI Elements, shadcn/ui, Tailwind CSS, TypeScript.
- No deviations from this stack without explicit team decision — time does not allow for tooling debates.
- All AI calls go through Vercel AI Gateway (not direct to model provider).
