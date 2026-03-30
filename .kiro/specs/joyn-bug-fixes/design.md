# Joyn Bug Fixes — Bugfix Design

## Overview

Seven UI bugs in the Joyn app leave users at dead ends: a missing `/match` route returns a 404,
three buttons on the sessions page have no handlers, the "Report this person" button on match
profiles does nothing, and the profile photo section shows a static placeholder with no upload
capability. The sessions page is also a server component that needs client-side state for the
fixes to work. All fixes are scoped to client-side behavior using existing mock data and the
inline-style pattern already established in the codebase.

---

## Glossary

- **Bug_Condition (C)**: The condition that identifies a buggy input — a user action that should
  produce a visible result but produces nothing (or a 404).
- **Property (P)**: The desired observable outcome when the bug condition holds after the fix is
  applied.
- **Preservation**: Existing behaviors that must remain byte-for-byte equivalent after the fix.
- **isBugCondition**: Pseudocode predicate that returns `true` when a given input triggers one of
  the seven bugs.
- **SessionsPage**: The component exported from `app/(app)/sessions/page.tsx`.
- **MatchProfilePage**: The component exported from `app/(app)/match/[id]/page.tsx`.
- **ProfilePage**: The component exported from `app/(app)/profile/page.tsx`.
- **upcomingSessions**: The client-side state array that drives the upcoming sessions list in
  `SessionsPage`.

---

## Bug Details

### Bug Condition

The bugs manifest across four files. Each sub-condition is independent; the combined predicate
covers all seven defects.


**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input — one of:
           NavigationEvent  (user clicks a sidebar nav item or types a URL)
           ButtonClickEvent (user clicks a button in the UI)
           FileSelectEvent  (user selects a file in a file picker)
  OUTPUT: boolean

  IF input IS NavigationEvent
     AND input.targetPath = "/match"
     AND file "app/(app)/match/page.tsx" does NOT exist
  THEN RETURN true   -- Bug 1: missing /match page

  IF input IS ButtonClickEvent
     AND input.buttonLabel = "+ Schedule New Session"
     AND input.page = "/sessions"
     AND SessionsPage has no "use client" directive
  THEN RETURN true   -- Bug 2 (prerequisite): server component needs client directive

  IF input IS ButtonClickEvent
     AND input.buttonLabel = "+ Schedule New Session"
     AND input.page = "/sessions"
     AND button.onClick IS undefined
  THEN RETURN true   -- Bug 3: schedule button does nothing

  IF input IS ButtonClickEvent
     AND input.buttonLabel = "Join Session"
     AND input.page = "/sessions"
     AND button.onClick IS undefined
  THEN RETURN true   -- Bug 4: join button does nothing

  IF input IS ButtonClickEvent
     AND input.buttonLabel = "Cancel"
     AND input.page = "/sessions"
     AND button.onClick IS undefined
  THEN RETURN true   -- Bug 5: cancel button does nothing

  IF input IS ButtonClickEvent
     AND input.buttonLabel = "Report this person"
     AND input.page MATCHES "/match/[id]"
     AND button.onClick IS undefined
  THEN RETURN true   -- Bug 6: report button does nothing

  IF input IS FileSelectEvent
     AND input.page = "/profile"
     AND profilePhotoSection contains NO <input type="file">
  THEN RETURN true   -- Bug 7: photo upload stub

  RETURN false
END FUNCTION
```

### Examples

- **Bug 1**: User clicks "My Matches" in sidebar → browser navigates to `/match` → Next.js returns
  a 404 because `app/(app)/match/page.tsx` does not exist. Expected: matches listing page renders.
- **Bug 3**: User clicks "+ Schedule New Session" on `/sessions` → nothing happens. Expected:
  a modal opens with partner/activity/date/time fields.
- **Bug 4**: User clicks "Join Session" on an upcoming session card → nothing happens. Expected:
  a placeholder or navigation indicating the session would launch.
- **Bug 5**: User clicks "Cancel" on an upcoming session card → nothing happens. Expected: that
  session is removed from the upcoming list.
- **Bug 6**: User clicks "Report this person" on `/match/1` → nothing happens. Expected: a
  confirmation dialog opens.
- **Bug 7**: User views the profile photo section → sees "Photo upload coming soon" text, no file
  input. Expected: a file input is present; selecting a file previews it as a base64 data URL.

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Navigating to `/match/[id]` with a valid ID continues to render the full match profile page
  (contact buttons, interests, bio, "Schedule a Workout" CTA).
- The `/dashboard` page continues to display match cards, session cards, and events with all
  existing mock data.
- Clicking "Connect" on a dashboard match card continues to navigate to `/match/[id]`.
- The sessions page continues to display the upcoming sessions list, past sessions list, and
  streak card with existing mock data.
- Editing and saving profile fields (name, age, city, bio, interests, fitness level, health goals,
  emergency contact) continues to update local state and show "✓ Profile Saved!".
- "Send a Text" and "Give a Call" links on match profile pages continue to open native SMS/phone
  dialers via `sms:` and `tel:` URI schemes.
- Sidebar nav items for Dashboard, Sessions, Events, and Profile continue to navigate correctly.
- "Sign Out" continues to call Supabase auth sign-out and redirect to the landing page.

**Scope:**
All inputs that do NOT satisfy `isBugCondition` must be completely unaffected by these fixes.

---

## Hypothesized Root Cause

1. **Missing route file (Bug 1)**: `app/(app)/match/page.tsx` was never created. The sidebar nav
   links to `/match` but only the dynamic `[id]` sub-route exists.

2. **Server component with interactive requirements (Bug 7 prerequisite)**: `sessions/page.tsx`
   has no `"use client"` directive. Next.js 15 App Router pages are server components by default,
   so `useState` and `onClick` handlers cannot be used without the directive.

3. **Missing onClick handlers (Bugs 3–6)**: The buttons were scaffolded with visual styles but
   no event handlers were wired up. The schedule modal, join placeholder, cancel state mutation,
   and report dialog were deferred and never implemented.

4. **Photo upload not implemented (Bug 7)**: The profile page has a placeholder comment but no
   `<input type="file">` element, no `onChange` handler, and no state for the preview URL.

5. **match/[id]/page.tsx is a server component (Bug 6 prerequisite)**: The "Report this person"
   button needs `onClick` state, which requires `"use client"` on that file too.

---

## Correctness Properties

Property 1: Bug Condition — /match Route Renders a Matches Listing

_For any_ navigation to `/match`, the fixed app SHALL render a page listing all matched profiles
(name, age, city, interests, fitness level, and a link to each profile's detail page) using the
existing mock data, with HTTP 200 status (no 404).

**Validates: Requirements 2.1, 2.2**

Property 2: Bug Condition — Schedule Modal Opens on Button Click

_For any_ click event on the "+ Schedule New Session" button while on `/sessions`, the fixed
SessionsPage SHALL transition `scheduleModalOpen` state to `true` and render a modal containing
partner, activity, date, and time fields.

**Validates: Requirements 2.3**

Property 3: Bug Condition — Join Session Shows Feedback

_For any_ click event on a "Join Session" button on an upcoming session card, the fixed
SessionsPage SHALL navigate to a session detail route or display a visible placeholder indicating
the session would launch.

**Validates: Requirements 2.4**

Property 4: Bug Condition — Cancel Removes Exactly the Target Session

_For any_ session `s` in `upcomingSessions` where the user clicks the "Cancel" button on `s`'s
card, the fixed SessionsPage SHALL produce a new `upcomingSessions` array that does NOT contain
`s` and DOES contain all other sessions unchanged (order preserved).

**Validates: Requirements 2.5**

Property 5: Bug Condition — Report Dialog Opens on Button Click

_For any_ click event on the "Report this person" button on a match profile page, the fixed
MatchProfilePage SHALL transition `reportDialogOpen` state to `true` and render a confirmation
dialog asking the user to confirm the report.

**Validates: Requirements 2.6**

Property 6: Bug Condition — Photo Upload Previews Selected File

_For any_ `File` object `f` where `f.type` starts with `"image/"`, selecting `f` via the profile
photo `<input type="file">` SHALL cause the fixed ProfilePage to set `photoPreview` to a string
starting with `"data:image/"` and render that string as the `src` of an `<img>` element replacing
the initials avatar.

**Validates: Requirements 2.7**

Property 7: Preservation — Cancel Does Not Mutate Other Sessions

_For any_ session `s` cancelled and any other session `t` where `t.id !== s.id`, the fixed
SessionsPage SHALL preserve `t` in `upcomingSessions` with all fields identical to their values
before the cancel action.

**Validates: Requirements 3.4**

Property 8: Preservation — Non-Buggy Interactions Unchanged

_For any_ input where `isBugCondition` returns `false` (mouse clicks on existing working buttons,
sidebar navigation, sign-out, profile save, sms/tel links, dashboard rendering), the fixed code
SHALL produce the same observable behavior as the original code.

**Validates: Requirements 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.8**

---

## Fix Implementation

### Changes Required

**File 1 — CREATE: `app/(app)/match/page.tsx`**
- New client or server component (no interactivity needed — server component is fine).
- Import the same `mockMatches` array shape used in `dashboard/page.tsx`.
- Render a listing page with a header "My Matches" and one card per match showing: initials
  avatar, name + age, city, fitness badge, interest tags, match percentage, and a `Link` to
  `/match/[id]`.
- Match the inline-style pattern and design tokens (`#173124`, `#735C00`, `#E7E2D7`, `#C2C8C2`,
  `#FEF9ED`) used throughout the app.

**File 2 — MODIFY: `app/(app)/sessions/page.tsx`**
1. Add `"use client"` directive at the top of the file (required by Next.js 15 App Router for
   any component using `useState` or event handlers).
2. Convert `upcomingSessions` from a local `const` to `useState<Session[]>` initialized with the
   existing mock data.
3. Add `scheduleModalOpen` boolean state (default `false`).
4. Wire "+ Schedule New Session" button `onClick` to set `scheduleModalOpen(true)`.
5. Render a modal (using a controlled `<dialog>` element or inline conditional render — shadcn
   Dialog components use `@base-ui/react/dialog` which requires client context) with fields:
   partner (select from mock partners), activity (text input), date (date input), time (time
   input), and a "Schedule" confirm button that appends a new session to `upcomingSessions` and
   closes the modal.
6. Wire each "Join Session" button `onClick` to `router.push(\`/sessions/\${session.id}\`)` or
   show an inline "Joining…" placeholder — a simple `alert` or `router.push` to a stub route is
   acceptable for this mock-data context.
7. Wire each "Cancel" button `onClick` to filter that session's `id` out of `upcomingSessions`.

**File 3 — MODIFY: `app/(app)/match/[id]/page.tsx`**
1. Add `"use client"` directive (needed for `useState` on the report dialog).
2. Since the page becomes a client component, `params` is now a Promise — use React's `use()`
   hook (Next.js 15 pattern) to unwrap it: `const { id } = use(params)`.
3. Add `reportOpen` boolean state (default `false`).
4. Wire "Report this person" button `onClick` to `setReportOpen(true)`.
5. Render a confirmation dialog (inline conditional or shadcn Dialog) with a message like
   "Are you sure you want to report [name]?" and Confirm / Cancel buttons. Confirm closes the
   dialog and shows a brief "Report submitted" toast or resets state.

**File 4 — MODIFY: `app/(app)/profile/page.tsx`**
1. Add `photoPreview` state (`string | null`, default `null`).
2. Replace the static placeholder paragraph with an `<input type="file" accept="image/*">` and
   a visible "Upload Photo" label.
3. In the `onChange` handler, read `e.target.files?.[0]`, call `FileReader.readAsDataURL()`, and
   on `onload` set `photoPreview` to `reader.result as string`.
4. When `photoPreview` is non-null, render an `<img src={photoPreview}>` in place of the initials
   `<div>` avatar; otherwise keep the initials avatar.

---

## Testing Strategy

### Validation Approach

Two-phase approach: first run exploratory tests against the UNFIXED code to surface counterexamples
and confirm root cause analysis; then verify the fix satisfies all correctness properties and
preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate each bug on unfixed code. Confirm or refute
the root cause hypotheses.

**Test Plan**: Write tests that simulate each user action and assert the expected outcome. Run
against the unfixed codebase to observe failures.

**Test Cases**:
1. **Missing /match route**: Request `GET /match` — assert response status is NOT 404 (will fail
   on unfixed code because the file does not exist).
2. **Schedule button click**: Render `SessionsPage`, click "+ Schedule New Session", assert a
   modal element is visible (will fail — no onClick, no modal).
3. **Join button click**: Render `SessionsPage`, click "Join Session" on first card, assert
   navigation or placeholder is shown (will fail — no onClick).
4. **Cancel button click**: Render `SessionsPage`, click "Cancel" on first card, assert that
   session is no longer in the rendered list (will fail — no onClick, list unchanged).
5. **Report button click**: Render `MatchProfilePage` for id="1", click "Report this person",
   assert a dialog is visible (will fail — no onClick).
6. **Photo file input**: Render `ProfilePage`, assert a `<input type="file">` element exists
   (will fail — only static text present).

**Expected Counterexamples**:
- `/match` returns 404 (confirms missing file).
- Modal/dialog state never transitions to open (confirms missing onClick handlers).
- Session list is unchanged after Cancel click (confirms missing state mutation).
- No file input found in profile photo section (confirms stub implementation).

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed code produces the
expected behavior (Properties 1–6).

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := fixedHandler(input)
  ASSERT expectedBehavior(result)   -- per the relevant Property above
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed code
produces the same result as the original code (Properties 7–8).

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalBehavior(input) = fixedBehavior(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for the Cancel preservation check
(Property 7) because it can generate arbitrary session arrays and arbitrary cancel targets,
providing strong guarantees that only the targeted session is removed. Example-based tests cover
the remaining preservation requirements.

**Test Cases**:
1. **Cancel preservation (PBT)**: Generate random `upcomingSessions` arrays and random target
   session ids; assert that after cancel, all non-target sessions are present and unchanged.
2. **Dashboard rendering**: Navigate to `/dashboard`, assert all three mock match cards and two
   mock session cards render (unchanged by any of the fixes).
3. **Match detail page**: Navigate to `/match/1`, assert profile name, bio, contact buttons, and
   "Schedule a Workout" CTA all render correctly after the `"use client"` + `use(params)` change.
4. **Profile save**: Fill in profile fields, click "Save Profile", assert "✓ Profile Saved!"
   appears — verifying the existing save flow is unaffected by the photo upload addition.
5. **SMS/tel links**: Assert `<a href="sms:...">` and `<a href="tel:...">` elements are present
   on the match profile page after the report dialog changes.
6. **Sidebar navigation**: Assert all five nav links render and point to correct hrefs.

### Unit Tests

- Test that `app/(app)/match/page.tsx` exports a default component that renders without errors.
- Test that clicking "+ Schedule New Session" sets modal open state to `true`.
- Test that clicking "Cancel" on session id="2" removes id="2" and keeps id="1" and id="3".
- Test that clicking "Report this person" sets report dialog open state to `true`.
- Test that selecting an image file sets `photoPreview` to a string starting with `"data:image/"`.
- Test edge case: Cancel when only one session remains — list becomes empty, no crash.
- Test edge case: Schedule modal "Cancel" button closes modal without adding a session.

### Property-Based Tests

- **Property 4 (Cancel removes target)**: For any array of sessions and any target id present in
  the array, after cancel the array does not contain the target id.
- **Property 7 (Cancel preserves others)**: For any array of sessions and any target id, all
  sessions with a different id are present and field-identical after cancel.
- **Property 6 (Photo preview)**: For any `File` with `type` starting with `"image/"`, the
  `onChange` handler produces a `photoPreview` string starting with `"data:image/"`.

### Integration Tests

- Full flow: navigate sidebar → My Matches → click a match card → verify `/match/[id]` renders
  correctly (tests Bug 1 fix + preservation of match detail page).
- Full flow: sessions page → Schedule New Session → fill form → submit → verify new session
  appears in upcoming list.
- Full flow: sessions page → Cancel a session → verify it disappears → verify other sessions
  remain.
- Full flow: match profile page → Report this person → confirm dialog → verify dialog closes.
- Full flow: profile page → upload photo → verify preview replaces initials avatar → save profile
  → verify "✓ Profile Saved!" still appears.
