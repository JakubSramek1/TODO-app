# Zentask – Todo Application

This project is a full-stack todo application built with **React + TypeScript**, **Chakra UI v3**, and a lightweight **Express/NeDB** backend. It provides secure authentication and a polished task management experience.

![App preview](./src/assets/readme/banner.png)

## Quick start

```bash
npm install
npm start
```

This command launches:

- the React client (`npm run start-react`) at [http://localhost:3000](http://localhost:3000)
- the Node.js API (`npm run start-server`) at [http://localhost:3001](http://localhost:3001)

### Testing

Unit tests run through Jest:

```bash
npm run test
```

### Demo credentials

| Username | Password |
| -------- | -------- |
| `test`   | `test`   |

Use these credentials on the login screen to explore the application immediately.

> **Note:** Leaving the task description blank triggers an intentional validation error. This is by design to demonstrate the error-handling UX both inline and in the global banner.

## Application features

### Authentication & session management

- Login and registration handled via React Query mutations and a dedicated `AuthContext`.
- Secure token storage (access token in session storage, refresh token in local storage) with automatic Axios header syncing.
- Protected routes enforced via React Router.

### Task management

- Fetch, create, edit, toggle status, and delete todos scoped to the logged-in user.
- React Hook Form powers the new/edit task forms with Yup validation.
- Inline form errors and contextual error banners provide clear feedback when network issues occur.
- A Chakra-based todo context backed by React Query avoids prop drilling and centralises CRUD error handling.

### UI/UX highlights

- Chakra UI v3 components with a custom design system and responsive layouts for desktop, tablet, and mobile.
- Reusable building blocks: `AppHeader`, `AppButton`, `TodoErrorAlert`, `TaskForm`, etc.
- Internationalization via `react-i18next`; all user-facing copy (including error messages) lives in `src/i18n/en.json`.
- Jest-tested date utility (`getFormattedCurrentDate`) used for the dashboard greeting.

### Reliability

- Local error handling in forms plus a global safe state (see todo context error banner).
- Linting, type-checking, and Prettier configs are ready (`npm run eslint`, `npm run typecheck`, `npm run prettify`).

## File structure overview

- `src/app/queryClient.ts` – Shared React Query client configuration.
- `src/api/` – Axios client plus auth and todo API helpers.
- `src/features/auth/` – Auth context, types, and feature components.
- `src/features/todos/` – Todo context, types, and React Query integrations.
- `src/pages/` – Page-level components (`Home`, `Login`) and UI building blocks.
- `backend/` – Express server with authentication and todo routes.

## Useful links

- [API docs](http://localhost:3001/api/docs) _(requires backend running)_
- [Chakra UI](https://chakra-ui.com/)
- [Jest](https://jestjs.io/)

Enjoy exploring the app! Contributions and feedback are welcome.
