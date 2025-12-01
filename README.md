# Allo Bank Frontend Technical Assignment

In this assignment, you’re assigned to create a website that displays rockets. This website only has two screens: rocket list screen and rocket detail screen. Here are the requirements:

### Functional Requirements
- As a user, I want to see a list of rockets in the rocket list screen (Show each rocket image, rocket name, and rocket description)
- As a user, I want to be able to filter the rockets in the rocket list screen
- As a user, I want to be able to add the new rocket in the rocket list screen
- As a user, I want to be able to see the rocket detail by clicking a rocket in the rocket list screen (Show rocket image, rocket name, rocket description, cost per launch, country, first flight)

### Non-Functional Requirements
- Use Space-X API (https://github.com/r-spacex/SpaceX-API) for getting the rocket data
- Implement routers
- Implement state management
- Implement lifecycles
- Create components based will be + points
- UI states (Loading, Fail/Retry, and Success)
- Show loading when waiting response from API
- If an error occurred, user can retry by pressing retry button
- Show result when get response from API

### Nice to have characteristics
Responsive design
You don’t need to worry about the detailed design, we’re not interested in your artistic prowess (for now), put your efforts on creating a readable/clean/maintainable source code.

Good luck with your assignment! Don't hesitate to contact us if you have any questions about the assignment process.

---

## Implementation Notes

- Stack: Vite + Vue 3 + TypeScript + Vuetify + Pinia + Vue Router.
- Rockets data fetched from SpaceX API v4; local additions stored client-side.
- UI states covered: loading skeletons, error + retry, success, empty state with filter hint.

## Getting Started

1. Install deps: `npm install`
2. Copy env example: `cp .env.example .env` (edit `VITE_SPACEX_API` if needed)
3. Run dev server: `npm run dev`

## Scripts

- `npm run dev` – start development server
- `npm run lint` – ESLint (no auto-fix, fails on warnings)
- `npm run type-check` – Vue TSC project build
- `npm run build` – type-check + production build
- `npm run test` – Vitest (store tests)
- `npm run check` / `npm run ci` – lint + type-check + build-only + tests (CI-friendly)

## Env

`VITE_SPACEX_API` defaults to `https://api.spacexdata.com/v4` (see `.env.example`).
