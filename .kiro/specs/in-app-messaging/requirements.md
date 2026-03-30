# Requirements Document

## Introduction

In-app messaging enables matched Joyn users to send and receive text messages directly within the app, without leaving to SMS or phone. This feature addresses the core loneliness problem: seniors need a low-friction, familiar way to communicate with their workout partners inside the app they already use. The feature is 1-on-1 only (no group chat), text-only (no media attachments for MVP), and restricted to matched pairs. It includes a conversations list page, a per-conversation thread page, a "Message" button on match profile pages, real-time delivery via Supabase Realtime, unread indicators in the sidebar, and a new sidebar nav entry — all designed for users aged 65+ with low tech literacy.

---

## Glossary

- **Messaging_System**: The in-app messaging feature as a whole, including all pages, components, and backend logic.
- **Conversation**: A 1-on-1 message thread between two matched users, identified by a `match_id`.
- **Message**: A single text message sent by one user to another within a Conversation.
- **Messages_Page**: The `/messages` route listing all of the current user's Conversations.
- **Thread_Page**: The `/messages/[matchId]` route showing the full message history for one Conversation.
- **Match_Profile_Page**: The `/match/[id]` route showing a matched user's profile and contact options.
- **Sidebar**: The fixed left navigation panel rendered in `app/(app)/layout.tsx`.
- **Unread_Badge**: A numeric or dot indicator on the Sidebar "Messages" nav item showing the count of unread messages.
- **Sender**: The authenticated user who authors and submits a Message.
- **Recipient**: The matched user who receives a Message.
- **RLS**: Row Level Security — Supabase's database-level access control enforced on the `messages` table.
- **Realtime_Subscription**: A Supabase Realtime channel that pushes new Message rows to subscribed clients without polling.
- **Read_Receipt**: The `read_at` timestamp set on a Message when the Recipient views it in the Thread_Page.

---

## Requirements

### Requirement 1: Messages Navigation Entry

**User Story:** As a Joyn user, I want a "Messages" item in the sidebar navigation, so that I can reach my conversations from anywhere in the app.

#### Acceptance Criteria

1. THE Sidebar SHALL include a "Messages" navigation item with a 💬 icon, linking to `/messages`, positioned between "My Matches" and "Sessions" in the nav order.
2. WHEN the current route is `/messages` or starts with `/messages/`, THE Sidebar SHALL render the "Messages" nav item in the active state (white text, highlighted background, gold indicator bar) consistent with other active nav items.
3. WHEN the current user has one or more unread Messages, THE Sidebar SHALL display the Unread_Badge on the "Messages" nav item showing the total unread count as a number.
4. WHEN the current user has no unread Messages, THE Sidebar SHALL display the "Messages" nav item without any Unread_Badge.
5. THE Unread_Badge SHALL have a minimum width and height of 20px, a background color of `#735C00`, white text, and a font size of at least 12px to remain legible.

---

### Requirement 2: Messages List Page

**User Story:** As a Joyn user, I want a page listing all my conversations, so that I can see who I've been messaging and jump into any thread.

#### Acceptance Criteria

1. WHEN an authenticated user navigates to `/messages`, THE Messages_Page SHALL render a list of all Conversations in which the user is either Sender or Recipient, ordered by the `created_at` timestamp of the most recent Message in each Conversation, descending.
2. WHEN a Conversation has at least one Message, THE Messages_Page SHALL display for each Conversation: the match partner's display name, the match partner's initials avatar, a preview of the most recent Message content (truncated to 60 characters), and the relative time of the most recent Message (e.g. "2 min ago", "Yesterday").
3. WHEN a Conversation contains unread Messages, THE Messages_Page SHALL visually distinguish that Conversation row with bold preview text and a colored left border using `#735C00`.
4. WHEN the current user has no Conversations, THE Messages_Page SHALL display an empty state with the heading "No messages yet", the body text "When you connect with a match, your conversations will appear here.", and a button linking to `/match` labeled "View My Matches".
5. WHEN a user taps or clicks a Conversation row, THE Messages_Page SHALL navigate to `/messages/[matchId]` for that Conversation.
6. THE Messages_Page SHALL render all text at a minimum font size of 18px and all interactive elements (conversation rows, buttons) with a minimum touch target height of 44px.
7. THE Messages_Page SHALL display a page heading of "Messages" using the Epilogue font at a minimum size of 28px.

---

### Requirement 3: Conversation Thread Page

**User Story:** As a Joyn user, I want to view the full message history with a match, so that I can read our conversation and reply.

#### Acceptance Criteria

1. WHEN an authenticated user navigates to `/messages/[matchId]`, THE Thread_Page SHALL fetch and display all Messages for that Conversation in chronological order (oldest at top, newest at bottom).
2. THE Thread_Page SHALL visually distinguish the current user's Messages (right-aligned, `#173124` background, white text) from the partner's Messages (left-aligned, `#E7E2D7` background, `#173124` text).
3. THE Thread_Page SHALL display each Message bubble with the Message content and the formatted send time (e.g. "10:32 AM").
4. WHEN the Thread_Page mounts, THE Thread_Page SHALL scroll to the bottom of the message list so the most recent Message is visible.
5. WHEN new Messages arrive via Realtime_Subscription, THE Thread_Page SHALL scroll to the bottom automatically if the user is already within 100px of the bottom of the message list.
6. THE Thread_Page SHALL display the match partner's display name and initials avatar in a fixed header at the top of the conversation.
7. THE Thread_Page SHALL render all Message text at a minimum font size of 18px.
8. WHEN an authenticated user navigates to `/messages/[matchId]` and the `matchId` does not correspond to a match involving the current user, THE Thread_Page SHALL redirect the user to `/messages`.
9. WHEN the Thread_Page mounts, THE Messaging_System SHALL mark all unread Messages in that Conversation where the current user is the Recipient as read by setting `read_at` to the current UTC timestamp.

---

### Requirement 4: Sending Messages

**User Story:** As a Joyn user, I want to type and send a text message to a match, so that I can communicate with them inside the app.

#### Acceptance Criteria

1. THE Thread_Page SHALL include a fixed-bottom compose area containing a textarea input and a "Send" button.
2. WHEN the textarea is empty or contains only whitespace, THE Thread_Page SHALL render the "Send" button in a disabled state and prevent submission.
3. WHEN the user submits a non-empty Message (via the "Send" button or pressing Enter without Shift), THE Messaging_System SHALL insert a new row into the `messages` table with `sender_id` set to the current user's id, `recipient_id` set to the partner's id, `match_id` set to the current match's id, `content` set to the trimmed input text, and `read_at` set to NULL.
4. WHEN a Message is successfully inserted, THE Thread_Page SHALL clear the textarea and append the new Message bubble to the thread without requiring a page reload.
5. IF the Message insert fails, THEN THE Thread_Page SHALL display an inline error message "Message could not be sent. Please try again." without clearing the textarea content.
6. THE textarea SHALL have a minimum font size of 18px, a minimum height of 52px, and a placeholder text of "Type a message…".
7. THE "Send" button SHALL have a minimum touch target size of 44px × 44px, a background color of `#173124`, and white text or icon.
8. WHEN the textarea is focused, THE Thread_Page SHALL ensure the compose area remains visible above the on-screen keyboard on mobile viewports by using appropriate CSS positioning.
9. THE Messaging_System SHALL enforce a maximum Message content length of 2000 characters. WHEN the user attempts to send a Message exceeding 2000 characters, THE Thread_Page SHALL display an inline validation error and prevent submission.

---

### Requirement 5: Real-Time Message Delivery

**User Story:** As a Joyn user, I want new messages from my match to appear instantly without refreshing, so that our conversation feels natural and responsive.

#### Acceptance Criteria

1. WHEN the Thread_Page is mounted, THE Messaging_System SHALL establish a Realtime_Subscription on the `messages` table filtered to rows where `match_id` equals the current Conversation's `match_id`.
2. WHEN a new Message row is inserted into the `messages` table for the active Conversation, THE Realtime_Subscription SHALL deliver the new Message to the Thread_Page within 3 seconds under normal network conditions.
3. WHEN the Thread_Page is unmounted, THE Messaging_System SHALL unsubscribe from the Realtime_Subscription to prevent memory leaks.
4. WHEN the Messaging_System receives a new Message via Realtime_Subscription where the current user is the Recipient, THE Thread_Page SHALL append the Message bubble to the thread and update the Unread_Badge count if the user is not currently viewing the Thread_Page for that Conversation.
5. WHEN the Messages_Page is mounted, THE Messaging_System SHALL establish a Realtime_Subscription on the `messages` table filtered to rows where the current user is the Recipient, in order to update Conversation previews and the Unread_Badge in real time.
6. WHEN the Messages_Page is unmounted, THE Messaging_System SHALL unsubscribe from its Realtime_Subscription.

---

### Requirement 6: Unread Message Indicators

**User Story:** As a Joyn user, I want to see how many unread messages I have, so that I know when someone has reached out to me.

#### Acceptance Criteria

1. THE Messaging_System SHALL define a Message as "unread" when `read_at` IS NULL and `recipient_id` equals the current user's id.
2. WHEN the current user has one or more unread Messages across all Conversations, THE Sidebar SHALL display the Unread_Badge on the "Messages" nav item with the total count of unread Messages.
3. WHEN the current user opens a Thread_Page, THE Messaging_System SHALL set `read_at` to the current UTC timestamp for all unread Messages in that Conversation where the current user is the Recipient, and THE Unread_Badge count SHALL decrement accordingly.
4. WHEN all Messages have been read, THE Sidebar SHALL remove the Unread_Badge from the "Messages" nav item.
5. THE Unread_Badge count SHALL update in real time via Realtime_Subscription without requiring a page reload or manual refresh.

---

### Requirement 7: Message Button on Match Profile Page

**User Story:** As a Joyn user, I want a "Message" button on my match's profile page, so that I can start a conversation directly from their profile.

#### Acceptance Criteria

1. THE Match_Profile_Page SHALL include a "Message" button in the "Reach Out" contact options section, alongside the existing SMS, call, and video session options.
2. WHEN a user taps the "Message" button, THE Match_Profile_Page SHALL navigate to `/messages/[matchId]` where `matchId` is the id of the match record linking the current user and the profile being viewed.
3. THE "Message" button SHALL display a 💬 icon, the label "Send a Message", and match the visual style of the existing contact option buttons (border, padding, font size, min-height of 56px).
4. THE "Message" button SHALL be rendered as a Next.js `Link` component pointing to the correct `/messages/[matchId]` route.

---

### Requirement 8: Data Storage — messages Table

**User Story:** As a developer, I want a well-structured `messages` table in Supabase, so that messages are stored reliably and can be queried efficiently.

#### Acceptance Criteria

1. THE Messaging_System SHALL store all Messages in a Supabase `messages` table with the following columns: `id` (uuid, PK, DEFAULT gen_random_uuid()), `sender_id` (uuid, FK → profiles.id ON DELETE CASCADE, NOT NULL), `recipient_id` (uuid, FK → profiles.id ON DELETE CASCADE, NOT NULL), `match_id` (uuid, FK → matches.id ON DELETE CASCADE, NOT NULL), `content` (text, NOT NULL), `created_at` (timestamptz, NOT NULL DEFAULT now()), `read_at` (timestamptz, nullable).
2. THE `messages` table SHALL have Row Level Security enabled.
3. THE `messages` table SHALL have a composite index on `(match_id, created_at)` to support efficient chronological thread queries.
4. THE `messages` table SHALL have an index on `(recipient_id, read_at)` to support efficient unread count queries.

---

### Requirement 9: Security — Row Level Security Policies

**User Story:** As a developer, I want RLS policies on the `messages` table, so that users can only access messages they are party to.

#### Acceptance Criteria

1. THE RLS policy for SELECT on `messages` SHALL permit a row to be read only when `auth.uid() = sender_id` OR `auth.uid() = recipient_id`.
2. THE RLS policy for INSERT on `messages` SHALL permit a row to be inserted only when `auth.uid() = sender_id` AND a row exists in the `matches` table where `id = match_id` AND (`user_a_id = auth.uid()` OR `user_b_id = auth.uid()`), ensuring only matched users can initiate messages.
3. THE RLS policy for UPDATE on `messages` SHALL permit a row to be updated only when `auth.uid() = recipient_id`, restricting updates to read-receipt writes by the Recipient only.
4. THE Messaging_System SHALL NOT define a DELETE RLS policy on `messages`, preventing any user from deleting message history.
5. WHEN a user attempts to send a Message to a user they are not matched with, THE Messaging_System SHALL reject the insert at the database level via RLS and THE Thread_Page SHALL display the error message "You can only message users you are matched with."

---

### Requirement 10: Accessibility — Large Text and Touch Targets

**User Story:** As an elderly Joyn user with low tech literacy, I want the messaging UI to use large text and easy-to-tap buttons, so that I can read and interact with messages comfortably.

#### Acceptance Criteria

1. THE Messaging_System SHALL render all body text, message content, and input fields at a minimum font size of 18px throughout all messaging pages and components.
2. THE Messaging_System SHALL render all interactive elements — including conversation rows, the Send button, the Message button on Match_Profile_Page, and nav items — with a minimum touch target height of 44px and a minimum touch target width of 44px.
3. THE Messaging_System SHALL use the Lexend font for all body text and the Epilogue font for all headings, consistent with the Joyn design system.
4. THE Messaging_System SHALL maintain a color contrast ratio of at least 4.5:1 between text and background colors on all messaging UI elements.
5. THE Thread_Page compose textarea and Send button SHALL be reachable and operable via keyboard navigation (Tab, Enter, Shift+Enter).
6. THE Messaging_System SHALL provide descriptive `aria-label` attributes on icon-only buttons (e.g. the Send button if it uses only an icon).

---

### Requirement 11: Empty States

**User Story:** As a new Joyn user who has not yet sent any messages, I want clear guidance when pages have no content, so that I understand what to do next.

#### Acceptance Criteria

1. WHEN the current user has no Conversations, THE Messages_Page SHALL display an empty state with the heading "No messages yet" (Epilogue font, minimum 24px), body text "When you connect with a match, your conversations will appear here.", and a button labeled "View My Matches" linking to `/match`.
2. WHEN the current user navigates to a Thread_Page for a Conversation that has no Messages yet, THE Thread_Page SHALL display an empty state with the text "Say hello to [partner name]! Send your first message below." centered in the message area.
3. THE empty state text on the Thread_Page SHALL use a minimum font size of 18px and a muted color (`#727973`).
