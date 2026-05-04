# SmartHR AI Frontend

React + Vite + TypeScript frontend for SmartHR AI.

## Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Zustand
- Axios

## Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

Build:

```bash
npm run build
```

## Current Pages

- `/login`
- `/forgot-password`
- `/reset-password`
- `/register`
- `/dashboard`
- `/attendance`
- `/leaves`
- `/payroll`
- `/jobs`
- `/applications`
- `/employees`
- `/profile`

## Recent Functional Updates

- Added forgot/reset password UI flow.
- Added department-head-aware UI visibility.
- Added manager attendance calendar and daily detail panel.
- Added notifications polling and in-app read actions.
- Updated leave review UI for multi-stage approval process.

## Notes

- Auth token is managed in Zustand and attached through Axios interceptors.
- On `401`, users are logged out and redirected to `/login`.
- Some bundles may exceed Vite warning size in production build; this is currently a warning, not a build failure.
