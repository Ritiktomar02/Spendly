---
name: spendly-ui-designer
description: Designs and generates modern, production-ready UI for Spendly, a personal expense tracker built with React + Vite + Tailwind CSS v3. Produces clean fintech-style pages and components such as cards, forms, tables, dashboards, modals, and navigation with consistent spacing, rounded corners, subtle shadows, and clear visual hierarchy. Use this skill whenever the user asks to design, build, create, redesign, improve, or style any Spendly page, screen, section, or component.
disable-model-invocation: true
---

# Spendly UI Designer

You are designing frontend UI for **Spendly**, a personal expense tracker built with React + Vite + Tailwind CSS v3.

The goal is to create a polished, modern fintech-style interface that feels consistent across the entire application.

## Spendly Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS v3
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Language:** JavaScript
- **Modules:** ES Modules

Only work on the frontend unless the user explicitly asks for backend changes.

Do not introduce Vue, Angular, Bootstrap, CSS-in-JS, or another CSS framework.

---

## Before Designing

Before creating or modifying UI, inspect the existing project when files are available.

Check:

- `frontend/src/components/`
- `frontend/src/pages/`
- `frontend/src/index.css`
- `frontend/src/App.jsx`

Look for and reuse:

- Existing colors
- Typography
- Spacing
- Border radius
- Buttons
- Cards
- Inputs
- Navigation
- Footer
- Existing responsive behavior

The new UI should look like part of the same application.

Do not redesign existing components unless required.

---

## Design Language

When no existing design reference is available, use a clean fintech-style design.

### Layout

- Use card-based sections.
- Maintain generous whitespace.
- Keep content hierarchy clear.
- Prefer left-aligned content.
- Use centered layouts mainly for authentication and empty states.
- Keep pages responsive.

### Spacing

Follow Tailwind's spacing scale.

Prefer consistent values such as:

- `p-4`
- `p-6`
- `gap-4`
- `gap-6`
- `mt-6`
- `mb-8`

Avoid arbitrary spacing unless genuinely necessary.

### Cards

Prefer:

- Rounded corners
- Subtle borders
- Very light shadows
- Clear internal spacing

Avoid heavy shadows, excessive gradients, and glowing effects.

### Typography

Use the existing project font and type scale.

Typical hierarchy:

- Page heading: `text-2xl` / `text-3xl`
- Section heading: `text-lg` / `text-xl`
- Body: `text-sm` / `text-base`
- Supporting text: `text-sm`

Use `font-semibold` for important headings and values.

For financial amounts, use tabular numbers where appropriate.

---

## Colors

Reuse existing Spendly color classes and CSS variables.

Do not introduce random colors.

Use:

- One primary accent
- Neutral colors for backgrounds and text
- Green for positive values
- Red for expenses or negative values
- Amber for warnings

Do not hardcode hex colors inside React components.

If a new color token is genuinely required, add it to the existing global styling system rather than scattering hex values throughout components.

---

## Components

Prefer reusable React components when appropriate.

Existing reusable components should be reused before creating new ones.

Typical structure:

```text
frontend/src/
├── components/
├── pages/
├── services/
├── App.jsx
├── index.css
└── main.jsx
```

Use:

- `PascalCase` for component names
- `camelCase` for variables and functions

Keep components focused and readable.

Do not create unnecessary abstractions.

---

## Icons

If an icon library already exists in the project, reuse it.

If no icon library exists, do not automatically install one unless icons are important to the requested design.

Prefer meaningful icons such as:

- Expense: wallet, credit-card, arrow-down-right
- Income: wallet, arrow-up-right, trending-up
- Category: tag, folder, pie-chart
- Add: plus, plus-circle
- Settings: settings
- Date: calendar
- Search: search
- Filter: filter

Do not add icons everywhere.

Use icons to improve understanding, not decoration.

---

## Forms

Forms should have:

- Clear labels
- Consistent input styling
- Appropriate spacing
- Visible focus states
- Clear validation/error states
- Helpful placeholder text when appropriate

Do not rely only on placeholder text as a label.

---

## Tables

For transaction tables:

- Keep column alignment consistent.
- Right-align monetary values.
- Use clear category badges.
- Use subtle row borders or hover states.
- Make tables horizontally scrollable on small screens.

Avoid overly dense tables.

---

## Responsive Design

Design mobile-first.

At smaller widths:

- Stack cards vertically.
- Reduce unnecessary horizontal spacing.
- Keep buttons usable.
- Make tables horizontally scrollable.
- Prevent text and amounts from overflowing.

Do not treat mobile responsiveness as an afterthought.

---

## Data

When building UI before backend integration:

- Use simple hardcoded JavaScript objects/arrays.
- Clearly separate mock data from UI logic.
- Do not create fake API calls.
- Do not modify the database.

When backend integration is explicitly requested, use the existing API architecture and `frontend/src/services/`.

---

## What to Avoid

Do not:

- Introduce another CSS framework.
- Rewrite existing pages unnecessarily.
- Change the project's architecture.
- Add unnecessary dependencies.
- Overuse gradients.
- Use excessive shadows.
- Use random colors.
- Create unnecessarily complex animations.
- Add excessive icons.
- Create duplicate components.
- Build backend functionality when only UI is requested.
- Implement future features without being asked.

---

## Output Structure

When fulfilling a UI design request:

### 1. UI Plan

Give a short 2–5 bullet plan describing:

- Main sections
- Important UX decisions
- Responsive behavior

### 2. Code

Provide the complete relevant React/Tailwind implementation.

Clearly identify each file, for example:

```text
frontend/src/pages/ProfilePage.jsx
```

If a reusable component is required:

```text
frontend/src/components/...
```

Only include files that actually need to be created or changed.

### 3. Integration Note

Briefly explain:

- Where the component/page is used.
- Whether `App.jsx` needs a route.
- Whether any existing component needs updating.
- Whether backend integration is required.

---

## Handling Ambiguity

If the request is under-specified, make reasonable design decisions based on the existing Spendly UI.

Do not ask unnecessary questions.

Ask only when missing information would materially change the implementation.

---

## Core Principle

**Consistency over novelty.**

The UI should feel like one cohesive Spendly application.

Reuse existing components, styles, spacing, colors, and patterns before introducing new ones.

Prefer a simple, polished implementation over a complex design.
