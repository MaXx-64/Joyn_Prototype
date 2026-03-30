# Requirements Document

## Introduction

The events page in the Joyn app currently skews heavily toward fitness activities, which excludes a large portion of elderly Arizonans who are seeking emotional support, social connection, intellectual engagement, or purpose through volunteering. This feature expands the events page by introducing five new event categories (Support, Hobby, Volunteer, Intergenerational, and an expanded Social), adding at least six new mock events, updating the category filter tabs, and assigning distinct accessible color badges to each category — all within the existing client-side mock data and inline-style architecture.

## Glossary

- **Events_Page**: The client component at `app/(app)/events/page.tsx` that renders the events listing and category filter.
- **Category_Filter**: The row of pill-shaped toggle buttons that filter the visible events by category.
- **Category_Badge**: The colored label rendered in the top-left of each event card indicating its category.
- **Event_Card**: The rounded card UI element that displays a single event's name, date, time, location, description, and category badge.
- **allEvents**: The in-memory array of mock event objects used as the data source for the Events_Page.
- **categoryColors**: The `Record<string, { bg: string; text: string }>` map that drives Category_Badge colors.
- **categories**: The ordered array of category name strings that drives the Category_Filter tabs.
- **Design_Tokens**: The established color constants: primary `#173124`, gold `#735C00`, surface `#FEF9ED`, card `#E7E2D7`, border `#C2C8C2`.

---

## Requirements

### Requirement 1: New Event Categories

**User Story:** As an elderly Arizonan, I want to browse events beyond fitness so that I can find activities that match my emotional, social, intellectual, and civic interests.

#### Acceptance Criteria

1. THE Events_Page SHALL recognize five new category values: `"Support"`, `"Hobby"`, `"Volunteer"`, `"Intergenerational"`, and an expanded `"Social"` (already exists).
2. THE Events_Page SHALL continue to recognize the three existing category values: `"Fitness"`, `"Social"`, and `"Educational"`.
3. WHEN an event's `category` field is set to `"Support"`, THE Events_Page SHALL render that event under the Support category.
4. WHEN an event's `category` field is set to `"Hobby"`, THE Events_Page SHALL render that event under the Hobby category.
5. WHEN an event's `category` field is set to `"Volunteer"`, THE Events_Page SHALL render that event under the Volunteer category.
6. WHEN an event's `category` field is set to `"Intergenerational"`, THE Events_Page SHALL render that event under the Intergenerational category.

---

### Requirement 2: New Mock Events

**User Story:** As an elderly Arizonan, I want to see a variety of real-feeling local events so that I can discover activities that feel relevant to my life in the Valley.

#### Acceptance Criteria

1. THE allEvents array SHALL contain at least six new event objects in addition to the eight existing events.
2. THE allEvents array SHALL include an event named `"Widows & Widowers Support Circle"` with category `"Support"` located at Mesa Senior Center.
3. THE allEvents array SHALL include an event named `"Morning Coffee & Conversation"` with category `"Social"` located in Scottsdale.
4. THE allEvents array SHALL include an event named `"Chess Club for Seniors"` with category `"Hobby"` located in Chandler.
5. THE allEvents array SHALL include an event named `"Volunteer: Read to Kids at Library"` with category `"Volunteer"` located in Phoenix.
6. THE allEvents array SHALL include an event named `"Intergenerational Cooking Class"` with category `"Intergenerational"` located in Tempe.
7. THE allEvents array SHALL include an event named `"Book Club: Arizona Authors"` with category `"Hobby"` located in Glendale.
8. WHEN the Category_Filter is set to `"All"`, THE Events_Page SHALL display all new events alongside all existing events.
9. WHEN the Category_Filter is set to a specific category, THE Events_Page SHALL display only events whose `category` field matches that category.

---

### Requirement 3: Updated Category Filter Tabs

**User Story:** As an elderly Arizonan, I want to filter events by the new categories so that I can quickly find the type of activity I am looking for.

#### Acceptance Criteria

1. THE Category_Filter SHALL render tabs for all of the following categories in order: `"All"`, `"Fitness"`, `"Social"`, `"Educational"`, `"Support"`, `"Hobby"`, `"Volunteer"`, `"Intergenerational"`.
2. THE Category_Filter SHALL retain the existing `"All"`, `"Fitness"`, `"Social"`, and `"Educational"` tabs without modification to their behavior.
3. WHEN a user activates a new category tab, THE Category_Filter SHALL update the active selection and THE Events_Page SHALL re-render showing only events matching that category.
4. WHEN no events exist for the active category, THE Events_Page SHALL render an empty state rather than an error.
5. THE Category_Filter tabs SHALL wrap onto multiple lines on narrow viewports without horizontal overflow.

---

### Requirement 4: Category Badge Colors

**User Story:** As an elderly Arizonan, I want each event category to have a visually distinct color badge so that I can identify the event type at a glance.

#### Acceptance Criteria

1. THE categoryColors map SHALL include entries for all eight categories: `"Fitness"`, `"Social"`, `"Educational"`, `"Support"`, `"Hobby"`, `"Volunteer"`, and `"Intergenerational"`.
2. THE categoryColors map SHALL assign the `"Support"` category a warm amber/orange background tone to feel caring rather than clinical.
3. THE categoryColors map SHALL assign the `"Volunteer"` category a teal/green background tone.
4. THE categoryColors map SHALL assign the `"Hobby"` category a soft purple background tone.
5. THE categoryColors map SHALL assign the `"Intergenerational"` category a warm blue background tone.
6. THE categoryColors map SHALL preserve the existing color assignments for `"Fitness"`, `"Social"`, and `"Educational"` without change.
7. WHEN an event's category has no entry in categoryColors, THE Category_Badge SHALL fall back to background `#E5E0D5` and text `#173124`.
8. FOR ALL category badge color combinations, the contrast ratio between the badge text color and badge background color SHALL meet WCAG AA contrast requirements (minimum 4.5:1 for normal text).

---

### Requirement 5: Accessibility

**User Story:** As an elderly Arizonan with visual or motor impairments, I want the events page to be navigable and readable so that I can use it independently.

#### Acceptance Criteria

1. THE Category_Filter tabs SHALL each have a minimum touch target height of 44px.
2. THE Category_Filter tabs SHALL each have a minimum touch target width of 44px.
3. WHEN a Category_Filter tab is the active selection, THE Category_Filter tab SHALL communicate its selected state via an `aria-pressed="true"` attribute.
4. WHEN a Category_Filter tab is not the active selection, THE Category_Filter tab SHALL communicate its unselected state via an `aria-pressed="false"` attribute.
5. THE Event_Card "Learn More" button SHALL have a minimum touch target height of 48px.
6. WHEN the Events_Page renders, THE Events_Page SHALL use semantic heading elements (`h1` for the page title, `h3` for event card titles) to preserve document outline structure.
7. THE Category_Badge span SHALL include an `aria-label` attribute that reads `"Category: [category name]"` so that screen readers announce the category meaningfully.
