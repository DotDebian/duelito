# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Duelito is a 1:1 clone of duel.com, a casino/gaming platform. Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Architecture

### Layout Structure
- **Header** (`app/components/Header.tsx`) - Sticky top navigation with logo, Originals dropdown, and auth buttons
- **Sidebar** (`app/components/Sidebar.tsx`) - Fixed left chat panel (320px), collapsible, fetches from `/api/chat`
- **Main content** - Right side with `lg:ml-80` margin to accommodate sidebar

### Data Flow
- Mock data in `lib/mock-data.ts` serves as the data source
- API routes (`app/api/`) return mock data as JSON
- Components fetch from API routes client-side

### Type Definitions
All shared types are in `types/index.ts`:
- `Game` - originals/casino games with slug, rtp, image, provider
- `ChatMessage` - chat with username, message, timestamp, mod status
- `OnlineStats` - online count and announcement

### Styling System
Custom Tailwind theme in `tailwind.config.ts` defines:
- **Colors**: `dark-*`, `light-*`, `blue-*`, `green-*`, `red-*`, `gold-*`, `silver-*`, `bronze-*`, `purple-*`, `yellow-*`
- **Typography**: Heading (`h-xs` to `h-xxxl`) and body (`b-xs` to `b-lg`) size classes
- **Spacing/radius**: Custom pixel values (`8`, `12`, `16`, `24`, `32`, `64`)

CSS variables in `globals.css`:
- `--navbar-height: 80px`
- `--sidebar-width: 320px`

**When copying HTML from duel.com:**
- `size-X` is an alias for `w-X h-X` (sets both width and height)
- `w-X` values from duel.com should be applied as-is (e.g., `w-16` stays `w-16`, not `w-4`)

### Image Handling
- Local game images in `public/images/games/`
- Remote images allowed from `luckmedia.link` (configured in `next.config.ts`)
- **All resources from duel.com must be downloaded locally** to `public/images/` - never reference duel.com URLs directly

### Component Patterns
- Components use `'use client'` directive when needing React hooks
- Barrel exports from `app/components/index.ts`
- Inline SVG icons throughout (no icon library)
