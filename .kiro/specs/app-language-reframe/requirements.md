# Requirements Document

## Introduction

Joyn's mission is to solve senior loneliness through human connection, but the current UI copy frames the app around fitness and working out. This spec covers a systematic rename of all fitness-first language to connection-first language across the app. All changes are UI copy only — no logic, routing, data model, or component structure changes.

## Glossary

- **App**: The Joyn Next.js web application
- **Dashboard**: The main landing page at `/dashboard` (`app/(app)/dashboard/page.tsx`)
- **Sessions_Page**: The page at `/sessions` (`app/(app)/sessions/page.tsx`)
- **Sidebar**: The persistent left-hand navigation rendered in `app/(app)/layout.tsx`
- **Match_Profile_Page**: The per-match detail page at `/match/[id]` (`app/(app)/match/[id]/page.tsx`)
- **Streak_Card**: The gamification widget displaying consecutive-week activity, present on both the Dashboard and Sessions_Page
- **Tagline**: The marketing sub-headline rendered beneath the JOYN wordmark in the Sidebar
- **Meetup**: The connection-first replacement term for "session" or "workout session" in all user-facing copy
- **Connection_Streak**: The connection-first replacement concept for "workout streak" in all user-facing copy

---

## Requirements

### Requirement 1: Dashboard — Section Header "Your Workout Partners"

**User Story:** As a Joyn user, I want the dashboard to reflect connection rather than fitness, so that the app feels welcoming rather than gym-like.

#### Acceptance Criteria

1. THE Dashboard SHALL display the section header label as "Your Companions" instead of "Your Workout Partners".

---

### Requirement 2: Dashboard — Sessions Section Label "Your Sessions"

**User Story:** As a Joyn user, I want upcoming plans labelled around meetups, so that the language matches the social nature of the activity.

#### Acceptance Criteria

1. THE Dashboard SHALL display the sessions section label as "Your Upcoming Meetups" instead of "Your Sessions".

---

### Requirement 3: Dashboard — "Schedule new →" Link

**User Story:** As a Joyn user, I want the quick-action link to use meetup language, so that the call-to-action is consistent with the connection-first framing.

#### Acceptance Criteria

1. THE Dashboard SHALL display the sessions quick-action link text as "Plan new →" instead of "Schedule new →".

---

### Requirement 4: Dashboard — "Join Session" Button

**User Story:** As a Joyn user, I want the join button on session cards to use meetup language, so that every touchpoint reinforces connection over exercise.

#### Acceptance Criteria

1. THE Dashboard SHALL display the join button on each upcoming session card as "Join Meetup" instead of "Join Session".

---

### Requirement 5: Dashboard — Streak Badge "7-day streak"

**User Story:** As a Joyn user, I want the streak badge to celebrate social connection, so that the gamification rewards the behaviour Joyn actually cares about.

#### Acceptance Criteria

1. THE Streak_Card on the Dashboard SHALL display the streak label as "7-day connection streak" instead of "7-day streak".

---

### Requirement 6: Sessions Page — Page Title

**User Story:** As a Joyn user, I want the Sessions page title to reflect meetups, so that the page heading aligns with the app's connection-first purpose.

#### Acceptance Criteria

1. THE Sessions_Page SHALL display the page `<h1>` heading as "Your Meetups" instead of "Your Workout Sessions".

---

### Requirement 7: Sessions Page — "Schedule New Session" Button

**User Story:** As a Joyn user, I want the primary CTA on the Sessions page to use meetup language, so that scheduling feels social rather than athletic.

#### Acceptance Criteria

1. THE Sessions_Page SHALL display the primary action button label as "+ Plan a Meetup" instead of "+ Schedule New Session".

---

### Requirement 8: Sessions Page — "Join Session" Button

**User Story:** As a Joyn user, I want the join button on each upcoming meetup card to use meetup language, so that the copy is consistent across the app.

#### Acceptance Criteria

1. THE Sessions_Page SHALL display the join button on each upcoming session card as "Join Meetup" instead of "Join Session".

---

### Requirement 9: Sessions Page — "Upcoming Sessions" Section Label

**User Story:** As a Joyn user, I want the upcoming section label to use meetup language, so that every heading on the page is consistent.

#### Acceptance Criteria

1. THE Sessions_Page SHALL display the upcoming section label as "Upcoming Meetups" instead of "Upcoming Sessions".

---

### Requirement 10: Sessions Page — "Past Sessions" Section Label

**User Story:** As a Joyn user, I want the past activity section label to use meetup language, so that historical records are framed around connection.

#### Acceptance Criteria

1. THE Sessions_Page SHALL display the past section label as "Past Meetups" instead of "Past Sessions".

---

### Requirement 11: Sessions Page — Streak Card Body Copy

**User Story:** As a Joyn user, I want the streak card to celebrate connecting with others, so that the milestone message reinforces the right behaviour.

#### Acceptance Criteria

1. THE Streak_Card on the Sessions_Page SHALL display the body copy as "You've connected every week for 3 weeks. Keep it up!" instead of "You've worked out every week for 3 weeks. Keep it up!".

---

### Requirement 12: Sessions Page — Schedule Modal Title

**User Story:** As a Joyn user, I want the scheduling modal to use meetup language, so that the flow is consistent from button click through to confirmation.

#### Acceptance Criteria

1. THE Sessions_Page schedule modal SHALL display the `<h2>` heading as "Plan a Meetup" instead of "Schedule a Session".

---

### Requirement 13: Sidebar — "Sessions" Navigation Label

**User Story:** As a Joyn user, I want the sidebar nav item to say "Meetups", so that the primary navigation reflects connection-first language.

#### Acceptance Criteria

1. THE Sidebar SHALL display the navigation item for `/sessions` as "Meetups" instead of "Sessions".

---

### Requirement 14: Sidebar — Tagline

**User Story:** As a Joyn user, I want the tagline beneath the logo to emphasise belonging over physical movement, so that the brand promise is clear from the first moment I see the app.

#### Acceptance Criteria

1. THE Sidebar SHALL display the tagline as "Connect. Belong. Age with Joy." instead of "Move Together. Age with Joy.".

---

### Requirement 15: Match Profile Page — Primary CTA Button

**User Story:** As a Joyn user, I want the CTA on a match's profile to invite me to plan a meetup, so that the action is framed around connection rather than exercise.

#### Acceptance Criteria

1. THE Match_Profile_Page SHALL display the primary CTA button label as "Plan a Meetup with [Name]" instead of "Schedule a Workout with [Name]", where [Name] is the matched person's first name.
