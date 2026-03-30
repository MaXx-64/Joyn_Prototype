# Bugfix Requirements Document

## Introduction

This document covers seven UI/UX bugs identified in the Joyn app through a thorough audit. The bugs span a missing route (causing a 404), non-functional buttons across the sessions and match pages, and an unimplemented photo upload on the profile page. All bugs result in dead ends or broken interactions that degrade the user experience — particularly problematic for the target audience of elderly users who may interpret a broken button as user error. Fixes are scoped to client-side behavior using the existing mock data and inline-style patterns already established in the codebase.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user clicks the "My Matches" nav item in the sidebar THEN the system returns a 404 page because no route exists at `/match`

1.2 WHEN a user navigates directly to `/match` THEN the system renders a Next.js 404 error because `app/(app)/match/page.tsx` does not exist

1.3 WHEN a user clicks the "+ Schedule New Session" button on the sessions page THEN the system does nothing because the button has no `onClick` handler and no associated form or modal

1.4 WHEN a user clicks a "Join Session" button on an upcoming session card THEN the system does nothing because the button has no `onClick` handler

1.5 WHEN a user clicks a "Cancel" button on an upcoming session card THEN the system does nothing because the button has no `onClick` handler

1.6 WHEN a user clicks "Report this person" on a match profile page THEN the system does nothing because the button has no `onClick` handler

1.7 WHEN a user views the profile photo section on the profile page THEN the system displays a static placeholder message ("Photo upload coming soon") with no file input or upload functionality

### Expected Behavior (Correct)

2.1 WHEN a user clicks the "My Matches" nav item THEN the system SHALL navigate to `/match` and render a matches listing page showing all matched users using the existing mock data

2.2 WHEN a user navigates directly to `/match` THEN the system SHALL render a page at `app/(app)/match/page.tsx` listing all matched profiles with name, age, city, interests, and a link to each match's detail page

2.3 WHEN a user clicks the "+ Schedule New Session" button THEN the system SHALL open a modal or inline form that allows the user to select a partner, activity, date, and time

2.4 WHEN a user clicks a "Join Session" button THEN the system SHALL navigate to a session detail page or display a placeholder indicating a video call would launch

2.5 WHEN a user clicks a "Cancel" button on an upcoming session card THEN the system SHALL remove that session from the upcoming sessions list via a client-side state update

2.6 WHEN a user clicks "Report this person" on a match profile page THEN the system SHALL open a confirmation dialog or modal asking the user to confirm the report

2.7 WHEN a user views the profile photo section THEN the system SHALL display a functional `<input type="file">` that, upon file selection, previews the chosen image client-side as a base64 data URL replacing the initials avatar

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user navigates to `/match/[id]` with a valid match ID THEN the system SHALL CONTINUE TO render the full match profile page with contact buttons, interests, bio, and the "Schedule a Workout" CTA

3.2 WHEN a user navigates to `/dashboard` THEN the system SHALL CONTINUE TO display the match cards, session cards, and events section with all existing mock data

3.3 WHEN a user clicks the "Connect" button on a dashboard match card THEN the system SHALL CONTINUE TO navigate to `/match/[id]` for the corresponding match

3.4 WHEN a user views the sessions page THEN the system SHALL CONTINUE TO display the upcoming sessions list, past sessions list, and the streak card with existing mock data

3.5 WHEN a user edits and saves profile fields (name, age, city, bio, interests, fitness level, health goals, emergency contact) THEN the system SHALL CONTINUE TO update local state and show the "✓ Profile Saved!" confirmation

3.6 WHEN a user clicks "Send a Text" or "Give a Call" on a match profile page THEN the system SHALL CONTINUE TO open the native SMS or phone dialer via the `sms:` and `tel:` URI schemes

3.7 WHEN a user clicks the sidebar nav items for Dashboard, Sessions, Events, or Profile THEN the system SHALL CONTINUE TO navigate to the correct routes without errors

3.8 WHEN a user clicks "Sign Out" in the sidebar THEN the system SHALL CONTINUE TO call Supabase auth sign-out and redirect to the landing page
