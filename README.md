# LMS Portal (Next.js 14 + Prisma + MySQL)

Production-ready LMS using Next.js App Router, serverless API routes, Prisma/MySQL, JWT auth (access+refresh in HTTP-only cookies), Zustand state, and YouTube embedded lessons.

## Tech Stack

- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: Next.js Route Handlers in `app/api`
- Database: MySQL + Prisma ORM
- Auth: JWT access token (15m) + refresh token (DB-backed)
- State: Zustand
- Deployment: Vercel

## Environment Variables

Copy `.env.example` to `.env` and update:

- `DATABASE_URL=`
- `JWT_SECRET=`
- `NEXT_PUBLIC_BASE_URL=`

## Install and Run

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Open `http://localhost:3000`.

## Build Verification

```bash
npm run build
```

## API Routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Subjects
- `GET /api/subjects`
- `GET /api/subjects/[id]`
- `GET /api/subjects/[id]/tree`
- `POST /api/subjects/[id]/enroll` (enrollment helper)
- `GET /api/subjects/[id]/first-video`

### Videos
- `GET /api/videos/[id]`

### Progress
- `GET /api/progress/subjects/[id]`
- `GET /api/progress/videos/[id]`
- `POST /api/progress/videos/[id]`

### Health
- `GET /api/health`

## Deployment on Vercel

1. Push this project to GitHub.
2. Import repo in Vercel.
3. Add env vars in Vercel project settings.
4. Set build command: `npm run build`.
5. Deploy.

No custom server is used; all backend logic is in `app/api` and is Vercel-compatible.
