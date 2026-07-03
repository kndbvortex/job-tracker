# job-tracker

A Next.js app for tracking job applications, built with shadcn/ui, Drizzle ORM, and Supabase (Postgres + auth).

## Adding components

```bash
pnpm dlx shadcn@latest add button
```

Components are placed in `components/ui`.

## Using components

```tsx
import { Button } from "@/components/ui/button"
```

## Database

`DATABASE_URL` and Supabase keys live in `.env` at the repo root.

```bash
pnpm db:push      # push the Drizzle schema to Supabase
pnpm db:generate  # generate a migration
pnpm db:studio    # open Drizzle Studio
```
