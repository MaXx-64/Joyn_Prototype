# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Seven UI Dead Ends
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bugs exist
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior — it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate each bug exists
  - **Scoped PBT Approach**: Scope each sub-property to the concrete failing case(s) for reproducibility
  - Test 1a — `/match` route: assert `GET /match` returns HTTP 200 (not 404); isBugCondition: file `app/(app)/match/page.tsx` does not exist
  - Test 1b — Schedule modal: render `SessionsPage`, click "+ Schedule New Session", assert a modal element is visible; isBugCondition: button.onClick is undefined
  - Test 1c — Join session: render `SessionsPage`, click "Join Session" on first card, assert navigation or placeholder is shown; isBugCondition: button.onClick is undefined
  - Test 1d — Cancel session: render `SessionsPage`, click "Cancel" on session id="1", assert that session is no longer in the rendered list; isBugCondition: button.onClick is undefined
  - Test 1e — Report dialog: render `MatchProfilePage` for id="1", click "Report this person", assert a dialog is visible; isBugCondition: button.onClick is undefined
  - Test 1f — Photo file input: render `ProfilePage`, assert a `<input type="file">` element exists; isBugCondition: profilePhotoSection contains no `<input type="file">`
  - Run all tests on UNFIXED code
  - **EXPECTED OUTCOME**: All tests FAIL (this is correct — it proves the bugs exist)
  - Document counterexamples found (e.g., "/match returns 404", "modal never opens", "session list unchanged after Cancel")
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Buggy Interactions Unchanged
  - **IMPORTANT**: Follow observation-first methodology — run UNFIXED code with non-buggy inputs first
  - Observe: `/match/1` renders Margaret's full profile (name, bio, contact buttons, "Schedule a Workout" CTA) on unfixed code
  - Observe: `/dashboard` renders all 3 mock match cards and 2 mock session cards on unfixed code
  - Observe: profile save flow shows "✓ Profile Saved!" after clicking Save Profile on unfixed code
  - Observe: `<a href="sms:...">` and `<a href="tel:...">` elements are present on match profile page on unfixed code
  - Observe: sidebar nav links render with correct hrefs on unfixed code
  - Write property-based test (PBT): for any session array and any cancel target id, all sessions with a different id are present and field-identical after cancel (from Preservation Requirements in design — Property 7)
  - Write example tests for the remaining preservation cases above
  - Verify all tests PASS on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 3. Fix all seven bugs

  - [x] 3.1 Create `app/(app)/match/page.tsx` — matches listing page
    - New server component (no interactivity needed)
    - Import the same `mockMatches` array shape from `dashboard/page.tsx`
    - Render header "My Matches" and one card per match: initials avatar, name + age, city, fitness badge, interest tags, match %, and a `Link` to `/match/[id]`
    - Match inline-style pattern and design tokens (`#173124`, `#735C00`, `#E7E2D7`, `#C2C8C2`, `#FEF9ED`)
    - _Bug_Condition: isBugCondition(NavigationEvent{ targetPath: "/match" }) — file does not exist_
    - _Expected_Behavior: GET /match returns HTTP 200 and renders matches listing (Property 1 from design)_
    - _Preservation: /match/[id] detail page, /dashboard, sidebar nav all continue to work (Properties 7–8 from design)_
    - _Requirements: 2.1, 2.2_

  - [x] 3.2 Fix `app/(app)/sessions/page.tsx` — add client directive, state, and onClick handlers
    - Add `"use client"` directive at top of file (required by Next.js 15 App Router for useState/onClick)
    - Convert `upcomingSessions` from `const` to `useState<Session[]>` initialized with existing mock data
    - Add `scheduleModalOpen` boolean state (default `false`)
    - Wire "+ Schedule New Session" button `onClick` → `setScheduleModalOpen(true)`
    - Render schedule modal (inline conditional) with: partner select, activity text input, date input, time input, "Schedule" button (appends new session + closes modal), "Cancel" button (closes modal without adding session)
    - Wire each "Join Session" button `onClick` → `router.push(\`/sessions/\${session.id}\`)` using `useRouter`
    - Wire each "Cancel" button `onClick` → filter that session's id out of `upcomingSessions`
    - _Bug_Condition: isBugCondition(ButtonClickEvent{ buttonLabel: "+ Schedule New Session" | "Join Session" | "Cancel", page: "/sessions" })_
    - _Expected_Behavior: modal opens (Property 2), navigation shown (Property 3), session removed (Property 4) from design_
    - _Preservation: upcoming sessions list, past sessions list, streak card continue to render with existing mock data (Requirement 3.4)_
    - _Requirements: 2.3, 2.4, 2.5_

  - [x] 3.3 Fix `app/(app)/match/[id]/page.tsx` — add client directive and report dialog
    - Add `"use client"` directive at top of file (needed for useState on report dialog)
    - Since page becomes a client component, `params` is now a Promise — use React's `use()` hook to unwrap: `const { id } = use(params)` (Next.js 15 client component pattern)
    - Add `reportOpen` boolean state (default `false`)
    - Wire "Report this person" button `onClick` → `setReportOpen(true)`
    - Render confirmation dialog (inline conditional) with "Are you sure you want to report [name]?" and Confirm / Cancel buttons; Confirm closes dialog, Cancel closes dialog
    - _Bug_Condition: isBugCondition(ButtonClickEvent{ buttonLabel: "Report this person", page: "/match/[id]" })_
    - _Expected_Behavior: reportOpen transitions to true and dialog renders (Property 5 from design)_
    - _Preservation: contact buttons (sms/tel), interests, bio, "Schedule a Workout" CTA all continue to render (Requirements 3.1, 3.6)_
    - _Requirements: 2.6, 3.1, 3.6_

  - [x] 3.4 Fix `app/(app)/profile/page.tsx` — add photo upload and preview
    - Add `photoPreview` state (`string | null`, default `null`)
    - Replace static placeholder paragraph ("Photo upload coming soon...") with `<input type="file" accept="image/*">` and a visible "Upload Photo" label
    - In `onChange` handler: read `e.target.files?.[0]`, call `FileReader.readAsDataURL()`, on `onload` set `photoPreview` to `reader.result as string`
    - When `photoPreview` is non-null, render `<img src={photoPreview}>` replacing the initials `<div>` avatar; otherwise keep initials avatar
    - _Bug_Condition: isBugCondition(FileSelectEvent{ page: "/profile" }) — no `<input type="file">` present_
    - _Expected_Behavior: photoPreview set to string starting with "data:image/" and rendered as <img> src (Property 6 from design)_
    - _Preservation: profile save flow ("✓ Profile Saved!"), all other profile fields continue to work (Requirement 3.5)_
    - _Requirements: 2.7, 3.5_

  - [x] 3.5 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Seven UI Dead Ends Resolved
    - **IMPORTANT**: Re-run the SAME tests from task 1 — do NOT write new tests
    - The tests from task 1 encode the expected behavior; passing confirms bugs are fixed
    - Run all six sub-tests (1a–1f) from task 1 against the fixed code
    - **EXPECTED OUTCOME**: All tests PASS (confirms all seven bugs are fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [x] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Buggy Interactions Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run all preservation tests (PBT cancel preservation + example-based tests) from task 2 against the fixed code
    - **EXPECTED OUTCOME**: All tests PASS (confirms no regressions)
    - Confirm all non-buggy interactions are byte-for-byte equivalent to pre-fix behavior

- [x] 4. Checkpoint — Ensure all tests pass
  - Run the full test suite
  - Confirm Property 1 (bug condition) tests pass — all seven bugs fixed
  - Confirm Property 2 (preservation) tests pass — no regressions introduced
  - Ensure all tests pass; ask the user if questions arise
