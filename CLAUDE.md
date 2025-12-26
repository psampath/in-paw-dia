# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm i

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development (with sourcemaps)
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm preview
```

## Project Overview

This is a pet breed encyclopedia application ("in-paw-dia") built with React, TypeScript, Vite, and Supabase. The app allows users to browse pet breeds (dogs, cats, etc.) and provides an admin interface for managing breed data.

**Tech Stack:**
- Vite + React + TypeScript
- shadcn/ui components (based on Radix UI)
- Tailwind CSS for styling
- Supabase for backend (authentication + database)
- TanStack Query for data fetching
- React Router for navigation
- React Hook Form + Zod for forms

## Architecture

### Routing Structure

All routes are defined in `src/App.tsx`:
- `/` - Home page
- `/breeds` - Browse all breeds
- `/breeds/:id` - Individual breed profile
- `/auth` - Authentication (sign in/sign up)
- `/admin` - Admin dashboard (protected)
- `/admin/breed/:id` - Edit breed form (protected)

**Important:** Add all custom routes ABOVE the catch-all `*` route in App.tsx.

### Authentication & Authorization

Authentication is managed via `AuthContext` (`src/contexts/AuthContext.tsx`):
- Uses Supabase Auth with email/password
- Role-based access control with three roles: `admin`, `editor`, `viewer`
- User roles are stored in `user_roles` table and fetched on auth state change
- The context provides: `user`, `session`, `userRole`, `loading`, `signIn`, `signUp`, `signOut`
- Use the `useAuth()` hook to access auth state in components

### Supabase Integration

Supabase client is configured in `src/integrations/supabase/client.ts`:
- Requires environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- Database schema types are auto-generated in `src/integrations/supabase/types.ts`
- Main tables: `pets`, `species`, `profiles`, `user_roles`
- Import the client: `import { supabase } from "@/integrations/supabase/client"`

### Data Model

The `pets` table stores breed information with fields:
- Basic info: `name`, `type`, `slug`, `species_id`
- Details: `origin`, `size`, `weight_range`, `lifespan`, `temperament`
- Content: `physical_appearance`, `care_requirements`, `health_issues`, `suitability`
- Metadata: `traits` (JSON), `photos` (array), `is_featured`, `popularity_score`

### Component Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (auto-generated, don't manually edit)
│   ├── BreedCard.tsx    # Display breed cards
│   ├── PetCard.tsx      # Display pet cards
│   ├── Navigation.tsx   # Main navigation component
│   └── Logo.tsx         # App logo
├── pages/               # Page-level components
│   ├── Home.tsx
│   ├── Breeds.tsx
│   ├── BreedProfile.tsx
│   ├── Auth.tsx
│   ├── Admin.tsx
│   └── AdminBreedForm.tsx
├── contexts/
│   └── AuthContext.tsx  # Authentication context & provider
├── hooks/
│   ├── use-mobile.tsx   # Mobile detection hook
│   └── use-toast.ts     # Toast notifications hook
├── integrations/
│   └── supabase/        # Supabase client & types
├── lib/
│   └── utils.ts         # Utility functions (cn for class merging)
├── App.tsx              # Root component with routes
└── main.tsx             # Entry point
```

### Styling

- Uses Tailwind CSS with custom theme configuration in `tailwind.config.ts`
- Custom fonts: Inter (sans), Lora (headings)
- CSS variables for theming (defined in `src/index.css`)
- Dark mode support via `class` strategy
- Use the `cn()` utility from `@/lib/utils` to merge Tailwind classes

### Path Aliases

TypeScript is configured with `@/*` path alias mapping to `./src/*`:
```typescript
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
```

### UI Components

All UI components are from shadcn/ui and located in `src/components/ui/`:
- These are based on Radix UI primitives
- Styled with Tailwind CSS
- Do not manually edit these files - regenerate using shadcn CLI if needed
- Components include: Button, Card, Dialog, Form, Input, Select, Toast, etc.

### State Management

- TanStack Query for server state (data fetching, caching, mutations)
- React Context for global state (AuthContext)
- Local component state with useState/useReducer

### Form Handling

Forms use React Hook Form with Zod validation:
- Form components from shadcn/ui (`src/components/ui/form.tsx`)
- Zod schemas for validation
- `@hookform/resolvers` for Zod integration

## Important Notes

- This is a Lovable-generated project - changes can be synced via Lovable platform
- Dev server runs on port 8080 (configured in vite.config.ts)
- TypeScript strict mode is partially disabled (noImplicitAny, strictNullChecks, etc.)
- Uses SWC for faster compilation via @vitejs/plugin-react-swc
- Environment variables must be prefixed with `VITE_` to be exposed to client
