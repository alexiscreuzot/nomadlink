# Nomadlink

Reservation dashboard for the [Happy Hours](https://happyh0urs.com/) coworking space. It reads a public Google Calendar and shows, per month, who reserved a desk and how often.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Google Calendar public iCal feed (read-only, server-side)

## Getting started

```
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

| Variable      | Description                                  |
| ------------- | -------------------------------------------- |
| `CALENDAR_ID` | Google Calendar ID to read reservations from |

The calendar must be publicly shared (“See event details”). No API key is required.

## Deployment

Deployed on [Vercel](https://vercel.com) with zero config (Next.js is auto-detected). Set `CALENDAR_ID` in the project's environment variables, then push to `master`.
