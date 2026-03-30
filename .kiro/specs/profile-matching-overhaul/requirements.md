# Requirements Document

## Introduction

Joyn is an app for elderly Arizonans designed to combat loneliness. An audit revealed that the current profile and matching system is fitness-first — collecting only fitness level and health goals, and ranking matches primarily by fitness compatibility. This is misaligned with the app's core mission.

This feature overhauls the profile to capture who a person is (life stage, social preferences, what they're looking for, availability, and a richer interest set), updates the matching algorithm to weight shared hobbies and social compatibility above fitness, updates match card display to reflect the new signals, and migrates the database schema to support the new fields.

## Glossary

- **Profile**: The Supabase `profiles` row representing a Joyn user's self-described identity and preferences.
- **Profile_Page**: The client component at `app/(app)/profile/page.tsx` where users view and edit their Profile.
- **Match_Card**: The card component rendered on the dashboard (`app/(app)/dashboard/page.tsx`) representing a suggested connection.
- **Match_Profile_Page**: The detail page at `app/(app)/match/[id]/page.tsx` showing a full profile for a suggested match.
- **Matching_Algorithm**: The server-side logic that computes a compatibility score between two Profiles and produces an ordered list of suggested matches.
- **Compatibility_Score**: A numeric value (0–100) produced by the Matching_Algorithm representing how well two users align across all signals.
- **Interest**: A hobby or activity a user selects from the canonical interest list.
- **Life_Stage**: A single-select field describing a user's current life situation (e.g., Recently retired, Widowed).
- **Social_Comfort**: A single-select field describing a user's preferred group size for social interaction.
- **Looking_For**: A multi-select field describing what kind of connection a user seeks (e.g., activity buddy, someone to talk to).
- **Availability**: A multi-select field describing when a user is generally free (Mornings, Afternoons, Evenings, Weekends).
- **Database**: The Supabase PostgreSQL instance backing Joyn.
- **Migration**: A SQL file in `supabase/migrations/` that alters the Database schema.

---

## Requirements

### Requirement 1: Expanded Interest List

**User Story:** As a Joyn user, I want to select from a broad set of hobbies and interests beyond fitness activities, so that my profile reflects who I actually am and I get matched with people who share my real interests.

#### Acceptance Criteria

1. THE Profile_Page SHALL display a selectable interest list containing at minimum the following options: Chess, Gardening, Cooking, Reading, Music, Painting, Birdwatching, Photography, Card Games, Board Games, Volunteering, Travel, History, Grandchildren, Pets, Movies, Dancing, Swimming, Cycling, Walking, Chair Yoga, Stretching.
2. THE Profile_Page SHALL retain all interests previously available (Chair Yoga, Walking, Stretching, Light Resistance, Gardening, Cooking, Reading, Music, Painting, Birdwatching, Photography, Dancing, Swimming, Cycling, Card Games, Board Games, Volunteering, Travel) so that existing user selections are not invalidated.
3. WHEN a user taps an interest chip, THE Profile_Page SHALL toggle that interest's selected state immediately without a page reload.
4. WHEN a user saves their profile, THE Profile_Page SHALL persist all selected interests to the Database via the `user_interests` junction table.
5. THE Database SHALL contain a seeded `interests` row for each interest in the canonical list defined in Acceptance Criterion 1.

---

### Requirement 2: Life Stage Field

**User Story:** As a Joyn user, I want to describe my current life stage, so that I can be matched with people who understand my situation.

#### Acceptance Criteria

1. THE Profile_Page SHALL display a "Life Stage" single-select field with the options: Recently retired, Widowed, Recently relocated, Empty nester, Long-time resident, Other.
2. WHEN a user selects a Life_Stage option, THE Profile_Page SHALL reflect the selection visually (highlighted/selected state) without requiring a page reload.
3. WHEN a user saves their profile, THE Profile_Page SHALL persist the selected Life_Stage value to the `life_stage` column on the `profiles` table.
4. THE Database `profiles` table SHALL contain a `life_stage` column of type `TEXT` with a CHECK constraint permitting only: `recently_retired`, `widowed`, `recently_relocated`, `empty_nester`, `long_time_resident`, `other`, or NULL.
5. IF a user has not selected a Life_Stage, THEN THE Profile_Page SHALL save NULL to the `life_stage` column and SHALL NOT block profile save.

---

### Requirement 3: Social Comfort Level Field

**User Story:** As a Joyn user, I want to indicate my preferred social group size, so that I'm matched with people whose social style is compatible with mine.

#### Acceptance Criteria

1. THE Profile_Page SHALL display a "Social Comfort Level" single-select field with the options: "I prefer 1-on-1 time", "I enjoy small groups (2–4)", "I'm comfortable in larger groups".
2. WHEN a user selects a Social_Comfort option, THE Profile_Page SHALL reflect the selection visually without requiring a page reload.
3. WHEN a user saves their profile, THE Profile_Page SHALL persist the selected Social_Comfort value to the `social_comfort` column on the `profiles` table.
4. THE Database `profiles` table SHALL contain a `social_comfort` column of type `TEXT` with a CHECK constraint permitting only: `one_on_one`, `small_group`, `large_group`, or NULL.
5. IF a user has not selected a Social_Comfort level, THEN THE Profile_Page SHALL save NULL and SHALL NOT block profile save.

---

### Requirement 4: What I'm Looking For Field

**User Story:** As a Joyn user, I want to specify what kind of connection I'm seeking, so that I'm matched with people who want the same kind of relationship.

#### Acceptance Criteria

1. THE Profile_Page SHALL display a "What I'm Looking For" multi-select field with the options: "An activity buddy", "Someone to talk to", "Group events and outings", "Volunteer opportunities", "All of the above".
2. WHEN a user selects "All of the above", THE Profile_Page SHALL treat it as selecting all four other options for matching purposes.
3. WHEN a user saves their profile, THE Profile_Page SHALL persist the selected Looking_For values as a `TEXT[]` array to the `looking_for` column on the `profiles` table.
4. THE Database `profiles` table SHALL contain a `looking_for` column of type `TEXT[]`.
5. IF a user has not selected any Looking_For option, THEN THE Profile_Page SHALL save an empty array and SHALL NOT block profile save.

---

### Requirement 5: Availability Field

**User Story:** As a Joyn user, I want to indicate when I'm generally available, so that I'm matched with people whose schedules overlap with mine.

#### Acceptance Criteria

1. THE Profile_Page SHALL display an "Availability" multi-select field with the options: Mornings, Afternoons, Evenings, Weekends.
2. WHEN a user taps an Availability option, THE Profile_Page SHALL toggle that option's selected state immediately without a page reload.
3. WHEN a user saves their profile, THE Profile_Page SHALL persist the selected Availability values as a `TEXT[]` array to the `availability` column on the `profiles` table.
4. THE Database `profiles` table SHALL contain an `availability` column of type `TEXT[]`.
5. IF a user has not selected any Availability option, THEN THE Profile_Page SHALL save an empty array and SHALL NOT block profile save.

---

### Requirement 6: Database Schema Migration

**User Story:** As a developer, I want the Supabase `profiles` table to store the new profile fields, so that the application can persist and query them.

#### Acceptance Criteria

1. THE Migration SHALL add a `life_stage TEXT` column to the `profiles` table with a CHECK constraint as specified in Requirement 2, Criterion 4.
2. THE Migration SHALL add a `social_comfort TEXT` column to the `profiles` table with a CHECK constraint as specified in Requirement 3, Criterion 4.
3. THE Migration SHALL add a `looking_for TEXT[]` column to the `profiles` table defaulting to `'{}'`.
4. THE Migration SHALL add an `availability TEXT[]` column to the `profiles` table defaulting to `'{}'`.
5. THE Migration SHALL insert any new canonical interests (Chess, History, Grandchildren, Pets, Movies, Card Games, Board Games) into the `interests` table using `ON CONFLICT DO NOTHING` so that re-running the migration is safe.
6. THE Migration SHALL be a new file in `supabase/migrations/` and SHALL NOT modify `001_initial.sql`.
7. WHEN the Migration is applied to a Database that already has existing `profiles` rows, THE Migration SHALL NOT delete or alter any existing profile data.

---

### Requirement 7: Updated Matching Algorithm Signals

**User Story:** As a Joyn user, I want to be matched with people based on shared hobbies and social compatibility rather than fitness level, so that my matches reflect genuine connection potential.

#### Acceptance Criteria

1. THE Matching_Algorithm SHALL compute the Compatibility_Score using the following signal weights: shared interests (primary, ≥50% of score weight), Life_Stage compatibility (secondary, ≥20% of score weight), Social_Comfort compatibility (secondary, ≥15% of score weight), fitness level similarity (tertiary, ≤15% of score weight).
2. WHEN two users share at least one Interest, THE Matching_Algorithm SHALL increase their Compatibility_Score proportionally to the number of shared interests relative to the union of their interest sets (Jaccard similarity).
3. WHEN two users have the same Life_Stage value, THE Matching_Algorithm SHALL apply a positive score bonus to their Compatibility_Score.
4. WHEN two users have the same Social_Comfort value, THE Matching_Algorithm SHALL apply a positive score bonus to their Compatibility_Score.
5. WHEN two users have overlapping Availability values, THE Matching_Algorithm SHALL apply a positive score bonus to their Compatibility_Score.
6. THE Matching_Algorithm SHALL produce a Compatibility_Score in the range [0, 100] for any pair of Profiles.
7. WHEN two users have no shared interests, no Life_Stage match, and no Social_Comfort match, THE Matching_Algorithm SHALL still produce a Compatibility_Score of at least 0 and SHALL NOT error.

---

### Requirement 8: Updated Match Card Display

**User Story:** As a Joyn user, I want match cards to show who a person is rather than just their fitness level, so that I can make a more meaningful decision about connecting.

#### Acceptance Criteria

1. THE Match_Card SHALL display the label "compatibility" (not "match") beneath the Compatibility_Score percentage.
2. THE Match_Card SHALL display a short bio snippet (up to 120 characters, truncated with ellipsis if longer) from the matched user's `bio` field.
3. THE Match_Card SHALL display a "Looking for:" line showing the matched user's Looking_For values as a comma-separated string.
4. THE Match_Card SHALL display the fitness level badge at a visually smaller size and lower visual prominence than the interest tags and bio snippet (e.g., smaller font, secondary color, not the first element shown).
5. WHEN a matched user has no Looking_For values set, THE Match_Card SHALL omit the "Looking for:" line rather than displaying an empty value.
6. WHEN a matched user has no bio set, THE Match_Card SHALL omit the bio snippet rather than displaying an empty string.
7. THE Match_Card SHALL retain the existing avatar, name, age, city, interest tags, and Connect button.

---

### Requirement 9: Updated Match Profile Page

**User Story:** As a Joyn user, I want the full match profile page to reflect the new profile fields, so that I can learn more about a potential connection before reaching out.

#### Acceptance Criteria

1. THE Match_Profile_Page SHALL display the matched user's Life_Stage value in a human-readable label (e.g., "Recently retired") when the value is set.
2. THE Match_Profile_Page SHALL display the matched user's Looking_For values when set.
3. THE Match_Profile_Page SHALL display the matched user's Availability values when set.
4. THE Match_Profile_Page SHALL demote the fitness level badge to a secondary position — it SHALL NOT be the first or most prominent descriptor shown after the user's name and city.
5. THE Match_Profile_Page SHALL retain the existing bio, interests, and contact action buttons (text, call, video session).
6. WHEN the "Schedule a Workout" CTA is present, THE Match_Profile_Page SHALL relabel it to "Schedule a Meetup with [Name]" to reflect the non-fitness-first mission.

---

### Requirement 10: Accessibility

**User Story:** As an elderly Joyn user, I want all new profile fields and match cards to be accessible, so that I can use the app regardless of assistive technology or visual ability.

#### Acceptance Criteria

1. THE Profile_Page SHALL assign a visible `<label>` element or `aria-label` attribute to every new form field (Life Stage, Social Comfort, What I'm Looking For, Availability).
2. WHEN a toggle button (interest chip, Life Stage option, Social Comfort option, Availability option) is selected, THE Profile_Page SHALL set `aria-pressed="true"` on that button element.
3. WHEN a toggle button is not selected, THE Profile_Page SHALL set `aria-pressed="false"` on that button element.
4. THE Profile_Page SHALL ensure all interactive elements have a minimum touch target size of 44×44 CSS pixels.
5. THE Match_Card SHALL provide an `aria-label` on the Compatibility_Score element that reads "[score]% compatibility with [name]" so that screen readers announce it meaningfully.
6. THE Match_Card SHALL ensure the bio snippet and "Looking for:" line are rendered in standard text elements (not `aria-hidden`) so that screen readers can access them.
7. THE Profile_Page SHALL maintain a color contrast ratio of at least 4.5:1 between text and background for all new field labels and option text, consistent with the existing design tokens.
