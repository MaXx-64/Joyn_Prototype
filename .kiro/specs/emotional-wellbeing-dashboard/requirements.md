# Requirements Document

## Introduction

This feature adds emotional well-being awareness to the Joyn dashboard for elderly Arizonans. The audit identified that the app never asks about emotional state, never tracks it, and never responds to it. This spec introduces two new dashboard widgets — a daily mood check-in and a connection nudge — plus a reframe of the existing streak badge from fitness to social connection. All mood data is ephemeral (localStorage only); no database changes are required for MVP.

---

## Glossary

- **Dashboard**: The main screen at `/` (authenticated) rendered by `app/(app)/dashboard/page.tsx`
- **Mood_Widget**: The client component that presents the daily mood check-in prompt and records the user's response
- **Mood_Option**: One of five selectable emoji states: 😔 Not great, 😐 Okay, 🙂 Pretty good, 😊 Good, 🌟 Great
- **Low_Mood**: A Mood_Option of 😔 (Not great) or 😐 (Okay)
- **Mood_Store**: The localStorage key `joyn_mood` used to persist the selected Mood_Option and the ISO date it was recorded
- **Connection_Nudge_Widget**: The client component that displays either a nudge to reconnect or a positive reinforcement message based on mock connection recency data
- **Streak_Badge**: The existing dark pill in the dashboard header that currently reads "7-day streak"
- **Companion**: A matched user shown in the dashboard's companion list (mock data)
- **Touch_Target**: An interactive element whose tappable area meets the minimum size requirement

---

## Requirements

### Requirement 1: Daily Mood Check-In — Initial Prompt

**User Story:** As an elderly Joyn user, I want to be asked how I'm feeling each day, so that the app acknowledges my emotional state and I feel seen.

#### Acceptance Criteria

1. WHEN the Dashboard renders and no Mood_Store entry exists for the current calendar date, THE Mood_Widget SHALL display the prompt "How are you feeling today?"
2. THE Mood_Widget SHALL display all five Mood_Options as selectable emoji buttons in the following order: 😔 Not great, 😐 Okay, 🙂 Pretty good, 😊 Good, 🌟 Great
3. THE Mood_Widget SHALL render each Mood_Option button with a minimum Touch_Target size of 44×44 CSS pixels
4. THE Mood_Widget SHALL render all visible text at a minimum font size of 18px
5. THE Mood_Widget SHALL provide a visible focus indicator on each Mood_Option button for keyboard navigation
6. THE Mood_Widget SHALL assign each Mood_Option button an `aria-label` that includes both the emoji and its text label (e.g., `aria-label="Not great"`)

---

### Requirement 2: Mood Selection and Acknowledgment

**User Story:** As a user, I want to receive a warm acknowledgment after selecting my mood, so that I feel the app has responded to me personally.

#### Acceptance Criteria

1. WHEN a user selects a Mood_Option, THE Mood_Widget SHALL display a warm acknowledgment message appropriate to the selected mood
2. WHEN a user selects a Mood_Option, THE Mood_Widget SHALL hide the five Mood_Option buttons and replace them with the acknowledgment message
3. WHEN a user selects a Mood_Option that is not a Low_Mood, THE Mood_Widget SHALL display only the acknowledgment message without any follow-up prompt
4. WHEN a user selects a Low_Mood, THE Mood_Widget SHALL display the acknowledgment message followed by the gentle nudge: "Would you like to reach out to one of your companions?"
5. WHEN a user selects a Low_Mood, THE Mood_Widget SHALL display a "Reach out to companions →" link that navigates to `/match`
6. THE Mood_Widget SHALL render acknowledgment and nudge text at a minimum font size of 18px

---

### Requirement 3: Mood Persistence via localStorage

**User Story:** As a user, I want my mood check-in to be remembered for the rest of the day, so that I'm not asked again after I've already answered.

#### Acceptance Criteria

1. WHEN a user selects a Mood_Option, THE Mood_Store SHALL persist the selected Mood_Option value and the current ISO calendar date (YYYY-MM-DD) to localStorage under the key `joyn_mood`
2. THE Mood_Store SHALL store data as a JSON object with the shape `{ "mood": string, "date": string }` where `date` is the ISO calendar date
3. WHEN the Dashboard renders and a valid Mood_Store entry exists for the current calendar date, THE Mood_Widget SHALL display the previously selected Mood_Option emoji and its label instead of the check-in prompt
4. WHEN the Dashboard renders and a Mood_Store entry exists for a prior calendar date, THE Mood_Widget SHALL treat the entry as absent and display the check-in prompt
5. IF localStorage is unavailable or throws an exception, THEN THE Mood_Widget SHALL display the check-in prompt as if no prior entry exists and SHALL NOT throw an unhandled error

---

### Requirement 4: Daily Reset Behavior

**User Story:** As a user, I want the mood check-in to reset each day, so that I can record how I'm feeling on any given day.

#### Acceptance Criteria

1. WHEN the current calendar date advances past the date stored in the Mood_Store, THE Mood_Widget SHALL display the check-in prompt on the next Dashboard render
2. THE Mood_Widget SHALL determine the current date using the user's local timezone as reported by the browser
3. THE Mood_Widget SHALL NOT retain or display mood data from a prior calendar date after the daily reset

---

### Requirement 5: Connection Nudge Widget — Disconnected State

**User Story:** As a user who hasn't connected with anyone recently, I want a gentle reminder to reach out, so that I'm encouraged to maintain social bonds.

#### Acceptance Criteria

1. WHEN the mock connection data indicates the user has not connected with anyone within the past 3 calendar days, THE Connection_Nudge_Widget SHALL display the message: "You haven't connected with anyone in [N] days — want to reach out to [Name]?"
2. THE Connection_Nudge_Widget SHALL use the mock values of 5 days and the Companion name "Margaret" for the disconnected state in the MVP
3. THE Connection_Nudge_Widget SHALL display a "Reach out to Margaret →" button that navigates to `/match/1`
4. THE Connection_Nudge_Widget SHALL render the "Reach out to Margaret →" button with a minimum Touch_Target size of 44×44 CSS pixels
5. THE Connection_Nudge_Widget SHALL render all text at a minimum font size of 18px

---

### Requirement 6: Connection Nudge Widget — Connected State (Positive Reinforcement)

**User Story:** As a user who has connected recently, I want to see positive reinforcement, so that I feel encouraged to keep up my social habits.

#### Acceptance Criteria

1. WHEN the mock connection data indicates the user has connected with a Companion within the past 3 calendar days, THE Connection_Nudge_Widget SHALL display the positive reinforcement message: "You connected with [Name] [N] days ago. Keep it up! 🌻"
2. THE Connection_Nudge_Widget SHALL use the mock values of 2 days and the Companion name "Margaret" for the connected state in the MVP
3. THE Connection_Nudge_Widget SHALL NOT display a "Reach out" button in the connected state
4. THE Connection_Nudge_Widget SHALL render the positive reinforcement message at a minimum font size of 18px

---

### Requirement 7: Streak Badge Reframe

**User Story:** As a user, I want the streak badge to reflect my social connection activity rather than fitness, so that the app reinforces the right behavior.

#### Acceptance Criteria

1. THE Streak_Badge SHALL display the label "7-day connection streak" in place of the current "7-day streak" label
2. THE Streak_Badge SHALL retain its existing visual design (dark pill, gold text, flame emoji)

> Note: Full dynamic connection streak tracking is out of scope for this spec and is addressed in the app-language-reframe spec. This requirement covers the label copy change only.

---

### Requirement 8: Dashboard Layout Integration

**User Story:** As a user, I want the new widgets to feel like a natural part of the dashboard, so that the experience is cohesive.

#### Acceptance Criteria

1. THE Dashboard SHALL render the Mood_Widget in the right-hand column above the Sessions section
2. THE Dashboard SHALL render the Connection_Nudge_Widget in the right-hand column below the Mood_Widget and above the Sessions section
3. THE Mood_Widget SHALL use the existing design tokens: surface background `#FEF9ED`, card background `#E7E2D7`, border `#C2C8C2`, primary text `#173124`, gold accent `#735C00`
4. THE Connection_Nudge_Widget SHALL use the same design tokens as the Mood_Widget
5. WHEN the Dashboard is a server component, THE Mood_Widget SHALL be implemented as a client component using the `"use client"` directive to support `useState` and localStorage access
6. WHEN the Dashboard is a server component, THE Connection_Nudge_Widget SHALL be implemented as a client component using the `"use client"` directive

---

### Requirement 9: Accessibility — General

**User Story:** As an elderly user who may have motor or visual impairments, I want all interactive elements to be easy to see and tap, so that I can use the feature without frustration.

#### Acceptance Criteria

1. THE Mood_Widget SHALL ensure all interactive Mood_Option buttons meet a minimum color contrast ratio of 4.5:1 between foreground and background colors
2. THE Mood_Widget SHALL support full keyboard operability — all Mood_Option buttons SHALL be reachable and activatable via keyboard Tab and Enter/Space keys
3. THE Connection_Nudge_Widget SHALL ensure the "Reach out" button meets a minimum color contrast ratio of 4.5:1
4. THE Mood_Widget SHALL announce the acknowledgment message to screen readers using an `aria-live="polite"` region so that the response is read aloud after mood selection
