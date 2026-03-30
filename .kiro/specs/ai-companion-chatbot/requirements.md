# Requirements Document

## Introduction

The AI Companion Chatbot is a persistent, floating chat widget that lives on every authenticated
page of the Joyn app. Unlike the onboarding chatbot (which collects profile data), this companion
exists purely for ongoing emotional support and human connection — checking in on how users are
feeling, responding warmly to loneliness or boredom, and gently nudging users toward the app's
social features (matches, events, sessions) when appropriate.

The companion uses the same "Jo" persona established during onboarding to provide continuity.
It is designed specifically for elderly users (65+) with low tech literacy: large text, a
non-intimidating collapsible widget, and language that feels like a friendly neighbor rather
than a support hotline or fitness coach.

The feature introduces a new streaming API route (`/api/ai/companion`) separate from the
existing onboarding route (`/api/ai/chat`), a new `CompanionWidget` client component, and a
modification to `app/(app)/layout.tsx` to mount the widget on all authenticated pages.

---

## Glossary

- **Companion**: The AI Companion Chatbot feature described in this document.
- **CompanionWidget**: The React client component that renders the floating chat UI.
- **Jo**: The AI persona name used for both onboarding and the companion; warm, patient, unhurried.
- **Widget**: The collapsible floating UI element anchored to the bottom-right corner of the viewport.
- **Trigger Button**: The collapsed state of the Widget — a circular button showing Jo's avatar.
- **Chat Panel**: The expanded state of the Widget — a full chat interface with message history and input.
- **Emotional Check-in**: A proactive greeting message Jo sends when the user first opens the Widget.
- **Connection Nudge**: A suggestion Jo makes to reach out to a match, browse events, or schedule a session.
- **Session**: A browser session; context (conversation history) is maintained within a session and not persisted across sessions.
- **Companion Route**: The server-side API route at `/api/ai/companion` that handles streaming LLM responses.
- **Authenticated Layout**: The Next.js layout at `app/(app)/layout.tsx` that wraps all post-login pages.
- **Serious Distress Signal**: A user message containing language that suggests crisis, self-harm, or severe emotional distress.
- **Vercel AI SDK**: The `ai` package (v6) used for `streamText` and `toUIMessageStreamResponse`.
- **useChat**: The `@ai-sdk/react` hook used to manage chat state and streaming on the client.

---

## Requirements

### Requirement 1: Floating Widget Presence

**User Story:** As an elderly Joyn user, I want a friendly chat button always available in the
corner of my screen, so that I can talk to Jo whenever I feel like it without navigating away
from what I'm doing.

#### Acceptance Criteria

1. THE CompanionWidget SHALL render in the bottom-right corner of the viewport on every page
   within the Authenticated Layout.
2. THE CompanionWidget SHALL be positioned with `position: fixed` so it remains visible during
   page scrolling.
3. WHEN the Widget is in its collapsed state, THE CompanionWidget SHALL display a circular
   Trigger Button no smaller than 64×64px containing Jo's avatar initials and a pulsing
   green indicator dot.
4. THE Trigger Button SHALL have a minimum touch target of 64×64px to accommodate users with
   reduced motor dexterity.
5. THE CompanionWidget SHALL render above all other page content using a z-index that ensures
   it is never obscured by page elements.
6. THE CompanionWidget SHALL be mounted once in `app/(app)/layout.tsx` so it persists across
   client-side route navigations without remounting.

---

### Requirement 2: Collapsible Chat Panel

**User Story:** As an elderly Joyn user, I want to open and close the chat panel easily, so
that it doesn't get in the way when I'm not using it but is always one tap away.

#### Acceptance Criteria

1. WHEN the user taps the Trigger Button, THE CompanionWidget SHALL expand to show the Chat Panel.
2. WHEN the Chat Panel is open and the user taps the close button, THE CompanionWidget SHALL
   collapse back to the Trigger Button state.
3. THE Chat Panel SHALL have a minimum width of 360px and a minimum height of 480px to ensure
   readability for elderly users.
4. THE Chat Panel SHALL display a visible close button (minimum 44×44px touch target) in its
   header area.
5. WHILE the Chat Panel is open, THE CompanionWidget SHALL maintain conversation history so
   that messages are not lost when the panel is toggled.
6. THE Chat Panel SHALL use the app's design tokens: surface background `#FEF9ED`, card
   background `#E7E2D7`, border `#C2C8C2`, primary `#173124`.
7. THE Chat Panel header SHALL display Jo's name and a subtitle (e.g. "Your Joyn companion")
   in a minimum font size of 18px.

---

### Requirement 3: Emotional Check-in on Open

**User Story:** As an elderly Joyn user, I want Jo to greet me warmly when I open the chat,
so that the interaction feels personal and inviting rather than like opening a support ticket.

#### Acceptance Criteria

1. WHEN the Chat Panel is opened for the first time in a Session, THE Companion SHALL
   automatically send a warm greeting message that includes an emotional check-in question
   (e.g. "Hi there! How are you feeling today?").
2. THE greeting message SHALL be pre-populated as an initial assistant message — it SHALL NOT
   require a round-trip to the Companion Route to display.
3. WHEN the Chat Panel is closed and reopened within the same Session, THE CompanionWidget
   SHALL display the existing conversation history without sending a new greeting.
4. THE greeting message SHALL address the user in a warm, unhurried tone consistent with the
   Jo persona — it SHALL NOT use clinical language, crisis hotline language, or fitness
   coaching language.

---

### Requirement 4: Companion API Route

**User Story:** As a developer, I want a dedicated streaming API route for the companion
chatbot, so that its concerns (persona, context, safety rules) are fully isolated from the
onboarding chatbot route.

#### Acceptance Criteria

1. THE Companion Route SHALL be implemented at `app/api/ai/companion/route.ts` as a Next.js
   Route Handler that accepts POST requests.
2. THE Companion Route SHALL use `streamText` from the Vercel AI SDK and return
   `result.toUIMessageStreamResponse()` to support streaming on the client.
3. THE Companion Route SHALL accept a request body containing a `messages` array of
   `UIMessage` objects and convert them using `convertToModelMessages` before passing to
   `streamText`.
4. THE Companion Route SHALL use a system prompt that establishes the Jo persona: warm,
   patient, unhurried, non-clinical, non-fitness-focused, and oriented toward emotional
   companionship and social connection.
5. THE Companion Route system prompt SHALL explicitly instruct Jo to NOT provide medical
   advice, diagnoses, or crisis counseling.
6. THE Companion Route SHALL be a separate file from `app/api/ai/chat/route.ts` with no
   shared state between the two routes.
7. IF the request does not contain a valid authenticated session, THEN THE Companion Route
   SHALL return a 401 Unauthorized response.

---

### Requirement 5: Warm Conversational Responses

**User Story:** As an elderly Joyn user, I want Jo to respond to how I'm feeling in a way
that feels human and caring, so that talking to Jo actually helps me feel less alone.

#### Acceptance Criteria

1. WHEN a user expresses loneliness, boredom, or sadness, THE Companion SHALL respond with
   empathy and warmth before offering any suggestions.
2. WHEN a user expresses a positive emotion (happiness, excitement), THE Companion SHALL
   reflect that positivity back in its response.
3. THE Companion SHALL maintain conversational context within a Session — WHEN a user
   mentioned a feeling or topic earlier in the conversation, THE Companion SHALL be able to
   reference it in follow-up messages.
4. THE Companion SHALL keep individual responses concise — no more than 3 sentences per
   turn — to avoid overwhelming elderly users with large blocks of text.
5. THE Companion SHALL use simple, plain language at approximately a Grade 6 reading level,
   avoiding jargon, acronyms, and technical terms.
6. THE Companion SHALL use occasional gentle emojis (e.g. 🌻 ☀️ 😊) to convey warmth,
   consistent with the Jo persona established in onboarding.

---

### Requirement 6: Connection Nudges

**User Story:** As an elderly Joyn user, I want Jo to suggest things I can do on the app
when I'm feeling lonely or bored, so that I'm gently guided toward making a real connection
rather than just chatting with an AI.

#### Acceptance Criteria

1. WHEN a user expresses loneliness, boredom, or a desire for social interaction, THE
   Companion SHALL suggest at least one relevant action from: reaching out to a match,
   browsing upcoming events, or scheduling a workout session.
2. THE Companion SHALL phrase Connection Nudges as gentle suggestions, not directives
   (e.g. "Would you like to reach out to one of your matches?" not "You should message
   your matches.").
3. THE Companion SHALL NOT make Connection Nudges on every message turn — nudges SHALL
   only appear when contextually appropriate based on the user's expressed mood or intent.
4. THE Companion SHALL NOT reference specific match names, event titles, or session details
   that it cannot verify — suggestions SHALL be general (e.g. "one of your matches") unless
   the user provides that context themselves.

---

### Requirement 7: Safety Guardrails

**User Story:** As a Joyn product owner, I want Jo to handle expressions of serious distress
safely and responsibly, so that vulnerable elderly users are directed to appropriate help
without the app acting as a crisis service.

#### Acceptance Criteria

1. WHEN a user's message contains a Serious Distress Signal (language suggesting crisis,
   self-harm, or severe emotional distress), THE Companion SHALL respond with a warm,
   non-alarmist message that acknowledges the user's feelings.
2. WHEN a Serious Distress Signal is detected, THE Companion SHALL gently suggest the user
   contact a trusted family member or call 988 (the Suicide and Crisis Lifeline).
3. THE Companion SHALL NOT attempt to provide crisis counseling, psychological assessment,
   or medical advice under any circumstances.
4. THE Companion SHALL NOT use alarming or clinical language in its safety responses — the
   tone SHALL remain that of a caring friend, not a hotline operator.
5. THE Companion system prompt SHALL explicitly prohibit Jo from diagnosing conditions,
   recommending medications, or interpreting medical symptoms.

---

### Requirement 8: Accessibility and Readability

**User Story:** As an elderly Joyn user with reduced vision or motor dexterity, I want the
companion widget to be easy to read and tap, so that I can use it comfortably without
frustration.

#### Acceptance Criteria

1. THE CompanionWidget SHALL use a minimum font size of 18px for all message text.
2. THE CompanionWidget SHALL use a minimum font size of 16px for the chat input field
   placeholder and typed text.
3. ALL interactive elements within the CompanionWidget (Trigger Button, close button, send
   button) SHALL have a minimum touch target size of 44×44px.
4. THE chat input field SHALL have a minimum height of 52px.
5. THE send button SHALL be clearly labeled (text or icon with aria-label) and SHALL be
   disabled when the input is empty or a response is streaming.
6. THE CompanionWidget SHALL use color contrast ratios that meet WCAG 2.1 AA (minimum 4.5:1
   for normal text, 3:1 for large text) using the app's established design tokens.
7. THE CompanionWidget SHALL include appropriate ARIA attributes: `role="dialog"` on the
   Chat Panel, `aria-label` on the Trigger Button, and `aria-live="polite"` on the message
   list so screen readers announce new messages.
8. THE CompanionWidget SHALL support keyboard navigation — the Trigger Button SHALL be
   focusable and activatable via Enter/Space, and the Chat Panel SHALL trap focus while open.

---

### Requirement 9: Session-Scoped Conversation Memory

**User Story:** As an elderly Joyn user, I want Jo to remember what I said earlier in our
conversation, so that I don't have to repeat myself and the chat feels like a real exchange.

#### Acceptance Criteria

1. THE CompanionWidget SHALL maintain the full conversation history in client-side state
   for the duration of the browser Session.
2. WHEN the user sends a new message, THE CompanionWidget SHALL include the complete prior
   conversation history in the request to the Companion Route so the LLM has full context.
3. THE Companion SHALL NOT persist conversation history to the database or any server-side
   store — history is intentionally ephemeral and scoped to the browser Session.
4. WHEN the user navigates between authenticated pages, THE CompanionWidget SHALL retain
   conversation history because it is mounted once in the Authenticated Layout.
5. WHEN the user refreshes the page or opens a new browser tab, THE CompanionWidget SHALL
   start a fresh Session with a new greeting.

---

### Requirement 10: Non-Interference with Page Content

**User Story:** As an elderly Joyn user, I want the companion widget to stay out of the way
when I'm using the rest of the app, so that it never blocks content I'm trying to read or
interact with.

#### Acceptance Criteria

1. THE CompanionWidget SHALL be positioned in the bottom-right corner with sufficient margin
   (minimum 24px from viewport edges) so it does not overlap the app's sidebar navigation.
2. WHEN the Chat Panel is open on a narrow viewport (below 480px width), THE CompanionWidget
   SHALL expand to fill the full viewport width and height so content is not partially obscured.
3. THE Trigger Button in its collapsed state SHALL NOT obscure any primary navigation
   elements or primary call-to-action buttons on any authenticated page.
4. THE CompanionWidget SHALL NOT intercept keyboard events or scroll events on the
   underlying page when the Chat Panel is closed.
