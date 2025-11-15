# Zentask – Todo Application

This project is a full-stack todo application built with **React + TypeScript**, **Chakra UI v3**, and a lightweight **Express/NeDB** backend. It provides secure authentication and a polished task management experience with modern React patterns and React Query for data fetching.

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

- **Modern data fetching**: Uses React Query with custom hooks (`useTodosQuery`, `useTodoMutation`) for efficient data management and caching.
- **Component-level mutations**: Todo CRUD operations (create, update, toggle status, delete) are called directly in components where they're used, reducing prop drilling and improving maintainability.
- **Optimistic updates**: React Query automatically handles cache invalidation and refetching after mutations.
- **Loading states**: Custom skeleton components provide smooth loading experiences with proper initial loading detection.
- React Hook Form powers the new/edit task forms with Yup validation.
- Inline form errors and contextual error banners provide clear feedback when network issues occur.
- Lightweight `TodoContext` manages only editing state and error handling, keeping concerns separated.

### UI/UX highlights

- Chakra UI v3 components with a custom design system and responsive layouts for desktop, tablet, and mobile.
- **Skeleton loading states**: Reusable `TodosListSkeleton` component with modular `HeaderSkeleton` and `TaskSectionSkeleton` for consistent loading UX.
- Reusable building blocks: `AppHeader`, `AppButton`, `TodoErrorAlert`, `TaskForm`, etc.
- Internationalization via `react-i18next`; all user-facing copy (including error messages) lives in `src/i18n/en.json`.
- Jest-tested date utility (`getFormattedCurrentDate`) used for the dashboard greeting.

### Architecture patterns

- **Custom hooks**: 
  - `useTodosQuery` - Encapsulates todo query logic with access token checking
  - `useTodoMutation` - Centralizes mutation logic with automatic cache invalidation
- **Utility functions**: Reusable mutation execution pattern in `src/features/todos/utils/`
- **Component composition**: Data and handlers passed via props, reducing context dependencies
- **Separation of concerns**: Context only manages UI state (editing mode, errors), not data operations

### Reliability

- Local error handling in forms plus a global safe state (see todo context error banner).
- React Query provides built-in retry logic, caching, and background refetching.
- Linting, type-checking, and Prettier configs are ready (`npm run eslint`, `npm run typecheck`, `npm run prettify`).

## File structure overview

```
src/
├── api/                    # Axios client plus auth and todo API helpers
│   ├── authApi.ts
│   ├── httpClient.ts
│   └── todoApi.ts
├── app/
│   └── queryClient.ts      # Shared React Query client configuration
├── features/
│   ├── auth/               # Auth context, types, and feature components
│   │   ├── AuthContext.tsx
│   │   ├── Login.tsx
│   │   └── types.ts
│   └── todos/              # Todo types, hooks, and minimal context
│       ├── TodoContext.tsx # Manages editing state and errors only
│       ├── types.ts
│       ├── useTodosQuery.ts      # Custom hook for todo queries
│       └── utils/
│           └── executeTodoMutation.ts  # useTodoMutation hook
├── pages/
│   ├── Home.tsx            # Main page with routing logic
│   └── components/         # Page-level components and UI building blocks
│       ├── EditTaskForm.tsx
│       ├── NewTaskForm.tsx
│       ├── TodoOverview.tsx
│       ├── TodosList.tsx
│       ├── TodosListSkeleton.tsx  # Loading skeleton components
│       └── ...
└── components/             # Shared UI components
    ├── auth/
    ├── form/
    └── ui/

backend/                    # Express server with authentication and todo routes
├── routes/
├── handlers/
├── validators/
└── utils/
```

### Key architecture decisions

- **React Query integration**: All data fetching and mutations use React Query for caching, background updates, and optimistic UI.
- **Minimal context usage**: `TodoContext` only manages UI state (which todo is being edited), not business logic or data.
- **Custom hooks pattern**: Reusable `useTodosQuery` and `useTodoMutation` hooks encapsulate common query/mutation patterns.
- **Component-level data operations**: Mutations are called directly in components (e.g., `EditTaskForm`, `NewTaskForm`, `TodoMenu`) rather than through context methods.

## Useful links

- [API docs](http://localhost:3001/api/docs) _(requires backend running)_
- [Chakra UI](https://chakra-ui.com/)
- [React Query](https://tanstack.com/query/latest)
- [Jest](https://jestjs.io/)

Enjoy exploring the app! Contributions and feedback are welcome.
