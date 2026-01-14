# Next.js Development Guidelines

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.scss        # Global styles (imports _colors.scss)
│   ├── layout.tsx          # Root layout
│   └── [route]/
│       └── page.tsx        # Server Components only
├── components/             # Reusable React components
│   ├── ui/                 # Base UI components (Button, Input, Card, etc.)
│   ├── layout/             # Layout components (Header, Footer, Sidebar, etc.)
│   └── [feature]/          # Feature-specific components
├── lib/                    # Utilities, helpers, API clients
└── styles/
    └── _colors.scss        # Color theme definitions
```

---

## Page Components (`page.tsx`)

**Server-side code only.** Pages should:

- Fetch data using `async` server components
- Pass data down to client components as props
- Handle metadata exports
- NOT contain interactive UI logic

```tsx
// app/dashboard/page.tsx
import { DashboardView } from '@/components/dashboard/DashboardView';
import { fetchDashboardData } from '@/lib/api';

export default async function DashboardPage() {
  const data = await fetchDashboardData();

  return <DashboardView data={data} />;
}
```

**Do NOT:**
- Use `"use client"` in page.tsx
- Add event handlers or useState/useEffect
- Put complex UI markup directly in pages

---

## Components (`src/components/`)

### Organization

- **Reusability first**: Build small, composable components
- **Co-locate**: Keep component-specific types and utilities alongside the component
- **Export cleanly**: Use index.ts barrel files for cleaner imports

```
components/
├── ui/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.types.ts
│   │   └── index.ts
│   └── index.ts
└── dashboard/
    ├── DashboardView.tsx
    ├── StatsCard.tsx
    └── index.ts
```

### Client Components

Mark interactive components with `"use client"` at the top:

```tsx
"use client";

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)} className="btn-primary">
      Count: {count}
    </button>
  );
}
```

---

## Styling

### TailwindCSS Only

**Allowed:**
- TailwindCSS utility classes
- Custom classes defined via `@apply` in SCSS (sparingly)
- CSS custom properties for theming

**NOT Allowed:**
- Inline `style={{ }}` props
- `<style jsx>` or styled-jsx
- CSS-in-JS libraries (styled-components, emotion, etc.)
- CSS Modules (unless absolutely necessary)

### Color Theme Setup

#### 1. Define colors in `src/styles/_colors.scss`:

```scss
// src/styles/_colors.scss

// Base palette (dark theme)
$color-background: #0a0a0a;
$color-surface: #141414;
$color-surface-elevated: #1f1f1f;

$color-primary: #3b82f6;        // Blue
$color-primary-hover: #2563eb;
$color-primary-muted: #1e40af;

$color-accent: #8b5cf6;         // Purple
$color-accent-hover: #7c3aed;

$color-success: #22c55e;
$color-warning: #f59e0b;
$color-error: #ef4444;

$color-text: #fafafa;
$color-text-muted: #a3a3a3;
$color-text-subtle: #525252;

$color-border: #262626;
$color-border-hover: #404040;
```

#### 2. Import in `src/app/globals.scss`:

```scss
// src/app/globals.scss
@use '../styles/colors' as *;
@import 'tailwindcss';

@theme {
  --color-background: #{$color-background};
  --color-surface: #{$color-surface};
  --color-surface-elevated: #{$color-surface-elevated};

  --color-primary: #{$color-primary};
  --color-primary-hover: #{$color-primary-hover};
  --color-primary-muted: #{$color-primary-muted};

  --color-accent: #{$color-accent};
  --color-accent-hover: #{$color-accent-hover};

  --color-success: #{$color-success};
  --color-warning: #{$color-warning};
  --color-error: #{$color-error};

  --color-text: #{$color-text};
  --color-text-muted: #{$color-text-muted};
  --color-text-subtle: #{$color-text-subtle};

  --color-border: #{$color-border};
  --color-border-hover: #{$color-border-hover};
}

body {
  @apply bg-background text-text;
}
```

#### 3. Usage in components:

```tsx
// Use Tailwind classes with custom colors
<div className="bg-surface border border-border rounded-lg p-4">
  <h2 className="text-text">Title</h2>
  <p className="text-text-muted">Description</p>
  <button className="bg-primary hover:bg-primary-hover text-white">
    Action
  </button>
</div>
```

### Color Naming Convention

| Name | Purpose |
|------|---------|
| `background` | Page background |
| `surface` | Card/container backgrounds |
| `surface-elevated` | Modals, dropdowns, elevated surfaces |
| `primary` | Primary actions, links |
| `accent` | Secondary emphasis, highlights |
| `success` | Success states |
| `warning` | Warning states |
| `error` | Error states |
| `text` | Primary text |
| `text-muted` | Secondary text |
| `text-subtle` | Disabled/placeholder text |
| `border` | Default borders |

---

## Responsive Design

**Every component and page must be responsive.**

### Breakpoint Strategy

Use Tailwind's mobile-first approach:

```tsx
// Mobile first, then scale up
<div className="
  p-4 md:p-6 lg:p-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
">
  {/* content */}
</div>
```

### Standard Breakpoints

| Prefix | Min Width | Use Case |
|--------|-----------|----------|
| (none) | 0px | Mobile phones |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

### Responsive Patterns

```tsx
// Navigation: hamburger on mobile, full nav on desktop
<nav className="flex items-center justify-between">
  <Logo />
  <MobileMenu className="md:hidden" />
  <DesktopNav className="hidden md:flex" />
</nav>

// Content: stack on mobile, side-by-side on desktop
<div className="flex flex-col md:flex-row gap-6">
  <aside className="w-full md:w-64 shrink-0">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>

// Text: responsive sizing
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Heading
</h1>
```

---

## Dark Theme

The application uses a **dark theme by default**. All color definitions assume dark mode.

### Guidelines

- Use `background` for page backgrounds
- Use `surface` for cards and containers
- Use `surface-elevated` for overlays and modals
- Ensure sufficient contrast (WCAG AA minimum)
- Text colors: `text` for primary, `text-muted` for secondary

---

## Component Checklist

Before marking a component complete:

- [ ] Uses TailwindCSS classes only (no inline styles)
- [ ] Uses theme colors (`bg-surface`, `text-primary`, etc.)
- [ ] Responsive on mobile, tablet, and desktop
- [ ] Accessible (proper semantic HTML, ARIA when needed)
- [ ] Reusable with props for customization
- [ ] TypeScript types defined for all props
